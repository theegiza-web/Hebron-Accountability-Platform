import React, { useEffect, useMemo, useState } from "react";
import { loadJsonp } from "../utils/jsonp";
import { withAction } from "../config";

type Row = {
  timestamp: string;
  name: string;
  phonePreview: string;
  area?: string;
};

type Feed = {
  updatedAt: string;
  totalSignatures: number;
  anonymousSignatures: number;
  rows: Row[];
};

type Props = {
  feedUrl: string;
  compact?: boolean;
};

export const PetitionSignatures: React.FC<Props> = ({ feedUrl, compact = false }) => {
  if (!feedUrl.startsWith("http")) {
    console.error("Bad feedUrl:", feedUrl);
  }

  const [data, setData] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    setError(null);
    
    // Add action=petition to the feedUrl
    const url = withAction(feedUrl, 'petition');

    loadJsonp<Feed>(url, 15000)
      .then((json) => {
        if (!alive) return;
        setData(json);
      })
      .catch((e: any) => {
        if (!alive) return;
        setError(e?.message || "Failed to load");
      });

    return () => {
      alive = false;
    };
  }, [feedUrl]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toLowerCase();
    const base = !s
      ? data.rows
      : data.rows.filter(
          (r) =>
            r.name.toLowerCase().includes(s) ||
            r.phonePreview.toLowerCase().includes(s) ||
            (r.area || "").toLowerCase().includes(s)
        );
    return compact ? base.slice(0, 10) : base;
  }, [data, q, compact]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h3 className="text-xl font-serif font-semibold text-slate-900">
              {compact ? "Live Signatures" : "Petition Signatures"}
            </h3>
            <p className="text-sm text-slate-600">
              {data
                ? `Total: ${data.totalSignatures} • Anonymous: ${data.anonymousSignatures} • Updated: ${new Date(
                    data.updatedAt
                  ).toLocaleString()}`
                : "Loading latest figures…"}
            </p>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / digits / area…"
            className="w-full sm:w-72 px-4 py-2 rounded-lg border border-slate-200 bg-white
                       focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
            {error}
          </div>
        )}

        {!data && !error && <p className="text-slate-600">Loading signatures…</p>}

        {data && (
          <>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full bg-white">
                <thead className="bg-white border-b border-slate-200">
                  <tr>
                    <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">Name</th>
                    <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">Cell (partial)</th>
                    <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">Area</th>
                    <th className="text-left text-sm font-semibold text-slate-700 px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={`${r.timestamp}-${idx}`} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 text-slate-900">{r.name}</td>
                      <td className="px-4 py-3 text-slate-700">{r.phonePreview}</td>
                      <td className="px-4 py-3 text-slate-700">{r.area || "—"}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {r.timestamp ? new Date(r.timestamp).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              Phone numbers are never displayed in full. Anonymous selections are respected.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
