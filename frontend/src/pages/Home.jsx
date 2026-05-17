import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, ArrowRight, Trophy, Users, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { t } = useLanguage();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events/upcoming');
        if (res.data) setUpcomingEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    if (!upcomingEvent) return;

    const interval = setInterval(() => {
      const difference = new Date(upcomingEvent.date) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [upcomingEvent]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-600/20 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 flex items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-semibold tracking-wide text-slate-300">{t('ultimatePlatform')}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-[6rem] font-black tracking-tighter mb-8 leading-[1.1]"
          >
            <span className="block text-white">{t('heroTitleLine1')}</span>
            <span className="block text-gradient-premium">{t('heroTitleLine2')}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Link to="/register" className="btn-premium w-full sm:w-auto text-lg flex items-center justify-center gap-2">
              {t('joinNow')} <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a href="#rules" className="btn-outline w-full sm:w-auto text-lg">
              {t('rules')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Event Countdown Section */}
      {upcomingEvent && (
        <section className="relative z-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full -mt-16 mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card-premium p-8 md:p-12 relative overflow-hidden"
          >
            {/* Inner Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-[50px]"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="flex-1 text-center lg:text-left">
                <span className="text-pink-400 text-xs font-extrabold tracking-widest uppercase mb-2 block">{t('upcomingEvent')}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {upcomingEvent.title}
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-slate-400 font-medium">
                  <p className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    <Calendar className="text-purple-400 w-5 h-5" /> 
                    {new Date(upcomingEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    <MapPin className="text-pink-400 w-5 h-5" /> 
                    {upcomingEvent.location}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: t('days'), value: timeLeft.days },
                  { label: t('hours'), value: timeLeft.hours },
                  { label: t('mins'), value: timeLeft.minutes },
                  { label: t('secs'), value: timeLeft.seconds }
                ].map((time, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center w-20 h-24 md:w-28 md:h-32 bg-brand-surface border border-white/10 rounded-2xl shadow-lg">
                    <span className="text-3xl md:text-5xl font-bold text-white font-display mb-1">{time.value.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest">{time.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Rules Section */}
      <section id="rules" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black text-white mb-6">{t('rulesHeader')}</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">{t('rulesSub')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: t('rule1Title'), color: 'from-yellow-400 to-orange-500', desc: t('rule1Desc') },
              { icon: Users, title: t('rule2Title'), color: 'from-purple-400 to-pink-500', desc: t('rule2Desc') },
              { icon: Star, title: t('rule3Title'), color: 'from-blue-400 to-emerald-400', desc: t('rule3Desc') }
            ].map((rule, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="glass-card-premium p-10 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${rule.color} p-[1px] mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-brand-surface rounded-2xl flex items-center justify-center">
                    <rule.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{rule.title}</h4>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {rule.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
