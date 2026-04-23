import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users, Info, Rocket, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const LocationPicker = ({ coords, setCoords }) => {
  useMapEvents({
    click(e) {
      setCoords([e.latlng.lat, e.latlng.lng]);
    },
  });
  return coords ? <Marker position={coords} /> : null;
};

const CreateGroup = ({ onBack, onSuccess, userId }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'FPS Gaming',
    city: '',
    description: '',
    capacity: 10,
    skill: 'Casual',
    coords: [26.7153, -80.0534] // Default WPB
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([{
          ...formData,
          members: 1, // The creator is the first member
          image: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800` // Default placeholder
        }])
        .select();

      if (error) throw error;
      onSuccess(data[0]);
    } catch (err) {
      console.error('Error creating group:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-surface-950 px-6 md:px-12 flex items-center justify-center">
      <div className="w-full max-w-4xl glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-brand-primary shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          />
        </div>

        <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" />
          Cancel
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-black mb-2">The Basics</h2>
                <p className="text-white/40">What's the soul of your group?</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Group Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. WPB Casual Chess Club"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-brand-primary transition-all text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-brand-primary transition-all appearance-none text-white/80"
                  >
                    {["FPS Gaming", "Dungeons & Dragons", "Board Games", "Hiking", "Soccer", "Pickleball", "Other"].map(cat => (
                      <option key={cat} value={cat} className="bg-surface-900">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-black mb-2">Where's the Meet?</h2>
                <p className="text-white/40">Pin the exact location in PBC.</p>
              </div>
              <div className="h-80 w-full rounded-3xl overflow-hidden border border-white/10 relative">
                <MapContainer center={formData.coords} zoom={13} className="h-full w-full z-0">
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <LocationPicker coords={formData.coords} setCoords={c => setFormData({...formData, coords: c})} />
                </MapContainer>
                <div className="absolute bottom-4 left-4 z-10 glass px-4 py-2 rounded-xl text-[10px] font-bold">
                  CLICK MAP TO SET PIN
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">City Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. West Palm Beach"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-4xl font-black mb-2">Final Details</h2>
                <p className="text-white/40">Set the rules of engagement.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Max Capacity</label>
                  <input 
                    type="number" 
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Skill Level</label>
                  <select 
                    value={formData.skill}
                    onChange={e => setFormData({...formData, skill: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Competitive">Competitive</option>
                    <option value="Pro">Pro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Tell everyone what makes this group awesome..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between items-center">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-6 py-4 rounded-2xl font-bold text-white/40 hover:text-white transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          ) : <div />}

          <button 
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
            disabled={loading}
            className="bg-brand-primary px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/80 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 min-w-[160px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step < 3 ? 'Next Step' : 'Launch Group')}
            {!loading && (step < 3 ? <ChevronRight className="w-5 h-5" /> : <Rocket className="w-5 h-5 ml-2" />)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
