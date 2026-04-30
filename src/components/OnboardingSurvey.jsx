import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Check, MapPin, Users,
  Gamepad2, Dices, Trophy, Sparkles, TreePine, Palette,
  Zap, Shield, Clock, Star, Heart, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getGroupImage } from '../lib/groupImage';

// ─── Constants ────────────────────────────────────────────────────────────────

const PBC_CITIES = [
  'West Palm Beach', 'Boca Raton', 'Delray Beach', 'Boynton Beach',
  'Lake Worth', 'Wellington', 'Palm Beach Gardens', 'Jupiter',
  'Riviera Beach', 'Greenacres', 'Royal Palm Beach', 'Palm Springs',
  'Lantana', 'Tequesta', 'Loxahatchee', 'Belle Glade', 'Other PBC City',
];

const INTERESTS = [
  { key: 'Gaming',   label: 'Video Gaming',  icon: Gamepad2, color: 'rose',   desc: 'FPS, RPG, Battle Royale, esports' },
  { key: 'Tabletop', label: 'Tabletop & RPG', icon: Dices,    color: 'purple', desc: 'D&D, board games, card games' },
  { key: 'Sports',   label: 'Sports',         icon: Trophy,   color: 'blue',   desc: 'Pickleball, basketball, soccer' },
  { key: 'Outdoor',  label: 'Outdoors',       icon: TreePine, color: 'emerald',desc: 'Hiking, birding, kayaking' },
  { key: 'Arts',     label: 'Arts & Crafts',  icon: Palette,  color: 'orange', desc: 'Painting, photography, pottery' },
  { key: 'Other',    label: 'Social & More',  icon: Sparkles, color: 'cyan',   desc: 'Books, coding, cooking, music' },
];

const PLAY_STYLES = [
  { key: 'Casual',      label: 'Casual & Relaxed',  icon: Heart,  desc: 'Just here for fun, no pressure' },
  { key: 'Mixed',       label: 'Casual & Competitive', icon: Star, desc: 'Enjoy both depending on the vibe' },
  { key: 'Competitive', label: 'Competitive',        icon: Zap,   desc: 'I play to win and improve' },
];

const GROUP_SIZES = [
  { key: 'small',  label: 'Small Groups',    desc: 'Under 15 people — tight-knit and personal' },
  { key: 'medium', label: 'Medium Groups',   desc: '15–50 people — great balance of community' },
  { key: 'large',  label: 'Large Community', desc: '50+ people — lots of activity and variety' },
  { key: 'any',    label: 'No Preference',   desc: 'I\'m open to any size' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  { key: 'morning',   label: 'Morning',   sub: '6am – 12pm' },
  { key: 'afternoon', label: 'Afternoon', sub: '12pm – 6pm' },
  { key: 'evening',   label: 'Evening',   sub: '6pm – midnight' },
];

const TOTAL_STEPS = 6;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const colorMap = {
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-400',    active: 'bg-rose-500 border-rose-500 text-white' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400',  active: 'bg-purple-500 border-purple-500 text-white' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    active: 'bg-blue-500 border-blue-500 text-white' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', active: 'bg-emerald-500 border-emerald-500 text-white' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-400',  active: 'bg-orange-500 border-orange-500 text-white' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    text: 'text-cyan-400',    active: 'bg-cyan-500 border-cyan-500 text-white' },
};

// ─── Step components ──────────────────────────────────────────────────────────

const StepWelcome = ({ username, onNameChange }) => (
  <div className="space-y-8 text-center">
    <div className="space-y-3">
      <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-blue-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-brand-primary/30">
        <Users className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-black tracking-tight text-text-primary">Welcome to RollCall!</h2>
      <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
        Palm Beach County's community hub for gamers, athletes, and local enthusiasts.
        Let's set up your profile so we can find the perfect groups for you.
      </p>
    </div>
    <div className="space-y-2 text-left">
      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
        What should we call you?
      </label>
      <input
        value={username}
        onChange={e => onNameChange(e.target.value)}
        placeholder="Your username or nickname…"
        maxLength={30}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-all placeholder:text-text-muted"
      />
      <p className="text-[10px] text-text-muted px-1">You can change this later in your profile.</p>
    </div>
  </div>
);

