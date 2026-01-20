import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Link as LinkIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { timeline } from '../content/timeline';
import { evidence } from '../content/evidence';

export const TimelinePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const years = useMemo(() => {
    const yearSet = new Set(timeline.map((entry) => entry.date.split(' ')[1]));
    return Array.from(yearSet).sort().reverse();
  }, []);

  const filteredTimeline = useMemo(() => {
    if (!selectedYear) return timeline;
    return timeline.filter((entry) => entry.date.includes(selectedYear));
  }, [selectedYear]);

  return (
    <div className="w-full">
      <PageHeader
        title="Timeline"
        subtitle="Chronological account of governance concerns and key events"
      />

      {/* Year Filter */}
      <section className="bg-white border-b border-slate-200 py-8 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
            Jump to Year
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedYear(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedYear === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Events
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedYear === year
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-slate-100" />

            {/* Timeline entries */}
            <div className="space-y-12">
              {filteredTimeline.map((entry, idx) => {
                const relatedEvidence = entry.relatedEvidenceIds
                  .map((id) => evidence.find((e) => e.id === id))
                  .filter((e) => e !== undefined);

                return (
                  <motion.div
                    key={`${entry.date}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative pl-24"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-5 top-2 w-10 h-10 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center">
                      <Calendar size={18} className="text-slate-900" />
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <time className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                          {entry.date}
                        </time>
                      </div>

                      <h3 className="text-xl font-serif font-semibold text-slate-900 mb-3">
                        {entry.title}
                      </h3>

                      <p className="text-slate-700 leading-relaxed mb-4">{entry.summary}</p>

                      {relatedEvidence.length > 0 && (
                        <div className="bg-slate-50 rounded p-4 border border-slate-200">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <LinkIcon size={16} />
                            Related Evidence
                          </h4>
                          <ul className="space-y-2">
                            {relatedEvidence.map((ev) => (
                              <li key={ev!.id}>
                                <a
                                  href={`/evidence/${ev!.id}`}
                                  className="text-slate-600 hover:text-slate-900 hover:underline transition-colors text-sm"
                                >
                                  {ev!.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {filteredTimeline.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No events for selected year.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
