import React from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { contactContent } from '../content/pages';

export const ContactPage: React.FC = () => {
  const { email, response, privacy, corrections } = contactContent;

  return (
    <div className="w-full">
      <PageHeader
        title={contactContent.title}
        subtitle={contactContent.intro}
      />

      {/* Contact Email */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-full mb-6">
            <Mail size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-slate-600 mb-8">
            Contact us directly at:
          </p>
          <a
            href={`mailto:${email}`}
            className="text-3xl font-bold text-slate-900 hover:text-slate-700 transition-colors break-all"
          >
            {email}
          </a>
        </div>
      </section>

      {/* Right of Reply */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 mb-8">
            <MessageSquare className="text-slate-600 flex-shrink-0 mt-1" size={28} />
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              {response.title}
            </h2>
          </div>
          <div className="bg-white rounded-lg p-8 border border-slate-200">
            <ul className="space-y-4">
              {response.content.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-3 text-slate-700 leading-relaxed"
                >
                  <CheckCircle className="text-slate-400 flex-shrink-0 mt-1" size={20} />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 mb-8">
            <AlertCircle className="text-slate-600 flex-shrink-0 mt-1" size={28} />
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              {privacy.title}
            </h2>
          </div>
          <div className="bg-red-50 rounded-lg p-8 border border-red-200">
            <ul className="space-y-4">
              {privacy.content.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-red-900 leading-relaxed flex gap-3"
                >
                  <span className="text-red-400 font-bold">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Corrections */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
            {corrections.title}
          </h2>
          <div className="bg-white rounded-lg p-8 border border-slate-200 space-y-4">
            {corrections.content.map((item, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-slate-700 leading-relaxed"
              >
                {item}
              </motion.p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
