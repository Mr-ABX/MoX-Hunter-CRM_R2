import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const ALLOWED_EMAIL = 'digital.b3asts@gmail.com';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (currentUser.email === ALLOWED_EMAIL) {
          setUser(currentUser);
          setAuthError(null);
        } else {
          // Unauthorized email, sign out immediately
          await signOut(auth);
          setUser(null);
          setAuthError('Unauthorized access. Only administrators can log in.');
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ALLOWED_EMAIL) {
        await signOut(auth);
        setAuthError('Unauthorized access. Only administrators can log in.');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || 'Failed to sign in.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return { user, authLoading, authError, handleSignIn, handleSignOut };
}
