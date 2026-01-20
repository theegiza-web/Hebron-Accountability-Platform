export interface TimelineEntry {
  date: string;
  title: string;
  summary: string;
  relatedEvidenceIds: string[];
}

export const timeline: TimelineEntry[] = [
  {
    date: '2011–2014',
    title: 'Early Governance and Financial Concerns Raised',
    summary:
      'Community members begin raising concerns regarding the handling of community funds, decision-making processes, and accountability within traditional leadership structures. Issues are initially discussed informally within the community.',
    relatedEvidenceIds: [],
  },
  {
    date: 'November 2015',
    title: 'Concerns About External Influence Documented',
    summary:
      'Meeting records and correspondence document concerns that external actors, including government-linked officials, may be influencing community governance beyond their oversight mandate. Leadership is described as vulnerable to manipulation.',
    relatedEvidenceIds: ['ev-007'],
  },
  {
    date: 'April 2016',
    title: 'Community and Council Meetings Record Serious Allegations',
    summary:
      'Council and community meetings formally record allegations of conflict of interest, unlawful meetings, and interference in council processes. Calls are made for proper documentation and adherence to lawful procedures.',
    relatedEvidenceIds: ['ev-003'],
  },
  {
    date: 'May 2016',
    title: 'Formal Correspondence Submitted to Oversight Authorities',
    summary:
      'Community representatives submit written complaints and supporting documentation to district and provincial offices responsible for traditional affairs, raising concerns about procurement practices and administrative conduct.',
    relatedEvidenceIds: ['ev-002'],
  },
  {
    date: 'July 2016',
    title: 'Audit-Related Findings Highlight Irregular Payments',
    summary:
      'Financial records and audit notes document irregular payments, unsupported cash advances, and weaknesses in asset control. Recommendations for corrective action are noted.',
    relatedEvidenceIds: ['ev-006'],
  },
  {
    date: 'August 2016',
    title: 'Royal House Renovation Expenditure Analysed',
    summary:
      'A detailed expenditure review highlights costs exceeding R1.9 million for Royal House renovations. Concerns are raised regarding necessity, procurement process, and value for the community.',
    relatedEvidenceIds: ['ev-004'],
  },
  {
    date: 'December 2021',
    title: 'High-Level Community Report Compiled',
    summary:
      'A consolidated report is prepared summarising long-standing governance, financial, and accountability concerns. The report documents unexplained variances, unresolved questions, and failures to provide supporting documentation.',
    relatedEvidenceIds: ['ev-001'],
  },
  {
    date: '2017–2020',
    title: 'Ongoing Instability and Unresolved Issues',
    summary:
      'Despite submissions to oversight structures, many concerns remain unresolved. Community divisions deepen, and calls for transparency and accountability continue without comprehensive resolution.',
    relatedEvidenceIds: [],
  },
  {
    date: 'January 2017',
    title: 'Former Council Official Records Allegations of Pressure',
    summary:
      'A former council official provides a recorded statement alleging sustained pressure to approve irregular payments, suppress documentation, and bypass council resolutions. Concerns are reported to oversight structures.',
    relatedEvidenceIds: ['ev-008'],
  },
  {
    date: '2022–2024',
    title: 'Renewed Community Efforts to Consolidate Documentation',
    summary:
      'Community members begin systematically organising historical records, reports, and correspondence to preserve the documentary trail and prepare for broader public scrutiny.',
    relatedEvidenceIds: [],
  },
  {
    date: 'January 2025',
    title: 'Accountability Platform Launched',
    summary:
      'The Bakwena ba Mogopa accountability platform is launched to centralise documentation, present a clear timeline of events, and invite public engagement and right of reply.',
    relatedEvidenceIds: [],
  },
];
