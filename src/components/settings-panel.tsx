import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Building2, Save, Check } from 'lucide-react';
import { WolfLogo } from './logo';

export function SettingsPanel() {
  const [mode, setMode] = useState<'solo' | 'agency'>('solo');
  const [hunterMode, setHunterMode] = useState(() => localStorage.getItem('hunterMode') === 'true');
  const [senderName, setSenderName] = useState(() => localStorage.getItem('brevoSenderName') || 'MoX Hunter Agent');
  const [senderEmail, setSenderEmail] = useState(() => localStorage.getItem('brevoSenderEmail') || 'agent@moxhunter.com');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('agentMode', mode);
    localStorage.setItem('hunterMode', hunterMode.toString());
    localStorage.setItem('brevoSenderName', senderName);
    localStorage.setItem('brevoSenderEmail', senderEmail);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-zinc-950 p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-zinc-100 mb-2">Settings</h1>
          <p className="text-zinc-400">Configure your workspace and agent behavior.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Agent Mode</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Select how the AI agent should write emails, pitches, and communicate on your behalf.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setMode('solo')}
              className={`flex flex-col items-start p-6 rounded-xl border transition-all text-left ${
                mode === 'solo'
                  ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className={`p-3 rounded-lg mb-4 ${mode === 'solo' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                <User className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${mode === 'solo' ? 'text-indigo-400' : 'text-zinc-200'}`}>Solo Contractor / Freelancer</h3>
              <p className="text-zinc-500 text-sm">
                Writes as a single person pitching their own services. Uses &quot;I&quot;, &quot;my&quot;, and personal branding.
              </p>
            </button>

            <button
              onClick={() => setMode('agency')}
              className={`flex flex-col items-start p-6 rounded-xl border transition-all text-left ${
                mode === 'agency'
                  ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className={`p-3 rounded-lg mb-4 ${mode === 'agency' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${mode === 'agency' ? 'text-indigo-400' : 'text-zinc-200'}`}>Agency</h3>
              <p className="text-zinc-500 text-sm">
                Writes as a team or company. Uses &quot;we&quot;, &quot;our team&quot;, and professional agency branding.
              </p>
            </button>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <WolfLogo className="w-6 h-6 text-rose-500" /> The Hunter Mode
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Enable advanced targeting, aggressive outreach strategies, and deep competitor analysis.
            </p>

            <button
              onClick={() => setHunterMode(!hunterMode)}
              className={`flex items-center justify-between w-full p-6 rounded-xl border transition-all text-left ${
                hunterMode
                  ? 'bg-rose-500/10 border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.1)]'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <h3 className={`text-lg font-semibold mb-1 ${hunterMode ? 'text-rose-400' : 'text-zinc-200'}`}>
                  {hunterMode ? 'Hunter Mode Active' : 'Enable Hunter Mode'}
                </h3>
                <p className="text-zinc-500 text-sm">
                  Unlocks advanced AI models for lead scoring and aggressive pitch generation.
                </p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${hunterMode ? 'bg-rose-500' : 'bg-zinc-700'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${hunterMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Brevo Email Settings</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Configure the sender details for your automated outreach campaigns via Brevo API. Ensure the email address is an authorized sender in your Brevo dashboard.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Sender Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Sender Email</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. hello@yourdomain.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? 'Saved' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
