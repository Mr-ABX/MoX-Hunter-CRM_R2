import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  active: boolean;
  createdAt: any;
}

export function ApiKeysManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const q = query(collection(db, 'mcp_keys'));
      const snapshot = await getDocs(q);
      const fetchedKeys = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ApiKey[];
      setKeys(fetchedKeys.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
    } catch (error) {
      console.error("Error fetching keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'mox_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    setGenerating(true);
    try {
      const newKey = generateRandomKey();
      const docRef = await addDoc(collection(db, 'mcp_keys'), {
        name: newKeyName.trim(),
        key: newKey,
        active: true,
        createdAt: serverTimestamp()
      });
      
      setKeys([{
        id: docRef.id,
        name: newKeyName.trim(),
        key: newKey,
        active: true,
        createdAt: { toMillis: () => Date.now() }
      }, ...keys]);
      
      setNewKeyName('');
      setShowNewKey(false);
    } catch (error) {
      console.error("Error creating key:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this key? Any connections using it will break.')) return;
    try {
      await deleteDoc(doc(db, 'mcp_keys', id));
      setKeys(keys.filter(k => k.id !== id));
    } catch (error) {
      console.error("Error deleting key:", error);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Key className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">MCP API Keys</h2>
          <p className="text-sm text-zinc-400">Manage access keys for your external agents</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {keys.length === 0 ? (
            <div className="text-center py-8 bg-zinc-900 rounded-xl border border-zinc-800">
              <Key className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">No API keys generated yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map(apiKey => (
                <div key={apiKey.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-zinc-200">{apiKey.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">
                        {visibleKeys[apiKey.id] ? apiKey.key : 'mox_' + '•'.repeat(32)}
                      </code>
                      <button 
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {visibleKeys[apiKey.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      {copiedId === apiKey.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === apiKey.id ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showNewKey ? (
            <button
              onClick={() => setShowNewKey(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors mt-4"
            >
              <Plus className="w-4 h-4" />
              Generate New Key
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-4"
            >
              <h4 className="text-sm font-medium text-zinc-200 mb-3">New API Key</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Key name (e.g., Claude Desktop)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowNewKey(false);
                      setNewKeyName('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim() || generating}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
