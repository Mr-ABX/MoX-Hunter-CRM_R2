import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Star, 
  Send, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle2, 
  LayoutTemplate, 
  RefreshCw, 
  Zap, 
  Share2, 
  FolderOpen, 
  PenTool, 
  Flame, 
  Eye, 
  Maximize2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Lead } from '@/App';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface LeadDetailsDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (leadId: string, status: Lead['status']) => void;
  onGeneratePrototype?: (lead: Lead, type: 'auto' | 'manual') => void;
  onOpenOutreach?: (lead: Lead) => void;
  onEditLead?: (lead: Lead) => void;
  onOpenFiles?: (leadId: string) => void;
}

export interface OutreachLogItem {
  id: string;
  leadId?: string;
  businessName?: string;
  recipient?: string;
  subject?: string;
  body?: string;
  previewUrl?: string;
  status?: string;
  createdAt?: number | string;
}

export function LeadDetailsDrawer({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
  onGeneratePrototype,
  onOpenOutreach,
  onEditLead,
  onOpenFiles
}: LeadDetailsDrawerProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showIframePreview, setShowIframePreview] = useState(false);
  const [outreachHistory, setOutreachHistory] = useState<OutreachLogItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  // Fetch outreach logs from Firestore for this specific lead
  useEffect(() => {
    if (!lead || !isOpen) return;

    let isMounted = true;
    const fetchLeadOutreach = async () => {
      setIsLoadingHistory(true);
      try {
        const logsRef = collection(db, 'outreach_logs');
        const q = query(
          logsRef,
          where('leadId', '==', lead.id),
          limit(20)
        );
        const snapshot = await getDocs(q);
        if (isMounted) {
          const logs: OutreachLogItem[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as any)
          }));
          
          // Merge with lead.activities if present
          if (lead.activities && Array.isArray(lead.activities)) {
            lead.activities.forEach((act, idx) => {
              if (!logs.find(l => l.subject === act.subject && l.recipient === act.recipient)) {
                logs.push({
                  id: `activity-${idx}`,
                  leadId: lead.id,
                  businessName: lead.name,
                  recipient: act.recipient || lead.email,
                  subject: act.subject || 'Outreach Update',
                  body: act.body || '',
                  status: act.status || 'sent',
                  createdAt: act.sentAt || Date.now()
                });
              }
            });
          }

          logs.sort((a, b) => {
            const timeA = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt || 0).getTime();
            const timeB = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
          });

          setOutreachHistory(logs);
        }
      } catch (err) {
        console.error('Error fetching lead outreach history:', err);
        // Fallback to lead.activities
        if (lead.activities && Array.isArray(lead.activities) && isMounted) {
          const fallbackLogs: OutreachLogItem[] = lead.activities.map((act, idx) => ({
            id: `act-${idx}`,
            leadId: lead.id,
            businessName: lead.name,
            recipient: act.recipient || lead.email,
            subject: act.subject || 'Outreach Email',
            body: act.body || '',
            status: act.status || 'sent',
            createdAt: act.sentAt || Date.now()
          }));
          setOutreachHistory(fallbackLogs);
        }
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    fetchLeadOutreach();
    return () => {
      isMounted = false;
    };
  }, [lead?.id, isOpen]);

  if (!lead) return null;

  // Clean phone numbers
  const rawPhone = lead.phone || '';
  const digitsOnlyPhone = rawPhone.replace(/\D/g, '');
  const telLink = rawPhone ? `tel:${rawPhone.replace(/[^0-9+]/g, '')}` : null;
  const waLink = digitsOnlyPhone ? `https://wa.me/${digitsOnlyPhone}` : null;

  // Google Maps Query
  const mapsSearchQuery = encodeURIComponent(`${lead.name} ${lead.city || ''}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsSearchQuery}`;

  // Website status
  const hasWebsite = Boolean(
    lead.website && 
    lead.website.trim() !== '' && 
    !lead.website.toLowerCase().includes('n/a') && 
    !lead.website.toLowerCase().includes('none') &&
    !lead.website.toLowerCase().includes('not available')
  );
  const normalizedWebsite = lead.website?.startsWith('http') 
    ? lead.website 
    : `https://${lead.website}`;

  // Extract / normalize Social URLs
  const parseSocials = (socialsInput: any): { platform: string; url: string; label: string }[] => {
    if (!socialsInput) return [];
    const list: { platform: string; url: string; label: string }[] = [];

    if (Array.isArray(socialsInput)) {
      socialsInput.forEach(urlStr => {
        if (typeof urlStr === 'string' && urlStr.trim()) {
          const lower = urlStr.toLowerCase();
          let platform = 'social';
          let label = 'Social Link';
          if (lower.includes('facebook.com') || lower.includes('fb.me')) {
            platform = 'facebook';
            label = 'Facebook';
          } else if (lower.includes('instagram.com')) {
            platform = 'instagram';
            label = 'Instagram';
          } else if (lower.includes('linkedin.com')) {
            platform = 'linkedin';
            label = 'LinkedIn';
          } else if (lower.includes('twitter.com') || lower.includes('x.com')) {
            platform = 'twitter';
            label = 'X / Twitter';
          } else if (lower.includes('youtube.com')) {
            platform = 'youtube';
            label = 'YouTube';
          } else if (lower.includes('tiktok.com')) {
            platform = 'tiktok';
            label = 'TikTok';
          }
          list.push({ platform, url: urlStr.startsWith('http') ? urlStr : `https://${urlStr}`, label });
        }
      });
    } else if (typeof socialsInput === 'object') {
      Object.entries(socialsInput).forEach(([key, val]) => {
        if (val && typeof val === 'string' && val.trim()) {
          list.push({
            platform: key.toLowerCase(),
            url: val.startsWith('http') ? val : `https://${val}`,
            label: key.charAt(0).toUpperCase() + key.slice(1)
          });
        }
      });
    }
    return list;
  };

  const socialLinks = parseSocials(lead.socials);

  // Prototype Link
  const prototypeUrl = lead.previewUrl || (lead.prototypeId ? `/preview/${lead.prototypeId}` : null);

  // Colors list
  const brandColors = Array.isArray(lead.colors) && lead.colors.length > 0
    ? lead.colors
    : ['#6366F1', '#EC4899', '#3B82F6']; // Tasteful fallback palette

  // Status Badge Helper
  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'Qualified':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]"><Clock className="w-3.5 h-3.5" /> Qualified</span>;
      case 'Built':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]"><LayoutTemplate className="w-3.5 h-3.5" /> Built</span>;
      case 'Contacted':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"><Send className="w-3.5 h-3.5" /> Contacted</span>;
      case 'Negotiating':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]"><RefreshCw className="w-3.5 h-3.5" /> Negotiating</span>;
      case 'Closed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"><CheckCircle2 className="w-3.5 h-3.5" /> Closed Won</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-700/30 text-zinc-300 border border-zinc-700/50">{status}</span>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-2xl h-full bg-zinc-950/95 border-l border-zinc-800/80 shadow-2xl flex flex-col z-10 backdrop-blur-2xl overflow-hidden"
          >
            {/* Header Glow Ambient Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 shrink-0" />

            {/* Top Control Bar */}
            <div className="px-6 py-5 border-b border-zinc-800/70 flex items-center justify-between shrink-0 bg-zinc-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-display text-base shadow-sm">
                  {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">Lead Dossier</span>
                  <h2 className="text-xl font-bold font-display text-zinc-100 truncate max-w-sm">{lead.name}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEditLead && (
                  <button
                    onClick={() => { onClose(); onEditLead(lead); }}
                    className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-xl transition-all border border-zinc-800/60 text-xs font-medium flex items-center gap-1.5"
                    title="Edit Lead"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-xl transition-all border border-zinc-800/60"
                  title="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Enriched Profile Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">

              {/* 1. Core Profile & Status Summary */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-100 tracking-tight">{lead.name}</h3>
                    <p className="text-sm text-zinc-400 mt-0.5 flex items-center gap-2">
                      <span className="font-medium text-zinc-300">{lead.niche || lead.industry || 'General Industry'}</span>
                      <span>•</span>
                      <span className="text-zinc-400">{lead.city || 'Location Pending'}</span>
                    </p>
                  </div>

                  {/* Status Switcher */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="relative inline-block">
                      {getStatusBadge(lead.status)}
                      {onUpdateStatus && (
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateStatus(lead.id, e.target.value as Lead['status'])}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        >
                          <option value="Qualified">Qualified</option>
                          <option value="Built">Built</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Negotiating">Negotiating</option>
                          <option value="Closed">Closed Won</option>
                        </select>
                      )}
                    </div>
                    {onUpdateStatus && (
                      <span className="text-[10px] text-zinc-500">Click badge to change</span>
                    )}
                  </div>
                </div>

                {/* Star Rating & Review Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/60">
                  {/* Google Rating */}
                  <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Google Rating
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-bold text-amber-400">
                        {lead.rating ? `${lead.rating}★` : '4.8★'}
                      </span>
                      <span className="text-xs text-zinc-500">
                        ({lead.reviews ? `${lead.reviews} reviews` : '45+ reviews'})
                      </span>
                    </div>
                  </div>

                  {/* MoX Score */}
                  <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> MoX Lead Score
                    </span>
                    <span className="text-lg font-bold text-indigo-400 mt-1">
                      {lead.score ? `${lead.score}/100` : '88/100'}
                    </span>
                  </div>

                  {/* Estimated Deal Value */}
                  <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3 text-emerald-400" /> Deal Value
                    </span>
                    <span className="text-lg font-bold text-emerald-400 mt-1">
                      {lead.dealValue ? `$${lead.dealValue.toLocaleString()}` : '$1,500'}
                    </span>
                  </div>

                  {/* Website State */}
                  <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3 text-cyan-400" /> Web Status
                    </span>
                    <span className={`text-xs font-bold mt-1.5 truncate ${hasWebsite ? 'text-zinc-300' : 'text-amber-400'}`}>
                      {hasWebsite ? 'Active Site' : 'No Website'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Direct Actions & Communication Channels */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" /> Contact & Location Channels
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone Direct */}
                  {telLink ? (
                    <a
                      href={telLink}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-500">Direct Phone</span>
                          <p className="text-sm font-semibold text-zinc-200 group-hover:text-indigo-300">{lead.phone}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/40 text-zinc-500">
                      <Phone className="w-4 h-4 text-zinc-600" />
                      <span className="text-xs">No Phone Number Listed</span>
                    </div>
                  )}

                  {/* WhatsApp Direct */}
                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          WA
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-400/80">WhatsApp Chat</span>
                          <p className="text-sm font-semibold text-emerald-300">Open WhatsApp</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-emerald-500" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/40 text-zinc-500">
                      <MessageSquare className="w-4 h-4 text-zinc-600" />
                      <span className="text-xs">WhatsApp Unavailable</span>
                    </div>
                  )}

                  {/* Email Direct */}
                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="truncate max-w-[190px]">
                          <span className="text-[10px] uppercase font-bold text-zinc-500">Email Address</span>
                          <p className="text-sm font-semibold text-zinc-200 group-hover:text-blue-300 truncate">{lead.email}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-blue-400" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/40 text-zinc-500">
                      <Mail className="w-4 h-4 text-zinc-600" />
                      <span className="text-xs">No Direct Email Listed</span>
                    </div>
                  )}

                  {/* Google Maps Direct Button */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Location Map</span>
                        <p className="text-sm font-semibold text-zinc-200 group-hover:text-rose-300">View on Google Maps</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-rose-400" />
                  </a>
                </div>
              </div>

              {/* 3. Website & Opportunity Target Badge */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-3">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" /> Online Presence & Digital Footprint
                </h4>

                {hasWebsite ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Current Website</span>
                        <p className="text-sm font-medium text-cyan-300 truncate">{lead.website}</p>
                      </div>
                    </div>
                    <a
                      href={normalizedWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold transition-all"
                    >
                      Visit Site <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 flex items-center gap-3 shadow-lg shadow-amber-500/5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 animate-pulse">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wide">
                        No Website (High Value Target)
                      </span>
                      <p className="text-xs text-zinc-400 mt-1">
                        This business has strong footfall or reviews but no modern web presence — ideal candidate for a rapid prototype pitch.
                      </p>
                    </div>
                  </div>
                )}

                {/* Social Media Badges */}
                <div className="mt-4 pt-4 border-t border-zinc-800/60">
                  <span className="text-xs font-semibold text-zinc-400 block mb-2.5">Social Profiles</span>
                  {socialLinks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-xs font-medium text-zinc-300 hover:text-indigo-300 transition-all shadow-sm"
                        >
                          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{s.label}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-500">
                      <AlertCircle className="w-3.5 h-3.5 text-zinc-600" />
                      <span>No Socials Found</span>
                    </div>
                  )}
                </div>

                {/* Brand Color Swatches */}
                <div className="mt-4 pt-4 border-t border-zinc-800/60">
                  <span className="text-xs font-semibold text-zinc-400 block mb-2.5">Brand Color Palette</span>
                  <div className="flex items-center gap-3">
                    {brandColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopy(color, `Color ${color}`)}
                        className="group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all text-xs text-zinc-300"
                        title="Click to copy HEX"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-mono text-[11px] text-zinc-400 group-hover:text-zinc-200">{color}</span>
                        {copiedText === `Color ${color}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Linked Prototype & Interactive Preview */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" /> Live Prototype Asset
                  </h4>
                  {prototypeUrl && (
                    <button
                      onClick={() => setShowIframePreview(!showIframePreview)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {showIframePreview ? 'Hide Inline Preview' : 'Show Live Preview'}
                    </button>
                  )}
                </div>

                {prototypeUrl ? (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-zinc-100">{lead.name} Pitch Prototype</h5>
                          <p className="text-xs text-indigo-300/80 truncate max-w-xs">{prototypeUrl}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={prototypeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20"
                        >
                          Launch in New Tab <Maximize2 className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Inline Iframe Preview Box */}
                    {showIframePreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 420 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner relative"
                      >
                        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            <span className="text-[11px] font-mono text-zinc-500 ml-2 truncate">{prototypeUrl}</span>
                          </div>
                          <a href={prototypeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-white">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <iframe
                          src={prototypeUrl}
                          title={`${lead.name} Prototype Preview`}
                          className="w-full h-[375px] border-0"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">No prototype built yet</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Generate an interactive bespoke prototype to pitch to this lead.</p>
                    </div>
                    {onGeneratePrototype && (
                      <button
                        onClick={() => { onClose(); onGeneratePrototype(lead, 'auto'); }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                      >
                        <Zap className="w-4 h-4" /> Generate Prototype
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 5. Strategic Insights & Pitch Angles */}
              {lead.insights && (
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> AI Strategic Insights & Market Angle
                  </h4>
                  
                  {(() => {
                    try {
                      const parsed = JSON.parse(lead.insights);
                      return (
                        <div className="space-y-4 text-sm">
                          {parsed.marketPosition && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">Market Position</span>
                              <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-xl border border-zinc-800/60">{parsed.marketPosition}</p>
                            </div>
                          )}
                          {parsed.weaknesses && Array.isArray(parsed.weaknesses) && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-rose-400/80 tracking-wider block mb-1">Key Weaknesses / Conversion Gaps</span>
                              <ul className="space-y-1.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800/60">
                                {parsed.weaknesses.map((w: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                                    <span className="text-rose-400 font-bold">•</span>
                                    <span>{w}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {parsed.closingHook && (
                            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">Recommended Pitch Hook</span>
                              <p className="text-xs font-medium text-indigo-200">{parsed.closingHook}</p>
                            </div>
                          )}
                        </div>
                      );
                    } catch (e) {
                      return (
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {lead.insights}
                        </div>
                      );
                    }
                  })()}
                </div>
              )}

              {/* 6. Outreach History */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-blue-400" /> Outreach History ({outreachHistory.length})
                  </h4>
                  {onOpenOutreach && (
                    <button
                      onClick={() => { onClose(); onOpenOutreach(lead); }}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" /> Draft New Pitch
                    </button>
                  )}
                </div>

                {isLoadingHistory ? (
                  <div className="p-4 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading outreach history...
                  </div>
                ) : outreachHistory.length > 0 ? (
                  <div className="space-y-2.5">
                    {outreachHistory.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col gap-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-200 truncate max-w-[280px]">{item.subject || 'Outreach Email'}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                            {item.status || 'Sent'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                          <span>To: {item.recipient || lead.email || 'N/A'}</span>
                          <span>
                            {item.createdAt 
                              ? typeof item.createdAt === 'number' 
                                ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                : new Date(item.createdAt).toLocaleDateString()
                              : 'Recent'}
                          </span>
                        </div>
                        {item.body && (
                          <p className="text-zinc-400 text-[11px] line-clamp-2 mt-1 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/40">
                            {item.body.replace(/<[^>]*>?/gm, '')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center">
                    <p className="text-xs text-zinc-500">No outreach logged yet for this lead.</p>
                    {onOpenOutreach && (
                      <button
                        onClick={() => { onClose(); onOpenOutreach(lead); }}
                        className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                      >
                        Start First Pitch Campaign →
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 px-6 border-t border-zinc-800/80 bg-zinc-950/90 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {onOpenFiles && (
                  <button
                    onClick={() => { onClose(); onOpenFiles(lead.id); }}
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl border border-zinc-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-indigo-400" /> Files & Assets
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onOpenOutreach && (
                  <button
                    onClick={() => { onClose(); onOpenOutreach(lead); }}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-blue-400" /> Pitch Sequence
                  </button>
                )}
                {onGeneratePrototype && (
                  <button
                    onClick={() => { onClose(); onGeneratePrototype(lead, 'auto'); }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Zap className="w-4 h-4" /> {lead.prototypeId ? 'Rebuild Prototype' : 'Auto-Build Prototype'}
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
