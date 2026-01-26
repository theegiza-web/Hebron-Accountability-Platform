// src/config.ts

// ✅ Issues + Responses (same Apps Script)
export const FEED_URL =
  'https://script.google.com/macros/s/AKfycbyj-3AVyMcoxDsYURw7eQY60zFCbZLuoOmkJWTomDfYT_hOUcNxruGYct9PQ2F3zCVT/exec';

// ✅ Petition (separate Apps Script)
export const PETITION_FEED_URL =
  'https://script.google.com/macros/s/AKfycbxmz1XsZOEzqoOfVGmarcSMz41JQCpFE0Y6LwtAz9CHEXADauz4uDd1yURZr4Pss9fN/exec';

// Helper: add ?action=... safely
export const withAction = (base: string, action: string) => {
  const url = new URL(base);
  url.searchParams.set('action', action);
  return url.toString();
};

// Helper: add ?action=...&adminKey=... safely
export const withActionAndKey = (base: string, action: string, adminKey: string) => {
  const url = new URL(base);
  url.searchParams.set('action', action);
  url.searchParams.set('adminKey', adminKey);
  return url.toString();
};

// Optional convenience getters
export const issuesListUrl = () => withAction(FEED_URL, 'issues');
export const responsesListUrl = () => withAction(FEED_URL, 'responses');
export const petitionListUrl = () => withAction(PETITION_FEED_URL, 'petition');
