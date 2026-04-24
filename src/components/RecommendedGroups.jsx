import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Users, ChevronRight, TrendingUp, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const RecommendationCard = ({ group, onSelect }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={() => onSelect(group)}
    className="min-w-[280px] md:min-w-[320px] glass p-4 rounded-[2rem] border border-white/5 hover:border-brand-primary/30 transition-all cursor-pointer group"
  >
    <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
      <img src={group.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 to-transparent" />
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <span className="px-2 py-0.5 bg-brand-primary text-white rounded-md text-[8px] font-black uppercase tracking-widest">
          {group.category}
        </span>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-text-primary truncate">{group.name}</h4>
        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black">
          <TrendingUp className="w-3 h-3" />
          98% Match
        </div>
      </div>
      
      <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-brand-secondary" />
          {group.city}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3 h-3 text-brand-secondary" />
          {group.members} Members
        </div>
      </div>
    </div>
  </motion.div>
);

const RecommendedGroups = ({ user, onSelectGroup }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Get user's profile to know interests and city
      const { data: profile } = await supabase
        .from('profiles')
        .select('primary_interest, city')
        .eq('id', user.id)
        .single();

      // Get IDs of groups the user has already joined
      const { data: memberships } = await supabase
        .from('memberships')
        .select('group_id')
        .eq('user_id', user.id);
      
      const joinedIds = memberships?.map(m => m.group_id) || [];

      // Query for recommended groups
      // Logic: Match interest OR Match city, and NOT already joined
      let query = supabase
        .from('groups')
        .select('*')
        .not('id', 'in', `(${joinedIds.length > 0 ? joinedIds.join(',') : '00000000-0000-0000-0000-000000000000'})`);

      // Attempt to match interest first
      if (profile?.primary_interest) {
        query = query.or(`category.ilike.%${profile.primary_interest}%,name.ilike.%${profile.primary_interest}%`);
      }

      const { data: groups, error } = await query.limit(5);

      if (error) throw error;
      setRecommendations(groups || []);
    } catch (err) {
      console.error('Recommendation Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && recommendations.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-secondary" />
          Recommended For You
        </h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-1">
          Explore All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide -mx-2 px-2 mask-fade-right">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="min-w-[280px] md:min-w-[320px] h-64 glass rounded-[2rem] animate-pulse" />
          ))
        ) : (
          recommendations.map(group => (
            <RecommendationCard 
              key={group.id} 
              group={group} 
              onSelect={onSelectGroup} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedGroups;
