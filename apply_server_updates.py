import re

with open('server.ts', 'r') as f:
    server_code = f.read()

# Add setDoc to firestore imports if missing
if 'setDoc' not in server_code:
    server_code = server_code.replace("arrayUnion } from 'firebase/firestore';", "arrayUnion, setDoc } from 'firebase/firestore';")

# Add createUniqueSlug helper function inside startServer if missing
helpers_code = """
async function createUniqueSlug(baseText: string, customSlug?: string): Promise<string> {
  let base = (customSlug || baseText || 'prototype')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (!base) base = 'prototype';
  base = base.replace(/-\\d+$/, '');

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
"""

if 'async function createUniqueSlug' not in server_code:
    server_code = server_code.replace('const getAI = () =>', helpers_code + '\n  const getAI = () =>')

# Update publish-prototype in server.ts
old_publish = re.search(r'app\.post\("/api/mcp/publish-prototype", mcpAuth, async \(req, res\) => \{.*?\n  \}\);', server_code, re.DOTALL)

new_publish = """app.post("/api/mcp/publish-prototype", mcpAuth, async (req, res) => {
    try {
      const { content, htmlContent, title, leadId, canvasMode = 'WEB', status = 'published', customSlug } = req.body;
      const contentToUse = content || htmlContent;
      
      if (!contentToUse) {
        return res.status(400).json({ error: 'Missing required field: content' });
      }

      const cleanedContent = contentToUse.replace(/^```[a-z]*\\n/i, '').replace(/\\n```$/i, '').trim();
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
  });"""

if old_publish:
    server_code = server_code.replace(old_publish.group(0), new_publish)

# Update generate-preview in server.ts to use createUniqueSlug and PRIMARY_DOMAIN
old_gen_preview = re.search(r'// 4\. Generate Prototype Preview\n  app\.post\("/api/mcp/generate-preview", mcpAuth, async \(req, res\) => \{.*?\n  \}\);', server_code, re.DOTALL)

new_gen_preview = """// 4. Generate Prototype Preview
  app.post("/api/mcp/generate-preview", mcpAuth, async (req, res) => {
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
        combinedBusinessContext += `\\nAdditional/Override Business Context: ${businessContext}`;
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

      const webMatch = content.match(/<canvas_web>([\\s\\S]*?)<\\/canvas_web>/);
      if (webMatch) {
        canvasContent = webMatch[1].trim();
        canvasMode = 'WEB';
        text = text.replace(webMatch[0], '').trim();
      }

      const graphicMatch = content.match(/<canvas_graphic>([\\s\\S]*?)<\\/canvas_graphic>/);
      if (graphicMatch) {
        canvasContent = graphicMatch[1].trim();
        canvasMode = 'GRAPHIC';
        text = text.replace(graphicMatch[0], '').trim();
      }

      const svgMatch = content.match(/<canvas_svg>([\\s\\S]*?)<\\/canvas_svg>/);
      if (svgMatch) {
        canvasContent = svgMatch[1].trim();
        canvasMode = 'SVG';
        text = text.replace(svgMatch[0], '').trim();
      }

      const contentMatch = content.match(/<canvas_content>([\\s\\S]*?)<\\/canvas_content>/);
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
  });"""

if old_gen_preview:
    server_code = server_code.replace(old_gen_preview.group(0), new_gen_preview)

with open('server.ts', 'w') as f:
    f.write(server_code)

print("Updated server.ts successfully")
