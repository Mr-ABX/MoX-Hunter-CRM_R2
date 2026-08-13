import re

for filepath in ['api/index.ts', 'server.ts']:
    with open(filepath, 'r') as f:
        code = f.read()
    
    # 3. POST /api/mcp/leads
    # Let's find the route definition
    pattern = r'// 3\. POST /api/mcp/leads\napp\.post\("/api/mcp/leads", (?:mcpAuth, )?async \(req, res\) => \{\n  try \{\n    const \{.*?\} = req\.body;[\s\S]*?res\.json\(\{ success: true, message: .*?, id: .*? \}\);\n  \} catch \(error\) \{[\s\S]*?\}\n\}\);'
    
    match = re.search(pattern, code, re.DOTALL)
    if not match:
        print(f"Could not find POST /api/mcp/leads in {filepath}")
        continue
        
    old_route = match.group(0)
    
    # Generate new route:
    auth_middleware = "mcpAuth, " if "mcpAuth" in old_route else ""
    
    new_route = f"""// 3. POST /api/mcp/leads
app.post("/api/mcp/leads", {auth_middleware}async (req, res) => {{
  try {{
    const {{ name, company, industry, niche, city, email, phone, website, score, insights, logo, tagline, colors, reviews, reviewCount, rating, socials, userId }} = req.body;
    
    const finalName = name || company || '';
    const finalCompany = company || name || '';
    const finalNiche = niche || industry || '';
    
    const leadData = {{
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
      userId: userId || null,
      updatedAt: new Date().toISOString()
    }};

    // Upsert logic: Check if lead exists by website or company name
    const leadsRef = collection(db, 'leads');
    let existingDocId = null;

    if (website) {{
      const qWeb = query(leadsRef, where('website', '==', website), limit(1));
      const snapWeb = await getDocs(qWeb);
      if (!snapWeb.empty) existingDocId = snapWeb.docs[0].id;
    }}
    
    if (!existingDocId && finalCompany) {{
      const qCompany = query(leadsRef, where('company', '==', finalCompany), limit(1));
      const snapCompany = await getDocs(qCompany);
      if (!snapCompany.empty) existingDocId = snapCompany.docs[0].id;
    }}
    
    if (!existingDocId && finalName) {{
      const qName = query(leadsRef, where('name', '==', finalName), limit(1));
      const snapName = await getDocs(qName);
      if (!snapName.empty) existingDocId = snapName.docs[0].id;
    }}

    if (existingDocId) {{
      // Update existing lead
      const docRef = doc(db, 'leads', existingDocId);
      await updateDoc(docRef, leadData);
      res.json({{ success: true, message: "Lead updated successfully", id: existingDocId }});
    }} else {{
      // Create new lead
      leadData.createdAt = new Date().toISOString();
      const docRef = await addDoc(leadsRef, leadData);
      res.json({{ success: true, message: "Lead added successfully", id: docRef.id }});
    }}
  }} catch (error) {{
    console.error('Error adding/updating lead via MCP:', error);
    res.status(500).json({{ error: 'Failed to add/update lead' }});
  }}
}});"""

    code = code.replace(old_route, new_route)
    with open(filepath, 'w') as f:
        f.write(code)
    print(f"Updated {filepath} successfully")

