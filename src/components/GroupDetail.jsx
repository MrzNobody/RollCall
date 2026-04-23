import React, { useState } from 'react';
import { ChevronLeft, Calendar, MessageSquare, MapPin, Users, ShieldCheck, Gamepad2, ScrollText, Send, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ChatMessage = ({ user, text, time, self }) => (
  <div className={cn("flex flex-col mb-4", self ? "items-end" : "items-start")}>
    <div className="flex items-center gap-2 mb-1">
      {!self && <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold"><User className="w-3 h-3" /></div>}
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{user}</span>
      <span className="text-[10px] text-white/20">{time}</span>
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
  const [messages, setMessages] = useState([
    { user: 'Marcus', text: 'Yo! Anyone down for a casual warm-up match tonight?', time: '2:14 PM', self: false },
    { user: 'Priya', text: 'I can join after 6 PM if we have enough people.', time: '2:45 PM', self: false },
    { user: 'System', text: 'Welcome to the WPB Valorant Ranked community chat!', time: '1:00 PM', self: false, isSystem: true }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { user: 'Me', text: newMessage, time: 'Now', self: true }]);
    setNewMessage('');
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col bg-surface-950">
      {/* Header */}
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
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-secondary" />
                    Meets Weekly
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
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'chat' && (
            <div className="glass rounded-[2rem] flex flex-col h-[600px] overflow-hidden border border-white/5">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-brand-primary" />
                  <span className="font-bold">Group Chat</span>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-surface-950 bg-brand-secondary/20" />)}
                  <div className="w-6 h-6 rounded-full border border-surface-950 bg-white/5 text-[8px] flex items-center justify-center font-bold">+12</div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} {...msg} />
                ))}
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

          {activeTab === 'session info' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass p-8 rounded-3xl space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-secondary" />
                  Upcoming Session
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-black mb-1">Date</p>
                    <p className="font-bold">Saturday, April 25</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-black mb-1">Time</p>
                    <p className="font-bold">7:00 PM EST</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  We'll be meeting online for a few ranked matches. Please be on Discord 5 minutes before we start.
                </p>
              </div>
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-4">About this Group</h3>
                <p className="text-white/60 leading-relaxed">
                  {group.description} We value consistency and communication. Whether you're a Duelist main or a Controller specialist, come show us what you've got. Focus is on growth and climbing the ranks together.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border border-brand-primary/20 bg-brand-primary/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-brand-primary" />
              Requirements
            </h3>
            <ul className="space-y-3">
              {['Level 20+', 'Mic Required', 'Non-toxic', 'Discord Joined'].map(req => (
                <li key={req} className="flex items-center gap-2 text-sm text-white/70">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass p-8 rounded-3xl">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-brand-secondary">
              <ScrollText className="w-5 h-5" />
              Community Rules
            </h3>
            <p className="text-xs text-white/40 leading-relaxed italic">
              "By joining this group, you agree to the RollCall Community Standards. Respect your teammates, win or lose."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
