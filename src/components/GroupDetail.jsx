import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MessageSquare, MapPin, Users, ShieldCheck, ScrollText, Send, User, CheckCircle2, Flag, HelpCircle, Camera, X, Loader2, Link } from 'lucide-react';
import ReportModal from './ReportModal';
import Forum from './Forum';
import CalendarView from './CalendarView';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ONLINE_CATEGORIES = new Set([
  'FPS Gaming', 'Battle Royale', 'MOBA', 'MMO / RPG', 'Card Games',
  'Strategy Games', 'Fighting Games', 'Indie Games', 'Simulation',
]);

const OUTDOOR_CATEGORIES = new Set([
  'Soccer', 'Pickleball', 'Hiking', 'Basketball', 'Tennis', 'Volleyball',
  'Running', 'Cycling', 'Flag Football', 'Ultimate Frisbee', 'Softball',
]);

const TABLETOP_CATEGORIES = new Set([
  'Dungeons & Dragons', 'Board Games', 'Tabletop RPG', 'Card Games (Tabletop)',
  'Wargaming', 'Chess',
]);

const getGroupGuidelines = (group) => {
  const cat = group?.category || '';
  const isOnline = group?.city === 'Online' || ONLINE_CATEGORIES.has(cat);
  const isOutdoor = OUTDOOR_CATEGORIES.has(cat);
  const isTabletop = TABLETOP_CATEGORIES.has(cat);
  const skill = group?.skill;

  if (isOnline) {
    return [
      skill && skill !== 'Casual' ? `${skill} skill level` : 'All skill levels welcome',
      'Mic required',
      'Non-toxic environment',
      'Discord server joined',
    ].filter(Boolean);
  }
  if (isOutdoor) {
    return [
      'RSVP before showing up',
      'Arrive on time',
      'Bring your own gear',
      'Non-toxic — good vibes only',
    ];
  }
  if (isTabletop) {
    return [
      'Know the basic rules',
      'RSVP so we have enough seats',
      'Arrive ready to play',
      'Non-toxic — respectful play',
    ];
  }
  // Default / Other
  return [
    'RSVP before joining',
    'Respectful to all members',
    'Non-toxic environment',
    skill && skill !== 'Casual' ? `${skill} skill level` : null,
  ].filter(Boolean);
};

// ─── Image Edit Modal ────────────────────────────────────────────────────────

