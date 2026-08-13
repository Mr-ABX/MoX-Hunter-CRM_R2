import re

for filepath in ['api/index.ts', 'server.ts']:
    with open(filepath, 'r') as f:
        code = f.read()

    # Find the block starting with app.patch("/api/mcp/leads/:id" up to the next route or EOF
    
    if "app.patch(\"/api/mcp/leads/:id\", mcpAuth, async (req, res) => {" in code:
        old_signature = 'app.patch("/api/mcp/leads/:id", mcpAuth, async (req, res) => {'
    else:
        old_signature = 'app.patch("/api/mcp/leads/:id", async (req, res) => {'
        
    start_idx = code.find(old_signature)
    if start_idx == -1:
        print(f"Could not find PATCH leads in {filepath}")
        continue
        
    end_idx = code.find("});\n\n  // ", start_idx)
    if end_idx == -1:
        end_idx = code.find("});\n\n//", start_idx)
        
    if end_idx == -1:
        end_idx = code.find("});", start_idx + 100)
    
    old_block = code[start_idx:end_idx + 3]
    
    new_block = old_signature + """
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
      
      updates.updatedAt = new Date().toISOString();
      
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, updates);
      
      res.json({ success: true, message: "Lead updated" });
    } catch (error) {
      console.error('Error updating lead via MCP:', error);
      res.status(500).json({ error: 'Failed to update lead' });
    }
  });"""

    code = code.replace(old_block, new_block)
    with open(filepath, 'w') as f:
        f.write(code)
    print(f"Replaced patch block in {filepath}")

