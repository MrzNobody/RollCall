import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, MapPin, Users,
  CheckCircle2, XCircle, HelpCircle, Plus,
  ChevronRight, ShieldCheck, X, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getEventImage } from '../lib/groupImage';
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
    // Extra safety guard: should never reach here for non-organizers
    if (!user) { setError('You must be signed in as an organizer to schedule events.'); return; }
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
            <h2 className="text-2xl font-black tracking-tight text-text-primary">Schedule a Session</h2>
            <button title="Close session scheduler" onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors">
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
              <button title="Cancel and close without saving" type="button" onClick={onClose} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">
                Cancel
              </button>
              <button
                title="Save and publish this session"
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

// ─── Attendees Pane ──────────────────────────────────────────────────────────

const AttendeeAvatar = ({ profile, status }) => {
  const initials = (profile.username || profile.full_name || '?')
    .split(/[\s_]/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-cyan-500'];
  const color = colors[(profile.username || '').charCodeAt(0) % colors.length] || 'bg-brand-primary';
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
        {initials}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold text-text-primary truncate">{profile.full_name || profile.username}</div>
        {profile.username && profile.full_name && (
          <div className="text-[10px] text-text-muted">@{profile.username}</div>
        )}
      </div>
      <span className={`ml-auto text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 ${
        status === 'going' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
      }`}>
        {status === 'going' ? 'Going' : 'Maybe'}
      </span>
    </div>
  );
};