const StepInterests = ({ selected, onToggle }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-black tracking-tight text-text-primary">What are you into?</h2>
      <p className="text-sm text-text-muted">Pick everything that fits — you can always change this later.</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {INTERESTS.map(({ key, label, icon: Icon, color, desc }) => {
        const c = colorMap[color];
        const active = selected.includes(key);
        return (
          <button
            key={key}
            title={`Select interest: ${label}`}
            onClick={() => onToggle(key)}
            className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
              active ? c.active : `${c.bg} ${c.border} hover:opacity-80`
            }`}
          >
            {active && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <Icon className={`w-6 h-6 mb-2 ${active ? 'text-white' : c.text}`} />
            <div className={`font-black text-sm ${active ? 'text-white' : 'text-text-primary'}`}>{label}</div>
            <div className={`text-[10px] mt-0.5 leading-tight ${active ? 'text-white/70' : 'text-text-muted'}`}>{desc}</div>
          </button>
        );
      })}
    </div>
  </div>
);

const StepLocation = ({ city, onCityChange }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <MapPin className="w-10 h-10 text-brand-primary mx-auto" />
      <h2 className="text-2xl font-black tracking-tight text-text-primary">Where are you in PBC?</h2>
      <p className="text-sm text-text-muted">We'll prioritize groups near you.</p>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {PBC_CITIES.map(c => (
        <button
          key={c}
          title={`Select city: ${c}`}
          onClick={() => onCityChange(c)}
          className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all text-left ${
            city === c
              ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20'
              : 'bg-white/5 border-white/10 text-text-secondary hover:border-brand-primary/40 hover:text-text-primary'
          }`}
        >
          {city === c && <Check className="w-3 h-3 inline mr-1.5 mb-0.5" />}
          {c}
        </button>
      ))}
    </div>
  </div>
);

