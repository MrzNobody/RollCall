import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, MessageSquare, ChevronRight, Gamepad2, Beer, ScrollText, UsersRound, LogOut, User as UserIcon, Plus, LayoutDashboard } from 'lucide-react';
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
    className="relative w-10 h-10 flex items-center justify-center cursor-pointer"
  >
    <div className="absolute inset-0 bg-brand-primary/20 blur-lg rounded-full animate-pulse" />
    <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand-primary relative z-10" fill="none" stroke="currentColor" strokeWidth="2">
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user && (step === 'hero' || step === 'onboarding')) {
        setStep('dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowAuth(false);
        if (step === 'hero') setStep('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [step]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setStep('groupDetail');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStep('hero');
  };

  const pageVariants = {
    initial: { opacity: 0, x: 10 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-x-hidden selection:bg-brand-secondary/30 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center text-sm font-medium">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep(user ? 'dashboard' : 'hero')}>
          <Logo />
          <span className="text-xl font-bold tracking-tight">RollCall</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-white/40">
          <button onClick={() => setStep('discover')} className={cn("hover:text-white transition-colors", step === 'discover' && "text-white")}>Discover</button>
          {user && <button onClick={() => setStep('dashboard')} className={cn("hover:text-white transition-colors", step === 'dashboard' && "text-white")}>My Hub</button>}
          <a href="#" className="hover:text-white transition-colors">How it Works</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStep('createGroup')}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-brand-primary rounded-xl hover:bg-brand-primary/80 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20"
              >
                <Plus className="w-4 h-4" />
                Host Group
              </button>
              <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30 group relative cursor-pointer">
                <UserIcon className="w-5 h-5 text-brand-primary" />
                <div className="absolute top-12 right-0 w-56 glass p-2 rounded-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Signed in as</p>
                    <p className="text-xs font-bold truncate text-brand-primary">{user.email}</p>
                  </div>
                  <div className="p-1 space-y-1">
                    <button onClick={() => setStep('dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold">
                      <LayoutDashboard className="w-4 h-4" />
                      Member Hub
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 transition-all text-xs font-bold">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuth(true)}
              className="bg-brand-primary px-6 py-2 rounded-full font-semibold hover:bg-brand-primary/80 transition-all active:scale-95 shadow-lg shadow-brand-primary/20"
            >
              Get Started
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {showAuth && <Auth onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'hero' && (
          <motion.main key="hero" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="pt-32 pb-20 relative flex-1">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent blur-3xl -z-10 opacity-50" />
            <div className="max-w-4xl mx-auto text-center px-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-secondary text-[10px] font-black tracking-[0.2em] mb-10">
                <span className="flex h-2 w-2 rounded-full bg-brand-secondary animate-ping" />
                PILOT LIVE IN PALM BEACH COUNTY
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                Stop coordinating.<br />
                <span className="gradient-text">Start playing.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                The purpose-built community platform for finding and forming 
                groups in Palm Beach County. From local squads to hobbyists.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={() => user ? setStep('dashboard') : setShowAuth(true)}
                  className="group bg-white text-black px-10 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95 shadow-2xl"
                >
                  Find My Group
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setStep('discover')}
                  className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl font-black text-sm hover:bg-white/10 transition-all backdrop-blur-md"
                >
                  Explore Mapping
                </button>
              </div>
            </div>
          </motion.main>
        )}

        {step === 'dashboard' && (
          <motion.main key="dashboard" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex-1">
            <Dashboard user={user} onSelectGroup={handleGroupSelect} />
          </motion.main>
        )}

        {step === 'discover' && (
          <motion.main key="discover" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex-1">
            <Discover onSelectGroup={handleGroupSelect} />
          </motion.main>
        )}

        {step === 'groupDetail' && selectedGroup && (
          <motion.main key="detail" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex-1">
            <GroupDetail group={selectedGroup} user={user} onBack={() => setStep('discover')} />
          </motion.main>
        )}

        {step === 'createGroup' && (
          <motion.main key="create" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex-1">
            <CreateGroup 
              userId={user?.id} 
              onBack={() => setStep('dashboard')} 
              onSuccess={(newGroup) => {
                setSelectedGroup(newGroup);
                setStep('groupDetail');
              }} 
            />
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="py-12 px-12 border-t border-white/5 text-center text-white/20 text-[10px] mt-auto uppercase tracking-widest font-black">
        &copy; 2026 RollCall. Professional Community Software.
      </footer>
    </div>
  );
}

export default App;
