import json

with open('api/openapi.json', 'r') as f:
    spec = json.load(f)

# Update POST /api/mcp/leads schema
lead_props = spec['paths']['/api/mcp/leads']['post']['requestBody']['content']['application/json']['schema']['properties']
lead_props['rating'] = { "type": "number", "description": "Google or Yelp rating" }
lead_props['reviewCount'] = { "type": "integer", "description": "Total number of reviews" }
lead_props['socials'] = { "type": "array", "items": { "type": "string" }, "description": "List of social media URLs" }
lead_props['niche'] = { "type": "string", "description": "Specific niche (same as industry)" }

with open('api/openapi.json', 'w') as f:
    json.dump(spec, f, indent=2)

