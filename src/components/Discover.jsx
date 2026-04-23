import React, { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, Map as MapIcon, Search, Filter, ChevronRight, Users, Zap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { mockGroups } from '../data/mockGroups';

// Fix for default marker icons in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const GroupCard = ({ group, onClick }) => (
  <div 
    onClick={onClick}
    className="glass rounded-2xl overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col h-full cursor-pointer active:scale-[0.98]"
  >
    <div className="relative h-40 overflow-hidden">
      <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold tracking-wider uppercase border border-white/10">
        {group.category}
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 bg-brand-primary rounded-lg text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-brand-primary/40">
        {group.skill}
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="font-bold text-lg mb-1 group-hover:text-brand-primary transition-colors">{group.name}</h3>
      <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
        <span>{group.city}</span>
        <span>•</span>
        <div className="flex items-center gap-1 font-medium">
          <Users className="w-3 h-3" />
          {group.members}/{group.capacity}
        </div>
      </div>
      <p className="text-white/60 text-sm mb-6 line-clamp-2 leading-relaxed">
        {group.description}
      </p>
      <button className="mt-auto w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all shadow-sm">
        View Group
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const Discover = ({ onSelectGroup }) => {
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const { data, error } = await supabase.from('groups').select('*');
        if (error) throw error;
        
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
        console.warn('Using fallback data:', err.message);
        if (isMounted) setGroups(mockGroups);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  return (
    <div className="pt-24 min-h-screen flex flex-col bg-surface-950">
      {/* Search & Filter Header */}
      <div className="sticky top-16 z-40 bg-surface-950/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input 
              type="text" 
              placeholder="Search groups in Palm Beach County..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-brand-primary/50 transition-all text-sm placeholder:text-white/20"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {isLive && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                <Zap className="w-3 h-3 fill-emerald-400 animate-pulse" />
                Live Cloud Sync
              </div>
            )}
            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 ml-auto">
              <button 
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-white/40 hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                List
              </button>
              <button 
                onClick={() => setView('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'map' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-white/40 hover:text-white'}`}
              >
                <MapIcon className="w-4 h-4" />
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : view === 'list' ? (
          <div className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {filteredGroups.map(group => (
              <GroupCard key={group.id} group={group} onClick={() => onSelectGroup(group)} />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 z-0 animate-fade-in">
            <MapContainer 
              center={[26.65, -80.1]} 
              zoom={10} 
              style={{ height: 'calc(100vh - 160px)', width: '100%' }}
              className="bg-surface-950 z-0"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
              />
              {filteredGroups.map(group => (
                <Marker 
                  key={group.id} 
                  position={group.coords} 
                  icon={DefaultIcon}
                  eventHandlers={{ click: () => onSelectGroup(group) }}
                >
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[180px]">
                      <h4 className="font-bold text-black text-sm mb-1">{group.name}</h4>
                      <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold tracking-wider">{group.city} • {group.category}</p>
                      <button 
                        onClick={() => onSelectGroup(group)}
                        className="w-full py-2 bg-brand-primary text-white rounded-lg text-xs font-bold shadow-md active:scale-95 transition-transform"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
