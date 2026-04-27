import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, MessageSquare, ChevronRight, Gamepad2, Beer, ScrollText, UsersRound, LogOut, User as UserIcon, Plus, LayoutDashboard, Search, Map as MapIcon, Globe, AlertTriangle, Sun, Moon, Dices, Trophy, Sparkles, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Discover from './components/Discover';
import GroupDetail from './components/GroupDetail';
import CreateGroup from './components/CreateGroup';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import Status from './components/Status';
import FAQ from './components/FAQ';
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

const CATEGORY_INSIGHTS = {
  'Gaming': {
    title: 'Gaming Community',
    icon: Gamepad2,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    description: 'Join competitive FPS lobbies, casual RPG adventures, and local LAN parties. From West Palm to Jupiter, our gamers meet at local hubs to compete and connect.',
    events: ['Co-op Campaigns', 'Competitive Lobbies', 'Retro Gaming Nights']
  },
  'Tabletop': {
    title: 'Tabletop & RPGs',
    icon: Dices,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    description: 'Find your next D&D campaign, Magic: The Gathering tournament, or casual board game night. PBC has a thriving scene of strategy and storytelling enthusiasts.',
    events: ['D&D One-Shots', 'Strategy Tournaments', 'Board Game Socials']
  },
  'Sports': {
    title: 'Local Sports',
    icon: Trophy,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    description: 'Pickleball doubles, adult soccer leagues, and beach volleyball meetups. Whether you are pro-level or just looking for cardio, there is a court waiting for you.',
    events: ['Beach Volleyball', 'Soccer Leagues', 'Pickleball Socials']
  },
  '& More': {
    title: 'Community & Culture',
    icon: Sparkles,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    description: 'Book clubs, coding jams, art workshops, and coffee meetups. PBC is full of diverse interests beyond gaming—find your specific niche here.',
    events: ['Art Workshops', 'Coding Jams', 'Book Clubs']
  }
};

