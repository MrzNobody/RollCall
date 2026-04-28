import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Edit3, Camera, MapPin, Calendar, MessageSquare,
  X, Check, Loader2, Clock, Users, Trash2, Send, Shield,
  ToggleLeft, ToggleRight, User, Star, Globe, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import BadgeShelf from './BadgeShelf';

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { key: 'steam',     label: 'Steam',       accent: 'sky',    placeholder: 'SteamUsername' },
  { key: 'psn',       label: 'PlayStation', accent: 'blue',   placeholder: 'PSN_Handle' },
  { key: 'xbox',      label: 'Xbox',        accent: 'green',  placeholder: 'Xbox Gamertag' },
  { key: 'battlenet', label: 'Battle.net',  accent: 'cyan',   placeholder: 'Player#1234' },
  { key: 'epic',      label: 'Epic Games',  accent: 'slate',  placeholder: 'EpicUsername' },
  { key: 'discord',   label: 'Discord',     accent: 'indigo', placeholder: 'username' },
  { key: 'nintendo',  label: 'Nintendo',    accent: 'red',    placeholder: 'SW-XXXX-XXXX-XXXX' },
  { key: 'riot',      label: 'Riot Games',  accent: 'rose',   placeholder: 'Name#TAG' },
];

const ACCENT = {
  sky:    { bg: 'bg-sky-500/10',    border: 'border-sky-500/30',    text: 'text-sky-400',    dot: 'bg-sky-400' },
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   dot: 'bg-blue-400' },
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  dot: 'bg-green-400' },
  cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   dot: 'bg-cyan-400' },
  slate:  { bg: 'bg-slate-500/10',  border: 'border-slate-500/30',  text: 'text-slate-400',  dot: 'bg-slate-400' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    dot: 'bg-red-400' },
  rose:   { bg: 'bg-rose-500/10',   border: 'border-rose-500/30',   text: 'text-rose-400',   dot: 'bg-rose-400' },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = [
  { key: 'morning',   label: 'Morning',   sub: '6am–12pm' },
  { key: 'afternoon', label: 'Afternoon', sub: '12–6pm' },
  { key: 'evening',   label: 'Evening',   sub: '6pm–12am' },
];

const RANK_TIERS = [
  { min: 0,  max: 0,  label: 'Newcomer',    color: 'bg-slate-500/20 text-slate-400' },
  { min: 1,  max: 1,  label: 'Regular',     color: 'bg-teal-500/20 text-teal-400' },
  { min: 2,  max: 2,  label: 'Rising Star', color: 'bg-sky-500/20 text-sky-400' },
  { min: 3,  max: 3,  label: 'Veteran',     color: 'bg-violet-500/20 text-violet-400' },
  { min: 4,  max: 5,  label: 'Elite',       color: 'bg-emerald-500/20 text-emerald-400' },
  { min: 6,  max: 99, label: 'Legend',      color: 'bg-amber-500/20 text-amber-400' },
];
const getRank = (n) => RANK_TIERS.find(t => n >= t.min && n <= t.max) || RANK_TIERS[0];

const INTERESTS = ['Gaming', 'Tabletop', 'Sports', 'Running', 'Hiking', 'Arts', 'Other'];

// ─── Avatar Upload Modal ──────────────────────────────────────────────────────

