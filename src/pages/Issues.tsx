import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle, Megaphone } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RaiseIssueForm } from '../components/RaiseIssueForm';
import { IssuesDisplay } from '../components/IssuesDisplay';
import { issues } from '../content/issues';
import { FEED_URL } from '../config';

export const IssuesPage: React.FC = () => {
  const [showRaiseForm, setShowRaiseForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="w-full">
      <PageHeader
        title="Issues & Governance"
        subtitle="Document concerns and track community-driven governance issues transparently"
      />

      {/* Overview */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 mb-6">
            <AlertCircle className="text-slate-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Key Issues</h2>
              <p className="text-slate-700 leading-relaxed text-lg mb-4">
                Community documentation has identified governance concerns affecting institutional
                accountability and public trust. These are presented below with context, explanation
                of significance, and clear accountability requests.
              </p>
              <p className="text-slate-700 leading-relaxed text-lg mb-6">
                All individuals and organisations affected by these concerns are invited to respond
                with evidence and their perspective. Responses are published in full.
              </p>

              <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="text-slate-500" size={20} />
                <p className="text-slate-600">
                  Read our <Link to="/strategy" className="text-blue-600 font-bold hover:underline">Strategic Framework</Link> (how we handle accountability safely and lawfully).
                </p>
              </div>

              {/* CTA for Raise Issue */}
              <button
                onClick={() => setShowRaiseForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Megaphone size={18} />
                Raise a New Issue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Raise Issue Form */}
      {showRaiseForm && (
        <section className="py-12 sm:py-16 bg-blue-50 border-b border-blue-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setShowRaiseForm(false)}
              className="mb-6 text-sm text-slate-600 hover:text-slate-900 underline"
            >
              ← Hide form
            </button>

            <RaiseIssueForm
              onSubmitSuccess={() => {
                setShowRaiseForm(false);
                // Trigger refresh of issues list after submission
                setTimeout(() => setRefreshKey((k) => k + 1), 800);
              }}
            />
          </div>
        </section>
      )}

      {/* Community Issues Dashboard */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">
            Community-Raised Issues
          </h2>

          {/* Pass BASE FEED URL; IssuesDisplay should append its action internally */}
          <IssuesDisplay key={refreshKey} feedUrl={FEED_URL} />
        </div>
      </section>

      {/* Key Issues */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {issues.map((issue, idx) => (
              <motion.article
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 rounded-lg border border-slate-200 p-8 hover:shadow-md transition-shadow"
              >
                {/* Issue Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-serif font-bold text-lg">
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">{issue.title}</h3>
                </div>

                {/* Problem */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    The Problem
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-lg">{issue.problem}</p>
                </div>

                {/* Why It Matters */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    Why It Matters
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-lg">{issue.whyItMatters}</p>
                </div>

                {/* What We Ask For */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    What We Ask For
                  </h4>
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

          <Link
            to="/responses"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            Submit a Response
          </Link>
        </div>
      </section>
    </div>
  );
};
