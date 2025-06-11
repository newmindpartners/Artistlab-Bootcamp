import React from 'react';
import { Film, Mail, MapPin, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      description: "Formez-vous aux techniques cinématographiques de demain avec les meilleurs experts du domaine.",
      quickLinks: "Liens Rapides",
      trainer: "Formateur",
      program: "Programme",
      benefits: "Avantages",
      registration: "Inscription",
      locations: "Lieux de Formation",
      onlineTraining: "Formation en ligne (1-2 Septembre)",
      contact: "Contact",
      rights: "Tous droits réservés.",
      legal: "Mentions légales",
      terms: "Conditions générales",
      privacy: "Politique de confidentialité"
    },
    en: {
      description: "Train in tomorrow's cinematographic techniques with the best experts in the field.",
      quickLinks: "Quick Links",
      trainer: "Trainer",
      program: "Program",
      benefits: "Benefits",
      registration: "Registration",
      locations: "Training Locations",
      onlineTraining: "Online Training (September 1-2)",
      contact: "Contact",
      rights: "All rights reserved.",
      legal: "Legal Notice",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy"
    }
  };

  const t = content[language];

  return (
    <footer className="bg-navy border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Film className="h-6 w-6 text-accent mr-2" />
              <span className="text-xl font-heading font-bold">Artist Lab <span className="text-accent">CAMPUS</span></span>
            </div>
            <p className="text-white/70 mb-4">
              {t.description}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/artistlabbootcamp/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/50 hover:text-accent transition duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#formateur" className="text-white/70 hover:text-accent transition duration-300">{t.trainer}</a>
              </li>
              <li>
                <a href="#programme" className="text-white/70 hover:text-accent transition duration-300">{t.program}</a>
              </li>
              <li>
                <a href="#avantages" className="text-white/70 hover:text-accent transition duration-300">{t.benefits}</a>
              </li>
              <li>
                <a href="#inscription" className="text-white/70 hover:text-accent transition duration-300">{t.registration}</a>
              </li>
              <li>
                <a href="https://www.artistlab.studio/" className="text-white/70 hover:text-accent transition duration-300">Artist Lab Studio</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{t.locations}</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <span className="text-white/70">Aix-en-Provence, France</span>
              </li>
              <li className="flex">
                <MapPin className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <span className="text-white/70">Cannes, France</span>
              </li>
              <li className="flex">
                <MapPin className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <span className="text-white/70">Paris, France</span>
              </li>
              <li className="flex">
                <MapPin className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <span className="text-white/70">London, UK</span>
              </li>
              <li className="flex">
                <MapPin className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <span className="text-white/70">{t.onlineTraining}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{t.contact}</h3>
            <ul className="space-y-3">
              <li className="flex">
                <Mail className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                <a href="mailto:info@artistlab.studio" className="text-white/70 hover:text-accent transition duration-300">
                  info@artistlab.studio
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Artist Lab Studio. {t.rights}
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/50 hover:text-accent text-sm transition duration-300">
              {t.legal}
            </a>
            <a href="#" className="text-white/50 hover:text-accent text-sm transition duration-300">
              {t.terms}
            </a>
            <a href="#" className="text-white/50 hover:text-accent text-sm transition duration-300">
              {t.privacy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;