const AttendeesPane = ({ eventId }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('rsvps')
        .select('status, user_id, profiles:user_id(id, username, full_name, avatar_url)')
        .eq('event_id', eventId)
        .in('status', ['going', 'maybe'])
        .order('status', { ascending: true }); // going before maybe
      setAttendees(data || []);
      setLoading(false);
    };
    fetchAttendees();
  }, [eventId]);

  const going = attendees.filter(a => a.status === 'going');
  const maybe = attendees.filter(a => a.status === 'maybe');

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="border-t border-white/5 mt-6 pt-6">
        {loading ? (
          <div className="flex items-center gap-3 py-4 text-text-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold">Loading attendees…</span>
          </div>
        ) : attendees.length === 0 ? (
          <p className="text-xs text-text-muted font-bold py-2">No one has signed up yet — be the first!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-x-12">
            {going.length > 0 && (
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">
                  Going · {going.length}
                </div>
                <div className="divide-y divide-white/5">
                  {going.map(a => <AttendeeAvatar key={a.user_id} profile={a.profiles} status="going" />)}
                </div>
              </div>
            )}
            {maybe.length > 0 && (
              <div className={going.length > 0 ? 'mt-4 md:mt-0' : ''}>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 mb-2">
                  Maybe · {maybe.length}
                </div>
                <div className="divide-y divide-white/5">
                  {maybe.map(a => <AttendeeAvatar key={a.user_id} profile={a.profiles} status="maybe" />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Event Card ──────────────────────────────────────────────────────────────

const EventCard = ({ event, user }) => {
  const [myRsvp, setMyRsvp] = useState(null);
  const [stats, setStats] = useState({ going: 0, maybe: 0 });
  const [showAttendees, setShowAttendees] = useState(false);

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
  const totalSignups = stats.going + stats.maybe;
  const eventImg = getEventImage(event.title);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-[2.5rem] border border-white/5 hover:border-brand-primary/20 transition-all group overflow-hidden"
    >
      {/* Activity image banner */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={eventImg}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-950/30 to-transparent" />
        {/* Date badge overlaid on image */}
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <div className="flex flex-col items-center bg-surface-950/80 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10 min-w-[60px]">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary">
              {date.toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="text-2xl font-black text-text-primary leading-none">{date.getDate()}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight drop-shadow-lg">{event.title}</h3>
            {event.max_attendees && (
              <span className="px-2 py-0.5 bg-brand-primary/80 text-white rounded-md text-[8px] font-black uppercase tracking-widest">
                {stats.going} / {event.max_attendees} Spots Filled
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Info */}
        <div className="flex-1 space-y-4 min-w-0">
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

          {/* Attendee summary + toggle */}
          <button
            title="Toggle attendee list"
            onClick={() => setShowAttendees(s => !s)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group/att"
          >
            <div className="flex -space-x-2">
              {stats.going === 0 && stats.maybe === 0 ? (
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <Users className="w-3 h-3 text-text-muted" />
                </div>
              ) : (
                <>
                  {Array.from({ length: Math.min(3, totalSignups) }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-surface-950 bg-brand-primary/30 flex items-center justify-center text-[7px] font-black text-brand-primary">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {totalSignups > 3 && (
                    <div className="w-6 h-6 rounded-full border-2 border-surface-950 bg-white/5 flex items-center justify-center text-[8px] font-bold text-text-muted">
                      +{totalSignups - 3}
                    </div>
                  )}
                </>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover/att:text-text-secondary transition-colors">
              {stats.going > 0 || stats.maybe > 0
                ? `${stats.going} going${stats.maybe > 0 ? ` · ${stats.maybe} maybe` : ''} · ${showAttendees ? 'Hide' : 'View'} list`
                : 'No signups yet · Be first!'}
            </span>
          </button>
        </div>

        {/* RSVP Actions */}
        <div className="flex flex-row md:flex-col justify-center gap-3 shrink-0">
          <RsvpButton active={myRsvp === 'going'}     onClick={() => handleRsvpAction('going')}     icon={CheckCircle2} label="Going"  color="emerald" />
          <RsvpButton active={myRsvp === 'maybe'}     onClick={() => handleRsvpAction('maybe')}     icon={HelpCircle}   label="Maybe"  color="orange" />
          <RsvpButton active={myRsvp === 'not_going'} onClick={() => handleRsvpAction('not_going')} icon={XCircle}      label="Pass"   color="rose" />
        </div>
      </div>

      {/* Attendees expandable pane */}
      <AnimatePresence>
        {showAttendees && <AttendeesPane eventId={event.id} />}
      </AnimatePresence>
      </div>{/* end p-6 */}
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
      title={`Mark yourself as ${label} for this session`}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${colors[color]}`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};

// ─── Calendar View ───────────────────────────────────────────────────────────

const CalendarView = ({ groupId, user, isOrganizer = false }) => {
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted">Upcoming Sessions</h3>
          {isOrganizer ? (
            <p className="text-[10px] text-brand-primary font-bold mt-1 uppercase tracking-widest">Organizer · You can schedule sessions</p>
          ) : (
            <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-widest">Participant · RSVP to sessions below</p>
          )}
        </div>
        {isOrganizer && (
          <button
            title="Schedule a new session for this group"
            onClick={() => setShowPropose(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
          >
            <Plus className="w-4 h-4" /> Schedule Session
          </button>
        )}
      </div>

      {/* Participant-only RSVP callout */}
      {!isOrganizer && (
        <div className="flex items-start gap-4 px-6 py-4 bg-brand-secondary/5 border border-brand-secondary/15 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Sessions are scheduled by the group organizer. Use <span className="font-black text-emerald-400">Going</span>, <span className="font-black text-orange-400">Maybe</span>, or <span className="font-black text-rose-400">Pass</span> to RSVP to any upcoming session.
          </p>
        </div>
      )}

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
              <p className="text-sm text-text-muted max-w-xs mx-auto">
                {isOrganizer
                  ? 'No upcoming sessions yet. Schedule the first one!'
                  : 'No upcoming sessions yet. The organizer will schedule one soon!'}
              </p>
            </div>
            {isOrganizer && (
              <button
                title="Schedule the first session for this group"
                onClick={() => setShowPropose(true)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20"
              >
                <Plus className="w-4 h-4" /> Schedule First Session
              </button>
            )}
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
