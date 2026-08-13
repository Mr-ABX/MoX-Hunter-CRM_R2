import json

with open('api/openapi.json', 'r') as f:
    spec = json.load(f)

spec_json_str = json.dumps(spec, indent=2)

with open('server.ts', 'r') as f:
    code = f.read()

start_marker = "  // --- MCP OpenAPI Spec ---\n  app.get(\"/api/openapi.json\", (req, res) => {"
end_marker = "  });\n\n  // --- MCP API Routes ---"

start_idx = code.find(start_marker)
end_idx = code.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_route = f"""  // --- MCP OpenAPI Spec ---
  app.get("/api/openapi.json", (req, res) => {{
    const serverUrl = `${{req.protocol}}://${{req.get('host')}}`;
    const spec = {spec_json_str};
    spec.servers = [{{ url: serverUrl }}, {{ url: "https://mox.infni-t.online" }}];
    res.json(spec);
  }});"""
    
    code = code[:start_idx] + new_route + code[end_idx + 5:]
    with open('server.ts', 'w') as f:
        f.write(code)
    print("Updated server.ts openapi route successfully")
else:
    print(f"Indices: start={start_idx}, end={end_idx}")
