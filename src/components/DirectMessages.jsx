import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, User, ChevronLeft, MoreVertical, 
  CheckCheck, Clock, MessageSquare, Shield, Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const MessageBubble = ({ msg, isSelf }) => (
  <div className={`flex flex-col mb-4 ${isSelf ? 'items-end' : 'items-start'}`}>
    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
      isSelf ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-text-primary rounded-tl-none'
    }`}>
      {msg.content}
    </div>
    <div className="flex items-center gap-1.5 mt-1 px-1">
      <span className="text-[9px] font-bold text-text-muted">
        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      {isSelf && <CheckCheck className="w-3 h-3 text-brand-primary" />}
    </div>
  </div>
);

const DirectMessages = ({ user, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      const channel = subscribeToMessages(activeChat.id);
      return () => supabase.removeChannel(channel);
    }
  }, [activeChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // For this demo, we'll fetch unique users the current user has messaged
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .neq('id', user.id)
        .limit(5); // Show some sample neighbors to start a chat with
      
      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      console.error('Inbox Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (targetId) => {
    const { data } = await supabase
      .from('direct_messages')
      .select('id, sender_id, receiver_id, content, created_at')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  };

  const subscribeToMessages = (targetId) => {
    return supabase
      .channel(`dm-${user.id}-${targetId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'direct_messages',
        filter: `receiver_id=eq.${user.id}` 
      }, (payload) => {
        if (payload.new.sender_id === targetId) {
          setMessages(prev => [...prev, payload.new]);
        }
      })
      .subscribe();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageObj = {
      sender_id: user.id,
      receiver_id: activeChat.id,
      content: newMessage,
    };

    const { data, error } = await supabase
      .from('direct_messages')
      .insert([messageObj])
      .select()
      .single();

    if (!error) {
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-surface-950 flex animate-fade-in lg:p-6 lg:bg-surface-950/80 lg:backdrop-blur-xl">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl mx-auto glass border border-white/10 lg:rounded-[3rem] flex overflow-hidden shadow-2xl"
      >
        {/* Sidebar */}
        <div className={`w-full lg:w-80 border-r border-white/5 flex flex-col ${activeChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-8 border-b border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-text-primary">Inbox</h2>
              <button title="Close Direct Messages" onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                <ChevronLeft className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                placeholder="Search neighbors..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conversations.map(neighbor => (
              <button
                key={neighbor.id}
                title={`Chat with ${neighbor.full_name}`}
                onClick={() => setActiveChat(neighbor)}
                className={`w-full p-4 rounded-[1.5rem] flex items-center gap-4 transition-all ${
                  activeChat?.id === neighbor.id ? 'bg-brand-primary/10 border border-brand-primary/20' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
                  {neighbor.full_name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-sm truncate text-text-primary">{neighbor.full_name}</span>
                    <span className="text-[9px] text-text-muted font-bold">12:45 PM</span>
                  </div>
                  <p className="text-[10px] text-text-muted truncate">Active now</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col bg-white/[0.02] ${!activeChat ? 'hidden lg:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-950/30 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <button title="Go back to conversations" onClick={() => setActiveChat(null)} className="lg:hidden p-2">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                    {activeChat.full_name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">{activeChat.full_name}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-text-muted uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> Encrypted
                  </div>
                  <button title="Conversation options" className="p-2 hover:bg-white/5 rounded-full"><MoreVertical className="w-5 h-5 text-text-muted" /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center space-y-4">
                    <MessageSquare className="w-12 h-12" />
                    <p className="text-sm font-medium">Say hi to your neighbor!</p>
                  </div>
                )}
                {messages.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} isSelf={msg.sender_id === user.id} />
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-white/5 bg-surface-950/30">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
                  <div className="flex-1 relative">
                    <input 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all text-text-primary"
                    />
                  </div>
                  <button title="Send your message" type="submit" className="bg-brand-primary p-4 rounded-2xl hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20 active:scale-95">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </form>
                <p className="text-center text-[9px] text-text-muted font-bold uppercase tracking-widest mt-4">
                  Rolling out end-to-end encryption for all PBC residents.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/5">
                <Shield className="w-12 h-12 text-text-muted opacity-20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-text-primary">Select a Conversation</h3>
                <p className="text-sm text-text-muted max-w-xs mx-auto font-medium">Your private messages with PBC neighbors are secure and visible only to you.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DirectMessages;
