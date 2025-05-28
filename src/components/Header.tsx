import React, { useEffect, useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-xl font-heading font-bold">Artist Lab <span className="text-accent">Bootcamp</span></a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#formateur" className="text-white/80 hover:text-accent transition duration-300">{t('nav.trainer')}</a>
          <a href="#programme" className="text-white/80 hover:text-accent transition duration-300">{t('nav.program')}</a>
          <a href="#avantages" className="text-white/80 hover:text-accent transition duration-300">{t('nav.benefits')}</a>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-white/80 hover:text-accent transition duration-300"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase">{language}</span>
          </button>
          <a href="#inscription" className="button-primary">{t('nav.register')}</a>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-white/80 hover:text-accent transition duration-300"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase">{language}</span>
          </button>
          <button 
            className="text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-navy/95 absolute w-full py-4">
          <nav className="flex flex-col space-y-4 px-4">
            <a 
              href="#formateur" 
              className="text-white/80 hover:text-accent transition duration-300 py-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.trainer')}
            </a>
            <a 
              href="#programme" 
              className="text-white/80 hover:text-accent transition duration-300 py-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.program')}
            </a>
            <a 
              href="#avantages" 
              className="text-white/80 hover:text-accent transition duration-300 py-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.benefits')}
            </a>
            <a 
              href="#inscription" 
              className="button-primary text-center"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.register')}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;