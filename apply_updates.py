import re

# Update api/index.ts
with open('api/index.ts', 'r') as f:
    api_code = f.read()

# Add setDoc to firestore imports if missing
if 'setDoc' not in api_code:
    api_code = api_code.replace("arrayUnion,", "arrayUnion, setDoc,")

# Add GoogleGenAI import if missing
if '@google/genai' not in api_code:
    api_code = "import { GoogleGenAI } from '@google/genai';\n" + api_code

# Add helper functions before `const app = express();`
helpers_code = """
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

if 'async function createUniqueSlug' not in api_code:
    api_code = api_code.replace('const app = express();', helpers_code + '\nconst app = express();')

# Update POST /api/mcp/leads to support userId
old_post_lead = """// 3. POST /api/mcp/leads
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
    };"""

new_post_lead = """// 3. POST /api/mcp/leads
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
    };"""

api_code = api_code.replace(old_post_lead, new_post_lead)

# Update POST /api/mcp/publish-prototype in api/index.ts
old_publish_proto = re.search(r'// 5\. POST /api/mcp/publish-prototype\napp\.post\("/api/mcp/publish-prototype", async \(req, res\) => \{.*?\n\}\);', api_code, re.DOTALL)

new_publish_proto = """// 5. POST /api/mcp/publish-prototype
app.post("/api/mcp/publish-prototype", async (req, res) => {
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
});"""

if old_publish_proto:
    api_code = api_code.replace(old_publish_proto.group(0), new_publish_proto)

with open('api/index.ts', 'w') as f:
    f.write(api_code)

print("Updated api/index.ts successfully")
