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
  doc 
} from 'firebase/firestore';
import { Lead } from '@/App';

export function useLeads(userId: string | undefined) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const q = query(collection(db, 'leads'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Lead)));
    }, (error) => console.error('Error fetching leads:', error));

    return () => unsubscribe();
  }, [userId]);

  const handleAddLead = async (newLead: Omit<Lead, 'id'>) => {
    if (!userId) return;
    try {
      const leadData = {
        ...newLead,
        userId,
        createdAt: Date.now()
      };
      const leadDoc = await addDoc(collection(db, 'leads'), leadData);
      
      // Automatically create an initial task for the new lead
      await addDoc(collection(db, 'tasks'), {
        title: `Initial Outreach for ${newLead.name}`,
        completed: false,
        archived: false,
        category: 'outreach',
        leadId: leadDoc.id,
        userId,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleLeadUpdate = async (leadId: string, updates: Partial<Lead>) => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, 'leads', leadId), updates);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  return { leads, handleAddLead, handleLeadUpdate, handleDeleteLead };
}
