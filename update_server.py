import re

with open('server.ts', 'r') as f:
    content = f.read()

# Replace the existing POST /api/mcp/leads block
old_leads_post_start = content.find('  // 2b. Add a new Lead\n  app.post("/api/mcp/leads"')
if old_leads_post_start != -1:
    # Find the end of this block by finding the next route comment
    next_route_start = content.find('  // 3. Process Outreach', old_leads_post_start)
    if next_route_start != -1:
        old_leads_post_block = content[old_leads_post_start:next_route_start]
        
        new_leads_block = """  // 2b. Add a new Lead
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

"""
        content = content.replace(old_leads_post_block, new_leads_block)
        print("Replaced /api/mcp/leads block and added PATCH route.")
    else:
        print("Could not find the end of the /api/mcp/leads block.")
else:
    print("Could not find the /api/mcp/leads block.")

# Add POST /api/mcp/publish-prototype
# Let's add it right after /api/mcp/prototypes or before it. Let's find /api/mcp/prototypes.
prototypes_post_start = content.find('  // API Endpoint to save custom prototypes')
if prototypes_post_start != -1:
    publish_prototype_block = """  // API Endpoint to publish prototype directly to messages collection
  app.post("/api/mcp/publish-prototype", mcpAuth, async (req, res) => {
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

"""
    # Insert it before the prototypes route
    content = content[:prototypes_post_start] + publish_prototype_block + content[prototypes_post_start:]
    print("Added /api/mcp/publish-prototype route.")
else:
    print("Could not find the /api/mcp/prototypes block to anchor insertion.")


with open('server.ts', 'w') as f:
    f.write(content)

