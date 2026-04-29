import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users, Rocket, Loader2, Wifi, Building2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getGroupImage } from '../lib/groupImage';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const ONLINE_CATEGORIES = new Set([
  'FPS Gaming', 'Battle Royale', 'MOBA', 'MMO / RPG', 'Card Games',
  'Strategy Games', 'Fighting Games', 'Indie Games', 'Simulation'
]);

const getDefaultMeetingType = (category) =>
  ONLINE_CATEGORIES.has(category) ? 'online' : 'in-person';

const MeetingTypePicker = ({ value, onChange }) => {
  const options = [
    { id: 'online',     icon: Wifi,      label: 'Online',     sub: 'Play remotely — no location needed' },
    { id: 'in-person',  icon: Building2, label: 'In-Person',  sub: 'Meet at a local venue or park' },
    { id: 'lan-party',  icon: Zap,       label: 'LAN Party',  sub: 'Everyone brings their rig to one spot' },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map(opt => (
        <button
          key={opt.id}
          type="button"
          title={`Choose ${opt.label} meeting type`}
          onClick={() => onChange(opt.id)}
          className={`flex flex-col items-start gap-2 p-5 rounded-2xl border-2 transition-all text-left ${
            value === opt.id
              ? 'border-brand-primary bg-brand-primary/10 text-text-primary'
              : 'border-white/10 bg-white/5 text-text-muted hover:border-white/20'
          }`}
        >
          <opt.icon className={`w-5 h-5 ${value === opt.id ? 'text-brand-primary' : ''}`} />
          <div>
            <div className="text-sm font-black uppercase tracking-wider">{opt.label}</div>
            <div className="text-[10px] font-medium mt-0.5 leading-snug">{opt.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

const LocationPicker = ({ coords, setCoords }) => {
  useMapEvents({
    click(e) { setCoords([e.latlng.lat, e.latlng.lng]); },
  });
  return coords ? <Marker position={coords} /> : null;
};

const TOTAL_STEPS = 3; // always 3 logical steps; map step skipped for online

const CreateGroup = ({ onCancel, onCreated, user }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'FPS Gaming',
    meetingType: 'online',
    city: '',
    description: '',
    capacity: 10,
    skill: 'Casual',
    coords: [26.7153, -80.0534],
  });

  const isOnline = formData.meetingType === 'online';

  // Steps: 1 = Basics, 2 = Location (skipped if online), 3 = Final Details
  const nextStep = () => {
    if (step === 1 && isOnline) {
      setStep(3); // skip map
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step === 3 && isOnline) {
      setStep(1); // skip back over map
    } else {
      setStep(s => s - 1);
    }
  };

  // Progress: treat online flow as 2 steps (1 & 3), in-person as 3 steps
  const progressPct = isOnline
    ? (step === 1 ? 50 : 100)
    : (step / 3) * 100;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        capacity: formData.capacity,
        skill: formData.skill,
        created_by: user?.id,
        members: 1,
        image: getGroupImage(formData.name, formData.category),
      };

      if (isOnline) {
        payload.city = 'Online';
        payload.coords = null;
      } else {
        payload.city = formData.city;
        payload.coords = formData.coords;
      }

      const { data, error } = await supabase
        .from('groups')
        .insert([payload])
        .select();

      if (error) throw error;

      if (user?.id && data[0]?.id) {
        await supabase.from('memberships').insert({ user_id: user.id, group_id: data[0].id });
      }

      onCreated(data[0]);
    } catch (err) {
      console.error('Error creating group:', err);
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = step === 3;

  return (
    <div className="pt-24 min-h-screen bg-surface-950 px-6 md:px-12 flex items-center justify-center">
      <div className="w-full max-w-4xl glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div
            animate={{ width: `${progressPct}%` }}
            className="h-full bg-brand-primary shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-500"
          />
        </div>

        <button
          title="Cancel creating a group"
          onClick={onCancel}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Cancel
        </button>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: Basics ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-black mb-2 text-text-primary">The Basics</h2>
                <p className="text-text-secondary">What's the soul of your group?</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Group Name</label>
                  <input
                    type="text"
                    placeholder="e.g. WPB Casual Chess Club"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-brand-primary transition-all text-lg font-bold text-text-primary placeholder:text-text-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => {
                      const cat = e.target.value;
                      setFormData({ ...formData, category: cat, meetingType: getDefaultMeetingType(cat) });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-brand-primary transition-all appearance-none text-text-primary"
                  >
                    {["FPS Gaming", "Dungeons & Dragons", "Board Games", "Hiking", "Soccer", "Pickleball", "Other"].map(cat => (
                      <option key={cat} value={cat} className="bg-surface-900 text-white">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">How Do You Meet?</label>
                  <MeetingTypePicker
                    value={formData.meetingType}
                    onChange={v => setFormData({ ...formData, meetingType: v })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Location (in-person & LAN only) ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-black mb-2">
                  {formData.meetingType === 'lan-party' ? 'LAN Venue' : "Where's the Meet?"}
                </h2>
                <p className="text-white/40">
                  {formData.meetingType === 'lan-party'
                    ? 'Pin the venue where everyone will bring their setup.'
                    : 'Pin the exact location in Palm Beach County.'}
                </p>
              </div>
              <div className="h-80 w-full rounded-3xl overflow-hidden border border-white/10 relative">
                <MapContainer center={formData.coords} zoom={13} className="h-full w-full z-0">
                  <TileLayer
                    url={document.documentElement.classList.contains('theme-light')
                      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
                  />
                  <LocationPicker coords={formData.coords} setCoords={c => setFormData({ ...formData, coords: c })} />
                </MapContainer>
                <div className="absolute bottom-4 left-4 z-10 glass px-4 py-2 rounded-xl text-[10px] font-bold text-text-primary">
                  CLICK MAP TO SET PIN
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">City Name</label>
                <input
                  type="text"
                  placeholder="e.g. West Palm Beach"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-primary transition-all text-text-primary placeholder:text-text-muted"
                />
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Final Details ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-black mb-2">Final Details</h2>
                <p className="text-white/40">Set the rules of engagement.</p>
              </div>

              {isOnline && (
                <div className="flex items-center gap-3 px-5 py-4 bg-brand-primary/10 border border-brand-primary/30 rounded-2xl">
                  <Wifi className="w-4 h-4 text-brand-primary shrink-0" />
                  <p className="text-xs font-bold text-brand-primary">Online group — no meeting location required. Members play remotely.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Max Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Skill Level</label>
                  <select
                    value={formData.skill}
                    onChange={e => setFormData({ ...formData, skill: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-text-primary"
                  >
                    <option value="Casual" className="bg-surface-900 text-white">Casual</option>
                    <option value="Intermediate" className="bg-surface-900 text-white">Intermediate</option>
                    <option value="Competitive" className="bg-surface-900 text-white">Competitive</option>
                    <option value="Pro" className="bg-surface-900 text-white">Pro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Description</label>
                <textarea
                  rows={4}
                  placeholder="Tell everyone what makes this group awesome..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-primary transition-all text-text-primary placeholder:text-text-muted"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between items-center">
          {step > 1 ? (
            <button
              title="Go to previous step"
              onClick={prevStep}
              className="px-6 py-4 rounded-2xl font-bold text-text-secondary hover:text-text-primary transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          ) : <div />}

          <button
            title={isLastStep ? "Create and launch this group" : "Continue to next step"}
            onClick={isLastStep ? handleSubmit : nextStep}
            disabled={loading}
            className="bg-brand-primary px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/80 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 min-w-[160px]"
          >
            {loading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : isLastStep ? 'Launch Group' : 'Next Step'}
            {!loading && (isLastStep
              ? <Rocket className="w-5 h-5 ml-2" />
              : <ChevronRight className="w-5 h-5" />)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
