import React from 'react';
import { Award, Film, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Formateur: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="formateur" className="py-20 bg-gradient-to-b from-navy to-[#151d2b]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden border-2 border-primary/30 relative">
              <img 
                src="/Theo-Mahy-Ma-Somga.jpeg" 
                alt="Théo Mahy-Ma-Somga" 
                className="w-full h-auto object-cover aspect-[4/5]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 to-transparent pt-20 pb-4 px-6 text-right">
                <h3 className="text-xl font-heading font-bold text-white">Théo Mahy-Ma-Somga</h3>
                <p className="text-accent">Réalisateur & Fondateur</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px flex-grow bg-primary/30"></div>
              <span className="text-accent uppercase tracking-wider text-sm font-semibold">{t('nav.trainer')}</span>
              <div className="h-px flex-grow bg-primary/30"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              {t('trainer.title')} <span className="text-accent">Théo Mahy-Ma-Somga</span>
            </h2>
            
            <p className="text-white/80 mb-8 text-lg">
              {t('trainer.subtitle')}
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                  <Film className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">{t('trainer.exp.title')}</h3>
                  <p className="text-white/70">{t('trainer.exp.desc')}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">{t('trainer.award.title')}</h3>
                  <p className="text-white/70">{t('trainer.award.desc')}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-1">{t('trainer.pioneer.title')}</h3>
                  <p className="text-white/70">{t('trainer.pioneer.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formateur;