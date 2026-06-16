import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, LayoutTemplate, Send, DollarSign, ArrowRight, Activity, Bell } from 'lucide-react';
import { LogoFull } from './logo';

interface DashboardProps {
  onNavigate: (view: any) => void;
  leads: any[];
  tasks: any[];
  notes: any[];
}

export function Dashboard({ onNavigate, leads, tasks, notes }: DashboardProps) {
  const totalLeads = leads.length;
  const prototypesBuilt = leads.filter(l => l.prototypeId || l.status === 'Built').length;
  const outreachSent = leads.filter(l => ['Contacted', 'Negotiating'].includes(l.status)).length;
  const closedDeals = leads.filter(l => l.status === 'Closed').length;
  const dealValue = closedDeals * 5000;

  const kpis = [
    { title: 'Total Leads', value: totalLeads.toString(), change: '+12%', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Prototypes Built', value: prototypesBuilt.toString(), change: '+5%', icon: LayoutTemplate, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Outreach Sent', value: outreachSent.toString(), change: '+22%', icon: Send, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Est. Revenue', value: `$${(dealValue / 1000).toFixed(1)}k`, change: '+18%', icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  // Combine recent items for activity
  const recentLeads = [...leads].reverse().slice(0, 2).map(l => ({
    action: 'Lead discovered',
    target: l.name,
    time: 'Recently'
  }));

  const recentNotes = [...notes].slice(0, 2).map(n => ({
    action: 'Note added',
    target: n.title,
    time: new Date(n.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : 'Recently'
  }));

  const activities = [...recentLeads, ...recentNotes].slice(0, 4);
  if (activities.length === 0) {
    activities.push({ action: 'System initialized', target: 'Wolf CRM', time: 'Just now' });
  }

  // Use state to avoid purity violations on hydration
  const [now] = useState(() => Date.now());
  const pendingFollowUps = leads.filter(l => l.nextFollowUpDate && l.nextFollowUpDate <= now);
  
  // Tasks that are not completed, not archived, and have a dueDate or reminderDate and it's coming up soon (within 7 days) or past due. I'll just sort by closest date.
  const upcomingTasks = tasks
    .filter(t => !t.completed && !t.archived && (t.dueDate || t.reminderDate))
    .sort((a, b) => {
      const aTime = a.reminderDate || a.dueDate;
      const bTime = b.reminderDate || b.dueDate;
      return aTime - bTime;
    })
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.08),transparent_40%),radial-gradient(circle_at_center,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="flex items-center gap-5 mb-6">
            <LogoFull className="h-11 text-zinc-100" />
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl">Scale Faster. Hunt Smarter. The elite AI engine for rapid business acquisition and automated scaling.</p>
        </header>

        {/* KPI Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-between hover:bg-zinc-900/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  {kpi.change}
                </span>
              </div>
              <div>
                <h3 className="text-zinc-400 text-sm font-medium mb-1">{kpi.title}</h3>
                <p className="text-3xl font-display font-semibold text-zinc-100">{kpi.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-zinc-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" /> Recent Activity
                </h2>
                <button onClick={() => onNavigate('crm')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View CRM <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {activities.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <p className="text-sm text-zinc-300">
                        <span className="font-medium text-zinc-100">{activity.action}</span> for {activity.target}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {upcomingTasks.length > 0 && (
              <div className="bg-amber-900/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold text-amber-100 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" /> Upcoming Deadlines & Reminders
                  </h2>
                  <button onClick={() => onNavigate('tasks')} className="text-sm text-amber-400/80 hover:text-amber-300 flex items-center gap-1">
                    Tasks Panel <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-amber-950/20 rounded-xl border border-amber-500/10">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-amber-200">{task.title}</p>
                        {task.leadId && (
                           <p className="text-xs text-amber-400/70">Lead: {leads.find(l => l.id === task.leadId)?.name}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {task.dueDate && (
                          <span className="text-xs text-amber-500 font-medium">Due: {new Date(task.dueDate).toLocaleString()}</span>
                        )}
                        {task.reminderDate && (
                          <span className="text-xs text-amber-400/80">Reminder: {new Date(task.reminderDate).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-display font-semibold text-rose-100 mb-2">Launch Hunt</h2>
                <p className="text-rose-200/70 text-sm mb-6">Find high-value local business targets using AI-powered acquisition.</p>
              </div>
              <button 
                onClick={() => onNavigate('discovery')}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
              >
                Start Hunting <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-display font-semibold text-indigo-100 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" /> Action Required
                </h2>
                <div className="space-y-3">
                  {pendingFollowUps.length > 0 ? (
                    pendingFollowUps.slice(0, 3).map(lead => (
                      <div key={lead.id} className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start justify-between gap-3">
                         <div>
                            <p className="text-sm font-medium text-indigo-200">Follow up with {lead.name}</p>
                            <p className="text-xs text-indigo-300/70 mt-1">Prototype sent, no reply.</p>
                         </div>
                         <button onClick={() => onNavigate('outreach')} className="text-xs font-medium bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-2.5 py-1.5 rounded-lg border border-indigo-500/20 transition-colors shrink-0">
                           Pitch Next
                         </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-indigo-200/70 text-sm">Inbox Zero! No pending follow ups today.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
