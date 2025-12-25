import { Outlet } from 'react-router';
import { AuthProvider } from './contexts/auth-context';
import { AuthModalProvider } from './components/auth/AuthModalProvider';
import { ThemeProvider } from './contexts/theme-context';
import { Toaster } from './components/ui/sonner';
import { AppLayout } from './components/layout/app-layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useOpenRouterMoneyFlow } from './hooks/useOpenRouterMoneyFlow';

export default function App() {
  // Money Flow Tracker - uses backend endpoint (no API key needed in frontend)
  useOpenRouterMoneyFlow();
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AuthModalProvider>
            <AppLayout>
              <Outlet />
            </AppLayout>
            <Toaster richColors position="top-right" />
          </AuthModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}