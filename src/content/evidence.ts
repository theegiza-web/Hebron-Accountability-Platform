export interface EvidenceEntry {
  id: string;
  title: string;
  category: 'Financial' | 'Governance' | 'Correspondence' | 'Minutes' | 'Report';
  date: string;
  summary: string;
  sourceDocument: string;
  tags: string[];
  quote?: string;
  downloadUrl?: string;
}

export const evidence: EvidenceEntry[] = [
  {
    id: 'ev-001',
    title: 'Unexplained Variance in Community Expenditure – Financial Review',
    category: 'Financial',
    date: '04 December 2021',
    summary:
      'Financial review documentation records significant variance between approved community expenditure and actual spending. Reports note that large sums were processed without sufficient supporting documentation or clear council resolutions.',
    sourceDocument: 'High-Level Community Report – Bakwena ba Mogopa',
    tags: ['Community Funds', 'Accountability', 'Financial Reporting'],
    quote:
      'Several expenditure items could not be reconciled with approved budgets or council resolutions.',
    downloadUrl: '/downloads/dossier-final-2016-v1.pdf',
  },
  {
    id: 'ev-002',
    title: 'Formal Correspondence Raising Procurement and Appointment Concerns',
    category: 'Correspondence',
    date: '24 May 2016',
    summary:
      'Formal letters submitted to provincial and district offices raise concerns regarding procurement practices, appointment of service providers, and the absence of transparent processes within community administration.',
    sourceDocument:
      'Gross Irregularities Dossier – Bakwena ba Mogopa Traditional Council',
    tags: ['Procurement', 'Governance', 'Transparency'],
    quote:
      'Council was not provided with documentation demonstrating lawful appointment procedures.',
  },
  {
    id: 'ev-003',
    title:
      'Traditional Council Minutes – Allegations of Conflict of Interest and Interference',
    category: 'Minutes',
    date: '23 April 2016',
    summary:
      'Minutes from a community and council meeting document allegations that certain decisions were influenced by individuals with personal or familial interests. Concerns were raised about manipulation of council processes and unlawful meetings.',
    sourceDocument:
      'Traditional Council & Community Meeting Records – Bethanie',
    tags: ['Conflict of Interest', 'Council Proceedings', 'Governance'],
    quote:
      'Council proceedings were allegedly undermined by unlawful meetings and external influence.',
  },
  {
    id: 'ev-004',
    title: 'Analysis of Expenditure on Royal House Renovation',
    category: 'Report',
    date: '20 August 2016',
    summary:
      'A detailed expenditure analysis documents costs exceeding R1.9 million for the renovation of the Royal House. The report raises concerns about the necessity of the project, procurement process followed, and the lack of demonstrated community benefit.',
    sourceDocument:
      'Governance, Finance & Community Matters Dossier – Annexures',
    tags: ['Royal House', 'Wasteful Expenditure', 'Financial Accountability'],
    quote:
      'The total cost of the Royal House renovation was deemed excessive and inadequately justified.',
    downloadUrl: '/downloads/high-level-community-report-2021-v1.pdf',
  },
  {
    id: 'ev-005',
    title:
      'Correspondence on Withdrawal of Community Programme Support',
    category: 'Correspondence',
    date: '09 May 2016',
    summary:
      'Letters and internal records document the withdrawal of support from community programmes following objections raised by administrators regarding irregular instructions. Matters were escalated to oversight authorities.',
    sourceDocument:
      'Traditional Council Correspondence – Provincial & District Offices',
    tags: ['Community Programmes', 'Pressure', 'Accountability'],
    quote:
      'Support was withdrawn after concerns were raised regarding irregular administrative instructions.',
  },
  {
    id: 'ev-006',
    title:
      'Audit Findings – Irregular Payments, Cash Advances, and Asset Use',
    category: 'Financial',
    date: '19 July 2016',
    summary:
      'Audit-related documentation records irregular cash advances, reimbursement claims lacking receipts, and the use of community vehicles without proper authorisation or record-keeping.',
    sourceDocument:
      'Traditional Council Financial Records & Audit Notes',
    tags: ['Financial Irregularities', 'Asset Management', 'Audit'],
    downloadUrl: '/downloads/image-report-v1.pdf'
  },
  {
    id: 'ev-007',
    title:
      'Email and Record Trail – Concerns About External Influence',
    category: 'Correspondence',
    date: '11 November 2015',
    summary:
      'Email correspondence and meeting records suggest that certain decisions affecting community governance may have been influenced by external actors. Reports caution that leadership structures were vulnerable to manipulation.',
    sourceDocument:
      'Community Records & Meeting Submissions – Bakwena ba Mogopa',
    tags: ['External Influence', 'Governance', 'Oversight'],
  },
  {
    id: 'ev-008',
    title:
      'Statement from Former Council Official – Allegations of Sustained Pressure',
    category: 'Report',
    date: '14 January 2017',
    summary:
      'A recorded statement from a former council official alleges sustained pressure to approve irregular payments, suppress documentation, and avoid compliance with council resolutions. The statement indicates concerns were reported to oversight structures.',
    sourceDocument:
      'Community Submission – Recorded Statement',
    tags: ['Allegations', 'Pressure', 'Governance'],
    quote:
      'I was instructed to process payments despite the absence of proper approval or documentation.',
  },
];
