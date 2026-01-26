import React, { useState } from 'react';
import { loadJsonp } from '../utils/jsonp';
import { FEED_URL, withAction, withActionAndKey } from '../config';

export const DebugPanel: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState('');

  if (!import.meta.env.DEV) return null;

  const runTest = async (name: string, url: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await loadJsonp<any>(url, 10000);
      setResult({ name, url, data });
    } catch (e: any) {
      setResult({ name, url, error: e?.message || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden font-sans">
      <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dev Debug Panel</span>
        {loading && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Admin Key (for admin tests)</label>
          <input 
            type="password" 
            value={secret}
            onChange={e => setSecret(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter key..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => runTest('Ping', withAction(FEED_URL, 'ping'))}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-medium transition-colors"
          >
            Ping
          </button>
          <button 
            onClick={() => runTest('Public Issues', withAction(FEED_URL, 'issues'))}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-medium transition-colors"
          >
            Public Issues
          </button>
          <button 
            onClick={() => runTest('Public Responses', withAction(FEED_URL, 'responses'))}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-medium transition-colors"
          >
            Public Responses
          </button>
          <button 
            onClick={() => runTest('Admin Issues', withActionAndKey(FEED_URL, 'admin-issues', secret))}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-medium transition-colors"
          >
            Admin Issues
          </button>
          <button 
            onClick={() => runTest('Admin Responses', withActionAndKey(FEED_URL, 'admin-responses', secret))}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-medium transition-colors"
          >
            Admin Responses
          </button>
          <button 
            onClick={() => setResult(null)}
            className="px-2 py-1.5 bg-red-900/50 hover:bg-red-900/70 rounded text-[10px] font-medium transition-colors text-red-200"
          >
            Clear
          </button>
        </div>

        {result && (
          <div className="mt-4 p-2 bg-black rounded text-[10px] font-mono overflow-auto max-h-48">
            <p className="text-blue-400 mb-1 font-bold"># {result.name}</p>
            {result.error ? (
              <p className="text-red-400">Error: {result.error}</p>
            ) : (
              <div className="space-y-1">
                <p className="text-green-400">Success: {result.data.success ? 'TRUE' : 'FALSE'}</p>
                {result.data.totalIssues !== undefined && <p>Total Issues: {result.data.totalIssues}</p>}
                {result.data.totalResponses !== undefined && <p>Total Responses: {result.data.totalResponses}</p>}
                {result.data.issues && result.data.issues[0] && (
                  <p className="text-slate-400">First Issue ID: {result.data.issues[0].id}</p>
                )}
                {result.data.responses && result.data.responses[0] && (
                  <p className="text-slate-400">First Response ID: {result.data.responses[0].id}</p>
                )}
                <details>
                  <summary className="cursor-pointer text-slate-500">Raw Data</summary>
                  <pre className="mt-1 text-[8px] whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
