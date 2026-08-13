import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { db } from "./src/lib/firebase";
import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const getAI = () => new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });


  // --- MCP API Authentication Middleware ---
  const mcpAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['mo-x-api-key'] || req.headers['x-api-key'];
    if (!apiKey) {
      res.status(401).json({ error: 'Unauthorized: Missing mo-x-api-key header' });
      return;
    }
    
    // Master override for legacy/dev
    const masterKey = process.env.MOX_MCP_API_KEY || 'mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz';
    if (apiKey === masterKey) {
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
        "/api/mcp/leads/{id}/activity": {
          post: {
            operationId: "addLeadActivity",
            summary: "Log an activity for a lead",
            parameters: [
              { name: "id", in: "path", required: true, schema: { type: "string" }, description: "The ID of the lead" }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      type: { type: "string" },
                      subject: { type: "string" },
                      body: { type: "string" },
                      sentAt: { type: "string" },
                      status: { type: "string" }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Activity logged successfully",
                content: { "application/json": { schema: { type: "object" } } }
              }
            }
          }
        },
        "/api/mcp/stats": {
          get: {
            operationId: "getStats",
            summary: "Get CRM pipeline stats",
            responses: {
              "200": {
                description: "Pipeline stats",
                content: { "application/json": { schema: { type: "object" } } }
              }
            }
          }
        },

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

        "/api/mcp/prototypes": {
          post: {
            operationId: "uploadPrototype",
            summary: "Upload raw HTML/CSS prototype generated by the agent and return a live public preview link",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["htmlCode"],
                    properties: {
                      leadId: { type: "string", description: "Optional ID of the lead to associate the prototype with" },
                      clientName: { type: "string", description: "Name of the client/prospect" },
                      htmlCode: { type: "string", description: "Raw HTML code for the prototype" },
                      cssCode: { type: "string", description: "Optional raw CSS code" },
                      metadata: { type: "object", description: "Optional metadata (e.g., industry, theme colors)" }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Successfully uploaded prototype and generated live link",
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
                    required: ["leadId"],
                    properties: {
                      leadId: { type: "string", description: "The ID of the lead to associate the prototype with" },
                      prototypeType: { type: "string", description: "The type of prototype to generate: 'WEB', 'GRAPHIC', 'SVG', or 'CONTENT' (defaults to 'WEB')" },
                      description: { type: "string", description: "A description of what the prototype should contain (e.g., custom sections, specific themes)" },
                      businessContext: { type: "string", description: "Optional override/enrichment about the lead's business context to customize the pitch" }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                "description": "Generated live preview link and content",
                "content": { "application/json": { schema: { type: "object" } } }
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
      const { name, industry, city, email, phone, website, score, insights, logo, tagline, colors, reviews } = req.body;
      
      const leadData = {
        name: name || '',
        industry: industry || '',
        city: city || '',
        email: email || '',
        phone: phone || '',
        website: website || '',
        score: score || 0,
        insights: insights || '',
        logo: logo || '',
        tagline: tagline || '',
        colors: colors || [],
        reviews: reviews || [],
        status: 'New',
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'leads'), leadData);
      
      res.json({ success: true, id: docRef.id, lead: { id: docRef.id, ...leadData } });
    } catch (error) {
      console.error('Error adding lead via MCP:', error);
      res.status(500).json({ error: 'Failed to add lead' });
    }
  });

  // 2c. Update an existing Lead
  app.patch("/api/mcp/leads/:id", mcpAuth, async (req, res) => {
    try {
      const leadId = req.params.id;
      const updates = req.body;
      
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, updates);
      
      res.json({ success: true, id: leadId, message: 'Lead updated successfully' });
    } catch (error) {
      console.error('Error updating lead via MCP:', error);
      res.status(500).json({ error: 'Failed to update lead' });
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
      
      const ai = getAI();
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


  // --- Phase 1 & 2: Public Prototypes ---
  // API Endpoint to publish prototype directly to messages collection
  app.post("/api/mcp/publish-prototype", mcpAuth, async (req, res) => {
    try {
      const { content, title, leadId, canvasMode = 'WEB', status = 'published' } = req.body;
      const contentToUse = content || req.body.htmlContent; // fallback for backwards compatibility
      
      if (!contentToUse) {
        return res.status(400).json({ error: 'Missing required field: content' });
      }

      // Clean markdown code blocks from content
      const cleanedContent = contentToUse.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();

      const finalCanvasMode = canvasMode.toUpperCase();

      const messageData = {
        canvasContent: cleanedContent,
        canvasMode: finalCanvasMode,
        title: title || 'Live Prototype',
        status: status,
        isAiGenerated: true,
        leadId: leadId || null,
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, 'messages'), messageData);
      const docId = docRef.id;
      const host = req.headers.host || 'mox.infni-t.online';
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
      const previewUrl = `${baseUrl}/preview/${docId}`;

      if (leadId) {
        try {
          const leadRef = doc(db, 'leads', leadId);
          await updateDoc(leadRef, { prototypeId: docId, previewUrl });
        } catch (e) {
          console.error(`Failed to update lead ${leadId} with prototypeId:`, e);
        }
      }

      res.json({ success: true, previewUrl, id: docId, title: messageData.title, canvasMode: finalCanvasMode, status });
    } catch (error) {
      console.error('Error publishing prototype via MCP:', error);
      res.status(500).json({ error: 'Failed to publish prototype' });
    }
  });

  // API Endpoint to save custom prototypes
  app.post("/api/mcp/prototypes", mcpAuth, async (req, res) => {
    try {
      const { leadId, clientName, htmlCode, cssCode, metadata } = req.body;
      
      if (!htmlCode) {
        return res.status(400).json({ error: 'Missing required field: htmlCode' });
      }

      const prototypeData = {
        leadId: leadId || null,
        clientName: clientName || 'Unknown Client',
        htmlCode,
        cssCode: cssCode || '',
        metadata: metadata || {},
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'prototypes'), prototypeData);
      const prototypeId = docRef.id;
      
      // The public shareable URL
      const host = req.headers.host || 'mox.infni-t.online';
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const prototypeUrl = `${protocol}://${host}/preview/${prototypeId}`;

      // Update lead record if leadId was provided
      if (leadId) {
        try {
          const leadRef = doc(db, 'leads', leadId);
          await updateDoc(leadRef, { prototypeUrl });
        } catch (e) {
          console.error(`Failed to update lead ${leadId} with prototypeUrl:`, e);
          // Non-fatal, continue
        }
      }

      res.json({ success: true, prototypeId, prototypeUrl, message: 'Prototype uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading prototype via MCP:', error);
      res.status(500).json({ error: 'Failed to upload prototype' });
    }
  });

  // Public Renderer Route
  app.get("/preview/:prototypeId", async (req, res) => {
    try {
      const { prototypeId } = req.params;
      const docRef = doc(db, 'prototypes', prototypeId);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        return res.status(404).send('<h1>404 - Prototype Not Found</h1><p>The requested prototype does not exist or has been removed.</p>');
      }
      
      const data = snapshot.data();
      const htmlCode = data.htmlCode || '';
      const cssCode = data.cssCode || '';
      const clientName = data.clientName || 'Live Prototype';

      // Construct a clean HTML document wrapping the custom code
      const responseHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${clientName} - MO-X Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      /* Inject custom CSS */
      ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    
    <!-- Optional: Floating MO-X Watermark / Lead Capture button could go here -->
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
        <a href="https://mox.infni-t.online/" target="_blank" style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-family: sans-serif; font-size: 12px; border: 1px solid rgba(255,255,255,0.2);">
            Powered by <b>MO-X</b>
        </a>
    </div>
</body>
</html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      res.send(responseHtml);
    } catch (error) {
      console.error('Error rendering public prototype:', error);
      res.status(500).send('<h1>500 - Internal Server Error</h1><p>Failed to load the prototype.</p>');
    }
  });

  // 4. Generate Prototype Preview
  app.post("/api/mcp/generate-preview", mcpAuth, async (req, res) => {
    try {
      const { leadId, prototypeType, description, businessContext } = req.body;
      
      if (!leadId) {
        return res.status(400).json({ error: 'Missing required field: leadId' });
      }

      // Default prototypeType to 'WEB' if not specified
      const finalPrototypeType = prototypeType || 'WEB';

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

      // Combine database lead data with optional direct business context
      let combinedBusinessContext = leadContext;
      if (businessContext) {
        combinedBusinessContext += `\nAdditional/Override Business Context: ${businessContext}`;
      }

      // Use description or default to standard instructions
      const finalDescription = description || `A high-converting personalized pitch/prototype tailored for ${leadData.company || 'the business'} in the ${leadData.industry || 'general'} industry.`;

      if (!process.env.GEMINI_API_KEY) {
         return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const modeInstruction = finalPrototypeType === 'WEB' ? 'React component using Tailwind CSS. Wrap the code in <canvas_web>...</canvas_web> tags.' :
                              finalPrototypeType === 'GRAPHIC' ? 'HTML graphic/banner. Wrap the code in <canvas_graphic>...</canvas_graphic> tags.' :
                              finalPrototypeType === 'SVG' ? 'SVG illustration. Wrap the code in <canvas_svg>...</canvas_svg> tags.' :
                              finalPrototypeType === 'CONTENT' ? 'Markdown content block. Wrap the content in <canvas_content>...</canvas_content> tags.' :
                              'React component using Tailwind CSS. Wrap the code in <canvas_web>...</canvas_web> tags.';

      const prompt = `Generate a ${finalPrototypeType} prototype for this lead.
      Lead Data & Business Context: ${combinedBusinessContext}
      Description/Requirements: ${finalDescription}
      
      You must return ONLY the requested format: ${modeInstruction} Do not include any other markdown formatting or explanation outside the tags.`;

      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const content = response.text || '';

      // Parse the generated response to extract canvasContent and canvasMode
      let text = content;
      let canvasContent = null;
      let canvasMode = finalPrototypeType;

      const webMatch = content.match(/<canvas_web>([\s\S]*?)<\/canvas_web>/);
      if (webMatch) {
        canvasContent = webMatch[1].trim();
        canvasMode = 'WEB';
        text = text.replace(webMatch[0], '').trim();
      }

      const graphicMatch = content.match(/<canvas_graphic>([\s\S]*?)<\/canvas_graphic>/);
      if (graphicMatch) {
        canvasContent = graphicMatch[1].trim();
        canvasMode = 'GRAPHIC';
        text = text.replace(graphicMatch[0], '').trim();
      }

      const svgMatch = content.match(/<canvas_svg>([\s\S]*?)<\/canvas_svg>/);
      if (svgMatch) {
        canvasContent = svgMatch[1].trim();
        canvasMode = 'SVG';
        text = text.replace(svgMatch[0], '').trim();
      }

      const contentMatch = content.match(/<canvas_content>([\s\S]*?)<\/canvas_content>/);
      if (contentMatch) {
        canvasContent = contentMatch[1].trim();
        canvasMode = 'CONTENT';
        text = text.replace(contentMatch[0], '').trim();
      }

      // If no tag is matched, clean up any markdown block formatting and treat it as the pure canvas content
      if (!canvasContent) {
        canvasContent = content.replace(/^```[a-z]*/i, '').replace(/```$/i, '').trim();
      }

      // Find or create an active chat session for this lead so it shows up in the UI
      let sessionId = 'automated-outreach-session';
      try {
        const sessionsRef = collection(db, 'sessions');
        const sessionQuery = query(
          sessionsRef,
          where('leadId', '==', leadId),
          where('userId', '==', leadData.userId || ''),
          limit(10)
        );
        const sessionSnap = await getDocs(sessionQuery);
        if (!sessionSnap.empty) {
          const sortedSessions = sessionSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          sortedSessions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          sessionId = sortedSessions[0].id;
        } else {
          const sessionDoc = await addDoc(collection(db, 'sessions'), {
            leadId,
            name: 'Agent Generated Pitch',
            createdAt: Date.now(),
            userId: leadData.userId || 'automated-agent'
          });
          sessionId = sessionDoc.id;
        }
      } catch (sessionErr) {
        console.error('Error finding or creating session for preview:', sessionErr);
      }

      // Save the generated prototype to the messages collection so the PitchView and Canvas components render it instantly
      const messageDoc = {
        role: 'model',
        text: text || `Generated custom ${canvasMode.toLowerCase()} prototype.`,
        canvasContent: canvasContent,
        canvasMode: canvasMode,
        leadId: leadId,
        sessionId: sessionId,
        userId: leadData.userId || 'automated-agent',
        createdAt: Date.now()
      };
      
      const docRef = await addDoc(collection(db, 'messages'), messageDoc);

      // Update the lead to show prototype was built and associate it with the created message ID
      await updateDoc(leadRef, {
        status: 'Built',
        prototypeId: docRef.id,
        updatedAt: new Date().toISOString()
      });

      // Generate the premium, live preview link referencing the newly saved document ID
      const hostUrl = `${req.protocol}://${req.get('host')}`;
      const previewLink = `${hostUrl}/preview/${docRef.id}`;

      res.json({ 
        success: true, 
        message: 'Prototype generated and saved successfully',
        previewId: docRef.id,
        previewLink,
        content: canvasContent,
        prototypeType: canvasMode,
        sessionId
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

      const ai = getAI();
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


  // 6. DELETE /api/mcp/leads/:id
  app.delete("/api/mcp/leads/:id", mcpAuth, async (req, res) => {
    try {
      const leadRef = doc(db, 'leads', req.params.id);
      await deleteDoc(leadRef);
      res.json({ success: true, message: "Lead deleted" });
    } catch (error) {
      console.error('Error deleting lead via MCP:', error);
      res.status(500).json({ error: 'Failed to delete lead' });
    }
  });

  // 7. POST /api/mcp/leads/:id/activity
  app.post("/api/mcp/leads/:id/activity", mcpAuth, async (req, res) => {
    try {
      const { type, subject, body, sentAt, status } = req.body;
      const leadRef = doc(db, 'leads', req.params.id);
      
      await updateDoc(leadRef, {
        activities: arrayUnion({
          type: type || "email_sent",
          subject: subject || "",
          body: body || "",
          sentAt: sentAt || new Date().toISOString(),
          status: status || "sent"
        }),
        status: "Outreach Sent"
      });
      
      res.json({ success: true, message: "Activity logged and status updated" });
    } catch (error) {
      console.error('Error logging activity via MCP:', error);
      res.status(500).json({ error: 'Failed to log activity' });
    }
  });

  // 8. GET /api/mcp/stats
  app.get("/api/mcp/stats", mcpAuth, async (req, res) => {
    try {
      const leadsQuery = collection(db, 'leads');
      const snapshot = await getDocs(leadsQuery);
      
      let totalLeads = 0;
      let totalScore = 0;
      const statusBreakdown: Record<string, number> = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        totalLeads++;
        totalScore += (data.score || 0);
        
        const status = data.status || 'New';
        statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
      });
      
      const avgScore = totalLeads > 0 ? Math.round(totalScore / totalLeads) : 0;
      
      res.json({ success: true, stats: { totalLeads, statusBreakdown, avgScore } });
    } catch (error) {
      console.error('Error fetching stats via MCP:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
