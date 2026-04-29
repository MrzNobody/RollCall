import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, ChevronRight, X, Users, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEMO_ORGANIZERS = [
  { label: 'Marcus Webb',      email: 'marcus.webb@gmail.com',      password: 'OrgMW47!', tag: 'Gaming' },
  { label: 'Sofia Delgado',    email: 'sofia.delgado@yahoo.com',    password: 'OrgSD29#', tag: 'Sports' },
  { label: 'Priya Sharma',     email: 'priya.sharma@gmail.com',     password: 'OrgPS63*', tag: 'Tabletop' },
  { label: 'Jake Thornton',    email: 'jake.thornton@hotmail.com',  password: 'OrgJT85@', tag: 'Hiking' },
  { label: 'Camille Fontaine', email: 'camille.fontaine@gmail.com', password: 'OrgCF52!', tag: 'Arts' },
];

const DEMO_PARTICIPANTS = [
  { label: 'Ethan Baker',   email: 'ethan.baker229@yahoo.com',  password: 'PeakEB21*',  tag: 'Gaming' },
  { label: 'Kylie Nelson',  email: 'kylie.nelson829@gmail.com', password: 'WildKN53#',  tag: 'Sports' },
  { label: 'Leo Miller',    email: 'leo.miller253@hotmail.com', password: 'ChillLM82*', tag: 'Tabletop' },
  { label: 'Tyler Brooks',  email: 'tyler.brooks@gmail.com',    password: 'TylB33*',    tag: 'Gaming' },
  { label: 'Aisha Johnson', email: 'aisha.johnson@yahoo.com',   password: 'AisJ71#',    tag: 'Sports' },
];

const DemoButton = ({ account, isOrganizer = false, onLogin, loading }) => (
  <button
    onClick={() => onLogin(account)}
    disabled={loading !== null}
    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all disabled:opacity-50 group ${
      isOrganizer
        ? 'bg-brand-primary/5 border-brand-primary/20 hover:border-brand-primary/50 hover:bg-brand-primary/10'
        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
        isOrganizer ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-text-muted'
      }`}>
        {account.label.split(' ').map(w => w[0]).join('').slice(0,2)}
      </div>
      <div className="text-left">
        <div className={`text-sm font-bold transition-colors ${isOrganizer ? 'text-text-primary group-hover:text-brand-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
          {account.label}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {isOrganizer && <span className="text-[8px] font-black uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded-md">Organizer</span>}
          <span className="text-[9px] text-text-muted uppercase tracking-wider">{account.tag}</span>
        </div>
      </div>
    </div>
    {loading === account.email
      ? <Loader2 className="w-4 h-4 animate-spin text-brand-primary shrink-0" />
      : <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isOrganizer ? 'text-brand-primary/50 group-hover:text-brand-primary' : 'text-text-muted group-hover:text-text-secondary'}`} />
    }
  </button>
);

const Auth = ({ onClose, onSuccess, onViewPricing }) => {
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showDemo, setShowDemo] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      if (isSignUp) {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        // If a referral code was stored, link this new user to the referrer
        const refCode = localStorage.getItem('rollcall_ref');
        if (refCode && signUpData?.user?.id) {
          const { data: codeRow } = await supabase
            .from('referral_codes')
            .select('user_id')
            .eq('code', refCode)
            .maybeSingle();

          if (codeRow && codeRow.user_id !== signUpData.user.id) {
            await supabase.from('referrals').insert([{
              referrer_id: codeRow.user_id,
              referee_id: signUpData.user.id,
            }]);
          }
          localStorage.removeItem('rollcall_ref');
        }

        setMessage({ type: 'success', content: 'Account created! Check your email to confirm.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (account) => {
    setDemoLoading(account.email);
    setMessage({ type: '', content: '' });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });
      if (error) throw error;
      onSuccess();
    } catch (err) {
      setMessage({ type: 'error', content: `Demo login failed: ${err.message}` });
    } finally {
      setDemoLoading(null);
    }
  };

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
        className="glass w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-text-muted hover:text-text-primary transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2 text-text-primary">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          <p className="text-text-secondary text-sm">Join the Palm Beach gaming community.</p>
          {onViewPricing && (
            <button
              type="button"
              onClick={onViewPricing}
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 transition-all"
            >
              <span className="text-emerald-400">↓</span> Plans from $10/mo · View Pricing
            </button>
          )}
        </div>

        {message.content && (
          <div className={`p-4 rounded-2xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {message.content}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="email" 
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-brand-primary/50 transition-all text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="password" 
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-brand-primary/50 transition-all text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/80 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 text-white"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
            {!loading && <ChevronRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-brand-primary font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {/* Demo Accounts */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <button
            onClick={() => setShowDemo(d => !d)}
            className="w-full flex items-center justify-between text-xs font-black text-text-muted uppercase tracking-[0.15em] hover:text-text-secondary transition-colors"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Try a Demo Account
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDemo ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showDemo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-5">
                  {/* Organizers */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary px-2">Organizers</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      {DEMO_ORGANIZERS.map(account => (
                        <DemoButton key={account.email} account={account} isOrganizer onLogin={handleDemoLogin} loading={demoLoading} />
                      ))}
                    </div>
                  </div>

                  {/* Participants */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted px-2">Participants</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      {DEMO_PARTICIPANTS.map(account => (
                        <DemoButton key={account.email} account={account} onLogin={handleDemoLogin} loading={demoLoading} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
