import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { resourcesContent } from '../content/pages';

export const ResourcesPage: React.FC = () => {
  const { faqs, submission } = resourcesContent;

  return (
    <div className="w-full">
      <PageHeader
        title={resourcesContent.title}
        subtitle={resourcesContent.intro}
      />

      {/* FAQs */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <motion.details
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group border border-slate-200 rounded-lg p-6 bg-slate-50 cursor-pointer hover:bg-white transition-colors"
              >
                <summary className="flex items-start justify-between font-semibold text-slate-900 list-none">
                  <span className="text-lg pr-4">{faq.question}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0">
                    ▼
                  </span>
                </summary>
                <p className="text-slate-700 leading-relaxed mt-4">{faq.answer}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Submissions */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
            {submission.title}
          </h2>
          <div className="bg-white rounded-lg p-8 border border-slate-200 mb-6">
            <h3 className="text-lg font-serif font-semibold text-slate-900 mb-4">
              Submission Guidelines
            </h3>
            <ul className="space-y-3">
              {submission.guidelines.map((guideline, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
            <Phone className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Get in Touch</h3>
              <p className="text-blue-700 mb-1">
                Bethanie:{' '}
                <a
                  href="tel:+27796586452"
                  className="font-semibold hover:underline"
                >
                  079 658 6452
                </a>
              </p>
              <p className="text-blue-700 mb-1">
                Hebron:{' '}
                <a
                  href="tel:+27734623287"
                  className="font-semibold hover:underline"
                >
                  073 462 3287
                </a>
              </p>
              <p className="text-blue-700 text-sm">{submission.contact.note}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
