import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { withAction } from '../config';
import { loadJsonp } from '../utils/jsonp';

type Issue = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: string;
  submitterName: string;
  contact: string;
  area: string;

  // Optional (if you add these columns later)
  status?: 'Pending' | 'In-Process' | 'Solved' | 'Discarded';
  adminNotes?: string;
  resolutionReason?: string;
  dateUpdated?: string;
  media?: any[];
};

type FeedApi = {
  updatedAt: string;
  totalIssues: number;
  issues: Issue[];
  byStatus: {
    pending: number;
    inProcess: number;
    solved: number;
    discarded: number;
  };
};

type Props = {
  // Pass the BASE web-app URL (your FEED_URL)
  feedUrl: string;
  compact?: boolean;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending':
      return <AlertCircle className="text-yellow-600" size={18} />;
    case 'In-Process':
      return <Clock className="text-blue-600" size={18} />;
    case 'Solved':
      return <CheckCircle className="text-green-600" size={18} />;
    case 'Discarded':
      return <XCircle className="text-red-600" size={18} />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'In-Process':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'Solved':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'Discarded':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-slate-50 text-slate-800 border-slate-200';
  }
};

const normalizeStatus = (i: Issue): Issue & { status: NonNullable<Issue['status']> } => {
  // Your current sheet/script doesn't store status yet -> default to Pending
  const status = i.status || 'Pending';
  return { ...i, status };
};

export const IssuesDisplay: React.FC<Props> = ({ feedUrl, compact = false }) => {
  const [data, setData] = useState<FeedApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setError(null);
      try {
        const url = withAction(feedUrl, 'issues');
        const json = await loadJsonp<Partial<FeedApi>>(url);
        
        const issues = Array.isArray(json.issues) ? json.issues : [];

        if (!alive) return;

        setData({
          updatedAt: String(json.updatedAt || new Date().toISOString()),
          totalIssues: Number(json.totalIssues ?? issues.length),
          issues,
          byStatus: json.byStatus || { pending: 0, inProcess: 0, solved: 0, discarded: 0 },
        });
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load');
        setData(null);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [feedUrl]);

  const normalizedIssues = useMemo(() => {
    if (!data) return [];
    return data.issues.map(normalizeStatus);
  }, [data]);

  const categories = useMemo(() => {
    return [...new Set(normalizedIssues.map((i) => i.category).filter(Boolean))];
  }, [normalizedIssues]);

  const filtered = useMemo(() => {
    let result = [...normalizedIssues];

    if (statusFilter) {
      result = result.filter((i) => i.status === statusFilter);
    }

    if (categoryFilter) {
      result = result.filter((i) => i.category === categoryFilter);
    }

    if (q.trim()) {
      const s = q.trim().toLowerCase();
      result = result.filter(
        (i) =>
          (i.title || '').toLowerCase().includes(s) ||
          (i.description || '').toLowerCase().includes(s) ||
          (i.category || '').toLowerCase().includes(s)
      );
    }

    // newest first
    result.sort((a, b) => {
      const ta = new Date(a.timestamp || 0).getTime();
      const tb = new Date(b.timestamp || 0).getTime();
      return tb - ta;
    });

    return compact ? result.slice(0, 5) : result;
  }, [normalizedIssues, statusFilter, categoryFilter, q, compact]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-slate-900">
              {compact ? 'Recent Issues' : 'Community Issues'}
            </h3>
            <p className="text-sm text-slate-600">
              {data
                ? `Total: ${data.totalIssues} • Pending: ${data.byStatus.pending} • In-Process: ${data.byStatus.inProcess} • Solved: ${data.byStatus.solved} • Discarded: ${data.byStatus.discarded}`
                : 'Loading latest data…'}
            </p>
          </div>

          {!compact && (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search issues…"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
              />

              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In-Process">In-Process</option>
                <option value="Solved">Solved</option>
                <option value="Discarded">Discarded</option>
              </select>

              <select
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
            {error}
          </div>
        )}

        {!data && !error && <p className="text-slate-600">Loading issues…</p>}

        {data && filtered.length === 0 && (
          <p className="text-slate-600 text-center py-8">No issues found</p>
        )}

        {data && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((issue) => (
              <div
                key={issue.id}
                className="border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors"
              >
                <button
                  onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                  className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(issue.status)}
                      <h4 className="font-semibold text-slate-900 truncate">{issue.title}</h4>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 text-slate-700">
                        {issue.category}
                      </span>

                      <span
                        className={`inline-block px-2 py-1 text-xs rounded border ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>

                      {issue.area && (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 text-slate-700">
                          {issue.area}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      {issue.timestamp ? new Date(issue.timestamp).toLocaleDateString() : ''}
                    </p>
                  </div>

                  <div className="text-slate-400 flex-shrink-0">
                    {expandedId === issue.id ? '−' : '+'}
                  </div>
                </button>

                {expandedId === issue.id && (
                  <div className="px-4 pb-4 border-t border-slate-200 bg-slate-50 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-1">Description</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{issue.description}</p>
                    </div>

                    {issue.adminNotes && (
                      <div>
                        <p className="text-sm font-medium text-slate-900 mb-1">Admin Update</p>
                        <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                          {issue.adminNotes}
                        </p>
                      </div>
                    )}

                    {issue.resolutionReason && (
                      <div>
                        <p className="text-sm font-medium text-slate-900 mb-1">Resolution Reason</p>
                        <p className="text-sm text-slate-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                          {issue.resolutionReason}
                        </p>
                      </div>
                    )}

                    {issue.dateUpdated && (
                      <p className="text-xs text-slate-500">
                        Last updated: {new Date(issue.dateUpdated).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
