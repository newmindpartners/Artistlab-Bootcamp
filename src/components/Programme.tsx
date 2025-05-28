import React from 'react';
import { Clock, Coffee, MessageSquare, Image, Video, Edit, Film, Clapperboard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SessionProps {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isBreak?: boolean;
}

const Session: React.FC<SessionProps> = ({ time, title, description, icon, isBreak }) => {
  return (
    <div className={`flex gap-4 ${isBreak ? 'opacity-80' : ''}`}>
      <div className="relative flex flex-col items-center">
        <div className={`flex-shrink-0 rounded-full ${isBreak ? 'bg-white/10' : 'bg-primary/20'} p-3`}>
          {icon}
        </div>
        <div className="w-px h-full bg-gradient-to-b from-primary/30 to-transparent absolute top-12 bottom-0"></div>
      </div>
      <div className="pb-12">
        <span className="text-sm font-medium text-accent block mb-1">{time}</span>
        <h3 className="font-heading font-semibold text-xl mb-2">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  );
};

const Programme: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="programme" className="py-20 bg-[#151d2b]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="h-px w-12 bg-primary/30"></div>
            <span className="text-accent uppercase tracking-wider text-sm font-semibold">
              {t('program.title')}
            </span>
            <div className="h-px w-12 bg-primary/30"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            {t('program.subtitle')} <span className="text-accent">{t('program.days')}</span>
          </h2>
          
          <p className="text-white/80">
            {t('program.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Day 1 */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-8 text-accent">{t('program.day1.title')}</h3>
            
            <Session 
              time={t('program.day1.welcome.time')}
              title={t('program.day1.welcome.title')}
              description={t('program.day1.welcome.desc')}
              icon={<Clock className="h-5 w-5 text-accent" />}
            />
            
            <Session 
              time={t('program.day1.midjourney.time')}
              title={t('program.day1.midjourney.title')}
              description={t('program.day1.midjourney.desc')}
              icon={<Image className="h-5 w-5 text-accent" />}
            />
            
            <Session 
              time={t('program.day1.break1.time')}
              title={t('program.day1.break1.title')}
              description={t('program.day1.break1.desc')}
              icon={<Coffee className="h-5 w-5 text-white" />}
              isBreak={true}
            />
            
            <Session 
              time={t('program.day1.runway.time')}
              title={t('program.day1.runway.title')}
              description={t('program.day1.runway.desc')}
              icon={<Video className="h-5 w-5 text-accent" />}
            />
            
            <Session 
              time={t('program.day1.lunch.time')}
              title={t('program.day1.lunch.title')}
              description={t('program.day1.lunch.desc')}
              icon={<Coffee className="h-5 w-5 text-white" />}
              isBreak={true}
            />
            
            <Session 
              time={t('program.day1.kling.time')}
              title={t('program.day1.kling.title')}
              description={t('program.day1.kling.desc')}
              icon={<MessageSquare className="h-5 w-5 text-accent" />}
            />
          </div>

          {/* Day 2 */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-8 text-accent">{t('program.day2.title')}</h3>
            
            <Session 
              time={t('program.day2.kling.time')}
              title={t('program.day2.kling.title')}
              description={t('program.day2.kling.desc')}
              icon={<MessageSquare className="h-5 w-5 text-accent" />}
            />
            
            <Session 
              time={t('program.day2.break1.time')}
              title={t('program.day2.break1.title')}
              description={t('program.day2.break1.desc')}
              icon={<Coffee className="h-5 w-5 text-white" />}
              isBreak={true}
            />
            
            <Session 
              time={t('program.day2.luma.time')}
              title={t('program.day2.luma.title')}
              description={t('program.day2.luma.desc')}
              icon={<Film className="h-5 w-5 text-accent" />}
            />
            
            <Session 
              time={t('program.day2.lunch.time')}
              title={t('program.day2.lunch.title')}
              description={t('program.day2.lunch.desc')}
              icon={<Coffee className="h-5 w-5 text-white" />}
              isBreak={true}
            />
            
            <Session 
              time={t('program.day2.editing.time')}
              title={t('program.day2.editing.title')}
              description={t('program.day2.editing.desc')}
              icon={<Clapperboard className="h-5 w-5 text-accent" />}
            />
            
            <Session 
              time={t('program.day2.conclusion.time')}
              title={t('program.day2.conclusion.title')}
              description={t('program.day2.conclusion.desc')}
              icon={<Film className="h-5 w-5 text-accent" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programme;