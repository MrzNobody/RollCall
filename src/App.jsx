import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, MessageSquare, ChevronRight, Gamepad2, Beer, ScrollText, UsersRound, LogOut, User as UserIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Discover from './components/Discover';
import GroupDetail from './components/GroupDetail';
import CreateGroup from './components/CreateGroup';
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
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setShowAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setStep('groupDetail');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStep('hero');
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-x-hidden selection:bg-brand-secondary/30 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center text-sm font-medium">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep('hero')}>
          <Logo />
          <span className="text-xl font-bold tracking-tight">RollCall</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-white/60">
          <button onClick={() => setStep('discover')} className="hover:text-white transition-colors">Discover</button>
          <a href="#" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="hover:text-white transition-colors">Groups</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStep('createGroup')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-primary rounded-xl hover:bg-brand-primary/80 transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/20"
              >
                <Plus className="w-4 h-4" />
                Host Group
              </button>
              <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30 group relative cursor-pointer">
                <UserIcon className="w-5 h-5 text-brand-primary" />
                <div className="absolute top-12 right-0 w-48 glass p-2 rounded-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <p className="px-4 py-2 text-[10px] text-white/40 uppercase font-black truncate">{user.email}</p>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 text-rose-400 text-sm transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
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
          <motion.main 
            key="hero" variants={pageVariants} initial="initial" animate="enter" exit="exit"
            className="pt-32 pb-20 relative flex-1"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent blur-3xl -z-10 opacity-50" />
            <div className="max-w-4xl mx-auto text-center px-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-secondary text-xs font-bold mb-8">
                <span className="flex h-2 w-2 rounded-full bg-brand-secondary animate-ping" />
                PILOT LIVE IN PALM BEACH COUNTY
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Stop coordinating.<br />
                <span className="gradient-text tracking-tighter">Start playing.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                The purpose-built platform for finding and forming 
                local groups in Palm Beach County. From Valorant squads 
                to Sunday morning yoga.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={() => user ? setStep('discover') : setShowAuth(true)}
                  className="group bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95 shadow-xl"
                >
                  Find My Group
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setStep('discover')}
                  className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-md"
                >
                  Explore PBC Map
                </button>
              </div>
            </div>

            <div className="max-w-6xl mx-auto mt-32 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Gamepad2 className="w-6 h-6 text-brand-primary" />, title: "Gaming Squads", desc: "Local LAN or online ranked, filtered by platform and skill." },
                { icon: <ScrollText className="w-6 h-6 text-brand-secondary" />, title: "Tabletop RPGs", desc: "Integrated Roll20 links and recurring session management." },
                { icon: <UsersRound className="w-6 h-6 text-emerald-400" />, title: "Physical Activities", desc: "Hiking, yoga, or basketball near Palm Beach County." }
              ].map((feature, i) => (
                <motion.div 
                  key={i} whileHover={{ y: -5 }}
                  className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.main>
        )}

        {step === 'discover' && (
          <motion.main key="discover" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex-1">
            <Discover onSelectGroup={handleGroupSelect} />
          </motion.main>
        )}

        {step === 'groupDetail' && selectedGroup && (
          <motion.main key="detail" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex-1">
            <GroupDetail group={selectedGroup} onBack={() => setStep('discover')} />
          </motion.main>
        )}

        {step === 'createGroup' && (
          <motion.main key="create" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex-1">
            <CreateGroup 
              userId={user?.id} 
              onBack={() => setStep('discover')} 
              onSuccess={(newGroup) => {
                setSelectedGroup(newGroup);
                setStep('groupDetail');
              }} 
            />
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="py-12 px-12 border-t border-white/5 text-center text-white/20 text-[10px] mt-auto uppercase tracking-widest font-black">
        &copy; 2026 RollCall. Verified Secure Deployment.
      </footer>
    </div>
  );
}

export default App;
