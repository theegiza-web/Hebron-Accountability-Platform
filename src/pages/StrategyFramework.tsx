import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Scale, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { strategyFrameworkContent } from '../content/pages';
import { Link } from 'react-router-dom';

export const StrategyFrameworkPage: React.FC = () => {
  const { hero, summary, principles, pathways, discipline, conclusion } = strategyFrameworkContent;

  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'rejection of emotional confrontation': return <Zap size={24} className="text-amber-500" />;
      case 'separation of allegations': return <Scale size={24} className="text-blue-500" />;
      case 'centralised media engagement': return <MessageSquare size={24} className="text-emerald-500" />;
      case 'process over speed': return <Clock size={24} className="text-slate-500" />;
      case 'discipline as power': return <ShieldCheck size={24} className="text-indigo-500" />;
      default: return <CheckCircle size={24} className="text-slate-500" />;
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title={hero.title}
        subtitle={hero.subtitle}
      />

      {/* Hero Buttons */}
      <div className="bg-white py-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-4">
          {hero.buttons.map((btn, idx) => (
            <Link
              key={idx}
              to={btn.href}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                btn.highlight 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {btn.label === 'Download PDF' ? <FileText size={18} /> : <ArrowRight size={18} />}
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <section id="summary" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-10 text-center">
            {summary.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {summary.cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl border ${
                  card.isPositive 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                    : 'bg-amber-50 border-amber-100 text-amber-900'
                }`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {card.isPositive ? <ShieldCheck /> : <AlertTriangle />}
                  {card.title}
                </h3>
                <p className="text-lg leading-relaxed opacity-90">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-10">
            {principles.title}
          </h2>
          <div className="space-y-6">
            {principles.items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(item.title)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12 text-center">
            {pathways.title}
          </h2>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Hard Power */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col h-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="p-8 sm:p-10 border-b border-white/10">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold tracking-wider uppercase mb-6 border border-blue-500/30">
                  Pathway A
                </div>
                <h3 className="text-3xl font-serif font-bold mb-2">{pathways.hardPower.title}</h3>
                <p className="text-slate-400 font-medium italic">{pathways.hardPower.subtitle}</p>
              </div>
              <div className="p-8 sm:p-10 flex-1 space-y-10">
                <div>
                  <h4 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-4">Core Objective</h4>
                  <p className="text-xl text-slate-200 leading-relaxed">{pathways.hardPower.objective}</p>
                </div>
                <div className="space-y-8">
                  {pathways.hardPower.sections.map((section, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-bold text-white mb-1">{section.title}</h5>
                        <p className="text-slate-400 leading-relaxed">{section.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex gap-3 text-blue-300">
                    <AlertTriangle className="flex-shrink-0" size={20} />
                    <p className="text-sm font-medium leading-relaxed">
                      <span className="font-bold uppercase block mb-1 text-xs">Rules during investigation:</span>
                      {pathways.hardPower.warning}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Soft Power */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col h-full bg-indigo-900 text-white rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="p-8 sm:p-10 border-b border-white/10">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wider uppercase mb-6 border border-indigo-500/30">
                  Pathway B
                </div>
                <h3 className="text-3xl font-serif font-bold mb-2">{pathways.softPower.title}</h3>
                <p className="text-indigo-300 font-medium italic">{pathways.softPower.subtitle}</p>
              </div>
              <div className="p-8 sm:p-10 flex-1 space-y-10">
                <div>
                  <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-4">Core Objective</h4>
                  <p className="text-xl text-slate-200 leading-relaxed">{pathways.softPower.objective}</p>
                </div>
                <div className="space-y-8">
                  {pathways.softPower.sections.map((section, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-bold text-white mb-1">{section.title}</h5>
                        <p className="text-slate-400 leading-relaxed">{section.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                  <div className="flex gap-3 text-indigo-300">
                    <AlertTriangle className="flex-shrink-0" size={20} />
                    <p className="text-sm font-medium leading-relaxed">
                      <span className="font-bold uppercase block mb-1 text-xs">Path Separation Rule:</span>
                      {pathways.softPower.warning}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discipline Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="p-8 sm:p-12">
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-3">
                <ShieldCheck className="text-slate-700" size={32} />
                {discipline.title}
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {discipline.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
            {conclusion.title}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            {conclusion.lessons}
          </p>
          <div className="inline-block p-8 bg-slate-900 text-white rounded-2xl shadow-xl transform rotate-1">
            <p className="text-2xl font-serif font-bold italic">
              {conclusion.final}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
