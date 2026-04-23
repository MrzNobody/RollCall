import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, MessageSquare, ChevronRight, Gamepad2, Beer, ScrollText, UsersRound, LogOut, User as UserIcon, Plus, LayoutDashboard, Search, Map as MapIcon, Globe, AlertTriangle, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Discover from './components/Discover';
import GroupDetail from './components/GroupDetail';
import CreateGroup from './components/CreateGroup';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';

const Logo = () => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer"
  >
    <div className="absolute inset-0 bg-brand-primary/20 blur-lg rounded-full animate-pulse" />
    <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 text-brand-primary relative z-10" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
      <circle cx="12" cy="12" r="3" className="fill-brand-secondary/40" />
      <path d="M12 2v7M12 22v-7M3.34 7l6.5 3.75M20.66 17l-6.5-3.75M3.34 17l6.5-3.75M20.66 7l-6.5 3.75" />
    </svg>
  </motion.div>
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
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
        if (session?.user && (step === 'hero')) setStep('dashboard');
      } catch (err) {
        console.error('Initialization error:', err);
        setConnError('Offline Mode');
      } finally {
        setIsInitializing(false);
      }
    }
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowAuth(false);
        if (step === 'hero') setStep('dashboard');
      }
    });
    return () => subscription.unsubscribe();
  }, [step]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <Logo />
        <div className="mt-8 space-y-4">
          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full bg-brand-primary" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Initializing...</p>
        </div>
      </div>
    );
  }

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setStep('groupDetail');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStep('hero');
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-screen bg-surface-950 text-white selection:bg-brand-secondary/30 flex flex-col font-sans transition-colors duration-500">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep(user ? 'dashboard' : 'hero')}>
          <Logo />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">RollCall</span>
            {connError && <span className="text-[8px] text-brand-secondary font-black uppercase tracking-widest mt-1">{connError}</span>}
          </div>
        </div>
        
        <div className="hidden lg:flex gap-8 items-center">
          <button onClick={() => setStep('discover')} className={`hover:text-brand-primary transition-all text-[10px] font-black uppercase tracking-widest ${step === 'discover' ? 'text-brand-primary' : 'opacity-40'}`}>Explore Events</button>
          {user && <button onClick={() => setStep('dashboard')} className={`hover:text-brand-primary transition-all text-[10px] font-black uppercase tracking-widest ${step === 'dashboard' ? 'text-brand-primary' : 'opacity-40'}`}>My Hub</button>}
          
          <div className="h-4 w-px bg-white/10 mx-2" />

          {/* New High-Visibility Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95 group"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Theme Toggle (Visible only on small screens) */}
          <button onClick={toggleTheme} className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <button onClick={() => setStep('createGroup')} className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/80 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20">
                <Plus className="w-4 h-4" /> Host Group
              </button>
              <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30 group relative cursor-pointer">
                <UserIcon className="w-5 h-5 text-brand-primary" />
                <div className="absolute top-12 right-0 w-60 glass p-3 rounded-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-[100]">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-3 px-2 border-b border-white/5 pb-2 truncate">{user.email}</p>
                  <button onClick={() => setStep('dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold"><LayoutDashboard className="w-4 h-4" /> My Hub</button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 transition-all text-xs font-bold mt-1"><LogOut className="w-4 h-4" /> Sign Out</button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} className="bg-brand-primary text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/80 transition-all active:scale-95 shadow-xl shadow-brand-primary/20">Get Started</button>
          )}
        </div>
      </nav>

      <AnimatePresence>{showAuth && <Auth onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}</AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'hero' && (
          <motion.main key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-20 relative flex-1">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent blur-3xl -z-10 opacity-50" />
            <div className="max-w-4xl mx-auto text-center px-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-secondary text-[10px] font-black tracking-[0.2em] mb-10">
                <span className="flex h-2 w-2 rounded-full bg-brand-secondary animate-ping" /> PBC PILOT LIVE
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85]">
                Stop coordinating.<br /><span className="gradient-text">Start playing.</span>
              </h1>
              <p className="text-lg md:text-xl opacity-40 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">The community software for finding groups in Palm Beach County. Build your squad, today.</p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={() => user ? setStep('dashboard') : setShowAuth(true)} className="bg-white text-black px-12 py-5 rounded-3xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">Find My Group <ChevronRight className="w-5 h-5" /></button>
                <button onClick={() => setStep('discover')} className="bg-white/5 border border-white/10 px-12 py-5 rounded-3xl font-black text-sm hover:bg-white/10 transition-all">Explore Map</button>
              </div>
            </div>
          </motion.main>
        )}
        {step === 'dashboard' && <motion.main key="dashboard" className="flex-1 min-h-[50vh]"><Dashboard user={user} onSelectGroup={handleGroupSelect} /></motion.main>}
        {step === 'discover' && <motion.main key="discover" className="flex-1"><Discover onSelectGroup={handleGroupSelect} /></motion.main>}
        {step === 'groupDetail' && selectedGroup && <motion.main key="detail" className="flex-1"><GroupDetail group={selectedGroup} user={user} onBack={() => setStep('discover')} /></motion.main>}
        {step === 'createGroup' && <motion.main key="create" className="flex-1"><CreateGroup userId={user?.id} onBack={() => setStep('dashboard')} onSuccess={(g) => { setSelectedGroup(g); setStep('groupDetail'); }} /></motion.main>}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      {step !== 'hero' && (
        <nav className="fixed bottom-0 w-full z-50 md:hidden glass border-t border-white/10 px-6 py-4 pb-12 flex justify-around items-center">
          <button onClick={() => setStep('discover')} className={`flex flex-col items-center gap-1 ${step === 'discover' ? 'text-brand-primary' : 'opacity-40'}`}><Search className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-widest">Map</span></button>
          <button onClick={() => user ? setStep('createGroup') : setShowAuth(true)} className="relative -top-8 w-16 h-16 bg-brand-primary rounded-[2rem] flex items-center justify-center shadow-2xl border-8 border-surface-950"><Plus className="w-10 h-10 text-white" /></button>
          <button onClick={() => user ? setStep('dashboard') : setShowAuth(true)} className={`flex flex-col items-center gap-1 ${step === 'dashboard' ? 'text-brand-primary' : 'opacity-40'}`}><LayoutDashboard className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-widest">Hub</span></button>
        </nav>
      )}
    </div>
  );
}

export default App;
