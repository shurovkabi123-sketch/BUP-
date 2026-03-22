import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-10 text-center bg-white rounded-3xl border border-red-100 shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 max-w-md mb-8">
            An unexpected error occurred. This might be due to a connection issue or a temporary problem.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-bup-maroon text-white px-6 py-3 rounded-xl font-bold hover:bg-red-900 transition-all"
          >
            <RefreshCw size={20} />
            Reload Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-left overflow-auto max-w-full text-red-600">
              {this.state.error?.message}
            </pre>
          )}
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
