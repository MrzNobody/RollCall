import React, { useState } from 'react';
import { ChevronLeft, Check, X, Zap, Shield, Users, Calendar, MessageSquare, MapPin, Award, Star, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DISCOUNT = 0.15;

const PLANS = [
  {
    id: 'participant',
    label: 'Participant',
    monthlyPrice: 10,
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-500/30',
    glowColor: 'shadow-sky-500/20',
    accentBg: 'bg-sky-500/10',
    accentText: 'text-sky-400',
    badge: 'Most Popular',
    badgeBg: 'bg-sky-500',
    description: 'For community members who love to join and participate.',
    features: [
      { text: 'Join unlimited groups', included: true },
      { text: 'RSVP to any local event', included: true },
      { text: 'Community forum access', included: true },
      { text: 'Badge & rank progression', included: true },
      { text: 'Direct messaging', included: true },
      { text: 'Interactive group map', included: true },
      { text: 'Create & host groups', included: false },
      { text: 'Organizer analytics', included: false },
    ],
  },
  {
    id: 'organizer',
    label: 'Organizer',
    monthlyPrice: 15,
    color: 'from-brand-primary to-violet-600',
    borderColor: 'border-brand-primary/40',
    glowColor: 'shadow-brand-primary/20',
    accentBg: 'bg-brand-primary/10',
    accentText: 'text-brand-primary',
    badge: 'Full Access',
    badgeBg: 'bg-brand-primary',
    description: 'For leaders who build and run thriving communities.',
    features: [
      { text: 'Join unlimited groups', included: true },
      { text: 'RSVP to any local event', included: true },
      { text: 'Community forum access', included: true },
      { text: 'Badge & rank progression', included: true },
      { text: 'Direct messaging', included: true },
      { text: 'Interactive group map', included: true },
      { text: 'Create & host groups', included: true },
      { text: 'Organizer analytics', included: true },
    ],
  },
];

const COMPETITORS = [
  {
    name: 'RollCall',
    logo: '🎮',
    organizer: 15,
    participant: 10,
    highlight: true,
    notes: 'Gaming & activity-focused · Local PBC community · Full feature set',
  },
  {
    name: 'Meetup.com',
    logo: '📅',
    organizer: 29.99,
    participant: 'Free*',
    participantNote: '* Limited features, no dedicated gaming tools',
    highlight: false,
    notes: 'Generic events · No gaming focus · Basic member tools',
  },
  {
    name: 'Eventbrite',
    logo: '🎟️',
    organizer: '3.7% + fees',
    participant: 'Per ticket',
    highlight: false,
    notes: 'Per-ticket charges · No community tools · No recurring groups',
  },
  {
    name: 'Facebook Groups',
    logo: '👥',
    organizer: 'Free',
    participant: 'Free',
    highlight: false,
    notes: 'Privacy concerns · Algorithm-driven · No event management',
  },
];

const PlanCard = ({ plan, annual, onGetStarted }) => {
  const annualMonthly = +(plan.monthlyPrice * (1 - DISCOUNT)).toFixed(2);
  const annualTotal = +(plan.monthlyPrice * 12 * (1 - DISCOUNT)).toFixed(0);
  const savings = +(plan.monthlyPrice * 12 * DISCOUNT).toFixed(0);
  const displayPrice = annual ? annualMonthly : plan.monthlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative glass rounded-[2.5rem] border-2 ${plan.borderColor} p-8 flex flex-col shadow-2xl ${plan.glowColor}`}
    >
      {/* Badge */}
      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${plan.badgeBg}`}>
        {plan.badge}
      </div>

      {/* Header */}
      <div className="mb-6 pt-2">
        <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${plan.accentBg} ${plan.accentText} mb-3`}>
          {plan.label}
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-2">
        <div className="flex items-end gap-1">
          <span className="text-5xl font-black text-text-primary">${displayPrice}</span>
          <span className="text-text-muted text-sm font-bold mb-2">/month</span>
        </div>
        <AnimatePresence mode="wait">
          {annual ? (
            <motion.div key="annual" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <p className="text-[11px] text-text-muted">Billed annually — <span className="text-emerald-400 font-black">${annualTotal}/yr</span></p>
              <p className="text-[11px] text-emerald-400 font-black mt-0.5">You save ${savings}/year 🎉</p>
            </motion.div>
          ) : (
            <motion.div key="monthly" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <p className="text-[11px] text-text-muted">Billed monthly · cancel anytime</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 my-6" />

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-3">
            {f.included
              ? <div className={`w-5 h-5 rounded-full ${plan.accentBg} flex items-center justify-center shrink-0`}><Check className={`w-3 h-3 ${plan.accentText}`} /></div>
              : <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0"><X className="w-3 h-3 text-text-muted" /></div>
            }
            <span className={`text-sm font-medium ${f.included ? 'text-text-primary' : 'text-text-muted line-through'}`}>{f.text}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onGetStarted}
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-all shadow-xl`}
      >
        Get Started
      </button>
    </motion.div>
  );
};

