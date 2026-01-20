import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Clock, Mail } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EvidenceCard } from '../components/EvidenceCard';
import { SearchBar } from '../components/SearchBar';
import { evidence } from '../content/evidence';
import { resourcesContent } from '../content/pages';

export const EvidencePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // If viewing detail
  if (id) {
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

    return (
      <div className="w-full">
        <PageHeader
          title={entry.title}
          subtitle={`${entry.category} • ${entry.date}`}
        />

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
            <p className="text-slate-700 leading-relaxed text-lg mb-8">{entry.summary}</p>

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

            {entry.downloadUrl && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <a
                  href={entry.downloadUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Download size={18} />
                  Download document
                </a>
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
              <Mail className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Contact us</h3>
                <p className="text-blue-700">
                  Email:{' '}
                  <a
                    href={`mailto:${resourcesContent.submission.contact.email}`}
                    className="font-semibold hover:underline"
                  >
                    {resourcesContent.submission.contact.email}
                  </a>
                </p>
                <p className="text-blue-700 text-sm mt-2">{resourcesContent.submission.contact.note}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // List view
  const categories = ['Financial', 'Governance', 'Correspondence', 'Minutes', 'Report'] as const;

  const filteredEvidence = useMemo(() => {
    return evidence.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === null || entry.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full">
      <PageHeader
        title="Evidence"
        subtitle="Documented concerns, correspondence, and analysis regarding governance and financial accountability"
      />

      {/* Filters */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
              Search
            </h3>
            <SearchBar onSearch={setSearchQuery} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Grid */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvidence.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">No evidence matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="text-slate-600 hover:text-slate-900 font-medium underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-slate-600 mb-8">
                Showing {filteredEvidence.length} of {evidence.length} evidence entries
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredEvidence.map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <EvidenceCard
                      id={entry.id}
                      title={entry.title}
                      date={entry.date}
                      category={entry.category}
                      summary={entry.summary}
                      tags={entry.tags}
                      quote={entry.quote}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
