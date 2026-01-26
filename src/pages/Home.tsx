import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { homeContent } from '../content/pages';

export const HomePage: React.FC = () => {
  const { greeting, hero, whatIsHappening, whatWeProvide, whyFactual, ctaFooter } = homeContent;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-2xl sm:text-3xl font-serif text-slate-700 mb-4">
              {greeting}
            </p>
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
              {hero.subtitle}
            </p>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed">
              {hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              {hero.ctaButtons.map((btn: any, idx) => (
                <motion.div
                  key={btn.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={btn.href}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      btn.highlight
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {btn.label}
                    <ChevronRight size={18} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Happening */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8 text-center">
            {whatIsHappening.title}
          </h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              {whatIsHappening.content.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 text-slate-700 leading-relaxed"
                >
                  <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">
            {whatWeProvide.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {whatWeProvide.cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg p-8 border border-slate-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-serif font-semibold text-slate-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Factual */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 mb-6">
            <AlertTriangle className="text-slate-600 flex-shrink-0 mt-1" size={28} />
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
                {whyFactual.title}
              </h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                {whyFactual.content}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">{ctaFooter.title}</h2>
          <p className="text-xl text-slate-200 mb-8">{ctaFooter.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaFooter.buttons.map((btn) => (
              <Link
                key={btn.href}
                to={btn.href}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
