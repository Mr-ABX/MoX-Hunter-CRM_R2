with open("server.ts", "r") as f:
    content = f.read()

route_insert = """
  // --- Phase 1 & 2: Public Prototypes ---
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

"""

route_target = '  // 4. Generate Prototype Preview'
if route_target in content:
    content = content.replace(route_target, route_insert + route_target)
    print("Replaced route handler successfully.")
else:
    print("Could not find route target.")

with open("server.ts", "w") as f:
    f.write(content)

