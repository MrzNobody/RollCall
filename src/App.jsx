import React, { useState } from 'react';
import { Users, MapPin, Calendar, MessageSquare, ChevronRight, Gamepad2, Beer, ScrollText, UsersRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Discover from './components/Discover';
import GroupDetail from './components/GroupDetail';

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

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setStep('groupDetail');
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-x-hidden selection:bg-brand-secondary/30 flex flex-col">
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
        <button 
          onClick={() => setStep('onboarding')}
          className="bg-brand-primary px-6 py-2 rounded-full font-semibold hover:bg-brand-primary/80 transition-all active:scale-95 shadow-lg shadow-brand-primary/20"
        >
          {step === 'hero' ? 'Get Started' : 'Join Now'}
        </button>
      </nav>

      <AnimatePresence mode="wait">
        {/* Hero Section */}
        {step === 'hero' && (
          <motion.main 
            key="hero"
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="pt-32 pb-20 relative flex-1"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent blur-3xl -z-10 opacity-50" />
            
            <div className="max-w-4xl mx-auto text-center px-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-secondary text-xs font-bold mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-brand-secondary animate-ping" />
                PILOT LIVE IN PALM BEACH COUNTY
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
              >
                Stop coordinating.<br />
                <span className="gradient-text tracking-tighter">Start playing.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                The purpose-built platform for finding and forming 
                local groups for anything from ranked Valorant squads 
                to Sunday hiking at the Loxahatchee.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col md:flex-row gap-4 justify-center"
              >
                <button 
                  onClick={() => setStep('onboarding')}
                  className="group bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95"
                >
                  Find My Group
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setStep('discover')}
                  className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Explore PBC
                </button>
              </motion.div>
            </div>

            {/* Feature Grid Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="max-w-6xl mx-auto mt-32 px-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { icon: <Gamepad2 className="w-6 h-6 text-brand-primary" />, title: "Gaming Squads", desc: "Local LAN or online ranked, filtered by platform and skill." },
                { icon: <ScrollText className="w-6 h-6 text-brand-secondary" />, title: "Tabletop RPGs", desc: "Integrated Roll20 links and recurring session management." },
                { icon: <UsersRound className="w-6 h-6 text-emerald-400" />, title: "Physical Activities", desc: "Hiking, yoga, or basketball near Palm Beach County." }
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="glass p-8 rounded-3xl group hover:border-white/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.main>
        )}

        {/* Onboarding */}
        {step === 'onboarding' && (
          <motion.main 
            key="onboarding"
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="pt-32 flex items-center justify-center flex-1 px-6"
          >
            <div className="w-full max-w-2xl glass p-12 rounded-[2rem] text-center border-white/10 relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  className="h-full bg-brand-primary" 
                />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Step 1: What are you into?</h2>
              <p className="text-white/40 mb-12">We'll match you with groups in Palm Beach County.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 text-sm">
                {["FPS Gaming", "Dungeons & Dragons", "Board Games", "Hiking", "Soccer", "Book Clubs"].map(interest => (
                  <motion.button 
                    key={interest} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-brand-primary/20 hover:border-brand-primary/40 font-medium whitespace-nowrap"
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>

              <button 
                className="w-full bg-brand-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/80 transition-all shadow-xl shadow-brand-primary/20"
                onClick={() => setStep('discover')}
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.main>
        )}

        {/* Discover View */}
        {step === 'discover' && (
          <motion.main 
            key="discover"
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="flex-1"
          >
            <Discover onSelectGroup={handleGroupSelect} />
          </motion.main>
        )}

        {/* Group Detail View */}
        {step === 'groupDetail' && selectedGroup && (
          <motion.main 
            key="detail"
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="flex-1"
          >
            <GroupDetail group={selectedGroup} onBack={() => setStep('discover')} />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer */}
      {(step !== 'discover' && step !== 'groupDetail') && (
        <footer className="py-12 px-12 border-t border-white/5 text-center text-white/20 text-sm mt-auto">
          <p>&copy; 2026 RollCall. Built for ISM6405 Advanced Business Analytics.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
