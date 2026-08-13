import re

files = ['api/index.ts', 'server.ts']

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace hardcoded previewUrl
    content = re.sub(r'const previewUrl = `https://mox.infni-t.online/preview/\$\{docId\}`;',
                     r"const host = req.headers.host || 'mox.infni-t.online';\n      const protocol = req.headers['x-forwarded-proto'] || 'https';\n      const baseUrl = process.env.APP_URL || `${protocol}://${host}`;\n      const previewUrl = `${baseUrl}/preview/${docId}`;", 
                     content)
    
    with open(file, 'w') as f:
        f.write(content)
