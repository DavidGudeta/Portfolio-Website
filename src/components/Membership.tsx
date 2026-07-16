import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Crown, BarChart3, ShieldCheck, Globe2, ArrowRight } from 'lucide-react';

interface MembershipProps {
  id?: string;
  onJoinClick: () => void;
}

export default function Membership({ id, onJoinClick }: MembershipProps) {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Portfolio Analysis",
      desc: "Comprehensive deep-dive into your real estate holdings with performance tracking."
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "Global Sourcing",
      desc: "Off-market access to the world's most prestigious investment opportunities."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Strategic Advisory",
      desc: "Tailored investment roadmaps designed for multi-generational wealth preservation."
    }
  ];

  return (
    <section id={id} className="py-32 bg-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 text-gold mb-6">
              <Crown className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold">{t('elite_membership')}</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
              {t('investment_advisory')} & Management
            </h2>
            
            <p className="text-white/60 text-lg mb-12 font-light leading-relaxed max-w-xl">
              {t('membership_desc')} Our bespoke advisory service is designed for those who view real estate as more than just property—it's a cornerstone of their legacy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-gold">{benefit.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-1">{benefit.title}</h4>
                    <p className="text-xs text-white/40 leading-relaxed font-light">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onJoinClick}
              className="group bg-gold text-dark px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-4"
            >
              {t('join_membership')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 relative">
              <img 
                src="https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=1000" 
                alt="Luxury Office" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
              
              <div className="absolute bottom-12 left-12 right-12 glass p-8 rounded-3xl border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-dark overflow-hidden bg-white/10">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Member" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/60 font-medium">
                    Trusted by 50+ Global Portfolio Holders
                  </div>
                </div>
                <div className="h-px bg-white/10 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-serif">$4.2B+</div>
                  <div className="text-[8px] uppercase tracking-widest text-gold font-bold">Assets Under Advisory</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
