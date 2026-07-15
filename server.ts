import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { db } from "./src/lib/firebase";
import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

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
  const mcpAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['mo-x-api-key'];
    if (!apiKey) {
      res.status(401).json({ error: 'Unauthorized: Missing mo-x-api-key header' });
      return;
    }
    
    // Master override for legacy/dev
    if (apiKey === process.env.MOX_MCP_API_KEY) {
      next();
      return;
    }

    try {
      const keysRef = collection(db, 'mcp_keys');
      const q = query(keysRef, where('key', '==', apiKey), where('active', '==', true), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        next();
        return;
      }
    } catch (e) {
      console.error('API Key Auth error:', e);
    }
    
    res.status(401).json({ error: 'Unauthorized: Invalid mo-x-api-key' });
  };

  // --- MCP OpenAPI Spec ---
  app.get("/api/openapi.json", (req, res) => {
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
      openapi: "3.1.0",
      info: {
        title: "MoX Hunter AI Agent API",
        version: "1.0.0",
        description: "API for external AI agents to fetch leads and draft outreach."
      },
      servers: [{ url: serverUrl }],
      paths: {
        "/api/mcp/leads": {
          get: {
            operationId: "getLeads",
            summary: "Fetch a list of leads",
            parameters: [
              { name: "industry", in: "query", schema: { type: "string" }, description: "Filter by industry" },
              { name: "minScore", in: "query", schema: { type: "integer" }, description: "Filter by minimum lead score" }
            ],
            responses: {
              "200": {
                description: "List of leads",
                content: { "application/json": { schema: { type: "object" } } }
              }
            }
          },
          post: {
            operationId: "addLead",
            summary: "Add a new lead to the CRM",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["company", "email", "industry", "score"],
                    properties: {
                      company: { type: "string" },
                      website: { type: "string" },
                      contactPerson: { type: "string" },
                      email: { type: "string" },
                      phone: { type: "string" },
                      industry: { type: "string" },
                      score: { type: "integer" },
                      painPoints: { type: "array", items: { type: "string" } },
                      techStack: { type: "array", items: { type: "string" } },
                      notes: { type: "string" },
                      status: { type: "string", description: "e.g. 'New', 'Contacted', 'Built', 'Lost'" }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Successfully added the lead",
                content: { "application/json": { schema: { type: "object" } } }
              }
            }
          }
        },
        "/api/mcp/leads/{id}": {
          get: {
            operationId: "getLeadById",
            summary: "Fetch a single lead by ID",
            parameters: [
              { name: "id", in: "path", required: true, schema: { type: "string" }, description: "The ID of the lead" }
            ],
            responses: {
              "200": {
                description: "Single lead details",
                content: { "application/json": { schema: { type: "object" } } }
              }
            }
          }
        },
        "/api/mcp/outreach": {
          post: {
            operationId: "draftOutreach",
            summary: "Draft an outreach email for a lead",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["leadId", "angle"],
                    properties: {
                      leadId: { type: "string", description: "The ID of the lead to draft an email for" },
                      angle: { type: "string", description: "The angle or strategy to use in the email (e.g. 'direct pitch', 'soft value-add')" }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Generated draft",
                content: { "application/json": { schema: { type: "object" } } }
              }
            }
          }
        },
        "/api/mcp/generate-preview": {
          post: {
            operationId: "generatePreview",
            summary: "Generate a custom prototype (web, graphic, or content) and return a live preview link",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["leadId", "prototypeType", "description"],
                    properties: {
                      leadId: { type: "string", description: "The ID of the lead to associate the prototype with" },
                      prototypeType: { type: "string", description: "The type of prototype to generate: 'WEB', 'GRAPHIC', 'SVG', or 'CONTENT'" },
                      description: { type: "string", description: "A description of what the prototype should contain" }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Generated live preview link and content",
                content: { "application/json": { schema: { type: "object" } } }
              }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "mo-x-api-key"
          }
        }
      },
      security: [{ ApiKeyAuth: [] }]
    });
  });

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
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      
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

  // 2b. Add a new Lead
  app.post("/api/mcp/leads", mcpAuth, async (req, res) => {
    try {
      const newLeadData = req.body;
      
      if (!newLeadData.company || !newLeadData.email || !newLeadData.industry) {
        return res.status(400).json({ error: 'Missing required fields: company, email, industry' });
      }

      const leadWithDefaults = {
        website: '',
        contactPerson: '',
        phone: '',
        score: 50,
        painPoints: [],
        techStack: [],
        notes: '',
        status: 'New',
        ...newLeadData,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'leads'), leadWithDefaults);
      
      res.json({ success: true, lead: { id: docRef.id, ...leadWithDefaults } });
    } catch (error) {
      console.error('Error adding lead via MCP:', error);
      res.status(500).json({ error: 'Failed to add lead' });
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

  // 4. Generate Prototype Preview
  app.post("/api/mcp/generate-preview", mcpAuth, async (req, res) => {
    try {
      const { leadId, prototypeType, description } = req.body;
      
      if (!leadId || !prototypeType || !description) {
        return res.status(400).json({ error: 'Missing required fields: leadId, prototypeType, description' });
      }

      // Fetch the lead context
      const leadRef = doc(db, 'leads', leadId);
      const snapshot = await getDoc(leadRef);
      let leadContext = "";
      let leadData: any = {};
      
      if (snapshot.exists()) {
        leadData = snapshot.data();
        leadContext = JSON.stringify(leadData);
      } else {
        return res.status(404).json({ error: 'Lead not found' });
      }

      if (!process.env.GEMINI_API_KEY) {
         return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const modeInstruction = prototypeType === 'WEB' ? 'React component using Tailwind CSS. Wrap the code in <canvas_web>...</canvas_web> tags.' :
                              prototypeType === 'GRAPHIC' ? 'HTML graphic/banner. Wrap the code in <canvas_graphic>...</canvas_graphic> tags.' :
                              prototypeType === 'SVG' ? 'SVG illustration. Wrap the code in <canvas_svg>...</canvas_svg> tags.' :
                              prototypeType === 'CONTENT' ? 'Markdown content block. Wrap the content in <canvas_content>...</canvas_content> tags.' :
                              'React component using Tailwind CSS. Wrap the code in <canvas_web>...</canvas_web> tags.';

      const prompt = `Generate a ${prototypeType} prototype for this lead.
      Lead Data: ${leadContext}
      Description/Requirements: ${description}
      
      You must return ONLY the requested format: ${modeInstruction} Do not include any other markdown formatting or explanation outside the tags.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const content = response.text || '';
      
      // Update the lead to show prototype was built
      await updateDoc(leadRef, {
        status: 'Built',
        prototypeId: `proto_${Date.now()}`,
        updatedAt: new Date().toISOString()
      });

      // Generate a mock live preview link
      const previewLink = `https://moxhunter.com/preview/${leadId}/${prototypeType.toLowerCase()}`;

      res.json({ 
        success: true, 
        message: 'Prototype generated successfully',
        previewLink,
        content,
        prototypeType
      });
    } catch (error) {
      console.error('Error generating prototype via MCP:', error);
      res.status(500).json({ error: 'Failed to generate prototype' });
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
