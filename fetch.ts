import fs from 'fs/promises';
import path from 'path';

async function fetchRepo() {
  const treeUrl = 'https://api.github.com/repos/Mr-ABX/MoX-Hunter-NextjsOld/git/trees/main?recursive=1';
  const res = await fetch(treeUrl);
  if (!res.ok) {
    console.error('Failed to fetch tree', res.status);
    return;
  }
  const treeData = await res.json();
  
  for (const item of treeData.tree) {
    if (item.type === 'blob') {
      // Only fetch ts, tsx, css, and svg files
      if (item.path.endsWith('.ts') || item.path.endsWith('.tsx') || item.path.endsWith('.css') || item.path.endsWith('.svg')) {
        // Skip some nextjs specific stuff and layout
        if (item.path.includes('app/layout.tsx') || item.path.includes('next.config.ts') || item.path.includes('tailwind.config')) continue;
        
        console.log(`Downloading ${item.path}...`);
        
        const fileUrl = `https://raw.githubusercontent.com/Mr-ABX/MoX-Hunter-NextjsOld/main/${item.path}`;
        const fileRes = await fetch(fileUrl);
        const text = await fileRes.text();
        
        // rewrite the path to fit our Vite project:
        // app/page.tsx -> src/App.tsx
        // app/globals.css -> src/index.css
        // components/* -> src/components/*
        // hooks/* -> src/hooks/*
        // lib/* -> src/lib/*
        // public/* -> public/*
        
        let outPath = '';
        if (item.path === 'app/page.tsx') {
           outPath = 'src/App.tsx';
        } else if (item.path === 'app/globals.css') {
           outPath = 'src/index.css';
        } else if (item.path.startsWith('components/')) {
           outPath = `src/${item.path}`;
        } else if (item.path.startsWith('hooks/')) {
           outPath = `src/${item.path}`;
        } else if (item.path.startsWith('lib/')) {
           if (item.path === 'lib/firebase.ts' || item.path === 'lib/utils.ts') {
               // We already have these so let's check
               // or we just let it overwrite but we might need to be careful
           }
           outPath = `src/${item.path}`;
        } else if (item.path.startsWith('public/')) {
           outPath = `${item.path}`;
        } else {
           continue; // skip others
        }
        
        if (outPath) {
           await fs.mkdir(path.dirname(outPath), { recursive: true });
           
           // Replace next/image with standard img
           let modifiedText = text.replace(/import Image from 'next\/image';/g, '');
           modifiedText = modifiedText.replace(/<Image/g, '<img');
           
           // Replace next/font and other things
           modifiedText = modifiedText.replace(/'use client';\n/g, '');
           
           // We'll write it out
           await fs.writeFile(outPath, modifiedText);
        }
      }
    }
  }
}

fetchRepo().catch(console.error);
