import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
        <div className="inline-flex items-center justify-center bg-red-500/20 p-6 rounded-full mb-6">
          <XCircle className="h-14 w-14 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-heading font-bold mb-4">
          Paiement Annulé
        </h1>
        
        <p className="text-white/80 mb-8">
          Le paiement a été annulé. Si vous avez des questions, n'hésitez pas à nous contacter.
        </p>
        
        <Link 
          to="/"
          className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Retour à l'inscription
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;