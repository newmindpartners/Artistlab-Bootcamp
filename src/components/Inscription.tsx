import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createCheckoutSession } from '../lib/stripe';
import { products } from '../stripe-config';
import { useLanguage } from '../contexts/LanguageContext';

interface ValidationErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  ville?: string;
  date?: string;
}

const Inscription: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
    date: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const placesDisponibles = 20;
  const placesRestantes = 7;

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!formData.prenom.trim()) {
      errors.prenom = t('validation.prenom.required');
      isValid = false;
    } else if (formData.prenom.length < 2) {
      errors.prenom = t('validation.prenom.tooShort');
      isValid = false;
    }

    if (!formData.nom.trim()) {
      errors.nom = t('validation.nom.required');
      isValid = false;
    } else if (formData.nom.length < 2) {
      errors.nom = t('validation.nom.tooShort');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = t('validation.email.required');
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = t('validation.email.invalid');
      isValid = false;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!formData.telephone) {
      errors.telephone = t('validation.telephone.required');
      isValid = false;
    } else if (!phoneRegex.test(formData.telephone)) {
      errors.telephone = t('validation.telephone.invalid');
      isValid = false;
    }

    if (!formData.ville.trim()) {
      errors.ville = t('validation.ville.required');
      isValid = false;
    }

    if (!formData.date) {
      errors.date = t('validation.date.required');
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Create registration in Supabase
      const { error: registrationError } = await supabase
        .from('registrations')
        .insert([
          {
            ...formData,
            payment_status: 'pending'
          }
        ]);

      if (registrationError) {
        console.error('Registration error:', registrationError);
        throw new Error(registrationError.message);
      }

      // 2. Check if user already exists
      const { data: { user: existingUser }, error: userError } = await supabase.auth.getUser();

      let session;

      if (!existingUser) {
        // New user - sign them up
        const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/success`
          }
        });

        if (signUpError) {
          console.error('Signup error:', signUpError);
          
          // Check for specific "user already exists" error
          if (signUpError.message === 'User already registered' || 
              signUpError.message.includes('already registered') ||
              signUpError.message.includes('user_already_exists')) {
            setError(t('form.error.userExists'));
            return;
          }
          
          throw new Error(signUpError.message);
        }

        session = signUpData.session;
      } else {
        // Existing user - get their session
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error(sessionError.message);
        }
        
        session = existingSession;
      }

      if (!session) {
        throw new Error('No session available');
      }

      // Store the token for later use in webhook
      localStorage.setItem('sb-token', session.access_token);
      localStorage.setItem('registration-data', JSON.stringify(formData));

      // Create Stripe checkout session
      const checkoutUrl = await createCheckoutSession(
        products.formation.priceId,
        products.formation.mode
      );

      if (!checkoutUrl) {
        throw new Error('Failed to create checkout session');
      }

      // Redirect to Stripe
      window.location.href = checkoutUrl;
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Registration process error:', err);
      
      // Check for specific "user already exists" error in the catch block as well
      if (err.message === 'User already registered' || 
          err.message.includes('already registered') ||
          err.message.includes('user_already_exists')) {
        setError(t('form.error.userExists'));
      } else {
        setError(t('form.error'));
      }
      
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section id="inscription" className="py-20 bg-gradient-to-b from-[#151d2b] to-navy relative">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5429060/pexels-photo-5429060.jpeg')] bg-cover bg-center opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('register.title')} <span className="text-accent">{t('register.now')}</span>
            </h2>
            
            <p className="text-white/80 mb-6">
              {t('register.description')}
            </p>

            {/* Product Information */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
              <h3 className="text-xl font-heading font-semibold mb-3 text-accent">
                {products.formation.name}
              </h3>
              <p className="text-white/70 mb-4">
                {products.formation.description}
              </p>
              <div className="text-2xl font-bold text-accent">
                {products.formation.price}
              </div>
            </div>
            
            <div className="inline-flex items-center bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="font-medium">{t('register.spots')} </span>
              <span className="font-bold ml-1 text-accent">{placesRestantes}/{placesDisponibles}</span>
            </div>
            
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-500" 
                  style={{ width: `${((placesDisponibles - placesRestantes) / placesDisponibles) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {success ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center bg-accent/20 p-6 rounded-full mb-6">
                <CheckCircle className="h-14 w-14 text-accent" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3">{t('form.success.title')}</h3>
              <p className="text-white/80 mb-6">{t('form.success.message')}</p>
              <p className="text-accent font-medium">{t('form.success.redirect')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-white/80 mb-1">
                    {t('form.firstname')} *
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-accent focus:border-accent text-white placeholder-white/50 ${
                      validationErrors.prenom ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder={t('form.firstname.placeholder')}
                  />
                  {validationErrors.prenom && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.prenom}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-white/80 mb-1">
                    {t('form.lastname')} *
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-accent focus:border-accent text-white placeholder-white/50 ${
                      validationErrors.nom ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder={t('form.lastname.placeholder')}
                  />
                  {validationErrors.nom && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.nom}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  {t('form.email')} *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-accent focus:border-accent text-white placeholder-white/50 ${
                    validationErrors.email ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder={t('form.email.placeholder')}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-white/80 mb-1">
                  {t('form.phone')} *
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-accent focus:border-accent text-white placeholder-white/50 ${
                    validationErrors.telephone ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder={t('form.phone.placeholder')}
                />
                {validationErrors.telephone && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.telephone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="ville" className="block text-sm font-medium text-white/80 mb-1">
                  {t('form.city')} *
                </label>
                <input
                  id="ville"
                  name="ville"
                  type="text"
                  value={formData.ville}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-accent focus:border-accent text-white placeholder-white/50 ${
                    validationErrors.ville ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder={t('form.city.placeholder')}
                />
                {validationErrors.ville && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.ville}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  {t('form.date')} *
                </label>
                <div className={`space-y-4 ${validationErrors.date ? 'border border-red-500 rounded-lg p-4' : ''}`}>
                  <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-accent/30 transition-colors">
                    <input
                      type="radio"
                      name="date"
                      value="aix"
                      checked={formData.date === 'aix'}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent border-white/30 focus:ring-accent focus:ring-offset-navy"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">{t('locations.aix')}</span>
                      <span className="text-white/70">{t('dates.aix')}</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-accent/30 transition-colors">
                    <input
                      type="radio"
                      name="date"
                      value="cannes"
                      checked={formData.date === 'cannes'}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent border-white/30 focus:ring-accent focus:ring-offset-navy"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">{t('locations.cannes')}</span>
                      <span className="text-white/70">{t('dates.cannes')}</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-accent/30 transition-colors">
                    <input
                      type="radio"
                      name="date"
                      value="paris"
                      checked={formData.date === 'paris'}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent border-white/30 focus:ring-accent focus:ring-offset-navy"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">{t('locations.paris')}</span>
                      <span className="text-white/70">{t('dates.paris')}</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-accent/30 transition-colors">
                    <input
                      type="radio"
                      name="date"
                      value="london"
                      checked={formData.date === 'london'}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent border-white/30 focus:ring-accent focus:ring-offset-navy"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">{t('locations.london')}</span>
                      <span className="text-white/70">{t('dates.london')}</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-accent/30 transition-colors">
                    <input
                      type="radio"
                      name="date"
                      value="online"
                      checked={formData.date === 'online'}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent border-white/30 focus:ring-accent focus:ring-offset-navy"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">{t('locations.online')}</span>
                      <span className="text-white/70">{t('dates.online')} {t('dates.online.limit')}</span>
                    </div>
                  </label>
                </div>
                {validationErrors.date && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.date}</p>
                )}
              </div>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-white/80 text-sm">{error}</p>
                </div>
              )}
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full button-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                        <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('form.processing')}
                    </>
                  ) : (
                    `${t('form.submit')} • ${products.formation.price}`
                  )}
                </button>
                
                <p className="text-sm text-white/60 text-center mt-4">
                  {t('form.secure')}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Inscription;