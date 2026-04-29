import React, { useState, useEffect } from 'react';
import { Copy, Check, Mail, Gift, Users, Star, X, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// ─── QR Modal ────────────────────────────────────────────────────────────────

const QRModal = ({ url, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="glass border border-white/10 rounded-[2.5rem] p-10 space-y-6 text-center max-w-xs w-full"
      onClick={e => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-text-muted hover:text-text-primary transition-colors">
        <X className="w-5 h-5" />
      </button>
      <div>
        <h3 className="text-lg font-black text-text-primary">Scan to Join</h3>
        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1">Share this with a friend</p>
      </div>
      <div className="bg-white p-4 rounded-2xl inline-block mx-auto">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000&margin=0`}
          alt="Referral QR Code"
          className="w-44 h-44"
        />
      </div>
      <p className="text-[10px] text-text-muted font-medium leading-relaxed">
        When your friend scans this and joins, you both get rewarded.
      </p>
    </motion.div>
  </motion.div>
);

// ─── Main Banner ─────────────────────────────────────────────────────────────

const ReferralBanner = ({ userId }) => {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ total: 0, rewarded: 0 });
  const [showQR, setShowQR] = useState(false);
  const [generating, setGenerating] = useState(false);

  const referralUrl = referralCode
    ? `${window.location.origin}?ref=${referralCode}`
    : '';

  useEffect(() => {
    if (userId) fetchReferralData();
  }, [userId]);

  const fetchReferralData = async () => {
    // 1. Try to get existing code
    let { data: codeData } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', userId)
      .maybeSingle();

    // 2. Auto-generate if none exists
    if (!codeData) {
      setGenerating(true);
      const { data: newCode } = await supabase
        .rpc('generate_referral_code_for_user', { p_user_id: userId });
      if (newCode) {
        codeData = { code: newCode };
      } else {
        // Fallback: fetch again after RPC (RPC inserts into table)
        const { data: retry } = await supabase
          .from('referral_codes')
          .select('code')
          .eq('user_id', userId)
          .maybeSingle();
        codeData = retry;
      }
      setGenerating(false);
    }

    if (codeData) setReferralCode(codeData.code);

    // 3. Get referral stats
    const { data: referrals } = await supabase
      .from('referrals')
      .select('id, rewarded_at')
      .eq('referrer_id', userId);

    if (referrals) {
      setStats({
        total: referrals.length,
        rewarded: referrals.filter(r => r.rewarded_at).length,
      });
    }
  };

  const copyLink = () => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const emailShare = () => {
    if (!referralUrl) return;
    const subject = encodeURIComponent('Join me on RollCall — Palm Beach County\'s community hub!');
    const body = encodeURIComponent(
      `Hey!\n\nI've been using RollCall to find gaming groups, sports meetups, and local events right here in Palm Beach County — and I think you'd love it.\n\nUse my personal invite link to join and we both get a free month:\n\n${referralUrl}\n\nSee you on the map!\n`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  const pendingMonths = stats.total - stats.rewarded;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/15 via-transparent to-brand-secondary/10 pointer-events-none rounded-[3rem]" />

        <div className="relative glass p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-xl shadow-brand-primary/30">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-[8px] font-black uppercase tracking-widest">
                  Earn Free Months
                </span>
              </div>
              <h3 className="text-2xl font-black text-text-primary tracking-tight">Invite a Friend</h3>
              <p className="text-sm text-text-muted font-medium max-w-lg leading-relaxed">
                Know someone who'd love finding local gaming groups, sports meetups, or events nearby?
                Send them your personal invite — when they join, <span className="text-brand-primary font-bold">you both earn a free month</span> on RollCall.
              </p>
            </div>
          </div>

          {/* Referral Code + Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Code display */}
              <div className="flex items-center gap-3 flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 min-w-0">
                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shrink-0" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary truncate">
                  {generating ? 'Generating code…' : (referralUrl || 'Loading…')}
                </span>
              </div>

              {/* Copy */}
              <button
                title="Copy invite link to clipboard"
                onClick={copyLink}
                disabled={!referralCode}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-brand-primary text-white hover:bg-brand-primary/80 shadow-lg shadow-brand-primary/20 disabled:opacity-40'
                }`}
              >
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex flex-wrap gap-3">
              <button
                title="Send invite via email"
                onClick={emailShare}
                disabled={!referralCode}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
              >
                <Mail className="w-4 h-4" />
                Email a Friend
              </button>
              <button
                title="Show QR code to share in person"
                onClick={() => setShowQR(true)}
                disabled={!referralCode}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
              >
                <QrCode className="w-4 h-4" />
                Show QR Code
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-white/5">
            <div className="space-y-0.5">
              <div className="text-2xl font-black text-text-primary">{stats.total}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Friends Joined
              </div>
            </div>
            <div className="w-px bg-white/10 self-stretch" />
            <div className="space-y-0.5">
              <div className="text-2xl font-black text-emerald-400">{stats.rewarded}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                <Gift className="w-3 h-3" /> Free Months Earned
              </div>
            </div>
            {pendingMonths > 0 && (
              <>
                <div className="w-px bg-white/10 self-stretch" />
                <div className="space-y-0.5">
                  <div className="text-2xl font-black text-brand-primary">{pendingMonths}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                    <Star className="w-3 h-3" /> Months Pending
                  </div>
                </div>
              </>
            )}
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
            {[
              { step: '1', text: 'Share your unique link or QR code with a friend' },
              { step: '2', text: 'They sign up using your link and join RollCall' },
              { step: '3', text: 'You both receive one free month added to your plan' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {step}
                </div>
                <p className="text-[11px] text-text-muted font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showQR && referralUrl && (
          <QRModal url={referralUrl} onClose={() => setShowQR(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ReferralBanner;
