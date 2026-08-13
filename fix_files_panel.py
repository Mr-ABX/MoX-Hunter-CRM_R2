import re

with open('src/components/files-panel.tsx', 'r') as f:
    content = f.read()

# Add viewMode state
if 'const [viewMode, setViewMode] = useState<' not in content:
    content = content.replace("const [filterMode, setFilterMode] = useState<string>('all');", "const [filterMode, setFilterMode] = useState<string>('all');\n  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');")
    
# Add Table/Grid toggle buttons and icon imports
if 'List,' not in content:
    content = content.replace("from 'lucide-react';", "List, Grid, from 'lucide-react';".replace(", from", " from"))

toggle_ui = """
              </div>
              <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
"""
if 'setViewMode(' not in content:
    content = content.replace('</select>\n              </div>', '</select>\n' + toggle_ui)

table_ui = """
        {viewMode === 'table' && filteredAssets.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden backdrop-blur-xl">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase tracking-wider font-semibold text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                          {getIcon(asset.canvasMode || '')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200 line-clamp-1">{asset.title || 'Untitled Draft'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-full text-zinc-300">
                        {asset.canvasMode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedLeadId(asset.leadId || null)}
                        className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                      >
                        <Folder className="w-3.5 h-3.5" />
                        {getLeadName(asset.leadId)}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${asset.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {asset.status === 'published' ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(asset.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`/preview/${asset.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-md transition-colors"
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, assetId: asset.id })}
                          className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-md transition-colors"
                          title="Delete Draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'grid' && (
"""

if 'viewMode === \'grid\'' not in content:
    content = content.replace('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">', table_ui + '\n<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">')
    
    # Close the viewMode === grid tag at the end of the grid
    # Looking for:
    # </div>
    # 
    #       {filteredAssets.length === 0 && (
    
    content = content.replace('</div>\n\n        {filteredAssets.length === 0 && (', '</div>\n        )}\n\n        {filteredAssets.length === 0 && (')

with open('src/components/files-panel.tsx', 'w') as f:
    f.write(content)
