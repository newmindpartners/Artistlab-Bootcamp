import React from 'react';
import { Film, Star, Users, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-28 pb-20 relative">
      <div className="absolute inset-0">
        {/* Background image with enhanced blur */}
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2773498/pexels-photo-2773498.jpeg')] bg-cover bg-center bg-fixed" />
        <div className="absolute inset-0 backdrop-blur-sm" />
        {/* Darker overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy/85 to-navy/95" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent ring-1 ring-inset ring-accent/30 shadow-lg backdrop-blur-md">
              {t('hero.limited')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
            <span className="block mb-2">{t('hero.title')}</span>
            <span className="text-accent">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
            {t('hero.description')}
          </p>

          {/* YouTube Video */}
          <div className="relative mb-10 rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.youtube.com/embed/xcPL9an8XKk?autoplay=0&rel=0"
                title="Artist Lab CAMPUS Presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-xl"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/5">
              <Calendar className="h-5 w-5 text-accent mr-2" />
              <span>{t('hero.features.duration')}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/5">
              <Star className="h-5 w-5 text-accent mr-2" />
              <span>{t('hero.features.tools')}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/5">
              <Film className="h-5 w-5 text-accent mr-2" />
              <span>{t('hero.features.project')}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/5">
              <Users className="h-5 w-5 text-accent mr-2" />
              <span>{t('hero.features.network')}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#inscription" 
              className="button-primary shadow-lg hover:shadow-accent/20 transition-shadow"
            >
              {t('hero.cta.register')}
            </a>
            <a 
              href="#programme" 
              className="button-secondary shadow-lg hover:shadow-white/10 transition-shadow"
            >
              {t('hero.cta.program')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;