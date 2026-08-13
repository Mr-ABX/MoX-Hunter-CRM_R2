import re

with open('src/components/files-panel.tsx', 'r') as f:
    code = f.read()

# 1. Add view mode toggle buttons
toggle_ui = """              </div>
              
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>"""

if 'setViewMode(\'grid\')' not in code:
    code = code.replace("              </div>\n            </div>", toggle_ui)

# 2. Add table view rendering and fix grid view title/link
# I'll replace the block that starts with `              <div className={`grid grid-cols-1 ${isCompact`
# Let's find the start of the grid view rendering and end of it
import sys

grid_start_str = "            ) : (\n              <div className={`grid grid-cols-1 ${isCompact ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>"

if grid_start_str not in code:
    print("Could not find grid start block")
    sys.exit(1)

new_views = """            ) : (
              <>
                {viewMode === 'table' && !isCompact && (
                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden backdrop-blur-xl">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase tracking-wider font-semibold text-zinc-500">
                        <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Type</th>
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
                                  <a href={`/preview/${asset.id}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-200 hover:text-indigo-400 line-clamp-1 transition-colors">
                                    {asset.title || 'Untitled Draft'}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-full text-zinc-300">
                                {asset.canvasMode}
                              </span>
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
                                {onDeleteAsset && (
                                  <button
                                    onClick={() => setDeleteConfirm({ isOpen: true, assetId: asset.id })}
                                    className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-md transition-colors"
                                    title="Delete Draft"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {(viewMode === 'grid' || isCompact) && (
                  <div className={`grid grid-cols-1 ${isCompact ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>"""

code = code.replace(grid_start_str, new_views)

# Now fix the grid view asset rendering
grid_replace_old = """                          <h3 className="text-zinc-200 font-medium text-sm line-clamp-2 mb-3" title={asset.text}>
                            {asset.text}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span>{getLeadName(asset.leadId)}</span>
                            <div className="flex items-center gap-2">
                              <span>{new Date(parseInt(asset.id)).toLocaleDateString()}</span>"""

grid_replace_new = """                          <h3 className="text-zinc-200 font-medium text-sm line-clamp-2 mb-3" title={asset.title || 'Untitled Draft'}>
                            {asset.title || 'Untitled Draft'}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                            <span>{getLeadName(asset.leadId)}</span>
                            <div className="flex items-center gap-2">
                              <span>{new Date(asset.createdAt || Date.now()).toLocaleDateString()}</span>"""

if grid_replace_old in code:
    code = code.replace(grid_replace_old, grid_replace_new)
else:
    print("Could not find grid render block to replace")
    sys.exit(1)

# Add "Open link" button to grid
delete_btn_block = """                              {onDeleteAsset && (
                                <button 
                                   onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ isOpen: true, assetId: asset.id }); }}
                                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>"""

delete_btn_new = """                              {onDeleteAsset && (
                                <button 
                                   onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ isOpen: true, assetId: asset.id }); }}
                                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <a 
                            href={`/preview/${asset.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-medium transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" /> View Preview
                          </a>
                        </div>"""

if delete_btn_block in code:
    code = code.replace(delete_btn_block, delete_btn_new)
else:
    print("Could not find delete btn block to replace")

# Add missing </div> logic at the end if we added a <> wrapper
close_block_old = """                  </motion.div>
                ))}
              </div>
            )}"""

close_block_new = """                  </motion.div>
                ))}
              </div>
                )}
              </>
            )}"""

if close_block_old in code:
    code = code.replace(close_block_old, close_block_new)

with open('src/components/files-panel.tsx', 'w') as f:
    f.write(code)

