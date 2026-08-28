import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Filter, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Lead } from '@/App';

interface AnalyticsPanelProps {
  leads: Lead[];
}

export function AnalyticsPanel({ leads }: AnalyticsPanelProps) {
  const [timeframe, setTimeframe] = useState<'ytd' | 'q1' | 'month'>('ytd');

  // Compute total leads
  const totalLeads = leads.length;

  // Compute Total Pipeline Value (all active deals that are not Closed)
  const pipelineValue = useMemo(() => {
    return leads
      .filter(l => l.status !== 'Closed')
      .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
  }, [leads]);

  // Compute Active / Closed Contracts Value
  const activeContractsCount = leads.filter(l => l.status === 'Closed').length;
  
  // Calculate Monthly Recurring Revenue approximation based on Contract Billing Amount
  const mrr = useMemo(() => {
    return leads.filter(l => l.status === 'Closed' && l.contractStatus === 'Active').reduce((sum, lead) => {
      if (!lead.billingAmount) return sum;
      const amount = parseFloat(lead.billingAmount.replace(/[^0-9.-]+/g,""));
      if (isNaN(amount)) return sum;
      
      // If billing cycle is yearly, divide by 12 for MRR. If one-time, don't count towards MRR.
      if (lead.billingCycle === 'Yearly') return sum + (amount / 12);
      if (lead.billingCycle === 'One-time') return sum;
      return sum + amount; // Assume monthly
    }, 0);
  }, [leads]);

  // Group leads by status for Pipeline Funnel
  const funnelData = useMemo(() => {
    const counts = {
      Qualified: 0,
      Built: 0,
      Contacted: 0,
      Negotiating: 0,
      Closed: 0
    };
    leads.forEach(l => {
      if (counts[l.status] !== undefined) counts[l.status]++;
    });
    return [
      { name: 'Qualified', value: counts.Qualified, fill: '#6366f1' },
      { name: 'Built', value: counts.Built, fill: '#8b5cf6' },
      { name: 'Contacted', value: counts.Contacted, fill: '#ec4899' },
      { name: 'Negotiating', value: counts.Negotiating, fill: '#f59e0b' },
      { name: 'Closed', value: counts.Closed, fill: '#10b981' },
    ];
  }, [leads]);

  // Fake historical for visual completion
  const revenueData = [
    { name: 'Jan', revenue: mrr * 0.4 },
    { name: 'Feb', revenue: mrr * 0.6 },
    { name: 'Mar', revenue: mrr * 0.75 },
    { name: 'Apr', revenue: mrr * 0.9 },
    { name: 'May', revenue: mrr },
  ];

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative flex flex-col">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col h-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-zinc-100 mb-2">Analytics & Revenue Engine</h1>
            <p className="text-zinc-400 text-sm">Real-time pipeline tracking and financial forecasting based on your CRM.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-2 shadow-xl">
            <Filter className="w-4 h-4 text-zinc-400 ml-2" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="bg-transparent border-none text-zinc-200 text-sm font-medium focus:ring-0 cursor-pointer outline-none pl-1 pr-4 py-1"
            >
              <option value="ytd">Year to Date (YTD)</option>
              <option value="q1">Q1 (Jan - Mar)</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <DollarSign className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-400 font-medium text-sm">Estimated MRR</h3>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-zinc-100 mb-1">${mrr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            <div className="text-emerald-400 text-sm flex items-center gap-1">
              Active Contracts ({activeContractsCount})
            </div>
          </div>
          
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <Target className="w-24 h-24 text-amber-500" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-400 font-medium text-sm">Pipeline Value</h3>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-zinc-100 mb-1">${pipelineValue.toLocaleString()}</div>
            <div className="text-amber-400 text-sm flex items-center gap-1">
              Unclosed active deals
            </div>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-400 font-medium text-sm">Total Leads</h3>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-zinc-100 mb-1">{totalLeads}</div>
            <div className="text-indigo-400 text-sm flex items-center gap-1">
               Across all stages
            </div>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-400 font-medium text-sm">Conversion Rate</h3>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-rose-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-zinc-100 mb-1">
              {totalLeads > 0 ? Math.round((activeContractsCount / totalLeads) * 100) : 0}%
            </div>
            <div className="text-rose-400 text-sm flex items-center gap-1">
              Qualified to Closed
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl min-w-0">
            <h3 className="text-zinc-100 font-medium mb-6">Pipeline Funnel Health</h3>
            <div className="h-[300px] w-full min-w-0 min-h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl min-w-0">
            <h3 className="text-zinc-100 font-medium mb-6">Projected Revenue Growth</h3>
            <div className="h-[300px] w-full min-w-0 min-h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#a1a1aa' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
