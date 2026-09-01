import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Image as ImageIcon, LayoutTemplate, PenTool, AlignLeft, Search, Filter, ChevronLeft, Folder, MoreVertical, ExternalLink, Trash2, X , List, Grid } from 'lucide-react';
import { Message, Lead } from '@/App';
import { ConfirmModal } from './confirm-modal';

interface FilesPanelProps {
  messages: Message[];
  leads: Lead[];
  initialLeadId?: string;
  isCompact?: boolean;
  onDeleteAsset?: (id: string) => void;
}

export function FilesPanel({ messages, leads, initialLeadId, isCompact = false, onDeleteAsset }: FilesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(initialLeadId || null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; assetId: string }>({ isOpen: false, assetId: '' });

  const assets = messages.filter(m => m.canvasContent && m.canvasMode);
  
  const filteredAssets = assets.filter(asset => {
    const searchText = (asset.text || asset.title || '').toLowerCase();
    const matchesSearch = searchText.includes(searchQuery.toLowerCase()) || 
                          (asset.canvasContent && asset.canvasContent.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterMode === 'all' || asset.canvasMode === filterMode;
    const matchesLead = !selectedLeadId || asset.leadId === selectedLeadId;
    return matchesSearch && matchesFilter && matchesLead;
  });

  const getIcon = (mode: string) => {
    switch (mode) {
      case 'WEB': return <LayoutTemplate className="w-5 h-5 text-blue-400" />;
      case 'GRAPHIC': return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case 'SVG': return <PenTool className="w-5 h-5 text-emerald-400" />;
      case 'CONTENT': return <AlignLeft className="w-5 h-5 text-amber-400" />;
      default: return <FileText className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getLeadName = (leadId?: string | null) => {
    if (!leadId) return 'General';
    const lead = leads.find(l => l.id === leadId);
    return lead ? lead.name : 'Unknown Lead';
  };

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  return (
    <div className={`flex-1 overflow-y-auto no-scrollbar bg-zinc-950 ${isCompact ? 'p-4' : 'p-8 lg:p-12'}`}>
      <div className="max-w-6xl mx-auto">
        {!isCompact && (
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {selectedLeadId && (
                  <button 
                    onClick={() => setSelectedLeadId(null)}
                    className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <h1 className="text-3xl font-display font-bold text-zinc-100">
                  {selectedLeadId ? selectedLead?.name : 'Files & Assets'}
                </h1>
              </div>
              <p className="text-zinc-400">
                {selectedLeadId 
                  ? `Viewing all assets for ${selectedLead?.name}` 
                  : 'Select a project to view its generated drafts and prototypes.'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
                />
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                  <Filter className="w-4 h-4" />
                  Type: {filterMode === 'all' ? 'All' : filterMode}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                  {['all', 'WEB', 'GRAPHIC', 'SVG', 'CONTENT'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilterMode(mode)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors ${filterMode === mode ? 'text-indigo-400 font-medium' : 'text-zinc-300'}`}
                    >
                      {mode === 'all' ? 'All Types' : mode}
                    </button>
                  ))}
                </div>
              </div>
              
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
            </div>
          </div>
        )}

        {!selectedLeadId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {leads.map((lead, index) => {
              const leadAssets = assets.filter(a => a.leadId === lead.id);
              return (
                <motion.button
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-start p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Folder className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2 mb-1 w-full">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-indigo-400 border border-zinc-700/60 shrink-0">
                      #{index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors truncate">{lead.name}</h3>
                  </div>
                  <p className="text-sm text-zinc-500 mb-4">{lead.niche} • {lead.city}</p>
                  <div className="mt-auto flex items-center justify-between w-full">
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-800 text-zinc-400 rounded-md">
                      {leadAssets.length} Assets
                    </span>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </motion.button>
              );
            })}
            
            {/* General/No Lead Assets */}
            {assets.some(a => !a.leadId) && (
              <motion.button
                onClick={() => setSelectedLeadId('general')}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-start p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-zinc-500" />
                </div>
                <div className="flex items-center gap-2 mb-1 w-full">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-indigo-400 border border-zinc-700/60 shrink-0">
                    #{leads.length + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-100 truncate">General Assets</h3>
                </div>
                <p className="text-sm text-zinc-500 mb-4">Unassigned drafts and notes</p>
                <div className="mt-auto">
                  <span className="text-xs font-medium px-2 py-1 bg-zinc-800 text-zinc-400 rounded-md">
                    {assets.filter(a => !a.leadId).length} Assets
                  </span>
                </div>
              </motion.button>
            )}
          </div>
        ) : (
          <div>
            {isCompact && (
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-zinc-200 flex items-center gap-2">
                  <Folder className="w-4 h-4 text-indigo-400" /> {selectedLead?.name || 'General'}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
                      {['all', 'WEB', 'GRAPHIC', 'SVG', 'CONTENT'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setFilterMode(mode)}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 transition-colors ${filterMode === mode ? 'text-indigo-400' : 'text-zinc-400'}`}
                        >
                          {mode === 'all' ? 'All' : mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-zinc-900/20 rounded-2xl border border-zinc-800/50 border-dashed">
                <FileText className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium text-zinc-400 mb-1">No files found</p>
                <p className="text-sm">Generate some assets for this lead to see them here.</p>
              </div>
            ) : (
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
                        {filteredAssets.map((asset, index) => (
                          <tr key={asset.id} className="hover:bg-zinc-800/20 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50 shrink-0">
                                  {getIcon(asset.canvasMode || '')}
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded-md bg-zinc-800 text-indigo-400 border border-zinc-700/60 shrink-0">
                                    #{index + 1}
                                  </span>
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
                  <div className={`grid grid-cols-1 ${isCompact ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
                {filteredAssets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group ${isCompact ? 'p-3 flex items-center gap-3' : ''}`}
                  >
                    {!isCompact ? (
                      <>
                        <div className="h-40 bg-zinc-950 flex items-center justify-center border-b border-zinc-800/50 relative overflow-hidden">
                          {asset.canvasMode === 'GRAPHIC' ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-purple-400/50" />
                            </div>
                          ) : asset.canvasMode === 'WEB' ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                              <LayoutTemplate className="w-12 h-12 text-blue-400/50" />
                            </div>
                          ) : asset.canvasMode === 'SVG' ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                              <PenTool className="w-12 h-12 text-emerald-400/50" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                              <AlignLeft className="w-12 h-12 text-amber-400/50" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {getIcon(asset.canvasMode!)}
                            <span className="text-xs font-medium px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md">
                              {asset.canvasMode}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-indigo-400 border border-zinc-700/60 shrink-0">
                              #{index + 1}
                            </span>
                            <h3 className="text-zinc-200 font-medium text-sm line-clamp-2" title={asset.title || 'Untitled Draft'}>
                              {asset.title || 'Untitled Draft'}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                            <span>{getLeadName(asset.leadId)}</span>
                            <div className="flex items-center gap-2">
                              <span>{new Date(asset.createdAt || Date.now()).toLocaleDateString()}</span>
                              {onDeleteAsset && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ isOpen: true, assetId: asset.id }); }}
                                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 border-t border-zinc-800/50 pt-4">
                            <a 
                              href={`/preview/${asset.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-medium transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" /> View Preview
                            </a>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          asset.canvasMode === 'WEB' ? 'bg-blue-500/10' :
                          asset.canvasMode === 'GRAPHIC' ? 'bg-purple-500/10' :
                          asset.canvasMode === 'SVG' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                        }`}>
                          {getIcon(asset.canvasMode!)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700/60 shrink-0">
                              #{index + 1}
                            </span>
                            <h4 className="text-xs font-medium text-zinc-200 truncate">{asset.title || asset.text}</h4>
                          </div>
                          <p className="text-[10px] text-zinc-500">{new Date(parseInt(asset.id)).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <a href={`/preview/${asset.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-600 hover:text-indigo-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          {onDeleteAsset && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ isOpen: true, assetId: asset.id }); }}
                              className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => {
          if (deleteConfirm.assetId && onDeleteAsset) {
            onDeleteAsset(deleteConfirm.assetId);
          }
        }}
        onCancel={() => setDeleteConfirm({ isOpen: false, assetId: '' })}
      />
    </div>
  );
}
