import React, { useState } from 'react';
import { Flag, X, AlertCircle, ShieldAlert, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const ReportModal = ({ isOpen, onClose, targetId, targetType, targetName }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    'Spam or Scam',
    'Harassment or Abuse',
    'Inappropriate Content',
    'Fake Profile / Misleading',
    'Financial Solicitation',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user?.id,
          target_id: targetId,
          target_type: targetType,
          reason: reason,
          description: description,
          status: 'pending'
        });

      if (error) throw error;
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setReason('');
        setDescription('');
      }, 2000);
    } catch (err) {
      console.error('Report Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-surface-950/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
        >
          {submitted ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-text-primary">Report Submitted</h3>
                <p className="text-text-secondary text-sm mt-2 font-bold uppercase tracking-wider">Our moderators will review this shortly.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/20 rounded-xl">
                    <Flag className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-text-primary uppercase tracking-widest text-xs">Report {targetType}</h3>
                    <p className="text-[10px] text-text-muted font-bold truncate max-w-[200px]">{targetName}</p>
                  </div>
                </div>
                <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">What is the issue?</label>
                  <div className="grid grid-cols-1 gap-2">
                    {reasons.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReason(r)}
                        className={`text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                          reason === r 
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                            : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Additional Context (Optional)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide any specific details that will help our moderators..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-text-primary h-32 focus:outline-none focus:border-brand-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                  <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" />
                  <p className="text-[9px] text-orange-500/80 font-bold leading-relaxed">
                    False reporting is a violation of our Community Standards and may lead to account restrictions.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-white/5">
                <button 
                  disabled={!reason || loading}
                  className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Submit Report <AlertCircle className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;
