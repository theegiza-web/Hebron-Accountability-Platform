import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Phone } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { evidence } from '../content/evidence';
import { resourcesContent } from '../content/pages';

export const EvidenceDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  if (!id) {
    // Safety fallback
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-4">
            Evidence not found
          </h1>
          <button
            onClick={() => navigate('/evidence')}
            className="text-slate-600 hover:text-slate-900 underline"
          >
            Back to evidence
          </button>
        </div>
      </div>
    );
  }

  const entry = evidence.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-4">
            Evidence not found
          </h1>
          <button
            onClick={() => navigate('/evidence')}
            className="text-slate-600 hover:text-slate-900 underline"
          >
            Back to evidence
          </button>
        </div>
      </div>
    );
  }

  // Build a GitHub-Pages-safe URL (BASE_URL will be "/BBMAP/" in prod)
  const base = '/BBMAP/';
  const relative = entry.downloadUrl ? entry.downloadUrl.replace(/^\//, '') : null;
  const fullUrl =
    relative ? `${window.location.origin}${base}${relative}` : null;

  return (
    <div className="w-full">
      <PageHeader title={entry.title} subtitle={`${entry.category} • ${entry.date}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-8 mb-8"
        >
          {entry.quote && (
            <blockquote className="border-l-4 border-slate-300 pl-6 py-4 mb-6 bg-slate-50 italic text-slate-700">
              "{entry.quote}"
            </blockquote>
          )}

          <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
            Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-lg mb-8">
            {entry.summary}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">
                Source Document
              </h3>
              <p className="text-slate-600">{entry.sourceDocument}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">
                Date
              </h3>
              <p className="text-slate-600 flex items-center gap-2">
                <Clock size={16} />
                {entry.date}
              </p>
            </div>
          </div>

          {entry.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Document Viewer + Direct Link */}
          {fullUrl && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <a
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  Open document
                </a>

                <p className="text-sm text-slate-600">
                  Link:{' '}
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline break-all hover:text-slate-900"
                  >
                    {fullUrl}
                  </a>
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <iframe
                  title="Document viewer"
                  src={`${fullUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full h-[75vh]"
                />
              </div>

              <p className="mt-3 text-sm text-slate-600 leading-6">
                If the document does not load in your browser, use the “Open document” button above.
              </p>
            </div>
          )}

          {!fullUrl && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-slate-600">
                No document link is attached to this entry.
              </p>
            </div>
          )}
        </motion.div>

        <button
          onClick={() => navigate('/evidence')}
          className="text-slate-600 hover:text-slate-900 font-medium underline"
        >
          ← Back to all evidence
        </button>
      </div>

      {/* Submission Section */}
      <section className="bg-slate-50 border-t border-slate-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-4">
            {resourcesContent.submission.title}
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Have additional evidence or information? We accept submissions of publicly available
            documents and properly sourced information. Submissions are reviewed for accuracy before
            publication.
          </p>

          <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Submission Guidelines</h3>
            <ul className="space-y-2 text-slate-700 text-sm">
              {resourcesContent.submission.guidelines.map((guideline, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-slate-400">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
            <Phone className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Contact us</h3>
              <p className="text-blue-700 mb-1">
                Bethanie:{' '}
                <a
                  href="tel:+27796586452"
                  className="font-semibold hover:underline"
                >
                  079 658 6452
                </a>
              </p>
              <p className="text-blue-700 mb-2">
                Hebron:{' '}
                <a
                  href="tel:+27734623287"
                  className="font-semibold hover:underline"
                >
                  073 462 3287
                </a>
              </p>
              <p className="text-blue-700 text-sm">
                {resourcesContent.submission.contact.note}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
