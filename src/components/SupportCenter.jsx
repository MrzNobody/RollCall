import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, Shield, Database, Trash2, 
  Send, CheckCircle2, ChevronRight, 
  HelpCircle, AlertCircle, FileText,
  Clock, Lock, ShieldAlert
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => (
  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-2">
    <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
      <HelpCircle className="w-4 h-4 text-brand-primary" />
      {question}
    </h4>
    <p className="text-xs text-text-muted leading-relaxed font-medium">{answer}</p>
  </div>
);

const SupportCenter = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact', 'privacy', 'faq'
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({ category: 'Technical', subject: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    const { data } = await supabase
      .from('support_tickets')
      .select('id, category, subject, description, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setTickets(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('support_tickets')
      .insert([{ ...formData, user_id: user.id }]);

    if (!error) {
      setSubmitted(true);
      fetchTickets();
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ category: 'Technical', subject: '', description: '' });
      }, 3000);
    }
    setLoading(false);
  };

  const handleDataRequest = async (type) => {
    if (!window.confirm(`Are you sure you want to request an ${type}? This action will be logged for compliance.`)) return;
    
    const { error } = await supabase
      .from('data_requests')
      .insert([{ user_id: user.id, type }]);
    
    if (!error) alert(`Your ${type} request has been received. Our team will process it within 30 days.`);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-surface-950 flex animate-fade-in lg:p-6 lg:bg-surface-950/80 lg:backdrop-blur-xl">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-5xl mx-auto glass border border-white/10 lg:rounded-[3rem] flex flex-col overflow-hidden shadow-2xl bg-surface-950"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-text-primary">Support & Privacy</h2>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">RollCall Concierge Desk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all">
            <Shield className="w-6 h-6 text-text-muted" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Sidebar Nav */}
          <div className="w-full lg:w-64 border-r border-white/5 p-6 space-y-2">
            {[
              { id: 'contact', icon: Send, label: 'Contact Support' },
              { id: 'faq', icon: HelpCircle, label: 'Knowledge Base' },
              { id: 'privacy', icon: Lock, label: 'Privacy & Data' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all font-bold text-sm ${
                  activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-white/[0.02]">
            {activeTab === 'contact' && (
              <div className="max-w-2xl space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-text-primary">Submit a Request</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Category</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-brand-primary transition-all text-text-primary"
                        >
                          <option>Technical</option>
                          <option>Safety</option>
                          <option>Compliance</option>
                          <option>Account</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Subject</label>
                        <input 
                          required
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          placeholder="Brief summary..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-brand-primary transition-all text-text-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Description</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Tell us more about the issue..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:border-brand-primary transition-all text-text-primary resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading || submitted}
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                        submitted ? 'bg-emerald-500 text-white' : 'bg-brand-primary text-white hover:bg-brand-primary/80 shadow-lg shadow-brand-primary/20'
                      }`}
                    >
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 
                       submitted ? <><CheckCircle2 className="w-4 h-4" /> Ticket Created</> : 
                       <><Send className="w-4 h-4" /> Send Request</>}
                    </button>
                  </form>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Your Recent Tickets
                  </h3>
                  <div className="space-y-3">
                    {tickets.length === 0 ? (
                      <p className="text-xs text-text-muted font-medium py-8 text-center border border-dashed border-white/10 rounded-2xl">
                        No support tickets found. We're here if you need us!
                      </p>
                    ) : tickets.map(ticket => (
                      <div key={ticket.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-text-primary">{ticket.subject}</h4>
                          <p className="text-[10px] text-text-muted">{new Date(ticket.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          ticket.status === 'Open' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-white/5 text-text-muted border border-white/10'
                        }`}>
                          {ticket.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="max-w-2xl space-y-12">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-text-primary">Data Privacy & Control</h3>
                  <p className="text-sm text-text-muted font-medium">Manage your data according to GDPR and CCPA standards. Your privacy is our priority.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <Database className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-text-primary">Export My Data</h4>
                      <p className="text-[10px] text-text-muted leading-relaxed">Download a full archive of your profile, posts, messages, and activity. (Processed in 24-48h)</p>
                    </div>
                    <button 
                      onClick={() => handleDataRequest('Data Export')}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Request ZIP Archive
                    </button>
                  </div>

                  <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-text-primary text-rose-500">Delete My Account</h4>
                      <p className="text-[10px] text-text-muted leading-relaxed">Permanently erase your identity from RollCall. This action is irreversible. (Processed in 30 days)</p>
                    </div>
                    <button 
                      onClick={() => handleDataRequest('Account Deletion')}
                      className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all"
                    >
                      Erase All Data
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-start gap-4">
                  <ShieldAlert className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">GDPR Compliance Notice</p>
                    <p className="text-[10px] text-text-primary/70 leading-relaxed font-medium">
                      RollCall adheres to strict data retention policies. Deleted accounts have a 7-day 'cooling off' period where deletion can be cancelled by contacting support. After this, all personally identifiable information is purged from our primary database.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="max-w-3xl space-y-12">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-text-primary">Knowledge Base</h3>
                  <p className="text-sm text-text-muted font-medium">Quick answers to common questions from the PBC community.</p>
                </div>
                <div className="space-y-4">
                  <FAQItem 
                    question="How does the Trust Score work?"
                    answer="Your Trust Score is a composite of your session attendance, peer ratings, and verification status. Being reliable and helpful in your local communities is the fastest way to increase it."
                  />
                  <FAQItem 
                    question="Can I host my own local sessions?"
                    answer="Absolutely! Any resident can propose a session within a community they've joined. The group moderator will review your proposal and activate it if it meets community standards."
                  />
                  <FAQItem 
                    question="What if I encounter harassment?"
                    answer="RollCall has a zero-tolerance policy. Use the 'Report' button on any post or profile to flag it for our Admin Command Center. High-severity reports are actioned in under 4 hours."
                  />
                  <FAQItem 
                    question="How do I earn badges?"
                    answer="Badges are awarded automatically for participation (milestones), being helpful in forums (merits), and helping the platform grow (recruitment)."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SupportCenter;
