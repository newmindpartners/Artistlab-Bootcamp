import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Film } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

const PaymentSuccess: React.FC = () => {
  const { language } = useLanguage();
  const [registrationData, setRegistrationData] = useState<any>(null);

  useEffect(() => {
    // Get registration data from localStorage
    const storedData = localStorage.getItem('registration-data');
    if (storedData) {
      setRegistrationData(JSON.parse(storedData));
      // Clear the stored data
      localStorage.removeItem('registration-data');
      localStorage.removeItem('sb-token');
    }
  }, []);

  const content = {
    fr: {
      title: 'Paiement Réussi !',
      subtitle: 'Votre inscription est confirmée',
      message: 'Merci pour votre inscription à la formation "Cinéma & IA" ! Vous recevrez bientôt un email de confirmation avec tous les détails de la formation.',
      details: 'Détails de votre inscription',
      name: 'Nom',
      email: 'Email',
      location: 'Lieu de formation',
      nextSteps: 'Prochaines étapes',
      step1: 'Vous recevrez un email de confirmation dans les prochaines minutes',
      step2: 'Les détails pratiques vous seront envoyés 1 semaine avant la formation',
      step3: 'Préparez-vous à vivre une expérience unique !',
      backHome: 'Retour à l\'accueil',
      support: 'Besoin d\'aide ? Contactez-nous à info@artistlab.studio'
    },
    en: {
      title: 'Payment Successful!',
      subtitle: 'Your registration is confirmed',
      message: 'Thank you for registering for the "Cinema & AI" training! You will soon receive a confirmation email with all the training details.',
      details: 'Your registration details',
      name: 'Name',
      email: 'Email',
      location: 'Training location',
      nextSteps: 'Next steps',
      step1: 'You will receive a confirmation email in the next few minutes',
      step2: 'Practical details will be sent 1 week before the training',
      step3: 'Get ready for a unique experience!',
      backHome: 'Back to home',
      support: 'Need help? Contact us at info@artistlab.studio'
    }
  };

  const t = content[language];

  const locationMap = {
    aix: language === 'fr' ? 'Aix-en-Provence, France' : 'Aix-en-Provence, France',
    cannes: language === 'fr' ? 'Cannes, France' : 'Cannes, France',
    paris: language === 'fr' ? 'Paris, France' : 'Paris, France',
    london: language === 'fr' ? 'Londres, Royaume-Uni' : 'London, UK',
    online: language === 'fr' ? 'Formation en ligne' : 'Online Training'
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-accent/20 p-6 rounded-full mb-6">
            <CheckCircle className="h-14 w-14 text-accent" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t.title}
          </h1>
          
          <p className="text-xl text-accent font-semibold mb-4">
            {t.subtitle}
          </p>
          
          <p className="text-white/80 mb-8">
            {t.message}
          </p>
        </div>

        {registrationData && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
            <h2 className="text-xl font-heading font-semibold mb-4 flex items-center">
              <Film className="h-5 w-5 text-accent mr-2" />
              {t.details}
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">{t.name}:</span>
                <span className="font-medium">{registrationData.prenom} {registrationData.nom}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/70">{t.email}:</span>
                <span className="font-medium">{registrationData.email}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/70">{t.location}:</span>
                <span className="font-medium">
                  {locationMap[registrationData.date as keyof typeof locationMap] || registrationData.date}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
          <h3 className="text-lg font-heading font-semibold mb-4 text-accent">
            {t.nextSteps}
          </h3>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-accent text-sm font-bold">1</span>
              </div>
              <span className="text-white/80">{t.step1}</span>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-accent text-sm font-bold">2</span>
              </div>
              <span className="text-white/80">{t.step2}</span>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-accent text-sm font-bold">3</span>
              </div>
              <span className="text-white/80">{t.step3}</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <Link 
            to="/"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition duration-300 mb-4"
          >
            {t.backHome}
          </Link>
          
          <p className="text-sm text-white/60">
            {t.support}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;