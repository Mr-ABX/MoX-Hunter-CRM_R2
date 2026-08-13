import json

try:
    with open('api/openapi.json', 'r') as f:
        spec = json.load(f)

    # Update GET /api/mcp/leads schema
    get_leads_params = spec['paths']['/api/mcp/leads']['get'].get('parameters', [])
    
    # Check if hasWebsite already exists
    if not any(p.get('name') == 'hasWebsite' for p in get_leads_params):
        get_leads_params.append({
            "name": "hasWebsite",
            "in": "query",
            "description": "Filter leads by website presence (true or false)",
            "required": False,
            "schema": {
                "type": "boolean"
            }
        })
        spec['paths']['/api/mcp/leads']['get']['parameters'] = get_leads_params

    with open('api/openapi.json', 'w') as f:
        json.dump(spec, f, indent=2)
    print("Updated openapi.json")
except Exception as e:
    print("Could not update openapi.json:", str(e))
