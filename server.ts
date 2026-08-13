import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { db } from "./src/lib/firebase";
import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, arrayUnion, setDoc } from 'firebase/firestore';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  
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
    const spec = {
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
          },
          {
            "name": "hasWebsite",
            "in": "query",
            "description": "Filter leads by website presence (true or false)",
            "required": false,
            "schema": {
              "type": "boolean"
            }
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
                  },
                  "rating": {
                    "type": "number",
                    "description": "Google or Yelp rating"
                  },
                  "reviewCount": {
                    "type": "integer",
                    "description": "Total number of reviews"
                  },
                  "socials": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "List of social media URLs"
                  },
                  "niche": {
                    "type": "string",
                    "description": "Specific niche (same as industry)"
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
    spec.servers = [{ url: serverUrl }, { url: "https://mox.infni-t.online" }];
    res.json(spec);
  });

  // --- MCP API Routes ---
  
  // 1. Fetch Leads
  app.get("/api/mcp/leads", mcpAuth, async (req, res) => {
    try {
            const { industry, minScore, hasWebsite } = req.query;
      
      let leadsQuery: any = collection(db, 'leads');
      
      if (industry && typeof industry === 'string') {
        leadsQuery = query(leadsQuery, where('industry', '==', industry));
      }
      if (minScore && typeof minScore === 'string') {
        leadsQuery = query(leadsQuery, where('score', '>=', Number(minScore)));
      }
      
      // Limit to 100 for better post-fetch filtering
      leadsQuery = query(leadsQuery, limit(100));
      
      const snapshot = await getDocs(leadsQuery);
      let leads = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      
      if (hasWebsite === 'true') {
        leads = leads.filter(lead => lead.website && lead.website.trim() !== '');
      } else if (hasWebsite === 'false') {
        leads = leads.filter(lead => !lead.website || lead.website.trim() === '');
      }
      
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
      const { name, company, industry, niche, city, email, phone, website, score, insights, logo, tagline, colors, reviews, reviewCount, rating, socials, userId } = req.body;
      
      const finalName = name || company || '';
      const finalCompany = company || name || '';
      const finalNiche = niche || industry || '';
      
      const leadData: any = {
        name: finalName,
        company: finalCompany,
        niche: finalNiche,
        industry: finalNiche,
        city: city || '',
        email: email || '',
        phone: phone || '',
        website: website || '',
        score: score || 0,
        insights: insights || '',
        logo: logo || '',
        tagline: tagline || '',
        colors: colors || [],
        reviews: reviews || reviewCount || 0,
        rating: rating || 0,
        socials: socials || [],
        status: 'Qualified',
        updatedAt: new Date().toISOString()
      };
      
      if (userId) {
        leadData.userId = userId;
      }

      // Upsert logic: Check if lead exists by website or company name
      const leadsRef = collection(db, 'leads');
      let existingDocId = null;

      if (website) {
        const qWeb = query(leadsRef, where('website', '==', website), limit(1));
        const snapWeb = await getDocs(qWeb);
        if (!snapWeb.empty) existingDocId = snapWeb.docs[0].id;
      }
      
      if (!existingDocId && finalCompany) {
        const qCompany = query(leadsRef, where('company', '==', finalCompany), limit(1));
        const snapCompany = await getDocs(qCompany);
        if (!snapCompany.empty) existingDocId = snapCompany.docs[0].id;
      }
      
      if (!existingDocId && finalName) {
        const qName = query(leadsRef, where('name', '==', finalName), limit(1));
        const snapName = await getDocs(qName);
        if (!snapName.empty) existingDocId = snapName.docs[0].id;
      }

      if (existingDocId) {
        const docRef = doc(db, 'leads', existingDocId);
        await updateDoc(docRef, leadData);
        res.json({ success: true, message: "Lead updated successfully", id: existingDocId });
      } else {
        leadData.createdAt = new Date().toISOString();
        const docRef = await addDoc(leadsRef, leadData);
        res.json({ success: true, message: "Lead added successfully", id: docRef.id });
      }
    } catch (error) {
      console.error('Error adding/updating lead via MCP:', error);
      res.status(500).json({ error: 'Failed to add/update lead' });
    }
  });

  // 2c. Update an existing Lead
  app.patch("/api/mcp/leads/:id", mcpAuth, async (req, res) => {
    try {
      const leadId = req.params.id;
      const updates = req.body;
      
      // Also map industry to niche for patch if provided
      if (updates.industry && !updates.niche) {
        updates.niche = updates.industry;
      }
      if (updates.reviewCount && !updates.reviews) {
        updates.reviews = updates.reviewCount;
      }
      
      // Explicitly preserve rich data mining fields
      if (updates.rating !== undefined) updates.rating = parseFloat(updates.rating) || 0;
      if (updates.reviews !== undefined) updates.reviews = parseInt(updates.reviews) || 0;
      if (updates.socials !== undefined && !Array.isArray(updates.socials)) {
        updates.socials = typeof updates.socials === 'string' ? [updates.socials] : [];
      }
      
      updates.updatedAt = new Date().toISOString();
      
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, updates);
      
      res.json({ success: true, message: "Lead updated" });
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
      const { content, htmlContent, title, leadId, canvasMode = 'WEB', status = 'published', customSlug, userId } = req.body;
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
        userId: userId || leadData?.userId || null,
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
  app.get("/preview/:prototypeId", async (req, res, next) => {
    try {
      const { prototypeId } = req.params;
      
      // 1. Check prototypes collection
      try {
        const docRef = doc(db, 'prototypes', prototypeId);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
          const data = snapshot.data();
          const htmlCode = data.htmlCode || '';
          const cssCode = data.cssCode || '';
          const clientName = data.clientName || 'Live Prototype';

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
    
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
        <a href="https://mox.infni-t.online/" target="_blank" style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-family: sans-serif; font-size: 12px; border: 1px solid rgba(255,255,255,0.2);">
            Powered by <b>MO-X</b>
        </a>
    </div>
</body>
</html>`;
          
          res.setHeader('Content-Type', 'text/html');
          return res.send(responseHtml);
        }
      } catch (err) {
        // Continue to check messages
      }

      // 2. Check messages collection (where MCP agent & canvas pitch prototypes are saved)
      try {
        const msgRef = doc(db, 'messages', prototypeId);
        const msgSnap = await getDoc(msgRef);
        
        if (msgSnap.exists()) {
          let msgData = msgSnap.data();
          
          // Alias resolution
          if (msgData.isAlias && msgData.originalId) {
            const origSnap = await getDoc(doc(db, 'messages', msgData.originalId));
            if (origSnap.exists()) {
              msgData = origSnap.data();
            }
          }

          if (msgData.canvasContent) {
            const clientName = msgData.title || 'Live Prototype';
            const content = msgData.canvasContent;

            if (content.includes('<html') || content.includes('<!DOCTYPE html>') || content.includes('<body')) {
              res.setHeader('Content-Type', 'text/html');
              return res.send(content);
            }

            const responseHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${clientName} - MO-X Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    ${content}
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
        <a href="https://mox.infni-t.online/" target="_blank" style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; text-decoration: none; font-family: sans-serif; font-size: 12px; border: 1px solid rgba(255,255,255,0.2);">
            Powered by <b>MO-X</b>
        </a>
    </div>
</body>
</html>`;
            res.setHeader('Content-Type', 'text/html');
            return res.send(responseHtml);
          }
        }
      } catch (err) {
        // Fallback to SPA
      }

      // 3. Fall through to SPA PitchView route
      return next();
    } catch (error) {
      console.error('Error rendering public prototype:', error);
      return next();
    }
  });

  // 4. Generate Prototype Preview
  app.post("/api/mcp/generate-preview", mcpAuth, async (req, res) => {
    try {
      const { leadId, prototypeType, description, businessContext, customSlug, userId } = req.body;
      
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
        userId: userId || leadData?.userId || 'automated-agent',
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
