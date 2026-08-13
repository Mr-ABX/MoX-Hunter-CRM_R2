import { GoogleGenAI } from '@google/genai';

import express from "express";
import cors from "cors";
import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, arrayUnion, setDoc, getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';


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
let db: any;
try {
  db = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true
  });
} catch (e) {
  db = getFirestore(firebaseApp);
}


const getAI = () => new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function createUniqueSlug(baseText: string, customSlug?: string): Promise<string> {
  let base = (customSlug || baseText || 'prototype')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (!base) base = 'prototype';
  base = base.replace(/-\d+$/, '');

  let version = 1;
  while (version < 100) {
    const versionStr = version < 10 ? `0${version}` : `${version}`;
    const candidateSlug = `${base}-${versionStr}`;
    const docRef = doc(db, 'messages', candidateSlug);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return candidateSlug;
    }
    version++;
  }
  return `${base}-${Date.now()}`;
}

const app = express();

app.use(cors());
app.use(express.json());

// --- Public OpenAPI Specification Endpoint ---
app.get("/api/openapi.json", (req, res) => {
  const host = req.headers.host || 'mox.infni-t.online';
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const serverUrl = `${protocol}://${host}`;
  
  const openapiSpec = {
  "openapi": "3.1.0",
  "info": {
    "title": "MoX Hunter AI Agent API",
    "version": "1.0.0",
    "description": "API for external AI agents to fetch leads, generate prototypes, and manage CRM outreach."
  },
  "servers": [
    {
      "url": "https://mox.infni-t.online"
    }
  ],
  "paths": {
    "/api/mcp/leads": {
      "get": {
        "operationId": "getLeads",
        "summary": "Fetch a list of leads",
        "parameters": [
          {
            "name": "industry",
            "in": "query",
            "schema": {
              "type": "string"
            },
            "description": "Filter by industry"
          },
          {
            "name": "minScore",
            "in": "query",
            "schema": {
              "type": "integer"
            },
            "description": "Filter by minimum lead score"
          }
        ],
        "responses": {
          "200": {
            "description": "List of leads",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "post": {
        "operationId": "addLead",
        "summary": "Add a new lead to the CRM",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "company": {
                    "type": "string"
                  },
                  "industry": {
                    "type": "string"
                  },
                  "city": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "phone": {
                    "type": "string"
                  },
                  "website": {
                    "type": "string"
                  },
                  "score": {
                    "type": "integer"
                  },
                  "userId": {
                    "type": "string",
                    "description": "Optional user ID associated with this lead"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successfully added the lead",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/api/mcp/leads/{id}": {
      "get": {
        "operationId": "getLeadById",
        "summary": "Fetch a single lead by ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The ID of the lead"
          }
        ],
        "responses": {
          "200": {
            "description": "Single lead details",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "patch": {
        "operationId": "updateLead",
        "summary": "Update lead properties",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The ID of the lead"
          }
        ],
        "responses": {
          "200": {
            "description": "Lead updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "delete": {
        "operationId": "deleteLead",
        "summary": "Delete a lead from the CRM",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The ID of the lead"
          }
        ],
        "responses": {
          "200": {
            "description": "Lead deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/api/mcp/leads/{id}/activity": {
      "post": {
        "operationId": "addLeadActivity",
        "summary": "Log an activity for a lead and update status to Outreach Sent",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The ID of the lead"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "default": "email_sent"
                  },
                  "subject": {
                    "type": "string"
                  },
                  "body": {
                    "type": "string"
                  },
                  "sentAt": {
                    "type": "string"
                  },
                  "status": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Activity logged successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/api/mcp/stats": {
      "get": {
        "operationId": "getStats",
        "summary": "Get pipeline statistics",
        "responses": {
          "200": {
            "description": "Pipeline statistics",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/api/mcp/publish-prototype": {
      "post": {
        "operationId": "publishPrototype",
        "summary": "Publish a prototype with clean slug and versioning",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "content"
                ],
                "properties": {
                  "content": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "leadId": {
                    "type": "string"
                  },
                  "canvasMode": {
                    "type": "string",
                    "enum": [
                      "WEB",
                      "GRAPHIC",
                      "SVG",
                      "CONTENT"
                    ],
                    "default": "WEB"
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "draft",
                      "published"
                    ],
                    "default": "published"
                  },
                  "customSlug": {
                    "type": "string",
                    "description": "Optional custom slug prefix (e.g. arrington-roofing)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Prototype published successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/api/mcp/generate-preview": {
      "post": {
        "operationId": "generatePreview",
        "summary": "Generate AI prototype using Gemini and publish with clean slug",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "leadId"
                ],
                "properties": {
                  "leadId": {
                    "type": "string"
                  },
                  "prototypeType": {
                    "type": "string",
                    "enum": [
                      "WEB",
                      "GRAPHIC",
                      "SVG",
                      "CONTENT"
                    ],
                    "default": "WEB"
                  },
                  "description": {
                    "type": "string"
                  },
                  "businessContext": {
                    "type": "string"
                  },
                  "customSlug": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Prototype generated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/api/mcp/outreach": {
      "post": {
        "operationId": "draftOutreach",
        "summary": "Draft a personalized outreach email for a lead",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "leadId"
                ],
                "properties": {
                  "leadId": {
                    "type": "string"
                  },
                  "angle": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Outreach drafted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "mo-x-api-key"
      }
    }
  },
  "security": [
    {
      "ApiKeyAuth": []
    }
  ]
};
  openapiSpec.servers = [{ url: serverUrl }, { url: "https://mox.infni-t.online" }];
  
  res.json(openapiSpec);
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
    const { name, industry, city, email, phone, website, score, insights, logo, tagline, colors, reviews, company, userId } = req.body;
    
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
      userId: userId || null,
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
    const { content, htmlContent, title, leadId, canvasMode = 'WEB', status = 'published', customSlug } = req.body;
    const contentToUse = content || htmlContent;
    
    if (!contentToUse) {
      return res.status(400).json({ error: 'Missing required field: content' });
    }

    const cleanedContent = contentToUse.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();
    const finalCanvasMode = canvasMode.toUpperCase();

    let leadData: any = null;
    if (leadId) {
      try {
        const leadSnap = await getDoc(doc(db, 'leads', leadId));
        if (leadSnap.exists()) {
          leadData = leadSnap.data();
        }
      } catch (e) {
        console.error(`Failed to fetch lead ${leadId}:`, e);
      }
    }

    const baseTitle = customSlug || title || leadData?.company || leadData?.name || 'Live Prototype';
    const docId = await createUniqueSlug(baseTitle, customSlug);

    const messageData = {
      canvasContent: cleanedContent,
      canvasMode: finalCanvasMode,
      title: title || leadData?.company || leadData?.name || 'Live Prototype',
      status: status,
      isAiGenerated: true,
      leadId: leadId || null,
      createdAt: Date.now()
    };

    await setDoc(doc(db, 'messages', docId), messageData);

    const PRIMARY_DOMAIN = process.env.APP_URL || 'https://mox.infni-t.online';
    const previewUrl = `${PRIMARY_DOMAIN}/preview/${docId}`;

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

// 5b. POST /api/mcp/generate-preview
app.post("/api/mcp/generate-preview", async (req, res) => {
  try {
    const { leadId, prototypeType, description, businessContext, customSlug } = req.body;
    
    if (!leadId) {
      return res.status(400).json({ error: 'Missing required field: leadId' });
    }

    const finalPrototypeType = prototypeType || 'WEB';

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

    let combinedBusinessContext = leadContext;
    if (businessContext) {
      combinedBusinessContext += `\nAdditional/Override Business Context: ${businessContext}`;
    }

    const finalDescription = description || `A high-converting personalized pitch/prototype tailored for ${leadData.company || leadData.name || 'the business'} in the ${leadData.industry || 'general'} industry.`;

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

    if (!canvasContent) {
      canvasContent = content.replace(/^```[a-z]*/i, '').replace(/```$/i, '').trim();
    }

    let sessionId = 'automated-outreach-session';
    try {
      const sessionsRef = collection(db, 'sessions');
      const sessionQuery = query(
        sessionsRef,
        where('leadId', '==', leadId),
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

    const baseTitle = customSlug || leadData.company || leadData.name || 'Prototype';
    const docId = await createUniqueSlug(baseTitle, customSlug);

    const messageDoc = {
      role: 'model',
      text: text || `Generated custom ${canvasMode.toLowerCase()} prototype.`,
      canvasContent: canvasContent,
      canvasMode: canvasMode,
      title: `${leadData.company || leadData.name || 'Lead'} Prototype`,
      status: 'published',
      isAiGenerated: true,
      leadId: leadId,
      sessionId: sessionId,
      userId: leadData.userId || 'automated-agent',
      createdAt: Date.now()
    };
    
    await setDoc(doc(db, 'messages', docId), messageDoc);

    const PRIMARY_DOMAIN = process.env.APP_URL || 'https://mox.infni-t.online';
    const previewLink = `${PRIMARY_DOMAIN}/preview/${docId}`;

    await updateDoc(leadRef, {
      status: 'Built',
      prototypeId: docId,
      previewUrl: previewLink,
      updatedAt: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Prototype generated and saved successfully',
      previewId: docId,
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

// 5c. POST /api/mcp/outreach
app.post("/api/mcp/outreach", async (req, res) => {
  try {
    const { leadId, angle } = req.body;
    
    if (!leadId) {
      return res.status(400).json({ error: 'Missing required field: leadId' });
    }

    const leadRef = doc(db, 'leads', leadId);
    const snapshot = await getDoc(leadRef);
    let leadContext = "";
    if (snapshot.exists()) {
      leadContext = JSON.stringify(snapshot.data());
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const prompt = `Draft a cold outreach email for a lead. 
    Lead Data: ${leadContext}
    Outreach Angle/Strategy: ${angle || 'Direct pitch'}
    
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
