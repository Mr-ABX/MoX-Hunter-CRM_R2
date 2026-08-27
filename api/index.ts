import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { db } from "../src/lib/firebase";
import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const app = express();

app.use(cors());
app.use(express.json());

const getAI = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const mcpAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['mo-x-api-key'];
  if (!apiKey || apiKey !== (process.env.MOX_MCP_API_KEY || 'mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz')) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing mo-x-api-key header' });
  }
  next();
};

app.get("/api/openapi.json", (req, res) => {
  const serverUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    openapi: "3.1.0",
    info: {
      title: "MoX Hunter AI Agent API",
      version: "1.1.0",
      description: "API for external AI agents to create leads, publish prototype landing pages, and log outreach."
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
            "200": { description: "List of leads", content: { "application/json": { schema: { type: "object" } } } }
          }
        },
        post: {
          operationId: "createLead",
          summary: "Create a new lead in the CRM",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: { type: "string" },
                    industry: { type: "string" },
                    city: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    website: { type: "string" },
                    score: { type: "integer" },
                    insights: { type: "string" },
                    logo: { type: "string" },
                    tagline: { type: "string" },
                    colors: { type: "array", items: { type: "string" } },
                    reviews: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Lead created", content: { "application/json": { schema: { type: "object" } } } }
          }
        }
      },
      "/api/mcp/leads/{id}": {
        get: {
          operationId: "getLeadById",
          summary: "Fetch a single lead by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Single lead details" } }
        },
        patch: {
          operationId: "updateLead",
          summary: "Update lead status and attributes",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } }
          },
          responses: { "200": { description: "Lead updated" } }
        }
      },
      "/api/mcp/publish-prototype": {
        post: {
          operationId: "publishPrototype",
          summary: "Publish a raw HTML landing page prototype and return a public preview link",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["htmlContent", "title"],
                  properties: {
                    htmlContent: { type: "string", description: "Raw self-contained HTML page string" },
                    title: { type: "string", description: "Title or Business Name" },
                    leadId: { type: "string", description: "Optional Lead ID to link prototype" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Prototype published", content: { "application/json": { schema: { type: "object" } } } }
          }
        }
      },
      "/api/mcp/outreach": {
        post: {
          operationId: "draftOutreach",
          summary: "Draft an outreach email for a lead using the DIC framework",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } }
          },
          responses: { "200": { description: "Generated draft" } }
        }
      }
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: { type: "apiKey", in: "header", name: "mo-x-api-key" }
      }
    },
    security: [{ ApiKeyAuth: [] }]
  });
});

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
    
    leadsQuery = query(leadsQuery, limit(50));
    const snapshot = await getDocs(leadsQuery);
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error('Error fetching leads via MCP:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// 2. Create Lead
app.post("/api/mcp/leads", mcpAuth, async (req, res) => {
  try {
    const leadData = req.body;
    if (!leadData.name) {
      return res.status(400).json({ error: 'Missing business name' });
    }

    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      status: leadData.status || 'New',
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, id: docRef.id, lead: { id: docRef.id, ...leadData } });
  } catch (error) {
    console.error('Error creating lead via MCP:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// 3. Fetch Single Lead
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

// 4. Update Lead
app.patch("/api/mcp/leads/:id", mcpAuth, async (req, res) => {
  try {
    const leadRef = doc(db, 'leads', req.params.id);
    await updateDoc(leadRef, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    res.json({ success: true, id: req.params.id, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Error updating lead via MCP:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// 4b. Delete Single Lead
app.delete("/api/mcp/leads/:id", mcpAuth, async (req, res) => {
  try {
    const leadRef = doc(db, 'leads', req.params.id);
    await deleteDoc(leadRef);
    res.json({ success: true, id: req.params.id, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead via MCP:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// 4c. Clear All Leads (CRM Reset)
app.delete("/api/mcp/leads", mcpAuth, async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'leads'));
    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'leads', d.id)));
    await Promise.all(deletePromises);
    res.json({ success: true, message: `Successfully deleted ${snapshot.docs.length} leads` });
  } catch (error) {
    console.error('Error clearing leads via MCP:', error);
    res.status(500).json({ error: 'Failed to clear leads' });
  }
});

async function generateSlugId(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'prototype';

  let counter = 1;
  while (counter <= 99) {
    const padded = String(counter).padStart(2, '0');
    const candidate = `${baseSlug}-${padded}`;
    const snap = await getDoc(doc(db, 'messages', candidate));
    if (!snap.exists()) {
      return candidate;
    }
    counter++;
  }
  return `${baseSlug}-${Date.now()}`;
}

// 5. Publish Prototype HTML
app.post("/api/mcp/publish-prototype", mcpAuth, async (req, res) => {
  try {
    const { htmlContent, title, leadId, customSlug } = req.body;

    if (!htmlContent || !title) {
      return res.status(400).json({ error: 'Missing htmlContent or title in request body' });
    }

    let cleanHtml = htmlContent.replace(/```html/gi, '').replace(/```/g, '').trim();

    const slugId = customSlug || await generateSlugId(title);

    await setDoc(doc(db, 'messages', slugId), {
      canvasContent: cleanHtml,
      canvasMode: 'web',
      title: `${title} Landing Page Prototype`,
      createdAt: new Date().toISOString(),
      isAiGenerated: true
    });

    if (leadId) {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, { prototypeId: slugId });
    }

    const baseDomain = process.env.PUBLIC_APP_URL || 'https://mox.infni-t.online';
    const previewUrl = `${baseDomain}/preview/${slugId}`;

    res.json({
      success: true,
      previewUrl,
      id: slugId,
      title
    });
  } catch (error) {
    console.error('Error publishing prototype via MCP:', error);
    res.status(500).json({ error: 'Failed to publish prototype' });
  }
});

// 6. Generate Live Landing Page Preview via Gemini
app.post("/api/mcp/generate-preview", mcpAuth, async (req, res) => {
  try {
    const { businessName, industry, logo, tagline, colors, reviews, requirements } = req.body;

    if (!businessName) {
      return res.status(400).json({ error: 'Missing businessName in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const prompt = `You are an expert web designer. Create a single, self-contained HTML/CSS page for a business named "${businessName}" in the "${industry || 'Local Business'}" industry.
    
    Brand details:
    - Tagline: ${tagline || 'Excellence and Quality Service'}
    - Logo / Brand Icon: ${logo || 'Modern Minimalist Icon'}
    - Brand Colors: ${colors ? JSON.stringify(colors) : 'Dark mode, indigo accents (#6366f1), glassmorphism'}
    - Customer Reviews: ${reviews ? JSON.stringify(reviews) : 'Top rated 4.9 stars'}
    - Additional Requirements: ${requirements || 'Clean landing page with hero, services grid, testmonials, and contact CTA'}

    CRITICAL FORMAT INSTRUCTION:
    Return ONLY raw executable HTML starting with <!DOCTYPE html> and ending with </html>. Do not include markdown code block backticks (\`\`\`html) or conversational commentary. Include Tailwind CSS CDN inside <head> and standard modern typography.`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let htmlContent = response.text || '';
    htmlContent = htmlContent.replace(/```html/gi, '').replace(/```/g, '').trim();

    const slugId = await generateSlugId(businessName);

    await setDoc(doc(db, 'messages', slugId), {
      canvasContent: htmlContent,
      canvasMode: 'web',
      title: `${businessName} Landing Page Pitch`,
      createdAt: new Date().toISOString(),
      isAiGenerated: true
    });

    const baseDomain = process.env.PUBLIC_APP_URL || 'https://mox.infni-t.online';
    const previewUrl = `${baseDomain}/preview/${slugId}`;

    res.json({
      success: true,
      previewUrl,
      id: slugId,
      businessName
    });
  } catch (error) {
    console.error('Error generating preview via MCP:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

// 7. Process Outreach (DIC Framework)
app.post("/api/mcp/outreach", mcpAuth, async (req, res) => {
  try {
    const { leadId, leadContext, previewLink, angle } = req.body;
    
    let contextStr = "";
    if (leadContext) {
      contextStr = typeof leadContext === 'string' ? leadContext : JSON.stringify(leadContext);
    } else if (leadId) {
      const leadRef = doc(db, 'leads', leadId);
      const snapshot = await getDoc(leadRef);
      if (snapshot.exists()) {
        contextStr = JSON.stringify(snapshot.data());
      }
    }

    if (!contextStr) {
      return res.status(400).json({ error: 'Missing leadId or leadContext in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const linkToInclude = previewLink || 'https://mox.infni-t.online/preview/sample';

    const prompt = `Draft a short, non-salesy cold outreach email using the DIC (Disrupt, Intrigue, Click) framework for a potential client.

    Lead Context: ${contextStr}
    Live Preview URL: ${linkToInclude}
    Strategy Angle: ${angle || 'value-first-dic'}

    RULES:
    1. Keep it 4 to 5 sentences maximum.
    2. Disrupt: Compliment their high ratings/service, but note their current web layout doesn't reflect that quality.
    3. Intrigue: Mention that you went ahead and built a custom live landing page prototype for their brand ($0 cost, no catch).
    4. Click: Include the exact live preview URL (${linkToInclude}).
    5. Open-Ended CTA: Offer to connect their custom domain if they like it, but explicitly state zero pressure if they don't want to proceed.
    6. Tone: Warm, professional, concise, zero sales fluff.
    
    Return JSON with keys "subject" and "body".`;
    
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch (e) {
      parsed = { subject: "Quick site preview", body: response.text };
    }

    res.json({ 
      success: true, 
      message: 'Outreach drafted successfully using DIC framework',
      emailDraft: parsed.body || response.text,
      subject: parsed.subject || "Quick live preview",
      previewLink: linkToInclude
    });
  } catch (error) {
    console.error('Error processing outreach via MCP:', error);
    res.status(500).json({ error: 'Failed to process outreach' });
  }
});

app.post("/api/voice/process", async (req, res) => {
  try {
    const { transcript, currentView } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in .env' });
    }

    const prompt = `Reorganize, clean up, and format raw voice transcription into a professional Markdown note. Raw: "${transcript}"`;
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return res.json({ success: true, formattedMarkdown: response.text || transcript });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
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
        to: [{ email: to }],
        subject: subject || 'Outreach Update',
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: 'Failed to send email', details: errorData });
    }

    const data = await response.json();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default app;
