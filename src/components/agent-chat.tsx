import { useState, useRef, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, User, Loader2, Sparkles, Target, Mic } from 'lucide-react';
import { Lead, Task, Note, ChatSession } from '@/App';
import { ai } from '@/lib/ai';
import { WolfLogo } from './logo';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sessionId?: string | null;
  createdAt: number;
}

interface AgentChatProps {
  leads: Lead[];
  tasks: Task[];
  notes: Note[];
  sessions: ChatSession[];
  messages: ChatMessage[];
  activeSessionId: string | null;
  onSendMessage: (text: string, sessionId: string) => Promise<void>;
  onCreateSession: (name: string, leadId?: string) => Promise<string>;
  onSelectSession: (sessionId: string) => void;
}

export function AgentChat({ 
  leads, tasks, notes, 
  sessions, messages, activeSessionId,
  onSendMessage, onCreateSession, onSelectSession
}: AgentChatProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentSession = sessions.find(s => s.id === activeSessionId);
  const sessionMessages = messages
    .filter(m => m.sessionId === activeSessionId)
    .sort((a, b) => a.createdAt - b.createdAt);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages]);

  const handleLeadChange = async (leadId: string) => {
    const existingSession = sessions.find(s => s.leadId === leadId);
    if (existingSession) {
      onSelectSession(existingSession.id);
    } else {
      const lead = leads.find(l => l.id === leadId);
      const sessionName = lead ? `Hunt: ${lead.name}` : 'General Strategy';
      const newSessionId = await onCreateSession(sessionName, leadId || undefined);
      onSelectSession(newSessionId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = await onCreateSession('New Hunt');
      onSelectSession(sessionId);
    }

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      await onSendMessage(userText, sessionId);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative flex flex-col">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,29,72,0.08),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col h-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4 border border-rose-500/20 shadow-lg shadow-rose-500/10 relative overflow-hidden">
              <img 
                src="/wolf-icon.svg" 
                alt="The Wolf" 
                width={24}
                height={24}
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-zinc-100 mb-2">The Wolf (AI)</h1>
            <p className="text-zinc-400 text-sm">Brainstorm, strategize, and analyze with your AI co-pilot.</p>
          </div>
          
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-3 shadow-xl min-w-[250px]">
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Target className="w-3 h-3" /> Focus Context
            </label>
            <select
              value={currentSession?.leadId || ''}
              onChange={(e) => handleLeadChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
            >
              <option value="">General Agency Growth</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.name}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="flex-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-xl flex flex-col overflow-hidden min-h-[500px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 custom-scrollbar">
            {sessionMessages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-zinc-500 text-sm italic">No messages in this hunt yet. Start the attack below.</p>
              </div>
            )}
            {sessionMessages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'user' 
                    ? 'bg-zinc-800 border border-zinc-700' 
                    : 'bg-rose-500/20 border border-rose-500/30'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-400" /> : <WolfLogo className="w-4 h-4 text-rose-400" />}
                </div>
                
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm'
                    : 'bg-zinc-950/50 border border-zinc-800/50 text-zinc-300 rounded-tl-sm'
                }`}>
                  <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 text-sm">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 mt-1">
                  <WolfLogo className="w-4 h-4 text-rose-400" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 text-zinc-300 rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  <span className="text-sm text-zinc-500">Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/50">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentSession?.leadId ? `Ask about ${leads.find(l => l.id === currentSession.leadId)?.name}...` : "Ask for agency growth advice..."}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-4 pr-24 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-zinc-600"
                disabled={isLoading}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 text-zinc-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-zinc-800"
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-rose-600"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
