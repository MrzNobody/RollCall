import React, { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, Map as MapIcon, Search, Filter, ChevronRight, Users, Zap, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { mockGroups } from '../data/mockGroups';
import WaitlistModal from './WaitlistModal';
import { Rocket, Globe } from 'lucide-react';

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const GroupCard = ({ group, onClick }) => {
  const handleGetDirections = (e) => {
    e.stopPropagation();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${group.coords[0]},${group.coords[1]}`, '_blank');
      }, () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${group.coords[0]},${group.coords[1]}`, '_blank');
      });
    }
  };

  return (
    <div 
      onClick={onClick}
      className="glass rounded-3xl overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col h-full cursor-pointer active:scale-[0.98]"
    >
      <div className="relative h-32 md:h-40 overflow-hidden">
        <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2 px-2 py-1 bg-surface-950/60 backdrop-blur-md rounded-lg text-[9px] font-black tracking-widest uppercase border border-white/10 text-text-primary">
          {group.category}
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-brand-primary rounded-lg text-[9px] font-black tracking-widest uppercase shadow-lg shadow-brand-primary/40 text-white">
          {group.skill}
        </div>
      </div>
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-base md:text-lg mb-1 group-hover:text-brand-primary transition-colors truncate text-text-primary">{group.name}</h3>
        <div className="flex items-center gap-2 text-text-secondary text-[10px] md:text-xs mb-3">
          <span>{group.city}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {group.members}/{group.capacity}
          </div>
        </div>
        <div className="flex gap-2 mt-auto">
          <button className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl font-bold text-[10px] hover:bg-brand-primary group-hover:border-brand-primary transition-all flex items-center justify-center gap-2 text-text-primary">
            Details
          </button>
          <button 
            onClick={handleGetDirections}
            className="px-4 py-2.5 bg-brand-secondary/20 border border-brand-secondary/30 rounded-xl font-bold text-[10px] hover:bg-brand-secondary text-brand-secondary hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Route
          </button>
        </div>
      </div>
    </div>
  );
};

const Discover = ({ onSelectGroup, initialCategory = 'All' }) => {
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState(null);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const { data, error } = await supabase.from('groups').select('id, name, image, category, skill, city, members, capacity, coords, description, owner_id');
        if (isMounted) {
          if (data && data.length > 0) {
            const normalized = data.map(g => ({
              ...g,
              coords: typeof g.coords === 'string' ? JSON.parse(g.coords) : g.coords
            }));
            setGroups(normalized);
            setIsLive(true);
          } else {
            setGroups(mockGroups);
          }
        }
      } catch (err) {
        if (isMounted) setGroups(mockGroups);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    
    const fetchCounties = async () => {
      const { data } = await supabase.from('counties').select('id, name, status').eq('status', 'Active');
      if (data && data.length > 0) {
        setCounties(data);
        setSelectedCounty(data[0]);
      }
    };
    fetchCounties();

    return () => { isMounted = false; };
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           g.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || g.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [groups, searchQuery, activeCategory]);

  return (
    <div className="pt-20 md:pt-24 min-h-screen flex flex-col bg-surface-950">
      {/* Search & Mobile Filter Bar */}
      <div className="sticky top-16 z-40 bg-surface-950/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-12 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-6 focus:outline-none focus:border-brand-primary/50 transition-all text-xs md:text-sm text-text-primary placeholder:text-text-muted"
                />
              </div>
              <select 
                value={selectedCounty?.id}
                onChange={(e) => setSelectedCounty(counties.find(c => c.id === e.target.value))}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:py-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-brand-primary/50 transition-all cursor-pointer"
              >
                {counties.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 flex-1 md:flex-none">
                <button 
                  onClick={() => setView('list')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button 
                  onClick={() => setView('map')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all ${view === 'map' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <MapIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
              {isLive && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-widest uppercase">
                  <Zap className="w-3 h-3 fill-emerald-400 animate-pulse" />
                  LIVE
                </div>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {['All', 'Gaming', 'Tabletop', 'Sports', 'Other'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                    ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                    : 'bg-white/5 border-white/10 text-text-muted hover:text-text-primary hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : view === 'list' ? (
          <div className="max-w-7xl mx-auto p-4 md:p-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 animate-fade-in">
            {filteredGroups.map(group => (
              <GroupCard key={group.id} group={group} onClick={() => onSelectGroup(group)} />
            ))}

            {filteredGroups.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-32 text-center space-y-8 animate-fade-in">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/5">
                  <Rocket className="w-12 h-12 text-text-muted opacity-20" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-text-primary">No communities here yet</h3>
                  <p className="text-sm text-text-muted max-w-xs mx-auto font-medium">
                    We're currently focusing our pilot on <span className="text-brand-primary font-bold">Palm Beach County</span>. Want us to expand to your neighborhood next?
                  </p>
                  <button 
                    onClick={() => setShowWaitlist(true)}
                    className="bg-brand-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20"
                  >
                    Join the Expansion Waitlist
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 z-0 animate-fade-in">
            <MapContainer 
              center={[26.65, -80.1]} 
              zoom={10} 
              style={{ height: '100%', width: '100%' }}
              className="bg-surface-950 z-0"
              zoomControl={false}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer name="Clean Light" checked={document.documentElement.classList.contains('theme-light')}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Detailed Streets (Names)" checked={false}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Clean Dark" checked={!document.documentElement.classList.contains('theme-light')}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite View">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; Esri'
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {filteredGroups.map(group => (
                <Marker 
                  key={group.id} 
                  position={group.coords} 
                  icon={DefaultIcon}
                >
                  <Popup className="custom-popup">
                    <div className="p-3 min-w-[180px]">
                      <h4 className="font-bold text-text-primary text-sm mb-1">{group.name}</h4>
                      <p className="text-[10px] text-text-secondary mb-3 uppercase font-black tracking-widest">{group.city} • {group.category}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onSelectGroup(group)}
                          className="flex-1 py-2 bg-surface-900 text-text-primary border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all"
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => {
                            const dest = `${group.coords[0]},${group.coords[1]}`;
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition((position) => {
                                const { latitude, longitude } = position.coords;
                                window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${dest}`, '_blank');
                              }, (err) => {
                                console.warn("Geolocation error:", err);
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
                              });
                            } else {
                              window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
                            }
                          }}
                          className="px-3 py-2 bg-brand-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform"
                        >
                          Route
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      <WaitlistModal 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)} 
        initialCity={searchQuery}
      />
    </div>
  );
};

export default Discover;
