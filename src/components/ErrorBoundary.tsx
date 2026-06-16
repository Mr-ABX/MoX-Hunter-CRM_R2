import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public resetApp = () => {
    // Optional: clear local storage, reset auth, etc. if needed
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-50 p-4 font-sans">
          <AlertTriangle className="w-16 h-16 text-rose-500 mb-6" />
          <h1 className="text-2xl font-bold mb-4 font-display">Something went wrong</h1>
          <p className="text-zinc-400 max-w-md text-center mb-8">
            An unexpected error occurred in the application. You can try recovering by resetting the app.
          </p>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded p-4 mb-8 w-full max-w-lg mb-8 overflow-auto text-sm text-rose-400 font-mono">
            {this.state.error?.message || 'Unknown error'}
          </div>
          <button
            onClick={this.resetApp}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-900 rounded font-medium hover:bg-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
