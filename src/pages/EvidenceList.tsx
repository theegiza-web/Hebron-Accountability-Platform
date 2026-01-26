import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EvidenceCard } from '../components/EvidenceCard';
import { SearchBar } from '../components/SearchBar';
import { evidence } from '../content/evidence';

export const EvidenceListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Financial', 'Governance', 'Correspondence', 'Minutes', 'Report'] as const;

  const filteredEvidence = useMemo(() => {
    return evidence.filter((entry) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q));

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

      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-4">
            <ShieldCheck className="text-indigo-600 flex-shrink-0" size={24} />
            <p className="text-indigo-900">
              Evidence is handled using the <Link to="/strategy" className="font-bold hover:underline">framework rules</Link> (discipline, sequencing, safety).
            </p>
          </div>
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

      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>
    </div>
  );
};
