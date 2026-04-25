import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, 
  CheckCircle2, XCircle, HelpCircle, Plus, 
  ChevronRight, ArrowRight, ShieldCheck, Map
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const EventCard = ({ event, user, onRsvp }) => {
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
        maybe: rsvps.filter(r => r.status === 'maybe').length
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
        .upsert({ 
          event_id: event.id, 
          user_id: user.id, 
          status: status 
        }, { onConflict: 'event_id,user_id' });
      
      if (error) throw error;
      setMyRsvp(status);
      fetchRsvpData();
    } catch (err) {
      console.error('RSVP Failed:', err);
    }
  };

  const date = new Date(event.event_date);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-6 rounded-[2.5rem] border border-white/5 hover:border-brand-primary/20 transition-all group"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Date Badge */}
        <div className="flex flex-col items-center justify-center bg-white/5 rounded-3xl p-4 min-w-[100px] border border-white/5 group-hover:border-brand-primary/20 transition-all">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
          <span className="text-4xl font-black text-text-primary tracking-tighter">{date.getDate()}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-text-primary tracking-tight">{event.title}</h3>
            {event.max_attendees && (
              <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-md text-[8px] font-black uppercase tracking-widest">
                {stats.going} / {event.max_attendees} Filled
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-text-muted uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-secondary" />
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-secondary" />
              {event.location_name}
            </div>
          </div>

          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{event.description}</p>
          
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-surface-950 bg-brand-primary/20 flex items-center justify-center text-[8px] font-bold">R{i}</div>
                ))}
                {stats.going > 3 && <div className="w-6 h-6 rounded-full border-2 border-surface-950 bg-white/5 flex items-center justify-center text-[8px] font-bold">+{stats.going - 3}</div>}
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{stats.going} residents confirmed</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col justify-center gap-3">
          <RsvpButton 
            active={myRsvp === 'going'} 
            onClick={() => handleRsvpAction('going')} 
            icon={CheckCircle2} 
            label="Going" 
            color="emerald" 
          />
          <RsvpButton 
            active={myRsvp === 'maybe'} 
            onClick={() => handleRsvpAction('maybe')} 
            icon={HelpCircle} 
            label="Maybe" 
            color="orange" 
          />
          <RsvpButton 
            active={myRsvp === 'declined'} 
            onClick={() => handleRsvpAction('declined')} 
            icon={XCircle} 
            label="Pass" 
            color="rose" 
          />
        </div>
      </div>
    </motion.div>
  );
};

const RsvpButton = ({ active, onClick, icon: Icon, label, color }) => {
  const colors = {
    emerald: active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-emerald-500' : 'text-emerald-500/50 hover:bg-emerald-500/10 border-emerald-500/20',
    orange: active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 border-orange-500' : 'text-orange-500/50 hover:bg-orange-500/10 border-orange-500/20',
    rose: active ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 border-rose-500' : 'text-rose-500/50 hover:bg-rose-500/10 border-rose-500/20',
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

const CalendarView = ({ groupId, user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [groupId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, event_date, location_name, max_attendees')
        .eq('group_id', groupId)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });
      
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
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-text-muted hover:text-text-primary transition-all">
             <Map className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20">
            <Plus className="w-4 h-4" /> Propose Session
          </button>
        </div>
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
              <p className="text-sm text-text-muted max-w-xs mx-auto">There are no upcoming sessions scheduled for this community yet. Propose one to get started!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
