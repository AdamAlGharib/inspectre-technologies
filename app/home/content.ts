/**
 * Home page copy.
 *
 * Every number here was counted from the project's own repository or documents.
 * Relationship lines are deliberate: several of these systems belong to clients or
 * partners, and the page says which part was ours. See PUBLIC-CLAIMS.md before editing.
 */

export const contactEmail = "adam@inspectre.ca";
export const linkedIn = "https://www.linkedin.com/in/adam-al-gharib/";

export type ProjectId = "pbx" | "provision" | "radar" | "hitl" | "hive" | "voice" | "summit";

export type Project = {
  id: ProjectId;
  index: string;
  name: string;
  /**
   * Neutral name to publish instead of `name` while the owner has not cleared it.
   * Add the project id to `useAlias` below to switch every mention on the page at once.
   */
  alias: string;
  line: string;
  /** one sentence for the three-up cards; the full summary is in the feature card and the dossier */
  short: string;
  summary: string;
  /** one or two words for the chip; the qualifier goes in statusNote */
  status: string;
  statusNote?: string;
  relationship: string;
  role: string;
  disciplines: string[];
  facts: { value: string; label: string }[];
  behaviours: string[];
  /** only listed for systems Inspectre owns; a client's stack is theirs to disclose */
  stack?: string[];
  rule: string;
};

/** Project ids whose real name is not cleared for publication yet. See PUBLIC-CLAIMS.md. */
export const useAlias: ProjectId[] = [];

export const publicName = (project: Project) => (useAlias.includes(project.id) ? project.alias : project.name);