const ImageEditModal = ({ groupId, currentImage, onClose, onSaved }) => {
  const [preview, setPreview] = useState(currentImage || '');
  const [urlInput, setUrlInput] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = React.useRef(null);

  const applyFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { setError('Please select an image file (JPG, PNG, WebP, GIF).'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setError('');
    setFile(f);
    setUrlInput('');
    setPreview(URL.createObjectURL(f));
  };

  const onFileInput = (e) => applyFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    applyFile(e.dataTransfer.files?.[0]);
  };

  const onUrlChange = (e) => {
    const v = e.target.value;
    setUrlInput(v);
    setFile(null);
    setPreview(v);
    setError('');
  };

  const handleSave = async () => {
    if (!file && !urlInput.trim()) { setError('Choose a file or paste a URL.'); return; }
    setLoading(true);
    setError('');
    try {
      let finalUrl = urlInput.trim();

      if (file) {
        setProgress('Uploading image…');
        const ext = file.name.split('.').pop();
        const path = `groups/${groupId}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('group-images')
          .upload(path, file, { upsert: true, contentType: file.type });
        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage.from('group-images').getPublicUrl(path);
        finalUrl = urlData.publicUrl;
      }

      setProgress('Saving…');
      const { error: dbErr } = await supabase
        .from('groups')
        .update({ image: finalUrl })
        .eq('id', groupId);
      if (dbErr) throw dbErr;

      onSaved(finalUrl);
      onClose();
    } catch (e) {
      console.error(e);
      setError(e.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />

        <div className="p-8 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-text-primary flex items-center gap-3">
              <Camera className="w-5 h-5 text-brand-primary" />
              Update Group Photo
            </h2>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all overflow-hidden ${
              isDragging
                ? 'border-brand-primary bg-brand-primary/10 scale-[1.01]'
                : 'border-white/20 hover:border-brand-primary/50 hover:bg-white/5'
            }`}
            style={{ minHeight: preview ? 0 : '10rem' }}
          >
            {preview ? (
              <div className="relative h-44">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => { setPreview(''); setError('Could not load that URL — check the link.'); }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Camera className="w-8 h-8" />
                    <span className="text-xs font-black uppercase tracking-widest">Change Photo</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
                {file && (
                  <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-widest text-white/80">
                    {file.name} · {(file.size / 1024).toFixed(0)} KB
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <p className="text-sm font-black text-text-primary">Drop an image here</p>
                  <p className="text-xs text-text-muted mt-1">or click to browse your files</p>
                </div>
                <p className="text-[10px] text-text-muted">JPG, PNG, WebP, GIF · Max 5 MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onFileInput}
          />

          {/* Browse button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-text-secondary transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Browse Files
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">or paste a URL</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* URL input */}
          <input
            value={urlInput}
            onChange={onUrlChange}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all placeholder:text-text-muted"
          />

          {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || (!file && !urlInput.trim())}
              className="px-8 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-40 flex items-center gap-2 min-w-[140px] justify-center"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />{progress || 'Working…'}</>
                : <><Camera className="w-4 h-4" />Save Photo</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatMessage = ({ user_id, content, created_at, self }) => (
  <div className={cn("flex flex-col mb-4 animate-fade-in", self ? "items-end" : "items-start")}>
    <div className="flex items-center gap-2 mb-1">
      {!self && <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold"><User className="w-3 h-3 text-brand-primary" /></div>}
      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{user_id?.slice(0, 8)}</span>
      <span className="text-[10px] text-text-muted">{new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div className={cn(
      "px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow-sm",
      self ? "bg-brand-primary text-white rounded-tr-none" : "bg-white/5 border border-white/10 rounded-tl-none"
    )}>
      {content}
    </div>
  </div>
);

const GroupDetail = ({ group, onBack, user, isAdmin = false }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [showImageEdit, setShowImageEdit] = useState(false);
  const [groupImage, setGroupImage] = useState(group.image);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // 1. Check if user is already a member
    const checkMembership = async () => {
      const { data } = await supabase
        .from('memberships')
        .select('id, user_id, role')
        .eq('user_id', user.id)
        .eq('group_id', group.id)
        .maybeSingle();

      if (data) setIsJoined(true);
    };

    checkMembership();

    // 2. Initial Messages Load
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, user_id, content, created_at')
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
        user_id: user.id,
        content: newMessage,
      }]);

    if (!error) setNewMessage('');
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col bg-surface-950">
      {/* Header */}
      <div className="relative h-[350px] overflow-hidden">
        <img src={groupImage} alt={group.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent" />
        {isAdmin && (
          <button
            onClick={() => setShowImageEdit(true)}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-brand-primary/80 hover:border-brand-primary transition-all shadow-lg"
          >
            <Camera className="w-4 h-4" />
            Edit Photo
          </button>
        )}
        
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
          {['Chat', 'Forum', 'Schedule', 'Rules & FAQ'].map(tab => (
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
                    self={user && msg.user_id === user.id}
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

          {activeTab === 'forum' && (
            <Forum groupId={group.id} user={user} />
          )}

          {activeTab === 'schedule' && (
            <CalendarView groupId={group.id} user={user} />
          )}

          {activeTab === 'rules & faq' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-10">
                <section className="space-y-6">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-brand-primary" />
                    Community Standards
                  </h3>
                  <div className="p-8 bg-brand-primary/5 border border-brand-primary/10 rounded-[2rem] space-y-4">
                    <p className="text-sm text-text-primary leading-relaxed font-medium italic">
                      "To ensure a safe and competitive environment for all Palm Beach County residents, members of {group.name} agree to the following standards:"
                    </p>
                    <div className="space-y-3">
                      {group.rules ? (
                        group.rules.split('.').filter(r => r.trim()).map((rule, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="w-6 h-6 bg-brand-primary/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-black text-brand-primary">{i + 1}</span>
                            </div>
                            <p className="text-xs text-text-muted font-medium leading-relaxed">{rule.trim()}.</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 bg-brand-primary/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-black text-brand-primary">1</span>
                            </div>
                            <p className="text-xs text-text-muted font-medium leading-relaxed">Residents first. This group is for the Palm Beach community. Keep interactions local and relevant.</p>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 bg-brand-primary/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-black text-brand-primary">2</span>
                            </div>
                            <p className="text-xs text-text-muted font-medium leading-relaxed">Intergenerational Respect. We have members of all ages. Maintain a professional and helpful tone at all times.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-brand-primary" />
                    Frequently Asked Questions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.faq && group.faq.length > 0 ? (
                      group.faq.map((item, i) => (
                        <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                          <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-brand-primary" />
                            {item.q}
                          </h4>
                          <p className="text-xs text-text-muted leading-relaxed font-medium">{item.a}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                          <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-brand-primary" />
                            How do I join this group?
                          </h4>
                          <p className="text-xs text-text-muted leading-relaxed font-medium">Simply click the 'Join Community' button. Most groups are open to all residents immediately.</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                          <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-brand-primary" />
                            Are sessions free?
                          </h4>
                          <p className="text-xs text-text-muted leading-relaxed font-medium">Standard community sessions are free. Hosted tournaments may have a small prize pool fee.</p>
                        </div>
                      </>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2rem] border border-brand-primary/20 bg-brand-primary/5">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
              Guidelines
            </h3>
            <ul className="space-y-4">
              {getGroupGuidelines(group).map(req => (
                <li key={req} className="flex items-center gap-3 text-xs font-medium text-text-secondary">
                  <div className="h-1 w-1 rounded-full bg-brand-primary shrink-0" />
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

          <button 
            onClick={() => setShowReport(true)}
            className="w-full py-4 rounded-[2rem] bg-rose-500/5 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-all"
          >
            <Flag className="w-4 h-4" />
            Report Community
          </button>
        </div>
      </div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        targetId={group.id}
        targetType="group"
        targetName={group.name}
      />

      {showImageEdit && (
        <ImageEditModal
          groupId={group.id}
          currentImage={groupImage}
          onClose={() => setShowImageEdit(false)}
          onSaved={(newUrl) => setGroupImage(newUrl)}
        />
      )}
    </div>
  );
};

export default GroupDetail;
