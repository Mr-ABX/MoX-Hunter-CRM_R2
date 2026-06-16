import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export interface UserTargets {
  targetBuilds: number;
  targetReplies: number;
  targetCloses: number;
}

const defaultTargets: UserTargets = {
  targetBuilds: 20,
  targetReplies: 5,
  targetCloses: 3
};

export function useMetrics(userId: string | undefined) {
  const [targets, setTargets] = useState<UserTargets>(defaultTargets);

  useEffect(() => {
    if (!userId) return;
    
    const targetsRef = doc(db, 'userTargets', userId);
    const unsubscribe = onSnapshot(targetsRef, (docSnap) => {
      if (docSnap.exists()) {
        setTargets({ ...defaultTargets, ...docSnap.data() } as UserTargets);
      } else {
        setDoc(targetsRef, defaultTargets).catch(console.error);
      }
    }, (error) => console.error("Error fetching userTargets:", error));

    return () => unsubscribe();
  }, [userId]);

  const updateTargets = async (updates: Partial<UserTargets>) => {
    if (!userId) return;
    try {
      await setDoc(doc(db, 'userTargets', userId), updates, { merge: true });
    } catch(err) {
      console.error(err);
    }
  }

  return { targets, updateTargets };
}
