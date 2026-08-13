with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace("  canvasMode?: CanvasMode;\n", "  canvasMode?: CanvasMode;\n  title?: string;\n  status?: string;\n")

with open('src/App.tsx', 'w') as f:
    f.write(code)
