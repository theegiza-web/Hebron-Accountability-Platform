import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { LogOut, AlertCircle, Loader, Filter, MessageSquare, List } from 'lucide-react';
import { loadJsonp } from '../utils/jsonp';
import { withActionAndKey, FEED_URL } from '../config';
import { AdminResponses } from './AdminResponses';

type Issue = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: string;
  submitterName: string;
  contact: string;
  area: string;
  status: 'Pending' | 'In-Process' | 'Solved' | 'Discarded';
  adminNotes: string;
  resolutionReason: string;
  dateUpdated: string;
};

type ResponseData = {
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
  media: any[];
  verified: boolean;
  verifiedAt: string;
};

type Feed = {
  updatedAt: string;
  totalIssues?: number;
  totalResponses?: number;
  byStatus?: {
    pending: number;
    inProcess: number;
    solved: number;
    discarded: number;
  };
  issues?: Issue[];
  responses?: ResponseData[];
};

type Props = {
  secret: string;
  onLogout: () => void;
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

export const AdminDashboard: React.FC<Props> = ({ secret, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'responses'>('issues');
  const [issuesData, setIssuesData] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    status: 'In-Process',
    adminNotes: '',
    resolutionReason: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  const loadIssues = useCallback(async () => {
    setError(null);
    try {
      const url = withActionAndKey(FEED_URL, 'admin-issues', secret);
      const json = await loadJsonp<Feed>(url, 15000);
      setIssuesData(json);
    } catch (e: any) {
      setError(e?.message || 'Failed to load issues');
    }
  }, [secret]);

  // Initial load
  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const filteredIssues = useMemo(() => {
    if (!issuesData?.issues) return [];
    let result = [...issuesData.issues];

    if (statusFilter) {
      result = result.filter((i) => i.status === statusFilter);
    }

    return result.sort((a, b) => {
      // Pending first, then by date
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [issuesData, statusFilter]);

  const startEdit = (issue: Issue) => {
    setEditingId(issue.id);
    setEditData({
      status: issue.status,
      adminNotes: issue.adminNotes,
      resolutionReason: issue.resolutionReason,
    });
  };

  const handleUpdate = async (issueId: string) => {
    setUpdateLoading(true);

    try {
      const url = FEED_URL;
      
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'update-status',
          id: issueId,
          status: editData.status,
          adminNotes: editData.adminNotes,
          resolutionReason: editData.resolutionReason,
          adminKey: secret,
        }),
      });

      setEditingId(null);

      // Reload data after a short delay
      setTimeout(loadIssues, 2000);
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : 'Update failed'));
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-600">Secure Management Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadIssues();
              }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <Loader size={18} className={updateLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-900
                         hover:bg-slate-200 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          <button
            onClick={() => setActiveTab('issues')}
            className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'issues'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <List size={18} />
            Issues ({issuesData?.totalIssues || 0})
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'responses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <MessageSquare size={18} />
            Responses
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'issues' ? (
          <>
            {/* Issues Content */}
            {issuesData?.byStatus && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{issuesData.byStatus.pending}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-600">In-Process</p>
                  <p className="text-3xl font-bold text-blue-600">{issuesData.byStatus.inProcess}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-600">Solved</p>
                  <p className="text-3xl font-bold text-green-600">{issuesData.byStatus.solved}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-600">Discarded</p>
                  <p className="text-3xl font-bold text-red-600">{issuesData.byStatus.discarded}</p>
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center gap-2">
              <Filter size={18} className="text-slate-600" />
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
              >
                <option value="">All Issues</option>
                <option value="Pending">Pending</option>
                <option value="In-Process">In-Process</option>
                <option value="Solved">Solved</option>
                <option value="Discarded">Discarded</option>
              </select>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 flex items-start gap-2">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {!issuesData && !error && (
                <div className="text-center py-12">
                  <Loader className="animate-spin mx-auto mb-2 text-slate-400" />
                  <p className="text-slate-600">Loading issues...</p>
                </div>
              )}

              {issuesData && filteredIssues.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-600">No issues found</p>
                </div>
              )}

              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${
                    editingId === issue.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-lg">{issue.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{issue.id}</p>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full border font-medium ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">{issue.category}</span>
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">{issue.area}</span>
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">By {issue.submitterName}</span>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap mb-4">{issue.description}</p>
                    {!editingId || editingId !== issue.id ? (
                      <>
                        {issue.adminNotes && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-xs font-medium text-blue-900 mb-1">Admin Notes</p>
                            <p className="text-sm text-blue-800">{issue.adminNotes}</p>
                          </div>
                        )}
                        {issue.resolutionReason && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-xs font-medium text-yellow-900 mb-1">Resolution Reason</p>
                            <p className="text-sm text-yellow-800">{issue.resolutionReason}</p>
                          </div>
                        )}
                        <p className="text-xs text-slate-600 mb-3 font-mono">Contact: {issue.contact}</p>
                        <p className="text-xs text-slate-500">
                          Submitted: {new Date(issue.timestamp).toLocaleString()}
                        </p>
                        <button
                          onClick={() => startEdit(issue)}
                          className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                        >
                          Update Status
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4 pt-2">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Status</label>
                            <select
                              value={editData.status}
                              onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In-Process">In-Process</option>
                              <option value="Solved">Solved</option>
                              <option value="Discarded">Discarded</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Admin Notes / Resolution</label>
                          <textarea
                            value={editData.status === 'Solved' || editData.status === 'Discarded' ? editData.resolutionReason : editData.adminNotes}
                            onChange={(e) => {
                              if (editData.status === 'Solved' || editData.status === 'Discarded') {
                                setEditData(prev => ({ ...prev, resolutionReason: e.target.value }));
                              } else {
                                setEditData(prev => ({ ...prev, adminNotes: e.target.value }));
                              }
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(issue.id)}
                            disabled={updateLoading}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-300"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <AdminResponses secret={secret} />
        )}
      </div>
    </div>
  );
};
