import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { aboutContent } from '../content/pages';

export const AboutPage: React.FC = () => {
  const { purpose, background, howToUse, principles, disclaimer } = aboutContent;

  return (
    <div className="w-full">
      <PageHeader
        title="About This Platform"
        subtitle="Understanding our work, methods, and principles"
      />

      {/* Purpose & Scope */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 mb-7">
            {purpose.title}
          </h2>
          <div className="space-y-5">
            {purpose.content.map((para, idx) => (
              <p key={idx} className="text-slate-700 leading-7 text-lg">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Background */}
      <section className="py-14 sm:py-18 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 mb-7">
            {background.title}
          </h2>
          <div className="space-y-5">
            {background.content.map((para, idx) => (
              <p key={idx} className="text-slate-700 leading-7 text-lg">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 mb-10">
            {howToUse.title}
          </h2>

          <div className="space-y-8">
            {howToUse.steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
                className="flex gap-6 pb-8 border-b border-slate-200 last:border-0"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-900 text-white font-serif font-bold">
                    {step.number}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-serif font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-700 leading-7">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-14 sm:py-18 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 mb-10">
            {principles.title}
          </h2>

          <div className="grid gap-6">
            {principles.content.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
                className="flex gap-4 bg-white/95 p-7 rounded-xl border border-slate-200 shadow-soft"
              >
                <CheckCircle className="text-slate-600 flex-shrink-0 mt-1" size={22} />
                <div>
                  <h3 className="text-lg font-serif font-semibold text-slate-900 mb-2">
                    {item.principle}
                  </h3>
                  <p className="text-slate-700 leading-7">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer – styled as a formal note */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
            <div className="flex gap-4 mb-6">
              <AlertCircle className="text-slate-700 flex-shrink-0 mt-0.5" size={24} />
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900">
                {disclaimer.title}
              </h2>
            </div>

            <ul className="space-y-4">
              {disclaimer.content.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  className="flex gap-3 text-slate-700 leading-7"
                >
                  <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-2.5 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
