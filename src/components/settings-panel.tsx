import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Building2, Save, Check } from 'lucide-react';
import { WolfLogo } from './logo';

export function SettingsPanel() {
  const [mode, setMode] = useState<'solo' | 'agency'>('solo');
  const [hunterMode, setHunterMode] = useState(() => localStorage.getItem('hunterMode') === 'true');
  const [senderName, setSenderName] = useState(() => localStorage.getItem('brevoSenderName') || 'MoX Hunter Agent');
  const [senderEmail, setSenderEmail] = useState(() => localStorage.getItem('brevoSenderEmail') || 'agent@moxhunter.com');
  const [customDomain, setCustomDomain] = useState(() => localStorage.getItem('customDomain') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('agentMode', mode);
    localStorage.setItem('hunterMode', hunterMode.toString());
    localStorage.setItem('brevoSenderName', senderName);
    localStorage.setItem('brevoSenderEmail', senderEmail);
    localStorage.setItem('customDomain', customDomain);
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

          {/* MCP External AI Agent Settings */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              External AI Agent (MCP) Connection
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Connect external AI agents (like AntiGravity or Claude) to MoX Hunter to autonomously fetch leads, analyze data, and draft outreach on your behalf.
            </p>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 mb-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">1. Your Web Applet URL</h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded text-zinc-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {typeof window !== 'undefined' ? window.location.origin : 'https://mox-hunter-pro.vercel.app'}
                    </code>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">This is the live URL that your local agent will connect to.</p>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">2. Local Agent Configuration (JSON)</h3>
                  <p className="text-xs text-zinc-400 mb-3">
                    Copy the configuration block below and paste it into your local agent's MCP setup (e.g. Claude Desktop config). Make sure to replace <code className="text-indigo-400">YOUR_SECRET_KEY</code> with the actual key you set in your AI Studio secrets (<code>MOX_MCP_API_KEY</code>).
                  </p>
                  
                  <div className="relative group">
                    <pre className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto">
{`{
  "mcpServers": {
    "mox-hunter": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-openapi", "${typeof window !== 'undefined' ? window.location.origin : 'https://app.url'}/api/openapi.json"],
      "env": {
        "MO_X_API_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}`}
                    </pre>
                    <button 
                      onClick={() => {
                        const config = `{
  "mcpServers": {
    "mox-hunter": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-openapi", "${typeof window !== 'undefined' ? window.location.origin : 'https://app.url'}/api/openapi.json"],
      "env": {
        "MO_X_API_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}`;
                        navigator.clipboard.writeText(config);
                        alert('Configuration copied to clipboard!');
                      }}
                      className="absolute top-2 right-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-zinc-700 opacity-0 group-hover:opacity-100"
                    >
                      Copy JSON
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Final Step
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Don't forget to go to the <strong>Settings &rarr; Secrets</strong> panel in this AI Studio workspace and add a secret named <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-indigo-400">MOX_MCP_API_KEY</code> with your chosen key. Your local agent will send this key to authenticate its requests.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="text-xs font-semibold text-zinc-500 uppercase mb-1">Get Leads</div>
                <div className="text-sm font-mono text-zinc-300 break-all">GET /api/mcp/leads</div>
                <div className="text-xs text-zinc-500 mt-2">Params: ?industry, ?minScore</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="text-xs font-semibold text-zinc-500 uppercase mb-1">Get Single Lead</div>
                <div className="text-sm font-mono text-zinc-300 break-all">GET /api/mcp/leads/:id</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="text-xs font-semibold text-zinc-500 uppercase mb-1">Draft Outreach</div>
                <div className="text-sm font-mono text-zinc-300 break-all">POST /api/mcp/outreach</div>
                <div className="text-xs text-zinc-500 mt-2">Body: &#123; leadId, angle &#125;</div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-800/50">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">Live Deployed Domain (e.g., Vercel)</h3>
              <p className="text-zinc-400 text-xs mb-4">
                If you have deployed this app to a custom domain (like Vercel), enter it here. This URL will be used for sharing prototype links with clients instead of the AI Studio preview URL.
              </p>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                placeholder="https://mox-hunter-pro.vercel.app"
              />
            </div>
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
