import re

for file, old, new in [
    ('src/components/lead-crm.tsx', 'lead.name.toLowerCase()', '(lead.name || "").toLowerCase()'),
    ('src/components/lead-crm.tsx', 'lead.niche.toLowerCase()', '(lead.niche || "").toLowerCase()'),
    ('src/components/lead-crm.tsx', 'lead.city.toLowerCase()', '(lead.city || "").toLowerCase()'),
    ('src/components/contracts-panel.tsx', 'l.name.toLowerCase()', '(l.name || "").toLowerCase()'),
    ('src/components/contracts-panel.tsx', 'l.niche.toLowerCase()', '(l.niche || "").toLowerCase()'),
]:
    with open(file, 'r') as f:
        code = f.read()
    code = code.replace(old, new)
    with open(file, 'w') as f:
        f.write(code)

