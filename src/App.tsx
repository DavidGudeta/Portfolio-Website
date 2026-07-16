import Hero from './components/Hero';
import PropertyList from './components/PropertyList';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Membership from './components/Membership';
import AIChat from './components/AIChat';
import ViewingForm from './components/ViewingForm';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Linkedin, Twitter, Mail, Phone, Building2, User, LogOut, ShieldCheck, Lock } from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile, UserProfile } from './services/propertyService';

type Tab = 'dashboard' | 'properties' | 'inquiries' | 'testimonials' | 'about' | 'settings' | 'profile';

const ADMIN_EMAIL = 'masaraproperties2025@gmail.com';

export default function App() {
  const { t } = useTranslation();
  const [isViewingFormOpen, setIsViewingFormOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminDashboardTab, setAdminDashboardTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const isAdmin = userProfile?.role === 'admin' || user?.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-dark selection:bg-gold selection:text-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-center bg-gradient-to-b from-dark/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gold p-1.5 rounded-lg">
            <Building2 className="w-5 h-5 text-dark" />
          </div>
          <div className="text-xl font-serif tracking-[0.1em] uppercase">ESAYAS ADAL</div>
        </div>
        <div className="hidden md:flex items-center gap-12 text-xs uppercase tracking-[0.3em] font-medium text-white/60">
          <a href="#listings" className="hover:text-gold transition-colors">{t('properties')}</a>
          <a href="#about" className="hover:text-gold transition-colors">{t('about')}</a>
          <a href="#services" className="hover:text-gold transition-colors">{t('services')}</a>
          <a href="#membership" className="hover:text-gold transition-colors">{t('membership')}</a>
          <a href="#contact" className="hover:text-gold transition-colors">{t('contact')}</a>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {isAuthReady && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <button 
                      onClick={() => setIsAdminDashboardOpen(true)}
                      className="hidden sm:flex items-center gap-2 text-gold hover:text-white transition-colors text-xs uppercase tracking-widest font-medium"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {t('admin')}
                    </button>
                  )}
                    <div className="relative group">
                      <button className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:border-gold/50 transition-all">
                        <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gold" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-medium text-white/60 hidden lg:block">
                          {user.displayName || user.email?.split('@')[0]}
                        </span>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 glass rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-white/10 shadow-2xl">
                        <div className="p-4 border-b border-white/5">
                          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('signed_in_as')}</p>
                          <p className="text-xs font-medium truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={() => {
                              setAdminDashboardTab('profile');
                              setIsAdminDashboardOpen(true);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-widest text-white/60 hover:text-gold hover:bg-white/5 rounded-lg transition-all"
                          >
                            <User className="w-3 h-3" />
                            {t('edit_profile')}
                          </button>
                          <button 
                            onClick={() => {
                              setAdminDashboardTab('profile');
                              setIsAdminDashboardOpen(true);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-widest text-white/60 hover:text-gold hover:bg-white/5 rounded-lg transition-all"
                          >
                            <Lock className="w-3 h-3" />
                            {t('change_password')}
                          </button>
                          <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-all"
                          >
                            <LogOut className="w-3 h-3" />
                            {t('signOut')}
                          </button>
                        </div>
                      </div>
                    </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-xs uppercase tracking-widest font-medium"
                >
                  <User className="w-4 h-4" />
                  {t('signIn')}
                </button>
              )}
            </>
          )}
          <button 
            onClick={() => setIsViewingFormOpen(true)}
            className="bg-white text-dark px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gold transition-colors"
          >
            {t('inquiry')}
          </button>
        </div>
      </nav>

      <main>
        <Hero />
        
        <PropertyList id="listings" />
        
        <Testimonials />
        
        <Membership id="membership" onJoinClick={() => setIsViewingFormOpen(true)} />

        {/* Stats Section */}
        <section className="py-20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Sales Volume', value: '$2.4B+' },
              { label: 'Properties Sold', value: '450+' },
              { label: 'Client Satisfaction', value: '100%' },
              { label: 'Global Offices', value: '12' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-gold text-3xl md:text-4xl font-serif mb-2">{stat.value}</div>
                <div className="text-white/40 text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <About id="about" />

        {/* Services Section */}
        <section id="services" className="py-32 px-6 bg-dark">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-gold uppercase tracking-widest text-xs mb-4 block">{t('expertise')}</span>
              <h2 className="text-5xl md:text-6xl font-serif">{t('bespoke_services')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: t('property_acquisition'),
                  desc: t('property_acquisition_desc')
                },
                {
                  title: t('luxury_marketing'),
                  desc: t('luxury_marketing_desc')
                },
                {
                  title: t('portfolio_management'),
                  desc: t('portfolio_management_desc')
                }
              ].map((service, i) => (
                <div key={i} className="glass p-10 rounded-3xl hover:border-gold/30 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-8 group-hover:bg-gold transition-colors">
                    <div className="w-2 h-2 bg-gold group-hover:bg-dark rounded-full" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">{service.title}</h3>
                  <p className="text-white/50 font-light leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-gold uppercase tracking-widest text-xs mb-4 block">{t('get_in_touch')}</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-12">{t('start_journey')}</h2>
            <p className="text-white/60 text-lg mb-16 max-w-2xl mx-auto font-light">
              {t('contact_desc')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="glass p-10 rounded-3xl">
                <h3 className="text-2xl font-serif mb-6">{t('contact_details')}</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-white/70">
                    <Mail className="w-5 h-5 text-gold" />
                    <span>contact@esayasadal.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/70">
                    <Phone className="w-5 h-5 text-gold" />
                    <span>+1 (555) 000-8888</span>
                  </div>
                </div>
                <div className="flex gap-6 mt-12">
                  <Instagram className="w-5 h-5 text-white/40 hover:text-gold cursor-pointer transition-colors" />
                  <Linkedin className="w-5 h-5 text-white/40 hover:text-gold cursor-pointer transition-colors" />
                  <Twitter className="w-5 h-5 text-white/40 hover:text-gold cursor-pointer transition-colors" />
                </div>
              </div>
              
              <div className="glass p-10 rounded-3xl flex flex-col justify-between">
                <h3 className="text-2xl font-serif mb-6">{t('office_location')}</h3>
                <p className="text-white/70 leading-relaxed">
                  9255 Sunset Blvd, Suite 1100<br />
                  West Hollywood, CA 90069
                </p>
                <button 
                  onClick={() => setIsViewingFormOpen(true)}
                  className="mt-12 w-full bg-gold text-dark py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                >
                  {t('schedule_viewing')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
        <div className="text-white/20 text-[10px] uppercase tracking-[0.4em]">
          &copy; 2026 ESAYAS ADAL Luxury Real Estate. All Rights Reserved.
        </div>
      </footer>

      <AIChat />
      <ViewingForm isOpen={isViewingFormOpen} onClose={() => setIsViewingFormOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AnimatePresence>
        {isAdminDashboardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminDashboard 
              onClose={() => setIsAdminDashboardOpen(false)} 
              initialTab={adminDashboardTab}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
