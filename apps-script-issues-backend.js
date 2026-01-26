/***************
 * CONFIG
 ***************/
// Explicitly link the spreadsheet provided
const SPREADSHEET_ID = '19jq_1HBAbN4B_ynMRUjEkaWGMc0D_juxD8V2_vUEqv8';
const SHEET_ISSUES = 'Issues';
const SHEET_RESPONSES = 'Responses';

// Script Properties key name
const PROP_ADMIN_KEY = 'ADMIN_KEY';

/***************
 * ENTRYPOINTS
 ***************/



 
function doGet(e) {
  const callback = (e && e.parameter && e.parameter.callback) ? String(e.parameter.callback) : null;
  
  try {
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : '';

    let result;
    // Public feeds
    if (action === 'issues') result = getIssues_(false);
    else if (action === 'responses') result = getResponses_(false);

    // Admin feeds (via JSONP)
    else if (action === 'admin-issues') result = adminGuard_(e, null, () => getIssues_(true));
    else if (action === 'admin-responses') result = adminGuard_(e, null, () => getResponses_(true));
    
    // Updates can also be called via GET if needed (e.g. via JSONP with params)
    else if (action === 'admin-update-issue' || action === 'update-status') result = adminGuard_(e, null, () => adminUpdateIssue_(e, null));
    else if (action === 'admin-verify-response') result = adminGuard_(e, null, () => adminVerifyResponse_(e, null));
    
    // Debug/Connection Test
    else if (action === 'ping') {
      const ss = getSpreadsheet_();
      result = { 
        success: true, 
        message: 'pong', 
        spreadsheetName: ss.getName(),
        sheets: ss.getSheets().map(s => s.getName())
      };
    }

    else {
      result = {
        success: false,
        error: 'Unknown action: ' + action,
        hint: 'Use ?action=issues | responses | admin-issues | admin-responses',
        updatedAt: new Date().toISOString(),
      };
    }

    return output_(result, callback);

  } catch (err) {
    return output_({ 
      success: false, 
      error: err.toString(),
      stack: err.stack 
    }, callback);
  }
}

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : '{}');
  } catch (err) {
    return output_({ success: false, error: 'Invalid JSON body: ' + err.toString() }, null);
  }

  const action = String(body.action || '');

  try {
    // Public Submits
    if (action === 'submit-issue') return output_(submitIssue_(body), null);
    if (action === 'submit-response') return output_(submitResponse_(body), null);

    // Admin Updates via POST (from AdminDashboard.tsx)
    if (action === 'update-status' || action === 'admin-update-issue') {
      return output_(adminGuard_(e, body, () => adminUpdateIssue_(e, body)), null);
    }
    if (action === 'admin-verify-response') {
      return output_(adminGuard_(e, body, () => adminVerifyResponse_(e, body)), null);
    }

    return output_({ success: false, error: 'Unknown POST action: ' + action }, null);
  } catch (err) {
    return output_({ success: false, error: 'Execution error: ' + err.toString() }, null);
  }
}

/***************
 * PUBLIC: ISSUES
 ***************/
