import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Image as ImageIcon, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Home,
  MessageSquare,
  Info,
  Settings,
  UserCircle,
  LogOut,
  ChevronRight,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  Globe,
  Star,
  Quote
} from 'lucide-react';
import { 
  getProperties, 
  addProperty, 
  updateProperty, 
  deleteProperty, 
  seedProperties,
  getInquiries,
  deleteInquiry,
  getAboutContent,
  updateAboutContent,
  getSiteSettings,
  updateSiteSettings,
  Property,
  Inquiry
} from '../services/propertyService';
import { 
  getTestimonials, 
  addTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  Testimonial 
} from '../services/testimonialService';
import { auth } from '../firebase';
import { signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

type Tab = 'dashboard' | 'properties' | 'inquiries' | 'testimonials' | 'about' | 'settings' | 'profile';

const INITIAL_PROPERTIES: Property[] = [
  {
    title: "The Glass Pavilion",
    location: "Beverly Hills, CA",
    price: "$12,500,000",
    beds: 5,
    baths: 6,
    sqft: "8,400",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    description: "A masterpiece of modern architecture, the Glass Pavilion offers seamless indoor-outdoor living with floor-to-ceiling glass walls and panoramic city views.",
    amenities: ["Infinity Pool", "Art Gallery", "Home Theater", "Wine Cellar", "Smart Home System"],
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "Azure Cliffside Villa",
    location: "Malibu, CA",
    price: "$18,900,000",
    beds: 6,
    baths: 8,
    sqft: "12,200",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    description: "Perched on a private bluff overlooking the Pacific, Azure is the epitome of coastal luxury.",
    amenities: ["Private Beach", "Wellness Spa", "Chef's Kitchen", "Elevator", "Guest House"],
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "Modernist Sanctuary",
    location: "Aspen, CO",
    price: "$9,750,000",
    beds: 4,
    baths: 5,
    sqft: "6,800",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
    description: "A serene retreat nestled in the heart of the Rockies.",
    amenities: ["Ski-in/Ski-out", "Heated Lounge", "Stone Fireplace", "Library", "Gym"],
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "The Obsidian House",
    location: "Joshua Tree, CA",
    price: "$4,200,000",
    beds: 3,
    baths: 3,
    sqft: "3,200",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    description: "A brutalist masterpiece in the high desert.",
    amenities: ["Stargazing Deck", "Saltwater Pool", "Solar Power", "Zen Garden", "Outdoor Kitchen"],
    gallery: [
      "https://images.unsplash.com/photo-1449156001437-3a1661dc926b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "Emerald Lake Estate",
    location: "Lake Tahoe, NV",
    price: "$22,000,000",
    beds: 8,
    baths: 10,
    sqft: "15,500",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    description: "A sprawling waterfront estate with 200 feet of private beach.",
    amenities: ["Private Dock", "Grand Ballroom", "Wine Grotto", "Bowling Alley", "Home Office"],
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "Skyline Penthouse",
    location: "New York, NY",
    price: "$35,000,000",
    beds: 4,
    baths: 5,
    sqft: "5,400",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    description: "The crown jewel of Manhattan.",
    amenities: ["Rooftop Terrace", "Private Elevator", "Concierge", "Library", "Sauna"],
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

export default function AdminDashboard({ onClose, initialTab = 'dashboard' }: { onClose: () => void, initialTab?: Tab }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [properties, setProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Partial<Property> | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile states
  const [profileData, setProfileData] = useState({
    displayName: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
    newPassword: '',
    currentPassword: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [props, inqs, about, settings, tests] = await Promise.all([
        getProperties(),
        getInquiries(),
        getAboutContent(),
        getSiteSettings(),
        getTestimonials()
      ]);
      setProperties(props);
      setInquiries(inqs);
      setTestimonials(tests);
      setAboutContent(about || { title: '', subtitle: '', description: '', stats: [] });
      setSiteSettings(settings || { siteName: 'ESAYAS ADAL', contactEmail: '', contactPhone: '', socialLinks: {}, heroImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920' });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    onClose();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: profileData.displayName });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !profileData.currentPassword || !profileData.newPassword) return;
    setIsSaving(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email!, profileData.currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, profileData.newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setProfileData({ ...profileData, currentPassword: '', newPassword: '' });
    } catch (error: any) {
      console.error("Password Change Error:", error);
      let userMessage = error.message;
      if (error.code === 'auth/operation-not-allowed') {
        userMessage = "Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.";
      }
      setMessage({ type: 'error', text: userMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAboutContent(aboutContent);
      setMessage({ type: 'success', text: 'About content updated' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update about content' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(siteSettings);
      setMessage({ type: 'success', text: 'Settings updated' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await deleteInquiry(id);
      setInquiries(inquiries.filter(i => i.id !== id));
      setMessage({ type: 'success', text: 'Inquiry deleted' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete inquiry' });
    }
  };

  const renderSidebar = () => (
    <aside className="w-64 border-r border-white/5 bg-dark/50 backdrop-blur-xl flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gold p-1.5 rounded-lg">
            <Home className="w-5 h-5 text-dark" />
          </div>
          <div className="text-lg font-serif tracking-widest">{t('admin')}</div>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
            { id: 'properties', label: t('properties'), icon: Home },
            { id: 'inquiries', label: t('inquiries'), icon: MessageSquare },
            { id: 'testimonials', label: 'Testimonials', icon: Quote },
            { id: 'about', label: t('about_content'), icon: Info },
            { id: 'settings', label: t('settings'), icon: Settings },
            { id: 'profile', label: t('my_profile'), icon: UserCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-gold text-dark' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-medium text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          {t('signOut')}
        </button>
      </div>
    </aside>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t('total_listings'), value: properties.length, icon: Home },
          { label: t('new_inquiries'), value: inquiries.length, icon: MessageSquare },
          { label: t('site_views'), value: '1,240', icon: Globe },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-2xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gold/10 rounded-xl">
                <stat.icon className="w-6 h-6 text-gold" />
              </div>
              <span className="text-green-500 text-[10px] uppercase tracking-widest font-bold">+12%</span>
            </div>
            <div className="text-3xl font-serif mb-1">{stat.value}</div>
            <div className="text-white/40 text-[10px] uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-2xl border border-white/5">
          <h3 className="text-lg font-serif mb-6 uppercase tracking-widest">{t('recent_inquiries')}</h3>
          <div className="space-y-4">
            {inquiries.slice(0, 5).map((inquiry) => (
              <div key={inquiry.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <div className="text-sm font-medium">{inquiry.name}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">{inquiry.email}</div>
                </div>
                <button onClick={() => setActiveTab('inquiries')} className="text-gold hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {inquiries.length === 0 && <p className="text-white/20 text-xs italic">No inquiries yet.</p>}
          </div>
        </div>

        <div className="glass p-8 rounded-2xl border border-white/5">
          <h3 className="text-lg font-serif mb-6 uppercase tracking-widest">{t('quick_actions')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveTab('properties')} className="p-6 bg-white/5 rounded-xl hover:bg-gold/10 transition-all text-left group">
              <Plus className="w-6 h-6 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-xs uppercase tracking-widest font-bold">{t('add_property')}</div>
            </button>
            <button onClick={() => setActiveTab('settings')} className="p-6 bg-white/5 rounded-xl hover:bg-gold/10 transition-all text-left group">
              <Settings className="w-6 h-6 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-xs uppercase tracking-widest font-bold">{t('site_settings')}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInquiries = () => (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40">{t('client')}</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40">{t('contact')}</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40">{t('date')}</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40">{t('message')}</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4">
                <div className="text-sm font-medium">{inquiry.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-xs text-white/60">{inquiry.email}</div>
                <div className="text-[10px] text-white/40">{inquiry.phone}</div>
              </td>
              <td className="px-6 py-4 text-xs text-white/60">
                {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleDateString() : 'Recent'}
              </td>
              <td className="px-6 py-4">
                <p className="text-xs text-white/40 line-clamp-1 max-w-xs">{inquiry.notes || 'No notes provided'}</p>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => handleDeleteInquiry(inquiry.id!)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {inquiries.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">No inquiries found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderAboutEditor = () => (
    <form onSubmit={handleSaveAbout} className="glass p-8 rounded-2xl border border-white/5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('title')}</label>
            <input 
              type="text" 
              value={aboutContent.title}
              onChange={(e) => setAboutContent({...aboutContent, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Subtitle</label>
            <input 
              type="text" 
              value={aboutContent.subtitle}
              onChange={(e) => setAboutContent({...aboutContent, subtitle: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('description')}</label>
            <textarea 
              rows={8}
              value={aboutContent.description}
              onChange={(e) => setAboutContent({...aboutContent, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm resize-none" 
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('images')}</label>
            <input 
              type="url" 
              value={aboutContent.image}
              onChange={(e) => setAboutContent({...aboutContent, image: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
          {aboutContent.image && (
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
              <img src={aboutContent.image} alt="About Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-gold text-dark px-10 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {t('save_content')}
        </button>
      </div>
    </form>
  );

  const renderSettingsEditor = () => (
    <form onSubmit={handleSaveSettings} className="glass p-8 rounded-2xl border border-white/5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('name')}</label>
            <input 
              type="text" 
              value={siteSettings.siteName}
              onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('email')}</label>
            <input 
              type="email" 
              value={siteSettings.contactEmail}
              onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('phone')}</label>
            <input 
              type="text" 
              value={siteSettings.contactPhone}
              onChange={(e) => setSiteSettings({...siteSettings, contactPhone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Hero Image URL</label>
            <input 
              type="url" 
              value={siteSettings.heroImageUrl || ''}
              onChange={(e) => setSiteSettings({...siteSettings, heroImageUrl: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Social Media Links</h4>
          {['instagram', 'linkedin', 'twitter'].map((platform) => (
            <div key={platform} className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-white/20 ml-4">{platform}</label>
              <input 
                type="url" 
                value={siteSettings.socialLinks?.[platform] || ''}
                onChange={(e) => setSiteSettings({
                  ...siteSettings, 
                  socialLinks: { ...siteSettings.socialLinks, [platform]: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-gold text-dark px-10 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {t('save_settings')}
        </button>
      </div>
    </form>
  );

  const renderProfileEditor = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={handleUpdateProfile} className="glass p-8 rounded-2xl border border-white/5 space-y-6">
        <h3 className="text-lg font-serif uppercase tracking-widest mb-4">{t('my_profile')}</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('name')}</label>
            <input 
              type="text" 
              value={profileData.displayName}
              onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('email')}</label>
            <input 
              disabled
              type="email" 
              value={profileData.email}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/20 text-sm cursor-not-allowed" 
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full bg-gold text-dark py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {t('update_profile')}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="glass p-8 rounded-2xl border border-white/5 space-y-6">
        <h3 className="text-lg font-serif uppercase tracking-widest mb-4">{t('change_password')}</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('current_password')}</label>
            <input 
              required
              type="password" 
              value={profileData.currentPassword}
              onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('new_password')}</label>
            <input 
              required
              type="password" 
              value={profileData.newPassword}
              onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors text-sm" 
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full border border-gold/30 text-gold py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-dark transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          {t('change_password')}
        </button>
      </form>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif uppercase tracking-widest">Property Listings</h2>
        <button 
          onClick={() => {
            setCurrentProperty({
              title: '', location: '', price: '', beds: 0, baths: 0, sqft: '', image: '', description: '', amenities: [], gallery: []
            });
            setIsEditing(true);
          }}
          className="bg-gold text-dark px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center glass rounded-2xl">
          <AlertCircle className="w-12 h-12 text-white/20 mb-4" />
          <h2 className="text-xl font-serif mb-2">No properties found</h2>
          <button onClick={async () => {
            setIsSaving(true);
            await seedProperties(INITIAL_PROPERTIES);
            fetchAllData();
            setIsSaving(false);
          }} className="text-gold border border-gold/30 px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-dark transition-all">
            Seed Initial Data
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="glass rounded-2xl overflow-hidden group border border-white/5 hover:border-gold/30 transition-colors">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => { setCurrentProperty(property); setIsEditing(true); }} className="bg-dark/60 backdrop-blur-md p-2 rounded-full hover:bg-gold hover:text-dark transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={async () => { if(window.confirm("Delete?")) { await deleteProperty(property.id!); fetchAllData(); } }} className="bg-dark/60 backdrop-blur-md p-2 rounded-full hover:bg-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif mb-1 uppercase tracking-tight">{property.title}</h3>
                <div className="text-gold font-serif">{property.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif uppercase tracking-widest">{t('testimonials')}</h2>
        <button 
          onClick={() => {
            setCurrentTestimonial({ name: '', role: '', content: '', rating: 5, image: '' });
            setIsEditingTestimonial(true);
          }}
          className="bg-gold text-dark px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('add_testimonial')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="glass p-8 rounded-2xl border border-white/5 relative group">
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => { setCurrentTestimonial(testimonial); setIsEditingTestimonial(true); }}
                className="bg-dark/60 backdrop-blur-md p-2 rounded-full hover:bg-gold hover:text-dark transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={async () => { 
                  if(window.confirm("Delete this testimonial?")) { 
                    await deleteTestimonial(testimonial.id!); 
                    fetchAllData(); 
                  } 
                }}
                className="bg-dark/60 backdrop-blur-md p-2 rounded-full hover:bg-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gold/20 bg-gold/5 shrink-0">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold font-serif text-xl border border-gold/30">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="font-serif text-lg">{testimonial.name}</div>
                <div className="text-[10px] text-gold uppercase tracking-widest">{testimonial.role}</div>
              </div>
            </div>

            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < testimonial.rating ? 'text-gold fill-gold' : 'text-white/20'}`} />
              ))}
            </div>

            <p className="text-white/60 text-sm italic leading-relaxed">"{testimonial.content}"</p>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-center glass rounded-2xl border border-white/5">
            <MessageSquare className="w-12 h-12 text-white/20 mb-4" />
            <h2 className="text-xl font-serif mb-2">No testimonials yet</h2>
            <p className="text-white/40 text-sm">Add your first client success story.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] bg-dark flex">
      {renderSidebar()}
      {/* ... rest of the existing return remains the same ... */}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-dark/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-serif uppercase tracking-widest">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium">{auth.currentUser?.displayName || 'Admin'}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Administrator</div>
              </div>
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center border border-gold/30">
                <UserCircle className="w-6 h-6 text-gold" />
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:text-gold transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'dashboard' && renderDashboard()}
                  {activeTab === 'properties' && renderProperties()}
                  {activeTab === 'inquiries' && renderInquiries()}
                  {activeTab === 'testimonials' && renderTestimonials()}
                  {activeTab === 'about' && renderAboutEditor()}
                  {activeTab === 'settings' && renderSettingsEditor()}
                  {activeTab === 'profile' && renderProfileEditor()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>

      {/* Property Edit Modal (Keep existing logic but simplified) */}
      <AnimatePresence>
        {isEditing && currentProperty && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-dark/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-4xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              <header className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-serif uppercase tracking-widest">{currentProperty.id ? 'Edit Property' : 'New Property'}</h2>
                <button onClick={() => setIsEditing(false)} className="hover:text-gold transition-colors"><X className="w-6 h-6" /></button>
              </header>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                try {
                  if (currentProperty.id) await updateProperty(currentProperty.id, currentProperty);
                  else await addProperty(currentProperty as any);
                  setIsEditing(false);
                  fetchAllData();
                  setMessage({ type: 'success', text: 'Property saved successfully' });
                } catch (error) {
                  setMessage({ type: 'error', text: 'Failed to save property' });
                } finally {
                  setIsSaving(false);
                }
              }} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Property Title</label>
                      <input required type="text" value={currentProperty.title || ''} onChange={(e) => setCurrentProperty({...currentProperty, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" placeholder="e.g. The Glass Pavilion" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Location</label>
                      <input required type="text" value={currentProperty.location || ''} onChange={(e) => setCurrentProperty({...currentProperty, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" placeholder="e.g. Beverly Hills, CA" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Price</label>
                      <input required type="text" value={currentProperty.price || ''} onChange={(e) => setCurrentProperty({...currentProperty, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" placeholder="e.g. $12,500,000" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Beds</label>
                        <input required type="number" value={currentProperty.beds || 0} onChange={(e) => setCurrentProperty({...currentProperty, beds: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Baths</label>
                        <input required type="number" value={currentProperty.baths || 0} onChange={(e) => setCurrentProperty({...currentProperty, baths: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Sqft</label>
                        <input required type="text" value={currentProperty.sqft || ''} onChange={(e) => setCurrentProperty({...currentProperty, sqft: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Main Image URL</label>
                      <input required type="url" value={currentProperty.image || ''} onChange={(e) => setCurrentProperty({...currentProperty, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" placeholder="https://..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Description</label>
                      <textarea required rows={4} value={currentProperty.description || ''} onChange={(e) => setCurrentProperty({...currentProperty, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm resize-none focus:border-gold outline-none" placeholder="Property details..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Amenities (comma separated)</label>
                      <input 
                        type="text" 
                        value={currentProperty.amenities?.join(', ') || ''} 
                        onChange={(e) => setCurrentProperty({...currentProperty, amenities: e.target.value.split(',').map(s => s.trim())})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" 
                        placeholder="Pool, Spa, Gym..." 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Gallery Images (comma separated URLs)</label>
                      <textarea 
                        rows={2}
                        value={currentProperty.gallery?.join(', ') || ''} 
                        onChange={(e) => setCurrentProperty({...currentProperty, gallery: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm resize-none focus:border-gold outline-none" 
                        placeholder="https://..., https://..." 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Video URL (YouTube/Vimeo/Direct)</label>
                      <input 
                        type="url" 
                        value={currentProperty.videoUrl || ''} 
                        onChange={(e) => setCurrentProperty({...currentProperty, videoUrl: e.target.value})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" 
                        placeholder="https://youtube.com/watch?v=..." 
                      />
                    </div>
                    {currentProperty.gallery && currentProperty.gallery.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {currentProperty.gallery.map((url, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group">
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button 
                              type="button"
                              onClick={() => {
                                const newGallery = currentProperty.gallery?.filter((_, i) => i !== idx);
                                setCurrentProperty({...currentProperty, gallery: newGallery});
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 uppercase tracking-widest text-[10px] font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving} className="bg-gold text-dark px-10 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {currentProperty.id ? 'Update Property' : 'Create Property'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isEditingTestimonial && currentTestimonial && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingTestimonial(false)} className="absolute inset-0 bg-dark/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-serif uppercase tracking-widest">{currentTestimonial.id ? t('edit_testimonial') : t('add_testimonial')}</h2>
                <button onClick={() => setIsEditingTestimonial(false)} className="hover:text-gold transition-colors"><X className="w-6 h-6" /></button>
              </header>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                try {
                  if (currentTestimonial.id) await updateTestimonial(currentTestimonial.id, currentTestimonial);
                  else await addTestimonial(currentTestimonial as any);
                  setIsEditingTestimonial(false);
                  fetchAllData();
                  setMessage({ type: 'success', text: 'Testimonial saved successfully' });
                } catch (error) {
                  setMessage({ type: 'error', text: 'Failed to save testimonial' });
                } finally {
                  setIsSaving(false);
                }
              }} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('client_name')}</label>
                      <input required type="text" value={currentTestimonial.name || ''} onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" placeholder="e.g. John Smith" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('client_role')}</label>
                      <input required type="text" value={currentTestimonial.role || ''} onChange={(e) => setCurrentTestimonial({...currentTestimonial, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" placeholder="e.g. Homeowner in Malibu" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('rating')} (1-5)</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          type="button"
                          onClick={() => setCurrentTestimonial({...currentTestimonial, rating: star})}
                          className={`p-2 rounded-lg transition-all ${currentTestimonial.rating === star ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-white/5 text-white/20 hover:text-white/40'}`}
                        >
                          <Star className={`w-5 h-5 ${currentTestimonial.rating! >= star ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('testimonial_content')}</label>
                    <textarea required rows={4} value={currentTestimonial.content || ''} onChange={(e) => setCurrentTestimonial({...currentTestimonial, content: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm resize-none focus:border-gold outline-none" placeholder="The service was exceptional..." />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">{t('images')} (URL)</label>
                    <input type="url" value={currentTestimonial.image || ''} onChange={(e) => setCurrentTestimonial({...currentTestimonial, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none" placeholder="https://..." />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsEditingTestimonial(false)} className="px-8 py-3 uppercase tracking-widest text-[10px] font-bold text-white/40 hover:text-white transition-colors">{t('cancel')}</button>
                  <button type="submit" disabled={isSaving} className="bg-gold text-dark px-10 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {t('save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
