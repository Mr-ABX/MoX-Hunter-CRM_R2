import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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

  // API Routes
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
