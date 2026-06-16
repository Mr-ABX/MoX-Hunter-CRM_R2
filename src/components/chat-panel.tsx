import { Message, Lead, ChatSession } from '@/App';
import { CanvasMode } from '@/lib/parser';
import { Bot, User, FileCode2, Image as ImageIcon, FileText, Code2, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef, useState } from 'react';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onCanvasSelect: (content: string, mode: CanvasMode, messageId: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  activeMode: NonNullable<CanvasMode>;
  leads: Lead[];
  selectedLeadId: string | null;
  onLeadSelect: (leadId: string) => void;
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onCreateSession: () => void;
}

function UserMessage({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > 250;

  return (
    <div className="flex flex-col items-end w-full mb-4">
      <div className={`max-w-[85%] rounded-[24px] rounded-tr-[4px] px-5 py-3.5 bg-zinc-800 text-zinc-100 shadow-sm ${!isExpanded && isLong ? 'cursor-pointer' : ''}`} onClick={() => !isExpanded && isLong && setIsExpanded(true)}>
        <div className={`prose prose-invert prose-sm max-w-none text-[15px] leading-relaxed break-words ${!isExpanded && isLong ? 'line-clamp-4' : ''}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      </div>
      {isLong && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors mt-2 uppercase tracking-wide"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

export function ChatPanel({ messages, isLoading, onCanvasSelect, onSuggestionClick, activeMode, leads, selectedLeadId, onLeadSelect, sessions, selectedSessionId, onSessionSelect, onCreateSession }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [thinkingText, setThinkingText] = useState('Architecting');

  useEffect(() => {
    if (isLoading) {
      const texts = ['Architecting', 'Synthesizing', 'Optimizing', 'Reviewing specs', 'Assembling logic'];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setThinkingText(texts[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getModeIcon = (mode: CanvasMode) => {
    switch (mode) {
      case 'WEB': return <FileCode2 className="w-4 h-4 text-indigo-400" />;
      case 'GRAPHIC': return <ImageIcon className="w-4 h-4 text-indigo-400" />;
      case 'SVG': return <Code2 className="w-4 h-4 text-indigo-400" />;
      case 'CONTENT': return <FileText className="w-4 h-4 text-indigo-400" />;
      default: return null;
    }
  };

  const getModeLabel = (mode: CanvasMode) => {
    switch (mode) {
      case 'WEB': return 'Landing Page';
      case 'GRAPHIC': return 'Ad Graphic';
      case 'SVG': return 'Vector Logo';
      case 'CONTENT': return 'Copywriting';
      default: return 'Asset';
    }
  };

  const getSuggestions = () => {
    switch (activeMode) {
      case 'WEB': return ['Landing Page for Plumber', 'Real Estate Squeeze Page', 'SaaS Pricing Page', 'Local Gym Homepage'];
      case 'GRAPHIC': return ['Facebook Ad Graphic', 'Instagram Story Banner', 'LinkedIn Post Image', 'YouTube Thumbnail'];
      case 'SVG': return ['Animated SVG Logo', 'Minimalist Icon Set', 'Loading Spinner', 'Abstract Background Pattern'];
      case 'CONTENT': return ['Cold Email Sequence', 'Facebook Ad Copy', 'Landing Page Headlines', 'Video Sales Letter Script'];
      default: return ['Landing Page for Plumber', 'Facebook Ad Copy', 'Animated SVG Logo', 'Luxury Real Estate Banner'];
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 relative">
      {/* Lead Selector Dropdown */}
      <div className="sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-2 mb-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Working On:</span>
          <div className="relative group flex-1 ml-4">
            <select
              value={selectedLeadId || ''}
              onChange={(e) => onLeadSelect(e.target.value)}
              className="appearance-none w-full bg-transparent text-sm font-medium text-zinc-100 pr-8 py-1 cursor-pointer focus:outline-none"
            >
              <option value="" disabled>Select a Lead...</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id} className="bg-zinc-900 text-zinc-100">
                  {lead.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>
        
        {selectedLeadId && (
          <div className="flex items-center justify-between px-2 mt-2 pt-2 border-t border-zinc-800/50">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Session:</span>
            <div className="flex items-center gap-2 flex-1 ml-4">
              <div className="relative group flex-1">
                <select
                  value={selectedSessionId || ''}
                  onChange={(e) => onSessionSelect(e.target.value)}
                  className="appearance-none w-full bg-transparent text-sm font-medium text-zinc-300 pr-8 py-1 cursor-pointer focus:outline-none"
                >
                  {sessions.filter(s => s.leadId === selectedLeadId).map(session => (
                    <option key={session.id} value={session.id} className="bg-zinc-900 text-zinc-100">
                      {session.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
              <button 
                onClick={onCreateSession}
                className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
                title="New Chat Session"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="text-center text-zinc-500 mt-12">
          <p className="mb-2">How can I help you pitch today?</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {getSuggestions().map((suggestion) => (
              <span 
                key={suggestion} 
                onClick={() => onSuggestionClick(suggestion)}
                className="text-xs px-3 py-1.5 bg-zinc-800 rounded-full border border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {messages.map((msg) => (
        <div key={msg.id} className={`flex gap-3 mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'model' && (
            <div className="w-8 h-8 rounded-full bg-transparent border border-zinc-800 flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <Bot className="w-4 h-4 text-zinc-400" />
            </div>
          )}
          
          {msg.role === 'user' ? (
            <UserMessage text={msg.text} />
          ) : (
            <div className="max-w-[85%] rounded-3xl rounded-tl-sm px-5 py-3.5 bg-transparent text-zinc-300">
              {msg.text && (
                <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-relaxed break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              )}
              
              {msg.canvasContent && msg.canvasMode && (
                <button
                  onClick={() => onCanvasSelect(msg.canvasContent!, msg.canvasMode!, msg.id)}
                  className="mt-4 w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-zinc-800/80 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-3 text-[14px] font-medium text-zinc-300 group-hover:text-indigo-400 transition-colors">
                    <div className="p-2 rounded-xl bg-zinc-800 group-hover:bg-indigo-500/10 transition-colors">
                      {getModeIcon(msg.canvasMode)}
                    </div>
                    <span>{getModeLabel(msg.canvasMode)} Generated</span>
                  </div>
                  <span className="text-[12px] font-medium text-zinc-500 group-hover:text-indigo-400/80 transition-colors flex items-center gap-1">Open Canvas <ChevronRight className="w-3.5 h-3.5" /></span>
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 px-1 py-1.5 min-h-[32px]">
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 rounded-full bg-indigo-700 animate-bounce"></div>
              </div>
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest ml-2 animate-pulse">{thinkingText}...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}
