import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { ai, SYSTEM_INSTRUCTION } from '@/lib/ai';
import { parseMessage, CanvasMode } from '@/lib/parser';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  getDoc
} from 'firebase/firestore';
import { Message, ChatSession, Lead } from '@/App';

export function useChat(
  userId: string | undefined, 
  leads: Lead[], 
  selectedSessionId: string | null,
  activeAgentSessionId: string | null
) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [assets, setAssets] = useState<Message[]>([]);
  const [agentSessions, setAgentSessions] = useState<ChatSession[]>([]);
  const [agentMessages, setAgentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState<CanvasMode | null>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) {
      setSessions([]);
      setMessages([]);
      setAssets([]);
      setAgentSessions([]);
      setAgentMessages([]);
      return;
    }

    // 1. Sessions (Metadata only)
    const qSessions = query(collection(db, 'sessions'), where('userId', '==', userId));
    const unsubSessions = onSnapshot(qSessions, (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ChatSession)).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)));
    }, (error) => console.error('Error fetching sessions:', error));

    // 2. Assets (Messages with canvasMode - needed for FilesPanel)
    const qAssets = query(collection(db, 'messages'), where('userId', '==', userId));
    const unsubAssets = onSnapshot(qAssets, (snapshot) => {
      setAssets(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message)).filter(m => m.canvasMode != null));
    }, (error) => console.error('Error fetching assets:', error));

    // 3. Agent Sessions
    const qAgentSessions = query(collection(db, 'agent_sessions'), where('userId', '==', userId));
    const unsubAgentSessions = onSnapshot(qAgentSessions, (snapshot) => {
      setAgentSessions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ChatSession)).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    }, (error) => console.error('Error fetching agent sessions:', error));

    return () => {
      unsubSessions();
      unsubAssets();
      unsubAgentSessions();
    };
  }, [userId]);

  // 4. Active Session Messages (Chat History - Optimized)
  useEffect(() => {
    if (!userId || !selectedSessionId) {
      setMessages([]);
      return;
    }

    const qMessages = query(
      collection(db, 'messages'), 
      where('userId', '==', userId), 
      where('sessionId', '==', selectedSessionId)
    );
    
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message)).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)));
    }, (error) => console.error('Error fetching session messages:', error));

    return () => unsubMessages();
  }, [userId, selectedSessionId]);

  // 5. Active Agent Messages
  useEffect(() => {
    const effectiveId = activeAgentSessionId || agentSessions[0]?.id;
    if (!userId || !effectiveId) {
      setAgentMessages([]);
      return;
    }

    const qAgentMessages = query(
      collection(db, 'agent_messages'), 
      where('userId', '==', userId), 
      where('sessionId', '==', effectiveId)
    );
    
    const unsubAgentMessages = onSnapshot(qAgentMessages, (snapshot) => {
      setAgentMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message)).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)));
    }, (error) => console.error('Error fetching agent session messages:', error));

    return () => unsubAgentMessages();
  }, [userId, activeAgentSessionId, agentSessions]);

  useEffect(() => {
    if (!chatRef.current) {
      const agentMode = typeof window !== 'undefined' ? localStorage.getItem('agentMode') || 'solo' : 'solo';
      const persona = agentMode === 'agency' 
        ? 'You are an expert agency growth consultant working with a professional agency team.' 
        : 'You are an expert consultant helping a solo contractor / freelancer grow their business.';

      chatRef.current = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: {
          systemInstruction: `${persona}\n\n${SYSTEM_INSTRUCTION}`,
        },
      });
    }
  }, []);

  const handleCreateSession = async (leadId: string | null) => {
    if (!userId) return null;
    try {
      const newSession = {
        leadId: leadId || 'general',
        name: leadId ? `Chat ${sessions.filter(s => s.leadId === leadId).length + 1}` : 'General Chat',
        createdAt: Date.now(),
        userId
      };
      const sessionDoc = await addDoc(collection(db, 'sessions'), newSession);
      return sessionDoc.id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const submitMessage = async (
    text: string, 
    selectedLeadId: string | null, 
    selectedSessionId: string | null,
    activeCanvasTab: CanvasMode,
    onSessionCreated: (id: string) => void,
    onAssetCreated: (assetKey: string, messageId: string) => void,
    onImageGenerated: (prompt: string, messageId: string) => void,
    imageData?: string // Base64 image data
  ) => {
    if (!text.trim() || isLoading || !userId) return;

    let finalSessionId = selectedSessionId;

    try {
      if (!finalSessionId) {
        const newSessionId = await handleCreateSession(selectedLeadId);
        if (newSessionId) {
          finalSessionId = newSessionId;
          onSessionCreated(newSessionId);
        } else {
          return;
        }
      }

      const userMessage = {
        role: 'user' as const,
        text: text,
        imageUrl: imageData || null,
        leadId: selectedLeadId || null,
        sessionId: finalSessionId,
        userId,
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'messages'), userMessage);
      setIsLoading(true);
      setLoadingMode(activeCanvasTab);

      let messagePayload: any = userMessage.text;
      if (imageData) {
        // Extract base64 data without the data:image/jpeg;base64, prefix
        const base64Data = imageData.split(',')[1] || imageData;
        const mimeType = imageData.split(';')[0].split(':')[1] || 'image/jpeg';
        messagePayload = [
          { text: userMessage.text },
          { inlineData: { data: base64Data, mimeType } }
        ];
      }

      const response = await chatRef.current.sendMessage({ message: messagePayload });
      const responseText = response.text;
      
      const parsed = parseMessage(responseText);
      
      const modelMessage = {
        role: 'model' as const,
        text: parsed.text,
        canvasContent: parsed.canvasContent || null,
        canvasMode: parsed.canvasMode || null,
        leadId: selectedLeadId || null,
        sessionId: finalSessionId,
        userId,
        createdAt: Date.now()
      };

      const modelDoc = await addDoc(collection(db, 'messages'), modelMessage);

      if (parsed.canvasContent && parsed.canvasMode) {
        const assetKey = `${selectedLeadId || 'default'}-${finalSessionId || 'default'}-${parsed.canvasMode}`;
        onAssetCreated(assetKey, modelDoc.id);

        if (parsed.canvasMode === 'GRAPHIC') {
          onImageGenerated(parsed.canvasContent, modelDoc.id);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (userId) {
        await addDoc(collection(db, 'messages'), {
          role: 'model',
          text: 'Sorry, I encountered an error. Please try again.',
          leadId: selectedLeadId || null,
          sessionId: finalSessionId || null,
          userId,
          createdAt: Date.now()
        });
      }
    } finally {
      setIsLoading(false);
      setLoadingMode(null);
    }
  };

  const handleAgentSendMessage = async (text: string, sessionId: string, tasks: any[], notes: any[]) => {
    if (!userId || !text.trim()) return;

    try {
      const session = agentSessions.find(s => s.id === sessionId);
      const selectedLead = leads.find(l => l.id === session?.leadId);

      const persona = "You are 'The Wolf', an elite, aggressive, and highly strategic lead generation expert and closer. You speak with extreme confidence, occasionally using subtle hunting metaphors (tracking, the kill, the pack, hunting grounds). Your goal is to help the user hunt down high-value leads, dominate their market, and close deals ruthlessly but professionally. Provide actionable, sharp, and highly effective advice. No fluff.";

      const appStateContext = `
      CURRENT APP STATE CONTEXT:
      - Total Leads: ${leads.length}
      - Total Tasks: ${tasks.length} (${tasks.filter(t => !t.completed).length} active)
      - Total Notes: ${notes.length}
      
      Use this context to give specific, highly relevant advice. If they ask about their tasks, reference them. If they ask about their leads, reference them.
      `;

      const systemInstruction = selectedLead 
        ? `${persona}\n\n${appStateContext}\n\nYou are helping hunt and close a specific target: "${selectedLead.name}", a ${selectedLead.niche} business in ${selectedLead.city}. 
           Use these insights to guide your attack plan: ${selectedLead.insights || 'No specific insights available.'}
           Help brainstorm angles, analyze their weaknesses, and suggest the exact outreach sequence for the kill.`
        : `${persona}\n\n${appStateContext}\n\nHelp the user brainstorm new hunting grounds (niches), track new business opportunities, analyze markets, and sharpen their operations.`;

      const agentChat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction,
        }
      });

      await addDoc(collection(db, 'agent_messages'), {
        role: 'user',
        text,
        sessionId,
        userId,
        createdAt: Date.now()
      });

      const response = await agentChat.sendMessage({ message: text });
      
      await addDoc(collection(db, 'agent_messages'), {
        role: 'model',
        text: response.text || 'Sorry, I could not generate a response.',
        sessionId,
        userId,
        createdAt: Date.now()
      });

    } catch (error) {
      console.error('Agent chat error:', error);
    }
  };

  const handleCreateAgentSession = async (title: string, leadId?: string) => {
    if (!userId) return '';
    try {
      const newSession = {
        name: title,
        leadId: leadId || null,
        userId,
        createdAt: Date.now(),
        isAgent: true
      };
      const docRef = await addDoc(collection(db, 'agent_sessions'), newSession);
      return docRef.id;
    } catch (error) {
      console.error('Error creating agent session:', error);
      return '';
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'messages', assetId));
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  return { 
    sessions, 
    messages, 
    assets,
    agentSessions, 
    agentMessages, 
    isLoading, 
    loadingMode,
    submitMessage, 
    handleCreateSession, 
    handleAgentSendMessage, 
    handleCreateAgentSession,
    handleDeleteAsset
  };
}
