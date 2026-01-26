import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, User, Mail, Phone, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SubmitResponseForm } from '../components/SubmitResponseForm';
import { FEED_URL, withAction } from '../config';
import { loadJsonp } from '../utils/jsonp';

type Response = {
  id: string;
  timestamp: string;
  respondentName: string;
  respondentOrganization: string;
  respondentEmail: string;
  respondentPhone: string;
  category: string;
  issueReference: string;
  responseTitle: string;
  responseContent: string;
  supportingEvidence: string;
  mediaLinks: string;
  verified: boolean;
};

export const ResponsesPage: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    loadResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-clear toast message after 5s
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      setMessage('');
      setMessageType(null);
    }, 5000);
    return () => clearTimeout(t);
  }, [message]);

  const loadResponses = async () => {
    setLoading(true);
    setError('');

    try {
      const url = withAction(FEED_URL, 'responses');
      const data = await loadJsonp<{ responses?: Response[] }>(url);
      setResponses(Array.isArray(data.responses) ? data.responses : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error loading responses';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Responses & Right of Reply"
        subtitle="Official statements and responses from organizations and individuals affected by documented concerns"
      />

      {/* Overview */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 mb-6">
            <MessageCircle className="text-slate-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Right of Reply</h2>
              <p className="text-slate-700 leading-relaxed text-lg mb-4">
                This platform believes in transparency and accountability from all sides. Anyone
                mentioned in or affected by documented concerns is invited to provide an official
                response.
              </p>
              <p className="text-slate-700 leading-relaxed text-lg mb-6">
                Responses are published in full alongside the original documentation, with
                supporting evidence attached. All substantive responses are welcomed.
              </p>

              <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 italic">
                <ShieldCheck className="text-slate-500" size={20} />
                <p className="text-slate-600">
                  Right of reply exists within a disciplined process. See <Link to="/strategy" className="text-blue-600 font-bold hover:underline">Strategy Framework</Link>.
                </p>
              </div>

              {!showSubmitForm && (
                <div className="relative z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSubmitForm(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg
                             font-medium hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle size={18} />
                    Submit Your Response
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Submit Response Form */}
      {showSubmitForm && (
        <section className="py-12 sm:py-16 bg-blue-50 border-b border-blue-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setShowSubmitForm(false)}
              className="mb-6 text-sm text-slate-600 hover:text-slate-900 underline"
            >
              ← Hide form
            </button>

            <SubmitResponseForm
              onSubmitSuccess={() => {
                setShowSubmitForm(false);
                setMessage('Response submitted successfully! Refreshing feed…');
                setMessageType('success');
                setTimeout(() => loadResponses(), 600);
              }}
            />
          </div>
        </section>
      )}

      {/* Status Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg flex gap-3 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${
            messageType === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {messageType === 'success' ? (
            <Check size={20} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          )}
          <span>{message}</span>
        </motion.div>
      )}

      {/* Responses List */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Published Responses</h2>
              <p className="text-sm text-slate-500 mt-1 italic">
                Only verified responses are shown publicly.
              </p>
            </div>

            <button
              onClick={loadResponses}
              className="text-sm px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 self-start sm:self-auto"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 mt-4">Loading responses...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
              <p className="font-medium">{error}</p>
              <button
                onClick={loadResponses}
                className="mt-4 text-sm text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && responses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <MessageCircle className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-600 text-lg">No responses published yet.</p>
              <p className="text-slate-500 text-sm mt-2">
                Check back soon for official responses and statements.
              </p>
            </div>
          )}

          {!loading && !error && responses.length > 0 && (
            <div className="space-y-6">
              {responses.map((response, idx) => (
                <motion.article
                  key={response.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.06, 0.6) }}
                  className="bg-white rounded-lg border border-slate-200 p-8 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                          {response.responseTitle}
                        </h3>
                        <p className="text-sm text-slate-500">{formatDate(response.timestamp)}</p>
                      </div>
                      {response.verified && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {response.category}
                    </span>
                  </div>

                  {/* Respondent Info */}
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                      Respondent
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <User size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">{response.respondentName}</p>
                          {response.respondentOrganization && (
                            <p className="text-sm text-slate-600">{response.respondentOrganization}</p>
                          )}
                        </div>
                      </div>

                      {response.respondentEmail && (
                        <div className="flex gap-3">
                          <Mail size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-700">{response.respondentEmail}</p>
                        </div>
                      )}

                      {response.respondentPhone && (
                        <div className="flex gap-3">
                          <Phone size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-700">{response.respondentPhone}</p>
                        </div>
                      )}

                      {response.issueReference && (
                        <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
                          <p className="text-xs text-slate-600 font-medium">Issue Reference</p>
                          <p className="text-slate-900 font-mono">{response.issueReference}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Response Content */}
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                      Response
                    </h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {response.responseContent}
                    </p>
                  </div>

                  {/* Supporting Evidence */}
                  {response.supportingEvidence && (
                    <div className="mb-6 pb-6 border-b border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                        Supporting Evidence
                      </h4>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {response.supportingEvidence}
                      </p>
                    </div>
                  )}

                  {/* Media Links */}
                  {response.mediaLinks && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                        Attachments
                      </h4>
                      <div className="space-y-2">
                        {response.mediaLinks.split(';').map((link, i) => {
                          const url = link.trim();
                          if (!url) return null;
                          return (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm"
                            >
                              📎 View Document
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
