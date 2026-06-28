
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ai } from '@/lib/ai';
import { CanvasMode } from '@/lib/parser';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc 
} from 'firebase/firestore';

import { ChatPanel } from '@/components/chat-panel';
import { CanvasPanel } from '@/components/canvas-panel';
import { Dashboard } from '@/components/dashboard';
import { LeadDiscovery } from '@/components/lead-discovery';
import { LeadCRM } from '@/components/lead-crm';
import { CompetitorAnalysis } from '@/components/competitor-analysis';
import { OutreachPanel } from '@/components/outreach-panel';
import { AgentChat } from '@/components/agent-chat';
import { SettingsPanel } from '@/components/settings-panel';
import { FilesPanel } from '@/components/files-panel';
import { TasksPanel } from '@/components/tasks-panel';
import { AnalyticsPanel } from '@/components/analytics-panel';
import { ContractsPanel } from '@/components/contracts-panel';
import { Sidebar } from '@/components/sidebar';
import { AlphasPanel } from '@/components/alphas-panel';

import { ALPHAS, SKILLS } from '@/lib/alphas';

import { useAuth } from '@/hooks/use-auth';
import { useLeads } from '@/hooks/use-leads';
import { useTasks } from '@/hooks/use-tasks';
import { useNotes } from '@/hooks/use-notes';
import { useChat } from '@/hooks/use-chat';

import { 
  Loader2, 
  Wand2, 
  LayoutTemplate, 
  Image as ImageIcon, 
  PenTool, 
  AlignLeft, 
  FolderOpen, 
  Mic, 
  Code2,
  RefreshCw,
  ImagePlus,
  ChevronDown,
  Cpu,
  Target,
  X
} from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  canvasContent?: string | null;
  canvasMode?: CanvasMode;
  leadId?: string | null;
  sessionId?: string | null;
  userId: string;
  createdAt: number;
  isAgent?: boolean;
}

export interface ChatSession {
  id: string;
  leadId: string | null;
  name: string;
  userId: string;
  createdAt: number;
  isAgent?: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  archived: boolean;
  category: string;
  leadId?: string;
  dueDate?: number;
  reminderDate?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  archived: boolean;
  leadId?: string;
  createdAt: number;
}

export interface Lead {
  id: string;
  name: string;
  niche: string;
  city: string;
  status: 'Qualified' | 'Built' | 'Contacted' | 'Negotiating' | 'Closed';
  insights?: string;
  prototypeId?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  address?: string;
  email?: string;
  socials?: string[];
  score?: number;
  metric?: string;
  contractStatus?: 'Active' | 'Pending' | 'Canceled';
  billingAmount?: string;
  billingCycle?: 'Monthly' | 'One-time' | 'Yearly';
  currency?: 'USD' | 'AED' | 'PKR' | 'GBP' | 'EUR';
  activeServices?: string;
  lastActionDate?: number;
  nextFollowUpDate?: number;
  dealValue?: number;
}

type ViewMode = 'dashboard' | 'discovery' | 'crm' | 'canvas' | 'competitor' | 'outreach' | 'agent' | 'files' | 'settings' | 'tasks' | 'analytics' | 'contracts' | 'alphas';