const CategoryModal = ({ category, onClose, onNavigate }) => {
  const insight = CATEGORY_INSIGHTS[category];
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviews = async () => {
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('name, members, city')
          .eq('category', category)
          .order('members', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        setPreviews(data || []);
      } catch (err) {
        console.error('Error fetching previews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreviews();
  }, [category]);

  if (!insight) return null;
  const Icon = insight.icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass w-full max-w-lg p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 ${insight.bg} blur-3xl -z-10`} />
        
        <button onClick={onClose} className="absolute top-6 right-6 text-text-muted hover:text-text-primary transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className={`p-4 rounded-2xl ${insight.bg} ${insight.color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary">{insight.title}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Live from PBC</p>
          </div>
        </div>

        <p className="text-text-secondary leading-relaxed mb-8">
          {insight.description}
        </p>

        <div className="space-y-4 mb-10">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Active Communities</h4>
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center gap-2 text-text-muted animate-pulse">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Scanning PBC...</span>
              </div>
            ) : previews.length > 0 ? (
              previews.map(group => (
                <div key={group.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-sm font-bold text-text-primary">{group.name}</span>
                  <div className="text-[9px] font-black text-text-muted uppercase tracking-tighter">
                    {group.members} RESIDENTS • {group.city}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[10px] text-text-muted font-bold italic">No groups in this category yet. Be the first to start one!</div>
            )}
          </div>
        </div>

        <button 
          onClick={() => {
            onClose();
            onNavigate('discover', category);
          }}
          className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/80 shadow-xl shadow-brand-primary/20 transition-all"
        >
          View Full Map
        </button>
      </motion.div>
    </motion.div>
  );
};

const CategoryChip = ({ label, icon: Icon, colorClass, onClick, count }) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 bg-surface-950/5 backdrop-blur-md transition-all ${colorClass}`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-[11px] font-black uppercase tracking-widest">
      {label} {count !== undefined && <span className="opacity-40 ml-1">• {count}</span>}
    </span>
  </motion.button>
);

const LatestFeed = ({ user, onAuthRequired }) => {
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('name, category, city, image, members')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setLatest(data || []);
      } catch (err) {
        console.error('Error fetching latest:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) return (
    <div className="w-full max-w-7xl mx-auto px-6 mt-12 overflow-hidden">
      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-6 px-6">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="min-w-[300px] h-60 bg-white/5 rounded-3xl border border-white/10 animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (latest.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mt-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-brand-secondary">Latest in Palm Beach County</h3>
        <div className="h-px flex-1 bg-white/5 mx-6" />
      </div>
      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-6 px-6">
        {latest.map((group, i) => (
          <motion.div 
            key={group.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => user ? null : onAuthRequired()}
            className={`min-w-[300px] glass p-4 rounded-3xl border border-white/10 group ${user ? 'cursor-pointer hover:border-brand-primary/30' : 'cursor-default'}`}
          >
            <div className="relative h-32 rounded-2xl overflow-hidden mb-4">
              <img src={group.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-2 left-2 px-2 py-1 bg-brand-primary rounded-lg text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/40">
                {group.category}
              </div>
              {!user && (
                <div className="absolute inset-0 bg-surface-950/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[8px] font-black uppercase tracking-widest text-white px-3 py-1.5 bg-black/60 rounded-full border border-white/10">Sign in to View</span>
                </div>
              )}
            </div>
            <h4 className="font-bold text-text-primary mb-1">{group.name}</h4>
            <div className="flex items-center justify-between text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              <span>{group.city}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {group.members}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [step, setStep] = useState('hero');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('category');
        
        if (error) throw error;
        
        const counts = data.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1;
          return acc;
        }, {});
        
        setCategoryCounts(counts);
      } catch (err) {
        console.error('Error fetching counts:', err);
      }
    };
    fetchCounts();
  }, []);
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
      } finally {
        setIsInitializing(false);
      }
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowAuth(false);
        // Check for admin status via email or profile flag
        if (session.user.email === 'craineri76@gmail.com') {
          setIsAdmin(true);
        }
        if (step === 'hero') setStep('dashboard');
      } else {
        setStep('hero');
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isInitializing) {
    return (
      <div data-testid="loading-screen" className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 text-center text-text-primary">
        <Logo size="lg" />
        <div className="mt-8 space-y-4">
          <div className="w-16 h-1 bg-text-muted rounded-full overflow-hidden mx-auto">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full bg-brand-primary" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Production Engine Initializing...</p>
        </div>
      </div>
    );
  }

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div data-testid="main-app" className="min-h-screen bg-surface-950 text-text-primary selection:bg-brand-secondary/30 flex flex-col font-sans transition-all duration-500">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
          setStep('hero');
          setSelectedGroup(null);
          setSelectedCategory(null);
          setActiveCategoryFilter('All');
        }}>
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
                <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest mb-3 px-2 border-b border-white/5 pb-2 truncate">{user.email}</p>
                <button onClick={() => setStep('dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold text-text-primary"><LayoutDashboard className="w-4 h-4" /> My Hub</button>
                <button onClick={() => setStep('discover')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold text-text-primary"><MapPin className="w-4 h-4" /> Discover Map</button>
                <button onClick={() => { setStep('dashboard'); setTimeout(() => { const el = document.getElementById('communities-section'); el?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold text-text-primary"><MessageSquare className="w-4 h-4" /> Community Forums</button>
                {isAdmin && <button onClick={() => setStep('status')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold text-text-primary"><Activity className="w-4 h-4 text-emerald-500" /> System Status</button>}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 font-bold mt-1"><LogOut className="w-4 h-4" /> Sign Out</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAuth(true)} className="bg-brand-primary text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/80 shadow-xl shadow-brand-primary/20">Sign In</button>
            </div>
          )}
        </div>
      </nav>
      <AnimatePresence>{showAuth && <Auth onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}</AnimatePresence>
      <AnimatePresence>{selectedCategory && <CategoryModal category={selectedCategory} onClose={() => setSelectedCategory(null)} onNavigate={(target, cat) => { setActiveCategoryFilter(cat); setStep(target); }} />}</AnimatePresence>
      {/* Main Content Router */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {step === 'hero' && (
          <div className="pt-40 pb-20 relative flex-1 flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl aspect-square bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent blur-3xl -z-10 opacity-30" />
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <Logo size="lg" />
              <div className="text-center md:text-left flex flex-col">
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-4 bg-gradient-to-r from-rose-500 to-blue-500 bg-clip-text text-transparent">RollCall</h1>
                <p className="text-xl md:text-2xl font-medium tracking-tight text-text-secondary">Find your community, explore, learn and have fun!</p>
              </div>
            </div>
            
            {/* Category Discovery Grid */}
            <div className="flex flex-wrap justify-center gap-4 mb-20 px-6">
              {[
                { label: 'Gaming', icon: Gamepad2, color: 'border-rose-500/30 text-rose-500' },
                { label: 'Tabletop', icon: Dices, color: 'border-purple-500/30 text-purple-500' },
                { label: 'Sports', icon: Trophy, color: 'border-blue-500/30 text-blue-500' },
                { label: 'Other', icon: Sparkles, color: 'border-orange-500/30 text-orange-500' }
              ].map(cat => (
                <button
                  key={cat.label}
                  onClick={() => {
                    setActiveCategoryFilter(cat.label);
                    setStep('discover');
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 bg-white/5 hover:bg-white/10 transition-all ${cat.color}`}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
                </button>
              ))}
            </div>

            <LatestFeed user={user} onAuthRequired={() => setShowAuth(true)} />

            <div className="flex flex-col md:flex-row gap-4 mt-20">
              <button onClick={() => user ? setStep('dashboard') : setShowAuth(true)} className="bg-text-primary text-surface-950 px-12 py-5 rounded-3xl font-black text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-2xl">Start Discovering <ChevronRight className="w-5 h-5 flex-shrink-0" /></button>
              <button onClick={() => user ? setStep('discover') : setShowAuth(true)} className="glass px-12 py-5 rounded-3xl font-black text-sm hover:bg-white/10 transition-all text-text-primary">View Local Map</button>
            </div>
          </div>
        )}

        {step === 'dashboard' && <Dashboard user={user} onSelectGroup={(g) => { setSelectedGroup(g); setStep('group-detail'); }} onCreateGroup={() => setStep('create-group')} onEnterDiscover={(cat) => { setActiveCategoryFilter(cat || 'All'); setStep('discover'); }} onEnterAdmin={() => setStep('admin')} />}
        {step === 'discover' && (user ? <Discover initialCategory={activeCategoryFilter} onSelectGroup={(g) => { setSelectedGroup(g); setStep('group-detail'); }} /> : <div className="flex-1 flex items-center justify-center"><button onClick={() => setShowAuth(true)} className="bg-brand-primary px-12 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl">Sign In to View Map</button></div>)}
        {step === 'create-group' && <CreateGroup onCreated={() => setStep('dashboard')} onCancel={() => setStep('dashboard')} />}
        {step === 'group-detail' && <GroupDetail group={selectedGroup} onBack={() => setStep('dashboard')} user={user} isAdmin={isAdmin} />}
        {step === 'admin' && <AdminDashboard onBack={() => setStep('dashboard')} />}
        {step === 'status' && (isAdmin ? <Status onBack={() => setStep(user ? 'dashboard' : 'hero')} /> : <div className="flex-1 flex items-center justify-center"><p className="text-rose-500 font-black uppercase tracking-widest">Unauthorized Access</p></div>)}
        {step === 'faq' && <FAQ onBack={() => setStep('hero')} />}
      </main>

      {/* Global Footer */}
      <footer className="w-full py-12 px-6 md:px-12 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <Logo size="sm" />
            <span className="text-sm font-black tracking-tighter uppercase">RollCall PBC</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex flex-col md:items-end gap-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Service Support</span>
              <a href="tel:754-757-8952" className="text-lg font-black tracking-tight text-text-primary hover:text-brand-primary transition-all">754-757-8952</a>
              <div className="flex gap-4 mt-2">
                <button onClick={() => setStep('faq')} className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-brand-primary transition-all">Platform FAQs</button>
                <button onClick={() => { setStep('dashboard'); setTimeout(() => setShowSupport(true), 100); }} className="text-[10px] font-black uppercase tracking-widest text-brand-secondary hover:text-brand-secondary/80 transition-all">Contact Support</button>
              </div>
            </div>
            {isAdmin && (
              <button onClick={() => setStep('status')} className="flex items-center gap-2 group">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-all">Systems Operational</span>
              </button>
            )}
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">© 2026 ROLLCALL PBC PILOT</span>
          </div>
        </div>
      </footer>
      {step !== 'hero' && (
        <nav className="fixed bottom-0 w-full z-50 md:hidden glass border-t border-white/10 px-6 py-4 pb-12 flex justify-around items-center">
          <button onClick={() => setStep('discover')} className={`flex flex-col items-center gap-1 ${step === 'discover' ? 'text-brand-primary' : 'opacity-40 text-white'}`}><Search className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Map</span></button>
          <button onClick={() => user ? setStep('create-group') : setShowAuth(true)} className="relative -top-8 w-16 h-16 bg-brand-primary rounded-[2rem] flex items-center justify-center shadow-2xl border-8 border-surface-950"><Plus className="w-10 h-10 text-white" /></button>
          <button onClick={() => user ? setStep('dashboard') : setShowAuth(true)} className={`flex flex-col items-center gap-1 ${step === 'dashboard' ? 'text-brand-primary' : 'opacity-40 text-white'}`}><LayoutDashboard className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Hub</span></button>
        </nav>
      )}
    </div>
  );
}

export default App;
