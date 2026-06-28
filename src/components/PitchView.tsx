import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, AlertCircle } from 'lucide-react';

export function PitchView() {
  const { id } = useParams();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPitch() {
      if (!id) return;
      try {
        const docRef = doc(db, 'messages', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Resolve alias if present
          if (data.isAlias && data.originalId) {
            const originalDocRef = doc(db, 'messages', data.originalId);
            const originalDocSnap = await getDoc(originalDocRef);
            if (originalDocSnap.exists()) {
              const originalData = originalDocSnap.data();
              if (originalData.canvasContent) {
                setContent(originalData.canvasContent);
                return;
              }
            }
          }

          if (data.canvasContent) {
            setContent(data.canvasContent);
          } else {
            setError('This link does not contain a valid pitch asset.');
          }
        } else {
          setError('Pitch not found. It may have been deleted or the link is incorrect.');
        }
      } catch (err) {
        console.error('Error fetching pitch:', err);
        setError('Unable to load the pitch. Please check your connection or try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPitch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-zinc-400 font-medium">Loading your custom pitch...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Oops! Something went wrong</h1>
        <p className="text-zinc-400 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <iframe
        title="Pitch Preview"
        srcDoc={content || ''}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