const AvatarModal = ({ currentUrl, profileId, onClose, onSaved }) => {
  const [preview, setPreview] = useState(currentUrl || '');
  const [urlInput, setUrlInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const applyFile = (f) => {
    if (!f?.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setError(''); setFile(f); setUrlInput('');
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setLoading(true); setError('');
    try {
      let finalUrl = urlInput.trim() || preview;
      if (file) {
        const ext = file.name.split('.').pop();
        const fileName = `avatar-${profileId}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type });
        if (!upErr) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
          finalUrl = publicUrl;
        } else if (!urlInput.trim()) {
          throw upErr;
        }
      }
      if (!finalUrl) { setError('Please provide an image URL or upload a file.'); setLoading(false); return; }
      const { error: dbErr } = await supabase.from('profiles').update({ avatar_url: finalUrl }).eq('id', profileId);
      if (dbErr) throw dbErr;
      onSaved(finalUrl);
    } catch (err) {
      setError(err.message || 'Failed to save avatar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md glass border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary rounded-t-[2.5rem]" />
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-text-primary">Update Avatar</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div
          className="w-32 h-32 rounded-full mx-auto bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-primary/50 transition-all group"
          onClick={() => fileRef.current?.click()}
        >
          {preview
            ? <img src={preview} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={() => setPreview('')} />
            : <Camera className="w-8 h-8 text-text-muted" />}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => applyFile(e.target.files?.[0])} />
        <p className="text-center text-[10px] text-text-muted uppercase tracking-widest font-black">Click to upload · Max 5 MB</p>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Or paste an image URL</label>
          <input
            value={urlInput}
            onChange={e => { setUrlInput(e.target.value); if (e.target.value) { setPreview(e.target.value); setFile(null); } }}
            placeholder="https://example.com/avatar.jpg"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all"
          />
        </div>

        {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={loading || (!preview && !urlInput)}
            className="px-8 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary/80 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand-primary/20">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {loading ? 'Saving…' : 'Save Avatar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Availability Grid ────────────────────────────────────────────────────────

const AvailabilityGrid = ({ availability, editable, onChange }) => {
  const toggle = (day, slot) => {
    if (!editable) return;
    const cur = availability[day] || [];
    const next = cur.includes(slot) ? cur.filter(s => s !== slot) : [...cur, slot];
    onChange({ ...availability, [day]: next });
  };

  const hasAny = DAYS.some(d => (availability[d] || []).length > 0);

  return (
    <div className="overflow-x-auto">
      {!hasAny && !editable && (
        <p className="text-xs text-text-muted italic py-4 text-center">No availability set.</p>
      )}
      <table className="w-full min-w-[480px]">
        <thead>
          <tr>
            <th className="w-28 pb-3" />
            {DAYS.map(d => (
              <th key={d} className="text-[9px] font-black uppercase tracking-widest text-text-muted pb-3 text-center">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map(slot => (
            <tr key={slot.key}>
              <td className="pr-4 py-2">
                <p className="text-[10px] font-black text-text-secondary">{slot.label}</p>
                <p className="text-[8px] text-text-muted mt-0.5">{slot.sub}</p>
              </td>
              {DAYS.map(day => {
                const active = (availability[day] || []).includes(slot.key);
                return (
                  <td key={day} className="text-center py-1 px-0.5">
                    <button
                      onClick={() => toggle(day, slot.key)}
                      disabled={!editable}
                      title={`${day} ${slot.label}`}
                      className={`w-full h-8 rounded-xl border transition-all duration-150 ${
                        active
                          ? 'bg-brand-primary/40 border-brand-primary/70 shadow-inner'
                          : 'bg-white/3 border-white/10'
                      } ${editable ? 'cursor-pointer hover:border-brand-primary/40' : 'cursor-default'}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Comment Card ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-cyan-500'];

const CommentCard = ({ comment, currentUserId, onDelete }) => {
  const name = comment.author_name || '?';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const isOwn = comment.author_id === currentUserId;

  return (
    <div className="flex gap-3 group animate-fade-in">
      <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5`}>
        {initials}
      </div>
      <div className="flex-1 bg-white/3 border border-white/5 rounded-2xl px-4 py-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{name}</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-text-muted">
              {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {isOwn && (
              <button onClick={() => onDelete(comment.id)}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-rose-400 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
};

// ─── Event Row ────────────────────────────────────────────────────────────────

const EventRow = ({ event, status }) => {
  const date = new Date(event.starts_at);
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-white/5 last:border-0">
      <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl px-3 py-2.5 min-w-[52px] border border-white/5 shrink-0">
        <span className="text-[8px] font-black uppercase text-brand-primary leading-none">
          {date.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-xl font-black text-text-primary leading-tight">{date.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary truncate">{event.title}</p>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] text-text-muted font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {event.location && event.location !== 'TBD' && (
            <span className="flex items-center gap-1 text-[10px] text-text-muted font-bold uppercase tracking-wider">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
          )}
          {event.group_name && (
            <span className="flex items-center gap-1 text-[10px] text-brand-primary/70 font-bold uppercase tracking-wider">
              <Users className="w-3 h-3" />
              {event.group_name}
            </span>
          )}
        </div>
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shrink-0 ${
        status === 'going' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
      }`}>{status}</span>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const UserProfile = ({ user, profileId, onBack, onSelectGroup }) => {
  const targetId = profileId || user?.id;
  const isOwnProfile = !profileId || profileId === user?.id;

  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('overview');

  // Edit profile
  const [editing, setEditing]         = useState(false);
  const [editForm, setEditForm]       = useState({});
  const [editHandles, setEditHandles] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');

  // Avatar
  const [avatarUrl, setAvatarUrl]         = useState('');
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);

  // Upcoming events (RSVPs)
  const [upcomingEvents, setUpcomingEvents]   = useState([]);
  const [eventsLoading, setEventsLoading]     = useState(false);

  // Groups
  const [joinedGroups, setJoinedGroups] = useState([]);

  // Comments (community wall)
  const [comments, setComments]           = useState([]);
  const [newComment, setNewComment]       = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Availability
  const [availability, setAvailability]         = useState({});
  const [showAvail, setShowAvail]               = useState(false);
  const [editingAvail, setEditingAvail]         = useState(false);
  const [availSaving, setAvailSaving]           = useState(false);

  // Badge count for rank display
  const [badgeCount, setBadgeCount] = useState(0);

  // ── Fetch profile & ancillary data ──────────────────────────────────────────

  useEffect(() => {
    if (!targetId) return;
    fetchAll();
  }, [targetId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [profileRes, badgeRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', targetId).single(),
        supabase.from('user_badges').select('id').eq('user_id', targetId),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setAvatarUrl(profileRes.data.avatar_url || '');
        setAvailability(profileRes.data.availability || {});
        setShowAvail(profileRes.data.show_availability || false);
        setEditForm({
          full_name:        profileRes.data.full_name || '',
          username:         profileRes.data.username || '',
          bio:              profileRes.data.bio || '',
          city:             profileRes.data.city || '',
          primary_interest: profileRes.data.primary_interest || '',
        });
        setEditHandles(profileRes.data.gamer_handles || {});
      }
      setBadgeCount(badgeRes.data?.length ?? 0);

      // Parallel fetch: events + groups + comments
      fetchEvents();
      fetchGroups();
      fetchComments();
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const { data: rsvpData } = await supabase
        .from('rsvps')
        .select('status, event_id')
        .eq('user_id', targetId)
        .in('status', ['going', 'maybe']);

      if (!rsvpData?.length) { setUpcomingEvents([]); return; }

      const eventIds = rsvpData.map(r => r.event_id);
      const { data: evData } = await supabase
        .from('events')
        .select('id, title, starts_at, location, group_id, groups:group_id(name)')
        .in('id', eventIds)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true });

      const rsvpMap = Object.fromEntries(rsvpData.map(r => [r.event_id, r.status]));
      setUpcomingEvents((evData || []).map(ev => ({
        ...ev,
        group_name: ev.groups?.name || '',
        status: rsvpMap[ev.id] || 'going',
      })));
    } catch (err) {
      console.error('Events fetch error:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const { data: memData } = await supabase
        .from('memberships').select('group_id').eq('user_id', targetId);
      if (!memData?.length) { setJoinedGroups([]); return; }
      const { data: groups } = await supabase
        .from('groups')
        .select('id, name, image, category, city')
        .in('id', memData.map(m => m.group_id));
      setJoinedGroups(groups || []);
    } catch (err) {
      console.error('Groups fetch error:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('profile_comments')
        .select('id, author_id, content, created_at, profiles:author_id(full_name, username)')
        .eq('profile_id', targetId)
        .order('created_at', { ascending: false });
      setComments((data || []).map(c => ({
        ...c,
        author_name: c.profiles?.full_name || c.profiles?.username || 'Anonymous',
      })));
    } catch (err) {
      console.error('Comments fetch error:', err);
    }
  };

  // ── Save profile edits ───────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    setSaveLoading(true); setSaveMsg('');
    try {
      const { error } = await supabase.from('profiles').update({
        full_name:        editForm.full_name,
        username:         editForm.username,
        bio:              editForm.bio,
        city:             editForm.city,
        primary_interest: editForm.primary_interest,
        gamer_handles:    editHandles,
      }).eq('id', targetId);
      if (error) throw error;
      setProfile(p => ({ ...p, ...editForm, gamer_handles: editHandles }));
      setEditing(false);
      setSaveMsg('Profile saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(`Error: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  // ── Save availability ────────────────────────────────────────────────────────

  const handleSaveAvailability = async () => {
    setAvailSaving(true);
    try {
      await supabase.from('profiles').update({
        availability,
        show_availability: showAvail,
      }).eq('id', targetId);
      setEditingAvail(false);
    } catch (err) {
      console.error('Availability save error:', err);
    } finally {
      setAvailSaving(false);
    }
  };

  // ── Toggle availability public flag ─────────────────────────────────────────

  const handleToggleShowAvail = async () => {
    const next = !showAvail;
    setShowAvail(next);
    await supabase.from('profiles').update({ show_availability: next }).eq('id', targetId);
  };

  // ── Post comment ─────────────────────────────────────────────────────────────

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setCommentLoading(true);
    try {
      const { error } = await supabase.from('profile_comments').insert([{
        profile_id: targetId,
        author_id:  user.id,
        content:    newComment.trim(),
      }]);
      if (error) throw error;
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  // ── Delete comment ───────────────────────────────────────────────────────────

  const handleDeleteComment = async (id) => {
    try {
      await supabase.from('profile_comments').delete().eq('id', id);
      setComments(c => c.filter(x => x.id !== id));
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Loading Profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-text-muted mx-auto" />
          <p className="text-text-secondary font-bold">Profile not found.</p>
          <button onClick={onBack} className="text-brand-primary font-black text-sm hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  const rank = getRank(badgeCount);
  const displayName = profile.full_name || profile.username || profile.id?.slice(0, 8);
  const handles = profile.gamer_handles || {};
  const activeHandles = PLATFORMS.filter(p => handles[p.key]);

  const TABS = [
    { key: 'overview',  label: 'Overview' },
    { key: 'schedule',  label: `Schedule${upcomingEvents.length ? ` · ${upcomingEvents.length}` : ''}` },
    { key: 'wall',      label: `Wall${comments.length ? ` · ${comments.length}` : ''}` },
  ];

  return (
    <div className="pt-24 min-h-screen bg-surface-950 px-6 md:px-12 pb-24">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ── Back Button ──────────────────────────────────────────────────── */}
        <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-bold group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* ── Profile Header ────────────────────────────────────────────────── */}
        <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden">
          {/* Banner gradient */}
          <div className="h-32 bg-gradient-to-r from-brand-primary/30 via-brand-secondary/20 to-transparent relative">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950/60 to-transparent" />
          </div>

          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-[1.5rem] border-4 border-surface-950 overflow-hidden bg-brand-primary/20 flex items-center justify-center shadow-2xl">
                  {avatarUrl
                    ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover"
                        onError={() => setAvatarUrl('')} />
                    : <span className="text-4xl font-black text-brand-primary">
                        {displayName.slice(0, 2).toUpperCase()}
                      </span>
                  }
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => setShowAvatarEdit(true)}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg hover:bg-brand-primary/80 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              {/* Name + badges */}
              <div className="flex-1 min-w-0 space-y-2 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black tracking-tight text-text-primary">{displayName}</h1>
                  {profile.is_verified_organizer && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-brand-primary">
                      <Shield className="w-3 h-3" /> Organizer
                    </span>
                  )}
                  {profile.subscription_tier && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-amber-400">
                      <Star className="w-3 h-3" /> {profile.subscription_tier}
                    </span>
                  )}
                </div>

                {profile.username && profile.full_name && (
                  <p className="text-sm text-text-muted font-bold">@{profile.username}</p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${rank.color}`}>
                    {rank.label}
                  </span>
                  {profile.city && (
                    <span className="flex items-center gap-1 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                      <MapPin className="w-3 h-3" /> {profile.city}
                    </span>
                  )}
                  {profile.primary_interest && (
                    <span className="flex items-center gap-1 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                      <Globe className="w-3 h-3" /> {profile.primary_interest}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit / action buttons */}
              <div className="flex gap-2 shrink-0">
                {isOwnProfile ? (
                  <button
                    onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                    disabled={saveLoading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      editing
                        ? 'bg-emerald-500 text-white hover:bg-emerald-500/80 shadow-lg shadow-emerald-500/20'
                        : 'glass border border-white/10 text-text-primary hover:border-white/20'
                    }`}
                  >
                    {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    {editing ? 'Save' : 'Edit Profile'}
                  </button>
                ) : user && (
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-2 px-5 py-2.5 glass border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-text-primary hover:border-brand-primary/30 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                )}
                {editing && (
                  <button onClick={() => { setEditing(false); setSaveMsg(''); }}
                    className="px-4 py-2.5 glass border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Save message */}
            {saveMsg && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-3 text-xs font-bold ${saveMsg.startsWith('Error') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {saveMsg}
              </motion.p>
            )}

            {/* Bio */}
            {editing ? (
              <textarea
                value={editForm.bio}
                onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Write a short bio about yourself…"
                rows={3}
                maxLength={400}
                className="mt-4 w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all resize-none"
              />
            ) : profile.bio ? (
              <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-2xl">{profile.bio}</p>
            ) : isOwnProfile ? (
              <p className="mt-4 text-sm text-text-muted italic cursor-pointer hover:text-text-secondary transition-colors" onClick={() => setEditing(true)}>
                + Add a bio…
              </p>
            ) : null}
          </div>
        </div>

        {/* ── Edit Fields (inline, shown when editing) ──────────────────────── */}
        <AnimatePresence>
          {editing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="glass border border-white/10 rounded-[2.5rem] p-8 space-y-8">
                <h3 className="text-lg font-black tracking-tight text-text-primary">Edit Profile</h3>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: 'full_name', label: 'Display Name',    placeholder: 'Your full name' },
                    { key: 'username',  label: 'Username',        placeholder: '@handle' },
                    { key: 'city',      label: 'City / Location', placeholder: 'West Palm Beach, FL' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</label>
                      <input
                        value={editForm[key]}
                        onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Primary Interest</label>
                    <select
                      value={editForm.primary_interest}
                      onChange={e => setEditForm(f => ({ ...f, primary_interest: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all"
                    >
                      <option value="">Select interest…</option>
                      {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>

                {/* Gamer Handles */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Gamer Handles</h4>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PLATFORMS.map(({ key, label, placeholder, accent }) => {
                      const a = ACCENT[accent];
                      return (
                        <div key={key} className="space-y-1.5">
                          <label className={`text-[9px] font-black uppercase tracking-widest ${a.text}`}>{label}</label>
                          <div className={`flex items-center gap-2 border ${a.border} ${a.bg} rounded-2xl px-4 py-2.5 group focus-within:border-opacity-100`}>
                            <div className={`w-2 h-2 rounded-full ${a.dot} shrink-0`} />
                            <input
                              value={editHandles[key] || ''}
                              onChange={e => setEditHandles(h => ({ ...h, [key]: e.target.value }))}
                              placeholder={placeholder}
                              className="flex-1 bg-transparent text-sm text-text-primary focus:outline-none placeholder:text-text-muted"
                            />
                            {editHandles[key] && (
                              <button onClick={() => setEditHandles(h => { const n = { ...h }; delete n[key]; return n; })}
                                className="text-text-muted hover:text-rose-400 transition-colors shrink-0">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSaveProfile} disabled={saveLoading}
                    className="px-10 py-3.5 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary/80 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 flex items-center gap-2">
                    {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saveLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 border-b border-white/5 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─────────────────── OVERVIEW TAB ────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-10">

            {/* Gamer Handles (display) */}
            {activeHandles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Gamer Handles</h3>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {activeHandles.map(({ key, label, accent }) => {
                    const a = ACCENT[accent];
                    return (
                      <div key={key} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${a.border} ${a.bg}`}>
                        <div className={`w-2 h-2 rounded-full ${a.dot} shrink-0`} />
                        <div className="min-w-0">
                          <p className={`text-[8px] font-black uppercase tracking-widest ${a.text}`}>{label}</p>
                          <p className="text-xs font-bold text-text-primary truncate mt-0.5">{handles[key]}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {isOwnProfile && activeHandles.length === 0 && (
                  <button onClick={() => setEditing(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-brand-primary transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add your gamer handles
                  </button>
                )}
              </div>
            )}

            {/* Availability */}
            {(isOwnProfile || showAvail) && (
              <div className="glass border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-text-primary">Availability</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">When you're free to play</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    {isOwnProfile && (
                      <>
                        {/* Show to others toggle */}
                        <button onClick={handleToggleShowAvail}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-secondary transition-colors">
                          {showAvail
                            ? <ToggleRight className="w-5 h-5 text-brand-primary" />
                            : <ToggleLeft className="w-5 h-5 text-text-muted" />}
                          {showAvail ? 'Visible to others' : 'Private'}
                        </button>
                        {/* Edit toggle */}
                        {editingAvail ? (
                          <button onClick={handleSaveAvailability} disabled={availSaving}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/80 flex items-center gap-1.5 disabled:opacity-50">
                            {availSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            {availSaving ? 'Saving…' : 'Done'}
                          </button>
                        ) : (
                          <button onClick={() => setEditingAvail(true)}
                            className="px-4 py-2 glass border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all flex items-center gap-1.5">
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <AvailabilityGrid
                  availability={availability}
                  editable={isOwnProfile && editingAvail}
                  onChange={setAvailability}
                />
              </div>
            )}

            {/* Badges */}
            <BadgeShelf userId={targetId} />

            {/* Groups */}
            {joinedGroups.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Communities</h3>
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[9px] font-black text-text-muted">{joinedGroups.length} groups</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {joinedGroups.map(group => (
                    <button key={group.id}
                      onClick={() => onSelectGroup && onSelectGroup(group)}
                      className="glass border border-white/5 hover:border-brand-primary/20 rounded-[1.5rem] p-4 flex items-center gap-4 transition-all group text-left w-full">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-text-primary truncate">{group.name}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />{group.city}
                        </p>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-text-muted group-hover:text-brand-primary rotate-180 group-hover:translate-x-1 transition-all ml-auto shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──────────────── SCHEDULE TAB ───────────────────────────────────── */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            <div className="glass border border-white/10 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-text-primary">Upcoming Activities</h3>
                  <p className="text-xs text-text-muted mt-0.5">Events with an active RSVP</p>
                </div>
                <Calendar className="w-5 h-5 text-brand-primary" />
              </div>

              {eventsLoading ? (
                <div className="flex items-center justify-center py-12 gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Loading…</span>
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div>
                  {upcomingEvents.map(ev => (
                    <EventRow key={ev.id} event={ev} status={ev.status} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <Calendar className="w-10 h-10 text-text-muted mx-auto" />
                  <p className="text-sm text-text-secondary font-medium">No upcoming sessions.</p>
                  <p className="text-xs text-text-muted">RSVP to events in your groups to see them here.</p>
                </div>
              )}
            </div>

            {/* Availability summary on schedule tab too */}
            {(isOwnProfile || showAvail) && (
              <div className="glass border border-white/10 rounded-[2.5rem] p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-text-primary">My Availability</h3>
                  {!showAvail && isOwnProfile && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted bg-white/5 border border-white/10 px-3 py-1 rounded-lg">Private</span>
                  )}
                </div>
                <AvailabilityGrid availability={availability} editable={false} onChange={() => {}} />
              </div>
            )}
          </div>
        )}

        {/* ──────────────── COMMUNITY WALL TAB ─────────────────────────────── */}
        {activeTab === 'wall' && (
          <div className="space-y-6">
            <div className="glass border border-white/10 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-text-primary">Community Wall</h3>
                  <p className="text-xs text-text-muted mt-0.5">Public messages from the community</p>
                </div>
                <MessageSquare className="w-5 h-5 text-brand-primary" />
              </div>

              {/* Post comment (not on own profile — or allow?) */}
              {user && !isOwnProfile && (
                <form onSubmit={handlePostComment} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[user.email?.charCodeAt(0) % AVATAR_COLORS.length]} flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5`}>
                    {(user.email?.charAt(0) || '?').toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value.slice(0, 500))}
                      placeholder={`Leave a message for ${displayName}…`}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-text-muted">{newComment.length} / 500</span>
                      <button type="submit" disabled={!newComment.trim() || commentLoading}
                        className="px-5 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/80 disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-lg shadow-brand-primary/20">
                        {commentLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Post
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {isOwnProfile && user && (
                <div className="p-4 bg-white/3 border border-white/5 rounded-2xl text-xs text-text-muted italic text-center">
                  This is your community wall. Other members can leave public messages here.
                </div>
              )}

              {/* Comments list */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map(c => (
                    <CommentCard key={c.id} comment={c} currentUserId={user?.id} onDelete={handleDeleteComment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <MessageSquare className="w-10 h-10 text-text-muted mx-auto" />
                  <p className="text-sm text-text-secondary font-medium">No messages yet.</p>
                  <p className="text-xs text-text-muted">Be the first to leave a note!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Avatar Modal */}
      <AnimatePresence>
        {showAvatarEdit && (
          <AvatarModal
            currentUrl={avatarUrl}
            profileId={targetId}
            onClose={() => setShowAvatarEdit(false)}
            onSaved={(url) => { setAvatarUrl(url); setShowAvatarEdit(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