const StepPlayStyle = ({ selected, onSelect }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-black tracking-tight text-text-primary">What's your vibe?</h2>
      <p className="text-sm text-text-muted">This helps us match you with the right crowd.</p>
    </div>
    <div className="space-y-3">
      {PLAY_STYLES.map(({ key, label, icon: Icon, desc }) => (
        <button
          key={key}
          title={`Select play style: ${label}`}
          onClick={() => onSelect(key)}
          className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${
            selected === key
              ? 'bg-brand-primary/10 border-brand-primary text-text-primary'
              : 'bg-white/5 border-white/10 hover:border-brand-primary/30'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            selected === key ? 'bg-brand-primary/20' : 'bg-white/5'
          }`}>
            <Icon className={`w-5 h-5 ${selected === key ? 'text-brand-primary' : 'text-text-muted'}`} />
          </div>
          <div className="flex-1">
            <div className="font-black text-sm text-text-primary">{label}</div>
            <div className="text-[11px] text-text-muted mt-0.5">{desc}</div>
          </div>
          {selected === key && <Check className="w-5 h-5 text-brand-primary shrink-0" />}
        </button>
      ))}
    </div>
    <div className="space-y-3 pt-2 border-t border-white/5">
      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Group size preference</p>
      <div className="grid grid-cols-2 gap-2">
        {GROUP_SIZES.map(({ key, label, desc }) => (
          <button
            key={key}
            title={`Select group size: ${label}`}
            onClick={() => {}} // handled by parent via groupSize state
            data-size={key}
            className="p-3 rounded-xl border border-white/10 bg-white/5 text-left hover:border-brand-primary/30 transition-all"
          >
            <div className="font-bold text-xs text-text-primary">{label}</div>
            <div className="text-[10px] text-text-muted mt-0.5 leading-tight">{desc}</div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const StepAvailability = ({ availability, onToggle }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <Clock className="w-10 h-10 text-brand-primary mx-auto" />
      <h2 className="text-2xl font-black tracking-tight text-text-primary">When are you free?</h2>
      <p className="text-sm text-text-muted">Tap to select your usual availability. You can update this anytime.</p>
    </div>
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="w-full border-separate border-spacing-1 min-w-[320px]">
        <thead>
          <tr>
            <td className="w-20" />
            {DAYS.map(d => (
              <td key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-text-muted pb-2">{d}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map(slot => (
            <tr key={slot.key}>
              <td className="pr-2">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-wider leading-tight">{slot.label}</div>
                <div className="text-[9px] text-text-muted/60">{slot.sub}</div>
              </td>
              {DAYS.map(day => {
                const active = availability?.[day]?.[slot.key];
                return (
                  <td key={day} className="text-center">
                    <button
                      title={`Toggle availability for ${day} ${slot.label}`}
                      onClick={() => onToggle(day, slot.key)}
                      className={`w-full h-9 rounded-xl border transition-all ${
                        active
                          ? 'bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/30'
                          : 'bg-white/5 border-white/10 hover:border-brand-primary/30'
                      }`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-[10px] text-text-muted text-center">Blue = available. You can skip this step if you prefer.</p>
  </div>
);

const StepMatches = ({ matches, joined, onToggleJoin, loading }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-black tracking-tight text-text-primary">Your Matched Groups</h2>
      <p className="text-sm text-text-muted max-w-sm mx-auto">
        Based on your interests, here are the best communities waiting for you in Palm Beach County.
      </p>
    </div>
    {loading ? (
      <div className="flex items-center justify-center py-12 gap-3 text-text-muted">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-bold">Finding your communities…</span>
      </div>
    ) : matches.length === 0 ? (
      <div className="text-center py-10 text-text-muted text-sm">
        No groups found yet — but you can explore the map after setup!
      </div>
    ) : (
      <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
        {matches.map(group => {
          const isJoined = joined.includes(group.id);
          return (
            <div key={group.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              isJoined ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-white/5'
            }`}>
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <img
                  src={group.image || getGroupImage(group.name, group.category)}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-text-primary truncate">{group.name}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">
                  {group.city} · {group.members} members · {group.category}
                </div>
              </div>
              <button
                title={isJoined ? `Leave ${group.name}` : `Join ${group.name}`}
                onClick={() => onToggleJoin(group)}
                className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isJoined
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-brand-primary text-white hover:bg-brand-primary/80 shadow-md shadow-brand-primary/20'
                }`}
              >
                {isJoined ? <><Check className="w-3 h-3 inline mr-1" />Joined</> : 'Join'}
              </button>
            </div>
          );
        })}
      </div>
    )}
    <p className="text-[10px] text-text-muted text-center">You can join or leave any group at any time from the Discover map.</p>
  </div>
);

// ─── Main Survey ──────────────────────────────────────────────────────────────

const OnboardingSurvey = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form state
  const [username, setUsername] = useState(user?.email?.split('@')[0] || '');
  const [interests, setInterests] = useState([]);
  const [city, setCity] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [groupSize, setGroupSize] = useState('any');
  const [availability, setAvailability] = useState({});

  // Matches (step 6)
  const [matches, setMatches] = useState([]);
  const [joined, setJoined] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);

  const toggleInterest = (key) =>
    setInterests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const toggleAvailability = (day, slot) =>
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [slot]: !prev[day]?.[slot] },
    }));

  const canProceed = () => {
    if (step === 1) return username.trim().length >= 2;
    if (step === 2) return interests.length > 0;
    if (step === 3) return city.length > 0;
    if (step === 4) return playStyle.length > 0;
    return true;
  };

  const goNext = async () => {
    if (step === 5) {
      // Save profile and fetch matches before showing step 6
      await saveProfile();
      await fetchMatches();
    }
    setDir(1);
    setStep(s => s + 1);
  };

  const goPrev = () => {
    setDir(-1);
    setStep(s => s - 1);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({
        username: username.trim(),
        city,
        primary_interest: interests[0] || null,
        interests,
        play_style: playStyle,
        group_size_pref: groupSize,
        availability,
      }).eq('id', user.id);
      if (error) console.error('Profile save error:', error);
    } catch (err) {
      console.error('Profile save exception:', err);
    } finally {
      setSaving(false);
    }
  };

  const fetchMatches = async () => {
    setMatchLoading(true);
    try {
      // Build query — match by category (interests) and city
      let query = supabase
        .from('groups')
        .select('id, name, category, city, members, image, capacity')
        .order('members', { ascending: false })
        .limit(12);

      // Filter by interests if selected
      if (interests.length > 0) {
        query = query.in('category', interests);
      }

      const { data } = await query;

      // Re-rank: prioritize groups in user's city
      const sorted = (data || []).sort((a, b) => {
        const aLocal = a.city === city ? -1 : 0;
        const bLocal = b.city === city ? -1 : 0;
        return aLocal - bLocal;
      });

      setMatches(sorted.slice(0, 8));
    } catch (err) {
      console.error('Match fetch error:', err);
    } finally {
      setMatchLoading(false);
    }
  };

  const toggleJoin = async (group) => {
    if (joined.includes(group.id)) {
      // Leave
      await supabase.from('memberships').delete()
        .eq('user_id', user.id).eq('group_id', group.id);
      setJoined(prev => prev.filter(id => id !== group.id));
    } else {
      // Join — include status so it satisfies any DB CHECK constraint
      const { error } = await supabase.from('memberships').upsert({
        user_id: user.id,
        group_id: group.id,
        status: 'active',
      }, { onConflict: 'user_id,group_id' });
      if (error) console.error('Membership upsert error:', error);
      else setJoined(prev => [...prev, group.id]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
      if (error) console.error('Onboarding completion error:', error);
    } catch (err) {
      console.error('Onboarding finish exception:', err);
    } finally {
      setSaving(false);
      onComplete(); // always dismiss — even if the DB update failed
    }
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const stepLabels = ['Welcome', 'Interests', 'Location', 'Your Vibe', 'Availability', 'Your Groups'];

  return (
    <div className="fixed inset-0 z-[150] bg-surface-950/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>

        {/* Progress bar */}
        <div className="px-8 pt-8 pb-0 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Step {step} of {TOTAL_STEPS} · {stepLabels[step - 1]}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-blue-500 rounded-full"
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {step === 1 && <StepWelcome username={username} onNameChange={setUsername} />}
              {step === 2 && <StepInterests selected={interests} onToggle={toggleInterest} />}
              {step === 3 && <StepLocation city={city} onCityChange={setCity} />}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black tracking-tight text-text-primary">What's your vibe?</h2>
                    <p className="text-sm text-text-muted">Helps us match you with the right crowd.</p>
                  </div>
                  <div className="space-y-3">
                    {PLAY_STYLES.map(({ key, label, icon: Icon, desc }) => (
                      <button
                        key={key}
                        title={`Select play style: ${label}`}
                        onClick={() => setPlayStyle(key)}
                        className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${
                          playStyle === key
                            ? 'bg-brand-primary/10 border-brand-primary'
                            : 'bg-white/5 border-white/10 hover:border-brand-primary/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          playStyle === key ? 'bg-brand-primary/20' : 'bg-white/5'
                        }`}>
                          <Icon className={`w-5 h-5 ${playStyle === key ? 'text-brand-primary' : 'text-text-muted'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-black text-sm text-text-primary">{label}</div>
                          <div className="text-[11px] text-text-muted mt-0.5">{desc}</div>
                        </div>
                        {playStyle === key && <Check className="w-5 h-5 text-brand-primary shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Group size preference</p>
                    <div className="grid grid-cols-2 gap-2">
                      {GROUP_SIZES.map(({ key, label, desc }) => (
                        <button
                          key={key}
                          title={`Select group size: ${label}`}
                          onClick={() => setGroupSize(key)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            groupSize === key
                              ? 'border-brand-primary bg-brand-primary/10'
                              : 'border-white/10 bg-white/5 hover:border-brand-primary/30'
                          }`}
                        >
                          <div className={`font-bold text-xs ${groupSize === key ? 'text-brand-primary' : 'text-text-primary'}`}>{label}</div>
                          <div className="text-[10px] text-text-muted mt-0.5 leading-tight">{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 5 && <StepAvailability availability={availability} onToggle={toggleAvailability} />}
              {step === 6 && (
                <StepMatches
                  matches={matches}
                  joined={joined}
                  onToggleJoin={toggleJoin}
                  loading={matchLoading}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div className="px-8 pb-8 pt-4 border-t border-white/5 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              title="Go to previous step"
              onClick={goPrev}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-bold"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <div className="flex items-center gap-3">
              {step >= 5 && (
                <button
                  title="Skip to the next step"
                  onClick={goNext}
                  className="text-text-muted hover:text-text-primary transition-colors text-sm font-bold"
                >
                  Skip
                </button>
              )}
              <button
                title="Continue to next step"
                onClick={goNext}
                disabled={!canProceed() || saving}
                className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/80 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-40"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          ) : (
            <button
              title="Complete onboarding and enter RollCall"
              onClick={handleFinish}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500/80 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-40"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Let's Go!</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSurvey;
