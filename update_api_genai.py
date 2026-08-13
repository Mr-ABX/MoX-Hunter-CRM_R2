import re

with open('api/index.ts', 'r') as f:
    content = f.read()

# Replace getAI block
pattern = re.compile(r'let aiInstance.*?\nfunction getAI\(\): GoogleGenAI \{.*?\n.*?return aiInstance;\n\}', re.MULTILINE | re.DOTALL)

get_ai_code = """const getAI = () => new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});"""

content = pattern.sub(get_ai_code, content)

with open('api/index.ts', 'w') as f:
    f.write(content)
