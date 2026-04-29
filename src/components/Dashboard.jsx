import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutGrid, Users, Settings, LogOut, ChevronRight, MapPin, MessageSquare, Zap, Shield, Award, LifeBuoy, CalendarPlus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import BadgeShelf from './BadgeShelf';
import DirectMessages from './DirectMessages';
import RecommendedGroups from './RecommendedGroups';
import ReferralBanner from './ReferralBanner';
import SupportCenter from './SupportCenter';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass p-6 rounded-3xl border border-white/5 space-y-2">
    <div className={`p-3 rounded-2xl ${color} w-fit`}>
      {icon}
    </div>
    <div className="text-2xl font-black text-text-primary">{value}</div>
    <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{title}</div>
  </div>
);

const JoinedGroupCard = ({ group, onClick }) => (
  <div 
    onClick={onClick}
    className="glass p-5 rounded-3xl border border-white/5 hover:border-brand-primary/20 transition-all cursor-pointer group flex items-center gap-6"
  >
    <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0">
      <img src={group.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold truncate text-text-primary">{group.name}</h4>
      <div className="flex items-center gap-3 text-text-secondary text-[10px] font-bold uppercase tracking-wider mt-1">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {group.city}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {group.members} Members</span>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }} // In this context, just go to the group
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-muted hover:text-brand-primary transition-all"
          title="Community Forum"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </div>
);

const RANK_TIERS = [
  { min: 0, max: 0, label: 'Newcomer',    color: 'bg-slate-500/20 text-slate-400' },
  { min: 1, max: 1, label: 'Regular',     color: 'bg-teal-500/20 text-teal-400' },
  { min: 2, max: 2, label: 'Rising Star', color: 'bg-sky-500/20 text-sky-400' },
  { min: 3, max: 3, label: 'Veteran',     color: 'bg-violet-500/20 text-violet-400' },
  { min: 4, max: 5, label: 'Elite',       color: 'bg-emerald-500/20 text-emerald-400' },
  { min: 6, max: 99, label: 'Legend',     color: 'bg-amber-500/20 text-amber-400' },
];

const getRank = (badgeCount) =>
  RANK_TIERS.find(t => badgeCount >= t.min && badgeCount <= t.max) || RANK_TIERS[0];

const Dashboard = ({ user, onSelectGroup, onEnterAdmin, onEnterDiscover, isAdmin = false }) => {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch groups and badge count in parallel
        const [membershipRes, badgeRes] = await Promise.all([
          supabase.from('memberships').select('group_id').eq('user_id', user.id),
          supabase.from('user_badges').select('id').eq('user_id', user.id),
        ]);

        if (membershipRes.error) throw membershipRes.error;

        setBadgeCount(badgeRes.data?.length ?? 0);

        if (membershipRes.data && membershipRes.data.length > 0) {
          const groupIds = membershipRes.data.map(m => m.group_id);
          const { data: groups, error: gError } = await supabase
            .from('groups')
            .select('id, name, image, city, members, owner_id')
            .in('id', groupIds);

          if (gError) throw gError;
          setJoinedGroups(groups || []);
        }
      } catch (err) {
        console.error('Dashboard Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="pt-24 min-h-screen bg-surface-950 px-6 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/30 rounded-full text-[10px] font-black tracking-widest uppercase">Member Dashboard</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Welcome back, <span className="gradient-text">{user?.email.split('@')[0]}</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              title="Open Direct Messages"
              onClick={() => setShowMessages(true)}
              className="glass p-3 rounded-2xl border border-white/10 text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all relative"
            >
              <MessageSquare className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
            </button>
            <button
              title="Open Support Center & Help"
              onClick={() => setShowSupport(true)}
              className="glass p-3 rounded-2xl border border-white/10 text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all"
            >
              <LifeBuoy className="w-5 h-5" />
            </button>
            {isAdmin && (
              <button
                onClick={onEnterAdmin}
                className="glass px-6 py-3 rounded-2xl border border-brand-primary/30 text-brand-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary/10 transition-all"
              >
                <Shield className="w-4 h-4" />
                Admin Command
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Category Discovery Hub */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Explore Palm Beach Categories</h3>
            <div className="h-px flex-1 bg-white/5 ml-6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Gaming', icon: LayoutGrid, color: 'border-rose-500/30 text-rose-500', bg: 'bg-rose-500/5' },
              { label: 'Tabletop', icon: Award, color: 'border-purple-500/30 text-purple-500', bg: 'bg-purple-500/5' },
              { label: 'Sports', icon: Zap, color: 'border-blue-500/30 text-blue-500', bg: 'bg-blue-500/5' },
              { label: 'Other', icon: Shield, color: 'border-orange-500/30 text-orange-500', bg: 'bg-orange-500/5' }
            ].map(cat => (
              <motion.button
                key={cat.label}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEnterDiscover(cat.label)}
                className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] glass border-2 transition-all ${cat.color} ${cat.bg}`}
              >
                <cat.icon className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Organizer Hub — only shown to users who own at least one group */}
        {(() => {
          const ownedGroups = joinedGroups.filter(g => g.owner_id === user?.id);
          if (ownedGroups.length === 0) return null;
          return (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-xl">
                  <CalendarPlus className="w-4 h-4 text-brand-primary" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-primary">Organizer Hub</h3>
                <div className="h-px flex-1 bg-brand-primary/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ownedGroups.map(group => (
                  <div key={group.id} className="glass p-5 rounded-3xl border border-brand-primary/20 bg-brand-primary/5 flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0">
                      <img src={group.image} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-text-primary truncate">{group.name}</h4>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{group.city} · {group.members} members</p>
                    </div>
                    <button
                      title="Schedule a new session for this group"
                      onClick={() => onSelectGroup(group, 'schedule')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20 shrink-0"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Groups" value={joinedGroups.length} icon={<LayoutGrid className="w-5 h-5" />} color="bg-brand-primary/20 text-brand-primary" />
          <StatCard title="Upcoming Events" value="3" icon={<Zap className="w-5 h-5" />} color="bg-brand-secondary/20 text-brand-secondary" />
          <StatCard title="Community Rank" value={getRank(badgeCount).label} icon={<Users className="w-5 h-5" />} color={getRank(badgeCount).color} />
          <StatCard title="Member Since" value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'} icon={<MessageSquare className="w-5 h-5" />} color="bg-sky-500/20 text-sky-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Phase 3: Badge Shelf */}
            <BadgeShelf userId={user?.id} />

            {/* Phase 4: Personalized Recommendations */}
            <RecommendedGroups user={user} onSelectGroup={onSelectGroup} />

            {/* Phase 4: Viral Growth */}
            <ReferralBanner userId={user?.id} />

            <div id="communities-section" className="space-y-6">
              <h3 className="text-xl font-black tracking-tight">Your Communities</h3>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : joinedGroups.length > 0 ? (
              <div className="space-y-4">
                {joinedGroups.map(group => (
                  <JoinedGroupCard key={group.id} group={group} onClick={() => onSelectGroup(group)} />
                ))}
              </div>
            ) : (
              <div className="glass p-12 rounded-[2.5rem] border border-dashed border-white/10 text-center space-y-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <LayoutGrid className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-text-secondary text-sm max-w-xs mx-auto">You haven't joined any groups yet. Start exploring the map!</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {showMessages && (
        <DirectMessages user={user} onClose={() => setShowMessages(false)} />
      )}

      {showSupport && (
        <SupportCenter user={user} onClose={() => setShowSupport(false)} />
      )}
    </div>
  );
};

export default Dashboard;
