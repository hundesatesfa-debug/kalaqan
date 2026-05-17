import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Laugh } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'nav-premium shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Laugh className="text-white w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-white">
              KALAQAN<span className="text-pink-500">.</span>
            </span>
          </Link>
          
          {/* Center Content (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <input 
                type="text" 
                placeholder={t('searchEvents')} 
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-full pl-12 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all w-64 backdrop-blur-md"
              />
            </div>
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
              {t('home')}
            </Link>
            <a href="#rules" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              {t('rules')}
            </a>
          </div>
          
          {/* Right Content (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Toggle Button */}
            <button 
              onClick={toggleLanguage} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              🌐 {language === 'en' ? 'EN' : 'AO'}
            </button>
            <Link to="/admin/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              {t('signIn')}
            </Link>
            <Link to="/register" className="btn-premium text-sm py-2.5 px-6">
              {t('joinNow')}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-bg/95 backdrop-blur-3xl border-b border-white/10 absolute w-full left-0 overflow-hidden"
          >
            <div className="px-6 pt-4 pb-8 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={t('searchEvents')} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col space-y-4 pt-4 border-t border-white/10">
                {/* Language Toggle in Mobile */}
                <button 
                  onClick={toggleLanguage} 
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-200 text-lg font-medium cursor-pointer"
                >
                  <span>Language / Afaan</span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white text-sm font-bold">
                    {language === 'en' ? 'English (EN)' : 'Afan Oromo (AO)'}
                  </span>
                </button>
                <Link onClick={() => setMobileMenuOpen(false)} to="/" className="text-lg font-medium text-white">{t('home')}</Link>
                <Link onClick={() => setMobileMenuOpen(false)} to="/admin/login" className="text-lg font-medium text-white">{t('signIn')}</Link>
                <Link onClick={() => setMobileMenuOpen(false)} to="/register" className="btn-premium text-center w-full mt-4">
                  {t('joinNow')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
