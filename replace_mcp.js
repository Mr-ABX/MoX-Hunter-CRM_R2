const fs = require('fs');
const content = fs.readFileSync('src/components/settings-panel.tsx', 'utf8');

const targetStr = `          {/* MCP External AI Agent Settings */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-400"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              External AI Agent (MCP) Connection
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Connect external AI agents (like AntiGravity or Claude) to MoX
              Hunter to autonomously fetch leads, analyze data, and draft
              outreach on your behalf.
            </p>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 mb-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                    1. Your Web Applet URL
                  </h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded text-zinc-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : "https://mox-hunter-pro.vercel.app"}
                    </code>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    This is the live URL that your local agent will connect to.
                  </p>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                    2. Local Agent Configuration (JSON)
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3">
                    Copy the configuration block below and paste it into your
                    local agent's MCP setup (e.g. Claude Desktop config). Make
                    sure to replace{" "}
                    <code className="text-indigo-400">YOUR_SECRET_KEY</code>{" "}
                    with the actual key you set in your AI Studio secrets (
                    <code>MOX_MCP_API_KEY</code>).
                  </p>

                  <div className="relative group">
                    <pre className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto">
                      {\`{
  "mcpServers": {
    "mox-hunter": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-openapi", "\${typeof window !== "undefined" ? window.location.origin : "https://app.url"}/api/openapi.json"],
      "env": {
        "MO_X_API_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}\`}
                    </pre>
                    <button
                      onClick={() => {
                        const config = \`{
  "mcpServers": {
    "mox-hunter": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-openapi", "\${typeof window !== "undefined" ? window.location.origin : "https://app.url"}/api/openapi.json"],
      "env": {
        "MO_X_API_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}\`;
                        navigator.clipboard.writeText(config);
                        alert("Configuration copied to clipboard!");
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
                    Don't forget to go to the{" "}
                    <strong>Settings &rarr; Secrets</strong> panel in this AI
                    Studio workspace and add a secret named{" "}
                    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-indigo-400">
                      MOX_MCP_API_KEY
                    </code>{" "}
                    with your chosen key. Your local agent will send this key to
                    authenticate its requests.
                  </p>
                </div>
              </div>
            </div>`;

const newStr = `          {/* MCP External AI Agent Settings */}
          <ApiKeysManager />

          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-400"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Local Agent Configuration
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Connect external AI agents (like AntiGravity or Claude) to MoX
              Hunter to autonomously fetch leads, analyze data, and draft
              outreach on your behalf.
            </p>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 mb-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                    1. Your Web Applet URL
                  </h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded text-zinc-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : "https://mox-hunter-pro.vercel.app"}
                    </code>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    This is the live URL that your local agent will connect to.
                  </p>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                    2. Local Agent Configuration (JSON)
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3">
                    Copy the configuration block below and paste it into your
                    local agent's MCP setup (e.g. Claude Desktop config). Make
                    sure to replace{" "}
                    <code className="text-indigo-400">YOUR_GENERATED_KEY</code>{" "}
                    with one of the API keys you generated above.
                  </p>

                  <div className="relative group">
                    <pre className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto">
                      {\`{
  "mcpServers": {
    "mox-hunter": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-openapi", "\${typeof window !== "undefined" ? window.location.origin : "https://app.url"}/api/openapi.json"],
      "env": {
        "MO_X_API_KEY": "YOUR_GENERATED_KEY"
      }
    }
  }
}\`}
                    </pre>
                    <button
                      onClick={() => {
                        const config = \`{
  "mcpServers": {
    "mox-hunter": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-openapi", "\${typeof window !== "undefined" ? window.location.origin : "https://app.url"}/api/openapi.json"],
      "env": {
        "MO_X_API_KEY": "YOUR_GENERATED_KEY"
      }
    }
  }
}\`;
                        navigator.clipboard.writeText(config);
                        alert("Configuration copied to clipboard!");
                      }}
                      className="absolute top-2 right-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-zinc-700 opacity-0 group-hover:opacity-100"
                    >
                      Copy JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>`;

if (content.includes(targetStr)) {
  fs.writeFileSync('src/components/settings-panel.tsx', content.replace(targetStr, newStr));
  console.log("Successfully replaced");
} else {
  console.log("Target string not found!");
}
