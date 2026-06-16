import { useState } from 'react';
import { Plus, Cpu, PenTool, Image as ImageIcon, FileText, Code, CheckCircle2, Search, SlidersHorizontal, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Alpha {
  id: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  icon: any;
  color: string;
  isCustom?: boolean;
}

const defaultAlphas: Alpha[] = [
  {
    id: 'alpha-web',
    name: 'The Web Architect',
    role: 'Next.js & UI/UX Specialist',
    description: 'Expert in constructing high-conversion landing pages and interactive web applications.',
    tags: ['React', 'Tailwind', 'Framer Motion'],
    icon: Code,
    color: 'bg-indigo-500',
  },
  {
    id: 'alpha-graphic',
    name: 'The Graphic Synthesizer',
    role: 'Visual Design & Prompting Specialist',
    description: 'Master of Midjourney and DALL-E prompts to generate cinematic and polished assets.',
    tags: ['Generative AI', 'Art Direction', 'Photography'],
    icon: ImageIcon,
    color: 'bg-fuchsia-500',
  },
  {
    id: 'alpha-vector',
    name: 'The Vector Artisan',
    role: 'SVG & Math-Based Rendering',
    description: 'Specializes in creating scalable, lightweight, and mathematically perfect vector art.',
    tags: ['SVG', 'Geometry', 'Animation'],
    icon: PenTool,
    color: 'bg-emerald-500',
  },
  {
    id: 'alpha-content',
    name: 'The Content Strategist',
    role: 'Copywriting & Formatting Expert',
    description: 'Crafts persuasive copy, structures markdown, and synthesizes deep technical documents.',
    tags: ['Copywriting', 'Markdown', 'SEO'],
    icon: FileText,
    color: 'bg-amber-500',
  }
];

export function AlphasPanel() {
  const [alphas, setAlphas] = useState<Alpha[]>(defaultAlphas);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSystemInstructions, setNewSystemInstructions] = useState('');

  const filteredAlphas = alphas.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDraft = () => {
    setIsCreating(true);
  };

  const saveAlpha = () => {
    if (!newName.trim() || !newRole.trim()) return;
    
    const newAlpha: Alpha = {
      id: `alpha-custom-${Date.now()}`,
      name: newName,
      role: newRole,
      description: newDescription || 'Custom protocol.',
      tags: ['Custom'],
      icon: Cpu,
      color: 'bg-zinc-500',
      isCustom: true
    };

    setAlphas([newAlpha, ...alphas]);
    setIsCreating(false);
    setNewName('');
    setNewRole('');
    setNewDescription('');
    setNewSystemInstructions('');
  };

  const deleteCustomAlpha = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlphas(alphas.filter(a => a.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-6 md:p-8 no-scrollbar h-full w-full">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-display font-semibold tracking-tight text-white">Alphas</h1>
            </div>
            <p className="text-zinc-400 max-w-2xl text-[15px] leading-relaxed">
              Manage your specialized agent protocols. Mount an Alpha to your Studio Canvas sessions to execute highly targeted tasks and maintain perfect contextual alignment.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 font-semibold text-sm rounded-xl hover:bg-zinc-200 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Build New Alpha
            </button>
          </div>
        </div>

        {isCreating ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800/50">
              <div>
                <h2 className="text-xl font-semibold text-white">Alpha Constructor</h2>
                <p className="text-zinc-400 text-sm mt-1">Define the behavioral protocol and expertise of your new agent.</p>
              </div>
              <button 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium transition-all"
              >
                Cancel
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Codename</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. The Motion Designer"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Role / Specialization</label>
                  <input 
                    type="text" 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Framer Motion & Interactions Specialist"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Brief Description</label>
                  <textarea 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="What does this Alpha excel at?"
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600 resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Core Directives (System Instructions)</label>
                <div className="flex-1 relative">
                  <textarea 
                    value={newSystemInstructions}
                    onChange={(e) => setNewSystemInstructions(e.target.value)}
                    placeholder="Provide exact `.md` style markdown rules or plain text constraints. The Alpha will strictly obey these during generation streams..."
                    className="w-full h-full min-h-[250px] bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-700 resize-none font-mono text-[13px] leading-relaxed custom-scrollbar"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 mt-8 border-t border-zinc-800/50 flex justify-end">
              <button 
                onClick={saveAlpha}
                disabled={!newName.trim() || !newRole.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                Compile Protocol
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search protocols..." 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-[15px] text-white focus:outline-none focus:border-zinc-700 transition-colors placeholder:text-zinc-600 shadow-sm"
                />
              </div>
              <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {filteredAlphas.map((alpha) => (
                <div 
                  key={alpha.id} 
                  className="group relative bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 hover:border-indigo-500/30 rounded-[24px] p-6 transition-all duration-300 hover:bg-zinc-900 flex flex-col shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${alpha.color}/10 border border-${alpha.color}/20 flex items-center justify-center`}>
                        <alpha.icon className={`w-6 h-6 text-${alpha.color.split('-')[1]}-400`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                          {alpha.name}
                          {alpha.isCustom && <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] uppercase font-bold text-zinc-400 border border-zinc-700">Custom</span>}
                        </h3>
                        <p className="text-indigo-400 text-sm font-medium">{alpha.role}</p>
                      </div>
                    </div>
                    {alpha.isCustom && (
                      <button 
                        onClick={(e) => deleteCustomAlpha(alpha.id, e)}
                        className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Protocol"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-zinc-400 text-[14px] leading-relaxed mb-6 flex-1 pr-4">
                    {alpha.description}
                  </p>

                  <div className="flex items-center gap-2 mt-auto">
                    {alpha.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-medium text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
