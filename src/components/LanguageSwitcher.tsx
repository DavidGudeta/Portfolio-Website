import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-gold/30 bg-white/5">
        <Globe size={14} className="text-gold" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{i18n.language.split('-')[0]}</span>
      </button>
      <div className="absolute right-0 mt-2 w-32 glass rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-white/10">
        <button
          onClick={() => changeLanguage('en')}
          className={`block w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-colors ${i18n.language === 'en' ? 'text-gold font-bold' : 'text-white/60'}`}
        >
          {t('english')}
        </button>
        <button
          onClick={() => changeLanguage('am')}
          className={`block w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-colors ${i18n.language === 'am' ? 'text-gold font-bold' : 'text-white/60'}`}
        >
          {t('amharic')}
        </button>
        <button
          onClick={() => changeLanguage('om')}
          className={`block w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-colors ${i18n.language === 'om' ? 'text-gold font-bold' : 'text-white/60'}`}
        >
          {t('oromo')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
