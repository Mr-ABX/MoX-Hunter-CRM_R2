
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

function SidebarTab({ icon, label, isActive, hasIndicator, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, hasIndicator?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`shrink-0 relative flex items-center justify-center w-10 h-10 rounded-xl transition-all group ${
        isActive 
          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
          : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent'
      }`}
    >
      {icon}
      {hasIndicator && !isActive && (
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-zinc-950"></span>
      )}
    </button>
  );
}

export function Sidebar({ currentView, setCurrentView, leadsCount, messagesCount, handleSignOut }: SidebarProps) {
  return (
    <div className="w-16 h-screen shrink-0 flex flex-col items-center py-4 bg-zinc-950 border-r border-zinc-800/50 z-40 relative">
      <div className="flex flex-col items-center mb-6 shrink-0">
        <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.2)] mb-1">
          <Logo className="w-4 h-4 text-zinc-100" />
        </div>
        <span className="text-[9px] font-display font-bold text-zinc-400 tracking-[0.2em] lowercase">mox</span>
      </div>

      <div className="flex flex-col gap-3 w-full px-2 flex-1 overflow-y-auto no-scrollbar">
        <SidebarTab 
          icon={<LayoutDashboard className="w-4 h-4" />} 
          label="Dashboard" 
          isActive={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')} 
        />
        <SidebarTab 
          icon={<Search className="w-4 h-4" />} 
          label="Lead Hunter" 
          isActive={currentView === 'discovery'} 
          onClick={() => setCurrentView('discovery')} 
        />
        <SidebarTab 
          icon={<TrendingUp className="w-4 h-4" />} 
          label="Competitor Analysis" 
          isActive={currentView === 'competitor'} 
          onClick={() => setCurrentView('competitor')} 
        />
        <SidebarTab 
          icon={<Users className="w-4 h-4" />} 
          label="CRM" 
          isActive={currentView === 'crm'} 
          hasIndicator={leadsCount > 0}
          onClick={() => setCurrentView('crm')} 
        />
        <SidebarTab 
          icon={<FileSignature className="w-4 h-4" />} 
          label="Contracts & Billing" 
          isActive={currentView === 'contracts'} 
          onClick={() => setCurrentView('contracts')} 
        />
        
        <div className="w-6 h-px shrink-0 bg-zinc-800 mx-auto my-1" />
        
        <SidebarTab 
          icon={<PenTool className="w-4 h-4" />} 
          label="Canvas Studio" 
          isActive={currentView === 'canvas'} 
          hasIndicator={messagesCount > 0}
          onClick={() => setCurrentView('canvas')} 
        />
        <SidebarTab 
          icon={<Mail className="w-4 h-4" />} 
          label="Outreach & Pitch" 
          isActive={currentView === 'outreach'} 
          onClick={() => setCurrentView('outreach')} 
        />
        <SidebarTab 
          icon={<CheckSquare className="w-4 h-4" />} 
          label="Tasks & Notes" 
          isActive={currentView === 'tasks'} 
          onClick={() => setCurrentView('tasks')} 
        />
        <SidebarTab 
          icon={<BarChart3 className="w-4 h-4" />} 
          label="Analytics" 
          isActive={currentView === 'analytics'} 
          onClick={() => setCurrentView('analytics')} 
        />
        <SidebarTab 
          icon={<WolfLogo className="w-4 h-4" />} 
          label="The Wolf" 
          isActive={currentView === 'agent'} 
          onClick={() => setCurrentView('agent')} 
        />
        <SidebarTab 
          icon={<Cpu className="w-4 h-4" />} 
          label="Alphas" 
          isActive={currentView === 'alphas'} 
          onClick={() => setCurrentView('alphas')} 
        />
        <SidebarTab 
          icon={<FolderOpen className="w-4 h-4" />} 
          label="Files & Assets" 
          isActive={currentView === 'files'} 
          onClick={() => setCurrentView('files')} 
        />
        
        <div className="flex-1" />
        
        <SidebarTab 
          icon={<LogOut className="w-4 h-4 text-rose-500" />} 
          label="Sign Out" 
          isActive={false} 
          onClick={handleSignOut} 
        />
        <SidebarTab 
          icon={<Settings className="w-4 h-4" />} 
          label="Settings" 
          isActive={currentView === 'settings'} 
          onClick={() => setCurrentView('settings')} 
        />
      </div>
    </div>
  );
}
