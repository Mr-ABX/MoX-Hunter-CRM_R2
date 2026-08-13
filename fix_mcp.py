import re

for filepath in ['api/index.ts', 'server.ts']:
    with open(filepath, 'r') as f:
        code = f.read()

    # 1. GET /api/mcp/leads
    get_leads_old = """      const { industry, minScore } = req.query;
      
      let leadsQuery: any = collection(db, 'leads');
      
      if (industry && typeof industry === 'string') {
        leadsQuery = query(leadsQuery, where('industry', '==', industry));
      }
      if (minScore && typeof minScore === 'string') {
        leadsQuery = query(leadsQuery, where('score', '>=', Number(minScore)));
      }
      
      // Limit to 50 for performance
      leadsQuery = query(leadsQuery, limit(50));
      
      const snapshot = await getDocs(leadsQuery);
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));"""
      
    get_leads_new = """      const { industry, minScore, hasWebsite } = req.query;
      
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
      }"""
      
    # Make get_leads replacement more robust if spaces differ
    if "const { industry, minScore } = req.query;" in code:
        code = re.sub(r'const \{ industry, minScore \} = req\.query;[\s\S]*?const leads = snapshot\.docs\.map.*?;\n', get_leads_new + '\n', code)


    # 2. POST /api/mcp/publish-prototype
    code = code.replace("const { content, htmlContent, title, leadId, canvasMode = 'WEB', status = 'published', customSlug } = req.body;", "const { content, htmlContent, title, leadId, canvasMode = 'WEB', status = 'published', customSlug, userId } = req.body;")
    code = code.replace("userId: leadData?.userId || null,", "userId: userId || leadData?.userId || null,")


    # 3. POST /api/mcp/generate-preview
    code = code.replace("const { leadId, prototypeType, description, businessContext, customSlug } = req.body;", "const { leadId, prototypeType, description, businessContext, customSlug, userId } = req.body;")
    code = code.replace("userId: leadData.userId || 'automated-agent',", "userId: userId || leadData?.userId || 'automated-agent',")


    # 4. PATCH /api/mcp/leads/:id
    patch_old = """      // Also map industry to niche for patch if provided
      if (updates.industry && !updates.niche) {
        updates.niche = updates.industry;
      }
      if (updates.reviewCount && !updates.reviews) {
        updates.reviews = updates.reviewCount;
      }"""
      
    patch_new = """      // Also map industry to niche for patch if provided
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
      }"""
      
    code = code.replace(patch_old, patch_new)

    with open(filepath, 'w') as f:
        f.write(code)
    print(f"Updated {filepath} API logic")


# Fix use-chat.ts
with open('src/hooks/use-chat.ts', 'r') as f:
    chat_code = f.read()

chat_old = """    const qAssets = query(collection(db, 'messages'), where('userId', '==', userId));
    const unsubAssets = onSnapshot(qAssets, (snapshot) => {
      setAssets(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message)).filter(m => m.canvasMode != null));
    }, (error) => console.error('Error fetching assets:', error));"""

chat_new = """    const unsubAssets = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const allAssets = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message)).filter(m => m.canvasMode != null);
      const filteredAssets = allAssets.filter(m => !m.userId || m.userId === userId);
      setAssets(filteredAssets);
    }, (error) => console.error('Error fetching assets:', error));"""

chat_code = chat_code.replace(chat_old, chat_new)

with open('src/hooks/use-chat.ts', 'w') as f:
    f.write(chat_code)
print("Updated src/hooks/use-chat.ts")

