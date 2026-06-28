import { useState } from 'react';
import { Settings2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AVAILABLE_MODELS, ModelId, useModels } from '@/contexts/model-context';

export function ModelSelector({ sidebarMode = false, direction = 'down', currentView = 'dashboard' }: { sidebarMode?: boolean, direction?: 'up' | 'down', currentView?: string }) {
  const { models, setModel } = useModels();
  const [isOpen, setIsOpen] = useState(false);

  const VIEW_RECOMMENDED_MODELS: Record<string, { chat: string; fast: string; reasonChat: string; reasonFast: string }> = {
    dashboard: {
      chat: 'gemini-3.1-pro-preview',
      fast: 'gemini-3.1-flash-preview',
      reasonChat: 'Optimized for high-intelligence metrics overview & strategic forecasting',
      reasonFast: 'Ideal for rapid data refresh & card state loading'
    },
    discovery: {
      chat: 'gemini-3.1-pro-preview',
      fast: 'gemini-3.1-flash-preview',
      reasonChat: 'Provides deep reasoning for lead categorization & priority ranking',
      reasonFast: 'Recommended for high-speed contact info extraction & query filtering'
    },
    competitor: {
      chat: 'gemini-3.1-pro-preview',
      fast: 'gemini-3.1-flash-preview',
      reasonChat: 'Advanced intelligence for competitor strategy mapping & product analysis',
      reasonFast: 'Recommended for speedy search query generation'
    },
    crm: {
      chat: 'gemini-2.5-pro',
      fast: 'gemini-2.5-flash',
      reasonChat: 'Excellent for personal, highly natural relationship history tone processing',
      reasonFast: 'Extremely fast client interaction indexing and logging'
    },
    contracts: {
      chat: 'gemini-3.1-pro-preview',
      fast: 'gemini-3.1-flash-preview',
      reasonChat: 'Precise legal term scanning, risk checks, and pricing calculation',
      reasonFast: 'Recommended for high-speed PDF metadata parsing'
    },
    canvas: {
      chat: 'gemini-3-pro-preview',
      fast: 'gemini-3-flash-preview',
      reasonChat: 'Highly creative engine for visual layout design, coding, & brainstorming',
      reasonFast: 'Recommended for quick canvas state saving and tag suggestions'
    },
    outreach: {
      chat: 'gemini-2.5-pro',
      fast: 'gemini-2.5-flash',
      reasonChat: 'Exceptional copywriting capability for personalized outbound pitches',
      reasonFast: 'High speed bulk email template generation'
    },
    tasks: {
      chat: 'gemini-3.1-flash-preview',
      fast: 'gemini-3.1-flash-preview',
      reasonChat: 'Perfect balance for task decomposition & fast checklist generation',
      reasonFast: 'Incredible speed for action-item extraction'
    },
    analytics: {
      chat: 'gemini-3.1-pro-preview',
      fast: 'gemini-3.1-flash-preview',
      reasonChat: 'Advanced mathematical logic for charts & anomaly detection',
      reasonFast: 'Extremely quick chart JSON formatting'
    },
    agent: {
      chat: 'gemini-3.1-pro-preview',
      fast: 'gemini-3.1-flash-preview',
      reasonChat: 'Highly recommended for deep multi-step planning & autonomous goal execution',
      reasonFast: 'Recommended for rapid sub-agent status tracking'
    },
    alphas: {
      chat: 'gemini-3-pro-preview',
      fast: 'gemini-3-flash-preview',
      reasonChat: 'Recommended for exploring advanced multi-modal capabilities',
      reasonFast: 'Quick experimental pipeline response'
    },
    files: {
      chat: 'gemini-2.5-flash',
      fast: 'gemini-2.5-flash',
      reasonChat: 'Fast indexing and content summarization for diverse file formats',
      reasonFast: 'High-speed search metadata extraction'
    },
    settings: {
      chat: 'gemini-3.1-flash-preview',
      fast: 'gemini-3.1-flash-preview',
      reasonChat: 'Optimized for preference configuration guidance',
      reasonFast: 'Quick form data verification'
    }
  };

  const getActiveTabLabel = (view: string) => {
    const labels: Record<string, string> = {
      dashboard: 'Dashboard',
      discovery: 'Lead Hunter',
      competitor: 'Competitor Analysis',
      crm: 'CRM',
      contracts: 'Contracts',
      canvas: 'Canvas Studio',
      outreach: 'Outreach & Pitch',
      tasks: 'Tasks & Notes',
      analytics: 'Analytics',
      agent: 'The Wolf',
      alphas: 'Alphas',
      files: 'Files',
      settings: 'Settings'
    };
    return labels[view] || 'Workspace';
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={sidebarMode 
          ? `shrink-0 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all group ${isOpen ? 'bg-zinc-800 text-zinc-300' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent'}`
          : "flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-all select-none"
        }
        title="Model Settings"
      >
        <Settings2 className={sidebarMode ? "w-4 h-4" : "w-3.5 h-3.5 text-blue-400"} />
        {!sidebarMode && (
          <>
            <span className="text-xs font-medium text-zinc-300 hidden sm:inline">Model: {AVAILABLE_MODELS.find(m => m.id === models.chat)?.name || 'Custom'}</span>
            <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: direction === 'up' ? 5 : -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: direction === 'up' ? 5 : -5 }}
              className={`absolute ${sidebarMode ? 'left-full bottom-0 ml-2' : direction === 'up' ? 'right-0 bottom-full mb-2' : 'right-0 top-full mt-2'} w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-3.5 overflow-y-auto max-h-[420px] no-scrollbar z-50`}
            >
              <div className="mb-2 pb-2 border-b border-zinc-900 flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Model Config</span>
                <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  {getActiveTabLabel(currentView)} View
                </span>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Chat / Reasoning Model</span>
                <div className="space-y-1.5">
                  {AVAILABLE_MODELS.filter(m => m.type === 'pro').map(model => {
                    const recommendation = VIEW_RECOMMENDED_MODELS[currentView];
                    const isRecommended = recommendation?.chat === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => { setModel('chat', model.id); }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex flex-col gap-1.5 group ${models.chat === model.id ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white border border-transparent'}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${models.chat === model.id ? 'bg-blue-400 shadow-[0_0_8px_currentColor]' : 'bg-zinc-600'}`} />
                            {model.name}
                          </div>
                          {isRecommended && (
                            <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                              ✨ Recommended
                            </span>
                          )}
                        </div>
                        {isRecommended && (
                          <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors pl-3.5 leading-relaxed font-normal">
                            {recommendation.reasonChat}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Fast / Tasks Model</span>
                <div className="space-y-1.5">
                  {AVAILABLE_MODELS.filter(m => m.type === 'flash').map(model => {
                    const recommendation = VIEW_RECOMMENDED_MODELS[currentView];
                    const isRecommended = recommendation?.fast === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => { setModel('fast', model.id); }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex flex-col gap-1.5 group ${models.fast === model.id ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white border border-transparent'}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${models.fast === model.id ? 'bg-emerald-400 shadow-[0_0_8px_currentColor]' : 'bg-zinc-600'}`} />
                            {model.name}
                          </div>
                          {isRecommended && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              ✨ Recommended
                            </span>
                          )}
                        </div>
                        {isRecommended && (
                          <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors pl-3.5 leading-relaxed font-normal">
                            {recommendation.reasonFast}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
