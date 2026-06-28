import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Users, 
  FileSignature, 
  PenTool, 
  Mail, 
  CheckSquare, 
  BarChart3, 
  FolderOpen, 
  LogOut, 
  Settings,
  Cpu
} from 'lucide-react';
import { Logo, WolfLogo } from './logo';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  leadsCount: number;
  messagesCount: number;
  handleSignOut: () => void;
}

interface SidebarTabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  hasIndicator?: boolean;
  onClick: () => void;
  onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave: () => void;
}

function SidebarTab({ icon, label, isActive, hasIndicator, onClick, onMouseEnter, onMouseLeave }: SidebarTabProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`shrink-0 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all group ${
        isActive 
          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
          : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent'
      }`}
    >
      {icon}
      {hasIndicator && !isActive && (
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-zinc-950 animate-pulse"></span>
      )}
    </button>
  );
}

export function Sidebar({ currentView, setCurrentView, leadsCount, messagesCount, handleSignOut }: SidebarProps) {
  const [hoveredTab, setHoveredTab] = useState<{ label: string; y: number } | null>(null);

  const handleMouseEnter = (label: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTab({
      label,
      y: rect.top + rect.height / 2
    });
  };

  const handleMouseLeave = () => {
    setHoveredTab(null);
  };

  return (
    <div className="w-16 h-screen shrink-0 flex flex-col items-center py-4 bg-zinc-950 border-r border-zinc-800/50 z-40 relative select-none">
      {/* Brand Header - Pinned */}
      <div className="flex flex-col items-center mb-6 shrink-0">
        <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.2)] mb-1">
          <Logo className="w-4 h-4 text-zinc-100" />
        </div>
        <span className="text-[9px] font-display font-bold text-zinc-400 tracking-[0.2em] lowercase">mox</span>
      </div>

      {/* Main Navigation - Scrollable with no clipping issues */}
      <div className="flex flex-col gap-3 w-full px-2 flex-1 overflow-y-auto no-scrollbar pb-2">
        <SidebarTab 
          icon={<LayoutDashboard className="w-4 h-4" />} 
          label="Dashboard" 
          isActive={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')} 
          onMouseEnter={(e) => handleMouseEnter("Dashboard", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<Search className="w-4 h-4" />} 
          label="Lead Hunter" 
          isActive={currentView === 'discovery'} 
          onClick={() => setCurrentView('discovery')} 
          onMouseEnter={(e) => handleMouseEnter("Lead Hunter", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<TrendingUp className="w-4 h-4" />} 
          label="Competitor Analysis" 
          isActive={currentView === 'competitor'} 
          onClick={() => setCurrentView('competitor')} 
          onMouseEnter={(e) => handleMouseEnter("Competitor Analysis", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<Users className="w-4 h-4" />} 
          label="CRM" 
          isActive={currentView === 'crm'} 
          hasIndicator={leadsCount > 0}
          onClick={() => setCurrentView('crm')} 
          onMouseEnter={(e) => handleMouseEnter("CRM", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<FileSignature className="w-4 h-4" />} 
          label="Contracts & Billing" 
          isActive={currentView === 'contracts'} 
          onClick={() => setCurrentView('contracts')} 
          onMouseEnter={(e) => handleMouseEnter("Contracts & Billing", e)}
          onMouseLeave={handleMouseLeave}
        />
        
        <div className="w-6 h-px shrink-0 bg-zinc-800 mx-auto my-1" />
        
        <SidebarTab 
          icon={<PenTool className="w-4 h-4" />} 
          label="Canvas Studio" 
          isActive={currentView === 'canvas'} 
          hasIndicator={messagesCount > 0}
          onClick={() => setCurrentView('canvas')} 
          onMouseEnter={(e) => handleMouseEnter("Canvas Studio", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<Mail className="w-4 h-4" />} 
          label="Outreach & Pitch" 
          isActive={currentView === 'outreach'} 
          onClick={() => setCurrentView('outreach')} 
          onMouseEnter={(e) => handleMouseEnter("Outreach & Pitch", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<CheckSquare className="w-4 h-4" />} 
          label="Tasks & Notes" 
          isActive={currentView === 'tasks'} 
          onClick={() => setCurrentView('tasks')} 
          onMouseEnter={(e) => handleMouseEnter("Tasks & Notes", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<BarChart3 className="w-4 h-4" />} 
          label="Analytics" 
          isActive={currentView === 'analytics'} 
          onClick={() => setCurrentView('analytics')} 
          onMouseEnter={(e) => handleMouseEnter("Analytics", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<WolfLogo className="w-4 h-4" />} 
          label="The Wolf" 
          isActive={currentView === 'agent'} 
          onClick={() => setCurrentView('agent')} 
          onMouseEnter={(e) => handleMouseEnter("The Wolf", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<Cpu className="w-4 h-4" />} 
          label="Alphas" 
          isActive={currentView === 'alphas'} 
          onClick={() => setCurrentView('alphas')} 
          onMouseEnter={(e) => handleMouseEnter("Alphas", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<FolderOpen className="w-4 h-4" />} 
          label="Files & Assets" 
          isActive={currentView === 'files'} 
          onClick={() => setCurrentView('files')} 
          onMouseEnter={(e) => handleMouseEnter("Files & Assets", e)}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {/* Control Actions - Pinned Pinned Bottom Container */}
      <div className="flex flex-col gap-3 w-full px-2 mt-2 pt-2 border-t border-zinc-900 shrink-0">
        <SidebarTab 
          icon={<Settings className="w-4 h-4" />} 
          label="Settings" 
          isActive={currentView === 'settings'} 
          onClick={() => setCurrentView('settings')} 
          onMouseEnter={(e) => handleMouseEnter("Settings", e)}
          onMouseLeave={handleMouseLeave}
        />
        <SidebarTab 
          icon={<LogOut className="w-4 h-4 text-rose-500" />} 
          label="Sign Out" 
          isActive={false} 
          onClick={handleSignOut} 
          onMouseEnter={(e) => handleMouseEnter("Sign Out", e)}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {/* Dynamic Floating Tooltip */}
      <AnimatePresence>
        {hoveredTab && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ top: hoveredTab.y }}
            className="fixed left-[72px] -translate-y-1/2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-semibold rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)] z-[999] pointer-events-none whitespace-nowrap flex items-center gap-1.5"
          >
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-800"></div>
            {hoveredTab.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