export const projects: Project[] = [
  {
    id: "radar",
    index: "01",
    name: "Idea Radar",
    alias: "Idea Radar",
    line: "Public signals in. Traceable evidence out.",
    short: "Approved public sources in, evidence records with provenance and deletion state out, over a project-neutral API.",
    summary:
      "Idea Radar collects approved public sources and normalises them into evidence records with provenance, content hashes and deletion state, then serves them over a project-neutral API. A discovery pointer that cannot be resolved to a live publisher is dropped, not cited.",
    status: "Private alpha",
    statusNote: "v0.1",
    relationship: "Inspectre infrastructure",
    role: "Designed and built end to end",
    disciplines: ["Data infrastructure", "Research tooling", "Security engineering"],
    facts: [
      { value: "23", label: "public sources implemented" },
      { value: "6", label: "coverage pillars" },
      { value: "191", label: "test functions, with strict typing and a coverage floor" },
    ],
    behaviours: [
      "Stamps every item with its source's evidence class, primary or discovery. Hits from the discovery source are resolved to the publisher's page, and aggregator or redirector hosts are refused.",
      "Ingests idempotently with content hashes. Tombstones stop deleted items from quietly coming back.",
      "Reports staleness per adapter against its own cadence, so one dead source fails a check instead of hiding in a green run.",
      "Pins feed, pointer-resolution and page-extraction fetches to a validated public address, rechecking every redirect.",
      "Serves ranked evidence search, collection targets and saved radars over an API, a CLI and a polling worker.",
    ],
    stack: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "GitHub Actions"],
    rule: "A pointer that cannot be resolved is dropped, not cited.",
  },
  {
    id: "pbx",
    index: "02",
    name: "PBX",
    alias: "Air-quality market cockpit",
    line: "City air-quality markets, read through one cockpit.",
    short: "A client's custody dashboard, rebuilt as a single-page trader cockpit, plus a read-only review of the engine behind it.",
    summary:
      "PBX runs city markets on Solana that track real PM2.5 sensor readings. We rebuilt its custody dashboard as a single-page trader cockpit, co-wrote a second, cross-model CI reviewer for the repository, and reviewed the trading engine read-only.",
    status: "Shipped",
    relationship: "Client platform",
    role: "Trader cockpit, CI reviewer (co-authored), engine review",
    disciplines: ["Product", "Interface engineering", "Systems review"],
    facts: [
      { value: "3", label: "city markets: New York, Chicago, Toronto" },
      { value: "1", label: "page, up to five scopes, one central chart" },
      { value: "28", label: "claims in our own proposal fact-checked before sending" },
    ],
    behaviours: [
      "One vault, its bots and three city markets on a single page, driven by a scope row and one central chart.",
      "A sell line is drawn only when the bot's settings and a real, priced holding exist. Otherwise the card prints the reason the line is missing.",
      "The System tab of the activity history ships empty, with an explanation, rather than with invented rows.",
      "The CI reviewer is advisory, refuses fork pull requests, and withholds its own comment if the secret redactor cannot clear it.",
      "Verified at 390 pixels wide with 44 pixel touch targets.",
    ],
    rule: "Refuse to draw a number you cannot prove.",
  },
  {
    id: "provision",
    index: "03",
    name: "Provision OS",
    alias: "Visual release gate",
    line: "A release gate that can actually see.",
    short: "A partner-led gate that captures a page, measures what rendered and returns ship, patch or block. We work in its Taste Lab.",
    summary:
      "A partner-led release gate for AI-built software. The engine captures a page in a real browser, measures what rendered, and returns ship, patch or block. Correctness checks can stop a release; design critique is advisory and never can. The partner's Taste Lab records a designer's judgment before revealing what the machine found; our part is its baseline review flow, which locks that judgment in first.",
    status: "Private alpha",
    statusNote: "gated demo",
    relationship: "Partner-led venture",
    role: "Taste Lab review flow, corpus seeding and export; design-taste review; market research",
    disciplines: ["AI infrastructure", "Visual QA", "Developer tools"],
    facts: [
      { value: "3", label: "verdicts from the engine: ship, patch, block" },
      { value: "9", label: "themes in the Taste Lab's anchored rubric" },
      { value: "15", label: "MCP tools the engine exposes to coding agents" },
    ],
    behaviours: [
      "The engine captures screenshot, DOM, computed styles, accessibility violations, console and network at desktop and mobile sizes.",
      "It runs deterministic checks for overflow, clipping, tap targets and contrast, then three detectors that compare the DOM with the pixels.",
      "When a screenshot cannot be read it reports not measured and emits no finding.",
      "It hands coding agents a fix pack traced from the DOM to the likely source file, and can diff a second capture against the first.",
      "The Taste Lab runs a guided review with the machine last: first-glance attention, an anchored rubric, pairwise comparison, then the machine's findings. We built its baseline review flow, corpus seeding and export.",
    ],
    rule: "Judge the page before the machine speaks.",
  },
  {
    id: "hitl",
    index: "04",
    name: "Human In The Loop",
    alias: "Editorial send gate",
    line: "A newsletter that cannot send without a person.",
    short: "The editorial studio behind a Toronto AI community: evidence-backed briefs in, a human send gate, then delivery.",
    summary:
      "A Toronto enterprise-AI community venture. We built the machinery behind it: an editorial studio that imports evidence-backed story briefs, lets an editor cut and rewrite them, rechecks every source at the send gate, and only then freezes the recipient list and sends each person their own copy.",
    status: "Pre-launch",
    statusNote: "delivery simulated by default",
    relationship: "Co-founded venture",
    role: "Technical and product partner",
    disciplines: ["Venture design", "Editorial systems", "Delivery infrastructure"],
    facts: [
      { value: "6", label: "delivery adapters behind one switch: five providers and a simulator" },
      { value: "95,000", label: "byte budget enforced at the send gate" },
      { value: "0", label: "npm dependencies in the Node authoring CLI" },
    ],
    behaviours: [
      "Takes signups with explicit consent into subscriber and consent-event records. Unsubscribes, bounces and complaints are held as suppression states, and the event waitlist never subscribes anyone silently.",
      "At approve-and-send it requires an idempotency key and rechecks the validity of every included source.",
      "A revoked source blocks the send unless a written override is recorded.",
      "Turns one Markdown issue into email, web and text builds, fetching and hashing every cited source.",
      "The registration-queue prototype only orders applicants and lists its reasons. Nothing is admitted or declined automatically: a person decides, and a decline needs a reason.",
    ],
    stack: ["TypeScript", "Express", "React", "SQLite", "Docker", "Node CLI"],
    rule: "Nothing sends until a person approves it.",
  },
  {
    id: "voice",
    index: "05",
    name: "Voice Front Door",
    alias: "Voice Front Door",
    line: "The receptionist proposes. A person books.",
    short: "A voice receptionist that can reach only an allow-list of tools, and whose clinic bookings wait for staff to accept.",
    summary:
      "A voice receptionist engine for a family-clinic EMR startup co-founded by one of us. The model can reach only an allow-list of tools through a typed state machine: verify, search, hold, read back, hear an explicit yes. In the clinic adapter even that result is a pending proposal for staff to accept. Built and tested on synthetic data only.",
    status: "Prototype",
    statusNote: "synthetic data only",
    relationship: "Founder-affiliated venture",
    role: "Receptionist engine, adapter contract, database schema and migrations",
    disciplines: ["Voice AI", "Guardrail design", "Backend engineering"],
    facts: [
      { value: "9", label: "allow-listed tools, nothing else reachable" },
      { value: "7", label: "typed call states" },
      { value: "13", label: "scripted call scenarios with exact tool sequences" },
    ],
    behaviours: [
      "Verifies the caller before any scheduling tool will run. Two failed attempts end the booking path and file a handoff request for staff.",
      "Out-of-order or batched tool calls are rejected and become a handoff request.",
      "Emergency language, clinical questions and repeated misunderstanding raise a staff handoff request through a fixed server-side policy. Live phone transfer is not wired yet.",
      "Staff acceptance rechecks the slot and writes the appointment, the audit row and a queued confirmation event in one transaction. Reschedule and cancel requests go straight to staff.",
      "Recording, transcripts and platform logging are off in the checked-in configuration. A kill switch disables every tool.",
    ],
    rule: "The model proposes. A person approves.",
  },
  {
    id: "hive",
    index: "06",
    name: "The Hive",
    alias: "The Hive",
    line: "An observatory where evidence earns the unlock.",
    short: "A venture study with a playable core loop: cite the evidence, explain the conclusion, and a server-side check decides.",
    summary:
      "A venture study of how AI agents, qualified people and independent review could be organised into work an institution can accept, plus a playable prototype of the core loop. In three practice missions built on authored, synthetic evidence, players, or their own coding agent through a one-task local bridge, cite evidence and explain a conclusion. A server-side check alone decides what counts.",
    status: "Prototype",
    statusNote: "with a research package",
    relationship: "Inspectre venture study",
    role: "Thesis, research, game design, full-stack build",
    disciplines: ["Venture research", "Game design", "Agent infrastructure"],
    facts: [
      { value: "3", label: "chained practice missions on synthetic evidence" },
      { value: "0", label: "model calls made by the platform" },
      { value: "77", label: "sources in the evidence ledger" },
    ],
    behaviours: [
      "A practice finding is accepted only when the answer matches, every evidence card is cited and the explanation mentions the deciding concept. It is a keyword check, not a quality judgment.",
      "Rejections come back with specific feedback and a path to revise.",
      "The local bridge claims one task, asks for confirmation, runs the player's own agent with tools disabled, submits, then exits.",
      "Agent tokens are revocable and task leases are time-boxed. Late, changed or foreign results are rejected.",
      "The commercial thesis is written with its own falsification gates.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Postgres", "Node CLI", "Remotion"],
    rule: "The server alone decides what counts.",
  },
  {
    id: "summit",
    index: "07",
    name: "Summit Rush",
    alias: "Fixed-outcome game review",
    line: "A game's math, read line by line.",
    short: "A read-only math, platform and source review of a fixed-outcome game one of our founders is building with a partner team.",
    summary:
      "A read-only math, platform and source review of a fixed-outcome game that one of our founders is building with a partner team. We explained the payout model in a teaching guide, traced our observations to file and line at one pinned commit, and checked the numbers against the platform's published rules. Nothing in the game was changed.",
    status: "Delivered",
    statusNote: "read-only analysis",
    relationship: "Read-only review",
    role: "Game-math explanation, platform constraints, read-only source review",
    disciplines: ["Research", "Game math", "Technical due diligence"],
    facts: [
      { value: "52", label: "page guide to the payout model" },
      { value: "9", label: "source observations cited to file and line" },
      { value: "0", label: "lines of the game changed: the review was read-only" },
    ],
    behaviours: [
      "Explains a fixed-outcome model plainly: one bet selects one pre-recorded round, and every denominator is named.",
      "The guide labels its numbers as reported, derived, teaching example or proposed, so an example is never mistaken for the real distribution.",
      "Reconciles the project's local gates with the platform's published rules, and issued a dated correction to its own earlier note when the live documentation said otherwise.",
      "Works proposed rule changes through with arithmetic, and lists the decisions that are still open.",
      "Recommends a narrow greybox and math-feasibility step before art is commissioned.",
    ],
    rule: "Name every denominator.",
  },
];

