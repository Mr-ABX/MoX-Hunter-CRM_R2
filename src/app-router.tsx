import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { PitchView } from './components/PitchView';
import { LandingPage } from './components/landing-page';
import { useAuth } from './hooks/use-auth';
import { AuthScreen } from './components/auth-screen';
import { Loader2 } from 'lucide-react';

export function AppRouter() {
  const { user, authLoading, authError, handleSignIn } = useAuth();

  if (authLoading) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-zinc-400 font-medium animate-pulse">Initializing MO-X...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={!user ? <AuthScreen handleSignIn={handleSignIn} authError={authError} /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/admin" 
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/dashboard/*" 
          element={user ? <App /> : <Navigate to="/login" replace />} 
        />
        <Route path="/preview/:id" element={<PitchView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