const CompetitorBar = ({ name, value, max, highlight, logo }) => {
  const numValue = typeof value === 'number' ? value : null;
  const pct = numValue ? Math.min((numValue / max) * 100, 100) : 5;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${highlight ? 'bg-brand-primary/10 border border-brand-primary/20' : 'bg-white/3 border border-white/5'}`}>
      <span className="text-xl w-8 shrink-0">{logo}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className={`text-xs font-black uppercase tracking-wider ${highlight ? 'text-brand-primary' : 'text-text-secondary'}`}>{name}</span>
          <span className={`text-xs font-black ${highlight ? 'text-brand-primary' : 'text-text-muted'}`}>
            {typeof value === 'number' ? `$${value}/mo` : value}
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className={`h-full rounded-full ${highlight ? 'bg-gradient-to-r from-brand-primary to-violet-500' : 'bg-white/20'}`}
          />
        </div>
      </div>
    </div>
  );
};

const PricingPage = ({ onBack, onSignIn }) => {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="pt-24 min-h-screen bg-surface-950 px-6 md:px-12 pb-24">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-10 transition-colors text-xs font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Hero */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest">
            <TrendingDown className="w-3.5 h-3.5" /> Up to 50% cheaper than Meetup
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-text-primary">Simple, Fair <span className="bg-gradient-to-r from-brand-primary to-violet-500 bg-clip-text text-transparent">Pricing</span></h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">One flat rate. No hidden fees. No per-event charges. Just your community.</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-black uppercase tracking-widest transition-colors ${!annual ? 'text-text-primary' : 'text-text-muted'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${annual ? 'bg-brand-primary' : 'bg-white/10'}`}
            >
              <motion.div
                animate={{ x: annual ? 28 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black uppercase tracking-widest transition-colors ${annual ? 'text-text-primary' : 'text-text-muted'}`}>Annual</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">Save 15%</span>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} annual={annual} onGetStarted={onSignIn} />
          ))}
        </div>

        {/* Competitor Comparison */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tighter text-text-primary">How We Stack Up</h2>
            <p className="text-text-secondary text-sm">Organizer monthly pricing compared across platforms</p>
          </div>

          {/* Bar Chart */}
          <div className="glass rounded-[2.5rem] border border-white/10 p-8 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Organizer Plan — Monthly Cost</span>
            </div>
            {COMPETITORS.map(c => (
              <CompetitorBar
                key={c.name}
                name={c.name}
                logo={c.logo}
                value={c.organizer}
                max={35}
                highlight={c.highlight}
              />
            ))}
            <p className="text-[10px] text-text-muted pt-2">* Non-numeric values shown at minimum bar width for illustration</p>
          </div>

          {/* Feature Comparison Table */}
          <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden">
            <div className="p-8 border-b border-white/5">
              <h3 className="text-xl font-black tracking-tight text-text-primary">Feature Comparison</h3>
              <p className="text-text-secondary text-xs mt-1">What you actually get for your money</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Feature</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-brand-primary">RollCall</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Meetup</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Eventbrite</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Facebook</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Gaming & activity focus', rc: true, meetup: false, eb: false, fb: false },
                    { feature: 'Flat monthly rate', rc: true, meetup: true, eb: false, fb: true },
                    { feature: 'Local community map', rc: true, meetup: true, eb: false, fb: false },
                    { feature: 'RSVP & event management', rc: true, meetup: true, eb: true, fb: true },
                    { feature: 'Group forums & posts', rc: true, meetup: false, eb: false, fb: true },
                    { feature: 'Badge & rank system', rc: true, meetup: false, eb: false, fb: false },
                    { feature: 'No per-ticket fees', rc: true, meetup: true, eb: false, fb: true },
                    { feature: 'No algorithm feed', rc: true, meetup: true, eb: true, fb: false },
                    { feature: 'Privacy-first design', rc: true, meetup: true, eb: true, fb: false },
                    { feature: 'Organizer analytics', rc: true, meetup: true, eb: true, fb: false },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                      <td className="p-5 font-medium text-text-secondary">{row.feature}</td>
                      {[row.rc, row.meetup, row.eb, row.fb].map((val, j) => (
                        <td key={j} className="p-5 text-center">
                          {val
                            ? <div className={`w-5 h-5 rounded-full ${j === 0 ? 'bg-brand-primary/20' : 'bg-white/5'} flex items-center justify-center mx-auto`}>
                                <Check className={`w-3 h-3 ${j === 0 ? 'text-brand-primary' : 'text-text-muted'}`} />
                              </div>
                            : <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto">
                                <X className="w-3 h-3 text-rose-400/60" />
                              </div>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Value Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: TrendingDown, title: '50% Cheaper', sub: 'Than Meetup organizer plan', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: Zap, title: 'No Surprise Fees', sub: 'Flat rate, no per-event charges', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { icon: Shield, title: 'Cancel Anytime', sub: 'No contracts, no lock-in', color: 'text-sky-400', bg: 'bg-sky-500/10' },
            ].map(({ icon: Icon, title, sub, color, bg }) => (
              <div key={title} className="glass p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${bg} shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className={`text-lg font-black ${color}`}>{title}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center pt-4 pb-8">
            <button
              onClick={onSignIn}
              className="bg-brand-primary text-white px-16 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary/80 shadow-2xl shadow-brand-primary/20 transition-all"
            >
              Start Your Free Trial
            </button>
            <p className="text-text-muted text-[11px] mt-4 font-medium">First 30 days free · No credit card required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