function getIssues_(isAdmin) {
  const sh = getOrCreateSheet_(SHEET_ISSUES, [
    'Timestamp', 'Date Updated', 'ID', 'Title', 'Description', 'Category', 
    'Submitter Name', 'Contact', 'Area', 'Media JSON', 'Status', 
    'Admin Notes', 'Resolution Reason', 'Verified'
  ]);

  const values = sh.getDataRange().getValues();
  if (values.length <= 1) {
    return {
      success: true,
      updatedAt: new Date().toISOString(),
      totalIssues: 0,
      byStatus: { pending: 0, inProcess: 0, solved: 0, discarded: 0 },
      issues: [],
    };
  }

  const headers = values[0].map(v => String(v || '').trim().toLowerCase());
  const rows = values.slice(1).filter(r => r.some(v => String(v || '').trim() !== ''));

  const col = (name) => {
    const target = name.toLowerCase().trim();
    let idx = headers.indexOf(target);
    if (idx < 0) idx = headers.findIndex(h => h.includes(target));
    return idx;
  };

  const issues = rows.map((r) => {
    const contact = String(r[col('Contact')] || '');
    const status = String(r[col('Status')] || 'Pending') || 'Pending';

    return {
      id: String(r[col('ID')] || ''),
      timestamp: asIso_(r[col('Timestamp')]),
      dateUpdated: asIso_(r[col('Date Updated')]),
      title: String(r[col('Title')] || ''),
      description: String(r[col('Description')] || ''),
      category: String(r[col('Category')] || ''),
      submitterName: String(r[col('Submitter Name')] || ''),
      contact: isAdmin ? contact : (contact ? maskContact_(contact) : ''),
      area: String(r[col('Area')] || ''),
      media: safeJson_(r[col('Media JSON')]),
      status: normalizeStatus_(status),
      adminNotes: String(r[col('Admin Notes')] || ''),
      resolutionReason: String(r[col('Resolution Reason')] || ''),
      verified: String(r[col('Verified')] || '').toLowerCase() === 'true',
    };
  });

  const byStatus = countByStatus_(issues);

  return {
    success: true,
    updatedAt: new Date().toISOString(),
    totalIssues: issues.length,
    byStatus,
    issues,
  };
}

function submitIssue_(b) {
  const sh = getOrCreateSheet_(SHEET_ISSUES, [
    'Timestamp', 'Date Updated', 'ID', 'Title', 'Description', 'Category', 
    'Submitter Name', 'Contact', 'Area', 'Media JSON', 'Status', 
    'Admin Notes', 'Resolution Reason', 'Verified'
  ]);

  const id = `ISSUE-${Date.now()}`;
  const ts = new Date();
  const mediaJson = JSON.stringify(Array.isArray(b.media) ? b.media : []);

  sh.appendRow([
    ts, ts, id,
    String(b.title || ''),
    String(b.description || ''),
    String(b.category || ''),
    String(b.submitterName || ''),
    String(b.contact || ''),
    String(b.area || ''),
    mediaJson,
    'Pending', '', '', false
  ]);

  return { success: true, id, message: 'Issue submitted' };
}

/***************
 * PUBLIC: RESPONSES
 ***************/
function getResponses_(isAdmin) {
  const sh = getOrCreateSheet_(SHEET_RESPONSES, [
    'Timestamp', 'ID', 'Respondent Name', 'Respondent Organization', 
    'Respondent Email', 'Respondent Phone', 'Category', 'Issue Reference', 
    'Response Title', 'Response Content', 'Supporting Evidence', 
    'Media JSON', 'Verified', 'Verified At'
  ]);

  const values = sh.getDataRange().getValues();
  if (values.length <= 1) {
    return {
      success: true,
      updatedAt: new Date().toISOString(),
      totalResponses: 0,
      responses: [],
    };
  }

  const headers = values[0].map(v => String(v || '').trim().toLowerCase());
  const rows = values.slice(1).filter(r => r.some(v => String(v || '').trim() !== ''));

  const col = (name) => {
    const target = name.toLowerCase().trim();
    let idx = headers.indexOf(target);
    if (idx < 0) idx = headers.findIndex(h => h.includes(target));
    return idx;
  };

  const responses = rows.map((r) => {
    const email = String(r[col('Email')] || r[col('Respondent Email')] || '');
    const phone = String(r[col('Phone')] || r[col('Respondent Phone')] || '');

    return {
      id: String(r[col('ID')] || ''),
      timestamp: asIso_(r[col('Timestamp')]),
      respondentName: String(r[col('Respondent Name')] || r[col('Name')] || ''),
      respondentOrganization: String(r[col('Organization')] || r[col('Respondent Organization')] || ''),
      respondentEmail: isAdmin ? email : (email ? maskEmail_(email) : ''),
      respondentPhone: isAdmin ? phone : (phone ? maskPhone_(phone) : ''),
      category: String(r[col('Category')] || ''),
      issueReference: String(r[col('Reference')] || r[col('Issue Reference')] || ''),
      responseTitle: String(r[col('Title')] || r[col('Response Title')] || ''),
      responseContent: String(r[col('Content')] || r[col('Response Content')] || ''),
      supportingEvidence: String(r[col('Evidence')] || r[col('Supporting Evidence')] || ''),
      media: safeJson_(r[col('Media JSON')]),
      verified: String(r[col('Verified')] || '').toLowerCase() === 'true',
      verifiedAt: asIso_(r[col('Verified At')]),
    };
  });

  const output = isAdmin ? responses : responses.filter(r => r.verified);

  return {
    success: true,
    updatedAt: new Date().toISOString(),
    totalResponses: output.length,
    responses: output,
    _debugCount: responses.length
  };
}

