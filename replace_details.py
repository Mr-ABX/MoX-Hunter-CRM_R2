with open('src/components/lead-crm.tsx', 'r') as f:
    content = f.read()

# Replace view details with onSelectLead
content = content.replace("onClick={() => setDetailsLead(lead)}", "onClick={() => onSelectLead(lead.id)}")
content = content.replace("View Details", "Files & Assets")
content = content.replace("Details", "Files")

with open('src/components/lead-crm.tsx', 'w') as f:
    f.write(content)
