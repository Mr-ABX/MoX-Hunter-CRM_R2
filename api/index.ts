
import express from "express";
import cors from "cors";
import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, arrayUnion, getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';


import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCcjhKblRgTAf86VS-bhZ3p7Tx8SemO3aA",
  authDomain: "mox-hunter---the-ai-wolf-crm.firebaseapp.com",
  projectId: "mox-hunter---the-ai-wolf-crm",
  storageBucket: "mox-hunter---the-ai-wolf-crm.firebasestorage.app",
  messagingSenderId: "682972820825",
  appId: "1:682972820825:web:ef4f05b6be728613f00848"
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let db: Firestore;
if (typeof window !== 'undefined') {
  try {
    db = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true
    });
  } catch (e) {
    db = getFirestore(firebaseApp);
  }
} else {
  db = getFirestore(firebaseApp);
}

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
        },
        delete: {
          operationId: "deleteLead",
          summary: "Delete a lead",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "The ID of the lead" }
          ],
          responses: {
            "200": {
              description: "Lead deleted successfully",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
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
                  required: ["content"],
                  properties: {
                    content: { type: "string" },
                    title: { type: "string" },
                    leadId: { type: "string" },
                    canvasMode: { type: "string", enum: ["WEB", "GRAPHIC", "SVG", "CONTENT"], default: "WEB" },
                    status: { type: "string", enum: ["draft", "published"], default: "published" }
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



// 6. DELETE /api/mcp/leads/:id
app.delete("/api/mcp/leads/:id", async (req, res) => {
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
app.post("/api/mcp/leads/:id/activity", async (req, res) => {
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
app.get("/api/mcp/stats", async (req, res) => {
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

export default app;
