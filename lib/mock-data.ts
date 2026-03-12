import type { Report } from "./types";

export const REPORTS: Report[] = [
  {
    slug: "eu-digital-markets-act-enforcement",
    title: "EU Digital Markets Act: Why Brussels is targeting American tech giants now",
    summary:
      "An analysis of the political, economic, and strategic motivations behind the EU's aggressive enforcement timeline for the Digital Markets Act against major US technology platforms.",
    executiveSummary:
      "The EU's accelerated DMA enforcement against US tech gatekeepers is driven by a convergence of industrial policy ambitions, electoral dynamics, and a strategic window created by transatlantic tensions. While consumer protection is the stated rationale, the evidence suggests three primary motivations: (1) creating competitive space for European digital champions, (2) leveraging regulatory power as geopolitical influence amid shifting US-EU relations, and (3) responding to domestic political pressure from European SMEs and media companies who have lobbied intensively against platform dominance. The timing correlates strongly with the European Commission's institutional calendar and upcoming budget negotiations rather than any specific consumer harm trigger.",
    category: "regulation",
    geography: "European Union",
    tags: ["technology", "antitrust", "trade", "digital policy"],
    publishedAt: "2026-03-10T14:00:00Z",
    featured: true,
    stakeholders: [
      {
        name: "European Commission (DG Competition)",
        role: "Regulator and enforcer of the DMA",
        incentives: [
          "Demonstrate institutional relevance and enforcement capability",
          "Build precedent for digital regulation leadership globally",
          "Respond to pressure from EU member state governments",
        ],
        confidence: "high",
      },
      {
        name: "Major US tech platforms (Apple, Google, Meta, Amazon)",
        role: "Designated gatekeepers under the DMA",
        incentives: [
          "Minimize compliance costs and operational disruption",
          "Delay enforcement through legal challenges",
          "Maintain platform ecosystems and revenue models",
        ],
        confidence: "high",
      },
      {
        name: "European digital SMEs and startups",
        role: "Potential beneficiaries of reduced platform dominance",
        incentives: [
          "Gain access to platform markets on fairer terms",
          "Reduce dependency on US platform advertising",
          "Push for aggressive enforcement timelines",
        ],
        confidence: "medium",
      },
      {
        name: "European media and publishing industry",
        role: "Long-standing advocates for platform regulation",
        incentives: [
          "Recapture advertising revenue lost to platforms",
          "Secure favorable terms for news content distribution",
          "Strengthen bargaining position against aggregators",
        ],
        confidence: "high",
      },
    ],
    motivations: [
      {
        title: "Industrial policy through regulation",
        summary:
          "The DMA enforcement creates a regulatory moat that benefits European digital companies by raising compliance costs for dominant US platforms, effectively functioning as industrial policy disguised as consumer protection.",
        confidence: "high",
        supportingEvidence: [
          "EU internal strategy documents reference 'digital sovereignty' goals",
          "Timing aligns with European Chips Act and other industrial policy measures",
          "Enforcement targets are exclusively non-EU companies",
        ],
      },
      {
        title: "Geopolitical leverage amid transatlantic tensions",
        summary:
          "Regulatory action against US tech companies serves as a bargaining chip in broader trade and security negotiations with the United States.",
        confidence: "medium",
        supportingEvidence: [
          "Enforcement acceleration coincides with US tariff threats",
          "Commission officials have linked digital regulation to trade negotiations in private briefings",
        ],
      },
      {
        title: "Domestic political pressure from SMEs and media",
        summary:
          "European small businesses and media companies have run sustained lobbying campaigns, and Commission officials face electoral incentives to be seen acting against perceived US tech dominance.",
        confidence: "high",
        supportingEvidence: [
          "Over 200 European trade associations signed an open letter demanding faster DMA enforcement",
          "European media lobby spending on DMA-related advocacy increased 340% since 2023",
        ],
      },
    ],
    evidence: [
      {
        claim:
          "The European Commission explicitly tied DMA enforcement to 'digital sovereignty' objectives in internal planning documents.",
        source: "Leaked Commission working paper, reported by Politico EU",
        sourceUrl: "https://example.com/politico-dma-leak",
        confidence: "high",
      },
      {
        claim:
          "All six designated gatekeepers under the DMA are headquartered outside the EU, suggesting regulatory targeting.",
        source: "European Commission official gatekeeper designation list",
        sourceUrl: "https://example.com/ec-gatekeepers",
        confidence: "high",
      },
      {
        claim:
          "European media lobby spending on DMA advocacy increased 340% between 2023 and 2025.",
        source: "EU Transparency Register, compiled by Corporate Europe Observatory",
        sourceUrl: "https://example.com/lobby-data",
        confidence: "medium",
      },
    ],
    assumptions: [
      "Leaked documents reflect actual Commission strategic thinking and were not planted or taken out of context.",
      "Lobbying expenditure data from the EU Transparency Register is reasonably complete and accurate.",
      "The absence of EU-headquartered companies from the gatekeeper list is not simply a function of market share thresholds.",
    ],
    limitations: [
      "This analysis cannot establish causal intent — correlation between timing events and enforcement does not prove coordination.",
      "Internal Commission deliberations are largely opaque; reported leaks may represent only minority viewpoints.",
      "The analysis focuses on political economy motivations and does not assess the merits of the DMA's consumer protection arguments.",
    ],
    alternativeExplanations: [
      "The enforcement timeline is genuinely driven by consumer harm evidence and technical readiness, not political calculus.",
      "Institutional momentum — once the DMA was passed, bureaucratic processes naturally accelerated enforcement regardless of external factors.",
      "Individual career ambitions of senior DG Competition officials seeking to establish legacy-defining cases.",
    ],
  },
  {
    slug: "us-lng-export-permit-freeze",
    title: "US LNG export permit freeze: Climate action or strategic energy play?",
    summary:
      "Examining the overlapping climate, diplomatic, and domestic energy motivations behind the Biden administration's pause on new LNG export terminal approvals.",
    executiveSummary:
      "The freeze on new LNG export permits appears motivated less by pure climate considerations than by a combination of: (1) electoral positioning ahead of climate-conscious voter blocs, (2) leveraging energy export policy as a tool in Middle East and European diplomacy, and (3) responding to growing domestic concerns about natural gas price impacts on American consumers and manufacturers. Environmental groups celebrate the decision, but the evidence suggests climate impact is a secondary benefit rather than the primary driver.",
    category: "policy",
    geography: "United States",
    tags: ["energy", "climate", "trade", "geopolitics"],
    publishedAt: "2026-03-08T10:00:00Z",
    featured: true,
    stakeholders: [
      {
        name: "Biden Administration (DOE & NSC)",
        role: "Decision-maker on export permit approvals",
        incentives: [
          "Maintain electoral coalition including climate voters",
          "Use energy exports as diplomatic leverage",
          "Manage domestic energy price inflation",
        ],
        confidence: "high",
      },
      {
        name: "US LNG developers and fossil fuel industry",
        role: "Permit applicants and export terminal operators",
        incentives: [
          "Secure long-term export contracts worth billions",
          "Maintain US position as top global LNG exporter",
          "Prevent regulatory precedent that could expand to other fossil fuels",
        ],
        confidence: "high",
      },
      {
        name: "Environmental advocacy organizations",
        role: "Primary public advocates for the permit freeze",
        incentives: [
          "Reduce US fossil fuel infrastructure expansion",
          "Establish legal and political precedent for climate-based permitting reviews",
          "Demonstrate political influence ahead of elections",
        ],
        confidence: "high",
      },
      {
        name: "European energy importers",
        role: "Key buyers of US LNG, especially post-Russia sanctions",
        incentives: [
          "Secure reliable, diversified gas supply",
          "Avoid dependency on any single supplier",
          "Negotiate favorable long-term pricing",
        ],
        confidence: "medium",
      },
    ],
    motivations: [
      {
        title: "Electoral positioning with climate voters",
        summary:
          "The permit freeze signals climate commitment to a voter base that is critical in swing states, without requiring legislative action that could fail in Congress.",
        confidence: "high",
        supportingEvidence: [
          "Announcement timing preceded key primary campaign events",
          "Polling data showed climate as a top-3 issue for young voters in battleground states",
        ],
      },
      {
        title: "Energy diplomacy leverage",
        summary:
          "Controlling the pace of LNG exports gives the administration negotiating power with European allies and Middle Eastern energy producers.",
        confidence: "medium",
        supportingEvidence: [
          "NSC briefing documents reference 'strategic energy management' in diplomatic contexts",
          "Concurrent negotiations with Qatar on LNG pricing and supply routes",
        ],
      },
      {
        title: "Domestic price management",
        summary:
          "Rising US natural gas prices, partly driven by export demand, create political risk. Slowing exports helps manage domestic energy costs.",
        confidence: "medium",
        supportingEvidence: [
          "US natural gas spot prices rose 40% in the year preceding the freeze",
          "Industrial lobby groups cited export-driven price increases in formal comments to DOE",
        ],
      },
    ],
    evidence: [
      {
        claim: "The permit freeze announcement was timed to precede Super Tuesday primaries.",
        source: "White House press schedule analysis, Reuters",
        sourceUrl: "https://example.com/reuters-lng-timing",
        confidence: "medium",
      },
      {
        claim: "Climate ranked as a top-3 issue for voters under 30 in six battleground states.",
        source: "Pew Research Center / AP-NORC polling, January 2026",
        sourceUrl: "https://example.com/pew-climate-poll",
        confidence: "high",
      },
      {
        claim: "US natural gas spot prices rose approximately 40% in the 12 months prior to the freeze.",
        source: "US Energy Information Administration data",
        sourceUrl: "https://example.com/eia-gas-prices",
        confidence: "high",
      },
    ],
    assumptions: [
      "Polling data accurately reflects voter priorities and is not an artifact of survey design.",
      "The timing correlation with political events reflects intentional scheduling.",
      "NSC briefing references to 'strategic energy management' relate to the export permit policy specifically.",
    ],
    limitations: [
      "The analysis relies partly on leaked or reported documents whose full context is not available.",
      "Electoral motivation is inferred from timing and polling, not direct statements of intent.",
      "The domestic price impact of LNG exports is debated among energy economists.",
    ],
    alternativeExplanations: [
      "The freeze is a genuine response to updated climate science and emissions modeling.",
      "Bureaucratic delays and incomplete environmental reviews necessitated a formal pause.",
      "The decision was primarily driven by a single influential environmental lawsuit rather than strategic calculation.",
    ],
  },
  {
    slug: "india-semiconductor-subsidy-program",
    title: "India's $10B semiconductor push: Building chip sovereignty or courting foreign capital?",
    summary:
      "Analyzing the geopolitical, industrial, and domestic political motivations behind India's aggressive semiconductor manufacturing incentive program.",
    executiveSummary:
      "India's semiconductor subsidy program is positioned as a national security and economic sovereignty initiative, but the evidence points to a more complex set of motivations: (1) positioning India as the primary alternative to China in global chip supply chains, (2) attracting foreign direct investment to boost GDP growth metrics ahead of state elections, and (3) building domestic political narratives around 'Atmanirbhar Bharat' (self-reliant India) that resonate with the ruling party's electoral base. The technical feasibility of achieving semiconductor self-sufficiency at scale remains questionable given infrastructure gaps.",
    category: "policy",
    geography: "India",
    tags: ["semiconductors", "industrial-policy", "FDI", "technology"],
    publishedAt: "2026-03-05T08:00:00Z",
    featured: false,
    stakeholders: [
      {
        name: "Indian Ministry of Electronics and IT",
        role: "Program architect and fund administrator",
        incentives: [
          "Demonstrate ministry relevance in national security domain",
          "Attract major FDI announcements",
          "Build bureaucratic capacity and budget",
        ],
        confidence: "high",
      },
      {
        name: "Global semiconductor companies (TSMC, Samsung, Intel)",
        role: "Potential investment partners",
        incentives: [
          "Diversify manufacturing geography away from Taiwan risk",
          "Access subsidies to reduce capital expenditure",
          "Gain preferential access to India's growing domestic market",
        ],
        confidence: "high",
      },
      {
        name: "Ruling party leadership",
        role: "Political sponsors of the 'self-reliant India' narrative",
        incentives: [
          "Generate high-profile investment announcements before elections",
          "Reinforce nationalist economic narrative",
          "Create industrial jobs in politically important states",
        ],
        confidence: "high",
      },
    ],
    motivations: [
      {
        title: "China+1 supply chain positioning",
        summary:
          "India aims to capture manufacturing investment fleeing China-dependent supply chains, using subsidies as the primary competitive tool against Vietnam and Malaysia.",
        confidence: "high",
        supportingEvidence: [
          "Program explicitly references 'supply chain resilience' in policy documents",
          "Subsidy structure mirrors programs in competing nations",
        ],
      },
      {
        title: "Electoral signaling through FDI announcements",
        summary:
          "Major investment announcements serve as tangible proof of economic management competence, with subsidy disbursement timed to electoral cycles.",
        confidence: "medium",
        supportingEvidence: [
          "Three of four major announcements preceded state election dates",
          "Government PR spending on semiconductor program increased 500% in election months",
        ],
      },
    ],
    evidence: [
      {
        claim: "Three of four major semiconductor investment announcements preceded state elections by less than 60 days.",
        source: "Election Commission calendar cross-referenced with PIB press releases",
        sourceUrl: "https://example.com/india-chip-timeline",
        confidence: "medium",
      },
      {
        claim: "The subsidy program's design closely mirrors Taiwan's and South Korea's historical chip incentive structures.",
        source: "Brookings Institution comparative analysis",
        sourceUrl: "https://example.com/brookings-chip-subsidies",
        confidence: "high",
      },
    ],
    assumptions: [
      "Electoral timing correlations reflect strategic scheduling rather than coincidence.",
      "India's infrastructure can support large-scale semiconductor fabrication within the stated timeline.",
    ],
    limitations: [
      "Access to internal government deliberations is limited; motivations are inferred from policy design and timing.",
      "The analysis focuses on political economy factors and does not assess technical feasibility in depth.",
    ],
    alternativeExplanations: [
      "The program is a genuine national security response to supply chain vulnerabilities exposed during COVID-19.",
      "India's chip push is primarily driven by corporate lobbying from domestic electronics assemblers seeking local chip supply.",
    ],
  },
  {
    slug: "uk-post-brexit-financial-regulation",
    title: "London's regulatory divergence from the EU: Deregulation or competitive desperation?",
    summary:
      "An investigation into whether the UK's post-Brexit financial regulatory reforms are strategic industry policy or an attempt to stem the tide of financial services relocating to EU hubs.",
    executiveSummary:
      "The UK's sweeping financial regulatory reforms since Brexit are framed as modernization and innovation-friendly policy. However, the evidence suggests the primary driver is competitive anxiety: London has lost significant market share in derivatives clearing, euro-denominated trading, and fund management to Amsterdam, Paris, and Frankfurt. The reforms appear designed to (1) prevent further migration of financial services jobs and tax revenue, (2) signal to global financial institutions that London remains the preferred European hub, and (3) create political wins for a government under pressure on economic performance.",
    category: "regulation",
    geography: "United Kingdom",
    tags: ["financial-regulation", "Brexit", "trade", "banking"],
    publishedAt: "2026-03-01T12:00:00Z",
    featured: false,
    stakeholders: [
      {
        name: "UK Treasury and Financial Conduct Authority",
        role: "Regulators implementing the Edinburgh Reforms",
        incentives: [
          "Maintain London's position as a global financial center",
          "Protect tax revenue from financial services",
          "Demonstrate post-Brexit regulatory independence",
        ],
        confidence: "high",
      },
      {
        name: "Major global banks with London operations",
        role: "Primary beneficiaries and lobbyists for reform",
        incentives: [
          "Reduce compliance costs in London operations",
          "Maintain optionality between London and EU hubs",
          "Avoid costly full relocation to EU jurisdiction",
        ],
        confidence: "high",
      },
    ],
    motivations: [
      {
        title: "Stemming financial services migration",
        summary:
          "The reforms directly address specific regulatory areas where EU equivalence has been denied, aiming to make London attractive enough to prevent further relocation.",
        confidence: "high",
        supportingEvidence: [
          "Reform areas map precisely to sectors experiencing the largest outflows",
          "FCA consultation papers reference competitive benchmarking against EU hubs",
        ],
      },
      {
        title: "Political signaling on Brexit dividends",
        summary:
          "Regulatory divergence serves as tangible evidence that Brexit enables policy autonomy, satisfying political constituencies who supported leaving the EU.",
        confidence: "medium",
        supportingEvidence: [
          "Government communications frame reforms as 'Brexit freedoms'",
          "Timing correlates with declining public approval of Brexit outcomes",
        ],
      },
    ],
    evidence: [
      {
        claim: "Euro-denominated derivatives clearing in London fell 25% between 2021 and 2025.",
        source: "Bank of England Financial Stability Report",
        sourceUrl: "https://example.com/boe-clearing-data",
        confidence: "high",
      },
      {
        claim: "Over 7,000 financial services jobs relocated from London to EU cities by end of 2025.",
        source: "EY Financial Services Brexit Tracker",
        sourceUrl: "https://example.com/ey-brexit-tracker",
        confidence: "high",
      },
    ],
    assumptions: [
      "Job relocation figures are not double-counted across surveys and trackers.",
      "Regulatory reform proposals will be implemented as drafted.",
    ],
    limitations: [
      "The counterfactual — what would have happened without regulatory divergence — cannot be tested.",
      "Some reforms may have been planned regardless of Brexit for modernization purposes.",
    ],
    alternativeExplanations: [
      "The reforms genuinely reflect better regulatory thinking unconstrained by EU consensus requirements.",
      "Financial services migration has plateaued, and reforms are forward-looking rather than reactive.",
    ],
  },
  {
    slug: "brazil-amazon-deforestation-enforcement",
    title: "Brazil's Amazon enforcement surge: Environmental awakening or trade negotiation tactic?",
    summary:
      "Examining whether Brazil's sudden increase in Amazon deforestation enforcement reflects genuine environmental commitment or strategic positioning in EU-Mercosur trade talks.",
    executiveSummary:
      "Brazil's dramatic increase in Amazon deforestation enforcement operations in 2025–2026 coincides precisely with critical phases of the EU-Mercosur trade agreement ratification. The evidence suggests the enforcement surge is primarily motivated by (1) meeting EU deforestation regulation requirements to secure trade deal ratification, (2) attracting climate finance commitments from European governments, and (3) rehabilitating Brazil's international environmental reputation to unlock broader diplomatic opportunities. While enforcement actions are real, the sustainability of the effort beyond the trade negotiation window remains uncertain.",
    category: "government-action",
    geography: "Brazil",
    tags: ["environment", "trade", "deforestation", "diplomacy"],
    publishedAt: "2026-02-25T09:00:00Z",
    featured: true,
    stakeholders: [
      {
        name: "Brazilian Ministry of Environment",
        role: "Lead agency for enforcement operations",
        incentives: [
          "Demonstrate measurable deforestation reduction to international partners",
          "Secure increased budget allocation from positive results",
          "Rebuild institutional credibility damaged during prior administration",
        ],
        confidence: "high",
      },
      {
        name: "Brazilian agribusiness sector",
        role: "Major economic actor affected by enforcement",
        incentives: [
          "Gain EU market access through trade deal ratification",
          "Minimize enforcement impact on established operations",
          "Position as 'sustainable' producers for premium markets",
        ],
        confidence: "high",
      },
      {
        name: "European Commission (DG Trade)",
        role: "Trade deal counterparty with deforestation conditions",
        incentives: [
          "Ratify deal to demonstrate trade policy competence",
          "Satisfy European Parliament demands on environmental safeguards",
          "Secure South American agricultural imports at favorable terms",
        ],
        confidence: "high",
      },
    ],
    motivations: [
      {
        title: "EU-Mercosur trade deal compliance",
        summary:
          "The enforcement surge directly addresses European Parliament objections that blocked earlier ratification attempts, creating the necessary political cover for EU approval.",
        confidence: "high",
        supportingEvidence: [
          "Enforcement surge began within weeks of EU Parliament setting deforestation benchmarks",
          "Brazilian diplomatic communications reference enforcement metrics in trade negotiations",
        ],
      },
      {
        title: "Climate finance attraction",
        summary:
          "Demonstrated enforcement unlocks billions in climate finance commitments from European governments and multilateral funds.",
        confidence: "medium",
        supportingEvidence: [
          "Norway and Germany resumed Amazon Fund contributions following enforcement data improvements",
          "World Bank green bond eligibility tied to deforestation metrics",
        ],
      },
    ],
    evidence: [
      {
        claim: "Amazon deforestation enforcement operations increased 280% in the six months following EU Parliament benchmark announcement.",
        source: "IBAMA operational data, analyzed by Climate Policy Initiative",
        sourceUrl: "https://example.com/ibama-enforcement",
        confidence: "high",
      },
      {
        claim: "Norway and Germany jointly pledged $1.2B to the Amazon Fund contingent on sustained enforcement improvements.",
        source: "Amazon Fund official announcements",
        sourceUrl: "https://example.com/amazon-fund-pledge",
        confidence: "high",
      },
    ],
    assumptions: [
      "IBAMA enforcement data accurately reflects operational intensity and is not inflated for reporting purposes.",
      "The correlation between EU benchmarks and enforcement timing reflects deliberate policy coordination.",
    ],
    limitations: [
      "Enforcement volume does not necessarily correlate with environmental outcomes.",
      "The analysis cannot predict whether enforcement will be sustained after trade deal ratification.",
      "Internal Brazilian government deliberations on enforcement motivation are not publicly available.",
    ],
    alternativeExplanations: [
      "The enforcement surge reflects genuine institutional rebuilding after the previous administration's environmental rollbacks.",
      "Seasonal and weather patterns created favorable conditions for enforcement operations independent of political timing.",
      "New satellite monitoring technology enabled more enforcement operations regardless of political motivation.",
    ],
  },
  {
    slug: "japan-defense-spending-increase",
    title: "Japan's historic defense budget doubling: Threat response or alliance management?",
    summary:
      "Analyzing whether Japan's unprecedented defense spending increase is driven primarily by genuine security threats or by alliance management dynamics with the United States.",
    executiveSummary:
      "Japan's decision to double defense spending to 2% of GDP by 2027 is presented as a response to rising threats from China, North Korea, and Russia. While security threats are real, the analysis finds that alliance management with the United States — specifically, satisfying Washington's burden-sharing demands and securing continued US extended deterrence guarantees — is an equally powerful motivating factor. Domestic political considerations, including the ruling party's desire to complete a long-standing constitutional reinterpretation agenda, also play a significant role.",
    category: "policy",
    geography: "Japan",
    tags: ["defense", "security", "alliance", "geopolitics"],
    publishedAt: "2026-02-20T11:00:00Z",
    featured: false,
    stakeholders: [
      {
        name: "Japanese Ministry of Defense",
        role: "Primary institutional advocate for spending increase",
        incentives: [
          "Expand institutional budget and capabilities",
          "Modernize aging equipment and infrastructure",
          "Increase strategic autonomy in regional security",
        ],
        confidence: "high",
      },
      {
        name: "US Department of Defense",
        role: "Alliance partner demanding greater burden-sharing",
        incentives: [
          "Reduce US force posture costs in the Pacific",
          "Strengthen allied deterrence against China",
          "Set precedent for allied spending increases globally",
        ],
        confidence: "high",
      },
      {
        name: "Japanese defense industry",
        role: "Beneficiary of increased procurement budgets",
        incentives: [
          "Secure long-term government contracts",
          "Develop exportable defense technology",
          "Expand production capacity for domestic and allied markets",
        ],
        confidence: "medium",
      },
    ],
    motivations: [
      {
        title: "US alliance management and burden-sharing",
        summary:
          "The spending increase directly satisfies longstanding US demands for allied nations to meet the 2% GDP defense spending threshold, securing continued American security guarantees.",
        confidence: "high",
        supportingEvidence: [
          "2% target explicitly matches NATO-standard burden-sharing benchmark that US has promoted globally",
          "Spending announcement followed high-profile US-Japan summit discussions on alliance responsibilities",
        ],
      },
      {
        title: "Genuine regional threat response",
        summary:
          "Escalating Chinese military activity around Taiwan and in the East China Sea, combined with North Korean missile provocations, create real security imperatives.",
        confidence: "high",
        supportingEvidence: [
          "Chinese military incursions into Japanese ADIZ increased 60% year-over-year",
          "North Korean missile launches reached record frequency in 2025",
        ],
      },
    ],
    evidence: [
      {
        claim: "Chinese military aircraft incursions into Japan's ADIZ increased 60% year-over-year in 2025.",
        source: "Japanese Ministry of Defense annual white paper",
        sourceUrl: "https://example.com/japan-mod-whitepaper",
        confidence: "high",
      },
      {
        claim: "The 2% GDP target mirrors the NATO burden-sharing standard that the US has actively promoted.",
        source: "NATO summit communiqués and bilateral US-Japan joint statements",
        sourceUrl: "https://example.com/us-japan-joint-statement",
        confidence: "high",
      },
    ],
    assumptions: [
      "ADIZ incursion data is consistently measured and not inflated for political purposes.",
      "The 2% GDP target is a deliberate signal to Washington rather than an independently derived figure.",
    ],
    limitations: [
      "Separating genuine threat response from alliance management is inherently difficult as both are intertwined.",
      "The analysis cannot access classified Japanese defense planning documents.",
    ],
    alternativeExplanations: [
      "The spending increase is a purely domestic political achievement that the ruling party has pursued for decades.",
      "Japan's defense industry lobby successfully created urgency to expand government procurement.",
    ],
  },
];

export const GEOGRAPHIES = [
  "European Union",
  "United States",
  "India",
  "United Kingdom",
  "Brazil",
  "Japan",
] as const;

export const CATEGORIES: { value: string; label: string }[] = [
  { value: "policy", label: "Policy" },
  { value: "regulation", label: "Regulation" },
  { value: "corporate-decision", label: "Corporate decision" },
  { value: "government-action", label: "Government action" },
  { value: "legislation", label: "Legislation" },
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
        r.tags.some((t) => t.toLowerCase().includes(q))
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
