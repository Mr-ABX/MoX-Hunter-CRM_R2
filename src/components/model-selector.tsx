import { useState } from 'react';
import { Settings2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AVAILABLE_MODELS, ModelId, useModels } from '@/contexts/model-context';

export function ModelSelector() {
  const { models, setModel } = useModels();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-all select-none"
        title="Model Settings"
      >
        <Settings2 className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-medium text-zinc-300 hidden sm:inline">Model: {AVAILABLE_MODELS.find(m => m.id === models.chat)?.name || 'Custom'}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className="absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3 overflow-hidden z-50"
            >
              <div className="mb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Chat / Core Model</span>
                <div className="space-y-1">
                  {AVAILABLE_MODELS.filter(m => m.type === 'pro').map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setModel('chat', model.id); }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${models.chat === model.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${models.chat === model.id ? 'bg-blue-400 shadow-[0_0_8px_currentColor]' : 'bg-zinc-600'}`} />
                        {model.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Fast / Tasks Model</span>
                <div className="space-y-1">
                  {AVAILABLE_MODELS.filter(m => m.type === 'flash').map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setModel('fast', model.id); }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${models.fast === model.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${models.fast === model.id ? 'bg-emerald-400 shadow-[0_0_8px_currentColor]' : 'bg-zinc-600'}`} />
                        {model.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
