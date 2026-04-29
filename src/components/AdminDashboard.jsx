import React, { useState, useEffect } from 'react';
import {
  Shield, Users, AlertTriangle, CheckCircle, XCircle,
  Search, Filter, ChevronRight, MessageSquare, Flag,
  ArrowUpRight, ArrowDownRight, Clock, ShieldAlert, LifeBuoy, Globe,
  AlertOctagon, Ban, ShieldOff, TriangleAlert, X, FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [counties, setCounties] = useState([]);
  const [badActors, setBadActors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeReports: 0,
    flaggedUsers: 0,
    resolvedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: reportsData } = await supabase
        .from('reports')
        .select('id, reporter_id, target_id, target_type, reason, description, status, action_taken, created_at, resolved_at')
        .order('created_at', { ascending: false });
      setReports(reportsData || []);

      const { count: userCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      const { count: flaggedCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_flagged', true);
      const { count: pendingReports } = await supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending');

      setStats({
        totalUsers: userCount || 0,
        activeReports: pendingReports || 0,
        flaggedUsers: flaggedCount || 0,
        resolvedToday: 12
      });

      // Fetch flagged users with their report counts
      const { data: flaggedProfiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, city, primary_interest, platform, warning_count, trust_score, rating, review_count, bio')
        .eq('is_flagged', true)
        .order('warning_count', { ascending: false });

      if (flaggedProfiles && flaggedProfiles.length > 0) {
        const enriched = await Promise.all(flaggedProfiles.map(async (profile) => {
          const { count } = await supabase
            .from('reports')
            .select('id', { count: 'exact', head: true })
            .eq('target_id', profile.id)
            .eq('status', 'pending');
          return { ...profile, openReports: count || 0 };
        }));
        setBadActors(enriched);
      } else {
        setBadActors([]);
      }

      // Fetch all users for user directory
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, username, full_name, city, primary_interest, platform, warning_count, trust_score, is_flagged, is_admin')
        .order('is_flagged', { ascending: false })
        .order('warning_count', { ascending: false })
        .limit(100);
      setAllUsers(usersData || []);

      const { data: ticketsData } = await supabase
        .from('support_tickets')
        .select('id, user_id, category, subject, description, status, priority, created_at, profiles(username, full_name)')
        .order('created_at', { ascending: false });
      setTickets(ticketsData || []);

      const { data: logsData } = await supabase
        .from('admin_audit_log')
        .select('id, admin_id, action, target_id, details, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      setLogs(logsData || []);

      const { data: countiesData } = await supabase
        .from('counties')
        .select('id, name, status, waitlist_count, created_at')
        .order('name', { ascending: true });
      setCounties(countiesData || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (action, targetId, details) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('admin_audit_log').insert([{
      admin_id: user.id,
      action,
      target_id: targetId,
      details
    }]);
  };

  const handleAction = async (reportId, action) => {
    try {
      await supabase
        .from('reports')
        .update({
          status: action === 'dismiss' ? 'dismissed' : 'resolved',
          action_taken: action,
          resolved_at: new Date().toISOString()
        })
        .eq('id', reportId);
      await logAction(`Report ${action === 'dismiss' ? 'Dismiss' : 'Resolve'}`, reportId, { action });
      fetchData();
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleTicketAction = async (ticketId, status) => {
    try {
      await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
      await logAction('Support Ticket Status Update', ticketId, { status });
      fetchData();
    } catch (err) {
      console.error('Ticket update failed:', err);
    }
  };

  const handleBadActorAction = async (profileId, action) => {
    setActionLoading(`${profileId}-${action}`);
    try {
      let updatePayload = {};
      let logMsg = '';

      if (action === 'warn') {
        updatePayload = { warning_count: (badActors.find(b => b.id === profileId)?.warning_count || 0) + 1 };
        logMsg = 'Warning Issued';
      } else if (action === 'suspend') {
        updatePayload = { is_flagged: true, trust_score: 0, warning_count: 5 };
        logMsg = 'User Suspended';
      } else if (action === 'clear') {
        updatePayload = { is_flagged: false, warning_count: 0, trust_score: 75 };
        logMsg = 'Flag Cleared';
      }

      await supabase.from('profiles').update(updatePayload).eq('id', profileId);
      await logAction(logMsg, profileId, { action });
      fetchData();
    } catch (err) {
      console.error('Bad actor action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReports = reports.filter(r =>
    !searchQuery || r.reason?.toLowerCase().includes(searchQuery.toLowerCase()) || r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUsers = allUsers.filter(u =>
    !searchQuery || u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || u.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBadActors = badActors.filter(b =>
    !searchQuery || b.username?.toLowerCase().includes(searchQuery.toLowerCase()) || b.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={AlertTriangle} label="Active Reports" count={stats.activeReports} />
            <TabButton active={activeTab === 'badactors'} onClick={() => setActiveTab('badactors')} icon={AlertOctagon} label="Bad Actors" count={stats.flaggedUsers} danger />
            <TabButton active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={LifeBuoy} label="Support Tickets" count={tickets.filter(t => t.status === 'Open').length} />
            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="User Directory" />
            <TabButton active={activeTab === 'counties'} onClick={() => setActiveTab('counties')} icon={Globe} label="County Manager" count={counties.filter(c => c.status === 'Waitlist').length} />
            <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={Clock} label="Audit Logs" />
          </div>

          {/* Table / List View */}
          <div className="lg:col-span-3">
            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Filter by user, reason, city..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
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

                ) : activeTab === 'reports' ? (
                  filteredReports.length > 0 ? (
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
                        {filteredReports.map((report) => (
                          <tr key={report.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                                  {report.reporter_id?.slice(0, 2).toUpperCase() || 'SYS'}
                                </div>
                                <span className="text-xs font-bold text-text-primary">Resident</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-primary">{report.target_type === 'profile' ? 'User Account' : 'Group'}</span>
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter">{String(report.target_id).slice(0, 8)}...</span>
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
                                <button onClick={() => handleAction(report.id, 'dismiss')} className="p-2 bg-white/5 rounded-lg border border-white/10 text-text-muted hover:text-text-primary hover:bg-white/10 transition-all">
                                  <XCircle className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleAction(report.id, 'resolve')} className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">
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
                  )

                ) : activeTab === 'badactors' ? (
                  <div className="p-0">
                    {/* Bad Actors Header Banner */}
                    <div className="px-6 py-4 bg-rose-500/5 border-b border-rose-500/20 flex items-center gap-3">
                      <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0" />
                      <p className="text-xs font-bold text-rose-400">
                        {filteredBadActors.length} flagged {filteredBadActors.length === 1 ? 'account' : 'accounts'} — sorted by severity. Use action buttons to warn, suspend, or clear flags.
                      </p>
                    </div>
                    {filteredBadActors.length > 0 ? (
                      <div className="divide-y divide-white/5">
                        {filteredBadActors.map((actor) => (
                          <motion.div
                            key={actor.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 hover:bg-white/5 transition-all group"
                          >
                            <div className="flex items-start gap-5">
                              {/* Avatar */}
                              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black text-sm shrink-0">
                                {actor.username?.slice(0, 2).toUpperCase()}
                              </div>

                              {/* Main Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                  <span className="font-black text-text-primary">@{actor.username}</span>
                                  {actor.full_name && actor.full_name !== 'Anonymous User' && (
                                    <span className="text-xs text-text-muted">{actor.full_name}</span>
                                  )}
                                  <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Flag className="w-2.5 h-2.5" /> Flagged
                                  </span>
                                </div>

                                <p className="text-xs text-text-muted mb-3 line-clamp-1 italic">"{actor.bio}"</p>

                                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider">
                                  <span className="flex items-center gap-1.5 text-text-muted">
                                    <Globe className="w-3 h-3" /> {actor.city || 'Unknown'}
                                  </span>
                                  <span className={`flex items-center gap-1.5 ${actor.warning_count >= 4 ? 'text-rose-500' : actor.warning_count >= 2 ? 'text-orange-500' : 'text-yellow-500'}`}>
                                    <TriangleAlert className="w-3 h-3" /> {actor.warning_count} Warning{actor.warning_count !== 1 ? 's' : ''}
                                  </span>
                                  <span className={`flex items-center gap-1.5 ${actor.trust_score <= 15 ? 'text-rose-500' : actor.trust_score <= 30 ? 'text-orange-500' : 'text-yellow-500'}`}>
                                    <ShieldAlert className="w-3 h-3" /> Trust Score: {actor.trust_score}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-rose-400">
                                    <Flag className="w-3 h-3" /> {actor.openReports} Open Report{actor.openReports !== 1 ? 's' : ''}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-text-muted">
                                    <Users className="w-3 h-3" /> {actor.primary_interest} · {actor.platform}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleBadActorAction(actor.id, 'warn')}
                                  disabled={actionLoading === `${actor.id}-warn`}
                                  title="Issue Warning"
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                                >
                                  {actionLoading === `${actor.id}-warn` ? (
                                    <div className="w-3 h-3 border border-orange-500 border-t-transparent rounded-full animate-spin" />
                                  ) : <TriangleAlert className="w-3 h-3" />}
                                  Warn
                                </button>
                                <button
                                  onClick={() => handleBadActorAction(actor.id, 'suspend')}
                                  disabled={actionLoading === `${actor.id}-suspend`}
                                  title="Suspend Account"
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                                >
                                  {actionLoading === `${actor.id}-suspend` ? (
                                    <div className="w-3 h-3 border border-rose-500 border-t-transparent rounded-full animate-spin" />
                                  ) : <Ban className="w-3 h-3" />}
                                  Suspend
                                </button>
                                <button
                                  onClick={() => handleBadActorAction(actor.id, 'clear')}
                                  disabled={actionLoading === `${actor.id}-clear`}
                                  title="Clear Flag"
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                                >
                                  {actionLoading === `${actor.id}-clear` ? (
                                    <div className="w-3 h-3 border border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                  ) : <ShieldOff className="w-3 h-3" />}
                                  Clear
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
                        <Shield className="w-12 h-12 text-emerald-500/20" />
                        <div>
                          <h4 className="text-lg font-bold text-text-primary">No Flagged Users</h4>
                          <p className="text-sm text-text-muted">The community is in good standing.</p>
                        </div>
                      </div>
                    )}
                  </div>

                ) : activeTab === 'tickets' ? (
                  <table className="w-full text-left">
                      <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4">From</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {tickets.map((ticket) => {
                          const displayName = ticket.profiles?.username
                            ? `@${ticket.profiles.username}`
                            : ticket.profiles?.full_name || `User ${ticket.user_id?.slice(0, 6)}`;
                          return (
                            <tr
                              key={ticket.id}
                              onClick={() => setSelectedTicket(ticket)}
                              className="hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center text-[9px] font-black text-brand-primary shrink-0">
                                    {(ticket.profiles?.username || ticket.profiles?.full_name || '?')[0].toUpperCase()}
                                  </div>
                                  <span className="text-xs font-bold text-text-primary">{displayName}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-xs font-medium text-text-secondary max-w-[200px] truncate">{ticket.subject}</td>
                              <td className="px-6 py-5">
                                <span className="px-2 py-1 rounded-md bg-white/5 text-[8px] font-black uppercase tracking-widest text-text-muted border border-white/10">{ticket.category}</span>
                              </td>
                              <td className="px-6 py-5 text-[10px] text-text-muted font-medium">
                                {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="px-6 py-5">
                                <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                  ticket.status === 'Open'
                                    ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                }`}>{ticket.status}</span>
                              </td>
                              <td className="px-6 py-5 text-right" onClick={e => e.stopPropagation()}>
                                {ticket.status === 'Open' && (
                                  <button
                                    onClick={() => handleTicketAction(ticket.id, 'Resolved')}
                                    className="px-3 py-1.5 bg-brand-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Resolve
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                ) : activeTab === 'users' ? (
                  <div>
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">City</th>
                          <th className="px-6 py-4">Interest</th>
                          <th className="px-6 py-4">Trust</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className={`hover:bg-white/5 transition-colors ${u.is_flagged ? 'bg-rose-500/5' : ''}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${u.is_flagged ? 'bg-rose-500/20 text-rose-400' : 'bg-brand-primary/20 text-brand-primary'}`}>
                                  {u.username?.slice(0, 2).toUpperCase() || '??'}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-text-primary flex items-center gap-2">
                                    @{u.username || 'unknown'}
                                    {u.is_admin && <span className="px-1.5 py-0.5 bg-brand-primary/20 text-brand-primary rounded text-[7px] font-black uppercase">Admin</span>}
                                  </div>
                                  <div className="text-[9px] text-text-muted font-medium">{u.full_name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-text-muted font-medium">{u.city || '—'}</td>
                            <td className="px-6 py-4 text-xs text-text-muted font-medium">{u.primary_interest || '—'}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${(u.trust_score || 75) >= 70 ? 'bg-emerald-500' : (u.trust_score || 75) >= 40 ? 'bg-orange-500' : 'bg-rose-500'}`}
                                    style={{ width: `${u.trust_score || 75}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-black text-text-muted">{u.trust_score || 75}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {u.is_flagged ? (
                                <span className="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1 w-fit">
                                  <Flag className="w-2.5 h-2.5" /> Flagged
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  Active
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                      <div className="p-12 text-center text-text-muted text-sm">No users found.</div>
                    )}
                  </div>

                ) : activeTab === 'counties' ? (
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black uppercase tracking-widest text-text-muted">Expansion Roadmap</h4>
                      <button className="px-4 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">Add New Region</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {counties.map(county => (
                        <div key={county.id} className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-brand-primary/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${county.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-text-muted'}`}>
                              <Globe className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-text-primary">{county.name}</h5>
                              <p className="text-[10px] text-text-muted font-black uppercase tracking-tighter">{county.waitlist_count} VOTES • {county.status}</p>
                            </div>
                          </div>
                          {county.status !== 'Active' && (
                            <button
                              onClick={async () => {
                                if (window.confirm(`Activate ${county.name} County?`)) {
                                  const { error } = await supabase.from('counties').update({ status: 'Active' }).eq('id', county.id);
                                  if (!error) { await logAction('County Activation', county.id, { county: county.name }); fetchData(); }
                                }
                              }}
                              className="px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 hover:bg-brand-primary hover:text-white transition-all"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                ) : activeTab === 'logs' ? (
                  <div className="p-2 space-y-1">
                    {logs.length > 0 ? logs.map((log) => (
                      <div key={log.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-text-muted" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">{log.action}</p>
                            <p className="text-[9px] text-text-muted font-medium">Target: {log.target_id || 'Global'} • {new Date(log.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-[8px] font-black text-text-muted uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                          Admin: {log.admin_id?.slice(0, 8)}
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center text-text-muted text-sm">No audit logs yet.</div>
                    )}
                  </div>

                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal — rendered at root level to escape overflow-hidden containers */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl bg-surface-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-primary/20 flex items-center justify-center text-xs font-black text-brand-primary">
                    {(selectedTicket.profiles?.username || selectedTicket.profiles?.full_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-text-primary">
                      {selectedTicket.profiles?.username
                        ? `@${selectedTicket.profiles.username}`
                        : selectedTicket.profiles?.full_name || `User ${selectedTicket.user_id?.slice(0, 8)}`}
                    </p>
                    <p className="text-[10px] text-text-muted font-medium">
                      {new Date(selectedTicket.created_at).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-6 space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-muted">
                    {selectedTicket.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    selectedTicket.status === 'Open'
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>{selectedTicket.status}</span>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Subject</p>
                  <h3 className="text-lg font-black text-text-primary">{selectedTicket.subject}</h3>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Request Details
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-text-secondary leading-relaxed font-medium whitespace-pre-wrap min-h-[80px]">
                    {selectedTicket.description || <span className="italic text-text-muted">No description provided.</span>}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-white/5 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all"
                >
                  Close
                </button>
                {selectedTicket.status === 'Open' && (
                  <button
                    onClick={() => {
                      handleTicketAction(selectedTicket.id, 'Resolved');
                      setSelectedTicket(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-black uppercase tracking-widest hover:bg-brand-primary/80 shadow-lg shadow-brand-primary/20 transition-all"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

const TabButton = ({ active, onClick, icon: Icon, label, count, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
      active
        ? danger
          ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/10'
          : 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10'
        : 'bg-white/5 border-white/10 text-text-muted hover:text-text-primary hover:bg-white/10'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
    </div>
    {count !== undefined && (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
        active
          ? danger ? 'bg-rose-500 text-white' : 'bg-brand-primary text-white'
          : danger && count > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-text-muted'
      }`}>
        {count}
      </span>
    )}
  </button>
);

export default AdminDashboard;
