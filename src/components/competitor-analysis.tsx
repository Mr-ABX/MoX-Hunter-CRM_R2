import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, Loader2, Target, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { ai } from '@/lib/ai';
import { useModels } from '@/contexts/model-context';

export function CompetitorAnalysis() {
  const { models } = useModels();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl || isAnalyzing) return;

    setIsAnalyzing(true);
    setReport(null);

    try {
      const prompt = `Analyze the business website: ${websiteUrl}.
      Find 3 local competitors for this business.
      Analyze their websites and generate a competitive analysis report.
      
      Return a JSON object with the following structure:
      {
        "leadAnalysis": {
          "strengths": ["...", "..."],
          "weaknesses": ["...", "..."]
        },
        "competitors": [
          {
            "name": "Competitor Name",
            "website": "https://...",
            "advantage": "What they do better than the lead",
            "threatLevel": "High/Medium/Low"
          }
        ],
        "pitchAngle": "A massive selling point / closing hook explaining exactly why the lead is falling behind and how our agency can fix it."
      }`;

      const response = await ai.models.generateContent({
        model: models.fast,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      let jsonText = response.text || '{}';
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }

      const parsedData = JSON.parse(jsonText);
      setReport(parsedData);

    } catch (error) {
      console.error('Error analyzing competitors:', error);
      alert('Failed to generate competitor analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-bold tracking-tight text-zinc-100 mb-2">Competitor Analysis</h1>
          <p className="text-zinc-400 text-lg">Generate a massive selling point by showing leads exactly why they are falling behind.</p>
        </header>

        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-xl mb-8">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="url"
                placeholder="Enter lead's website URL (e.g., https://example.com)"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing || !websiteUrl}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Market...</>
              ) : (
                <><Search className="w-5 h-5" /> Generate Report</>
              )}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Pitch Angle */}
              <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Target className="w-32 h-32 text-pink-500" />
                </div>
                <h3 className="text-xl font-display font-semibold text-pink-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> The Pitch Angle
                </h3>
                <p className="text-zinc-200 text-lg leading-relaxed relative z-10">
                  {report.pitchAngle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lead Analysis */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-6">Lead Website Analysis</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Current Strengths
                      </h4>
                      <ul className="space-y-2">
                        {report.leadAnalysis?.strengths?.map((s: string, i: number) => (
                          <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                            <span className="text-emerald-500/50 mt-0.5">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-rose-400 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Critical Weaknesses
                      </h4>
                      <ul className="space-y-2">
                        {report.leadAnalysis?.weaknesses?.map((w: string, i: number) => (
                          <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                            <span className="text-rose-500/50 mt-0.5">•</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Competitors */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-6">Local Competitors</h3>
                  
                  <div className="space-y-4">
                    {report.competitors?.map((comp: any, i: number) => (
                      <div key={i} className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-zinc-100">{comp.name}</h4>
                            <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-1">
                              {comp.website} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <span className={`text-[10px] font-medium px-2 py-1 rounded-full border ${
                            comp.threatLevel?.toLowerCase() === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            comp.threatLevel?.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {comp.threatLevel} Threat
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 mt-3">
                          <strong className="text-zinc-300">Advantage:</strong> {comp.advantage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