export const practice = [
  {
    index: "01",
    scene: "wedge",
    title: "Find the wedge",
    copy: "Research, product strategy, positioning, and the evidence that makes a direction worth taking.",
    count: 77,
    countLabel: "sources in one evidence ledger",
    source: "hive",
  },
  {
    index: "02",
    scene: "system",
    title: "Design the system",
    copy: "Brand, interface, interaction, architecture, and the rules that make the whole thing cohere.",
    count: 5,
    countLabel: "views of one vault, on a single page",
    source: "pbx",
  },
  {
    index: "03",
    scene: "build",
    title: "Build the real thing",
    copy: "Full-stack software, AI and data infrastructure, on-chain interfaces, prototypes and shipped releases.",
    count: 23,
    countLabel: "public sources wired and tested",
    source: "radar",
  },
  {
    index: "04",
    scene: "hard",
    title: "Stay for the hard part",
    copy: "Evaluation, guardrails, release quality, operational tooling and the unglamorous edges.",
    count: 13,
    countLabel: "scripted calls with tool order asserted",
    source: "voice",
  },
] as const;

export const capabilities = [
  {
    title: "Agent and voice systems",
    copy: "Typed state machines, allow-listed tools and handoff policies the model cannot talk its way around.",
  },
  {
    title: "Evidence infrastructure",
    copy: "Provenance, content hashes, tombstones and staleness checks, so a citation still means something next month.",
  },
  {
    title: "Release and visual QA",
    copy: "Human design judgment captured before the machine speaks, then compared with what a rendering gate measured.",
  },
  {
    title: "Market and protocol interfaces",
    copy: "Dense, honest cockpits for on-chain systems. If the data is not there, neither is the line on the chart.",
  },
  {
    title: "Editorial and delivery systems",
    copy: "Consent ledgers, send gates, provider adapters and audit trails, built so nothing reaches an inbox without a person.",
  },
  {
    title: "Research and due diligence",
    copy: "Math reviews, source audits pinned to a commit, and proposals that are fact-checked before they leave.",
  },
] as const;

