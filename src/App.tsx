import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Programme from './components/Programme';
import Formateur from './components/Formateur';
import Avantages from './components/Avantages';
import Inscription from './components/Inscription';
import Footer from './components/Footer';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentCancel from './components/PaymentCancel';
import TestEmailButton from './components/TestEmailButton';

function MainLayout() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <Header />
      <main>
        <Hero />
        <Formateur />
        <Programme />
        <Avantages />
        <Inscription />
      </main>
      <Footer />
      {/* Test email button - only visible in development */}
      {import.meta.env.DEV && <TestEmailButton />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<PaymentCancel />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;