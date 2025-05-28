import React from 'react';
import { Clapperboard, Lightbulb, Users, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AvantageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Avantage: React.FC<AvantageProps> = ({ title, description, icon }) => {
  return (
    <div className="card p-6 hover:translate-y-[-5px]">
      <div className="bg-primary/10 p-3 inline-flex rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-heading font-semibold mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  );
};

const Avantages: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="avantages" className="py-20 bg-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="h-px w-12 bg-primary/30"></div>
            <span className="text-accent uppercase tracking-wider text-sm font-semibold">
              {t('benefits.title')}
            </span>
            <div className="h-px w-12 bg-primary/30"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            {t('benefits.title')} <span className="text-accent">{t('benefits.highlight')}</span> {t('benefits.subtitle')}
          </h2>
          
          <p className="text-white/80">
            {t('benefits.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Avantage 
            title={t('benefits.film.title')} 
            description={t('benefits.film.desc')}
            icon={<Clapperboard className="h-6 w-6 text-accent" />}
          />
          
          <Avantage 
            title={t('benefits.tools.title')} 
            description={t('benefits.tools.desc')}
            icon={<Lightbulb className="h-6 w-6 text-accent" />}
          />
          
          <Avantage 
            title={t('benefits.network.title')} 
            description={t('benefits.network.desc')}
            icon={<Users className="h-6 w-6 text-accent" />}
          />
          
          <Avantage 
            title={t('benefits.mentoring.title')} 
            description={t('benefits.mentoring.desc')}
            icon={<Award className="h-6 w-6 text-accent" />}
          />
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="#inscription" 
            className="button-primary"
          >
            {t('benefits.cta')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Avantages;