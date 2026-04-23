import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Calendar, MessageSquare, MapPin, Users, ShieldCheck, Gamepad2, ScrollText, Send, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ChatMessage = ({ user, text, created_at, self }) => (
  <div className={cn("flex flex-col mb-4", self ? "items-end" : "items-start")}>
    <div className="flex items-center gap-2 mb-1">
      {!self && <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold"><User className="w-3 h-3" /></div>}
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{user}</span>
      <span className="text-[10px] text-white/20">{new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div className={cn(
      "px-4 py-2 rounded-2xl text-sm max-w-[80%]",
      self ? "bg-brand-primary text-white rounded-tr-none" : "bg-white/5 border border-white/10 rounded-tl-none"
    )}>
      {text}
    </div>
  </div>
);

const GroupDetail = ({ group, onBack }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isRSVPd, setIsRSVPd] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // 1. Initial Load & Realtime Subscription
  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', group.id)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
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
  }, [group.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = {
      group_id: group.id,
      user: 'Me', // We will replace this with real auth user later
      text: newMessage,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('messages')
      .insert([tempMessage]);

    if (!error) {
      setNewMessage('');
    } else {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col bg-surface-950">
      {/* Header (Same as before but with real data) */}
      <div className="relative h-[300px] overflow-hidden">
        <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />
        
        <div className="absolute bottom-0 w-full px-6 md:px-12 pb-8">
          <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm font-bold uppercase tracking-wider">
              <ChevronLeft className="w-4 h-4" />
              Back to Discover
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-brand-primary rounded-lg text-[10px] font-bold tracking-wider uppercase">{group.category}</span>
                  <div className="flex items-center gap-1 text-brand-secondary text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    VERIFIED GROUP
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">{group.name}</h1>
                <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-secondary" />
                    {group.city}, FL
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-secondary" />
                    {group.members} / {group.capacity} Members
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsRSVPd(!isRSVPd)}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95",
                  isRSVPd ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-white/90"
                )}
              >
                {isRSVPd ? '✓ RSVP Done' : 'RSVP for Next Session'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 bg-surface-950/80 backdrop-blur-md sticky top-16 z-30 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex gap-8">
          {['Chat', 'Session Info', 'Members'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                "py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-all",
                activeTab === tab.toLowerCase() ? "border-brand-primary text-white" : "border-transparent text-white/40 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {activeTab === 'chat' && (
            <div className="glass rounded-[2rem] flex flex-col h-[600px] overflow-hidden border border-white/5">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-brand-primary" />
                  <span className="font-bold">Live Production Chat</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-white/20 text-sm italic">
                    Start the conversation...
                  </div>
                )}
                {messages.map((msg, i) => (
                  <ChatMessage key={msg.id || i} {...msg} self={msg.user === 'Me'} />
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/5 flex gap-3">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all"
                />
                <button type="submit" className="bg-brand-primary p-3 rounded-xl hover:bg-brand-primary/80 transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
          {/* ... Other tabs remain same ... */}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
