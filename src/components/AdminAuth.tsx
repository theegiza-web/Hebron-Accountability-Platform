import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { loadJsonp } from '../utils/jsonp';
import { FEED_URL, withActionAndKey } from '../config';

type Props = {
  onAuthenticated: (secret: string) => void;
};

export const AdminAuth: React.FC<Props> = ({ onAuthenticated }) => {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testSecret = async (secret: string) => {
    const url = withActionAndKey(FEED_URL, 'admin-issues', secret);
    const res = await loadJsonp<{ success: boolean; error?: string }>(url, 15000);
    if (res?.success !== true) throw new Error(res?.error || 'Wrong admin key');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!secret.trim()) {
      setError('Please enter the admin secret');
      return;
    }

    setIsSubmitting(true);
    try {
      await testSecret(secret);
      onAuthenticated(secret);
    } catch (e: any) {
      setError(e?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lock className="text-slate-900" size={28} />
              <h1 className="text-2xl font-serif font-bold text-slate-900">Admin Access</h1>
            </div>
            <p className="text-sm text-slate-600 text-center">
              Enter your admin credentials to manage community issues and updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="secret" className="block text-sm font-medium text-slate-900 mb-2">
                Admin Secret Key
              </label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret key"
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-slate-300
                           disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50 flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 text-white font-medium
                         hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
            >
              {isSubmitting ? 'Authenticating...' : 'Access Admin Dashboard'}
            </button>
          </form>

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-600 text-center">
              This dashboard is for authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
