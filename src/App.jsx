import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { BriefProvider } from '@/lib/BriefContext';
import { TransitionProvider } from '@/lib/TransitionContext';
import BriefDrawer from '@/components/inquiry/BriefDrawer';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Home from '@/pages/Home';
import Work from '@/pages/Work';
import Builds from '@/pages/Builds';
import Lab from '@/pages/Lab';
import Method from '@/pages/Method';
import DesignIntelligenceCaseStudy from '@/pages/DesignIntelligenceCaseStudy';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/index" element={<Work />} />
        <Route path="/build" element={<Builds />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/lab/design-intelligence" element={<DesignIntelligenceCaseStudy />} />
        <Route path="/design-intelligence" element={<DesignIntelligenceCaseStudy />} />
        <Route path="/method" element={<Method />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <BriefDrawer />
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <BriefProvider>
          <Router>
            <TransitionProvider>
              <ScrollToTop />
              <AuthenticatedApp />
            </TransitionProvider>
          </Router>
          <Toaster />
        </BriefProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App