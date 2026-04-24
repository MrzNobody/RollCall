import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, AlertTriangle, CheckCircle, XCircle, 
  Search, Filter, ChevronRight, MessageSquare, Flag,
  ArrowUpRight, ArrowDownRight, Clock, ShieldAlert
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeReports: 0,
    flaggedUsers: 0,
    resolvedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Reports
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      setReports(reportsData || []);

      // Fetch Stats
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: flaggedCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_flagged', true);
      const { count: pendingReports } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      setStats({
        totalUsers: userCount || 0,
        activeReports: pendingReports || 0,
        flaggedUsers: flaggedCount || 0,
        resolvedToday: 12 // Mocked for now
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId, action) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: action === 'dismiss' ? 'dismissed' : 'resolved',
          action_taken: action,
          resolved_at: new Date().toISOString()
        })
        .eq('id', reportId);
      
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-surface-950 px-6 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-3xl font-black text-text-primary tracking-tight">Command Center</h1>
            </div>
            <p className="text-text-muted text-sm font-bold uppercase tracking-widest">Platform Moderation & Oversight</p>
          </div>

          <div className="grid grid-cols-2 md:flex gap-4">
            <StatCard icon={Users} label="Total Residents" value={stats.totalUsers.toLocaleString()} color="text-blue-500" />
            <StatCard icon={Flag} label="Pending Reports" value={stats.activeReports} color="text-rose-500" />
            <StatCard icon={ShieldAlert} label="Flagged Users" value={stats.flaggedUsers} color="text-orange-500" />
            <StatCard icon={CheckCircle} label="Resolved Today" value={stats.resolvedToday} color="text-emerald-500" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <TabButton 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')} 
              icon={AlertTriangle} 
              label="Active Reports" 
              count={stats.activeReports}
            />
            <TabButton 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
              icon={Users} 
              label="User Directory" 
            />
            <TabButton 
              active={activeTab === 'logs'} 
              onClick={() => setActiveTab('logs')} 
              icon={Clock} 
              label="Audit Logs" 
            />
          </div>

          {/* Table / List View */}
          <div className="lg:col-span-3">
            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Filter by user or reason..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-brand-primary/50 transition-all"
                  />
                </div>
                <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-text-muted hover:text-text-primary transition-all">
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Scanning Platform...</span>
                  </div>
                ) : reports.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">Reporter</th>
                        <th className="px-6 py-4">Target / Type</th>
                        <th className="px-6 py-4">Reason</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                                {report.reporter_id?.slice(0, 2).toUpperCase() || 'SYS'}
                              </div>
                              <span className="text-xs font-bold text-text-primary">System AI</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-text-primary">{report.target_type === 'profile' ? 'User Account' : 'Group'}</span>
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter">{report.target_id.slice(0, 8)}...</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-rose-500">{report.reason}</span>
                              <span className="text-[10px] text-text-secondary line-clamp-1">{report.description}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                              report.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                              'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleAction(report.id, 'dismiss')}
                                className="p-2 bg-white/5 rounded-lg border border-white/10 text-text-muted hover:text-text-primary hover:bg-white/10 transition-all"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleAction(report.id, 'resolve')}
                                className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
                    <Shield className="w-12 h-12 text-emerald-500/20" />
                    <div>
                      <h4 className="text-lg font-bold text-text-primary">PBC is Quiet Today</h4>
                      <p className="text-sm text-text-muted">Zero pending reports. The community is behaving!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass p-4 rounded-2xl border border-white/10 min-w-[140px]">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</span>
    </div>
    <div className="text-xl font-black text-text-primary">{value}</div>
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
      active 
        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10' 
        : 'bg-white/5 border-white/10 text-text-muted hover:text-text-primary hover:bg-white/10'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
    </div>
    {count !== undefined && (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${active ? 'bg-brand-primary text-white' : 'bg-white/10 text-text-muted'}`}>
        {count}
      </span>
    )}
  </button>
);

export default AdminDashboard;
