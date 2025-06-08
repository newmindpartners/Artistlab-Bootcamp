import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PaymentCancel: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: 'Paiement Annulé',
      message: 'Le paiement a été annulé. Aucun montant n\'a été débité de votre compte.',
      reason: 'Pourquoi le paiement a-t-il été annulé ?',
      reasons: [
        'Vous avez cliqué sur le bouton "Retour" pendant le processus de paiement',
        'Votre session de paiement a expiré',
        'Vous avez fermé la fenêtre de paiement'
      ],
      nextSteps: 'Que faire maintenant ?',
      step1: 'Vous pouvez retenter le processus d\'inscription',
      step2: 'Vérifiez vos informations de carte bancaire',
      step3: 'Contactez-nous si vous rencontrez des difficultés',
      backToRegistration: 'Retour à l\'inscription',
      backHome: 'Retour à l\'accueil',
      support: 'Besoin d\'aide ? Contactez-nous à info@artistlab.studio'
    },
    en: {
      title: 'Payment Cancelled',
      message: 'The payment has been cancelled. No amount has been charged to your account.',
      reason: 'Why was the payment cancelled?',
      reasons: [
        'You clicked the "Back" button during the payment process',
        'Your payment session has expired',
        'You closed the payment window'
      ],
      nextSteps: 'What to do now?',
      step1: 'You can retry the registration process',
      step2: 'Check your credit card information',
      step3: 'Contact us if you encounter difficulties',
      backToRegistration: 'Back to registration',
      backHome: 'Back to home',
      support: 'Need help? Contact us at info@artistlab.studio'
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-red-500/20 p-6 rounded-full mb-6">
            <XCircle className="h-14 w-14 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold mb-4">
            {t.title}
          </h1>
          
          <p className="text-white/80 mb-8">
            {t.message}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-heading font-semibold mb-4 text-red-400">
            {t.reason}
          </h2>
          
          <ul className="space-y-2">
            {t.reasons.map((reason, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mr-3 mt-2"></div>
                <span className="text-white/80">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/#inscription"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToRegistration}
          </Link>
          
          <Link 
            to="/"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            {t.backHome}
          </Link>
        </div>

        <p className="text-sm text-white/60 text-center mt-6">
          {t.support}
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;