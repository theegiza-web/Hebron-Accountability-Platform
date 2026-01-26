import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MessageSquare, Loader, AlertCircle } from 'lucide-react';
import { loadJsonp } from '../utils/jsonp';
import { withActionAndKey, FEED_URL } from '../config';

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
  totalResponses?: number;
  responses?: ResponseData[];
};

type Props = {
  secret: string;
};

export const AdminResponses: React.FC<Props> = ({ secret }) => {
  const [data, setData] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = withActionAndKey(FEED_URL, 'admin-responses', secret);
      const json = await loadJsonp<Feed>(url, 15000);
      setData(json);
    } catch (e: any) {
      setError(e?.message || 'Failed to load responses');
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sortedResponses = useMemo(() => {
    if (!data?.responses) return [];
    return [...data.responses].sort((a, b) => {
      // Unverified first
      if (!a.verified && b.verified) return -1;
      if (a.verified && !b.verified) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [data]);

  const handleVerifyResponse = async (responseId: string, verified: boolean) => {
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
          action: 'admin-verify-response',
          id: responseId,
          verified,
          adminKey: secret,
        }),
      });
      
      // Reload after delay
      setTimeout(loadData, 2000);
    } catch (e) {
      alert('Failed to update response');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare size={20} />
          Manage Responses ({data?.totalResponses || 0})
        </h2>
        <button
          onClick={loadData}
          disabled={loading || updateLoading}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Loader size={18} className={loading || updateLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 flex items-start gap-2">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading && !data && (
        <div className="text-center py-12">
          <Loader className="animate-spin mx-auto mb-2 text-slate-400" />
          <p className="text-slate-600">Loading responses...</p>
        </div>
      )}

      {!loading && data && sortedResponses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-600">No responses found</p>
        </div>
      )}

      <div className="space-y-4">
        {sortedResponses.map((res) => (
          <div key={res.id} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">{res.responseTitle}</h3>
                <p className="text-sm text-slate-500">{res.respondentName} ({res.respondentOrganization})</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                res.verified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {res.verified ? 'Verified' : 'Unverified'}
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-4 text-xs bg-slate-50 p-3 rounded border border-slate-100">
              <p><span className="font-bold text-slate-500">Ref:</span> {res.issueReference}</p>
              <p><span className="font-bold text-slate-500">Email:</span> {res.respondentEmail}</p>
              <p><span className="font-bold text-slate-500">Phone:</span> {res.respondentPhone}</p>
              <p><span className="font-bold text-slate-500">Date:</span> {new Date(res.timestamp).toLocaleString()}</p>
            </div>

            <p className="text-sm text-slate-700 mb-6 whitespace-pre-wrap">{res.responseContent}</p>

            <div className="flex gap-3">
              <button
                onClick={() => handleVerifyResponse(res.id, !res.verified)}
                disabled={updateLoading}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  res.verified 
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {res.verified ? 'Unverify' : 'Verify & Publish'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
