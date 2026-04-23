import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, MessageSquare, ChevronRight, Gamepad2, Beer, ScrollText, UsersRound, LogOut, User as UserIcon, Plus, LayoutDashboard, Search, Map as MapIcon, Globe, AlertTriangle, Sun, Moon, Dices, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Discover from './components/Discover';
import GroupDetail from './components/GroupDetail';
import CreateGroup from './components/CreateGroup';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';

// High-Fidelity PRD Logo: 6-Node Hexagonal Network with Center Hub
const Logo = ({ size = "md" }) => {
  const s = size === "lg" ? "w-24 h-24" : "w-10 h-10";
  return (
    <motion.div 
      whileHover={{ scale: 1.05, rotate: 5 }}
      className={`relative ${s} flex items-center justify-center cursor-pointer`}
    >
      <div className="absolute inset-0 bg-brand-primary/10 blur-xl rounded-full" />
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 filter drop-shadow-lg">
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-20" />
        <circle cx="50" cy="20" r="6" className="fill-rose-500" />
        <circle cx="76" cy="35" r="6" className="fill-orange-500" />
        <circle cx="76" cy="65" r="6" className="fill-emerald-500" />
        <circle cx="50" cy="80" r="6" className="fill-cyan-500" />
        <circle cx="24" cy="65" r="6" className="fill-blue-500" />
        <circle cx="24" cy="35" r="6" className="fill-purple-500" />
        <defs>
          <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a855f7' }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="12" fill="url(#hubGrad)" />
        <path d="M50 42 L52 48 L58 50 L52 52 L50 58 L48 52 L42 50 L48 48 Z" fill="white" className="animate-pulse" />
      </svg>
    </motion.div>
  );
};

const CategoryChip = ({ label, icon: Icon, colorClass }) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 bg-white/5 backdrop-blur-md transition-all ${colorClass}`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </motion.button>
);

function App() {
  const [step, setStep] = useState('hero');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [connError, setConnError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('rollcall-theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
    localStorage.setItem('rollcall-theme', theme);
  }, [theme]);

  useEffect(() => {
    async function init() {
      try {
        // CHECK FOR DEMO SESSION FIRST
        const demoSession = localStorage.getItem('rollcall-demo-session');
        if (demoSession) {
          setUser(JSON.parse(demoSession));
          setStep('dashboard');
          setIsInitializing(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
        if (session?.user && (step === 'hero')) setStep('dashboard');
      } catch (err) {
        setConnError('Offline Mode');
      } finally {
        setIsInitializing(false);
      }
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setShowAuth(false);
        if (step === 'hero') setStep('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [step]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <Logo size="lg" />
        <div className="mt-8 space-y-4">
          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full bg-brand-primary" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Initializing Community...</p>
        </div>
      </div>
    );
  }

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogout = async () => {
    localStorage.removeItem('rollcall-demo-session');
    await supabase.auth.signOut();
    setStep('hero');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white selection:bg-brand-secondary/30 flex flex-col font-sans transition-all duration-500">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setStep(user ? 'dashboard' : 'hero')}>
          <Logo size="md" />
          <span className="text-2xl font-black tracking-tighter leading-none bg-gradient-to-r from-rose-500 to-blue-500 bg-clip-text text-transparent">RollCall</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all group shadow-lg">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          {user ? (
            <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30 group relative cursor-pointer">
              <UserIcon className="w-5 h-5 text-brand-primary" />
              <div className="absolute top-12 right-0 w-60 glass p-3 rounded-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-[100]">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-3 px-2 border-b border-white/5 pb-2 truncate">{user.email}</p>
                <button onClick={() => setStep('dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold text-white"><LayoutDashboard className="w-4 h-4" /> My Hub</button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 font-bold mt-1"><LogOut className="w-4 h-4" /> Sign Out</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} className="bg-brand-primary text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/80 shadow-xl shadow-brand-primary/20">Sign In</button>
          )}
        </div>
      </nav>
      <AnimatePresence>{showAuth && <Auth onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}</AnimatePresence>
      <AnimatePresence mode="wait">
        {step === 'hero' && (
          <motion.main key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-40 pb-20 relative flex-1 flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl aspect-square bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent blur-3xl -z-10 opacity-30" />
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <Logo size="lg" />
              <div className="text-center md:text-left flex flex-col">
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-4 bg-gradient-to-r from-rose-500 to-blue-500 bg-clip-text text-transparent">RollCall</h1>
                <p className="text-xl md:text-2xl font-medium tracking-tight opacity-60">Find your community, explore, learn and have fun!</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-20">
              <CategoryChip label="Gaming" icon={Gamepad2} colorClass="border-rose-500/30 text-rose-500" />
              <CategoryChip label="Tabletop" icon={Dices} colorClass="border-purple-500/30 text-purple-500" />
              <CategoryChip label="Sports" icon={Trophy} colorClass="border-blue-500/30 text-blue-500" />
              <CategoryChip label="& More" icon={Sparkles} colorClass="border-orange-500/30 text-orange-500" />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button onClick={() => user ? setStep('dashboard') : setShowAuth(true)} className="bg-white text-black px-12 py-5 rounded-3xl font-black text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-2xl">Start Discovering <ChevronRight className="w-5 h-5 flex-shrink-0" /></button>
              <button onClick={() => setStep('discover')} className="bg-white/5 border border-white/10 backdrop-blur-xl px-12 py-5 rounded-3xl font-black text-sm hover:bg-white/10 transition-all text-white">View Local Map</button>
            </div>
          </motion.main>
        )}
        {step === 'dashboard' && <motion.main key="dashboard" className="flex-1 min-h-[50vh]"><Dashboard user={user} onSelectGroup={(g) => { setSelectedGroup(g); setStep('groupDetail'); }} /></motion.main>}
        {step === 'discover' && <motion.main key="discover" className="flex-1"><Discover onSelectGroup={(g) => { setSelectedGroup(g); setStep('groupDetail'); }} /></motion.main>}
        {step === 'groupDetail' && selectedGroup && <motion.main key="detail" className="flex-1"><GroupDetail group={selectedGroup} user={user} onBack={() => setStep('discover')} /></motion.main>}
        {step === 'createGroup' && <motion.main key="create" className="flex-1"><CreateGroup userId={user?.id} onBack={() => setStep('dashboard')} onSuccess={(g) => { setSelectedGroup(g); setStep('groupDetail'); }} /></motion.main>}
      </AnimatePresence>
      {step !== 'hero' && (
        <nav className="fixed bottom-0 w-full z-50 md:hidden glass border-t border-white/10 px-6 py-4 pb-12 flex justify-around items-center">
          <button onClick={() => setStep('discover')} className={`flex flex-col items-center gap-1 ${step === 'discover' ? 'text-brand-primary' : 'opacity-40 text-white'}`}><Search className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Map</span></button>
          <button onClick={() => user ? setStep('createGroup') : setShowAuth(true)} className="relative -top-8 w-16 h-16 bg-brand-primary rounded-[2rem] flex items-center justify-center shadow-2xl border-8 border-surface-950"><Plus className="w-10 h-10 text-white" /></button>
          <button onClick={() => user ? setStep('dashboard') : setShowAuth(true)} className={`flex flex-col items-center gap-1 ${step === 'dashboard' ? 'text-brand-primary' : 'opacity-40 text-white'}`}><LayoutDashboard className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Hub</span></button>
        </nav>
      )}
    </div>
  );
}

export default App;
