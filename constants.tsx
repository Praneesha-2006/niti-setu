
import { Scheme } from './types';

export const INITIAL_SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    description: 'Direct income support of ₹6,000 per year to all landholding farmers.',
    category: 'Income Support',
    benefit: '₹6,000 per annum in 3 installments'
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM',
    description: 'Subsidies for solar pumps and grid-connected solar power plants.',
    category: 'Solar Energy',
    benefit: '60% subsidy on solar pump installation'
  },
  {
    id: 'agri-infra',
    name: 'Agri-Infrastructure Fund',
    description: 'Post-harvest management infrastructure and community farming assets.',
    category: 'Infrastructure',
    benefit: 'Interest subvention of 3% per annum for 7 years'
  }
];

export const SCHEME_GUIDELINES = {
  'pm-kisan': `
    1. Eligibility: All landholding farmers' families in the country are eligible.
    2. Exclusion Criteria: 
       - Institutional land holders.
       - Families where one or more members belong to: 
         - Former/present holders of constitutional posts.
         - Former/present Ministers.
         - Former/present Mayors of Municipal Corporations.
         - Former/present Chairpersons of District Panchayats.
    3. Proof: "Operational land holdings as per land records of the States/UTs." (Page 2, Section 2)
  `,
  'pm-kusum': `
    1. Eligibility: Individual farmers, groups of farmers, cooperatives, Panchayats, Farmer Producer Organizations (FPOs).
    2. Requirement: Farmers should have sufficient land for solarization.
    3. Subsidy: CFA of 30% from Central Govt, 30% from State Govt, 10% farmer share, 30% loan.
    4. Proof: "Preference will be given to small and marginal farmers with landholding below 5 acres." (Page 12, Guidelines v2.1)
  `,
  'agri-infra': `
    1. Eligibility: Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, FPOs, SHGs, Startups.
    2. Benefit: Loans up to ₹2 Crores with 3% interest subvention.
    3. Proof: "The project must be related to post-harvest management or community farming." (Page 5, Annexure A)
  `
};
