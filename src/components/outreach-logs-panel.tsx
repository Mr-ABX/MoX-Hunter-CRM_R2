import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Send, 
  Search, 
  Filter, 
  Clock, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Building2, 
  User, 
  Calendar, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  LayoutTemplate,
  Inbox,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Lead } from '@/App';
import { collection, onSnapshot, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LeadDetailsDrawer } from './leads-panel';

export interface OutreachLog {
  id: string;
  leadId?: string;
  businessName?: string;
  industry?: string;
  recipient: string;
  senderName?: string;
  senderEmail?: string;
  subject: string;
  body?: string;
  htmlContent?: string;
  previewUrl?: string;
  status: 'sent' | 'delivered' | 'opened' | 'failed' | string;
  createdAt: number | string;
}

interface OutreachLogsPanelProps {
  leads: Lead[];
  onNavigate?: (view: string) => void;
  onSelectLead?: (leadId: string) => void;
}

export function OutreachLogsPanel({ leads, onNavigate, onSelectLead }: OutreachLogsPanelProps) {
  const [logs, setLogs] = useState<OutreachLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modals & Drawers
  const [selectedEmailPreview, setSelectedEmailPreview] = useState<OutreachLog | null>(null);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Subscribe to Firestore outreach_logs collection
  useEffect(() => {
    try {
      const logsRef = collection(db, 'outreach_logs');
      const q = query(logsRef, orderBy('createdAt', 'desc'), limit(150));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedLogs: OutreachLog[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...(docSnap.data() as any)
        }));
        
        // Also merge any lead activities if they haven't synced to outreach_logs yet
        leads.forEach(lead => {
          if (lead.activities && Array.isArray(lead.activities)) {
            lead.activities.forEach((act, idx) => {
              const alreadyExists = fetchedLogs.some(
                l => l.leadId === lead.id && l.subject === act.subject && l.recipient === (act.recipient || lead.email)
              );
              if (!alreadyExists && (act.subject || act.recipient)) {
                fetchedLogs.push({
                  id: `lead-act-${lead.id}-${idx}`,
                  leadId: lead.id,
                  businessName: lead.name,
                  industry: lead.niche || lead.industry,
                  recipient: act.recipient || lead.email || 'recipient@target.com',
                  subject: act.subject || 'Outreach Pitch',
                  body: act.body || '',
                  previewUrl: lead.previewUrl,
                  status: act.status || 'sent',
                  createdAt: act.sentAt || Date.now()
                });
              }
            });
          }
        });

        // Sort by createdAt descending
        fetchedLogs.sort((a, b) => {
          const timeA = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt || 0).getTime();
          const timeB = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });

        setLogs(fetchedLogs);
        setLoading(false);
      }, (error) => {
        console.error('Error in outreach_logs snapshot:', error);
        // Fallback from leads directly
        const fallback: OutreachLog[] = [];
        leads.forEach(lead => {
          if (lead.activities && Array.isArray(lead.activities)) {
            lead.activities.forEach((act, idx) => {
              fallback.push({
                id: `fb-${lead.id}-${idx}`,
                leadId: lead.id,
                businessName: lead.name,
                industry: lead.niche || lead.industry,
                recipient: act.recipient || lead.email || 'recipient@target.com',
                subject: act.subject || 'Outreach Pitch',
                body: act.body || '',
                previewUrl: lead.previewUrl,
                status: act.status || 'sent',
                createdAt: act.sentAt || Date.now()
              });
            });
          }
        });
        setLogs(fallback);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error('Failed to initialize outreach logs query:', e);
      setLoading(false);
    }
  }, [leads]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Inspect Lead Details Drawer
  const handleOpenLeadDrawer = (log: OutreachLog) => {
    let matchedLead: Lead | undefined;
    if (log.leadId) {
      matchedLead = leads.find(l => l.id === log.leadId);
    }
    if (!matchedLead && log.businessName) {
      matchedLead = leads.find(l => l.name.toLowerCase() === log.businessName?.toLowerCase());
    }

    if (matchedLead) {
      setDrawerLead(matchedLead);
      setIsDrawerOpen(true);
    } else {
      // Create lightweight lead object for drawer
      const tempLead: Lead = {
        id: log.leadId || `temp-${log.id}`,
        name: log.businessName || 'Target Business',
        niche: log.industry || 'General',
        city: 'Detected via Outreach',
        status: 'Contacted',
        email: log.recipient,
        previewUrl: log.previewUrl
      };
      setDrawerLead(tempLead);
      setIsDrawerOpen(true);
    }
  };

  // Calculate Metrics
  const totalSent = logs.length;
  const successfulDelivered = logs.filter(l => l.status === 'sent' || l.status === 'delivered' || l.status === 'opened').length;
  const deliveryRate = totalSent > 0 ? Math.round((successfulDelivered / totalSent) * 100) : 100;
  const withPrototypeCount = logs.filter(l => Boolean(l.previewUrl)).length;
  const prototypeRate = totalSent > 0 ? Math.round((withPrototypeCount / totalSent) * 100) : 0;

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.recipient || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      log.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'opened') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
        </span>
      );
    }
    if (s === 'failed' || s === 'bounced') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <AlertCircle className="w-3.5 h-3.5" /> Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
        <Send className="w-3.5 h-3.5" /> Sent
      </span>
    );
  };

  const formatDate = (val: number | string) => {
    if (!val) return 'Recently';
    const dateObj = typeof val === 'number' ? new Date(val) : new Date(val);
    if (isNaN(dateObj.getTime())) return 'Recently';
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-6 lg:p-10 relative">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                <Inbox className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-display font-bold text-zinc-100">Outreach Logs & Delivery</h1>
            </div>
            <p className="text-sm text-zinc-400">
              Audit and monitor all personalized email pitches, prototype delivery links, and cold outreach activity.
            </p>
          </div>

          {onNavigate && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('outreach')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all"
              >
                <Send className="w-4 h-4" /> Launch New Pitch Campaign
              </button>
            </div>
          )}
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Pitches Sent</span>
              <Send className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100 mt-2">{totalSent}</p>
            <span className="text-[11px] text-zinc-500 mt-1 block">Live tracked emails</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Delivery Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{deliveryRate}%</p>
            <span className="text-[11px] text-zinc-500 mt-1 block">{successfulDelivered} delivered successfully</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Prototypes Linked</span>
              <LayoutTemplate className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400 mt-2">{withPrototypeCount}</p>
            <span className="text-[11px] text-zinc-500 mt-1 block">{prototypeRate}% pitches include interactive sites</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Contacts</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-400 mt-2">{leads.filter(l => l.status === 'Contacted' || l.status === 'Negotiating').length}</p>
            <span className="text-[11px] text-zinc-500 mt-1 block">In pipeline conversation</span>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business, email, or subject..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="all">All Statuses ({logs.length})</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered / Opened</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Main Logs Table */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs">Loading live outreach logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-16 text-center text-zinc-500 space-y-3">
              <Inbox className="w-10 h-10 mx-auto text-zinc-600" />
              <h3 className="text-base font-semibold text-zinc-300">No Outreach Logs Found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No logs match your current search criteria. Try clearing the filter.' 
                  : 'Start sending personalized email pitches from the Outreach tab to populate this live delivery ledger.'}
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('outreach')}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Go to Outreach Pitcher
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 bg-zinc-950/70 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Timestamp</th>
                    <th className="py-3.5 px-5">Target Business</th>
                    <th className="py-3.5 px-5">Recipient Email</th>
                    <th className="py-3.5 px-5">Subject Line</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Prototype Link</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-xs">
                  {filteredLogs.map((log) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-5 text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                        {formatDate(log.createdAt)}
                      </td>

                      {/* Business Name */}
                      <td className="py-3.5 px-5">
                        <button
                          onClick={() => handleOpenLeadDrawer(log)}
                          className="font-semibold text-zinc-100 hover:text-indigo-400 transition-colors flex items-center gap-1.5 group-hover:underline"
                        >
                          <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{log.businessName || 'Target Business'}</span>
                        </button>
                        {log.industry && (
                          <span className="text-[10px] text-zinc-500 block ml-5">{log.industry}</span>
                        )}
                      </td>

                      {/* Recipient */}
                      <td className="py-3.5 px-5 text-zinc-300 font-mono text-[11px]">
                        <span className="bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800/60">
                          {log.recipient}
                        </span>
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-5 text-zinc-200 max-w-xs truncate font-medium">
                        {log.subject || 'Personalized Pitch'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        {getStatusBadge(log.status)}
                      </td>

                      {/* Prototype Link */}
                      <td className="py-3.5 px-5">
                        {log.previewUrl ? (
                          <a
                            href={log.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-medium transition-all"
                          >
                            <LayoutTemplate className="w-3 h-3" />
                            <span>Preview Site</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-zinc-600 text-[11px]">No link attached</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedEmailPreview(log)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-semibold transition-all"
                            title="View Full Email Body"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>View Body</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Email Body Preview Modal */}
      <AnimatePresence>
        {selectedEmailPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedEmailPreview(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Top Bar */}
              <div className="flex items-start justify-between pb-4 border-b border-zinc-800 shrink-0">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Outreach Email Record</span>
                  <h3 className="text-lg font-bold text-zinc-100 mt-0.5">{selectedEmailPreview.subject}</h3>
                </div>
                <button
                  onClick={() => setSelectedEmailPreview(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metadata Details */}
              <div className="py-4 border-b border-zinc-800/80 space-y-2 text-xs text-zinc-400 shrink-0">
                <div className="flex items-center justify-between">
                  <span><strong>To:</strong> <span className="text-zinc-200 font-mono">{selectedEmailPreview.recipient}</span></span>
                  <span><strong>Status:</strong> {getStatusBadge(selectedEmailPreview.status)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span><strong>Business:</strong> <span className="text-zinc-200">{selectedEmailPreview.businessName || 'Target Business'}</span></span>
                  <span><strong>Sent:</strong> <span className="text-zinc-300 font-mono">{formatDate(selectedEmailPreview.createdAt)}</span></span>
                </div>
                {selectedEmailPreview.previewUrl && (
                  <div className="flex items-center gap-2 pt-1">
                    <strong>Attached Prototype:</strong>
                    <a
                      href={selectedEmailPreview.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline font-mono text-[11px] truncate max-w-xs"
                    >
                      {selectedEmailPreview.previewUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Email Content Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar py-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Message Body</span>
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedEmailPreview.body || selectedEmailPreview.htmlContent?.replace(/<[^>]*>?/gm, '') || 'No text body captured.'}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => handleCopy(selectedEmailPreview.body || '', 'body')}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  {copiedText === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'body' ? 'Copied Body' : 'Copy Content'}</span>
                </button>

                <button
                  onClick={() => setSelectedEmailPreview(null)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lead Details Drawer */}
      <LeadDetailsDrawer
        lead={drawerLead}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenOutreach={() => {
          setIsDrawerOpen(false);
          if (onNavigate) onNavigate('outreach');
        }}
        onOpenFiles={(leadId) => {
          setIsDrawerOpen(false);
          if (onSelectLead) onSelectLead(leadId);
        }}
      />
    </div>
  );
}
