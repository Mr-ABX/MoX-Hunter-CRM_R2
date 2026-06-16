import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy
} from 'firebase/firestore';
import { Note } from '@/App';

export function useNotes(userId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const q = query(collection(db, 'notes'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Note)).sort((a, b) => b.createdAt - a.createdAt));
    }, (error) => console.error('Error fetching notes:', error));

    return () => unsubscribe();
  }, [userId]);

  const handleAddNote = async (title: string, content: string, leadId?: string) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'notes'), {
        title,
        content,
        archived: false,
        leadId: leadId || null,
        userId,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleArchiveNote = async (noteId: string, archived: boolean) => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, 'notes', noteId), { archived });
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return { notes, handleAddNote, handleArchiveNote, handleDeleteNote };
}
