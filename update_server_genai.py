import re

with open('server.ts', 'r') as f:
    content = f.read()

# 1. Remove top level GoogleGenAI
ai_pattern = re.compile(r'\s*// Initialize Gemini client.*?\n\s*const ai = new GoogleGenAI\(\{.*?\n.*?\n.*?\n.*?\n\s*\}\);\n', re.MULTILINE | re.DOTALL)
content = ai_pattern.sub('\n', content)

# 2. Add dynamic getAI() right after app.use(express.json());
get_ai_code = """
  const getAI = () => new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
"""
content = content.replace('  app.use(express.json());', '  app.use(express.json());\n' + get_ai_code)

# 3. Add `const ai = getAI();` before ai.models.generateContent
content = content.replace('      const response = await ai.models.generateContent', '      const ai = getAI();\n      const response = await ai.models.generateContent')

with open('server.ts', 'w') as f:
    f.write(content)
