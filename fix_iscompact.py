with open('src/components/files-panel.tsx', 'r') as f:
    code = f.read()

import re

# Let's target the ExternalLink inside the isCompact branch
compact_btn = """                          <button className="p-1.5 text-zinc-600 hover:text-zinc-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>"""
compact_link = """                          <a href={`/preview/${asset.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-600 hover:text-indigo-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>"""

if compact_btn in code:
    code = code.replace(compact_btn, compact_link)

# Also let's double check if there are any other places with "invalid data" or "Invalid Date"
# The grid view was updated.
# Let's update the compact view title
compact_title = """<div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-zinc-200 line-clamp-1">{asset.text}</h4>"""
compact_title_new = """<div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-zinc-200 line-clamp-1">{asset.title || asset.text || 'Untitled Draft'}</h4>"""

# We might need regex for this if we aren't exactly sure of the whitespace
if '<h4 className="text-sm font-medium text-zinc-200 line-clamp-1">{asset.text}</h4>' in code:
    code = code.replace('<h4 className="text-sm font-medium text-zinc-200 line-clamp-1">{asset.text}</h4>', '<h4 className="text-sm font-medium text-zinc-200 line-clamp-1">{asset.title || asset.text || \'Untitled Draft\'}</h4>')


with open('src/components/files-panel.tsx', 'w') as f:
    f.write(code)

