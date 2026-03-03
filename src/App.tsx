import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Menu, 
  X, 
  ChevronRight, 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Settings, 
  Image as ImageIcon,
  Mail,
  Linkedin,
  Instagram,
  Facebook,
  ArrowRight,
  Package,
  FileText
} from 'lucide-react';
import { Post, Product, SiteSettings, Language } from './types';

// --- Contexts ---
const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (ko: string, en: string) => string;
}>({ lang: 'ko', setLang: () => {}, t: (k, e) => k });

// --- Components ---

const Navbar = ({ onAdminClick, settings }: { onAdminClick: () => void, settings: SiteSettings }) => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter text-teal">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.site_name} className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            settings.site_name
          )}
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#home" className="hover:text-teal transition-colors">{t('홈', 'Home')}</a>
          <a href="#about" className="hover:text-teal transition-colors">{t('회사소개', 'About')}</a>
          <a href="#portfolio" className="hover:text-teal transition-colors">{t('포트폴리오', 'Portfolio')}</a>
          <a href="#news" className="hover:text-teal transition-colors">{t('소식', 'News')}</a>
          <a href="#contact" className="hover:text-teal transition-colors">{t('문의하기', 'Contact')}</a>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="flex items-center space-x-1 hover:text-teal transition-colors"
          >
            <Globe size={18} />
            <span className="text-sm font-medium uppercase">{lang}</span>
          </button>
          <button onClick={onAdminClick} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <LayoutDashboard size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ settings }: { settings: SiteSettings }) => {
  const { t, lang } = useContext(LanguageContext);
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={settings.hero_bg_url || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1920"} 
          alt="Apparel Manufacturing" 
          className="w-full h-full object-cover opacity-50 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/60 to-navy" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          {lang === 'ko' ? settings.hero_title_ko : settings.hero_title_en}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/70"
        >
          {lang === 'ko' ? settings.hero_subtitle_ko : settings.hero_subtitle_en}
        </motion.p>
      </div>
    </section>
  );
};