function submitResponse_(b) {
  const sh = getOrCreateSheet_(SHEET_RESPONSES, [
    'Timestamp', 'ID', 'Respondent Name', 'Respondent Organization', 
    'Respondent Email', 'Respondent Phone', 'Category', 'Issue Reference', 
    'Response Title', 'Response Content', 'Supporting Evidence', 
    'Media JSON', 'Verified', 'Verified At'
  ]);

  const id = `RESPONSE-${Date.now()}`;
  const ts = new Date();
  const mediaJson = JSON.stringify(Array.isArray(b.media) ? b.media : []);

  sh.appendRow([
    ts, id,
    String(b.respondentName || ''),
    String(b.respondentOrganization || ''),
    String(b.respondentEmail || ''),
    String(b.respondentPhone || ''),
    String(b.category || ''),
    String(b.issueReference || ''),
    String(b.responseTitle || ''),
    String(b.responseContent || ''),
    String(b.supportingEvidence || ''),
    mediaJson,
    false, ''
  ]);

  return { success: true, id, message: 'Response submitted' };
}

/***************
 * ADMIN ACTIONS
 ***************/
function adminUpdateIssue_(e, b) {
  const id = b ? b.id : getParam_(e, 'id');
  const status = normalizeStatus_(b ? b.status : getParam_(e, 'status') || 'Pending');
  const adminNotes = b ? b.adminNotes : getParam_(e, 'adminNotes') || '';
  const resolutionReason = b ? b.resolutionReason : getParam_(e, 'resolutionReason') || '';
  const verified = b ? (b.verified === true) : (getParam_(e, 'verified') || '').toLowerCase() === 'true';

  if (!id) return { success: false, error: 'Missing id' };

  const sh = getSpreadsheet_().getSheetByName(SHEET_ISSUES);
  const values = sh.getDataRange().getValues();
  const headers = values[0].map(v => String(v || '').trim().toLowerCase());
  const col = (name) => headers.indexOf(name.toLowerCase().trim());

  const iId = col('id');
  const rowIndex = values.findIndex((r, i) => i > 0 && String(r[iId]) === id);
  if (rowIndex < 0) return { success: false, error: 'Issue not found: ' + id };

  const row = rowIndex + 1;
  const now = new Date();

  setCell_(sh, row, col('Date Updated'), now);
  setCell_(sh, row, col('Status'), status);
  setCell_(sh, row, col('Admin Notes'), adminNotes);
  setCell_(sh, row, col('Resolution Reason'), resolutionReason);
  setCell_(sh, row, col('Verified'), verified);

  return { success: true, id, message: 'Issue updated', updatedAt: now.toISOString() };
}

