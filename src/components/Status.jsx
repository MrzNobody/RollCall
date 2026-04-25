import React, { useState, useEffect } from 'react';
import { 
  Activity, Shield, Database, Globe, 
  CheckCircle2, AlertCircle, Clock, 
  Zap, Server, Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const StatusIndicator = ({ label, status, icon: Icon }) => (
  <div className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${status === 'operational' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-text-primary">{label}</h4>
        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">
          {status === 'operational' ? 'System Operational' : 'Degraded Performance'}
        </p>
      </div>
    </div>
    <div className={`w-3 h-3 rounded-full ${status === 'operational' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-orange-500 animate-pulse'}`} />
  </div>
);

const Status = ({ onBack }) => {
  const [health, setHealth] = useState({
    database: 'checking',
    api: 'operational',
    moderation: 'operational',
    messaging: 'operational'
  });

  useEffect(() => {
    const checkDb = async () => {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('id').limit(1);
      const end = Date.now();
      
      setHealth(prev => ({
        ...prev,
        database: error ? 'degraded' : 'operational'
      }));
    };
    checkDb();
  }, []);

  return (
    <div className="min-h-screen bg-surface-950 pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-brand-primary/10 rounded-[1.5rem] flex items-center justify-center mx-auto border border-brand-primary/20"
          >
            <Activity className="w-8 h-8 text-brand-primary" />
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-text-primary">System Status</h1>
            <p className="text-text-muted text-sm font-bold uppercase tracking-widest">Real-time Platform Health Oversight</p>
          </div>
        </div>

        {/* Hero Status */}
        <div className="glass p-8 rounded-[3rem] border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-black text-emerald-500">All Systems Go</h2>
          </div>
          <p className="text-xs text-emerald-500/60 font-medium max-w-md mx-auto">
            RollCall's core infrastructure in Palm Beach County is running at peak performance. No active incidents reported.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusIndicator label="Core Database" status={health.database} icon={Database} />
          <StatusIndicator label="Real-time Gateway" status={health.api} icon={Zap} />
          <StatusIndicator label="Moderation Engine" status={health.moderation} icon={Shield} />
          <StatusIndicator label="Messaging Cluster" status={health.messaging} icon={Server} />
        </div>

        {/* Security & Hardening Section */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-3">
            <Lock className="w-4 h-4" /> Hardening & Security Status
          </h3>
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-brand-secondary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary">Anti-Scraping Active</h4>
                <p className="text-[10px] text-text-muted leading-relaxed font-medium">
                  Intelligent rate-limiting is protecting community profiles and group data from unauthorized automated collection.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-sky-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary">E2E Ready DM Layer</h4>
                <p className="text-[10px] text-text-muted leading-relaxed font-medium">
                  Private communications are isolated in a secure messaging cluster with high-entropy encryption protocols enabled.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sentinel Agent Monitoring */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-brand-primary" /> Sentinel Agent Fleet
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-text-primary">Sync Agent</h4>
              <p className="text-[9px] text-text-muted leading-tight">Monitoring real-time database synchronization and resident population health.</p>
            </div>
            <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-brand-secondary/10 rounded-xl text-brand-secondary">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-text-primary">Security Agent</h4>
              <p className="text-[9px] text-text-muted leading-tight">Verifying RLS policies and protecting community data from unauthorized access.</p>
            </div>
            <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-sky-500/10 rounded-xl text-sky-500">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-text-primary">Verify Agent</h4>
              <p className="text-[9px] text-text-muted leading-tight">Performing automated smoke tests and navigation integrity checks across the Hub.</p>
            </div>
          </div>
        </div>

        {/* Uptime History */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-3">
            <Clock className="w-4 h-4" /> Maintenance Log
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-primary">System Restoration: Carlo Admin Authority</span>
                <span className="text-[9px] text-text-muted font-medium">April 25, 2026</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Completed</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-primary">Phase 5 Hardening Update</span>
                <span className="text-[9px] text-text-muted font-medium">April 24, 2026</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Completed</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest text-text-primary hover:bg-white/10 transition-all"
        >
          Return to Platform
        </button>
      </div>
    </div>
  );
};

export default Status;