const Portfolio = ({ products }: { products: Product[] }) => {
  const { t, lang } = useContext(LanguageContext);
  return (
    <section id="portfolio" className="py-24 px-6 bg-navy/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-teal font-medium mb-2 uppercase tracking-widest">{t('포트폴리오', 'Our Work')}</h2>
            <h3 className="text-4xl font-bold">{t('최근 제작 상품', 'Recent Productions')}</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image_url || 'https://picsum.photos/seed/apparel/600/400'} 
                  alt={product.name_en} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-teal text-xs font-bold px-3 py-1 rounded-full">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">{lang === 'ko' ? product.name_ko : product.name_en}</h4>
                <p className="text-white/60 text-sm line-clamp-2">
                  {lang === 'ko' ? product.description_ko : product.description_en}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FileUpload = ({ 
  label, 
  value, 
  onChange, 
  onUpload 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  onUpload?: (val: string) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        if (onUpload) onUpload(data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" />
        )}
        <div className="flex-grow relative">
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="input-field w-full pr-24" 
            placeholder="Image URL or upload file"
          />
          <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-teal hover:bg-teal-light text-white px-3 py-1 rounded-md text-xs transition-colors">
            {isUploading ? '...' : 'Upload'}
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ 
  onClose, 
  posts, 
  products, 
  settings: initialSettings, 
  onRefresh 
}: { 
  onClose: () => void;
  posts: Post[];
  products: Product[];
  settings: SiteSettings;
  onRefresh: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'products' | 'settings'>('posts');
  const [isAdding, setIsAdding] = useState(false);
  
  // Local state for settings and forms to handle file uploads correctly
  const [editSettings, setEditSettings] = useState<SiteSettings>(initialSettings);
  const [postForm, setPostForm] = useState({ title_ko: '', title_en: '', content_ko: '', content_en: '', image_url: '' });
  const [productForm, setProductForm] = useState({ name_ko: '', name_en: '', description_ko: '', description_en: '', category: '', image_url: '' });

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postForm)
    });
    setIsAdding(false);
    setPostForm({ title_ko: '', title_en: '', content_ko: '', content_en: '', image_url: '' });
    onRefresh();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm)
    });
    setIsAdding(false);
    setProductForm({ name_ko: '', name_en: '', description_ko: '', description_en: '', category: '', image_url: '' });
    onRefresh();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editSettings)
    });
    onRefresh();
    alert('Settings saved!');
  };

  const handleDelete = async (type: 'posts' | 'products', id: number) => {
    await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-navy flex">
      <div className="w-64 border-r border-white/10 p-6 flex flex-col">
        <div className="text-xl font-bold text-teal mb-12">ADMIN PANEL</div>
        <nav className="space-y-2 flex-grow">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'posts' ? 'bg-teal text-white' : 'hover:bg-white/5'}`}
          >
            <FileText size={20} /> <span>Posts</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-teal text-white' : 'hover:bg-white/5'}`}
          >
            <Package size={20} /> <span>Products</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-teal text-white' : 'hover:bg-white/5'}`}
          >
            <Settings size={20} /> <span>Settings</span>
          </button>
        </nav>
        <button onClick={onClose} className="flex items-center space-x-2 text-white/50 hover:text-white transition-colors">
          <X size={20} /> <span>Close Admin</span>
        </button>
      </div>

      <div className="flex-grow p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold capitalize">{activeTab} Management</h2>
          {activeTab !== 'settings' && (
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} /> Add New
            </button>
          )}
        </div>

        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="glass p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">{post.title_ko}</div>
                  <div className="text-white/50 text-sm">{post.title_en}</div>
                </div>
                <button onClick={() => handleDelete('posts', post.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="glass p-6 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={product.image_url} className="w-12 h-12 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-bold text-lg">{product.name_ko}</div>
                    <div className="text-white/50 text-sm">{product.category}</div>
                  </div>
                </div>
                <button onClick={() => handleDelete('products', product.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass p-8 rounded-2xl max-w-2xl">
             <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name</label>
                  <input 
                    name="site_name" 
                    type="text" 
                    value={editSettings.site_name} 
                    onChange={e => setEditSettings({...editSettings, site_name: e.target.value})}
                    className="input-field w-full" 
                  />
                </div>
                
                <FileUpload 
                  label="Logo Image" 
                  value={editSettings.logo_url} 
                  onChange={(val) => setEditSettings({...editSettings, logo_url: val})}
                />

                <div className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="text-teal font-bold uppercase tracking-widest text-xs">Hero Section</h4>
                  <FileUpload 
                    label="Hero Background Image" 
                    value={editSettings.hero_bg_url} 
                    onChange={(val) => setEditSettings({...editSettings, hero_bg_url: val})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Title (KO)</label>
                      <input 
                        value={editSettings.hero_title_ko} 
                        onChange={e => setEditSettings({...editSettings, hero_title_ko: e.target.value})}
                        className="input-field w-full" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Title (EN)</label>
                      <input 
                        value={editSettings.hero_title_en} 
                        onChange={e => setEditSettings({...editSettings, hero_title_en: e.target.value})}
                        className="input-field w-full" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Subtitle (KO)</label>
                      <textarea 
                        value={editSettings.hero_subtitle_ko} 
                        onChange={e => setEditSettings({...editSettings, hero_subtitle_ko: e.target.value})}
                        className="input-field w-full h-20" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Subtitle (EN)</label>
                      <textarea 
                        value={editSettings.hero_subtitle_en} 
                        onChange={e => setEditSettings({...editSettings, hero_subtitle_en: e.target.value})}
                        className="input-field w-full h-20" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">About Title (KO)</label>
                    <input 
                      name="about_title_ko" 
                      type="text" 
                      value={editSettings.about_title_ko} 
                      onChange={e => setEditSettings({...editSettings, about_title_ko: e.target.value})}
                      className="input-field w-full" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">About Title (EN)</label>
                    <input 
                      name="about_title_en" 
                      type="text" 
                      value={editSettings.about_title_en} 
                      onChange={e => setEditSettings({...editSettings, about_title_en: e.target.value})}
                      className="input-field w-full" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">About Content (KO)</label>
                    <textarea 
                      name="about_content_ko" 
                      value={editSettings.about_content_ko} 
                      onChange={e => setEditSettings({...editSettings, about_content_ko: e.target.value})}
                      className="input-field w-full h-32" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">About Content (EN)</label>
                    <textarea 
                      name="about_content_en" 
                      value={editSettings.about_content_en} 
                      onChange={e => setEditSettings({...editSettings, about_content_en: e.target.value})}
                      className="input-field w-full h-32" 
                    />
                  </div>
                </div>
                
                <FileUpload 
                  label="About Image" 
                  value={editSettings.about_image_url} 
                  onChange={(val) => setEditSettings({...editSettings, about_image_url: val})}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Partner Logos (JSON Array of URLs)</label>
                  <textarea 
                    name="partner_logos" 
                    value={editSettings.partner_logos} 
                    onChange={e => setEditSettings({...editSettings, partner_logos: e.target.value})}
                    className="input-field w-full h-32 font-mono text-xs" 
                  />
                  <p className="text-xs text-white/40 mt-1">Example: ["url1", "url2"]</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <input 
                      name="contact_email" 
                      type="email" 
                      value={editSettings.contact_email} 
                      onChange={e => setEditSettings({...editSettings, contact_email: e.target.value})}
                      className="input-field w-full" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Formspree URL</label>
                    <input 
                      name="formspree_url" 
                      type="text" 
                      value={editSettings.formspree_url} 
                      onChange={e => setEditSettings({...editSettings, formspree_url: e.target.value})}
                      className="input-field w-full" 
                      placeholder="https://formspree.io/f/..."
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full mt-4">Save Settings</button>
             </form>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-navy/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass p-8 rounded-3xl w-full max-w-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Add New {activeTab === 'posts' ? 'Post' : 'Product'}</h3>
                <button onClick={() => setIsAdding(false)}><X /></button>
              </div>

              {activeTab === 'posts' ? (
                <form onSubmit={handleAddPost} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Title (KO)" className="input-field" value={postForm.title_ko} onChange={e => setPostForm({...postForm, title_ko: e.target.value})} />
                    <input placeholder="Title (EN)" className="input-field" value={postForm.title_en} onChange={e => setPostForm({...postForm, title_en: e.target.value})} />
                  </div>
                  <textarea placeholder="Content (KO)" className="input-field w-full h-32" value={postForm.content_ko} onChange={e => setPostForm({...postForm, content_ko: e.target.value})} />
                  <textarea placeholder="Content (EN)" className="input-field w-full h-32" value={postForm.content_en} onChange={e => setPostForm({...postForm, content_en: e.target.value})} />
                  <FileUpload 
                    label="Post Image" 
                    value={postForm.image_url} 
                    onChange={(val) => setPostForm({...postForm, image_url: val})}
                  />
                  <button type="submit" className="btn-primary w-full">Create Post</button>
                </form>
              ) : (
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Name (KO)" className="input-field" value={productForm.name_ko} onChange={e => setProductForm({...productForm, name_ko: e.target.value})} />
                    <input placeholder="Name (EN)" className="input-field" value={productForm.name_en} onChange={e => setProductForm({...productForm, name_en: e.target.value})} />
                  </div>
                  <input placeholder="Category" className="input-field w-full" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} />
                  <textarea placeholder="Description (KO)" className="input-field w-full h-24" value={productForm.description_ko} onChange={e => setProductForm({...productForm, description_ko: e.target.value})} />
                  <textarea placeholder="Description (EN)" className="input-field w-full h-24" value={productForm.description_en} onChange={e => setProductForm({...productForm, description_en: e.target.value})} />
                  <FileUpload 
                    label="Product Image" 
                    value={productForm.image_url} 
                    onChange={(val) => setProductForm({...productForm, image_url: val})}
                  />
                  <button type="submit" className="btn-primary w-full">Create Product</button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('ko');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const fetchData = async () => {
    try {
      const [postsRes, productsRes, settingsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/products'),
        fetch('/api/settings')
      ]);
      
      if (!postsRes.ok || !productsRes.ok || !settingsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [postsData, productsData, settingsData] = await Promise.all([
        postsRes.json(),
        productsRes.json(),
        settingsRes.json()
      ]);

      setPosts(postsData);
      setProducts(productsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback settings to avoid blank screen if API fails
      setSettings({
        site_name: 'SB Gartex',
        primary_color: '#008080',
        bg_color: '#001f3f',
        font_family: 'Inter',
        contact_email: 'andy@sbgartex.com',
        logo_url: '',
        about_title_ko: '품질과 신뢰의 파트너',
        about_title_en: 'Your Partner in Quality & Trust',
        about_content_ko: '',
        about_content_en: '',
        about_image_url: '',
        partner_logos: '[]',
        hero_bg_url: '',
        hero_title_ko: '이런 마음으로 이렇게 귀하게',
        hero_title_en: 'Setting the new standard',
        hero_subtitle_ko: '',
        hero_subtitle_en: '',
        formspree_url: ''
      } as SiteSettings);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const t = (ko: string, en: string) => (lang === 'ko' ? ko : en);

  if (!settings) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="min-h-screen">
        <Navbar onAdminClick={() => setIsAdminOpen(true)} settings={settings} />
        
        <Hero settings={settings} />
        
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal/20 rounded-full blur-3xl" />
            <img 
              src={settings.about_image_url || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"} 
              className="rounded-3xl shadow-2xl relative z-10 w-full h-auto object-cover aspect-[4/3]" 
              alt="About SB Gartex"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-teal font-medium mb-2 uppercase tracking-widest">{t('회사소개', 'About Us')}</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8">{lang === 'ko' ? settings.about_title_ko : settings.about_title_en}</h3>
            <p className="text-white/70 text-lg mb-8 leading-relaxed whitespace-pre-wrap">
              {lang === 'ko' ? settings.about_content_ko : settings.about_content_en}
            </p>
            <div className="mt-12">
              <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">{t('협력 업체', 'Our Partners')}</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 items-center">
                {JSON.parse(settings.partner_logos || '[]').map((logo: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="glass p-4 rounded-xl flex items-center justify-center aspect-square"
                  >
                    <img src={logo} alt="Partner" className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Portfolio products={products} />

        <section id="news" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-teal font-medium mb-2 uppercase tracking-widest">{t('최신 소식', 'Latest News')}</h2>
            <h3 className="text-4xl font-bold">{t('SB Gartex 업데이트', 'SB Gartex Updates')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map(post => (
              <div key={post.id} className="glass p-8 rounded-3xl flex flex-col md:flex-row gap-8">
                {post.image_url && (
                  <img src={post.image_url} className="w-full md:w-40 h-40 object-cover rounded-2xl" alt="" referrerPolicy="no-referrer" />
                )}
                <div>
                  <div className="text-teal text-sm mb-2">{new Date(post.created_at).toLocaleDateString()}</div>
                  <h4 className="text-2xl font-bold mb-4">{lang === 'ko' ? post.title_ko : post.title_en}</h4>
                  <p className="text-white/60 line-clamp-3">
                    {lang === 'ko' ? post.content_ko : post.content_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="py-24 px-6 bg-teal/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-teal font-medium mb-2 uppercase tracking-widest">{t('문의하기', 'Contact')}</h2>
              <h3 className="text-4xl font-bold mb-8">{t('함께 시작해볼까요?', 'Ready to Start?')}</h3>
              <p className="text-white/70 mb-12">
                {t('귀사의 비전을 현실로 만들어드립니다. 지금 바로 문의하세요.', 'We turn your vision into reality. Contact us today.')}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center text-teal">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">{t('이메일', 'Email')}</div>
                    <div className="font-bold">{settings.contact_email}</div>
                  </div>
                </div>
              </div>
            </div>
            <form 
              action={settings.formspree_url}
              method="POST"
              onSubmit={async (e) => {
                e.preventDefault();
                setFormStatus('submitting');
                const form = e.currentTarget;
                const formData = new FormData(form);
                
                try {
                  const response = await fetch(settings.formspree_url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Accept': 'application/json'
                    }
                  });
                  
                  if (response.ok) {
                    setFormStatus('success');
                    form.reset();
                  } else {
                    setFormStatus('error');
                  }
                } catch (error) {
                  setFormStatus('error');
                }
              }}
              className="glass p-10 rounded-3xl space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('성함', 'Name')}</label>
                  <input type="text" name="name" required className="input-field w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('이메일', 'Email')}</label>
                  <input type="email" name="email" required className="input-field w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('메시지', 'Message')}</label>
                <textarea name="message" required className="input-field w-full h-32" />
              </div>
              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50"
              >
                {formStatus === 'submitting' ? t('보내는 중...', 'Sending...') : t('보내기', 'Send Message')}
              </button>
              
              {formStatus === 'success' && (
                <p className="text-teal text-center font-medium">
                  {t('메시지가 성공적으로 전송되었습니다!', 'Message sent successfully!')}
                </p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-400 text-center font-medium">
                  {t('전송 중 오류가 발생했습니다. 다시 시도해주세요.', 'An error occurred. Please try again.')}
                </p>
              )}
            </form>
          </div>
        </section>

        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-bold tracking-tighter text-teal">SB GARTEX</div>
            <div className="text-white/40 text-sm">
              © 2024 SB Gartex. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="hover:text-teal transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-teal transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-teal transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {isAdminOpen && (
            <AdminDashboard 
              onClose={() => setIsAdminOpen(false)} 
              posts={posts}
              products={products}
              settings={settings}
              onRefresh={fetchData}
            />
          )}
        </AnimatePresence>
      </div>
    </LanguageContext.Provider>
  );
}
