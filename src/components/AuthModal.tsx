import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile } from '../services/propertyService';

type AuthMode = 'signin' | 'signup';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Create/Update profile in Firestore
      const role = result.user.email === 'masaraproperties2025@gmail.com' ? 'admin' : 'client';
      await createUserProfile(result.user.uid, result.user.email!, role);
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled. Please try again.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, { displayName: formData.fullName });
        
        // Create user profile in Firestore
        const role = formData.email === 'masaraproperties2025@gmail.com' ? 'admin' : 'client';
        await createUserProfile(userCredential.user.uid, formData.email, role);
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Auth Error:", err);
      let userMessage = "An error occurred during authentication.";
      
      if (err.code === 'auth/operation-not-allowed') {
        userMessage = "ADMIN ACTION REQUIRED: Email/Password sign-in is currently disabled in your Firebase Console. To fix this, go to Authentication > Sign-in method and enable 'Email/Password'. This is required for your admin account to work.";
      } else if (err.code === 'auth/email-already-in-use') {
        userMessage = "This email is already registered. Please sign in instead.";
      } else if (err.code === 'auth/invalid-credential') {
        userMessage = "Invalid email or password. Please try again.";
      } else if (err.code === 'auth/weak-password') {
        userMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (err.message) {
        userMessage = err.message;
      }
      
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass rounded-3xl overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 hover:text-gold transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 md:p-10">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-8 h-8 text-gold" />
                  </motion.div>
                  <h2 className="text-2xl font-serif mb-2">
                    {mode === 'signin' ? t('welcome_back') : t('account_created')}
                  </h2>
                  <p className="text-white/60 text-sm font-light">
                    {mode === 'signin' ? 'Redirecting to your portal...' : 'Welcome to the ESAYAS ADAL network.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <span className="text-gold uppercase tracking-widest text-[10px] mb-2 block">Client Portal</span>
                    <h2 className="text-3xl font-serif">
                      {mode === 'signin' ? t('signin') : t('signup')}
                    </h2>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === 'signup' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('name')}</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input 
                            required 
                            type="text" 
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-gold transition-colors text-sm" 
                            placeholder="John Doe" 
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('email')}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-gold transition-colors text-sm" 
                          placeholder="john@example.com" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('password')}</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required 
                          type={showPassword ? 'text' : 'password'} 
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-gold transition-colors text-sm" 
                          placeholder="••••••••" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {mode === 'signin' && (
                      <div className="flex justify-end">
                        <button type="button" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-gold transition-colors">
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gold text-dark py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {mode === 'signin' ? t('signin') : t('signup')}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] uppercase tracking-widest text-white/20">Or continue with</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>

                  <button 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="mt-6 w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>

                  <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-white/40 text-xs font-light">
                      {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                      <button 
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="ml-2 text-gold hover:underline font-medium"
                      >
                        {mode === 'signin' ? t('signup') : t('signin')}
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
