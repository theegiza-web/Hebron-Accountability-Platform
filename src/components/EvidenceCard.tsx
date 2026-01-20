import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar } from 'lucide-react';
import { Tag } from './Tag';

interface EvidenceCardProps {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  tags: string[];
  quote?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  id,
  title,
  date,
  category,
  summary,
  tags,
  quote,
}) => {
  return (
    <Link to={`/evidence/${id}`}>
      <article className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Tag label={category} variant="subtle" />
          <div className="flex items-center text-slate-500 text-sm">
            <Calendar size={14} className="mr-1" />
            {date}
          </div>
        </div>

        <h3 className="text-lg font-serif font-semibold text-slate-900 mb-3 leading-snug">
          {title}
        </h3>

        <p className="text-slate-700 text-sm leading-relaxed mb-4 flex-1">
          {summary}
        </p>

        {quote && (
          <blockquote className="border-l-4 border-slate-300 pl-4 py-3 mb-4 bg-slate-50 italic text-slate-600 text-sm">
            "{quote}"
          </blockquote>
        )}

        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
          <FileText size={16} className="mr-2" />
          View details
        </div>
      </article>
    </Link>
  );
};
