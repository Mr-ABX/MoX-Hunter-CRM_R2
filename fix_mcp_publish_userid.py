import re

for filepath in ['api/index.ts', 'server.ts']:
    with open(filepath, 'r') as f:
        code = f.read()

    # Find the messageData declaration in publish-prototype
    old_message_data = """      const messageData = {
        canvasContent: cleanedContent,
        canvasMode: finalCanvasMode,
        title: title || leadData?.company || leadData?.name || 'Live Prototype',
        status: status,
        isAiGenerated: true,
        leadId: leadId || null,
        createdAt: Date.now()
      };"""
      
    # There are spaces varying maybe. Let's use regex
    pattern = r'const messageData = \{[\s\S]*?createdAt: Date\.now\(\)\n\s*\};'
    match = re.search(pattern, code)
    if match:
        old_str = match.group(0)
        if 'userId:' not in old_str:
            new_str = old_str.replace('createdAt: Date.now()', 'userId: leadData?.userId || null,\n        createdAt: Date.now()')
            code = code.replace(old_str, new_str)
            with open(filepath, 'w') as f:
                f.write(code)
            print(f"Updated messageData in {filepath}")
    else:
        print(f"Could not find messageData in {filepath}")

