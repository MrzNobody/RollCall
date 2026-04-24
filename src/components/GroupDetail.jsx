import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Calendar, MessageSquare, MapPin, Users, ShieldCheck, Gamepad2, ScrollText, Send, User, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ChatMessage = ({ user, text, created_at, self }) => (
  <div className={cn("flex flex-col mb-4 animate-fade-in", self ? "items-end" : "items-start")}>
    <div className="flex items-center gap-2 mb-1">
      {!self && <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold"><User className="w-3 h-3 text-brand-primary" /></div>}
      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{user}</span>
      <span className="text-[10px] text-text-muted">{new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div className={cn(
      "px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow-sm",
      self ? "bg-brand-primary text-white rounded-tr-none" : "bg-white/5 border border-white/10 rounded-tl-none"
    )}>
      {text}
    </div>
  </div>
);

const GroupDetail = ({ group, onBack, user }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // 1. Check if user is already a member
    const checkMembership = async () => {
      const { data } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('group_id', group.id)
        .single();
      
      if (data) setIsJoined(true);
    };

    checkMembership();

    // 2. Initial Messages Load
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', group.id)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // 3. Subscribe to Realtime
    const channel = supabase
      .channel(`group-${group.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `group_id=eq.${group.id}`
      }, (payload) => {
        setMessages((current) => [...current, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [group.id, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = async () => {
    if (!user) return; // Should be handled by UI showing Login

    if (isJoined) {
      // Logic for leaving group could go here
      return;
    }

    const { error } = await supabase
      .from('memberships')
      .insert([{ user_id: user.id, group_id: group.id }]);

    if (!error) setIsJoined(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert([{
        group_id: group.id,
        user: user.email.split('@')[0], // Use email prefix as temp username
        text: newMessage,
      }]);

    if (!error) setNewMessage('');
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col bg-surface-950">
      {/* Header */}
      <div className="relative h-[350px] overflow-hidden">
        <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent" />
        
        <div className="absolute bottom-0 w-full px-6 md:px-12 pb-12">
          <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
              <ChevronLeft className="w-4 h-4" />
              Back to PBC Discover
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary border border-brand-primary/30 rounded-full text-[10px] font-black tracking-widest uppercase">{group.category}</span>
                  <div className="flex items-center gap-1.5 text-brand-secondary text-[10px] font-black tracking-widest uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    Verified PBC Group
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-text-primary">{group.name}</h1>
                <div className="flex flex-wrap items-center gap-8 text-text-secondary text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-secondary" />
                    {group.city}, FL
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-secondary" />
                    {group.members} / {group.capacity} Residents
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleJoin}
                className={cn(
                  "px-10 py-5 rounded-2xl font-black text-sm transition-all shadow-2xl active:scale-95 group relative overflow-hidden",
                  isJoined ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-white/90"
                )}
              >
                <div className="flex items-center gap-3 relative z-10">
                  {isJoined ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      MEMBERSHIP ACTIVE
                    </>
                  ) : (
                    <>
                      JOIN COMMUNITY
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-white/5 bg-surface-950/80 backdrop-blur-xl sticky top-16 z-30 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex gap-10">
          {['Chat', 'Session Info', 'Members'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                "py-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all",
                activeTab === tab.toLowerCase() ? "border-brand-primary text-text-primary" : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {activeTab === 'chat' && (
            <div className="glass rounded-[2.5rem] flex flex-col h-[650px] overflow-hidden border border-white/5 shadow-2xl">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold tracking-tight">Community Social Hub</span>
                </div>
                {!user && <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Login to participate</span>}
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
                    <MessageSquare className="w-12 h-12 mb-4" />
                    <p className="text-sm font-medium">Be the first to say hello!</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    {...msg} 
                    self={user && msg.user === user.email.split('@')[0]} 
                  />
                ))}
                <div ref={chatEndRef} />
              </div>

              {user && (
                <form onSubmit={handleSendMessage} className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message the community..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all text-text-primary placeholder:text-text-muted"
                  />
                  <button type="submit" className="bg-brand-primary p-4 rounded-2xl hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20 active:scale-95">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2rem] border border-brand-primary/20 bg-brand-primary/5">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-brand-primary" />
              Guidelines
            </h3>
            <ul className="space-y-4">
              {['Level 20+', 'Mic Required', 'Non-toxic', 'Discord Joined'].map(req => (
                <li key={req} className="flex items-center gap-3 text-xs font-medium text-text-secondary">
                  <div className="h-1 w-1 rounded-full bg-brand-primary" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass p-8 rounded-[2rem]">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-brand-secondary">
              <ScrollText className="w-5 h-5" />
              PBC Standards
            </h3>
            <p className="text-xs text-text-muted leading-relaxed italic">
              "By joining this group, you agree to the RollCall Community Standards for Palm Beach County."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
