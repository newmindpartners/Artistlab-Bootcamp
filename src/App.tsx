import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { PerformanceMonitor } from './utils/performance';

// Lazy load components for better performance
const Header = React.lazy(() => import('./components/Header'));
const Hero = React.lazy(() => import('./components/Hero'));
const Programme = React.lazy(() => import('./components/Programme'));
const Formateur = React.lazy(() => import('./components/Formateur'));
const Avantages = React.lazy(() => import('./components/Avantages'));
const Inscription = React.lazy(() => import('./components/Inscription'));
const Footer = React.lazy(() => import('./components/Footer'));
const PaymentSuccess = React.lazy(() => import('./components/PaymentSuccess'));
const PaymentCancel = React.lazy(() => import('./components/PaymentCancel'));

// Simple loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-navy flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lightweight section loading
const SectionLoader = ({ height = "py-20" }: { height?: string }) => (
  <div className={`${height} bg-navy flex items-center justify-center`}>
    <div className="w-6 h-6 border-2 border-accent/50 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function MainLayout() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <Suspense fallback={<div className="h-20 bg-navy"></div>}>
        <Header />
      </Suspense>
      <main>
        <Suspense fallback={<SectionLoader height="min-h-screen" />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Formateur />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Programme />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Avantages />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Inscription />
        </Suspense>
      </main>
      <Suspense fallback={<SectionLoader height="py-16" />}>
        <Footer />
      </Suspense>
    </div>
  );
}

function App() {
  // Initialize performance monitoring
  React.useEffect(() => {
    try {
      const monitor = PerformanceMonitor.getInstance();
      monitor.reportWebVitals();
    } catch (error) {
      console.log('Performance monitoring not available');
    }
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route 
            path="/success" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PaymentSuccess />
              </Suspense>
            } 
          />
          <Route 
            path="/cancel" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PaymentCancel />
              </Suspense>
            } 
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;