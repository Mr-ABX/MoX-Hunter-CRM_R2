import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MoreVertical, LayoutTemplate, PenTool, ArrowRight, Loader2, CheckCircle2, Clock, Zap, MapPin, Globe, Phone, Mail, Star, Lightbulb, X, LayoutGrid, List, Send, RefreshCw, FolderOpen, Target, Eye, Sparkles, ExternalLink, Plus, MessageSquare } from 'lucide-react';
import { Lead } from '@/App';
import { Logo, LogoFull } from './logo';
import { ConfirmModal } from './confirm-modal';
import { LeadDetailsDrawer, WhatsAppIcon } from './leads-panel';
import { useAuth } from '@/hooks/use-auth';
import { useMetrics } from '@/hooks/use-metrics';

export const formatWhatsAppPhone = (rawPhone?: string): string => {
  if (!rawPhone) return '';
  let cleaned = rawPhone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '92' + cleaned.substring(1);
  }
  return cleaned;
};

export const getPersonalizedPitch = (lead: Lead): string => {
  const previewLink = lead.previewUrl || (lead.prototypeId ? `https://mox.infni-t.online/preview/${lead.prototypeId}` : '');
  if (lead.whatsappDraft) return lead.whatsappDraft;
  return `Hi ${lead.name} Team! We built a custom live mobile prototype for your brand: ${previewLink || 'https://mox.infni-t.online'} - Let me know what you think!`;
};

interface LeadCRMProps {
  leads: Lead[];
  onGeneratePrototype: (lead: Lead, type: 'auto' | 'manual') => void;
  onNavigate: (view: any) => void;
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
  onDeleteLead: (leadId: string) => void;
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  onSelectLead: (leadId: string) => void;
}