export default function Home() {
  const { user, authLoading, handleSignIn, handleSignOut } = useAuth();
  const { leads, handleAddLead, handleLeadUpdate, handleDeleteLead } = useLeads(user?.uid);
  const { tasks, handleAddTask, handleToggleTask, handleArchiveTask, handleDeleteTask } = useTasks(user?.uid);
  const { notes, handleAddNote, handleArchiveNote, handleDeleteNote } = useNotes(user?.uid);

  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [chatWidth, setChatWidth] = useState(400); // Default chat panel width
  const [isResizing, setIsResizing] = useState(false);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Calculate width based on mouse position relative to window left edge
      // Set limits: min 300px, max 800px or 60% of viewport width
      const newWidth = Math.min(Math.max(300, e.clientX), document.body.clientWidth * 0.6);
      setChatWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Discovery State
  const [discoveryState, setDiscoveryState] = useState({
    searchQuery: '',
    niche: '',
    city: '',
    leadCount: 5,
    websiteFilter: 'any',
    reviewFilter: 'any',
    contactFilter: 'any',
    socialFilter: 'any',
    results: [] as any[],
    addedLeads: new Set<string>()
  });

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [activeAgentSessionId, setActiveAgentSessionId] = useState<string | null>(null);
  const [activeCanvasTab, setActiveCanvasTab] = useState<NonNullable<CanvasMode>>('WEB');
  const [selectedAssetIds, setSelectedAssetIds] = useState<Record<string, string>>({});
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [pendingModeSwitch, setPendingModeSwitch] = useState<CanvasMode | null>(null);
  const [isStudioFilesOpen, setIsStudioFilesOpen] = useState(false);
  const [isSwitcherExpanded, setIsSwitcherExpanded] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isAlphaMenuOpen, setIsAlphaMenuOpen] = useState(false);
  const [autoMountSkills, setAutoMountSkills] = useState(true);
  const [activeAlphas, setActiveAlphas] = useState<string[]>(['web-architect']);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [actionMode, setActionMode] = useState<'auto' | 'planning' | 'execution'>('auto');
  const [isRebrandMode, setIsRebrandMode] = useState(false);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [annotationType, setAnnotationType] = useState<'inspect' | 'draw'>('inspect');
  const [annotationContext, setAnnotationContext] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suppress Monaco editor 'cancelation' and ResizeObserver errors
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason && 
        typeof event.reason === 'object' && 
        (event.reason.type === 'cancelation' || event.reason.msg === 'operation is manually canceled')
      ) {
        event.preventDefault(); // Suppress error
      }
    };

    const handleResizeObserverError = (e: ErrorEvent) => {
      // Catch all ResizeObserver variations including prefixes
      const isResizeObserverError = 
        e.message?.includes('ResizeObserver') || 
        e.error?.message?.includes('ResizeObserver') ||
        e.message?.includes('loop limit exceeded') ||
        e.message?.includes('undelivered notifications');

      if (isResizeObserverError) {
        const errorElement = document.querySelector('.resize-observer-error-overlay');
        if (errorElement) errorElement.remove();
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleResizeObserverError);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, []);

  const { 
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
  } = useChat(user?.uid, leads, selectedSessionId, activeAgentSessionId);

  const currentActiveAgentSessionId = activeAgentSessionId || agentSessions[0]?.id || null;

  const currentLeadMessages = messages;
  const currentLeadAssets = assets.filter(m => 
    (selectedLeadId ? m.leadId === selectedLeadId : true) &&
    (selectedSessionId ? m.sessionId === selectedSessionId : true)
  );
  
  const currentAssetKey = `${selectedLeadId || 'default'}-${selectedSessionId || 'default'}-${activeCanvasTab}`;
  const currentAssetId = selectedAssetIds[currentAssetKey];
  
  const currentAsset = currentLeadAssets.find(m => m.id === currentAssetId) || 
                       currentLeadAssets.slice().reverse().find(m => m.canvasMode === activeCanvasTab);

  const versions = currentLeadAssets
    .filter(m => m.canvasMode === activeCanvasTab && m.canvasContent)
    .map((m, index) => ({ id: m.id, version: index + 1 }));

  const handleLeadSelect = (leadId: string) => {
    setSelectedLeadId(leadId);
    const leadSessions = sessions.filter(s => s.leadId === leadId);
    if (leadSessions.length > 0) {
      setSelectedSessionId(leadSessions[leadSessions.length - 1].id);
    } else {
      setSelectedSessionId(null);
    }
  };

  const handleModeSwitchRequest = (mode: NonNullable<CanvasMode>) => {
    if (activeCanvasTab === mode) return;
    
    const currentSessionMessages = messages.filter(m => m.sessionId === selectedSessionId);
    if (currentSessionMessages.length > 0 && selectedSessionId) {
      setPendingModeSwitch(mode);
    } else {
      setActiveCanvasTab(mode);
    }
  };

  const confirmModeSwitch = async (createNewSession: boolean) => {
    if (!pendingModeSwitch || !user) return;
    
    if (createNewSession && selectedLeadId) {
      const newId = await handleCreateSession(selectedLeadId);
      if (newId) setSelectedSessionId(newId);
    }
    
    setActiveCanvasTab(pendingModeSwitch);
    setPendingModeSwitch(null);
  };

  const handleGeneratePrototype = async (lead: Lead, type: 'auto' | 'manual') => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'leads', lead.id), { status: 'Built' });
      setSelectedLeadId(lead.id);
      
      const newSessionId = await handleCreateSession(lead.id);
      if (newSessionId) {
        setSelectedSessionId(newSessionId);
        setCurrentView('canvas');
        setActiveCanvasTab('WEB');

        if (type === 'auto') {
          const prompt = `Generate a complete, high-converting landing page prototype for ${lead.name}, a ${lead.niche} in ${lead.city}. 
          Use these strategic insights to inform the copy and design: ${lead.insights}.
          Make it look premium and ready to pitch.`;
          
          setInput(prompt);
          setTimeout(() => submitMessage(
            prompt, 
            lead.id, 
            newSessionId, 
            'WEB', 
            setSelectedSessionId, 
            (key, id) => setSelectedAssetIds(prev => ({ ...prev, [key]: id })),
            generateImage,
            undefined,
            activeAlphas,
            activeSkills
          ), 100);
        } else {
          setInput(`Help me build a prototype for ${lead.name} (${lead.niche} in ${lead.city}).`);
        }
      }
    } catch (error) {
      console.error('Error generating prototype:', error);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    let finalInput = input;
    
    if (isAnnotationMode && annotationContext) {
      finalInput = `[SURGICAL TARGET LOCK ACTIVE]\nTarget Block: \n\`\`\`\n${annotationContext}\n\`\`\`\n\nInstructions: ${input}\n\nCRITICAL INSTRUCTION: You MUST return the ENTIRE, COMPLETE code file so the application does not break. Do NOT output just the modified snippet. Apply the requested changes ONLY to the target block and leave all other code 100% untouched.`;
      // Turn off annotation mode after submission to prevent accidental continuous targeting
      setIsAnnotationMode(false);
      setAnnotationContext(null);
    } else if (isRebrandMode) {
      finalInput = `[REBRAND MODE ACTIVE] Please rebrand the following content/site for the selected lead. Ensure the design is highly professional, conversion-focused, and matches the lead's niche.\n\n${input}`;
    }

    if (actionMode === 'planning') {
      finalInput = `[PROTOCOL: PLANNING MODE]\nCRITICAL INSTRUCTION: Brainstorm and outline a plan based on the user's request. **DO NOT output any code blocks, canvas assets, or HTML**. Just outline the steps. End your message by explicitly asking: "Do you want me to execute this plan?"\n\n${finalInput}`;
    }
    
    submitMessage(
      finalInput, 
      selectedLeadId, 
      selectedSessionId, 
      activeCanvasTab, 
      setSelectedSessionId, 
      (key, id) => setSelectedAssetIds(prev => ({ ...prev, [key]: id })),
      generateImage,
      selectedImage || undefined,
      activeAlphas,
      activeSkills
    );
    setInput('');
    setSelectedImage(null);
  };

  const handleVisualComment = (selector: string, html: string, comment: string) => {
    let finalInput = `[AIS_METADATA_SECTION_START]\nCSS selector: ${selector}\n[AIS_METADATA_SECTION_END]\n\n[SURGICAL TARGET LOCK ACTIVE]\nI have selected the following precise element in the preview:\n\`\`\`html\n${html}\n\`\`\`\n\n[CHANGE REQUEST]\n${comment}\n\nCRITICAL INSTRUCTION: You MUST return the ENTIRE, COMPLETE HTML document so the user's page does not break. Do NOT output just the modified HTML snippet. Apply the requested changes ONLY to the element matching the CSS selector, and leave all other code 100% untouched.`;
    
    if (html.toLowerCase().includes('<img') || comment.toLowerCase().includes('image') || comment.toLowerCase().includes('picture')) {
      finalInput += `\n\n[IMAGE REPLACEMENT STRATEGY]: If the user wants to change an image, generate a relevant, high-quality Unsplash image URL (e.g., https://source.unsplash.com/800x600/?truck) or an AI placeholder and update the \`src\` attribute directly without asking for confirmation.`;
    }

    submitMessage(
      finalInput, 
      selectedLeadId, 
      selectedSessionId, 
      activeCanvasTab, 
      setSelectedSessionId, 
      (key, id) => setSelectedAssetIds(prev => ({ ...prev, [key]: id })),
      generateImage,
      selectedImage || undefined,
      activeAlphas,
      activeSkills
    );
  };

  const handleGraphicComment = (x: number, y: number, comment: string) => {
    const finalInput = `[AIS_METADATA_SECTION_START]\nCoordinates: { x: ${x}%, y: ${y}% }\n[AIS_METADATA_SECTION_END]\n\n[SURGICAL TARGET LOCK ACTIVE]\nI have placed a pin on the image at coordinates X: ${x}%, Y: ${y}% (from top-left).\n\n[CHANGE REQUEST]\n${comment}\n\nINSTRUCTION: Analyze the image at these specific coordinates and apply the requested changes during your next image generation.`;
    
    submitMessage(
      finalInput, 
      selectedLeadId, 
      selectedSessionId, 
      activeCanvasTab, 
      setSelectedSessionId, 
      (key, id) => setSelectedAssetIds(prev => ({ ...prev, [key]: id })),
      generateImage,
      selectedImage || undefined,
      activeAlphas,
      activeSkills
    );
  };

  const handleContentComment = (selectedText: string, comment: string) => {
    const finalInput = `[AIS_METADATA_SECTION_START]\nTarget Text: "${selectedText}"\n[AIS_METADATA_SECTION_END]\n\n[SURGICAL TARGET LOCK ACTIVE]\nI have highlighted the following specific text in the document:\n\`\`\`text\n${selectedText}\n\`\`\`\n\n[CHANGE REQUEST]\n${comment}\n\nCRITICAL INSTRUCTION: You MUST return the ENTIRE, COMPLETE document so the user's content does not break. Apply the requested changes ONLY to the highlighted text, and leave all other content 100% untouched.`;
    
    submitMessage(
      finalInput, 
      selectedLeadId, 
      selectedSessionId, 
      activeCanvasTab, 
      setSelectedSessionId, 
      (key, id) => setSelectedAssetIds(prev => ({ ...prev, [key]: id })),
      generateImage,
      selectedImage || undefined,
      activeAlphas,
      activeSkills
    );
  };

  const handleDrawComment = (rectStr: string, comment: string) => {
    let finalInput = `[AIS_METADATA_SECTION_START]\nDrawn Target Box: Rectangle[${rectStr}]\n[AIS_METADATA_SECTION_END]\n\n[SURGICAL TARGET LOCK ACTIVE]\nI have drawn a box selecting a specific region on the view (X: ${rectStr.split(',')[0]}%, Y: ${rectStr.split(',')[1]}%, Width: ${rectStr.split(',')[2]}%, Height: ${rectStr.split(',')[3]}%).\n\n[CHANGE REQUEST]\n${comment}\n\nCRITICAL INSTRUCTION: Analyze the canvas around the provided relative coordinates and apply the requested change only to that particular region. Leave everything else untouched.`;
    
    if (comment.toLowerCase().includes('image') || comment.toLowerCase().includes('picture')) {
      finalInput += `\n\n[IMAGE REPLACEMENT STRATEGY]: If the user wants to change an image, generate a relevant, high-quality Unsplash image URL (e.g., https://source.unsplash.com/800x600/?truck) or an AI placeholder and update the \`src\` attribute directly without asking for confirmation.`;
    }

    submitMessage(
      finalInput, 
      selectedLeadId, 
      selectedSessionId, 
      activeCanvasTab, 
      setSelectedSessionId, 
      (key, id) => setSelectedAssetIds(prev => ({ ...prev, [key]: id })),
      generateImage,
      selectedImage || undefined,
      activeAlphas,
      activeSkills
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async (prompt: string, messageId: string) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64EncodeString}`;
          setGeneratedImages((prev) => ({ ...prev, [messageId]: imageUrl }));
          break;
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleVibeSwitch = async (vibe: string) => {
    if (!currentAsset || isLoading) return;
    const prompt = `Rewrite the current canvas asset but change the aesthetic to '${vibe}'. Keep the same mode.`;
    submitMessage(
      prompt, 
      selectedLeadId, 
      selectedSessionId, 
      activeCanvasTab, 
      setSelectedSessionId, 
      (key, id) => setSelectedAssetIds(prev => ({ ...prev, [key]: id })),
      generateImage,
      undefined,
      activeAlphas,
      activeSkills
    );
  };

  const handleSaveContent = async (newContent: string, isAutoSave: boolean = false) => {
    if (!currentAsset || !user) return;
    
    try {
      if (isAutoSave) {
        await updateDoc(doc(db, 'messages', currentAsset.id), { canvasContent: newContent });
      } else {
        // eslint-disable-next-line react-hooks/purity
        const now = Date.now();
        const editedMessage = {
          role: 'model' as const,
          text: 'Manually edited asset.',
          canvasContent: newContent,
          canvasMode: currentAsset.canvasMode,
          leadId: currentAsset.leadId || null,
          sessionId: currentAsset.sessionId || null,
          userId: user.uid,
          createdAt: now
        };

        const docRef = await addDoc(collection(db, 'messages'), editedMessage);
        const assetKey = `${currentAsset.leadId || 'default'}-${currentAsset.sessionId || 'default'}-${currentAsset.canvasMode}`;
        setSelectedAssetIds(prev => ({ ...prev, [assetKey]: docRef.id }));
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleCreateBlankAsset = async () => {
    if (!user) return;
    
    let sessionId = selectedSessionId;
    if (!sessionId) {
      sessionId = await handleCreateSession(selectedLeadId);
      if (sessionId) setSelectedSessionId(sessionId);
      else return;
    }

    let defaultContent = '';
    // No longer generating full dark boilerplate to avoid causing "flicker" 
    // and to respect user request for empty code section.
    // The CanvasPanel will show the nice dark empty state instead.
    switch (activeCanvasTab) {
      case 'WEB':
        defaultContent = ''; 
        break;
      case 'SVG':
        defaultContent = '';
        break;
      case 'CONTENT':
        defaultContent = '';
        break;
      case 'GRAPHIC':
        defaultContent = '';
        break;
    }

    try {
      const now = Date.now();
      const blankMessage = {
        role: 'model' as const,
        text: 'Created a blank canvas for you to start editing.',
        canvasContent: defaultContent,
        canvasMode: activeCanvasTab,
        leadId: selectedLeadId || null,
        sessionId: sessionId,
        userId: user.uid,
        createdAt: now
      };

      const docRef = await addDoc(collection(db, 'messages'), blankMessage);
      const assetKey = `${selectedLeadId || 'default'}-${sessionId || 'default'}-${activeCanvasTab}`;
      setSelectedAssetIds(prev => ({ ...prev, [assetKey]: docRef.id }));
      
      // Force switch to source view so user can start coding immediately
      const canvasPanel = document.querySelector('[data-canvas-panel]');
      if (canvasPanel) {
        const sourceBtn = canvasPanel.querySelector('button[data-view-source]') as HTMLButtonElement;
        sourceBtn?.click();
      }
    } catch (error) {
      console.error('Error creating blank asset:', error);
    }
  };

  const getEmptyStateMessage = (mode: NonNullable<CanvasMode>) => {
    switch (mode) {
      case 'WEB': return { title: 'Landing Page Workspace', desc: 'Ask the AI to generate a landing page to see it here.' };
      case 'GRAPHIC': return { title: 'Ad Graphics Workspace', desc: 'Ask the AI to generate an ad graphic or banner.' };
      case 'SVG': return { title: 'Vector & Logo Workspace', desc: 'Ask the AI to generate an animated SVG logo.' };
      case 'CONTENT': return { title: 'Copywriting Workspace', desc: 'Ask the AI to write ad copy, emails, or scripts.' };
      default: return { title: 'Workspace', desc: 'Ask the AI to generate something to see it here.' };
    }
  };

  const emptyState = getEmptyStateMessage(activeCanvasTab);

  if (authLoading) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-zinc-400 font-medium animate-pulse">Initializing Wolf CRM...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Handled by router
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        leadsCount={leads.length} 
        messagesCount={messages.length} 
        handleSignOut={handleSignOut} 
      />

      {/* Main Content Area */}
      <div className="flex-1 relative flex h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <Dashboard onNavigate={setCurrentView} leads={leads} tasks={tasks} notes={notes} />
            </motion.div>
          )}
          
          {currentView === 'discovery' && (
            <motion.div key="discovery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <LeadDiscovery onAddLead={handleAddLead} state={discoveryState} setState={setDiscoveryState} />
            </motion.div>
          )}

          {currentView === 'competitor' && (
            <motion.div key="competitor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <CompetitorAnalysis />
            </motion.div>
          )}

          {currentView === 'outreach' && (
            <motion.div key="outreach" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <OutreachPanel leads={leads} onUpdateLead={handleLeadUpdate} />
            </motion.div>
          )}

          {currentView === 'agent' && (
            <motion.div key="agent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <AgentChat 
                leads={leads} tasks={tasks} notes={notes} sessions={agentSessions} messages={agentMessages}
                activeSessionId={currentActiveAgentSessionId} onSendMessage={(text, sid) => handleAgentSendMessage(text, sid, tasks, notes)}
                onCreateSession={handleCreateAgentSession} onSelectSession={setActiveAgentSessionId}
              />
            </motion.div>
          )}

          {currentView === 'contracts' && (
            <motion.div key="contracts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <ContractsPanel leads={leads} />
            </motion.div>
          )}

          {currentView === 'files' && (
            <motion.div key="files" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <FilesPanel key={`main-${selectedLeadId || 'all'}`} messages={assets} leads={leads} initialLeadId={selectedLeadId || undefined} />
            </motion.div>
          )}

          {currentView === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <TasksPanel 
                tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onArchiveTask={handleArchiveTask} onDeleteTask={handleDeleteTask}
                notes={notes} onAddNote={handleAddNote} onArchiveNote={handleArchiveNote} onDeleteNote={handleDeleteNote} leads={leads} 
              />
            </motion.div>
          )}

          {currentView === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <AnalyticsPanel leads={leads} />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <SettingsPanel />
            </motion.div>
          )}

          {currentView === 'crm' && (
            <motion.div key="crm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <LeadCRM 
                leads={leads} onGeneratePrototype={handleGeneratePrototype} onNavigate={setCurrentView}
                onUpdateLead={handleLeadUpdate} onDeleteLead={handleDeleteLead} onAddLead={handleAddLead}
                onSelectLead={(id) => { setSelectedLeadId(id); setCurrentView('files'); }}
              />
            </motion.div>
          )}

          {currentView === 'alphas' && (
            <motion.div key="alphas" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <AlphasPanel />
            </motion.div>
          )}

          {currentView === 'canvas' && (
            <motion.div key="canvas" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex h-full">
              <div 
                className="flex flex-col h-full border-r border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md z-30 relative shrink-0 transition-none"
                style={{ width: `${chatWidth}px` }}
              >
                {/* Resize Handle */}
                <div 
                  className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-500/50 transition-colors z-50 ${isResizing ? 'bg-indigo-500/50' : 'bg-transparent'}`}
                  onMouseDown={startResize}
                />
                
                <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                  <h2 className="font-display font-semibold tracking-tight text-zinc-100">Studio Chat</h2>
                  <div className="relative z-50">
                    <button 
                      onClick={() => setIsAlphaMenuOpen(!isAlphaMenuOpen)}
                        className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-all select-none"
                      >
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-medium text-zinc-300">
                          {activeAlphas.length + activeSkills.length === 0 ? 'No Alphas/Skills' :
                           `${activeAlphas.length} Alphas, ${activeSkills.length} Skills`}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isAlphaMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isAlphaMenuOpen && (
                          <>
                            <div className="fixed inset-0" onClick={() => setIsAlphaMenuOpen(false)} />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 overflow-hidden z-50 max-h-[60vh] overflow-y-auto custom-scrollbar"
                            >
                              <div className="px-2 py-2 mb-1 border-b border-zinc-800/50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mounted Alphas</span>
                                <label className="flex items-center gap-1.5 cursor-pointer group">
                                  <span className="text-[9px] font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">Auto-mount Skills</span>
                                  <div className="relative inline-block w-6 h-3.5">
                                    <input type="checkbox" className="opacity-0 w-0 h-0 peer" checked={autoMountSkills} onChange={(e) => setAutoMountSkills(e.target.checked)} />
                                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-zinc-700 rounded-full transition-colors peer-checked:bg-indigo-500"></span>
                                    <span className="absolute left-[2px] bottom-[2px] bg-white w-2.5 h-2.5 rounded-full transition-transform peer-checked:translate-x-[10px]"></span>
                                  </div>
                                </label>
                              </div>
                              {ALPHAS.map(alpha => {
                                const isActive = activeAlphas.includes(alpha.id);
                                return (
                                  <button
                                    key={alpha.id}
                                    onClick={() => {
                                      if (isActive) {
                                        setActiveAlphas(prev => prev.filter(id => id !== alpha.id));
                                      } else {
                                        setActiveAlphas(prev => [...prev, alpha.id]);
                                        if (autoMountSkills && alpha.recommendedSkills) {
                                          setActiveSkills(prev => Array.from(new Set([...prev, ...alpha.recommendedSkills!])));
                                        }
                                      }
                                    }}
                                    className={`w-full text-left px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-400 shadow-[0_0_8px_currentColor]' : 'bg-zinc-600'}`} />
                                      {alpha.name}
                                    </div>
                                  </button>
                                );
                              })}
                              
                              <div className="px-2 py-1.5 mt-2 mb-1 border-b border-zinc-800/50">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Skills</span>
                              </div>
                              {SKILLS.map(skill => {
                                const isActive = activeSkills.includes(skill.id);
                                return (
                                  <button
                                    key={skill.id}
                                    onClick={() => setActiveSkills(prev => isActive ? prev.filter(id => id !== skill.id) : [...prev, skill.id])}
                                    className={`w-full text-left px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 shadow-[0_0_8px_currentColor]' : 'bg-zinc-600'}`} />
                                      {skill.name}
                                    </div>
                                  </button>
                                );
                              })}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                </div>
                <ChatPanel 
                  messages={currentLeadMessages} isLoading={isLoading} activeMode={activeCanvasTab} leads={leads} selectedLeadId={selectedLeadId}
                  onLeadSelect={handleLeadSelect} sessions={sessions} selectedSessionId={selectedSessionId} onSessionSelect={setSelectedSessionId}
                  onCreateSession={() => handleCreateSession(selectedLeadId).then(id => id && setSelectedSessionId(id))}
                  onCanvasSelect={(content, mode, messageId) => {
                    setActiveCanvasTab(mode!);
                    const assetKey = `${selectedLeadId || 'default'}-${selectedSessionId || 'default'}-${mode}`;
                    setSelectedAssetIds(prev => ({ ...prev, [assetKey]: messageId }));
                  }}
                  onSuggestionClick={(suggestion) => setInput(suggestion)}
                />
                <div className="p-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/30 w-full flex justify-center">
                  <form onSubmit={(e) => {
                    handleSubmit(e);
                    // Reset textarea height after submit
                    setTimeout(() => {
                      const textareas = document.querySelectorAll('textarea');
                      textareas.forEach(ta => ta.style.height = 'auto');
                    }, 10);
                  }} className="relative w-full max-w-3xl">
                    <div className="relative w-full bg-zinc-900 border border-zinc-800/80 rounded-[28px] p-2 shadow-sm focus-within:ring-1 focus-within:ring-zinc-700 focus-within:border-zinc-700 transition-all flex flex-col">
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                      />
                      
                      {selectedImage && (
                        <div className="px-3 pt-3 pb-1">
                          <div className="relative inline-block group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selectedImage} alt="Reference" className="h-14 w-14 rounded-xl object-cover border border-zinc-700/50 shadow-sm" />
                            <button 
                              type="button" 
                              onClick={() => setSelectedImage(null)}
                              className="absolute -top-1.5 -right-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {isAnnotationMode && (
                        <div className="px-3 pt-2 pb-1">
                          <div className="flex bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 relative">
                            <button 
                              type="button" 
                              onClick={() => { setIsAnnotationMode(false); setAnnotationContext(null); }}
                              className="absolute top-1 right-1 p-1 text-emerald-500/60 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <Target className="w-4 h-4 text-emerald-400 mt-0.5 mr-2 shrink-0" />
                            <div className="flex-1 overflow-hidden">
                              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Surgical Target Locked</p>
                              <p className="text-xs text-emerald-300/80 truncate font-mono">
                                {annotationContext || "Waiting for selection in canvas..."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <textarea 
                        value={input} 
                        onChange={(e) => {
                          setInput(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                            setTimeout(() => {
                              if (e.target instanceof HTMLTextAreaElement) {
                                e.target.style.height = 'auto';
                              }
                            }, 10);
                          }
                        }}
                        placeholder={isAnnotationMode ? "Provide instructions for the highlighted specific block..." : "What do we need to design or write?"} 
                        rows={1}
                        className={`w-full bg-transparent border-none px-3 pt-2.5 pb-1 focus:outline-none focus:ring-0 placeholder:text-zinc-500 resize-none min-h-[44px] max-h-[250px] overflow-y-auto custom-scrollbar text-[15px] leading-relaxed transition-colors ${isAnnotationMode ? 'text-emerald-400' : 'text-zinc-100'}`} 
                        disabled={isLoading} 
                      />
                      
                      <div className="flex items-center justify-between px-2 pb-1 pt-2">
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center"
                            title="Attach Image"
                          >
                            <ImagePlus className="w-4 h-4" />
                          </button>
                          
                          <button 
                            type="button" 
                            onClick={() => setIsRebrandMode(!isRebrandMode)} 
                            className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${isRebrandMode ? 'text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/20' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-transparent'}`} 
                            title="Toggle Rebrand Mode"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{isRebrandMode ? 'Rebranding' : 'Rebrand'}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button 
                              type="button" 
                              onClick={() => {
                                setIsAnnotationMode(!isAnnotationMode);
                                if (isAnnotationMode) setAnnotationContext(null);
                              }} 
                              className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${isAnnotationMode ? 'text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-transparent'}`} 
                              title="Toggle Target/Comment Mode"
                            >
                              <Target className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{isAnnotationMode ? 'Targeting' : 'Target'}</span>
                            </button>

                            {isAnnotationMode && (
                              <div className="flex bg-zinc-800/80 rounded-lg p-0.5 ml-1 animate-in slide-in-from-left-2">
                                <button 
                                  type="button" 
                                  onClick={() => setAnnotationType('inspect')} 
                                  className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${annotationType === 'inspect' ? 'bg-zinc-600 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                                >
                                  Inspect
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => setAnnotationType('draw')} 
                                  className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${annotationType === 'draw' ? 'bg-zinc-600 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                                >
                                  Draw
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <button 
                              type="button" 
                              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-[12px] border transition-all select-none text-[12px] font-semibold ${
                                actionMode === 'auto' ? 'bg-zinc-800 text-zinc-400 border-zinc-700/50' : 
                                actionMode === 'planning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]' : 
                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                actionMode === 'auto' ? 'bg-zinc-500' : 
                                actionMode === 'planning' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
                              }`} />
                              <span className="capitalize">{actionMode}</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isActionMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isActionMenuOpen && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute bottom-full mb-3 right-0 w-64 bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-xl"
                                  >
                                    <div className="px-3 py-2 border-b border-zinc-800/50 mb-1">
                                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Protocol Mode</span>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => { setActionMode('auto'); setIsActionMenuOpen(false); }}
                                      className="w-full flex flex-col gap-0.5 p-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-left group"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className={`text-[13px] font-semibold ${actionMode === 'auto' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>Auto Mode</span>
                                        {actionMode === 'auto' && <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />}
                                      </div>
                                      <p className="text-[11px] text-zinc-500">Autonomous design & generation flows</p>
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => { setActionMode('planning'); setIsActionMenuOpen(false); }}
                                      className="w-full flex flex-col gap-0.5 p-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-left group"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className={`text-[13px] font-semibold ${actionMode === 'planning' ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200'}`}>Planning Mode</span>
                                        {actionMode === 'planning' && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                      </div>
                                      <p className="text-[11px] text-zinc-500">Step-by-step architectural approval</p>
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => { setActionMode('execution'); setIsActionMenuOpen(false); }}
                                      className="w-full flex flex-col gap-0.5 p-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-left group"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className={`text-[13px] font-semibold ${actionMode === 'execution' ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'}`}>Execution Mode</span>
                                        {actionMode === 'execution' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                      </div>
                                      <p className="text-[11px] text-zinc-500">Direct code injection & asset updates</p>
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()} 
                            className="p-2 flex items-center justify-center text-zinc-900 bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors rounded-[12px] shadow-sm"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Panel: Canvas */}
              <div className="hidden md:flex flex-1 flex-col h-full bg-zinc-950 relative">
                {/* Floating Horizontal Asset Switcher */}
                <div className="absolute bottom-6 left-6 z-40 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1 transition-all duration-300">
                  <div className="flex items-center gap-1" onClick={() => setIsSwitcherExpanded(!isSwitcherExpanded)}>
                    <FloatingTab icon={<LayoutTemplate className="w-4 h-4" />} label="Web" isActive={activeCanvasTab === 'WEB'} hasIndicator={!!currentLeadAssets.find(m => m.canvasMode === 'WEB')} onClick={() => { if(isSwitcherExpanded) { handleModeSwitchRequest('WEB'); setIsSwitcherExpanded(false); } }} isHidden={activeCanvasTab !== 'WEB'} forceShow={isSwitcherExpanded} />
                    <FloatingTab icon={<ImageIcon className="w-4 h-4" />} label="Graphic" isActive={activeCanvasTab === 'GRAPHIC'} hasIndicator={!!currentLeadAssets.find(m => m.canvasMode === 'GRAPHIC')} onClick={() => { if(isSwitcherExpanded) { handleModeSwitchRequest('GRAPHIC'); setIsSwitcherExpanded(false); } }} isHidden={activeCanvasTab !== 'GRAPHIC'} forceShow={isSwitcherExpanded} />
                    <FloatingTab icon={<PenTool className="w-4 h-4" />} label="SVG" isActive={activeCanvasTab === 'SVG'} hasIndicator={!!currentLeadAssets.find(m => m.canvasMode === 'SVG')} onClick={() => { if(isSwitcherExpanded) { handleModeSwitchRequest('SVG'); setIsSwitcherExpanded(false); } }} isHidden={activeCanvasTab !== 'SVG'} forceShow={isSwitcherExpanded} />
                    <FloatingTab icon={<AlignLeft className="w-4 h-4" />} label="Content" isActive={activeCanvasTab === 'CONTENT'} hasIndicator={!!currentLeadAssets.find(m => m.canvasMode === 'CONTENT')} onClick={() => { if(isSwitcherExpanded) { handleModeSwitchRequest('CONTENT'); setIsSwitcherExpanded(false); } }} isHidden={activeCanvasTab !== 'CONTENT'} forceShow={isSwitcherExpanded} />
                  </div>
                  <div className={`w-px h-4 shrink-0 bg-zinc-800 mx-1 transition-all duration-300 ${isSwitcherExpanded ? 'opacity-100 max-w-[1px]' : 'opacity-0 max-w-0'}`} />
                  <FloatingTab icon={<FolderOpen className="w-4 h-4" />} label="Files" isActive={isStudioFilesOpen} onClick={() => setIsStudioFilesOpen(!isStudioFilesOpen)} isHidden={false} />
                </div>

                <AnimatePresence>
                  {isStudioFilesOpen && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-y-0 right-0 w-80 bg-zinc-900 border-l border-zinc-800 z-50 shadow-2xl flex flex-col">
                      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md">
                        <h3 className="font-semibold text-zinc-100 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-indigo-400" /> Project Files</h3>
                        <button onClick={() => setIsStudioFilesOpen(false)} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                      </div>
                      <FilesPanel key={`studio-${selectedLeadId || 'all'}`} messages={assets} leads={leads} initialLeadId={selectedLeadId || undefined} isCompact={true} onDeleteAsset={handleDeleteAsset} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Right Panel: Canvas area - Always render CanvasPanel for UI consistency */}
                <CanvasPanel 
                  key={currentAsset?.id || `empty-${activeCanvasTab}`}
                  content={currentAsset?.canvasContent || ''} 
                  mode={activeCanvasTab} 
                  imageUrl={currentAsset && currentAsset.canvasMode === 'GRAPHIC' ? generatedImages[currentAsset.id] : undefined}
                  onVibeSwitch={handleVibeSwitch} 
                  isLoading={isLoading && loadingMode === activeCanvasTab} 
                  onSaveContent={handleSaveContent} 
                  versions={versions} 
                  currentVersionId={currentAsset?.id}
                  onVersionSelect={(id) => { const assetKey = `${selectedLeadId || 'default'}-${selectedSessionId || 'default'}-${activeCanvasTab}`; setSelectedAssetIds(prev => ({ ...prev, [assetKey]: id })); }}
                  onAnnotationSelect={setAnnotationContext}
                  onSubmitVisualComment={handleVisualComment}
                  onSubmitGraphicComment={handleGraphicComment}
                  onSubmitContentComment={handleContentComment}
                  onSubmitDrawComment={handleDrawComment}
                  onStartBlank={handleCreateBlankAsset}
                  isAnnotationMode={isAnnotationMode}
                  setIsAnnotationMode={setIsAnnotationMode}
                  annotationType={annotationType}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode Switch Confirmation Modal */}
      <AnimatePresence>
        {pendingModeSwitch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">Switching to {pendingModeSwitch}</h3>
              <p className="text-zinc-400 text-sm mb-6">You are currently in an active chat session. Would you like to start a fresh chat session for this new mode, or continue in the current interconnected chat?</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => confirmModeSwitch(true)} className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors">Start New Session (Recommended)</button>
                <button onClick={() => confirmModeSwitch(false)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium transition-colors">Continue in Current Session</button>
                <button onClick={() => setPendingModeSwitch(null)} className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors mt-2">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingTab({ icon, label, isActive, hasIndicator, onClick, isHidden = false, forceShow = false }: { icon: React.ReactNode, label: string, isActive: boolean, hasIndicator?: boolean, onClick: () => void, isHidden?: boolean, forceShow?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-xl transition-all duration-300 text-[13px] font-medium select-none whitespace-nowrap overflow-hidden ${
        isActive 
          ? 'bg-zinc-800 text-zinc-100 shadow-sm max-w-[150px] px-4 py-2 opacity-100' 
          : forceShow || !isHidden
            ? 'max-w-[150px] px-4 py-2 opacity-100 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            : 'max-w-0 px-0 py-2 opacity-0 text-zinc-400 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        {icon}
        <span>{label}</span>
      </div>
      {hasIndicator && (
        <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
      )}
    </button>
  );
}
