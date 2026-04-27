import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, MapPin, Users,
  CheckCircle2, XCircle, HelpCircle, Plus,
  ChevronRight, ShieldCheck, X, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatFullDate = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─── Propose Session Modal ───────────────────────────────────────────────────

const ProposeModal = ({ groupId, user, onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    max_attendees: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) {
      setError('Title, date, and time are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const starts_at = new Date(`${form.date}T${form.time}`).toISOString();
      const payload = {
        group_id: groupId,
        created_by: user?.id,
        title: form.title,
        starts_at,
        location: form.location || 'TBD',
        description: form.description,
        max_attendees: form.max_attendees ? parseInt(form.max_attendees) : null,
      };
      const { error: err } = await supabase.from('events').insert([payload]);
      if (err) throw err;
      onCreated();
    } catch (err) {
      console.error('Event creation failed:', err);
      setError('Failed to save session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-surface-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-lg glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />

        <div className="p-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-text-primary">Propose a Session</h2>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Session Title *</label>
              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Friday Night Ranked"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>

            {/* Date + Time side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Date *</label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Start Time *</label>
                <input
                  required
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Location <span className="text-text-muted font-medium normal-case tracking-normal">(or leave blank for Online)</span></label>
              <input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Rocket Fizz, West Palm Beach / Online"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>

            {/* Max Attendees */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Max Attendees <span className="text-text-muted font-medium normal-case tracking-normal">(optional)</span></label>
              <input
                type="number"
                min="1"
                value={form.max_attendees}
                onChange={e => setForm({ ...form, max_attendees: e.target.value })}
                placeholder="Leave blank for unlimited"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Notes <span className="text-text-muted font-medium normal-case tracking-normal">(optional)</span></label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Any extra info — format, rules, what to bring..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all resize-none"
              />
            </div>

            {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {loading ? 'Saving...' : 'Propose Session'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Event Card ──────────────────────────────────────────────────────────────

const EventCard = ({ event, user }) => {
  const [myRsvp, setMyRsvp] = useState(null);
  const [stats, setStats] = useState({ going: 0, maybe: 0 });

  useEffect(() => {
    fetchRsvpData();
  }, [event.id]);

  const fetchRsvpData = async () => {
    const { data: rsvps } = await supabase
      .from('rsvps')
      .select('status, user_id')
      .eq('event_id', event.id);

    if (rsvps) {
      setStats({
        going: rsvps.filter(r => r.status === 'going').length,
        maybe: rsvps.filter(r => r.status === 'maybe').length,
      });
      if (user) {
        const found = rsvps.find(r => r.user_id === user.id);
        if (found) setMyRsvp(found.status);
      }
    }
  };

  const handleRsvpAction = async (status) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('rsvps')
        .upsert({ event_id: event.id, user_id: user.id, status }, { onConflict: 'event_id,user_id' });
      if (error) throw error;
      setMyRsvp(status);
      fetchRsvpData();
    } catch (err) {
      console.error('RSVP Failed:', err);
    }
  };

  const date = new Date(event.starts_at);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-6 rounded-[2.5rem] border border-white/5 hover:border-brand-primary/20 transition-all group"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Date Badge */}
        <div className="flex flex-col items-center justify-center bg-white/5 rounded-3xl p-4 min-w-[100px] border border-white/5 group-hover:border-brand-primary/20 transition-all shrink-0">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
            {date.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-4xl font-black text-text-primary tracking-tighter">{date.getDate()}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
          <span className="text-[9px] font-black text-text-muted mt-1 opacity-60">
            {date.getFullYear()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-black text-text-primary tracking-tight">{event.title}</h3>
            {event.max_attendees && (
              <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-md text-[8px] font-black uppercase tracking-widest">
                {stats.going} / {event.max_attendees} Filled
              </span>
            )}
          </div>

          {/* Date + Time — full, always visible */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <CalendarIcon className="w-4 h-4 text-brand-secondary shrink-0" />
              {formatFullDate(date)}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-brand-primary">
              <Clock className="w-4 h-4 shrink-0" />
              {formatTime(date)}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-brand-secondary shrink-0" />
              {event.location}
            </div>
          )}

          {event.description && (
            <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{event.description}</p>
          )}

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-surface-950 bg-brand-primary/20 flex items-center justify-center text-[8px] font-bold">R{i}</div>
              ))}
              {stats.going > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-surface-950 bg-white/5 flex items-center justify-center text-[8px] font-bold">+{stats.going - 3}</div>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              {stats.going} {stats.going === 1 ? 'resident' : 'residents'} confirmed
              {stats.maybe > 0 && ` · ${stats.maybe} maybe`}
            </span>
          </div>
        </div>

        {/* RSVP Actions */}
        <div className="flex flex-row md:flex-col justify-center gap-3 shrink-0">
          <RsvpButton active={myRsvp === 'going'}     onClick={() => handleRsvpAction('going')}     icon={CheckCircle2} label="Going"  color="emerald" />
          <RsvpButton active={myRsvp === 'maybe'}     onClick={() => handleRsvpAction('maybe')}     icon={HelpCircle}   label="Maybe"  color="orange" />
          <RsvpButton active={myRsvp === 'not_going'} onClick={() => handleRsvpAction('not_going')} icon={XCircle}      label="Pass"   color="rose" />
        </div>
      </div>
    </motion.div>
  );
};

const RsvpButton = ({ active, onClick, icon: Icon, label, color }) => {
  const colors = {
    emerald: active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-emerald-500' : 'text-emerald-500/50 hover:bg-emerald-500/10 border-emerald-500/20',
    orange:  active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 border-orange-500'   : 'text-orange-500/50 hover:bg-orange-500/10 border-orange-500/20',
    rose:    active ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 border-rose-500'         : 'text-rose-500/50 hover:bg-rose-500/10 border-rose-500/20',
  };
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${colors[color]}`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};

// ─── Calendar View ───────────────────────────────────────────────────────────

const CalendarView = ({ groupId, user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPropose, setShowPropose] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [groupId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, starts_at, location, max_attendees')
        .eq('group_id', groupId)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted">Upcoming Sessions</h3>
        <button
          onClick={() => setShowPropose(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
        >
          <Plus className="w-4 h-4" /> Propose Session
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Syncing Schedule...</span>
          </div>
        ) : events.length > 0 ? (
          events.map(event => (
            <EventCard key={event.id} event={event} user={user} />
          ))
        ) : (
          <div className="glass p-20 rounded-[3rem] border border-dashed border-white/10 text-center space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <CalendarIcon className="w-10 h-10 text-text-muted" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-text-primary">Clear Calendar</h4>
              <p className="text-sm text-text-muted max-w-xs mx-auto">No upcoming sessions yet. Be the first to propose one!</p>
            </div>
            <button
              onClick={() => setShowPropose(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20"
            >
              <Plus className="w-4 h-4" /> Propose First Session
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showPropose && (
          <ProposeModal
            groupId={groupId}
            user={user}
            onClose={() => setShowPropose(false)}
            onCreated={() => { setShowPropose(false); fetchEvents(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
