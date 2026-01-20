import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { issues } from '../content/issues';

export const IssuesPage: React.FC = () => {
  return (
    <div className="w-full">
      <PageHeader
        title="Key Issues"
        subtitle="Governance concerns requiring investigation and institutional accountability"
      />

      {/* Overview */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 mb-6">
            <AlertCircle className="text-slate-600 flex-shrink-0" size={28} />
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Overview</h2>
              <p className="text-slate-700 leading-relaxed text-lg mb-4">
                Community documentation has identified five interconnected governance concerns
                affecting institutional accountability and public trust. These are presented below
                with context, explanation of significance, and clear accountability requests.
              </p>
              <p className="text-slate-700 leading-relaxed text-lg">
                All individuals and organisations affected by these concerns are invited to respond
                with evidence and their perspective. Responses are published in full.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Issues */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {issues.map((issue, idx) => (
              <motion.article
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg border border-slate-200 p-8 hover:shadow-md transition-shadow"
              >
                {/* Issue Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-serif font-bold text-lg">
                    {idx + 1}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    {issue.title}
                  </h2>
                </div>

                {/* Problem */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    The Problem
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-lg">{issue.problem}</p>
                </div>

                {/* Why It Matters */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    Why It Matters
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-lg">{issue.whyItMatters}</p>
                </div>

                {/* What We Ask For */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    What We Ask For
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-lg">{issue.whatWeAskFor}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Right of Reply */}
      <section className="bg-blue-50 border-t border-blue-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-blue-900 mb-4">Right of Reply</h2>
          <p className="text-blue-800 leading-relaxed mb-6">
            Anyone named in or affected by these documented concerns is invited to submit a formal
            response. Responses should include supporting evidence and your perspective on the
            concerns raised. All substantive responses are published in full alongside original
            documentation.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            Submit a Response
          </a>
        </div>
      </section>
    </div>
  );
};
