import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { db } from "./src/lib/firebase";
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize Gemini client with proper user agent header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // --- MCP API Authentication Middleware ---
  const mcpAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['mo-x-api-key'];
    if (!apiKey || apiKey !== process.env.MOX_MCP_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing mo-x-api-key header' });
    }
    next();
  };

  // --- MCP API Routes ---
  
  // 1. Fetch Leads
  app.get("/api/mcp/leads", mcpAuth, async (req, res) => {
    try {
      const { industry, minScore } = req.query;
      
      let leadsQuery: any = collection(db, 'leads');
      
      if (industry && typeof industry === 'string') {
        leadsQuery = query(leadsQuery, where('industry', '==', industry));
      }
      if (minScore && typeof minScore === 'string') {
        leadsQuery = query(leadsQuery, where('score', '>=', Number(minScore)));
      }
      
      // Limit to 50 for performance
      leadsQuery = query(leadsQuery, limit(50));
      
      const snapshot = await getDocs(leadsQuery);
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      res.json({ success: true, count: leads.length, leads });
    } catch (error) {
      console.error('Error fetching leads via MCP:', error);
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });

  // 2. Fetch Single Lead
  app.get("/api/mcp/leads/:id", mcpAuth, async (req, res) => {
    try {
      const leadRef = doc(db, 'leads', req.params.id);
      const snapshot = await getDoc(leadRef);
      
      if (!snapshot.exists()) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      res.json({ success: true, lead: { id: snapshot.id, ...snapshot.data() } });
    } catch (error) {
      console.error('Error fetching single lead via MCP:', error);
      res.status(500).json({ error: 'Failed to fetch lead' });
    }
  });

  // 3. Process Outreach
  app.post("/api/mcp/outreach", mcpAuth, async (req, res) => {
    try {
      const { leadId, angle } = req.body;
      
      if (!leadId || !angle) {
        return res.status(400).json({ error: 'Missing leadId or angle in request body' });
      }

      // Fetch the lead to give the AI context
      const leadRef = doc(db, 'leads', leadId);
      const snapshot = await getDoc(leadRef);
      let leadContext = "";
      if (snapshot.exists()) {
        leadContext = JSON.stringify(snapshot.data());
      }
      
      if (!process.env.GEMINI_API_KEY) {
         return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      // Draft the email based on the angle and lead data
      const prompt = `Draft a cold outreach email for a lead. 
      Lead Data: ${leadContext}
      Outreach Angle/Strategy: ${angle}
      
      Make it professional, concise, and compelling. Return only the email subject and body.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ 
        success: true, 
        message: 'Outreach drafted successfully',
        draft: response.text, 
        leadId, 
        angle 
      });
    } catch (error) {
      console.error('Error processing outreach via MCP:', error);
      res.status(500).json({ error: 'Failed to process outreach' });
    }
  });

  // --- Regular API Routes ---

  app.post("/api/voice/process", async (req, res) => {
    try {
      const { transcript, currentView } = req.body;
      if (!transcript || !transcript.trim()) {
        return res.status(400).json({ error: 'Transcript is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in .env' });
      }

      const prompt = `Reorganize, clean up, and format the following raw voice transcription into a highly professional, well-structured Markdown note. 
The user is currently working on the "${currentView || 'general'}" section of their CRM workspace, so keep the context relevant if appropriate.

Raw transcription:
"${transcript}"

Requirements:
1. Fix any grammar, punctuation, and audio-to-text typos.
2. Structure the note with clear hierarchical headings (using ## and ###).
3. If any actionable tasks, follow-ups, or todo items are mentioned, extract and organize them as standard Markdown checklists (e.g., "- [ ] task name").
4. Maintain a clean, concise, and professional tone. Return ONLY the Markdown note content without any extra conversational filler outside of the Markdown itself.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const formattedMarkdown = response.text || `## Voice Note\n\n${transcript}`;
      return res.json({ success: true, formattedMarkdown });
    } catch (error) {
      console.error('Error in voice processing route:', error);
      return res.status(500).json({ error: 'Internal Server Error', details: String(error) });
    }
  });

  app.post("/api/email/send", async (req, res) => {
    try {
      const { to, subject, htmlContent, senderName, senderEmail } = req.body;

      if (!process.env.BREVO_API_KEY) {
        return res.status(500).json({ error: 'BREVO_API_KEY is not configured in .env' });
      }

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: senderName || "MoX Hunter Agent",
            email: senderEmail || "agent@moxhunter.com"
          },
          to: [
            { email: to }
          ],
          subject: subject || 'Outreach Update',
          htmlContent: htmlContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Brevo API Error:', errorData);
        return res.status(response.status).json({ error: 'Failed to send email', details: errorData });
      }

      const data = await response.json();
      return res.json({ success: true, data });
    } catch (error) {
      console.error('Error in email sending route:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
