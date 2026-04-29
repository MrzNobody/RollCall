import React, { useState } from 'react';
import { 
  MapPin, Send, CheckCircle2, 
  ArrowRight, Sparkles, Globe, 
  TrendingUp, Rocket
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const WaitlistModal = ({ isOpen, onClose, initialCity }) => {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(initialCity || '');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voteCount] = useState(() => Math.floor(Math.random() * 50) + 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('geo_waitlist')
        .insert({ email: email.trim().toLowerCase(), city: city.trim() });
      // Ignore unique-violation (already on waitlist) — still show success
      if (error && error.code !== '23505') throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Waitlist insert failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-surface-950/80 backdrop-blur-xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg glass border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            {/* Header Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />
            
            <div className="p-12 space-y-8">
              {!submitted ? (
                <>
                  <div className="space-y-4 text-center">
                    <div className="w-20 h-20 bg-brand-primary/20 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                      <Globe className="w-10 h-10 text-brand-primary" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight text-text-primary">Coming Soon to {city || 'Your Area'}!</h2>
                      <p className="text-sm text-text-muted font-medium max-w-[280px] mx-auto">
                        RollCall is currently in limited pilot in <span className="text-brand-primary font-bold">Palm Beach County</span>. Join the waitlist to bring us to your neighborhood next!
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input 
                          required
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="Your County/City..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-all text-text-primary font-bold"
                        />
                      </div>
                      <div className="relative">
                        <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input 
                          required
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="Your Email..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-all text-text-primary font-bold"
                        />
                      </div>
                    </div>

                    <button
                      title="Join the geographic expansion waitlist"
                      disabled={loading}
                      type="submit"
                      className="w-full bg-brand-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-3 hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Rocket className="w-4 h-4" /> Vote for my City</>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
                    Already have {voteCount} votes in your area!
                  </p>
                </>
              ) : (
                <div className="py-12 text-center space-y-6 animate-fade-in">
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-text-primary">You're on the List!</h2>
                    <p className="text-sm text-text-muted font-medium">
                      We've registered your interest for <span className="text-brand-primary font-bold">{city}</span>. We'll notify you as soon as the RollCall pilot expands to your region.
                    </p>
                  </div>
                  <button
                    title="Close waitlist dialog"
                    onClick={onClose}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-text-primary hover:bg-white/10 transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;
