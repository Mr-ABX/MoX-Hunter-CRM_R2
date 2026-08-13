import json
import re

with open('api/openapi.json', 'r') as f:
    spec = json.load(f)

# Script to replace openapi endpoint in api/index.ts and server.ts
for file_path in ['api/index.ts', 'server.ts']:
    with open(file_path, 'r') as f:
        code = f.read()

    # Find app.get("/api/openapi.json"
    match = re.search(r'app\.get\("/api/openapi\.json", \(req, res\) => \{.*?\n\}\);', code, re.DOTALL)
    if match:
        spec_json_str = json.dumps(spec, indent=2)
        new_handler = f"""app.get("/api/openapi.json", (req, res) => {{
  const host = req.headers.host || 'mox.infni-t.online';
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const serverUrl = `${{protocol}}://${{host}}`;
  
  const openapiSpec = {spec_json_str};
  openapiSpec.servers = [{{ url: serverUrl }}, {{ url: "https://mox.infni-t.online" }}];
  
  res.json(openapiSpec);
}});"""
        code = code.replace(match.group(0), new_handler)
        with open(file_path, 'w') as f:
            f.write(code)
        print(f"Updated {file_path} openapi route successfully")

