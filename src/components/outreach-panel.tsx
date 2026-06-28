import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Send, Loader2, Target, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';
import { Lead } from '@/App';
import { ai } from '@/lib/ai';
import { useModels } from '@/contexts/model-context';

interface OutreachPanelProps {
  leads: Lead[];
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
}

export function OutreachPanel({ leads, onUpdateLead }: OutreachPanelProps) {
  const { models } = useModels();
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [outreachType, setOutreachType] = useState<'email' | 'whatsapp' | 'linkedin'>('email');
  const [tone, setTone] = useState<'professional' | 'casual' | 'urgent' | 'value-first'>('value-first');
  const [instructions, setInstructions] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');

  const safeCopyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text).then(() => {
        // Success
      }).catch(err => {
        console.error('Clipboard write failed:', err);
      });
    } catch (err) {
      console.error('Clipboard write threw:', err);
    }
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const handleGenerate = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);

    try {
      const agentMode = localStorage.getItem('agentMode') || 'solo';
      const persona = agentMode === 'agency' 
        ? 'Write as a professional agency team ("we", "our team").' 
        : 'Write as a solo contractor / freelancer ("I", "my").';

      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const prototypeUrl = selectedLead.prototypeId ? `${baseUrl}/preview/${selectedLead.prototypeId}` : 'No prototype built yet, emphasize that we CAN build one.';

      const prompt = `Write a highly converting 4-Step ${outreachType} follow-up sequence for a local business named "${selectedLead.name}" in the ${selectedLead.niche} niche.
      ${persona}
      Tone: ${tone}
      
      CRITICAL - The Live Prototype URL: ${prototypeUrl}
      (If a URL is provided, you MUST include it naturally into the FIRST pitch as a "value-first" gesture, showing we already did the work.)
      
      Format the output clearly separating:
      **Step 1: Initial Hook & Value (Day 1)**
      **Step 2: Case Study / Quick Bump (Day 3)**
      **Step 3: New Angle / Idea (Day 7)**
      **Step 4: Breakup / Final Attempt (Day 12)**
      
      ${selectedLead.insights ? `Use these strategic insights to personalize the pitch: ${selectedLead.insights}` : ''}
      ${instructions ? `Additional instructions from the user: ${instructions}` : ''}
      
      Do not use generic templates. Make it sound like a real human wrote it. Make sure the calls to action are soft and clear.`;

      const response = await ai.models.generateContent({
        model: models.fast,
        contents: prompt,
      });

      setGeneratedMessage(response.text || '');
    } catch (error) {
      console.error('Error generating outreach:', error);
      alert('Failed to generate message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedLead || !generatedMessage) return;
    
    const targetEmail = selectedLead.email || prompt("Please enter the recipient's email address:");
    if (!targetEmail) return;

    setIsSendingEmail(true);

    try {
      const senderName = localStorage.getItem('brevoSenderName') || 'MoX Hunter Agent';
      const senderEmail = localStorage.getItem('brevoSenderEmail') || 'agent@moxhunter.com';

      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetEmail,
          subject: `Outreach from MoX Hunter`,
          htmlContent: `<div style="font-family: sans-serif; white-space: pre-wrap;">${generatedMessage}</div>`,
          senderName,
          senderEmail
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }
      
      onUpdateLead(selectedLead.id, { 
        status: 'Contacted', 
        lastActionDate: Date.now(),
        nextFollowUpDate: Date.now() + (3 * 24 * 60 * 60 * 1000) 
      });
      alert('Email sent successfully via Brevo!');
    } catch (error: any) {
      console.error('Email send failed:', error);
      alert(error.message || 'Failed to send email. Check console for details.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <Mail className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-zinc-100 mb-4">Outreach & Pitching</h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Select a lead, choose your channel, and let the AI draft a hyper-personalized pitch using the assets you&apos;ve built.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" /> 1. Select Target
              </h3>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="">-- Choose a Lead --</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>{lead.name} ({lead.niche})</option>
                ))}
              </select>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" /> 2. Channel & Tone
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(['email', 'whatsapp', 'linkedin'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOutreachType(type)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium capitalize transition-all border ${
                      outreachType === type 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {(['value-first', 'professional', 'casual', 'urgent'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium capitalize transition-all border ${
                      tone === t 
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> 3. Instructions (Optional)
              </h3>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g., Mention the new website prototype we built for them. Keep it under 100 words."
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 resize-none"
              />
              <button
                onClick={handleGenerate}
                disabled={!selectedLeadId || isGenerating}
                className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Draft Pitch
              </button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl h-full min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Generated Message
                </h3>
                {generatedMessage && selectedLead && (
                  <div className="flex items-center gap-2">
                    {outreachType === 'email' && (
                      <button 
                        onClick={handleSendEmail}
                        disabled={isSendingEmail}
                        className="text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Send via Brevo
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        safeCopyToClipboard(generatedMessage);
                        onUpdateLead(selectedLead.id, { 
                          status: 'Contacted', 
                          lastActionDate: Date.now(),
                          nextFollowUpDate: Date.now() + (3 * 24 * 60 * 60 * 1000) // Default 3 days 
                        });
                        alert('Copied to clipboard and marked as Contacted! Follow-up scheduled in 3 days.');
                      }}
                      className="text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-lg border border-emerald-500/20 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Copy & Log as Contacted
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-zinc-950 rounded-xl p-6 border border-zinc-800/50 overflow-y-auto no-scrollbar custom-scrollbar">
                {generatedMessage ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{generatedMessage}</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                    <Mail className="w-12 h-12 opacity-20" />
                    <p>Select a lead and generate a pitch to see it here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
