import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Sparkles, StopCircle, Loader2, Sliders } from 'lucide-react';
import { ModelSelector } from './model-selector';
import { useNotes } from '@/hooks/use-notes';

// Declare Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface PowerWidgetProps {
  currentView?: string;
}

export function PowerWidget({ currentView = 'dashboard' }: PowerWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [snapPosition, setSnapPosition] = useState<'left' | 'right'>('left');
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  // Use a generic user id for persistent notes storage
  const { handleAddNote } = useNotes('test-user');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check if we have a saved snap position in local storage
    const savedSnap = localStorage.getItem('power-widget-snap');
    if (savedSnap === 'left' || savedSnap === 'right') {
      setSnapPosition(savedSnap);
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setErrorMsg(null);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else {
          setErrorMsg(`Error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      if (transcript.trim()) {
        processTranscript(transcript);
      }
    } else {
      if (!recognitionRef.current) {
        setErrorMsg('Speech recognition is not supported in this browser.');
        return;
      }
      setTranscript('');
      setErrorMsg(null);
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start speech recognition', e);
      }
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (dragConstraintsRef.current) {
      const rect = dragConstraintsRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const relativeX = info.point.x - rect.left;
      const newPosition = relativeX > containerWidth / 2 ? 'right' : 'left';
      setSnapPosition(newPosition);
      localStorage.setItem('power-widget-snap', newPosition);
    } else {
      const offsetThreshold = 40;
      if (snapPosition === 'left' && info.offset.x > offsetThreshold) {
        setSnapPosition('right');
        localStorage.setItem('power-widget-snap', 'right');
      } else if (snapPosition === 'right' && info.offset.x < -offsetThreshold) {
        setSnapPosition('left');
        localStorage.setItem('power-widget-snap', 'left');
      }
    }
  };

  const processTranscript = async (text: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      // Send the raw transcript to our Express server for Gemini formatting
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: text,
          currentView: currentView
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process voice note with Gemini');
      }

      const data = await response.json();
      const markdownContent = data.formattedMarkdown || `## Voice Note\n\n${text}`;
      
      await handleAddNote(
        'Voice Note - ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        markdownContent
      );
      
      setTranscript('');
    } catch (error) {
      console.error('Failed to save voice note via Gemini', error);
      setErrorMsg('Failed to process note with Gemini. Saving raw transcription instead.');
      
      // Fallback to save raw note so user data is never lost
      try {
        await handleAddNote(
          'Voice Note (Raw) - ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          `## Raw Voice Note\n\n${text}`
        );
        setTranscript('');
      } catch (innerError) {
        console.error('Fallback save failed as well', innerError);
        setErrorMsg('Critical: Could not save note. Check database connectivity.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <div ref={dragConstraintsRef} className="fixed bottom-6 left-20 right-6 h-12 z-[100] pointer-events-none flex items-center justify-between">
            <motion.div
              key="idle-widget"
              drag="x"
              dragConstraints={dragConstraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              animate={{
                x: snapPosition === 'left' ? 0 : (dragConstraintsRef.current ? (dragConstraintsRef.current.getBoundingClientRect().width - 48) : (windowWidth - 152))
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="w-12 h-12 rounded-full bg-zinc-900/85 backdrop-blur-md border border-zinc-700/50 shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex items-center justify-center text-zinc-300 hover:text-indigo-400 hover:border-indigo-500/50 transition-colors group relative overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto"
              style={{ x: snapPosition === 'left' ? 0 : (windowWidth - 152) }}
            >
              <button
                onClick={() => setIsOpen(true)}
                className="w-full h-full flex items-center justify-center relative"
                title="Click to open or drag horizontally to snap"
              >
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Sliders className="w-5 h-5 text-indigo-400" />
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[100] pointer-events-none">
            <motion.div
              key="active-widget"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="pointer-events-auto bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 shadow-[0_10px_50px_rgba(0,0,0,0.8)] rounded-full h-14 flex items-center px-4 gap-4 overflow-visible"
            >
              <div className="flex items-center gap-4 shrink-0 whitespace-nowrap overflow-visible">
                {/* Custom ModelSelector passing active currentView */}
                <ModelSelector sidebarMode={false} direction="up" currentView={currentView} />
                
                <div className="w-px h-6 bg-zinc-800"></div>
                
                <div className="relative">
                  <button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                      isRecording 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.35)] animate-pulse' 
                        : isProcessing
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-transparent'
                    }`}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isRecording ? (
                      <StopCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Mic className="w-3.5 h-3.5" />
                    )}
                    <span>{isProcessing ? 'AI Structuring...' : isRecording ? 'Listening...' : 'Record Voice Note'}</span>
                  </button>

                  {/* Realtime transcript or error message floating bubble */}
                  <AnimatePresence>
                    {(isRecording && transcript || errorMsg) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-72 p-3.5 border rounded-2xl shadow-2xl text-xs whitespace-normal text-center leading-relaxed ${
                          errorMsg 
                            ? 'bg-rose-950/90 border-rose-800/80 text-rose-200 shadow-[0_0_30px_rgba(244,63,94,0.15)]' 
                            : 'bg-zinc-900/95 border-zinc-800 text-zinc-200'
                        }`}
                      >
                        {errorMsg ? (
                          <div className="flex flex-col gap-1 items-center">
                            <span className="font-semibold text-rose-400">Audio Error</span>
                            <span>{errorMsg}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Live Transcript</span>
                            <span className="italic">"{transcript}"</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-px h-6 bg-zinc-800"></div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setErrorMsg(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Close Controls"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