export type Engagement = {
  tag: string;
  title: string;
  copy: string;
  /** named through publicName(), so an alias switches these too */
  examples: { id: ProjectId; suffix?: string }[];
};

export const engagements: Engagement[] = [
  {
    tag: "Co-build",
    title: "Venture build",
    copy: "From thesis to working system. We take the research, identity, product and code as one problem, and we say so when the evidence is against the idea.",
    examples: [{ id: "radar" }, { id: "hive" }, { id: "hitl" }],
  },
  {
    tag: "Embed",
    title: "Embedded engineering",
    copy: "We join your repository for the part that is stuck: the cockpit, the call engine, the schema, the review lab. Staged pull requests, behind a flag, tested.",
    examples: [{ id: "pbx" }, { id: "voice" }, { id: "provision" }],
  },
  {
    tag: "Review",
    title: "Read-only review",
    copy: "Diligence on a system you already have, without touching it. Observations cited to a file and a line, numbers labelled by where they came from.",
    examples: [{ id: "summit" }, { id: "pbx", suffix: " engine review" }],
  },
];

export const needs = ["New venture", "AI or agent system", "Data infrastructure", "Product and interface", "Read-only review", "Not sure yet"] as const;
export const timelines = ["This quarter", "Next quarter", "Exploring"] as const;
