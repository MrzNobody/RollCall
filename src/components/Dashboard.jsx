import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutGrid, Users, Settings, LogOut, ChevronRight, MapPin, MessageSquare, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass p-6 rounded-3xl border border-white/5 space-y-2">
    <div className={`p-3 rounded-2xl ${color} w-fit`}>
      {icon}
    </div>
    <div className="text-2xl font-black">{value}</div>
    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{title}</div>
  </div>
);

const JoinedGroupCard = ({ group, onClick }) => (
  <div 
    onClick={onClick}
    className="glass p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group flex items-center gap-6"
  >
    <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0">
      <img src={group.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold truncate">{group.name}</h4>
      <div className="flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {group.city}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {group.members} Members</span>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
  </div>
);

const Dashboard = ({ user, onSelectGroup }) => {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('memberships')
        .select(`
          group_id,
          groups (*)
        `)
        .eq('user_id', user.id);

      if (data) {
        setJoinedGroups(data.map(m => m.groups));
      }
      setLoading(false);
    };

    fetchJoinedGroups();
  }, [user]);

  return (
    <div className="pt-24 min-h-screen bg-surface-950 px-6 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/30 rounded-full text-[10px] font-black tracking-widest uppercase">Member Dashboard</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Welcome back, <span className="gradient-text">{user?.email.split('@')[0]}</span></h1>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Groups" value={joinedGroups.length} icon={<LayoutGrid className="w-5 h-5" />} color="bg-brand-primary/20 text-brand-primary" />
          <StatCard title="Upcoming Events" value="3" icon={<Zap className="w-5 h-5" />} color="bg-brand-secondary/20 text-brand-secondary" />
          <StatCard title="Community Rank" value="Elite" icon={<Users className="w-5 h-5" />} color="bg-emerald-500/20 text-emerald-400" />
          <StatCard title="Member Since" value="Apr 2026" icon={<MessageSquare className="w-5 h-5" />} color="bg-sky-500/20 text-sky-400" />
        </div>

        {/* My Communities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight">Your Communities</h3>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{joinedGroups.length} Active memberships</span>
            </div>
            
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
                  <LayoutGrid className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/40 text-sm max-w-xs mx-auto">You haven't joined any groups in Palm Beach County yet. Start exploring the map!</p>
                <button className="bg-brand-primary px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-brand-primary/20">Explore Groups</button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-black tracking-tight">Discover More</h3>
            <div className="glass p-8 rounded-[2.5rem] border border-brand-secondary/20 bg-brand-secondary/5 space-y-4">
              <Zap className="w-8 h-8 text-brand-secondary" />
              <h4 className="font-extrabold text-lg">New in Jupiter?</h4>
              <p className="text-xs text-white/40 leading-relaxed">Based on your interests, we found 5 new groups meeting near Jupiter Inlet this weekend.</p>
              <button className="text-brand-secondary text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                See suggestions <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
