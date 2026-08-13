import re

for filepath in ['api/index.ts', 'server.ts']:
    with open(filepath, 'r') as f:
        code = f.read()

    # Find the block starting with app.post("/api/mcp/leads" up to the next route or EOF
    # We will use regex to capture it.
    
    if "app.post(\"/api/mcp/leads\", mcpAuth, async (req, res) => {" in code:
        old_signature = 'app.post("/api/mcp/leads", mcpAuth, async (req, res) => {'
    else:
        old_signature = 'app.post("/api/mcp/leads", async (req, res) => {'
        
    start_idx = code.find(old_signature)
    if start_idx == -1:
        print(f"Could not find POST leads in {filepath}")
        continue
        
    end_idx = code.find("});\n\n  // ", start_idx)
    if end_idx == -1:
        end_idx = code.find("});\n\n//", start_idx)
        
    if end_idx == -1:
        end_idx = code.find("});", start_idx + 100)
    
    old_block = code[start_idx:end_idx + 3]
    
    new_block = old_signature + """
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
  });"""

    code = code.replace(old_block, new_block)
    with open(filepath, 'w') as f:
        f.write(code)
    print(f"Replaced block in {filepath}")

