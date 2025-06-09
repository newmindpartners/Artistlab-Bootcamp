import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { PerformanceMonitor } from './utils/performance';

// Lazy load components for better performance
const Header = React.lazy(() => import('./components/Header'));
const Hero = React.lazy(() => import('./components/OptimizedHero'));
const Programme = React.lazy(() => import('./components/Programme'));
const Formateur = React.lazy(() => import('./components/Formateur'));
const Avantages = React.lazy(() => import('./components/Avantages'));
const Inscription = React.lazy(() => import('./components/Inscription'));
const Footer = React.lazy(() => import('./components/Footer'));
const PaymentSuccess = React.lazy(() => import('./components/PaymentSuccess'));
const PaymentCancel = React.lazy(() => import('./components/PaymentCancel'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-navy flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function MainLayout() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <Suspense fallback={<div className="h-20 bg-navy"></div>}>
        <Header />
      </Suspense>
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<div className="py-20 bg-navy"></div>}>
          <Formateur />
        </Suspense>
        <Suspense fallback={<div className="py-20 bg-[#151d2b]"></div>}>
          <Programme />
        </Suspense>
        <Suspense fallback={<div className="py-20 bg-navy"></div>}>
          <Avantages />
        </Suspense>
        <Suspense fallback={<div className="py-20 bg-gradient-to-b from-[#151d2b] to-navy"></div>}>
          <Inscription />
        </Suspense>
      </main>
      <Suspense fallback={<div className="bg-navy py-16"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

function App() {
  // Initialize performance monitoring
  React.useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.reportWebVitals();
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