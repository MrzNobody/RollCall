import React, { useState, useEffect } from 'react';
import { 
  Award, Bird, MessageSquare, Calendar, 
  ThumbsUp, Trophy, Heart, Shield, 
  ChevronRight, Star, Zap, Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  'Bird': Bird,
  'MessageSquare': MessageSquare,
  'Calendar': Calendar,
  'ThumbsUp': ThumbsUp,
  'Trophy': Trophy,
  'Heart': Heart,
  'Shield': Shield
};

const BadgeCard = ({ badge, awardedAt }) => {
  const Icon = iconMap[badge.icon] || Award;
  const date = new Date(awardedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-5 rounded-3xl border border-white/5 group hover:border-brand-primary/30 transition-all text-center relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Info className="w-3 h-3 text-text-muted" />
      </div>
      
      <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 ${
        badge.category === 'merit' ? 'bg-emerald-500/20 text-emerald-500' :
        badge.category === 'early_adopter' ? 'bg-brand-primary/20 text-brand-primary' :
        'bg-brand-secondary/20 text-brand-secondary'
      }`}>
        <Icon className="w-8 h-8" />
      </div>
      
      <h4 className="text-xs font-black uppercase tracking-widest text-text-primary mb-1">{badge.name}</h4>
      <p className="text-[10px] text-text-muted font-bold">{date}</p>
      
      {/* Tooltip-like content */}
      <div className="mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-text-secondary leading-tight line-clamp-2">{badge.description}</p>
      </div>
    </motion.div>
  );
};

const BadgeShelf = ({ userId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchUserBadges();
  }, [userId]);

  const fetchUserBadges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          awarded_at,
          master_badges (*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      setBadges(data || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-primary" />
          Resident Achievements
        </h3>
        {badges.length > 0 && (
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary px-3 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
            {badges.length} Badges Earned
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 glass rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : badges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((item, i) => (
            <BadgeCard 
              key={item.master_badges.id} 
              badge={item.master_badges} 
              awardedAt={item.awarded_at} 
            />
          ))}
        </div>
      ) : (
        <div className="glass p-12 rounded-[2.5rem] border border-dashed border-white/10 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 text-text-muted" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-text-primary">Your shelf is empty</h4>
            <p className="text-xs text-text-muted max-w-xs mx-auto">Attend sessions, post in the forum, and help others to start earning your PBC badges!</p>
          </div>
          <button title="Learn how to earn badges" className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline">View Achievement Guide</button>
        </div>
      )}
    </div>
  );
};

export default BadgeShelf;
