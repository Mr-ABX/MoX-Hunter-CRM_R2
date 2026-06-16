import { CanvasMode } from '@/lib/parser';
import { useState, useEffect, useRef } from 'react';
import { Code, Eye, Sparkles, Link as LinkIcon, Download, Loader2, Image as ImageIcon, FileText, Copy, ExternalLink, Monitor, Tablet, Smartphone, Maximize2, Minimize2, Save, History, PenTool, ChevronDown, LayoutTemplate, Target, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor, { useMonaco } from '@monaco-editor/react';

function RegionDrawer({ onSubmit, onCancel }: { onSubmit: (rectStr: string, text: string) => void, onCancel: () => void }) {
  const [start, setStart] = useState<{x: number, y: number} | null>(null);
  const [current, setCurrent] = useState<{x: number, y: number} | null>(null);
  const [finalRect, setFinalRect] = useState<{x: number, y: number, w: number, h: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (finalRect) return; // If already drawn, ignore
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setStart({ x, y });
    setCurrent({ x, y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!start || finalRect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)); // Clamp 0-100
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)); // Clamp 0-100
    setCurrent({ x, y });
  };

  const handlePointerUp = () => {
    if (!start || !current || finalRect) return;
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const w = Math.abs(current.x - start.x);
    const h = Math.abs(current.y - start.y);
    
    // Ignore tiny accidental clicks
    if (w < 1 || h < 1) {
      setStart(null);
      setCurrent(null);
      return;
    }
    
    setFinalRect({ x, y, w, h });
  };

  const currentRect = start && current && !finalRect ? {
    left: Math.min(start.x, current.x) + '%',
    top: Math.min(start.y, current.y) + '%',
    width: Math.abs(current.x - start.x) + '%',
    height: Math.abs(current.y - start.y) + '%'
  } : null;

  const displayRect = finalRect ? {
    left: finalRect.x + '%',
    top: finalRect.y + '%',
    width: finalRect.w + '%',
    height: finalRect.h + '%'
  } : null;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-50 ${finalRect ? '' : 'cursor-crosshair touch-none'}`} 
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {currentRect && (
        <div 
          className="absolute border-2 border-emerald-500 bg-emerald-500/20"
          style={currentRect} 
        />
      )}
      
      {displayRect && finalRect && (
        <>
          <div 
            className="absolute border-2 border-emerald-500 bg-emerald-500/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
            style={displayRect} 
          />
          <div 
            className="absolute z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 w-80 animate-in fade-in zoom-in-95 duration-200"
            style={{
                top: finalRect.y + finalRect.h + 2 + '%', 
                left: finalRect.x + '%'
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Region Selected</span>
              <button 
                type="button"
                onClick={() => {
                  setStart(null);
                  setCurrent(null);
                  setFinalRect(null);
                }} 
                title="Cancel selection"
              >
                <X className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition-colors"/>
              </button>
            </div>
            
            <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem('comment') as HTMLInputElement;
                const value = input.value;
                if (value) {
                    const rectStr = `${finalRect.x.toFixed(2)},${finalRect.y.toFixed(2)},${finalRect.w.toFixed(2)},${finalRect.h.toFixed(2)}`;
                    onSubmit(rectStr, value);
                    onCancel();
                }
            }}>
              <textarea 
                name="comment" 
                autoFocus 
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none shadow-inner" 
                placeholder="What exactly should change here?" 
              />
              <div className="flex justify-end mt-2">
                 <button type="submit" className="text-[13px] bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm">Apply Change</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

interface CanvasPanelProps {
  content: string;
  mode: CanvasMode;
  imageUrl?: string;
  onVibeSwitch: (vibe: string) => void;
  isLoading: boolean;
  onSaveContent?: (newContent: string, isAutoSave?: boolean) => void;
  versions?: { id: string; version: number }[];
  currentVersionId?: string;
  onVersionSelect?: (id: string) => void;
  onAnnotationSelect?: (text: string | null) => void;
  onSubmitVisualComment?: (selector: string, html: string, comment: string) => void;
  onSubmitGraphicComment?: (x: number, y: number, comment: string) => void;
  onSubmitContentComment?: (selectedText: string, comment: string) => void;
  onSubmitDrawComment?: (rectStr: string, comment: string) => void;
  onStartBlank?: () => void;
  isAnnotationMode?: boolean;
  setIsAnnotationMode?: (mode: boolean) => void;
  annotationType?: 'inspect' | 'draw';
}

export function CanvasPanel({ 
  content, mode, imageUrl, onVibeSwitch, isLoading, onSaveContent, 
  versions = [], currentVersionId, onVersionSelect, onAnnotationSelect, 
  onSubmitVisualComment, onSubmitGraphicComment, onSubmitContentComment, onSubmitDrawComment, onStartBlank,
  isAnnotationMode = false, setIsAnnotationMode, annotationType = 'inspect'
}: CanvasPanelProps) {
  const [view, setView] = useState<'visual' | 'source'>('visual');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isEdited, setIsEdited] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'edited'>('saved');
  const [prevContent, setPrevContent] = useState(content);
  const [selectedElementData, setSelectedElementData] = useState<{ selector: string; html: string; rect: DOMRect } | null>(null);
  const [graphicPin, setGraphicPin] = useState<{ x: number, y: number, displayX: number, displayY: number } | null>(null);
  const [contentHighlight, setContentHighlight] = useState<{ text: string, rect: DOMRect } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);

  const safeCopyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Clipboard write failed:', err);
      });
    } catch (err) {
      console.error('Clipboard write threw:', err);
    }
  };

  // Hook up Monaco selection listener when annotation mode is enabled and editor mounts
  useEffect(() => {
    if (isAnnotationMode && editorRef.current && onAnnotationSelect) {
      const editor = editorRef.current;
      const disposable = editor.onDidChangeCursorSelection((e: any) => {
        const selection = editor.getModel().getValueInRange(e.selection);
        if (selection && selection.trim().length > 0) {
          onAnnotationSelect(selection);
        } else {
          onAnnotationSelect(null);
        }
      });
      return () => disposable.dispose();
    }
  }, [isAnnotationMode, onAnnotationSelect, view]);

  if (content !== prevContent) {
    setPrevContent(content);
    setEditedContent(content);
    setIsEdited(false);
    setSaveStatus('saved');
  }

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'ON_ELEMENT_SELECTED' && isAnnotationMode) {
        setSelectedElementData({
          selector: e.data.selector,
          html: e.data.html,
          rect: e.data.rect
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isAnnotationMode]);

  const getInjectedContent = () => {
    if (!isAnnotationMode || mode !== 'WEB') return editedContent;

    const injection = `
      <style>
        .ais-hovered-element {
          outline: 2px solid #6366f1 !important;
          outline-offset: -2px !important;
          cursor: crosshair !important;
        }
        .ais-selected-element {
          outline: 2px solid #10b981 !important;
          outline-offset: -2px !important;
        }
      </style>
      <script>
        (function() {
          let currentHover = null;
          let currentSelected = null;

          function getPath(element) {
            if (element.id) return '#' + element.id;
            if (element === document.body) return 'body';
            const path = [];
            while (element.nodeType === Node.ELEMENT_NODE) {
              let selector = element.nodeName.toLowerCase();
              if (element.id) {
                selector += '#' + element.id;
                path.unshift(selector);
                break;
              } else {
                let sib = element, nth = 1;
                while (sib = sib.previousElementSibling) {
                  if (sib.nodeName.toLowerCase() == selector) nth++;
                }
                if (nth != 1) selector += ":nth-of-type("+nth+")";
              }
              path.unshift(selector);
              element = element.parentNode;
            }
            return path.join(' > ');
          }

          document.addEventListener('mouseover', (e) => {
            if (currentSelected) return; 
            if (currentHover) currentHover.classList.remove('ais-hovered-element');
            currentHover = e.target;
            if (currentHover && currentHover !== document.body && currentHover !== document.documentElement) {
              currentHover.classList.add('ais-hovered-element');
            }
          }, true);

          document.addEventListener('mouseout', (e) => {
            if (currentSelected) return;
            if (currentHover) {
              currentHover.classList.remove('ais-hovered-element');
              currentHover = null;
            }
          }, true);

          document.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (currentSelected) {
              currentSelected.classList.remove('ais-selected-element');
            }
            
            currentSelected = e.target;
            if (currentHover) currentHover.classList.remove('ais-hovered-element');
            if (currentSelected && currentSelected !== document.body) {
              currentSelected.classList.add('ais-selected-element');
              
              const rect = currentSelected.getBoundingClientRect();
              window.parent.postMessage({
                type: 'ON_ELEMENT_SELECTED',
                selector: getPath(currentSelected),
                html: currentSelected.outerHTML,
                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height, bottom: rect.bottom, right: rect.right }
              }, '*');
            }
          }, true);
        })();
      </script>
    `;

    if (editedContent.includes('</body>')) {
      return editedContent.replace('</body>', `${injection}</body>`);
    } else {
      return editedContent + injection;
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleGenerateLink = () => {
    if (!currentVersionId) return;
    
    setIsGeneratingLink(true);
    
    // Generate the real public link
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const pitchUrl = `${baseUrl}/pitch/${currentVersionId}`;
    
    // Copy to clipboard
    try {
      navigator.clipboard.writeText(pitchUrl).then(() => {
        setTimeout(() => {
          setIsGeneratingLink(false);
          alert(`Pitch link generated and copied to clipboard!\n\n${pitchUrl}`);
        }, 1000);
      }).catch(err => {
        console.error('Failed to copy link:', err);
        setIsGeneratingLink(false);
        alert(`Pitch link generated: ${pitchUrl}`);
      });
    } catch (err) {
      console.error('Failed to invoke clipboard API:', err);
      setIsGeneratingLink(false);
      alert(`Pitch link generated: ${pitchUrl}`);
    }
  };

  const handleSave = () => {
    if (onSaveContent) {
      setSaveStatus('saving');
      onSaveContent(editedContent, false); // Manual save creates new version
      setIsEdited(false);
      setTimeout(() => setSaveStatus('saved'), 500);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const code = value || '';
    setEditedContent(code);
    
    if (code !== content) {
      setIsEdited(true);
      setSaveStatus('edited');
      
      // Auto-save logic
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        if (onSaveContent) {
          setSaveStatus('saving');
          onSaveContent(code, true); // Auto-save updates in-place
          setTimeout(() => setSaveStatus('saved'), 500);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity
    } else {
      setIsEdited(false);
      setSaveStatus('saved');
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    }
  };

  const getTabConfig = () => {
    switch (mode) {
      case 'WEB': return { visual: 'Preview', source: 'Code', VisualIcon: Eye, SourceIcon: Code };
      case 'GRAPHIC': return { visual: 'Image', source: 'Prompt', VisualIcon: ImageIcon, SourceIcon: FileText };
      case 'SVG': return { visual: 'Rendered', source: 'SVG Code', VisualIcon: Eye, SourceIcon: Code };
      case 'CONTENT': return { visual: 'Formatted', source: 'Markdown', VisualIcon: FileText, SourceIcon: Code };
      default: return { visual: 'Preview', source: 'Code', VisualIcon: Eye, SourceIcon: Code };
    }
  };

  const renderModeActions = () => {
    if (view === 'source') {
      return (
        <>
          <div className="flex items-center gap-2 mr-2 text-xs font-medium">
            {saveStatus === 'saving' && <span className="text-zinc-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>}
            {saveStatus === 'saved' && <span className="text-emerald-400 flex items-center gap-1">Saved</span>}
            {saveStatus === 'edited' && <span className="text-amber-400 flex items-center gap-1">Unsaved changes</span>}
          </div>
          <button 
            onClick={() => safeCopyToClipboard(editedContent)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-transparent"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
          <button 
            onClick={handleSave}
            disabled={!isEdited}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all shadow-sm ${isEdited ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
          >
            <Save className="w-4 h-4" /> Save Version
          </button>
        </>
      );
    }

    switch (mode) {
      case 'WEB':
        return (
          <div className="flex items-center gap-0.5 bg-zinc-900/80 p-0.5 rounded-[10px] border border-zinc-800/60 shadow-sm">
            <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded-lg transition-all ${device === 'desktop' ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`} title="Desktop">
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded-lg transition-all ${device === 'tablet' ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`} title="Tablet">
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded-lg transition-all ${device === 'mobile' ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`} title="Mobile">
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-zinc-800 mx-1"></div>
            <button onClick={toggleFullscreen} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all" title="Toggle Fullscreen">
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        );
      case 'GRAPHIC':
        return (
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
            <Download className="w-4 h-4" /> Save
          </button>
        );
      case 'SVG':
      case 'CONTENT':
        return (
          <button 
            onClick={() => safeCopyToClipboard(content)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        );
      default:
        return null;
    }
  };

  const getEmptyStateMessage = (mode: CanvasMode) => {
    switch (mode) {
      case 'WEB': return { title: 'Ready for Architecture', desc: 'Your web interface will run here. Start a session to construct interactive components.' };
      case 'GRAPHIC': return { title: 'Generating Graphic', desc: 'Synthesizing high-fidelity visual assets based on your architectural specs...' };
      case 'SVG': return { title: 'Ready for Vectors', desc: 'Your SVG architecture will appear here. Start a chat session to generate math-based visuals.' };
      case 'CONTENT': return { title: 'Awaiting Content', desc: 'Markdown-based copy, structural reports, and strategy documents will be rendered here.' };
      default: return { title: 'Wolf Studio Canvas', desc: 'Welcome to the architectural domain. Choose a mode and start building.' };
    }
  };

  const emptyInfo = getEmptyStateMessage(mode);

  const renderEmptyState = (isLoading: boolean) => {
    const Icon = mode === 'WEB' ? LayoutTemplate : 
                 mode === 'GRAPHIC' ? ImageIcon : 
                 mode === 'SVG' ? PenTool : FileText;

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <Icon className="w-[400px] h-[400px]" strokeWidth={0.5} />
        </div>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-16 h-16 rounded-[20px] bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-xl shadow-black/50">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            ) : (
              <Icon className="w-6 h-6 text-zinc-500" />
            )}
          </div>
          <h2 className="text-lg font-medium tracking-tight text-zinc-300 mb-2">
            {isLoading ? (mode === 'WEB' ? 'Compiling Interface' : mode === 'GRAPHIC' ? 'Generating Graphic' : 'Processing...') : emptyInfo.title}
          </h2>
          <p className="text-[13px] leading-relaxed text-zinc-500 mb-8">
            {isLoading ? (mode === 'WEB' ? 'Synthesizing DOM nodes and injecting styles into the presentation layer...' : 'Architecting asset...') : emptyInfo.desc}
          </p>
          {!isLoading && onStartBlank && (
            <button 
              onClick={onStartBlank} 
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all select-none overflow-hidden hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <Sparkles className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400" /> Start Blank Canvas
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (view === 'source') {
      const language = mode === 'WEB' || mode === 'SVG' ? 'html' : mode === 'CONTENT' ? 'markdown' : 'javascript';
      
      return (
        <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={editedContent || ''}
            onChange={handleEditorChange}
            onMount={(editor) => { editorRef.current = editor; }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              wordWrap: 'on',
              padding: { top: 24 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              automaticLayout: true,
            }}
          />
        </div>
      );
    }

    switch (mode) {
      case 'WEB':
        return (
          <div ref={previewRef} className={`flex-1 bg-zinc-950 overflow-hidden relative flex items-center justify-center ${isFullscreen ? 'bg-zinc-950' : ''}`}>
            {(!content || content === 'null' || content.trim() === '') ? (
              renderEmptyState(isLoading)
            ) : (
              <>
                {isFullscreen && (
                  <button 
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-50 p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white shadow-xl"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                )}
                <div className={`transition-all duration-300 ease-in-out bg-zinc-950 relative z-10 ${
                  isFullscreen ? 'w-full h-full' :
                  device === 'desktop' ? 'w-full h-full' : 
                  device === 'tablet' ? 'w-[768px] h-[90%] rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden' : 
                  'w-[375px] h-[80%] rounded-[2.5rem] shadow-2xl border-8 border-zinc-800 overflow-hidden'
                }`}>
                  <iframe
                    title="Web Preview"
                    srcDoc={`<html><head><style>body { background-color: #09090b; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }</style></head><body><div style="opacity: 0.5;">Loading architectural components...</div></body></html>`}
                    className="absolute inset-0 w-full h-full border-none pointer-events-none"
                    style={{ zIndex: 0 }}
                  />
                  <iframe
                    title="Web Preview Main"
                    srcDoc={getInjectedContent()}
                    className="relative w-full h-full border-none z-10"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  
                  {isAnnotationMode && annotationType === 'draw' && onSubmitDrawComment && (
                    <RegionDrawer onSubmit={onSubmitDrawComment} onCancel={() => setIsAnnotationMode?.(false)} />
                  )}

                  {/* Floating Comment Box */}
                  {selectedElementData && isAnnotationMode && annotationType === 'inspect' && (
                    <div 
                      className="absolute z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 w-80 animate-in fade-in zoom-in-95 duration-200"
                      style={{
                          top: Math.min(Math.max(10, selectedElementData.rect.bottom + 10), Math.max(10, selectedElementData.rect.top - 160)) + 'px', 
                          left: Math.max(10, selectedElementData.rect.left) + 'px'
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Target Selected</span>
                        <button onClick={() => setSelectedElementData(null)} title="Cancel target"><X className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition-colors"/></button>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500 bg-zinc-950 p-2 rounded mb-3 max-h-20 overflow-hidden text-ellipsis border border-zinc-800/80">
                          {selectedElementData.selector}
                      </div>
                      <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const input = form.elements.namedItem('comment') as HTMLInputElement;
                          const value = input.value;
                          if(value && onSubmitVisualComment) {
                               onSubmitVisualComment(selectedElementData.selector, selectedElementData.html, value);
                               setSelectedElementData(null);
                               setIsAnnotationMode?.(false);
                          }
                      }}>
                        <textarea 
                          name="comment" 
                          autoFocus 
                          rows={2}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none shadow-inner" 
                          placeholder="What should change here?" 
                        />
                        <div className="flex justify-end mt-2">
                           <button type="submit" className="text-[13px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm">Apply Change</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
    case 'GRAPHIC':
        return (
          <div className="flex-1 overflow-auto no-scrollbar p-8 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <ImageIcon className="w-[400px] h-[400px]" strokeWidth={0.5} />
            </div>
            {imageUrl ? (
              <div 
                className={`w-full max-w-2xl bg-zinc-900 rounded-3xl border border-zinc-800/80 shadow-2xl relative group z-10 ${isAnnotationMode && annotationType === 'inspect' ? 'cursor-crosshair' : ''}`}
                onClick={(e) => {
                  if (!isAnnotationMode || annotationType !== 'inspect') return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setGraphicPin({ x: Math.round(x), y: Math.round(y), displayX: e.clientX, displayY: e.clientY });
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Generated Graphic" className="w-full h-auto object-cover rounded-3xl pointer-events-none" />
                
                {!(isAnnotationMode && annotationType === 'inspect') && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-3xl">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-200">
                      <Download className="w-5 h-5" /> Download High-Res
                    </button>
                  </div>
                )}

                {isAnnotationMode && annotationType === 'draw' && onSubmitDrawComment && (
                  <RegionDrawer onSubmit={onSubmitDrawComment} onCancel={() => setIsAnnotationMode?.(false)} />
                )}

                {graphicPin && isAnnotationMode && annotationType === 'inspect' && (
                  <>
                    <div 
                      className="absolute w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-40 animate-pulse"
                      style={{ left: `${graphicPin.x}%`, top: `${graphicPin.y}%` }}
                    />
                    <div 
                      className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 w-80 animate-in fade-in zoom-in-95 duration-200"
                      style={{
                          top: Math.max(10, graphicPin.displayY + 15) + 'px', 
                          left: Math.max(10, graphicPin.displayX - 160) + 'px'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Coordinates Pinned</span>
                        <button onClick={() => setGraphicPin(null)} title="Cancel pin"><X className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition-colors"/></button>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500 bg-zinc-950 p-2 rounded mb-3 text-center border border-zinc-800/80">
                          X: {graphicPin.x}% / Y: {graphicPin.y}%
                      </div>
                      <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const input = form.elements.namedItem('comment') as HTMLInputElement;
                          const value = input.value;
                          if(value && onSubmitGraphicComment) {
                               onSubmitGraphicComment(graphicPin.x, graphicPin.y, value);
                               setGraphicPin(null);
                               setIsAnnotationMode?.(false);
                          }
                      }}>
                        <textarea 
                          name="comment" 
                          autoFocus 
                          rows={2}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none shadow-inner" 
                          placeholder="What do you want to change here?" 
                        />
                        <div className="flex justify-end mt-2">
                           <button type="submit" className="text-[13px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm">Apply Change</button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
            ) : (
              renderEmptyState(isLoading)
            )}
          </div>
        );
      case 'SVG':
        return (
          <div className="flex-1 overflow-auto no-scrollbar p-8 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <PenTool className="w-[400px] h-[400px]" strokeWidth={0.5} />
            </div>
            {content && content !== 'null' && content.trim() !== '' ? (
              <div 
                className={`w-full max-w-md aspect-square bg-zinc-900 rounded-[32px] border border-zinc-800/80 flex items-center justify-center p-12 shadow-2xl overflow-hidden relative z-10 ${isAnnotationMode && annotationType === 'inspect' ? 'cursor-crosshair' : ''}`}
                onClick={(e) => {
                  if (!isAnnotationMode || annotationType !== 'inspect') return;
                  e.preventDefault();
                  e.stopPropagation();
                  const target = e.target as Element;
                  if (target) {
                     const rect = target.getBoundingClientRect();
                     setSelectedElementData({
                       selector: target.tagName,
                       html: target.outerHTML,
                       rect: rect
                     });
                  }
                }}
              >
                <div className="absolute inset-0 bg-grid-zinc bg-[size:24px_24px] opacity-20"></div>
                <div 
                  className="w-full h-full flex items-center justify-center relative z-10"
                  dangerouslySetInnerHTML={{ __html: editedContent }}
                />

                {isAnnotationMode && annotationType === 'draw' && onSubmitDrawComment && (
                  <RegionDrawer onSubmit={onSubmitDrawComment} onCancel={() => setIsAnnotationMode?.(false)} />
                )}

                {selectedElementData && isAnnotationMode && annotationType === 'inspect' && (
                    <div 
                      className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 w-80 animate-in fade-in zoom-in-95 duration-200"
                      style={{
                          top: Math.max(10, selectedElementData.rect.bottom + 10) + 'px', 
                          left: Math.max(10, selectedElementData.rect.left) + 'px'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Target Selected</span>
                        <button onClick={() => setSelectedElementData(null)} title="Cancel target"><X className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition-colors"/></button>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500 bg-zinc-950 p-2 rounded mb-3 max-h-20 overflow-hidden text-ellipsis border border-zinc-800/80">
                          {selectedElementData.selector}
                      </div>
                      <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const input = form.elements.namedItem('comment') as HTMLInputElement;
                          const value = input.value;
                          if(value && onSubmitVisualComment) {
                               onSubmitVisualComment(selectedElementData.selector, selectedElementData.html, value);
                               setSelectedElementData(null);
                               setIsAnnotationMode?.(false);
                          }
                      }}>
                        <textarea 
                          name="comment" 
                          autoFocus 
                          rows={2}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none shadow-inner" 
                          placeholder="What should change here?" 
                        />
                        <div className="flex justify-end mt-2">
                           <button type="submit" className="text-[13px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm">Apply Change</button>
                        </div>
                      </form>
                    </div>
                  )}
              </div>
            ) : (
              renderEmptyState(isLoading)
            )}
          </div>
        );
      case 'CONTENT':
        return (
          <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 bg-zinc-950 relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
               <FileText className="w-[400px] h-[400px]" strokeWidth={0.5} />
             </div>
            {content && content !== 'null' && content.trim() !== '' ? (
              <div 
                className={`max-w-3xl mx-auto bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800/80 p-8 lg:p-12 shadow-2xl prose prose-invert prose-indigo relative z-10 ${isAnnotationMode && annotationType === 'inspect' ? 'selection:bg-emerald-500/30 selection:text-emerald-200' : ''}`}
                onMouseUp={() => {
                   if (!isAnnotationMode || annotationType !== 'inspect') return;
                   const selection = window.getSelection();
                   if (selection && selection.toString().trim().length > 0 && selection.rangeCount > 0) {
                     const range = selection.getRangeAt(0);
                     const rect = range.getBoundingClientRect();
                     setContentHighlight({ text: selection.toString().trim(), rect });
                   } else {
                     setContentHighlight(null);
                   }
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{editedContent}</ReactMarkdown>
                
                {isAnnotationMode && annotationType === 'draw' && onSubmitDrawComment && (
                  <RegionDrawer onSubmit={onSubmitDrawComment} onCancel={() => setIsAnnotationMode?.(false)} />
                )}

                {contentHighlight && isAnnotationMode && annotationType === 'inspect' && (
                   <div 
                     className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 w-80 animate-in fade-in zoom-in-95 duration-200"
                     style={{
                         top: Math.max(10, contentHighlight.rect.bottom + 10) + 'px', 
                         left: Math.max(10, contentHighlight.rect.left) + 'px'
                     }}
                     onClick={(e) => e.stopPropagation()}
                   >
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Text Highlighted</span>
                       <button onClick={() => setContentHighlight(null)} title="Cancel highlight"><X className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition-colors"/></button>
                     </div>
                     <div className="text-[11px] font-mono text-zinc-500 bg-zinc-950 p-2 rounded mb-3 max-h-20 overflow-hidden text-ellipsis border border-zinc-800/80">
                         &quot;{contentHighlight.text}&quot;
                     </div>
                     <form onSubmit={(e) => {
                         e.preventDefault();
                         const form = e.currentTarget;
                         const input = form.elements.namedItem('comment') as HTMLInputElement;
                         const value = input.value;
                         if(value && onSubmitContentComment) {
                              onSubmitContentComment(contentHighlight.text, value);
                              setContentHighlight(null);
                              setIsAnnotationMode?.(false);
                         }
                     }}>
                       <textarea 
                         name="comment" 
                         autoFocus 
                         rows={2}
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none shadow-inner" 
                         placeholder="How should we rewrite this text?" 
                       />
                       <div className="flex justify-end mt-2">
                          <button type="submit" className="text-[13px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm">Apply Change</button>
                       </div>
                     </form>
                   </div>
                )}
              </div>
            ) : (
              renderEmptyState(isLoading)
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const { visual: visualLabel, source: sourceLabel, VisualIcon, SourceIcon } = getTabConfig();

  return (
    <div data-canvas-panel className="flex flex-col h-full bg-zinc-950">
      {/* Canvas Header */}
      <div className="h-14 border-b border-zinc-800/40 flex items-center justify-between px-4 bg-zinc-950/60 backdrop-blur-2xl z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-900/80 p-0.5 rounded-[10px] border border-zinc-800/60 shadow-sm">
            <button
              data-view-visual
              onClick={() => setView('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all select-none ${
                view === 'visual' ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <VisualIcon className="w-3.5 h-3.5" /> {visualLabel}
            </button>
            <button
              data-view-source
              onClick={() => setView('source')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all select-none ${
                view === 'source' ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <SourceIcon className="w-3.5 h-3.5" /> {sourceLabel}
            </button>
          </div>
          
          <div className="h-4 w-px bg-zinc-800 hidden sm:block mx-1"></div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderModeActions()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {versions.length > 0 && (
            <div className="relative group flex items-center bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/60 rounded-xl px-2 py-1.5 transition-colors">
              <History className="w-3.5 h-3.5 text-zinc-500 ml-1 mr-1.5" />
              <select
                value={currentVersionId || ''}
                onChange={(e) => onVersionSelect?.(e.target.value)}
                className="appearance-none bg-transparent text-[13px] font-medium text-zinc-300 pr-5 cursor-pointer focus:outline-none"
              >
                {versions.map(v => (
                  <option key={v.id} value={v.id} className="bg-zinc-900">
                    V{v.version}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative group">
            <button 
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50 shadow-sm select-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Style
            </button>
            <div className="absolute right-0 top-[calc(100%+4px)] w-48 bg-zinc-900 border border-zinc-800/80 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100">
              <button onClick={() => onVibeSwitch('Luxury/High-End')} className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors border-b border-zinc-800/50">
                ✨ Make it Premium
              </button>
              <button onClick={() => onVibeSwitch('Aggressive/Direct Response')} className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors border-b border-zinc-800/50">
                🔥 Make it Aggressive
              </button>
              <button onClick={() => onVibeSwitch('Friendly/Local Community')} className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                👋 Make it Friendly
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerateLink}
            disabled={isGeneratingLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm disabled:opacity-70 select-none ml-1"
          >
            {isGeneratingLink ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
            Publish
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
}
