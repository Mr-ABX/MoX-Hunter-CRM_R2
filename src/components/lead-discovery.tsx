import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Briefcase, Loader2, Plus, Target, Lightbulb, CheckCircle2, Globe, Phone, Mail, Star, ExternalLink, Filter, X, Tag } from 'lucide-react';
import { ai } from '@/lib/ai';
import { Type } from '@google/genai';
import { Lead } from '@/App';
import { Logo, LogoFull } from './logo';
import { useModels } from '@/contexts/model-context';

interface DiscoveryState {
  searchQuery: string;
  niche: string;
  city: string;
  leadCount: number;
  websiteFilter: string;
  reviewFilter: string;
  contactFilter: string;
  socialFilter: string;
  results: any[];
  addedLeads: Set<string>;
}

interface LeadDiscoveryProps {
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  state: DiscoveryState;
  setState: React.Dispatch<React.SetStateAction<DiscoveryState>>;
}

export function LeadDiscovery({ onAddLead, state, setState }: LeadDiscoveryProps) {
  const { models } = useModels();
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<{title: string, content: string} | null>(null);
  const [generatingInsightFor, setGeneratingInsightFor] = useState<number | null>(null);

  const updateState = (updates: Partial<DiscoveryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const isValidEmail = (email?: string): email is string => {
    if (!email) return false;
    const lower = email.toLowerCase();
    return lower.includes('@') && !lower.includes('not available') && !lower.includes('n/a') && !lower.includes('none');
  };

  const isValidWebsite = (website?: string): website is string => {
    if (!website) return false;
    const lower = website.toLowerCase();
    return lower.includes('.') && !lower.includes('not available') && !lower.includes('n/a') && !lower.includes('none');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.niche || !state.city || isSearching) return;

    setIsSearching(true);
    updateState({ results: [] });

    try {
      let filterPrompt = "";
      if (state.searchQuery) filterPrompt += ` Specifically look for businesses matching or related to: "${state.searchQuery}".`;
      if (state.websiteFilter === 'no') {
        filterPrompt += " CRITICAL: You MUST select businesses that DO NOT have a website listed on Google Maps, or have a website marked as non-functional. Do not list businesses that have active, functional websites.";
      } else if (state.websiteFilter === 'yes') {
        filterPrompt += " Prioritize businesses that HAVE a registered, active website.";
      }
      if (state.reviewFilter === 'bad') filterPrompt += " Prioritize businesses with poor reviews (under 3.5 stars) or very few reviews, indicating they need reputation management.";
      if (state.reviewFilter === 'good') filterPrompt += " Prioritize businesses with excellent reviews (4.0+ stars).";
      if (state.contactFilter === 'phone') filterPrompt += " Ensure the businesses have a verified phone number listed.";
      if (state.contactFilter === 'email') filterPrompt += " Find businesses that have an email address listed or discoverable.";
      if (state.contactFilter === 'both') filterPrompt += " Ensure the businesses have BOTH a phone number and an email address.";
      if (state.socialFilter === 'yes') filterPrompt += " Prioritize businesses that have social media presence.";

      const prompt = `You are a real-world lead generation assistant. Your task is to find ${state.leadCount || 5} real, verified local businesses in the "${state.niche}" niche located in "${state.city}". ${filterPrompt}

CRITICAL RULES FOR ACCURACY (ANTI-HALLUCINATION MANIFESTO):
1. USE GOOGLE SEARCH GROUNDING: You MUST use your \`googleSearch\` tool to query actual live search results, local listings, and maps info in "${state.city}" for the niche "${state.niche}". Do not generate fictional businesses.
2. ABSOLUTELY NO GUESSING OR HALLUCINATION: Under NO circumstances are you allowed to invent, guess, or make up phone numbers, website URLs, email addresses, or ratings. If a business does not have a website or phone number in the search results, report it as null or empty. Do NOT generate plausible-looking filler or template URLs (e.g., do not write 'http://[businessname].com' or standard '555' numbers).
3. FILTER INTEGRITY: If the filter requires "Needs Website (None/Poor)", you MUST verify that the business has NO website listed, or that the website listed is extremely poor or broken. Do not falsely claim a business has no website if it has a valid one listed.
4. FAITHFUL DATA: Extract the real addresses, phone numbers, star ratings, and review counts exactly as reported by Google Search.

For each business, provide:
1. Name
2. Address (Verify it is in ${state.city})
3. Phone number (Exact real listed number, or leave blank/null if none)
4. Email address (If available or discoverable, or leave blank)
5. Website URL (Exact real URL listed, or leave blank if none)
6. Rating and number of reviews (Exact real star rating and count)
7. Lead Quality Score (1-10) based on their digital presence and need for services.
8. Key Metric: A concise realistic estimation of their "Estimated Monthly Revenue" (e.g., "$10k-$50k/mo").
9. A brief "Strategic Insight" paragraph detailing their likely market position, potential pain points, and a specific "closing hook" an agency could use to pitch them web design or marketing services.

Format the output clearly and objectively.`;

      const response = await ai.models.generateContent({
        model: models.fast,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const parsePrompt = `Extract the businesses from this text and return ONLY a valid JSON array of objects. 
CRITICAL: Do NOT invent, change, or add any websites, phone numbers, or addresses. If a field is not present or listed as not available, make it an empty string or null. The extracted values MUST be 100% identical to the source text.

Source Text: 
${response.text}`;
      
      const parseResponse = await ai.models.generateContent({
        model: models.fast,
        contents: parsePrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                address: { type: Type.STRING },
                phone: { type: Type.STRING },
                email: { type: Type.STRING },
                website: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                reviews: { type: Type.NUMBER },
                score: { type: Type.NUMBER },
                metric: { type: Type.STRING },
                insights: { type: Type.STRING },
              },
              required: ["name", "address"]
            }
          }
        }
      });

      const parsedData = JSON.parse(parseResponse.text || '[]');
      updateState({ results: parsedData });

    } catch (error) {
      console.error('Error discovering leads:', error);
      alert('Failed to discover leads. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateDeepInsight = async (index: number) => {
    const business = state.results[index];
    if (!business) return;

    setGeneratingInsightFor(index);
    try {
      const prompt = `Generate a highly focused, concise strategic insight for a local business named "${business.name}" located at "${business.address}". 
      They are in the ${state.niche} niche in ${state.city}.
      ${business.website ? `Their website is ${business.website}.` : ''}
      
      Return a JSON object with the following structure:
      {
        "marketPosition": "1-2 sentences on their current standing.",
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "closingHook": "A specific, irresistible 1-sentence pitch."
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

      const newResults = [...state.results];
      newResults[index] = {
        ...newResults[index],
        insights: jsonText
      };
      updateState({ results: newResults });
      setSelectedInsight({ title: business.name, content: jsonText });

    } catch (error) {
      console.error('Error generating deep insight:', error);
      alert('Failed to generate deep insight.');
    } finally {
      setGeneratingInsightFor(null);
    }
  };

  const handleAdd = (business: any, index: number) => {
    onAddLead({
      name: business.name,
      niche: state.niche,
      city: state.city,
      status: 'Qualified',
      insights: business.insights,
      phone: business.phone,
      website: business.website,
      rating: business.rating,
      reviews: business.reviews,
      address: business.address,
      email: business.email,
      score: business.score,
      metric: business.metric,
    });
    const newAdded = new Set(state.addedLeads);
    newAdded.add(`${business.name}-${index}`);
    updateState({ addedLeads: newAdded });
  };

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,29,72,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 text-center flex flex-col items-center">
          <div className="mb-6">
            <LogoFull className="h-14 text-zinc-100" />
          </div>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-medium mb-4">AI Acquisition Engine</p>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Locate high-value local business targets and generate irresistible closing hooks for rapid scaling.
          </p>
        </header>

        <form onSubmit={handleSearch} className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={state.searchQuery || ''}
                onChange={(e) => updateState({ searchQuery: e.target.value })}
                placeholder="Specific Business Name or Keyword (Optional)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Briefcase className="w-5 h-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={state.niche}
                onChange={(e) => updateState({ niche: e.target.value })}
                placeholder="Niche (e.g., Dentist, Plumber)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                required
              />
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MapPin className="w-5 h-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={state.city}
                onChange={(e) => updateState({ city: e.target.value })}
                placeholder="City (e.g., Austin, TX)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border ${showFilters ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-rose-500/20"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Hunt
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-zinc-800/50 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Website Status</label>
                    <select 
                      value={state.websiteFilter} 
                      onChange={(e) => updateState({ websiteFilter: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="any">Any</option>
                      <option value="no">Needs Website (None/Poor)</option>
                      <option value="yes">Has Website</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Reviews & Rating</label>
                    <select 
                      value={state.reviewFilter} 
                      onChange={(e) => updateState({ reviewFilter: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="any">Any</option>
                      <option value="bad">Needs Rep Management (&lt;3.5)</option>
                      <option value="good">High Rated (4.0+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Contact Info</label>
                    <select 
                      value={state.contactFilter} 
                      onChange={(e) => updateState({ contactFilter: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="any">Any</option>
                      <option value="phone">Must have Phone</option>
                      <option value="email">Must have Email</option>
                      <option value="both">Both Phone & Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Social Media</label>
                    <select 
                      value={state.socialFilter} 
                      onChange={(e) => updateState({ socialFilter: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="any">Any</option>
                      <option value="yes">Has Social Media</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Lead Count (Max 20)</label>
                    <input 
                      type="number"
                      min="1"
                      max="20"
                      value={state.leadCount || 5} 
                      onChange={(e) => updateState({ leadCount: Math.min(20, Math.max(1, parseInt(e.target.value) || 5)) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {state.results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-semibold text-zinc-100 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-rose-400" /> High-Value Targets Acquired
            </h2>
            {state.results.map((business, i) => {
              const key = `${business.name}-${i}`;
              const isAdded = state.addedLeads.has(key);
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={key}
                  className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-zinc-100">{business.name}</h3>
                        {business.score && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Target className="w-3.5 h-3.5" /> Score: {business.score}/10
                          </div>
                        )}
                      </div>
                      
                      {/* Tags/Categories */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {['Local Business', state.niche || 'Service', state.city || 'Local'].map((tag, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                            <Tag className="w-3 h-3" /> {tag}
                          </span>
                        ))}
                      </div>
                      
                      {business.metric && (
                        <p className="text-xs text-zinc-400 mb-3 font-medium">Est. Metric: <span className="text-zinc-300">{business.metric}</span></p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                        {business.address ? (
                          <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition-colors bg-zinc-950/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                            <MapPin className="w-3.5 h-3.5" /> <span className="truncate max-w-[200px]">{business.address}</span>
                          </a>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-950/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                            <MapPin className="w-3.5 h-3.5" /> No address found
                          </span>
                        )}
                        {business.phone ? (
                          <a href={`tel:${business.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition-colors bg-zinc-950/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                            <Phone className="w-3.5 h-3.5" /> {business.phone}
                          </a>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-950/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                            <Phone className="w-3.5 h-3.5" /> No phone found
                          </span>
                        )}
                        {isValidEmail(business.email) ? (
                          <a href={`mailto:${business.email}`} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition-colors bg-zinc-950/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                            <Mail className="w-3.5 h-3.5" /> {business.email}
                          </a>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-950/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                            <Mail className="w-3.5 h-3.5" /> No email found
                          </span>
                        )}
                        {isValidWebsite(business.website) ? (
                          <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2.5 py-1.5 rounded-lg border border-indigo-500/20">
                            <Globe className="w-3.5 h-3.5" /> {business.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                          </a>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-950/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                            <Globe className="w-3.5 h-3.5" /> No website found
                          </span>
                        )}
                        {business.rating && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-zinc-950/50 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {business.rating} ({business.reviews || 0})
                          </div>
                        )}
                      </div>

                      <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                        <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Strategic Insight</span>
                          <button 
                            onClick={() => handleGenerateDeepInsight(i)}
                            disabled={generatingInsightFor === i}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 disabled:opacity-50"
                          >
                            {generatingInsightFor === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Target className="w-3 h-3" />}
                            Generate Deep Insight
                          </button>
                        </h4>
                        <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2">
                          {(() => {
                            if (!business.insights) return 'No insights generated yet. Click "Generate Deep Insight" to analyze this lead.';
                            try {
                              const parsed = JSON.parse(business.insights);
                              return parsed.closingHook || parsed.marketPosition || business.insights;
                            } catch (e) {
                              return business.insights;
                            }
                          })()}
                        </p>
                        {business.insights && (
                          <button 
                            onClick={() => setSelectedInsight({ title: business.name, content: business.insights })}
                            className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 font-medium"
                          >
                            View Full Insight
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col gap-3">
                      <button
                        onClick={() => handleAdd(business, i)}
                        disabled={isAdded}
                        className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          isAdded 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
                        }`}
                      >
                        {isAdded ? (
                          <><CheckCircle2 className="w-4 h-4" /> Target Acquired</>
                        ) : (
                          <><Plus className="w-4 h-4" /> Capture Lead</>
                        )}
                      </button>
                      
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Social Media</span>
                        <div className="flex flex-wrap gap-2">
                          {business.socials && business.socials.length > 0 ? (
                            business.socials.map((social: string, idx: number) => (
                              <a key={idx} href={social} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-indigo-400">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ))
                          ) : (
                            <span className="text-xs text-zinc-600 italic">No social links found</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insight Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-semibold text-zinc-100 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-amber-400" /> Insight: {selectedInsight.title}
                </h3>
                <button onClick={() => setSelectedInsight(null)} className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-zinc-300 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {(() => {
                  try {
                    const parsed = JSON.parse(selectedInsight.content);
                    return (
                      <div className="space-y-6">
                        <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                          <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-2">Market Position</h4>
                          <p className="text-zinc-300">{parsed.marketPosition}</p>
                        </div>
                        <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                          <h4 className="text-xs font-medium text-rose-400 uppercase tracking-wider mb-2">Critical Weaknesses</h4>
                          <ul className="space-y-2">
                            {parsed.weaknesses?.map((w: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-rose-500/50 mt-0.5">•</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
                          <h4 className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-2">Closing Hook</h4>
                          <p className="text-zinc-200 font-medium">{parsed.closingHook}</p>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return <p>{selectedInsight.content}</p>;
                  }
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
