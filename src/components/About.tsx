import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function About({ id }: { id?: string }) {
  const { t } = useTranslation();
  
  return (
    <section id={id} className="py-32 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
              alt="Esayas Adal"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 glass p-8 rounded-2xl hidden md:block">
            <div className="text-gold text-4xl font-serif mb-1">15+</div>
            <div className="text-white/50 uppercase tracking-widest text-xs">{t('years_excellence')}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-gold uppercase tracking-widest text-xs mb-4 block">The Real Estate Agents</span>
          <h2 className="text-5xl md:text-6xl font-serif mb-8 uppercase">ESAYAS ADAL</h2>
          <div className="space-y-6 text-white/70 font-light leading-relaxed text-lg">
            <p>
              {t('about_text1')}
            </p>
            <p>
              {t('about_text2')}
            </p>
            <p className="italic">
              "{t('about_quote')}"
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <div className="text-white font-serif text-xl mb-2">{t('global_network')}</div>
              <div className="text-white/40 text-sm">{t('global_network_desc')}</div>
            </div>
            <div>
              <div className="text-white font-serif text-xl mb-2">{t('bespoke_strategy')}</div>
              <div className="text-white/40 text-sm">{t('bespoke_strategy_desc')}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
