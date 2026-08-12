import express from "express";
import cors from "cors";
import { db } from "../src/lib/firebase"; // Adjust import path if needed.
import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

const app = express();

app.use(cors());
app.use(express.json());

// --- MCP API Authentication Middleware ---
const mcpAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['mo-x-api-key'] || req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key. Please provide mo-x-api-key header.' });
  }

  // 1. Check against master env variable
  if (apiKey === process.env.MOX_MCP_API_KEY) {
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

// 1. POST /api/mcp/leads
app.post("/api/mcp/leads", async (req, res) => {
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

// 2. PATCH /api/mcp/leads/:id
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

// 3. POST /api/mcp/publish-prototype
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