function adminVerifyResponse_(e, b) {
  const id = b ? b.id : getParam_(e, 'id');
  const verified = b ? (b.verified === true) : (getParam_(e, 'verified') || '').toLowerCase() === 'true';

  if (!id) return { success: false, error: 'Missing id' };

  const sh = getSpreadsheet_().getSheetByName(SHEET_RESPONSES);
  const values = sh.getDataRange().getValues();
  const headers = values[0].map(v => String(v || '').trim().toLowerCase());
  const col = (name) => headers.indexOf(name.toLowerCase().trim());

  const iId = col('id');
  const rowIndex = values.findIndex((r, i) => i > 0 && String(r[iId]) === id);
  if (rowIndex < 0) return { success: false, error: 'Response not found' };

  const row = rowIndex + 1;
  const now = new Date();

  setCell_(sh, row, col('Verified'), verified);
  setCell_(sh, row, col('Verified At'), verified ? now : '');

  return { success: true, id, verified, message: 'Response updated' };
}

/***************
 * AUTH
 ***************/
function adminGuard_(e, b, fn) {
  // Check body first (POST), then parameter (GET)
  const key = (b && (b.secret || b.adminKey)) || getParam_(e, 'adminKey') || getParam_(e, 'secret');
  const expected = String(PropertiesService.getScriptProperties().getProperty(PROP_ADMIN_KEY) || '');

  if (!expected) return { success: false, error: 'ADMIN_KEY not set in Script Properties' };
  if (!key || key !== expected) return { success: false, error: 'Unauthorised (bad key)' };

  return fn();
}

/***************
 * HELPERS
 ***************/
function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      throw new Error("Spreadsheet access error. Ensure SPREADSHEET_ID is correct and script has permissions.");
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreateSheet_(name, headers) {
  const ss = getSpreadsheet_();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  return sh;
}

function output_(obj, callback) {
  const payload = callback ? `${callback}(${JSON.stringify(obj)});` : JSON.stringify(obj);
  return ContentService.createTextOutput(payload)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function asIso_(v) {
  try {
    if (!v) return '';
    if (v instanceof Date) return v.toISOString();
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toISOString();
  } catch (e) { return String(v || ''); }
}

function safeJson_(cellVal) {
  if (!cellVal) return [];
  if (typeof cellVal === 'object') return cellVal;
  const s = String(cellVal).trim();
  try { return JSON.parse(s); } catch { return []; }
}

function getParam_(e, name) {
  return (e && e.parameter && e.parameter[name]) ? String(e.parameter[name]) : '';
}

function setCell_(sh, row, colIndex, value) {
  if (colIndex < 0) return;
  sh.getRange(row, colIndex + 1).setValue(value);
}

function normalizeStatus_(s) {
  const x = String(s || '').trim().toLowerCase();
  if (x === 'pending') return 'Pending';
  if (x === 'in-process' || x === 'inprocess') return 'In-Process';
  if (x === 'solved') return 'Solved';
  if (x === 'discarded') return 'Discarded';
  return 'Pending';
}

function countByStatus_(issues) {
  const out = { pending: 0, inProcess: 0, solved: 0, discarded: 0 };
  for (const i of issues) {
    const s = i.status.toLowerCase();
    if (s === 'pending') out.pending++;
    else if (s === 'in-process') out.inProcess++;
    else if (s === 'solved') out.solved++;
    else if (s === 'discarded') out.discarded++;
  }
  return out;
}

function maskEmail_(email) {
  const s = String(email || '');
  const parts = s.split('@');
  if (parts.length !== 2) return 'Hidden';
  const name = parts[0];
  const domain = parts[1];
  const short = name.length <= 2 ? name[0] + '*' : name[0] + '***' + name[name.length - 1];
  return `${short}@${domain}`;
}

function maskPhone_(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return 'Hidden';
  const last4 = digits.slice(-4);
  return `••••${last4}`;
}

function maskContact_(c) {
  const s = String(c || '');
  if (s.includes('@')) return maskEmail_(s);
  return maskPhone_(s);
}
