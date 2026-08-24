import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Send, Loader2, Target, CheckCircle2, FileText, Copy, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Lead } from '@/App';
import { ai } from '@/lib/ai';
import { useModels } from '@/contexts/model-context';

interface OutreachPanelProps {
  leads: Lead[];
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
}

interface OutreachStep {
  id: string;
  title: string;
  subject: string;
  body: string;
}

function parseSteps(text: string, type: 'email' | 'whatsapp' | 'linkedin'): OutreachStep[] {
  if (!text) return [];
  
  // Normalize and split by STEP with optional brackets or numbers
  const parts = text.split(/\[?STEP\s+/i);
  const steps: OutreachStep[] = [];
  
  parts.forEach((part) => {
    if (!part.trim()) return;
    
    // Check if this part starts with a digit representing a step number
    const match = part.trim().match(/^(\d+)[^]*$/);
    if (!match) return;
    
    const stepNum = match[1];
    
    // Find title ending (usually marked by ']' or a newline)
    let titleEndIndex = part.indexOf(']');
    if (titleEndIndex === -1) {
      titleEndIndex = part.indexOf('\n');
    }
    
    if (titleEndIndex === -1) return;
    
    let titleStr = part.substring(0, titleEndIndex).replace(/^[:\s\d]+/, '').trim();
    if (!titleStr) {
      titleStr = stepNum === '1' ? 'Initial Hook' : stepNum === '2' ? 'Value Bump' : stepNum === '3' ? 'New Angle' : 'Friendly Breakup';
    }
    const remaining = part.substring(titleEndIndex + 1).trim();
    
    // Find subject line
    let subject = '';
    let body = remaining;
    
    const subjectMatch = remaining.match(/^(Subject:\s*)(.*)$/m);
    if (subjectMatch) {
      subject = subjectMatch[2].trim();
      body = remaining.replace(/^(Subject:\s*)(.*)$/m, '').trim();
    }
    
    steps.push({
      id: `step${stepNum}`,
      title: `Step ${stepNum}: ${titleStr}`,
      subject,
      body: body.trim()
    });
  });
  
  // Fallback parsing if split didn't find multiple steps
  if (steps.length === 0 && text.trim()) {
    steps.push({
      id: 'step1',
      title: 'Draft Pitch',
      subject: type === 'email' ? 'Quick idea for your business' : '',
      body: text.trim()
    });
  }
  
  return steps;
}

export function OutreachPanel({ leads, onUpdateLead }: OutreachPanelProps) {
  const { models } = useModels();
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [outreachType, setOutreachType] = useState<'email' | 'whatsapp' | 'linkedin'>('email');
  const [tone, setTone] = useState<'professional' | 'casual' | 'urgent' | 'value-first'>('value-first');
  const [instructions, setInstructions] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [activeTab, setActiveTab] = useState<string>('step1');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const safeCopyToClipboard = (text: string, fieldId: string) => {
    try {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
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
  const steps = parseSteps(generatedMessage, outreachType);

  const handleGenerate = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    setGeneratedMessage('');

    try {
      const agentMode = localStorage.getItem('agentMode') || 'solo';
      const persona = agentMode === 'agency' 
        ? 'Write as an elite digital growth agency team ("we", "our team").' 
        : 'Write as a solo growth consultant and developer ("I", "my").';

      const customDomain = localStorage.getItem('customDomain');
      const baseUrl = customDomain || import.meta.env.VITE_APP_URL || window.location.origin;
      const prototypeUrl = selectedLead.prototypeId ? `${baseUrl}/preview/${selectedLead.prototypeId}` : '';

      const prompt = `You are an elite, high-converting B2B growth and digital marketing copywriter.
Your task is to write a highly converting 4-Step ${outreachType} follow-up sequence for a local business named "${selectedLead.name}" in the "${selectedLead.niche}" niche.
${persona}
Tone: ${tone}

CRITICAL RULES FOR COPRYWRITING PURITY:
1. NO INTROS OR OUTROS: Only return the actual messages. Do NOT include any explanations, introduction commentary, formatting guides, or metadata. It must start directly with [STEP 1: ...].
2. NO MARKDOWN FLUFF: Do NOT use markdown code blocks, horizontal rules (such as "***"), or asterisks for bolding within the emails. Return clean, raw text formatted beautifully with spacing.
3. PROTOTYPE INTEGRATION:
   - If a Prototype URL is available (Prototype URL: "${prototypeUrl}"), you MUST integrate this link: ${prototypeUrl} directly into the FIRST step as a "value-first" gift, showing you built them a personalized, mobile-optimized landing page prototype to capture more clients.
   - If no prototype was built yet, propose that we are currently drafting a custom prototype for their business.
4. EXACT STRUCTURE FORMAT: You MUST structure your output using this exact syntax for the parser:
   [STEP 1: INITIAL HOOK (DAY 1)]
   Subject: [Subject line goes here]
   [Exact email body goes here]
   
   [STEP 2: VALUE BUMP (DAY 3)]
   Subject: [Subject line goes here]
   [Exact email body goes here]
   
   [STEP 3: NEW ANGLE / STRATEGY (DAY 7)]
   Subject: [Subject line goes here]
   [Exact email body goes here]
   
   [STEP 4: FRIENDLY BREAKUP (DAY 12)]
   Subject: [Subject line goes here]
   [Exact email body goes here]

${selectedLead.insights ? `Use these real strategic insights to personalize the pitch (mention their actual Lahore context, Johar Town location, rating or reviews, website status, or emergency status to make it incredibly targeted): ${selectedLead.insights}` : ''}
${instructions ? `Additional user guidance to integrate: ${instructions}` : ''}

Make the copywriting sound authentic, professional, deeply personalized, and highly compelling. Spacing should be clean and readable.`;

      const response = await ai.models.generateContent({
        model: models.fast,
        contents: prompt,
      });

      const textOutput = response.text || '';
      setGeneratedMessage(textOutput);
      setActiveTab('step1'); // Reset to first step
    } catch (error) {
      console.error('Error generating outreach:', error);
      alert('Failed to generate message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenEmailClient = (subject: string, bodyText: string) => {
    if (!selectedLead) return;
    const targetEmail = selectedLead.email || '';
    
    // Construct mailto URI
    const encodedSubject = encodeURIComponent(subject || `Outreach for ${selectedLead.name}`);
    const encodedBody = encodeURIComponent(bodyText);
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Log outreach to backend
    fetch('/api/outreach/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: selectedLead.id,
        businessName: selectedLead.name,
        recipient: targetEmail,
        subject: subject || `Outreach for ${selectedLead.name}`,
        body: bodyText,
        channel: 'email_client',
        status: 'Sent',
        previewUrl: selectedLead.prototypeId ? `/preview/${selectedLead.prototypeId}` : ''
      })
    }).catch(e => console.error('Outreach logging error:', e));

    // Open email client
    window.location.href = mailtoUrl;

    onUpdateLead(selectedLead.id, { 
      status: 'Contacted', 
      lastActionDate: Date.now()
    });
  };

  const handleSendEmail = async (subject: string, bodyText: string) => {
    if (!selectedLead) return;
    
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
          subject: subject || `Outreach for ${selectedLead.name}`,
          htmlContent: `<div style="font-family: system-ui, -apple-system, sans-serif; font-size: 15px; color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${bodyText}</div>`,
          senderName,
          senderEmail
        })
      });

      const data = await response.json();
      if (!response.ok) {
        // Log failure
        fetch('/api/outreach/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: selectedLead.id,
            businessName: selectedLead.name,
            recipient: targetEmail,
            subject: subject || `Outreach for ${selectedLead.name}`,
            body: bodyText,
            channel: 'brevo_api',
            status: 'Failed',
            error: data.error || 'Failed to send'
          })
        }).catch(console.error);

        throw new Error(data.error || 'Failed to send email');
      }
      
      // Log success
      fetch('/api/outreach/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          businessName: selectedLead.name,
          recipient: targetEmail,
          subject: subject || `Outreach for ${selectedLead.name}`,
          body: bodyText,
          channel: 'brevo_api',
          status: 'Sent',
          previewUrl: selectedLead.prototypeId ? `/preview/${selectedLead.prototypeId}` : ''
        })
      }).catch(console.error);

      onUpdateLead(selectedLead.id, { 
        status: 'Contacted', 
        lastActionDate: Date.now(),
        nextFollowUpDate: Date.now() + (3 * 24 * 60 * 60 * 1000) 
      });
      alert('Email sent successfully via Brevo!');
    } catch (error: any) {
      console.error('Email send failed:', error);
      alert(error.message || 'Failed to send email. Check your settings panel or API key.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const activeStep = steps.find(s => s.id === activeTab) || steps[0];

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <Mail className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-zinc-100 mb-4">Outreach & Pitching</h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Select a lead, choose your channel, and let the AI draft a hyper-personalized, 100% plug-and-play pitch sequence.
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
                onChange={(e) => {
                  setSelectedLeadId(e.target.value);
                  setGeneratedMessage('');
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
              >
                <option value="">-- Choose a Lead --</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>{lead.name} ({lead.niche})</option>
                ))}
              </select>
              {selectedLead && (
                <div className="mt-4 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60 flex flex-col gap-1 text-xs">
                  <div className="flex justify-between"><span className="text-zinc-500">Niche:</span> <span className="text-zinc-300 font-medium">{selectedLead.niche}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">City:</span> <span className="text-zinc-300 font-medium">{selectedLead.city}</span></div>
                  {selectedLead.prototypeId && (
                    <div className="flex justify-between mt-1 pt-1 border-t border-zinc-800/40">
                      <span className="text-indigo-400 font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" /> Prototype Built:</span>
                      <span className="text-zinc-400 font-mono text-[10px]">/preview/{selectedLead.prototypeId}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" /> 2. Channel & Tone
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(['email', 'whatsapp', 'linkedin'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setOutreachType(type);
                      setGeneratedMessage('');
                    }}
                    className={`py-3 px-2 rounded-xl text-sm font-medium capitalize transition-all border ${
                      outreachType === type 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <label className="block text-xs font-medium text-zinc-500 mb-2">SEQUENCE TONE</label>
              <div className="grid grid-cols-2 gap-2">
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
                <FileText className="w-5 h-5 text-indigo-400" /> 3. Additional Instructions
              </h3>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g. Focus heavy on emergency patients, Lahore Johar Town proximity, and emergency dentist keywords."
                className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 resize-none text-sm leading-relaxed"
              />
              <button
                onClick={handleGenerate}
                disabled={!selectedLeadId || isGenerating}
                className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Draft Campaign Sequence
              </button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl h-full min-h-[500px] flex flex-col">
              {generatedMessage ? (
                <>
                  {/* Tabs bar */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800/50">
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-[70%]">
                      {steps.map(step => (
                        <button
                          key={step.id}
                          onClick={() => setActiveTab(step.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                            activeTab === step.id
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                              : 'bg-zinc-950/40 text-zinc-500 border-transparent hover:text-zinc-300'
                          }`}
                        >
                          Step {step.id.replace('step', '')}
                        </button>
                      ))}
                      <button
                        onClick={() => setActiveTab('full')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                          activeTab === 'full'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                            : 'bg-zinc-950/40 text-zinc-500 border-transparent hover:text-zinc-300'
                        }`}
                      >
                        Full Sequence
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeTab !== 'full' && activeStep && (
                        <>
                          {outreachType === 'email' && activeStep.subject && (
                            <>
                              <button
                                onClick={() => handleOpenEmailClient(activeStep.subject, activeStep.body)}
                                className="text-[11px] font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
                              >
                                <Mail className="w-3 h-3" />
                                Open in Mail
                              </button>
                              <button
                                onClick={() => handleSendEmail(activeStep.subject, activeStep.body)}
                                disabled={isSendingEmail}
                                className="text-[11px] font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                              >
                                {isSendingEmail ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                Send via API
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              const copyText = activeStep.subject 
                                ? `Subject: ${activeStep.subject}\n\n${activeStep.body}` 
                                : activeStep.body;
                              safeCopyToClipboard(copyText, activeTab);
                              
                              if (selectedLead) {
                                onUpdateLead(selectedLead.id, { 
                                  status: 'Contacted', 
                                  lastActionDate: Date.now()
                                });
                              }
                            }}
                            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors flex items-center gap-1.5"
                          >
                            {copiedField === activeTab ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Copy Step
                          </button>
                        </>
                      )}

                      {activeTab === 'full' && (
                        <button
                          onClick={() => {
                            safeCopyToClipboard(generatedMessage, 'full');
                            if (selectedLead) {
                              onUpdateLead(selectedLead.id, { 
                                status: 'Contacted', 
                                lastActionDate: Date.now()
                              });
                            }
                          }}
                          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors flex items-center gap-1.5"
                        >
                          {copiedField === 'full' ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          Copy Full Sequence
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active content panel */}
                  <div className="flex-1 bg-zinc-950 rounded-xl p-6 border border-zinc-800/50 overflow-y-auto no-scrollbar custom-scrollbar flex flex-col justify-between">
                    {activeTab === 'full' ? (
                      <div className="prose prose-invert max-w-none text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed select-text font-mono text-xs p-1">
                        {generatedMessage}
                      </div>
                    ) : activeStep ? (
                      <div className="space-y-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-2 shrink-0">
                          <span className="text-xs font-bold text-indigo-400 px-2 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20 uppercase tracking-wider">
                            {activeStep.title}
                          </span>
                        </div>
                        
                        {outreachType === 'email' && activeStep.subject && (
                          <div className="bg-zinc-900/40 rounded-xl p-3.5 border border-zinc-800/50 shrink-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">SUBJECT LINE</span>
                              <button
                                onClick={() => safeCopyToClipboard(activeStep.subject, `${activeStep.id}-subject`)}
                                className="text-[10px] text-zinc-400 hover:text-indigo-400 transition-colors flex items-center gap-1 font-medium"
                              >
                                {copiedField === `${activeStep.id}-subject` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                Copy Subject
                              </button>
                            </div>
                            <div className="text-sm font-semibold text-zinc-100 select-text">
                              {activeStep.subject}
                            </div>
                          </div>
                        )}

                        <div className="flex-1 bg-zinc-900/15 rounded-xl border border-transparent p-1 overflow-y-auto no-scrollbar">
                          <div className="text-xs font-bold text-zinc-500 tracking-wider uppercase mb-2">MESSAGE BODY</div>
                          <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed select-text font-sans antialiased">
                            {activeStep.body}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
                        <p className="text-sm">Assembling step content...</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <div className="w-16 h-16 bg-zinc-800/30 rounded-2xl flex items-center justify-center border border-zinc-800/50">
                    <Mail className="w-8 h-8 opacity-25" />
                  </div>
                  <div className="text-center max-w-sm">
                    <p className="text-zinc-300 font-medium mb-1">No sequence generated yet</p>
                    <p className="text-xs text-zinc-500">
                      Choose a Lahore-based lead on the left, adjust tone, and click "Draft Campaign Sequence" to create a plug-and-play B2B campaign.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
