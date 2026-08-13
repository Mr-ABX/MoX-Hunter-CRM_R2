
import express from "express";
import cors from "cors";
import { db } from "../src/lib/firebase";
import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

const app = express();

app.use(cors());
app.use(express.json());

// --- Public OpenAPI Specification Endpoint ---
app.get("/api/openapi.json", (req, res) => {
  const host = req.headers.host || 'mox.infni-t.online';
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const serverUrl = `${protocol}://${host}`;
  
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
                  properties: {
                    name: { type: "string" },
                    industry: { type: "string" },
                    city: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    website: { type: "string" },
                    score: { type: "integer" }
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
        },
        patch: {
          operationId: "updateLead",
          summary: "Update lead properties",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "The ID of the lead" }
          ],
          responses: {
            "200": {
              description: "Lead updated successfully",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/api/mcp/publish-prototype": {
        post: {
          operationId: "publishPrototype",
          summary: "Publish a clean HTML prototype string",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["htmlContent"],
                  properties: {
                    htmlContent: { type: "string" },
                    title: { type: "string" },
                    leadId: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Prototype published successfully",
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

// --- MCP API Authentication Middleware ---
const mcpAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['mo-x-api-key'] || req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key. Please provide mo-x-api-key header.' });
  }

  // 1. Check against master env variable
  const masterKey = process.env.MOX_MCP_API_KEY || 'mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz';
  if (apiKey === masterKey) {
    return next();
  }

  // 2. Fallback to check DB for generated keys
  try {
    const keysRef = collection(db, 'mcp_keys');
    const q = query(keysRef, where('key', '==', apiKey), where('status', '==', 'active'), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid or revoked API key.' });
    }
    
    next();
  } catch (error) {
    console.error('Error validating MCP API key:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Apply auth to all /api/mcp/* routes
app.use('/api/mcp', mcpAuth);

// 1. GET /api/mcp/leads
app.get("/api/mcp/leads", async (req, res) => {
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
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    
    res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error('Error fetching leads via MCP:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// 2. GET /api/mcp/leads/:id
app.get("/api/mcp/leads/:id", async (req, res) => {
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

// 3. POST /api/mcp/leads
app.post("/api/mcp/leads", async (req, res) => {
  try {
    const { name, industry, city, email, phone, website, score, insights, logo, tagline, colors, reviews, company } = req.body;
    
    const leadData = {
      name: name || company || '',
      company: company || name || '',
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

// 4. PATCH /api/mcp/leads/:id
app.patch("/api/mcp/leads/:id", async (req, res) => {
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

// 5. POST /api/mcp/publish-prototype
app.post("/api/mcp/publish-prototype", async (req, res) => {
  try {
    const { htmlContent, title, leadId } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'Missing required field: htmlContent' });
    }

    // Clean markdown code blocks from htmlContent
    const cleanedHtml = htmlContent.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();

    const messageData = {
      canvasContent: cleanedHtml,
      canvasMode: 'web',
      title: title || 'Live Prototype',
      leadId: leadId || null,
      createdAt: Date.now()
    };

    const docRef = await addDoc(collection(db, 'messages'), messageData);
    const docId = docRef.id;
    const previewUrl = `https://mox.infni-t.online/preview/${docId}`;

    if (leadId) {
      try {
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, { prototypeId: docId, previewUrl });
      } catch (e) {
        console.error(`Failed to update lead ${leadId} with prototypeId:`, e);
      }
    }

    res.json({ success: true, previewUrl, id: docId, title: messageData.title });
  } catch (error) {
    console.error('Error publishing prototype via MCP:', error);
    res.status(500).json({ error: 'Failed to publish prototype' });
  }
});

export default app;
