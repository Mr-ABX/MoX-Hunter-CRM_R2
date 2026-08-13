import re

with open('api/index.ts', 'r') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';",
    "import { collection, query, where, limit, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';"
)

# 2. Add endpoints before `export default app;`
new_endpoints = """

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
"""
content = content.replace("export default app;", new_endpoints + "\nexport default app;")

# 3. Update publish-prototype endpoint
old_publish = """app.post("/api/mcp/publish-prototype", async (req, res) => {
  try {
    const { htmlContent, title, leadId } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'Missing required field: htmlContent' });
    }

    // Clean markdown code blocks from htmlContent
    const cleanedHtml = htmlContent.replace(/^```[a-z]*\\n/i, '').replace(/\\n```$/i, '').trim();

    const messageData = {
      canvasContent: cleanedHtml,
      canvasMode: 'web',
      title: title || 'Live Prototype',
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

    res.json({ success: true, previewUrl, id: docId, title: messageData.title });
  } catch (error) {
    console.error('Error publishing prototype via MCP:', error);
    res.status(500).json({ error: 'Failed to publish prototype' });
  }
});"""

new_publish = """app.post("/api/mcp/publish-prototype", async (req, res) => {
  try {
    const { content, title, leadId, canvasMode = 'WEB', status = 'published' } = req.body;
    const contentToUse = content || req.body.htmlContent; // fallback for backwards compatibility
    
    if (!contentToUse) {
      return res.status(400).json({ error: 'Missing required field: content' });
    }

    // Clean markdown code blocks from content
    const cleanedContent = contentToUse.replace(/^```[a-z]*\\n/i, '').replace(/\\n```$/i, '').trim();

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
});"""

content = content.replace(old_publish, new_publish)

with open('api/index.ts', 'w') as f:
    f.write(content)
