export interface Issue {
  id: string;
  title: string;
  problem: string;
  whyItMatters: string;
  whatWeAskFor: string;
}

export const issues: Issue[] = [
  {
    id: 'issue-001',
    title: 'Procurement and Appointment Practices',
    problem:
      'Community records and reports raise concerns about how service providers and contractors were appointed to carry out work funded by community resources. Documentation indicates that appointments were made without clear council resolutions, transparent processes, or evidence of competitive consideration. In several instances, the same service providers appear repeatedly without documented justification.',
    whyItMatters:
      'Community funds and assets must be managed through fair, transparent processes that prioritise value and community benefit. When procurement and appointments lack proper procedure, trust in leadership erodes and the risk of favouritism, wasteful expenditure, and misuse of resources increases.',
    whatWeAskFor:
      'We ask that all past and current appointments of service providers be reviewed; that clear procurement and appointment procedures be documented and shared with the community; that council resolutions approving appointments be published; and that future appointments follow transparent, documented processes.',
  },
  {
    id: 'issue-002',
    title: 'Financial Accountability and Record-Keeping',
    problem:
      'Financial documentation reviewed by the community records unexplained expenditure, irregular payments, and instances where supporting documentation such as receipts, invoices, or council approvals could not be produced. Reports further note weaknesses in budgeting, reporting, and reconciliation of community funds.',
    whyItMatters:
      'Community members have a right to know how their funds are used and to see clear records demonstrating lawful expenditure. Weak financial controls and missing documentation make it difficult to verify that funds are spent for community benefit and increase the risk of misappropriation.',
    whatWeAskFor:
      'We ask that comprehensive financial statements be prepared and shared regularly; that all expenditure be supported by documentation and council approval; that independent audits be conducted where necessary; and that corrective measures be implemented to strengthen financial controls.',
  },
  {
    id: 'issue-003',
    title: 'Conflicts of Interest and Ethical Conduct',
    problem:
      'Meeting minutes and community submissions record allegations that certain decisions were influenced by personal, familial, or close relationships. These include claims that individuals involved in decision-making stood to benefit directly or indirectly from contracts or payments authorised.',
    whyItMatters:
      'Traditional leadership and council members are entrusted to act in the interests of the entire community. Where conflicts of interest are not disclosed or managed, decision-making can be compromised and community resources diverted for private gain.',
    whatWeAskFor:
      'We ask that all council members and officials declare potential conflicts of interest; that individuals recuse themselves from decisions where such conflicts exist; and that clear ethical guidelines be adopted and enforced to protect the integrity of governance processes.',
  },
  {
    id: 'issue-004',
    title: 'External Interference and Undue Influence',
    problem:
      'Documented correspondence and reports raise concerns that certain external actors, including government-linked officials, may have interfered in community affairs beyond their lawful oversight role. These records describe allegations of undue influence, pressure on administrators, and manipulation of leadership structures for interests not aligned with the community.',
    whyItMatters:
      'The community has a right to govern its affairs through lawful structures without improper external interference. When outside influence distorts decision-making, it undermines autonomy, weakens accountability, and can facilitate corruption and abuse of power.',
    whatWeAskFor:
      'We ask that any alleged external interference be independently examined; that the roles and limits of government oversight be clarified and respected; and that safeguards be put in place to protect community governance from undue influence.',
  },
  {
    id: 'issue-005',
    title: 'Accountability, Investigation, and Right of Reply',
    problem:
      'This platform documents serious concerns and allegations relating to governance, finance, and administration. While these matters require scrutiny, individuals and institutions referenced have not always been given an adequate opportunity to respond publicly with their own evidence and explanations.',
    whyItMatters:
      'True accountability requires fairness. Documenting concerns must be accompanied by opportunities for response, correction, and investigation. Without this balance, trust in both leadership and accountability processes is undermined.',
    whatWeAskFor:
      'We invite all individuals and institutions referenced in documented concerns to submit a response with supporting evidence. We further ask that appropriate oversight bodies investigate these matters independently and communicate findings transparently to the community.',
  },
];
