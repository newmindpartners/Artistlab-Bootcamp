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

// Optimized loading component with better UX
const LoadingSpinner = () => (
  <div className="min-h-screen bg-navy flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-3 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white/70 text-sm">Loading...</p>
    </div>
  </div>
);

// Optimized section loading fallback
const SectionLoader = ({ height = "py-20" }: { height?: string }) => (
  <div className={`${height} bg-navy flex items-center justify-center`}>
    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
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
        <Suspense fallback={<SectionLoader />}>
          <Formateur />
        </Suspense>
        <Suspense fallback={<SectionLoader height="py-20 bg-[#151d2b]" />}>
          <Programme />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Avantages />
        </Suspense>
        <Suspense fallback={<SectionLoader height="py-20 bg-gradient-to-b from-[#151d2b] to-navy" />}>
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
    const monitor = PerformanceMonitor.getInstance();
    monitor.reportWebVitals();
    
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload hero background image
      const heroImg = new Image();
      heroImg.src = "https://images.pexels.com/photos/2773498/pexels-photo-2773498.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fm=webp";
      
      // Preload trainer image
      const trainerImg = new Image();
      trainerImg.src = "/Theo-Mahy-Ma-Somga.jpeg";
    };
    
    // Preload after initial render
    setTimeout(preloadCriticalResources, 100);
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