import 'server-only';

import type {Investigation, Report} from '@/shared/types';

export const REPORTS: Report[] = [
  {
    slug: 'eu-digital-markets-act-enforcement',
    title: 'EU Digital Markets Act: Why Brussels is targeting American tech giants now',
    summary:
      "An analysis of the political, economic, and strategic motivations behind the EU's aggressive enforcement timeline for the Digital Markets Act against major US technology platforms.",
    executiveSummary:
      "The EU's accelerated DMA enforcement against US tech gatekeepers is driven by a convergence of industrial policy ambitions, electoral dynamics, and a strategic window created by transatlantic tensions. While consumer protection is the stated rationale, the evidence suggests three primary motivations: (1) creating competitive space for European digital champions, (2) leveraging regulatory power as geopolitical influence amid shifting US-EU relations, and (3) responding to domestic political pressure from European SMEs and media companies who have lobbied intensively against platform dominance. The timing correlates strongly with the European Commission's institutional calendar and upcoming budget negotiations rather than any specific consumer harm trigger.",
    category: 'regulation',
    geography: 'European Union',
    tags: ['technology', 'antitrust', 'trade', 'digital policy'],
    publishedAt: '2026-03-10T14:00:00Z',
    featured: false,
    stakeholders: [
      {
        name: 'European Commission (DG Competition)',
        role: 'Regulator and enforcer of the DMA',
        incentives: [
          'Demonstrate institutional relevance and enforcement capability',
          'Build precedent for digital regulation leadership globally',
          'Respond to pressure from EU member state governments',
        ],
        confidence: 'high',
      },
      {
        name: 'Major US tech platforms (Apple, Google, Meta, Amazon)',
        role: 'Designated gatekeepers under the DMA',
        incentives: [
          'Minimize compliance costs and operational disruption',
          'Delay enforcement through legal challenges',
          'Maintain platform ecosystems and revenue models',
        ],
        confidence: 'high',
      },
      {
        name: 'European digital SMEs and startups',
        role: 'Potential beneficiaries of reduced platform dominance',
        incentives: [
          'Gain access to platform markets on fairer terms',
          'Reduce dependency on US platform advertising',
          'Push for aggressive enforcement timelines',
        ],
        confidence: 'medium',
      },
      {
        name: 'European media and publishing industry',
        role: 'Long-standing advocates for platform regulation',
        incentives: [
          'Recapture advertising revenue lost to platforms',
          'Secure favorable terms for news content distribution',
          'Strengthen bargaining position against aggregators',
        ],
        confidence: 'high',
      },
    ],
    motivations: [
      {
        title: 'Industrial policy through regulation',
        summary:
          'The DMA enforcement creates a regulatory moat that benefits European digital companies by raising compliance costs for dominant US platforms, effectively functioning as industrial policy disguised as consumer protection.',
        confidence: 'high',
        supportingEvidence: [
          "EU internal strategy documents reference 'digital sovereignty' goals",
          'Timing aligns with European Chips Act and other industrial policy measures',
          'Enforcement targets are exclusively non-EU companies',
        ],
      },
      {
        title: 'Geopolitical leverage amid transatlantic tensions',
        summary:
          'Regulatory action against US tech companies serves as a bargaining chip in broader trade and security negotiations with the United States.',
        confidence: 'medium',
        supportingEvidence: [
          'Enforcement acceleration coincides with US tariff threats',
          'Commission officials have linked digital regulation to trade negotiations in private briefings',
        ],
      },
      {
        title: 'Domestic political pressure from SMEs and media',
        summary:
          'European small businesses and media companies have run sustained lobbying campaigns, and Commission officials face electoral incentives to be seen acting against perceived US tech dominance.',
        confidence: 'high',
        supportingEvidence: [
          'Over 200 European trade associations signed an open letter demanding faster DMA enforcement',
          'European media lobby spending on DMA-related advocacy increased 340% since 2023',
        ],
      },
    ],
    evidence: [
      {
        claim:
          "The European Commission explicitly tied DMA enforcement to 'digital sovereignty' objectives in internal planning documents.",
        source: 'Leaked Commission working paper, reported by Politico EU',
        sourceUrl: 'https://example.com/politico-dma-leak',
        confidence: 'high',
      },
      {
        claim:
          'All six designated gatekeepers under the DMA are headquartered outside the EU, suggesting regulatory targeting.',
        source: 'European Commission official gatekeeper designation list',
        sourceUrl: 'https://example.com/ec-gatekeepers',
        confidence: 'high',
      },
      {
        claim:
          'European media lobby spending on DMA advocacy increased 340% between 2023 and 2025.',
        source: 'EU Transparency Register, compiled by Corporate Europe Observatory',
        sourceUrl: 'https://example.com/lobby-data',
        confidence: 'medium',
      },
    ],
    assumptions: [
      'Leaked documents reflect actual Commission strategic thinking and were not planted or taken out of context.',
      'Lobbying expenditure data from the EU Transparency Register is reasonably complete and accurate.',
      'The absence of EU-headquartered companies from the gatekeeper list is not simply a function of market share thresholds.',
    ],
    limitations: [
      'This analysis cannot establish causal intent — correlation between timing events and enforcement does not prove coordination.',
      'Internal Commission deliberations are largely opaque; reported leaks may represent only minority viewpoints.',
      "The analysis focuses on political economy motivations and does not assess the merits of the DMA's consumer protection arguments.",
    ],
    alternativeExplanations: [
      'The enforcement timeline is genuinely driven by consumer harm evidence and technical readiness, not political calculus.',
      'Institutional momentum — once the DMA was passed, bureaucratic processes naturally accelerated enforcement regardless of external factors.',
      'Individual career ambitions of senior DG Competition officials seeking to establish legacy-defining cases.',
    ],
  },
  {
    slug: 'us-lng-export-permit-freeze',
    title: 'US LNG export permit freeze: Climate action or strategic energy play?',
    summary:
      "Examining the overlapping climate, diplomatic, and domestic energy motivations behind the Biden administration's pause on new LNG export terminal approvals.",
    executiveSummary:
      'The freeze on new LNG export permits appears motivated less by pure climate considerations than by a combination of: (1) electoral positioning ahead of climate-conscious voter blocs, (2) leveraging energy export policy as a tool in Middle East and European diplomacy, and (3) responding to growing domestic concerns about natural gas price impacts on American consumers and manufacturers. Environmental groups celebrate the decision, but the evidence suggests climate impact is a secondary benefit rather than the primary driver.',
    category: 'policy',
    geography: 'United States',
    tags: ['energy', 'climate', 'trade', 'geopolitics'],
    publishedAt: '2026-03-08T10:00:00Z',
    featured: true,
    stakeholders: [
      {
        name: 'Biden Administration (DOE & NSC)',
        role: 'Decision-maker on export permit approvals',
        incentives: [
          'Maintain electoral coalition including climate voters',
          'Use energy exports as diplomatic leverage',
          'Manage domestic energy price inflation',
        ],
        confidence: 'high',
      },
      {
        name: 'US LNG developers and fossil fuel industry',
        role: 'Permit applicants and export terminal operators',
        incentives: [
          'Secure long-term export contracts worth billions',
          'Maintain US position as top global LNG exporter',
          'Prevent regulatory precedent that could expand to other fossil fuels',
        ],
        confidence: 'high',
      },
      {
        name: 'Environmental advocacy organizations',
        role: 'Primary public advocates for the permit freeze',
        incentives: [
          'Reduce US fossil fuel infrastructure expansion',
          'Establish legal and political precedent for climate-based permitting reviews',
          'Demonstrate political influence ahead of elections',
        ],
        confidence: 'high',
      },
      {
        name: 'European energy importers',
        role: 'Key buyers of US LNG, especially post-Russia sanctions',
        incentives: [
          'Secure reliable, diversified gas supply',
          'Avoid dependency on any single supplier',
          'Negotiate favorable long-term pricing',
        ],
        confidence: 'medium',
      },
    ],
    motivations: [
      {
        title: 'Electoral positioning with climate voters',
        summary:
          'The permit freeze signals climate commitment to a voter base that is critical in swing states, without requiring legislative action that could fail in Congress.',
        confidence: 'high',
        supportingEvidence: [
          'Announcement timing preceded key primary campaign events',
          'Polling data showed climate as a top-3 issue for young voters in battleground states',
        ],
      },
      {
        title: 'Energy diplomacy leverage',
        summary:
          'Controlling the pace of LNG exports gives the administration negotiating power with European allies and Middle Eastern energy producers.',
        confidence: 'medium',
        supportingEvidence: [
          "NSC briefing documents reference 'strategic energy management' in diplomatic contexts",
          'Concurrent negotiations with Qatar on LNG pricing and supply routes',
        ],
      },
      {
        title: 'Domestic price management',
        summary:
          'Rising US natural gas prices, partly driven by export demand, create political risk. Slowing exports helps manage domestic energy costs.',
        confidence: 'medium',
        supportingEvidence: [
          'US natural gas spot prices rose 40% in the year preceding the freeze',
          'Industrial lobby groups cited export-driven price increases in formal comments to DOE',
        ],
      },
    ],
    evidence: [
      {
        claim: 'The permit freeze announcement was timed to precede Super Tuesday primaries.',
        source: 'White House press schedule analysis, Reuters',
        sourceUrl: 'https://example.com/reuters-lng-timing',
        confidence: 'medium',
      },
      {
        claim: 'Climate ranked as a top-3 issue for voters under 30 in six battleground states.',
        source: 'Pew Research Center / AP-NORC polling, January 2026',
        sourceUrl: 'https://example.com/pew-climate-poll',
        confidence: 'high',
      },
      {
        claim:
          'US natural gas spot prices rose approximately 40% in the 12 months prior to the freeze.',
        source: 'US Energy Information Administration data',
        sourceUrl: 'https://example.com/eia-gas-prices',
        confidence: 'high',
      },
    ],
    assumptions: [
      'Polling data accurately reflects voter priorities and is not an artifact of survey design.',
      'The timing correlation with political events reflects intentional scheduling.',
      "NSC briefing references to 'strategic energy management' relate to the export permit policy specifically.",
    ],
    limitations: [
      'The analysis relies partly on leaked or reported documents whose full context is not available.',
      'Electoral motivation is inferred from timing and polling, not direct statements of intent.',
      'The domestic price impact of LNG exports is debated among energy economists.',
    ],
    alternativeExplanations: [
      'The freeze is a genuine response to updated climate science and emissions modeling.',
      'Bureaucratic delays and incomplete environmental reviews necessitated a formal pause.',
      'The decision was primarily driven by a single influential environmental lawsuit rather than strategic calculation.',
    ],
  },
  {
    slug: 'india-semiconductor-subsidy-program',
    title:
      "India's $10B semiconductor push: Building chip sovereignty or courting foreign capital?",
    summary:
      "Analyzing the geopolitical, industrial, and domestic political motivations behind India's aggressive semiconductor manufacturing incentive program.",
    executiveSummary:
      "India's semiconductor subsidy program is positioned as a national security and economic sovereignty initiative, but the evidence points to a more complex set of motivations: (1) positioning India as the primary alternative to China in global chip supply chains, (2) attracting foreign direct investment to boost GDP growth metrics ahead of state elections, and (3) building domestic political narratives around 'Atmanirbhar Bharat' (self-reliant India) that resonate with the ruling party's electoral base. The technical feasibility of achieving semiconductor self-sufficiency at scale remains questionable given infrastructure gaps.",
    category: 'policy',
    geography: 'India',
    tags: ['semiconductors', 'industrial-policy', 'FDI', 'technology'],
    publishedAt: '2026-03-05T08:00:00Z',
    featured: false,
    stakeholders: [
      {
        name: 'Indian Ministry of Electronics and IT',
        role: 'Program architect and fund administrator',
        incentives: [
          'Demonstrate ministry relevance in national security domain',
          'Attract major FDI announcements',
          'Build bureaucratic capacity and budget',
        ],
        confidence: 'high',
      },
      {
        name: 'Global semiconductor companies (TSMC, Samsung, Intel)',
        role: 'Potential investment partners',
        incentives: [
          'Diversify manufacturing geography away from Taiwan risk',
          'Access subsidies to reduce capital expenditure',
          "Gain preferential access to India's growing domestic market",
        ],
        confidence: 'high',
      },
      {
        name: 'Ruling party leadership',
        role: "Political sponsors of the 'self-reliant India' narrative",
        incentives: [
          'Generate high-profile investment announcements before elections',
          'Reinforce nationalist economic narrative',
          'Create industrial jobs in politically important states',
        ],
        confidence: 'high',
      },
    ],
    motivations: [
      {
        title: 'China+1 supply chain positioning',
        summary:
          'India aims to capture manufacturing investment fleeing China-dependent supply chains, using subsidies as the primary competitive tool against Vietnam and Malaysia.',
        confidence: 'high',
        supportingEvidence: [
          "Program explicitly references 'supply chain resilience' in policy documents",
          'Subsidy structure mirrors programs in competing nations',
        ],
      },
      {
        title: 'Electoral signaling through FDI announcements',
        summary:
          'Major investment announcements serve as tangible proof of economic management competence, with subsidy disbursement timed to electoral cycles.',
        confidence: 'medium',
        supportingEvidence: [
          'Three of four major announcements preceded state election dates',
          'Government PR spending on semiconductor program increased 500% in election months',
        ],
      },
    ],
    evidence: [
      {
        claim:
          'Three of four major semiconductor investment announcements preceded state elections by less than 60 days.',
        source: 'Election Commission calendar cross-referenced with PIB press releases',
        sourceUrl: 'https://example.com/india-chip-timeline',
        confidence: 'medium',
      },
      {
        claim:
          "The subsidy program's design closely mirrors Taiwan's and South Korea's historical chip incentive structures.",
        source: 'Brookings Institution comparative analysis',
        sourceUrl: 'https://example.com/brookings-chip-subsidies',
        confidence: 'high',
      },
    ],
    assumptions: [
      'Electoral timing correlations reflect strategic scheduling rather than coincidence.',
      "India's infrastructure can support large-scale semiconductor fabrication within the stated timeline.",
    ],
    limitations: [
      'Access to internal government deliberations is limited; motivations are inferred from policy design and timing.',
      'The analysis focuses on political economy factors and does not assess technical feasibility in depth.',
    ],
    alternativeExplanations: [
      'The program is a genuine national security response to supply chain vulnerabilities exposed during COVID-19.',
      "India's chip push is primarily driven by corporate lobbying from domestic electronics assemblers seeking local chip supply.",
    ],
  },
  {
    slug: 'indonesia-fuel-subsidy-reform',
    title: "Indonesia's fuel subsidy reform: Fiscal responsibility or political risk management?",
    summary:
      'An investigation into why the Indonesian government is moving to cut and retarget fuel subsidies, and how fiscal pressures, infrastructure ambitions, and electoral politics shape the timing and design of the reform.',
    executiveSummary:
      "Indonesia's gradual rollback and retargeting of fuel subsidies is framed as a move toward 'more just and productive' spending. The evidence suggests three intertwined motivations that matter directly for Indonesian citizens: (1) freeing up budget space for infrastructure, health, and education without significantly raising overall debt levels, (2) protecting macroeconomic stability amid rupiah volatility and rising global energy prices, and (3) managing political backlash from middle-class urban drivers and fuel-intensive small businesses ahead of national and local elections. While social assistance programs are expanded to cushion low-income households, implementation capacity and public trust remain key constraints that will determine whether the reform is perceived as fairness or sacrifice.",
    category: 'policy',
    geography: 'Indonesia',
    tags: ['energy', 'subsidies', 'inflation', 'elections'],
    publishedAt: '2026-03-02T12:00:00Z',
    featured: true,
    stakeholders: [
      {
        name: 'Ministry of Finance of Indonesia',
        role: 'Designs and defends the subsidy reform in the state budget',
        incentives: [
          'Reduce fiscal pressure from volatile energy subsidy spending',
          "Protect Indonesia's investment-grade credit rating",
          'Create room for priority infrastructure and social spending',
        ],
        confidence: 'high',
      },
      {
        name: 'Pertamina and downstream fuel distributors',
        role: 'State-owned and private actors implementing price and quota changes',
        incentives: [
          'Ensure cost recovery and predictable margins',
          'Avoid supply disruptions during transition periods',
          'Maintain political favor by avoiding visible shortages or long queues',
        ],
        confidence: 'medium',
      },
      {
        name: 'Urban middle-class motorists and ride-hailing drivers',
        role: 'Highly vocal and politically sensitive group affected by price hikes',
        incentives: [
          'Keep daily commuting and operating costs manageable',
          'Avoid sudden price shocks that reduce disposable income',
          'Leverage social media and protests to pressure policymakers',
        ],
        confidence: 'high',
      },
      {
        name: 'Low-income households receiving targeted assistance',
        role: 'Intended beneficiaries of compensatory social programs',
        incentives: [
          'Ensure subsidy savings translate into real and timely cash transfers',
          'Maintain purchasing power for basic necessities amid inflation',
          'Avoid being crowded out by better-connected groups in program targeting',
        ],
        confidence: 'medium',
      },
    ],
    motivations: [
      {
        title: 'Reallocating budget from subsidies to development',
        summary:
          'Fuel subsidies crowd out long-term investments in transport, health, and education; cutting them creates fiscal room to fund projects that matter visibly to voters and investors.',
        confidence: 'high',
        supportingEvidence: [
          'Budget documents show energy subsidies approaching or exceeding capital expenditure in some years',
          'Government communications highlight trade-offs between subsidies and infrastructure projects like MRT expansions and new toll roads',
        ],
      },
      {
        title: 'Protecting macroeconomic stability and the rupiah',
        summary:
          'Linking domestic fuel prices more closely to international markets reduces the risk that global oil price spikes will suddenly blow up the budget or force emergency borrowing.',
        confidence: 'medium',
        supportingEvidence: [
          'Past episodes of rupiah weakness coincided with high subsidy bills and market concerns about fiscal discipline',
          "Ratings agencies have repeatedly cited subsidy reform as positive for Indonesia's credit profile",
        ],
      },
      {
        title: 'Managing electoral risk through gradualism and compensation',
        summary:
          'By phasing in increases, using targeted cash transfers, and timing announcements away from peak political moments, the government aims to minimize street protests and opposition mobilization.',
        confidence: 'medium',
        supportingEvidence: [
          'Previous sharp fuel price hikes triggered large demonstrations and political instability',
          'Recent price adjustments have been smaller and accompanied by expansions in social assistance coverage',
        ],
      },
    ],
    evidence: [
      {
        claim:
          'Energy subsidy allocations have, in some years, rivaled or exceeded central government capital expenditure, limiting space for new infrastructure projects.',
        source: 'Indonesian state budget (APBN) and Ministry of Finance reports',
        sourceUrl: 'https://example.com/indonesia-apbn-subsidies',
        confidence: 'medium',
      },
      {
        claim:
          "Ratings agencies and multilateral institutions have repeatedly framed subsidy reform as supportive of Indonesia's macroeconomic stability and investment climate.",
        source: 'Credit rating agency reports and IMF Article IV consultations',
        sourceUrl: 'https://example.com/indonesia-subsidy-reform-assessments',
        confidence: 'medium',
      },
    ],
    assumptions: [
      'Budget and subsidy data are reported accurately and not significantly revised after publication.',
      'Targeted cash transfer programs reach the majority of intended low-income beneficiaries with limited leakage.',
    ],
    limitations: [
      'The analysis does not model detailed distributional impacts across income deciles or regions.',
      'Political dynamics within coalition parties and parliament are only partially observable from public sources.',
    ],
    alternativeExplanations: [
      'Subsidy reform is primarily driven by ideological preferences for smaller government rather than fiscal constraints.',
      'The timing is dictated by technical implementation readiness of new targeting systems rather than political calculations.',
    ],
  },
  {
    slug: 'brazil-amazon-deforestation-enforcement',
    title:
      "Brazil's Amazon enforcement surge: Environmental awakening or trade negotiation tactic?",
    summary:
      "Examining whether Brazil's sudden increase in Amazon deforestation enforcement reflects genuine environmental commitment or strategic positioning in EU-Mercosur trade talks.",
    executiveSummary:
      "Brazil's dramatic increase in Amazon deforestation enforcement operations in 2025–2026 coincides precisely with critical phases of the EU-Mercosur trade agreement ratification. The evidence suggests the enforcement surge is primarily motivated by (1) meeting EU deforestation regulation requirements to secure trade deal ratification, (2) attracting climate finance commitments from European governments, and (3) rehabilitating Brazil's international environmental reputation to unlock broader diplomatic opportunities. While enforcement actions are real, the sustainability of the effort beyond the trade negotiation window remains uncertain.",
    category: 'government-action',
    geography: 'Brazil',
    tags: ['environment', 'trade', 'deforestation', 'diplomacy'],
    publishedAt: '2026-02-25T09:00:00Z',
    featured: true,
    stakeholders: [
      {
        name: 'Brazilian Ministry of Environment',
        role: 'Lead agency for enforcement operations',
        incentives: [
          'Demonstrate measurable deforestation reduction to international partners',
          'Secure increased budget allocation from positive results',
          'Rebuild institutional credibility damaged during prior administration',
        ],
        confidence: 'high',
      },
      {
        name: 'Brazilian agribusiness sector',
        role: 'Major economic actor affected by enforcement',
        incentives: [
          'Gain EU market access through trade deal ratification',
          'Minimize enforcement impact on established operations',
          "Position as 'sustainable' producers for premium markets",
        ],
        confidence: 'high',
      },
      {
        name: 'European Commission (DG Trade)',
        role: 'Trade deal counterparty with deforestation conditions',
        incentives: [
          'Ratify deal to demonstrate trade policy competence',
          'Satisfy European Parliament demands on environmental safeguards',
          'Secure South American agricultural imports at favorable terms',
        ],
        confidence: 'high',
      },
    ],
    motivations: [
      {
        title: 'EU-Mercosur trade deal compliance',
        summary:
          'The enforcement surge directly addresses European Parliament objections that blocked earlier ratification attempts, creating the necessary political cover for EU approval.',
        confidence: 'high',
        supportingEvidence: [
          'Enforcement surge began within weeks of EU Parliament setting deforestation benchmarks',
          'Brazilian diplomatic communications reference enforcement metrics in trade negotiations',
        ],
      },
      {
        title: 'Climate finance attraction',
        summary:
          'Demonstrated enforcement unlocks billions in climate finance commitments from European governments and multilateral funds.',
        confidence: 'medium',
        supportingEvidence: [
          'Norway and Germany resumed Amazon Fund contributions following enforcement data improvements',
          'World Bank green bond eligibility tied to deforestation metrics',
        ],
      },
    ],
    evidence: [
      {
        claim:
          'Amazon deforestation enforcement operations increased 280% in the six months following EU Parliament benchmark announcement.',
        source: 'IBAMA operational data, analyzed by Climate Policy Initiative',
        sourceUrl: 'https://example.com/ibama-enforcement',
        confidence: 'high',
      },
      {
        claim:
          'Norway and Germany jointly pledged $1.2B to the Amazon Fund contingent on sustained enforcement improvements.',
        source: 'Amazon Fund official announcements',
        sourceUrl: 'https://example.com/amazon-fund-pledge',
        confidence: 'high',
      },
    ],
    assumptions: [
      'IBAMA enforcement data accurately reflects operational intensity and is not inflated for reporting purposes.',
      'The correlation between EU benchmarks and enforcement timing reflects deliberate policy coordination.',
    ],
    limitations: [
      'Enforcement volume does not necessarily correlate with environmental outcomes.',
      'The analysis cannot predict whether enforcement will be sustained after trade deal ratification.',
      'Internal Brazilian government deliberations on enforcement motivation are not publicly available.',
    ],
    alternativeExplanations: [
      "The enforcement surge reflects genuine institutional rebuilding after the previous administration's environmental rollbacks.",
      'Seasonal and weather patterns created favorable conditions for enforcement operations independent of political timing.',
      'New satellite monitoring technology enabled more enforcement operations regardless of political motivation.',
    ],
  },
  {
    slug: 'japan-defense-spending-increase',
    title: "Japan's historic defense budget doubling: Threat response or alliance management?",
    summary:
      "Analyzing whether Japan's unprecedented defense spending increase is driven primarily by genuine security threats or by alliance management dynamics with the United States.",
    executiveSummary:
      "Japan's decision to double defense spending to 2% of GDP by 2027 is presented as a response to rising threats from China, North Korea, and Russia. While security threats are real, the analysis finds that alliance management with the United States — specifically, satisfying Washington's burden-sharing demands and securing continued US extended deterrence guarantees — is an equally powerful motivating factor. Domestic political considerations, including the ruling party's desire to complete a long-standing constitutional reinterpretation agenda, also play a significant role.",
    category: 'policy',
    geography: 'Japan',
    tags: ['defense', 'security', 'alliance', 'geopolitics'],
    publishedAt: '2026-02-20T11:00:00Z',
    featured: false,
    stakeholders: [
      {
        name: 'Japanese Ministry of Defense',
        role: 'Primary institutional advocate for spending increase',
        incentives: [
          'Expand institutional budget and capabilities',
          'Modernize aging equipment and infrastructure',
          'Increase strategic autonomy in regional security',
        ],
        confidence: 'high',
      },
      {
        name: 'US Department of Defense',
        role: 'Alliance partner demanding greater burden-sharing',
        incentives: [
          'Reduce US force posture costs in the Pacific',
          'Strengthen allied deterrence against China',
          'Set precedent for allied spending increases globally',
        ],
        confidence: 'high',
      },
      {
        name: 'Japanese defense industry',
        role: 'Beneficiary of increased procurement budgets',
        incentives: [
          'Secure long-term government contracts',
          'Develop exportable defense technology',
          'Expand production capacity for domestic and allied markets',
        ],
        confidence: 'medium',
      },
    ],
    motivations: [
      {
        title: 'US alliance management and burden-sharing',
        summary:
          'The spending increase directly satisfies longstanding US demands for allied nations to meet the 2% GDP defense spending threshold, securing continued American security guarantees.',
        confidence: 'high',
        supportingEvidence: [
          '2% target explicitly matches NATO-standard burden-sharing benchmark that US has promoted globally',
          'Spending announcement followed high-profile US-Japan summit discussions on alliance responsibilities',
        ],
      },
      {
        title: 'Genuine regional threat response',
        summary:
          'Escalating Chinese military activity around Taiwan and in the East China Sea, combined with North Korean missile provocations, create real security imperatives.',
        confidence: 'high',
        supportingEvidence: [
          'Chinese military incursions into Japanese ADIZ increased 60% year-over-year',
          'North Korean missile launches reached record frequency in 2025',
        ],
      },
    ],
    evidence: [
      {
        claim:
          "Chinese military aircraft incursions into Japan's ADIZ increased 60% year-over-year in 2025.",
        source: 'Japanese Ministry of Defense annual white paper',
        sourceUrl: 'https://example.com/japan-mod-whitepaper',
        confidence: 'high',
      },
      {
        claim:
          'The 2% GDP target mirrors the NATO burden-sharing standard that the US has actively promoted.',
        source: 'NATO summit communiqués and bilateral US-Japan joint statements',
        sourceUrl: 'https://example.com/us-japan-joint-statement',
        confidence: 'high',
      },
    ],
    assumptions: [
      'ADIZ incursion data is consistently measured and not inflated for political purposes.',
      'The 2% GDP target is a deliberate signal to Washington rather than an independently derived figure.',
    ],
    limitations: [
      'Separating genuine threat response from alliance management is inherently difficult as both are intertwined.',
      'The analysis cannot access classified Japanese defense planning documents.',
    ],
    alternativeExplanations: [
      'The spending increase is a purely domestic political achievement that the ruling party has pursued for decades.',
      "Japan's defense industry lobby successfully created urgency to expand government procurement.",
    ],
  },
];

