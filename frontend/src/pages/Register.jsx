import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, ArrowRight, User, Phone, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../api';

export default function Register() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    sex: '',
    age: '',
    location: '',
    occupation: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [eventOpen, setEventOpen] = useState(true);

  useEffect(() => {
    const checkEvent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/upcoming`);
        if (res.data) setEventOpen(res.data.isOpenForRegistration);
      } catch (err) {
        console.error(err);
      }
    };
    checkEvent();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_BASE_URL}/api/applicants`, formData);
      setStatus({ type: 'success', message: t('successMsg') });
      setFormData({ fullName: '', phoneNumber: '', sex: '', age: '', location: '', occupation: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || t('errorMsg') });
    } finally {
      setLoading(false);
    }
  };

  if (!eventOpen) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center particles-bg">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-md w-full p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-brand-orange animate-gradient-x"></div>
          <div className="w-24 h-24 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 font-display">Registration Closed</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            The roster is currently full or the event is closed. Keep an eye out for the next announcement!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden particles-bg">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-brand-orange/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-brand-purple/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto w-full relative z-10"
      >
        <div className="text-center mb-12">
          <h2 className="text-sm font-black text-brand-neonBlue tracking-widest uppercase mb-3 drop-shadow-sm">{t('joinShow')}</h2>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white font-display mb-4">{t('registerNow')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto">{t('registerSub')}</p>
        </div>

        <div className="glass-card p-8 md:p-12">
          {status.message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-bold ${status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/30' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/30'}`}
            >
              {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              <p>{status.message}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2 group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-brand-purple">{t('fullName')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all font-medium" placeholder={t('fullName')} />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-brand-purple">{t('phoneNumber')}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all font-medium" placeholder="+251..." />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-brand-purple">{t('age')}</label>
                <input type="number" name="age" min="16" max="100" required value={formData.age} onChange={handleChange} className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all font-medium" placeholder="18" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{t('gender')}</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: 'Male', label: t('male') },
                    { key: 'Female', label: t('female') },
                    { key: 'Other', label: t('other') }
                  ].map(option => (
                    <label key={option.key} className={`flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 rounded-xl py-3 px-4 transition-all duration-300 ${formData.sex === option.key ? 'bg-brand-purple/10 border-brand-purple text-brand-purple dark:text-brand-neonBlue font-black shadow-[0_0_15px_rgba(138,43,226,0.3)]' : 'bg-slate-50 dark:bg-brand-dark/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-purple/50 font-bold'}`}>
                      <input type="radio" name="sex" value={option.key} required checked={formData.sex === option.key} onChange={handleChange} className="sr-only" />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-brand-purple">{t('city')}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all font-medium" placeholder={t('city')} />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors group-focus-within:text-brand-purple">{t('occupation')}</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="text" name="occupation" required value={formData.occupation} onChange={handleChange} className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all font-medium" placeholder={t('occupationPlaceholder')} />
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button type="submit" disabled={loading} className="btn-primary w-full text-xl py-5 flex items-center justify-center gap-3 cursor-pointer">
                {loading ? t('processing') : (
                  <>{t('submit')} <ArrowRight className="w-6 h-6" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
