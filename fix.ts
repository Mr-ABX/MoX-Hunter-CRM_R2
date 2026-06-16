import fs from 'fs/promises';
import path from 'path';

async function fixImports(dir: string) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await fixImports(fullPath);
    } else if (file.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      let content = await fs.readFile(fullPath, 'utf8');
      let modified = content;
      modified = modified.replace(/@\/app\/page/g, '@/App');
      
      if (modified !== content) {
        await fs.writeFile(fullPath, modified);
        console.log('Fixed imports in', fullPath);
      }
    }
  }
}

fixImports('./src').catch(console.error);
