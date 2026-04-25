import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, ShieldCheck, Users, MapPin, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_DATA = [
  {
    category: 'Getting Started',
    icon: BookOpen,
    questions: [
      {
        q: "What is RollCall PBC?",
        a: "RollCall is a high-fidelity community platform for Palm Beach County residents to find local groups, organize meetups, and connect over shared interests like gaming, sports, and tabletop RPGs."
      },
      {
        q: "How do I join a group?",
        a: "Browse the 'Discover' map to find groups near you. Click on any group to see its details and hit the 'Join Tribe' button. Some groups may require a brief review by the organizer."
      }
    ]
  },
  {
    category: 'Safety & Trust',
    icon: ShieldCheck,
    questions: [
      {
        q: "Are the map locations precise?",
        a: "No. For your safety, we use 'Fuzzy Coordinates' for guests. Precise meetup locations are only visible to verified group members and confirmed event attendees."
      },
      {
        q: "How do I report a bad actor?",
        a: "Every group and user profile has a 'Report' flag. Our Sentinel AI Agents and human moderators review all reports within 24 hours to keep PBC safe."
      }
    ]
  },
  {
    category: 'Organization',
    icon: Users,
    questions: [
      {
        q: "Can I create my own group?",
        a: "Yes! Any resident can create a group. Go to your Hub and click 'Create Group' to start your own community."
      },
      {
        q: "What is a Verified Organizer?",
        a: "Organizers who have successfully hosted 3+ sessions and maintain a 4.5+ star rating receive the 'Verified' badge, signaling high-fidelity community leadership."
      }
    ]
  }
];

const FAQ = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filteredData = FAQ_DATA.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(search.toLowerCase()) || 
      q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="flex-1 flex flex-col pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col">
          <h2 className="text-4xl font-black tracking-tighter text-text-primary mb-2">Platform FAQs</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Resident Support Center</p>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest text-text-muted">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
      </div>

      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input 
          type="text"
          placeholder="Search for answers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-medium"
        />
      </div>

      <div className="space-y-12">
        {filteredData.map((category, cIdx) => (
          <div key={category.category} className="space-y-6">
            <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-brand-secondary">
              <category.icon className="w-4 h-4" /> {category.category}
            </h3>
            <div className="space-y-4">
              {category.questions.map((item, qIdx) => {
                const id = `${cIdx}-${qIdx}`;
                const isExpanded = expanded === id;
                return (
                  <div key={id} className="glass rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
                    <button 
                      onClick={() => setExpanded(isExpanded ? null : id)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-bold text-text-primary">{item.q}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-brand-primary" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-sm text-text-secondary leading-relaxed border-t border-white/5 pt-4">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <p className="text-sm font-bold text-text-muted italic">No matching questions found.</p>
        </div>
      )}
    </div>
  );
};

export default FAQ;
