with open('src/components/files-panel.tsx', 'r') as f:
    code = f.read()

code = code.replace("} List, Grid from 'lucide-react';", ", List, Grid } from 'lucide-react';")

with open('src/components/files-panel.tsx', 'w') as f:
    f.write(code)
