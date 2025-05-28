import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
        <div className="inline-flex items-center justify-center bg-accent/20 p-6 rounded-full mb-6">
          <CheckCircle className="h-14 w-14 text-accent" />
        </div>
        
        <h1 className="text-2xl font-heading font-bold mb-4">
          Paiement Réussi !
        </h1>
        
        <p className="text-white/80 mb-8">
          Merci pour votre inscription ! Vous recevrez bientôt un email de confirmation avec tous les détails de la formation.
        </p>
        
        <Link 
          to="/"
          className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;