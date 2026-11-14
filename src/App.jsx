import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { BriefProvider } from '@/lib/BriefContext';
import { TransitionProvider } from '@/lib/TransitionContext';
import BriefDrawer from '@/components/inquiry/BriefDrawer';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { getRouteSeo } from '@/lib/seoRoutes';
import { vercelAnalyticsBeforeSend } from '@/lib/observability';
import Home from '@/pages/Home';
import Work from '@/pages/Work';
import Builds from '@/pages/Builds';
import Lab from '@/pages/Lab';
import Method from '@/pages/Method';
import DesignIntelligenceCaseStudy from '@/pages/DesignIntelligenceCaseStudy';

function setMetaTag(selector, attrName, attrVal, contentVal) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', contentVal);
}

function RouteSeoAndAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const seo = getRouteSeo(location.pathname);
    document.title = seo.title;

    setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', seo.ogType || 'website');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', seo.canonical);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', seo.ogImage);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', seo.ogImage);

    let canonicalEl = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', seo.canonical);

    const jsonLdEl = document.getElementById('cm-route-jsonld');
    if (jsonLdEl && seo.jsonLd) {
      jsonLdEl.textContent = JSON.stringify(seo.jsonLd);
    }

    if (window.CM_Analytics && typeof window.CM_Analytics.trackPageView === 'function') {
      window.CM_Analytics.trackPageView(location.pathname, seo.title);
    }
  }, [location.pathname]);

  return null;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

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
              <RouteSeoAndAnalytics />
              <AuthenticatedApp />
            </TransitionProvider>
          </Router>
          <Toaster />
          <Analytics beforeSend={vercelAnalyticsBeforeSend} />
          <SpeedInsights beforeSend={vercelAnalyticsBeforeSend} />
        </BriefProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