export function getReportBySlug(slug: string): Report | undefined {
  return REPORTS.find((r) => r.slug === slug);
}

export function getFeaturedReports(): Report[] {
  return REPORTS.filter((r) => r.featured);
}

export function filterReports(options: {
  query?: string;
  category?: string;
  geography?: string;
}): Report[] {
  let results = REPORTS;

  if (options.query) {
    const q = options.query.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (options.category) {
    results = results.filter((r) => r.category === options.category);
  }

  if (options.geography) {
    results = results.filter((r) => r.geography === options.geography);
  }

  return results;
}

export const INVESTIGATIONS: Investigation[] = [
  {
    id: 'inv-001',
    title: 'US Pharmaceutical Industry Lobbying on Drug Pricing Reform',
    description:
      "What are the true motivations behind pharma industry's aggressive lobbying against Medicare drug price negotiation — is this purely about R&D economics or are there deeper structural incentives?",
    status: 'completed',
    category: 'legislation',
    geography: 'United States',
    createdAt: '2026-03-01T09:15:00Z',
    updatedAt: '2026-03-01T11:45:00Z',
    report: REPORTS[0],
  },
  {
    id: 'inv-002',
    title: 'EU Artificial Intelligence Act: Who Really Wins?',
    description:
      "Analyzing the stakeholders behind the EU AI Act's final text — why certain high-risk categories were included or excluded, and which industry players shaped the outcomes.",
    status: 'completed',
    category: 'regulation',
    geography: 'European Union',
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-02-22T16:30:00Z',
    report: REPORTS[1],
  },
  {
    id: 'inv-003',
    title: "Brazil's Amazon Deforestation Moratorium Reversal",
    description:
      'Examining the political and economic incentives driving the rollback of Amazon deforestation protections — which agricultural, financial, and political actors stand to benefit?',
    status: 'generating',
    category: 'government-action',
    geography: 'Brazil',
    createdAt: '2026-03-14T08:00:00Z',
    updatedAt: '2026-03-14T08:00:00Z',
    generationProgress: {
      phases: [
        {
          id: 'gather-sources',
          label: 'Gather sources',
          description:
            'Searching IBGE databases, Brazilian federal sources, and international media',
          status: 'completed',
        },
        {
          id: 'identify-stakeholders',
          label: 'Identify stakeholders',
          description: 'Mapping agribusiness, political, and international actors involved',
          status: 'completed',
        },
        {
          id: 'analyze-incentives',
          label: 'Analyze incentives',
          description: 'Cross-referencing campaign finance data with deforestation permits',
          status: 'in-progress',
        },
        {
          id: 'trace-trade-links',
          label: 'Trace trade links',
          description:
            'Examining EU-Mercosur trade deal timeline correlation with deforestation policy',
          status: 'pending',
        },
        {
          id: 'draft-report',
          label: 'Draft report',
          description: 'Structuring findings into the TrueMotives report format',
          status: 'pending',
        },
      ],
      percentage: 52,
      estimatedSecondsRemaining: 67,
      activityLog: [
        {
          id: 'log-001',
          timestamp: '2026-03-14T08:00:12Z',
          message: "Starting deep research for: Brazil's Amazon Deforestation Moratorium Reversal",
        },
        {
          id: 'log-002',
          timestamp: '2026-03-14T08:00:18Z',
          message: 'Searching IBGE databases and Brazilian agricultural ministry reports...',
        },
        {
          id: 'log-003',
          timestamp: '2026-03-14T08:01:02Z',
          message: 'Found 34 relevant source documents from Brazilian federal sources',
        },
        {
          id: 'log-004',
          timestamp: '2026-03-14T08:01:15Z',
          message: 'Identified key stakeholder: Brazilian Agribusiness Association (CNA)',
        },
        {
          id: 'log-005',
          timestamp: '2026-03-14T08:01:44Z',
          message:
            'Identified key stakeholder: Bancada Ruralista (agricultural caucus in Congress)',
        },
        {
          id: 'log-006',
          timestamp: '2026-03-14T08:02:11Z',
          message: 'Cross-referencing campaign finance data with deforestation permit approvals...',
        },
        {
          id: 'log-007',
          timestamp: '2026-03-14T08:03:05Z',
          message: 'Analyzing economic incentive structure for soy and beef export revenues...',
        },
        {
          id: 'log-008',
          timestamp: '2026-03-14T08:03:47Z',
          message:
            'Searching EU-Mercosur trade deal timeline for correlation with deforestation policy...',
        },
      ],
    },
  },
  {
    id: 'inv-004',
    title: 'US Federal Reserve Interest Rate Decision — March 2026',
    description:
      "Beyond the stated inflation targets, what political and financial pressures are influencing the Fed's rate trajectory? Who benefits from higher rates being maintained?",
    status: 'draft',
    category: 'government-action',
    geography: 'United States',
    createdAt: '2026-03-13T16:20:00Z',
    updatedAt: '2026-03-13T16:20:00Z',
  },
  {
    id: 'inv-005',
    title: 'UK Post-Brexit Financial Services Deregulation',
    description:
      "Analyzing whether the UK's 'Edinburgh Reforms' of financial regulation represent genuine competitiveness strategy or primarily benefit City of London institutions at public expense.",
    status: 'failed',
    category: 'regulation',
    geography: 'United Kingdom',
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-03-10T11:22:00Z',
  },
];

export function getInvestigations(): Investigation[] {
  return INVESTIGATIONS;
}

export function getInvestigationById(id: string): Investigation | undefined {
  return INVESTIGATIONS.find((inv) => inv.id === id);
}
