import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Sparkles, StopCircle, FileText, Loader2 } from 'lucide-react';
import { ModelSelector } from './model-selector';
import { useNotes } from '@/hooks/use-notes';

// Declare Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function PowerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Use a generic user id for now or pass it via props/context if available
  const { createNote } = useNotes('test-user');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
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
        // Only trigger processing if we were actively recording (not a forced error/stop)
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
      recognitionRef.current.start();
    }
  };

  const processTranscript = async (text: string) => {
    setIsProcessing(true);
    try {
      // In a real app, send to Gemini API to format nicely into Markdown and extract action items
      // For now, doing a basic client-side Markdown formatting mock
      
      const markdownContent = `## Audio Note\n\n${text}\n\n### Extracted Action Items\n- [ ] Review note\n- [ ] Update tasks`;
      
      await createNote({
        title: 'Voice Note - ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        content: markdownContent,
        tags: ['voice-note'],
      });
      
      setTranscript('');
    } catch (error) {
      console.error('Failed to save voice note', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <AnimatePresence initial={false}>
        {!isOpen ? (
          <motion.button
            key="idle-widget"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 shadow-2xl flex items-center justify-center text-zinc-300 hover:text-indigo-400 hover:border-indigo-500/50 transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Sparkles className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.div
            key="active-widget"
            initial={{ width: 48, height: 48, borderRadius: 24, x: 0, y: 0, opacity: 0 }}
            animate={{ 
              width: 'auto', 
              height: 56, 
              borderRadius: 28, 
              x: 'calc(50vw - 24px - 1.5rem)', // Center relative to viewport from left-6
              y: -24, // Lift it up slightly
              opacity: 1 
            }}
            exit={{ width: 48, height: 48, borderRadius: 24, x: 0, y: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 shadow-2xl overflow-visible flex items-center px-4 gap-4"
          >
            <div className="flex items-center gap-4 shrink-0 whitespace-nowrap overflow-visible">
              <ModelSelector sidebarMode={false} direction="up" />
              
              <div className="w-px h-6 bg-zinc-800"></div>
              
              <div className="relative group">
                <button
                  onClick={toggleRecording}
                  disabled={isProcessing}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isRecording 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse' 
                      : isProcessing
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-transparent'
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isRecording ? (
                    <StopCircle className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? 'Saving Note...' : isRecording ? 'Listening...' : 'Voice Note'}</span>
                </button>

                {/* Tooltip showing transcript */}
                <AnimatePresence>
                  {(isRecording && transcript || errorMsg) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 p-3 border rounded-xl shadow-xl text-xs whitespace-normal text-center ${errorMsg ? 'bg-rose-950/90 border-rose-900 text-rose-200' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                    >
                      {errorMsg ? errorMsg : `"${transcript}"`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-6 bg-zinc-800"></div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
