with open('api/index.ts', 'r') as f:
    content = f.read()

content = 'import { GoogleGenAI } from "@google/genai";\n' + content

with open('api/index.ts', 'w') as f:
    f.write(content)