export function LeadCRM({ leads, onGeneratePrototype, onNavigate, onUpdateLead, onDeleteLead, onAddLead, onSelectLead }: LeadCRMProps) {
  const { user } = useAuth();
  const { targets, updateTargets } = useMetrics(user?.uid);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailsLead, setFilesLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; leadId: string }>({ isOpen: false, leadId: '' });

  const [newLead, setNewLead] = useState<Omit<Lead, 'id'>>({
    name: '',
    niche: '',
    city: '',
    status: 'Qualified',
    email: '',
    phone: '',
    website: '',
    insights: ''
  });

  const isValidEmail = (email?: string): email is string => {
    if (!email) return false;
    const lower = email.toLowerCase();
    return lower.includes('@') && !lower.includes('not available') && !lower.includes('n/a') && !lower.includes('none');
  };

  const isValidWebsite = (website?: string): website is string => {
    if (!website) return false;
    const lower = website.toLowerCase();
    return lower.includes('.') && !lower.includes('not available') && !lower.includes('n/a') && !lower.includes('none');
  };

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = (lead.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lead.niche || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lead.city || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleAction = (type: 'auto' | 'manual') => {
    if (selectedLead) {
      onGeneratePrototype(selectedLead, type);
      setIsModalOpen(false);
    }
  };

  const handleAddManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name) return;
    onAddLead(newLead);
    setIsAddModalOpen(false);
    setNewLead({
      name: '',
      niche: '',
      city: '',
      status: 'Qualified',
      email: '',
      phone: '',
      website: '',
      insights: ''
    });
  };

  const handleEditLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLead) return;
    onUpdateLead(editLead.id, editLead);
    setEditLead(null);
  };

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'AED': return 'د.إ';
      case 'PKR': return '₨';
      case 'GBP': return '£';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'Qualified':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="w-3 h-3" /> Qualified</span>;
      case 'Built':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><LayoutTemplate className="w-3 h-3" /> Built</span>;
      case 'Contacted':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Send className="w-3 h-3" /> Contacted</span>;
      case 'Negotiating':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"><RefreshCw className="w-3 h-3" /> Negotiating</span>;
      case 'Closed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Closed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"><Clock className="w-3 h-3" /> {status}</span>;
    }
  };

  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [tempTargets, setTempTargets] = useState({ builds: targets.targetBuilds, replies: targets.targetReplies, closes: targets.targetCloses });
  const [now] = useState(() => Date.now());

  const handleSaveTargets = () => {
    updateTargets({ targetBuilds: tempTargets.builds, targetReplies: tempTargets.replies, targetCloses: tempTargets.closes });
    setIsEditingTargets(false);
  };

  const currentBuilds = leads.filter(l => l.status === 'Built' || l.status === 'Contacted' || l.status === 'Negotiating' || l.status === 'Closed').length;
  const currentReplies = leads.filter(l => l.status === 'Negotiating' || l.status === 'Closed').length;
  const currentCloses = leads.filter(l => l.status === 'Closed').length;

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const timestamp = new Date().getTime();
    const updates: Partial<Lead> = { status: newStatus, lastActionDate: timestamp };
    
    // Automatically set a follow-up date for specific pipeline stages
    if (newStatus === 'Contacted' || newStatus === 'Negotiating') {
      updates.nextFollowUpDate = timestamp + (3 * 24 * 60 * 60 * 1000); // 3 Days
    } else if (newStatus === 'Closed') {
      updates.nextFollowUpDate = null as unknown as undefined; // Cleared in FB 
    }

    onUpdateLead(leadId, updates);
  };

  const handleQuickWhatsApp = (lead: Lead, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
    const previewLink = lead.previewUrl || (lead.prototypeId ? `https://mox.infni-t.online/preview/${lead.prototypeId}` : '');
    const message = lead.whatsappDraft || `Hi ${lead.name} Team! We built a custom live mobile prototype for your brand: ${previewLink || 'https://mox.infni-t.online'} - Let me know what you think!`;
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}` 
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    
    if (lead.status === 'Qualified' || lead.status === 'Built') {
      handleStatusChange(lead.id, 'Contacted');
    }

    fetch('/api/outreach/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: lead.id,
        businessName: lead.name,
        recipient: cleanPhone || lead.phone || 'WhatsApp',
        subject: `WhatsApp Outreach to ${lead.name}`,
        body: message,
        channel: 'whatsapp',
        status: 'Sent',
        previewUrl: previewLink
      })
    }).catch(console.error);
  };

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(225,29,72,0.08),transparent_40%),radial-gradient(circle_at_top_left,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <LogoFull className="h-11 text-zinc-100" />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-rose-500/20"
            >
              <Zap className="w-4 h-4" />
              Add Manual Lead
            </button>
            <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-xl p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'board' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
            <div className="relative group">
              <button className="p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm hidden md:inline">Filter</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                {['all', 'Qualified', 'Built', 'Contacted', 'Negotiating', 'Closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors ${filterStatus === status ? 'text-indigo-400 font-medium' : 'text-zinc-300'}`}
                  >
                    {status === 'all' ? 'All Statuses' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Weekly Targets Tracker */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Weekly Growth Targets</h2>
            {!isEditingTargets ? (
              <button 
                onClick={() => {
                  setTempTargets({ builds: targets.targetBuilds, replies: targets.targetReplies, closes: targets.targetCloses });
                  setIsEditingTargets(true);
                }}
                className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors"
              >
                Edit Targets
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditingTargets(false)} className="text-xs text-zinc-500 hover:text-zinc-300">Cancel</button>
                <button onClick={handleSaveTargets} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Save</button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center text-center">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-indigo-400">{currentBuilds}</span>
                {isEditingTargets ? (
                  <span className="text-sm text-zinc-500 font-medium flex items-center">/ <input type="number" className="ml-1 w-12 bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" value={tempTargets.builds} onChange={e => setTempTargets({...tempTargets, builds: Number(e.target.value)})} /></span>
                ) : (
                  <span className="text-sm text-zinc-500 font-medium">/ {targets.targetBuilds}</span>
                )}
              </div>
              <p className="text-sm text-zinc-400">businesses to build for</p>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 mt-4 overflow-hidden border border-zinc-800">
                <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (currentBuilds / targets.targetBuilds) * 100)}%` }} />
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center text-center">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-emerald-400">{currentReplies}</span>
                {isEditingTargets ? (
                  <span className="text-sm text-zinc-500 font-medium flex items-center">/ <input type="number" className="ml-1 w-12 bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" value={tempTargets.replies} onChange={e => setTempTargets({...tempTargets, replies: Number(e.target.value)})} /></span>
                ) : (
                  <span className="text-sm text-zinc-500 font-medium">/ {targets.targetReplies}</span>
                )}
              </div>
              <p className="text-sm text-zinc-400">replies expected</p>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 mt-4 overflow-hidden border border-zinc-800">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (currentReplies / targets.targetReplies) * 100)}%` }} />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-baseline gap-2 mb-1 relative z-10">
                <span className="text-3xl font-bold text-rose-400">{currentCloses}</span>
                {isEditingTargets ? (
                  <span className="text-sm text-zinc-500 font-medium flex items-center">/ <input type="number" className="ml-1 w-12 bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500" value={tempTargets.closes} onChange={e => setTempTargets({...tempTargets, closes: Number(e.target.value)})} /></span>
                ) : (
                  <span className="text-sm text-zinc-500 font-medium">/ {targets.targetCloses}</span>
                )}
              </div>
              <p className="text-sm text-zinc-400 relative z-10">clients to close</p>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 mt-4 overflow-hidden border border-zinc-800 relative z-10">
                <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (currentCloses / targets.targetCloses) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Required: Follow-Ups */}
        {leads.filter(l => l.nextFollowUpDate && l.nextFollowUpDate <= now && l.status !== 'Closed').length > 0 && (
          <div className="mb-10 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-rose-400 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Action Required: Due For Follow-Up
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leads.filter(l => l.nextFollowUpDate && l.nextFollowUpDate <= now && l.status !== 'Closed').map(lead => (
                <div key={lead.id} className="bg-zinc-900 border border-rose-500/20 rounded-xl p-4 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-zinc-100">{lead.name}</h4>
                    <span className="text-[10px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                      Due
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">Currently in: {lead.status}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <button 
                      onClick={() => onNavigate('outreach')}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      Open Pitcher
                    </button>
                    <button 
                      onClick={() => onUpdateLead(lead.id, { 
                        nextFollowUpDate: Date.now() + (3 * 24 * 60 * 60 * 1000) 
                      })}
                      className="text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                    >
                      Snooze 3 Days
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {leads.length === 0 ? (
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 via-indigo-500/20 to-purple-500/20 border border-zinc-700/60 flex items-center justify-center mb-5 text-rose-400 shadow-inner">
              <Target className="w-8 h-8 opacity-90" />
            </div>
            <h3 className="text-xl font-bold font-display text-zinc-100 mb-2">No leads in pipeline</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
              Type <span className="font-mono text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-semibold">'start the flow'</span> to launch an automated hunt or click <span className="text-zinc-200 font-semibold">'+ Add Lead'</span> to ingest manually.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Lead
              </button>
              <button
                onClick={() => onNavigate('discovery')}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-medium transition-all border border-zinc-700 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-indigo-400" /> Launch Automated Hunt
              </button>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50">
                  <th className="py-4 px-6 text-xs font-medium text-zinc-500 uppercase tracking-wider">Business Name</th>
                  <th className="py-4 px-6 text-xs font-medium text-zinc-500 uppercase tracking-wider">Niche / Location</th>
                  <th className="py-4 px-6 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-zinc-500">
                      No leads match your search. <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }} className="text-indigo-400 hover:underline ml-1">Clear filters</button>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, i) => {
                    const cleanPhone = formatWhatsAppPhone(lead.phone);
                    const personalizedPitch = getPersonalizedPitch(lead);
                    const prototypeLink = lead.previewUrl || (lead.prototypeId ? `https://mox.infni-t.online/preview/${lead.prototypeId}` : '');

                    return (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={lead.id} 
                        onClick={() => { setDrawerLead(lead); setIsDrawerOpen(true); }}
                        className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {lead.logo ? (
                              <img
                                src={lead.logo}
                                alt={lead.name}
                                className="h-10 w-10 object-contain rounded-xl bg-zinc-950 border border-zinc-800 p-1 mr-3 shrink-0"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold font-display text-sm mr-3 shrink-0 shadow-sm">
                                {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-zinc-100 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                                <span>{lead.name}</span>
                                <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                {lead.rating && (
                                  <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    <Star className="w-3 h-3 fill-amber-400" /> {lead.rating}
                                  </span>
                                )}
                                {lead.score && (
                                  <span className="flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                    Score: {lead.score}
                                  </span>
                                )}
                                {lead.dealValue && (
                                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    {getCurrencySymbol(lead.currency)}{lead.dealValue.toLocaleString()}
                                  </span>
                                )}
                                {prototypeLink && (
                                  <a 
                                    href={prototypeLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-xl hover:bg-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.15)] transition-all hover:scale-105"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" /> Test Prototype
                                  </a>
                                )}
                                {lead.googleMapsUrl && (
                                  <a
                                    href={lead.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-emerald-400 transition-colors bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800"
                                  >
                                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Maps
                                  </a>
                                )}
                                {isValidWebsite(lead.website) && (
                                  <a
                                    href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-indigo-400 transition-colors bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800"
                                  >
                                    <Globe className="w-3.5 h-3.5 text-zinc-500" />
                                    <span className="truncate max-w-[120px]">{lead.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                                  </a>
                                )}
                                {lead.phone && (
                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedPitch)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (lead.status === 'Qualified' || lead.status === 'Built') {
                                        handleStatusChange(lead.id, 'Contacted');
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                                  >
                                    <WhatsAppIcon className="w-3.5 h-3.5" /> 💬 Chat on WhatsApp
                                  </a>
                                )}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onSelectLead(lead.id); }}
                                  className="text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-700 px-2 py-0.5 rounded-full border border-zinc-700 transition-colors"
                                >
                                  Files & Assets
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-zinc-300">{lead.niche}</div>
                          <div className="text-xs text-zinc-500">{lead.city}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <option value="Qualified">Qualified</option>
                              <option value="Built">Built</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Negotiating">Negotiating</option>
                              <option value="Closed">Closed</option>
                            </select>
                            {getStatusBadge(lead.status)}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => handleQuickWhatsApp(lead, e)}
                              className="p-2 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-emerald-500/10 transition-colors"
                              title="1-Click WhatsApp Outreach"
                            >
                              <WhatsAppIcon className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onSelectLead(lead.id); }}
                              className="p-2 text-zinc-400 hover:text-indigo-400 rounded-lg hover:bg-zinc-800 transition-colors"
                              title="View Files"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleGenerateClick(lead); }}
                              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                            >
                              <Zap className="w-4 h-4" /> 
                              {lead.prototypeId ? 'Rebuild' : 'Generate'}
                            </button>
                            
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => setActiveMenuId(activeMenuId === lead.id ? null : lead.id)}
                                className="p-2 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              <AnimatePresence>
                                {activeMenuId === lead.id && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                      className="absolute right-0 top-full mt-2 w-36 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1 overflow-hidden"
                                    >
                                      <button 
                                        onClick={() => {
                                          setEditLead(lead);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors flex items-center gap-2"
                                      >
                                        <PenTool className="w-3.5 h-3.5" /> Edit Lead
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setDeleteConfirm({ isOpen: true, leadId: lead.id });
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                                      >
                                        <X className="w-3.5 h-3.5" /> Delete
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
            {(['Qualified', 'Built', 'Contacted', 'Negotiating', 'Closed'] as const).map((status) => (
              <div key={status} className="flex-none w-80 snap-start bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex flex-col h-[600px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-medium text-zinc-300 flex items-center gap-2">
                    {status === 'Qualified' && <Clock className="w-4 h-4 text-amber-400" />}
                    {status === 'Built' && <LayoutTemplate className="w-4 h-4 text-indigo-400" />}
                    {status === 'Contacted' && <Send className="w-4 h-4 text-blue-400" />}
                    {status === 'Negotiating' && <RefreshCw className="w-4 h-4 text-purple-400" />}
                    {status === 'Closed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {status}
                  </h3>
                  <span className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-full">
                    {filteredLeads.filter(l => l.status === status).length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
                  {filteredLeads.filter(l => l.status === status).map((lead) => {
                    const cleanPhone = formatWhatsAppPhone(lead.phone);
                    const personalizedPitch = getPersonalizedPitch(lead);
                    const prototypeLink = lead.previewUrl || (lead.prototypeId ? `https://mox.infni-t.online/preview/${lead.prototypeId}` : '');

                    return (
                      <motion.div 
                        layoutId={`card-${lead.id}`}
                        key={lead.id}
                        onClick={() => { setDrawerLead(lead); setIsDrawerOpen(true); }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-zinc-900/90 transition-all group cursor-pointer shadow-sm hover:shadow-indigo-500/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {lead.logo ? (
                              <img
                                src={lead.logo}
                                alt={lead.name}
                                className="h-8 w-8 object-contain rounded-lg bg-zinc-950 border border-zinc-800 p-0.5 shrink-0"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold font-display text-xs shrink-0 shadow-sm">
                                {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
                              </div>
                            )}
                            <h4 className="font-medium text-zinc-100 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5 truncate">
                              <span className="truncate">{lead.name}</span>
                              <Eye className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </h4>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={(e) => handleQuickWhatsApp(lead, e)}
                              className="p-1 text-emerald-400 hover:text-emerald-300 rounded-md hover:bg-emerald-500/10 transition-colors"
                              title="1-Click WhatsApp Outreach"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onSelectLead(lead.id); }}
                              className="p-1 text-zinc-500 hover:text-indigo-400 rounded-md hover:bg-zinc-800 transition-colors"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                            </button>
                            <div className="relative">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === lead.id ? null : lead.id); }}
                                className="p-1 text-zinc-500 hover:text-zinc-200 rounded-md hover:bg-zinc-800 transition-colors"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                              <AnimatePresence>
                                {activeMenuId === lead.id && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                      className="absolute right-0 top-full mt-1 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-50 py-1 overflow-hidden"
                                    >
                                      <button 
                                        onClick={() => {
                                          setEditLead(lead);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors flex items-center gap-2"
                                      >
                                        <PenTool className="w-3 h-3" /> Edit
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setDeleteConfirm({ isOpen: true, leadId: lead.id });
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                                      >
                                        <X className="w-3 h-3" /> Delete
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 mb-3">{lead.niche} • {lead.city}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {lead.score && (
                            <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                              Score: {lead.score}
                            </span>
                          )}
                          {lead.dealValue && (
                            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              {getCurrencySymbol(lead.currency)}{lead.dealValue.toLocaleString()}
                            </span>
                          )}
                          {prototypeLink && (
                            <a
                              href={prototypeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full hover:bg-indigo-500/20 transition-all"
                            >
                              <Sparkles className="w-2.5 h-2.5" /> Prototype
                            </a>
                          )}
                          {lead.googleMapsUrl && (
                            <a
                              href={lead.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] text-zinc-300 hover:text-emerald-400 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800 transition-colors"
                            >
                              <MapPin className="w-2.5 h-2.5 text-emerald-400" /> Map
                            </a>
                          )}
                          {isValidWebsite(lead.website) && (
                            <a
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] text-zinc-300 hover:text-indigo-400 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800 transition-colors"
                            >
                              <Globe className="w-2.5 h-2.5 text-zinc-500" /> Web
                              <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                            </a>
                          )}
                        </div>

                        {lead.phone && (
                          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedPitch)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                if (lead.status === 'Qualified' || lead.status === 'Built') {
                                  handleStatusChange(lead.id, 'Contacted');
                                }
                              }}
                              className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" /> Chat on WhatsApp
                            </a>
                          </div>
                        )}
                        
                        <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                            className="text-xs bg-transparent text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer"
                          >
                            <option value="Qualified">Move to Qualified</option>
                            <option value="Built">Move to Built</option>
                            <option value="Contacted">Move to Contacted</option>
                            <option value="Negotiating">Move to Negotiating</option>
                            <option value="Closed">Move to Closed</option>
                          </select>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleGenerateClick(lead); }}
                            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3" /> {lead.prototypeId ? 'Rebuild' : 'Build'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Manual Lead Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <h2 className="text-2xl font-display font-semibold text-zinc-100 mb-6">Add Manual Lead</h2>
              
              <form onSubmit={handleAddManualLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Business Name</label>
                    <input 
                      required
                      type="text" 
                      value={newLead.name}
                      onChange={e => setNewLead({...newLead, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Niche</label>
                    <input 
                      type="text" 
                      value={newLead.niche}
                      onChange={e => setNewLead({...newLead, niche: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="e.g. SaaS, Retail"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">City / Location</label>
                    <input 
                      type="text" 
                      value={newLead.city}
                      onChange={e => setNewLead({...newLead, city: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="e.g. New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Website</label>
                    <input 
                      type="text" 
                      value={newLead.website}
                      onChange={e => setNewLead({...newLead, website: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="e.g. acme.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      value={newLead.email}
                      onChange={e => setNewLead({...newLead, email: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="contact@acme.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone</label>
                    <input 
                      type="text" 
                      value={newLead.phone}
                      onChange={e => setNewLead({...newLead, phone: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Insights / Notes</label>
                  <textarea 
                    value={newLead.insights}
                    onChange={e => setNewLead({...newLead, insights: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[100px]"
                    placeholder="Any specific details about this lead..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Add Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Lead Modal */}
      <AnimatePresence>
        {editLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditLead(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <h2 className="text-2xl font-display font-semibold text-zinc-100 mb-6">Edit Lead</h2>
              
              <form onSubmit={handleEditLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Business Name</label>
                    <input 
                      required
                      type="text" 
                      value={editLead.name}
                      onChange={e => setEditLead({...editLead, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Niche</label>
                    <input 
                      type="text" 
                      value={editLead.niche}
                      onChange={e => setEditLead({...editLead, niche: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">City / Location</label>
                    <input 
                      type="text" 
                      value={editLead.city}
                      onChange={e => setEditLead({...editLead, city: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Website</label>
                    <input 
                      type="text" 
                      value={editLead.website}
                      onChange={e => setEditLead({...editLead, website: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      value={editLead.email || ''}
                      onChange={e => setEditLead({...editLead, email: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone</label>
                    <input 
                      type="text" 
                      value={editLead.phone || ''}
                      onChange={e => setEditLead({...editLead, phone: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Currency</label>
                    <select
                      value={editLead.currency || 'USD'}
                      onChange={e => setEditLead({...editLead, currency: e.target.value as any})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="AED">AED (د.إ)</option>
                      <option value="PKR">PKR (₨)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Deal Value</label>
                    <input 
                      type="number" 
                      value={editLead.dealValue || ''}
                      onChange={e => setEditLead({...editLead, dealValue: Number(e.target.value) || undefined})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="E.g. 5000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Insights / Notes</label>
                  <textarea 
                    value={editLead.insights || ''}
                    onChange={e => setEditLead({...editLead, insights: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditLead(null)}
                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generate Prototype Modal */}
      <AnimatePresence>
        {isModalOpen && selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <h2 className="text-2xl font-display font-semibold text-zinc-100 mb-2">
                Generate Prototype for {selectedLead.name}
              </h2>
              <p className="text-zinc-400 mb-8">Choose how you want to build the pitch asset.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => handleAction('auto')}
                  className="group relative flex flex-col items-start p-6 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">Auto-Architect</h3>
                  <p className="text-sm text-zinc-400 mb-4">AI instantly builds the full site structure and code based on strategic insights.</p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-medium text-indigo-400">
                    Start Auto-Build <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button 
                  onClick={() => handleAction('manual')}
                  className="group relative flex flex-col items-start p-6 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <PenTool className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">Manual Editor</h3>
                  <p className="text-sm text-zinc-400 mb-4">Open the Canvas for granular control and step-by-step prompting.</p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-medium text-emerald-400">
                    Open Canvas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Lead Files Modal */}
      <AnimatePresence>
        {detailsLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setFilesLead(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {detailsLead.logo ? (
                    <img
                      src={detailsLead.logo}
                      alt={detailsLead.name}
                      className="h-12 w-12 object-contain rounded-2xl bg-zinc-950 border border-zinc-800 p-1.5 shrink-0"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold font-display text-lg shrink-0 shadow-sm">
                      {detailsLead.name ? detailsLead.name.charAt(0).toUpperCase() : 'L'}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-zinc-100">{detailsLead.name}</h2>
                    <p className="text-sm text-zinc-400 mt-0.5">{detailsLead.niche} in {detailsLead.city}</p>
                  </div>
                </div>
                <button onClick={() => setFilesLead(null)} className="p-2 text-zinc-500 hover:text-zinc-300 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5 mb-6">
                {detailsLead.googleMapsUrl ? (
                  <a 
                    href={detailsLead.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-emerald-400 transition-colors bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 shadow-sm"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" /> 
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                ) : detailsLead.address ? (
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(detailsLead.address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-emerald-400 transition-colors bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 shadow-sm"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" /> 
                    <span className="truncate max-w-[200px]">{detailsLead.address}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                ) : null}

                {isValidWebsite(detailsLead.website) && (
                  <a 
                    href={detailsLead.website.startsWith('http') ? detailsLead.website : `https://${detailsLead.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-indigo-400 transition-colors bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 shadow-sm"
                  >
                    <Globe className="w-4 h-4 text-zinc-500" /> 
                    <span>{detailsLead.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  </a>
                )}

                {detailsLead.phone && (
                  <a 
                    href={`tel:${detailsLead.phone.replace(/[^0-9+]/g, '')}`} 
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-indigo-400 transition-colors bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-zinc-500" /> {detailsLead.phone}
                  </a>
                )}

                {isValidEmail(detailsLead.email) && (
                  <a 
                    href={`mailto:${detailsLead.email}`} 
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-indigo-400 transition-colors bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 shadow-sm"
                  >
                    <Mail className="w-4 h-4 text-zinc-500" /> {detailsLead.email}
                  </a>
                )}
              </div>

              {/* WhatsApp 1-Click Outreach Block */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-300">1-Click WhatsApp Pitch</h4>
                    <p className="text-xs text-zinc-400">Launch conversation with pre-crafted prototype pitch</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickWhatsApp(detailsLead)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                  >
                    <WhatsAppIcon className="w-4 h-4" /> Send on WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      const cleanPhone = (detailsLead.phone || '').replace(/[^0-9]/g, '');
                      const previewLink = detailsLead.previewUrl || (detailsLead.prototypeId ? `https://mox.infni-t.online/preview/${detailsLead.prototypeId}` : '');
                      const message = detailsLead.whatsappDraft || `Hi ${detailsLead.name} Team! We built a custom live mobile prototype for your brand: ${previewLink || 'https://mox.infni-t.online'} - Let me know what you think!`;
                      navigator.clipboard.writeText(message);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
                  >
                    Copy Text
                  </button>
                </div>
              </div>

              {detailsLead.insights && (
                <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 max-h-[50vh] overflow-y-auto custom-scrollbar">
                  <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Strategic Insight
                  </h4>
                  {(() => {
                    try {
                      const parsed = JSON.parse(detailsLead.insights);
                      return (
                        <div className="space-y-6">
                          <div>
                            <h5 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Market Position</h5>
                            <p className="text-zinc-300 text-sm leading-relaxed">{parsed.marketPosition}</p>
                          </div>
                          <div>
                            <h5 className="text-xs font-medium text-rose-500/80 uppercase tracking-wider mb-2">Critical Weaknesses</h5>
                            <ul className="space-y-2">
                              {parsed.weaknesses?.map((w: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                  <span className="text-rose-500/50 mt-0.5">•</span> {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10">
                            <h5 className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-2">Closing Hook</h5>
                            <p className="text-zinc-200 font-medium text-sm leading-relaxed">{parsed.closingHook}</p>
                          </div>
                        </div>
                      );
                    } catch (e) {
                      return (
                        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {detailsLead.insights}
                        </p>
                      );
                    }
                  })()}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? All associated data will be lost. This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => {
          if (deleteConfirm.leadId) {
            onDeleteLead(deleteConfirm.leadId);
          }
        }}
        onCancel={() => setDeleteConfirm({ isOpen: false, leadId: '' })}
      />

      {/* Interactive Enriched Lead Details Drawer */}
      <LeadDetailsDrawer
        lead={drawerLead}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={handleStatusChange}
        onGeneratePrototype={(l) => handleGenerateClick(l)}
        onOpenOutreach={() => onNavigate('outreach')}
        onEditLead={(l) => setEditLead(l)}
        onOpenFiles={(id) => onSelectLead(id)}
      />
    </div>
  );
}
