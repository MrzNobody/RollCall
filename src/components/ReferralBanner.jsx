import React, { useState, useEffect } from 'react';
import { 
  Users, Copy, Check, Share2, 
  Sparkles, TrendingUp, UserPlus, Zap,
  Gift
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const ReferralBanner = ({ userId }) => {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(0);

  useEffect(() => {
    if (userId) fetchReferralData();
  }, [userId]);

  const fetchReferralData = async () => {
    // 1. Get referral code
    const { data: codeData } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', userId)
      .single();
    
    if (codeData) setReferralCode(codeData.code);

    // 2. Get recruitment stats
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId);
    
    setStats(count || 0);
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/join?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-primary/20 animate-pulse opacity-50" />
      
      <div className="relative glass p-8 rounded-[3rem] border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="w-20 h-20 bg-brand-primary/20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
          <Gift className="w-10 h-10 text-brand-primary" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" /> Viral Growth Active
            </span>
          </div>
          <h3 className="text-2xl font-black text-text-primary tracking-tight">Invite your PBC Neighbors</h3>
          <p className="text-sm text-text-muted font-medium max-w-md">
            Help grow your local communities! Share your unique link and earn the <span className="text-brand-primary font-bold">"Community Recruiter"</span> badge for every successful invite.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[1.5rem] border border-white/10 w-full md:w-auto">
            <div className="px-4 py-2 text-xs font-black text-text-secondary uppercase tracking-widest">
              {referralCode || 'GENERATING...'}
            </div>
            <button 
              onClick={copyToClipboard}
              className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                copied ? 'bg-emerald-500 text-white' : 'bg-brand-primary text-white hover:bg-brand-primary/80'
              }`}
            >
              {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
            </button>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-center">
                <div className="text-xl font-black text-text-primary">{stats}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-text-muted">Neighbors Recruited</div>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="text-center">
                <div className="text-xl font-black text-text-primary">+{stats * 10}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-text-muted">Trust Points</div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralBanner;
