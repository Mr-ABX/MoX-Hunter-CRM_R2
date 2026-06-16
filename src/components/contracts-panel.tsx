import { Lead } from '@/App';
import { useState } from 'react';
import { FileSignature, Search, Plus, CreditCard, CheckCircle2, Clock, XCircle, MoreVertical } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ContractsPanelProps {
  leads: Lead[];
}

export function ContractsPanel({ leads }: ContractsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    contractStatus: 'Pending' as 'Active' | 'Pending' | 'Canceled',
    billingAmount: '',
    billingCycle: 'Monthly' as 'Monthly' | 'One-time' | 'Yearly',
    currency: 'USD' as 'USD' | 'AED' | 'PKR' | 'GBP' | 'EUR',
    activeServices: ''
  });

  // Filter leads that are 'Closed' or already have a contract status
  const contractLeads = leads.filter(l => l.status === 'Closed' || l.contractStatus);
  
  const filteredLeads = contractLeads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setEditForm({
      contractStatus: lead.contractStatus || 'Pending',
      billingAmount: lead.billingAmount || '',
      billingCycle: lead.billingCycle || 'Monthly',
      currency: lead.currency || 'USD',
      activeServices: lead.activeServices || ''
    });
  };

  const handleSaveContract = async () => {
    if (!editingLeadId) return;
    try {
      await updateDoc(doc(db, 'leads', editingLeadId), {
        contractStatus: editForm.contractStatus,
        billingAmount: editForm.billingAmount,
        billingCycle: editForm.billingCycle,
        currency: editForm.currency,
        activeServices: editForm.activeServices
      });
      setEditingLeadId(null);
    } catch (error) {
      console.error("Error updating contract:", error);
    }
  };

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'AED': return 'د.إ';
      case 'PKR': return '₨';
      case 'GBP': return '£';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Canceled': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Active': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Pending': return <Clock className="w-3.5 h-3.5" />;
      case 'Canceled': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden no-scrollbar">
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-zinc-800/50 bg-zinc-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-medium text-zinc-100 flex items-center gap-3">
            <FileSignature className="w-6 h-6 text-indigo-400" />
            Contracts & Billing
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Manage active clients, billing details, and service agreements.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {contractLeads.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <FileSignature className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-medium text-zinc-200 mb-2">No Contracts Yet</h3>
            <p className="text-zinc-500 text-sm">
              When you move a lead to &quot;Closed&quot; status in the CRM, they will automatically appear here so you can manage their billing and services.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredLeads.map(lead => (
              <div key={lead.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-zinc-100 text-lg">{lead.name}</h3>
                    <p className="text-sm text-zinc-500">{lead.niche} • {lead.city}</p>
                  </div>
                  <button 
                    onClick={() => handleEditClick(lead)}
                    className="p-2 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-sm text-zinc-500">Status</span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(lead.contractStatus || 'Pending')}`}>
                      {getStatusIcon(lead.contractStatus || 'Pending')}
                      {lead.contractStatus || 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-sm text-zinc-500">Billing</span>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-200">
                        {lead.billingAmount ? `${getCurrencySymbol(lead.currency)}${lead.billingAmount}` : 'Not set'} 
                        <span className="text-zinc-500 text-xs ml-1 font-normal">
                          {lead.billingAmount ? `/ ${lead.billingCycle?.toLowerCase()}` : ''}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-sm text-zinc-500 block mb-1.5">Active Services</span>
                    {lead.activeServices ? (
                      <div className="flex flex-wrap gap-1.5">
                        {lead.activeServices.split(',').map((service, i) => (
                          <span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md text-xs border border-zinc-700/50">
                            {service.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-600 italic">No services defined</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingLeadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h3 className="font-medium text-zinc-100 flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-indigo-400" />
                Edit Contract Details
              </h3>
              <button 
                onClick={() => setEditingLeadId(null)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Contract Status</label>
                <select
                  value={editForm.contractStatus}
                  onChange={(e) => setEditForm(prev => ({ ...prev, contractStatus: e.target.value as any }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Currency</label>
                  <select
                    value={editForm.currency}
                    onChange={(e) => setEditForm(prev => ({ ...prev, currency: e.target.value as any }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="PKR">PKR (₨)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Amount</label>
                  <input
                    type="number"
                    value={editForm.billingAmount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, billingAmount: e.target.value }))}
                    placeholder="e.g. 1500"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Cycle</label>
                  <select
                    value={editForm.billingCycle}
                    onChange={(e) => setEditForm(prev => ({ ...prev, billingCycle: e.target.value as any }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="One-time">One-time</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Services (Comma separated)</label>
                <input
                  type="text"
                  value={editForm.activeServices}
                  onChange={(e) => setEditForm(prev => ({ ...prev, activeServices: e.target.value }))}
                  placeholder="e.g. SEO, Web Design, Hosting"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
            <div className="p-5 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/50">
              <button 
                onClick={() => setEditingLeadId(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveContract}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
