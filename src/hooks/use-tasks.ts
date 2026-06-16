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
import { Task } from '@/App';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task)));
    }, (error) => console.error('Error fetching tasks:', error));

    return () => unsubscribe();
  }, [userId]);

  const handleAddTask = async (title: string, category: string, leadId?: string, dueDate?: number, reminderDate?: number) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        completed: false,
        archived: false,
        category,
        leadId: leadId || null,
        dueDate: dueDate || null,
        reminderDate: reminderDate || null,
        userId,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, 'tasks', taskId), { completed });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleArchiveTask = async (taskId: string, archived: boolean) => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, 'tasks', taskId), { archived });
    } catch (error) {
      console.error('Error archiving task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return { tasks, handleAddTask, handleToggleTask, handleArchiveTask, handleDeleteTask };
}
