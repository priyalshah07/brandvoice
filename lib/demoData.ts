import { AudienceId, GeneratedOutput, OnboardingState, BrandVoiceProfile, CritiqueResult } from "@/types";

export const DEMO_BRAND_CONTENT = `PRESS RELEASE — Meridian Launches Model Deployment Platform, Cutting Time-to-Production from 6 Weeks to 3 Days

FOR IMMEDIATE RELEASE — Meridian, the enterprise ML deployment company, today announced general availability of its model deployment platform. The platform enables engineering teams to move trained models from staging to production in under 72 hours — a process that previously took most enterprise teams four to six weeks.

---

LinkedIn Post (CEO):
Two years ago I sat in a room with a VP of Engineering at a Fortune 100 company. She had 14 models sitting in notebooks, trained, validated, and ready to ship. Zero had made it to production. The bottleneck wasn't the models. It was everything around them: infra wrangling, compliance reviews, monitoring setup, rollback logic.

That's the problem Meridian was built to solve. We're not another MLOps dashboard. We're the missing deployment layer that makes ML actually ship.

Proud of the team for getting us to this point. More to share soon.

---

LinkedIn Post (Head of Product):
What separates ML teams that ship from ones that don't? It's almost never the models.

It's the last mile: reproducible environments, audit trails, version-controlled deployments, monitoring that fires before a model drifts, not after. The teams that get this right treat deployment as a product problem, not an ops problem.

At Meridian, we've spent 18 months obsessing over that last mile. The result is a platform that makes the unsexy parts fast, compliant, and boring in the best possible way.

---

About Meridian:
Meridian helps enterprise teams close the gap between ML experimentation and production impact. Our deployment platform handles the full lifecycle — from model packaging and environment reproducibility to staged rollouts, drift monitoring, and compliance logging — so data science teams can focus on models, not infrastructure. We work with companies where getting ML wrong has real consequences: logistics, financial services, healthcare operations. Our customers reduce time-to-production by 90% and cut model-related incidents by 60%.

---

Website copy — Why Meridian:
Most ML platforms are built for the experiment. Meridian is built for the aftermath. We focus exclusively on the deployment layer because that's where most ML value gets stuck. Our customers don't need another notebook environment or feature store. They need their models to actually run in production — reliably, auditably, at scale. That's the only problem we solve. And we're very good at it.`;

export const DEMO_MILESTONE = `Meridian just closed a $28M Series A led by Benchmark. The funding will accelerate our model deployment platform, which has cut time-to-production from 6 weeks to 3 days for 40 enterprise customers including two Fortune 500 logistics companies. We're expanding the team from 22 to 60 over the next 12 months.`;

export const DEMO_OUTPUTS: GeneratedOutput[] = [
  {
    audienceId: "investor",
    wordCount: 178,
    content: `Meridian just closed a $28M Series A led by Benchmark — and the signal isn't the round size, it's the retention.

40 enterprise customers. Two Fortune 500s in logistics. A product that cuts ML time-to-production from 6 weeks to 3 days. Those aren't beta metrics. That's a repeatable motion.

Here's what this milestone actually unlocks: we've proven the deployment layer is the right place to sit in the ML stack. Not experimentation, not feature stores — the last mile where models either ship or die in staging. That gap costs enterprises millions in delayed value, and most platforms ignore it entirely.

The $28M goes toward two things: deepening the platform's compliance and monitoring layer (the moat), and scaling the GTM motion we've validated in logistics into financial services and healthcare operations — two verticals with the same pain and even more willingness to pay for reliability.

Capital efficiency to date: 40 customers, $28M raised. We're not burning to grow. We're building a business.

If you're watching the enterprise ML infrastructure space, this is worth a closer look.`,
  },
  {
    audienceId: "partner",
    wordCount: 152,
    content: `Hi [Name],

Reaching out because Meridian just completed a milestone that's relevant to a conversation I think we should have.

We closed a $28M Series A this week — but more importantly, we now have 40 enterprise customers, including two Fortune 500 logistics companies, using our platform to move ML models from staging to production in under 3 days (down from a typical 6-week cycle).

What that means for a potential partnership:

• Your customers likely have trained models sitting idle in staging — we can close that gap without requiring them to rebuild existing infrastructure
• Our compliance logging and audit trail layer maps directly onto the regulatory requirements your enterprise clients face
• We've proven the motion in logistics and are expanding into financial services and healthcare — verticals where your team already has deep relationships

Happy to share more if this is relevant to what you're building toward.

— [Meridian Team]`,
  },
  {
    audienceId: "technical",
    wordCount: 201,
    content: `1/ We just closed a $28M Series A. But the more interesting number is this: our platform moves ML models from staging to prod in 72 hours. The industry average is 6 weeks. Here's what we actually built to get there. 🧵

2/ The bottleneck was never the model. It was environment drift, reproducibility failures, and the 12-step manual dance between data science and platform eng. We attacked each one. Immutable model packages. Declarative deployment specs. Automated compliance gates.

3/ The hardest part was drift monitoring that fires *before* a model causes an incident, not after. Most monitoring is reactive. We built leading indicators: distribution shift detection on inference inputs, automated A/B rollback triggers, latency percentile alerting per model version.

4/ We serve logistics and financial services — industries where a drifted model isn't a bug report, it's a regulatory event. That constraint forced us to build audit trails and version lineage that most MLOps tools treat as afterthoughts.

5/ Biggest open question we're sitting with: as LLM-based models enter enterprise production, does deployment complexity go up or down? Our intuition says up (non-determinism, prompt versioning, eval pipelines). What are you seeing in your stack?`,
  },
  {
    audienceId: "talent",
    wordCount: 169,
    content: `Most companies say they're solving a hard problem. Here's what ours actually looks like:

Enterprise teams have trained models that work. They can't ship them. The bottleneck isn't the science — it's the deployment layer: environment reproducibility, compliance logging, rollback logic, drift detection. It's unsexy infrastructure work that almost no one has built well, and it's costing companies millions in delayed value.

We just closed a $28M Series A led by Benchmark. 40 enterprise customers. Two Fortune 500s. Time-to-production cut from 6 weeks to 3 days. The round is real, the customers are real, and the technical problems ahead are genuinely hard.

We're going from 22 to 60 people over the next 12 months. If you join now, you're not inheriting a system someone else designed — you're designing it. The monitoring layer, the multi-model orchestration engine, the compliance framework for regulated industries. These are greenfield problems with production constraints.

This isn't a place to coast on a senior title. It's a place to do the best technical work of your career.

We're hiring.`,
  },
  {
    audienceId: "press",
    wordCount: 128,
    content: `Most enterprise AI announcements focus on what was built. This one is about what keeps not shipping.

Meridian, an ML deployment startup, announced a $28M Series A led by Benchmark this week, bringing its total funding to $28M. The company's platform now serves 40 enterprise customers — including two Fortune 500 logistics companies — and has reduced the time it takes to move a trained machine learning model into production from six weeks to three days.

The counterintuitive part: the bottleneck has never been the models themselves. Enterprises have them. They just can't deploy them. Meridian's bet is that the deployment layer — not the training layer — is where the real enterprise AI value gets unlocked or permanently stuck.

Suggested angle: Why does it take six weeks to ship a model that took six days to train — and what does that say about where enterprise AI is actually failing?`,
  },
];

export const AUDIENCES = [
  {
    id: "investor" as AudienceId,
    label: "Investor / VC",
    description: "LinkedIn post calibrated for capital allocators scanning deal flow",
    format: "LinkedIn post · 150–200 words",
  },
  {
    id: "partner" as AudienceId,
    label: "Strategic Partner",
    description: "Cold outreach opening for enterprise buyers and potential partners",
    format: "Email opening + 3 bullets · 150 words",
  },
  {
    id: "technical" as AudienceId,
    label: "Technical Community",
    description: "Twitter/X thread for engineers, researchers, and domain experts",
    format: "5-tweet thread · 280 chars each",
  },
  {
    id: "talent" as AudienceId,
    label: "Top-of-Funnel Talent",
    description: "LinkedIn post for senior hires evaluating their next move",
    format: "LinkedIn post · 150–180 words",
  },
  {
    id: "press" as AudienceId,
    label: "Press / Journalist",
    description: "Pitch paragraph for tech and science journalists",
    format: "Pitch paragraph · 100–130 words",
  },
];

export const DEMO_ONBOARDING_STATE: OnboardingState = {
  brandContent: DEMO_BRAND_CONTENT,
  selectedAudiences: ["investor", "partner", "technical", "talent", "press"],
  milestone: DEMO_MILESTONE,
};

// ── Demo Brand Voice Profile (simulated from demo.meridian.ai) ──

export const DEMO_BRAND_PROFILE: BrandVoiceProfile = {
  tone_descriptors: [
    "Direct — states conclusions before explanations",
    "Technically literate — uses infrastructure vocabulary without over-explaining",
    "Quietly confident — no superlatives, claims earn their weight",
    "Problem-first — always opens with what's broken before introducing the fix",
    "Honest about scope — says exactly what they do and what they don't",
  ],
  signature_phrases: [
    "The bottleneck wasn't the models",
    "The missing deployment layer",
    "Makes ML actually ship",
    "The last mile",
    "Boring in the best possible way",
    "Where ML value gets stuck",
    "Real consequences",
    "Not another [category product]",
  ],
  avoid_list: [
    "Never uses 'excited to announce' or 'thrilled'",
    "No feature-list marketing — always leads with the problem or outcome",
    "Avoids comparisons to competitors by name",
    "No vague scale claims without numbers to back them",
    "Never uses 'AI-powered,' 'next-generation,' or 'revolutionary'",
    "Doesn't anthropomorphize the product",
  ],
  content_style:
    "Short declarative sentences alternate with slightly longer ones carrying the key insight. Paragraphs rarely exceed 3 sentences. The rhythm is punchy then explanatory — hook, evidence, implication.",
  values_emphasis: [
    "Deployment reliability over experimentation velocity",
    "Enterprise-grade compliance as a first-class requirement",
    "Specificity — numbers and named outcomes over vague claims",
    "The unsexy work matters as much as the model",
  ],
  raw_chunks: [
    "The bottleneck wasn't the models. It was everything around them: infra wrangling, compliance reviews, monitoring setup, rollback logic.",
    "We're not another MLOps dashboard. We're the missing deployment layer that makes ML actually ship.",
    "What separates ML teams that ship from ones that don't? It's almost never the models.",
    "Our customers don't need another notebook environment or feature store. They need their models to actually run in production — reliably, auditably, at scale.",
    "Meridian is built for the aftermath. We focus exclusively on the deployment layer because that's where most ML value gets stuck.",
    "The result is a platform that makes the unsexy parts fast, compliant, and boring in the best possible way.",
    "We work with companies where getting ML wrong has real consequences: logistics, financial services, healthcare operations.",
    "Our customers reduce time-to-production by 90% and cut model-related incidents by 60%.",
    "Most ML platforms are built for the experiment. Meridian is built for the aftermath.",
    "Treating deployment as a product problem, not an ops problem.",
  ],
};

export const DEMO_AGENT_LOG_LINES = [
  "Fetching homepage...",
  "Found 22 internal links. Identifying the most relevant pages...",
  "Prioritizing: About, Blog, Press Release, Product, Platform pages",
  "Reading About page...",
  "Reading Blog (3 most recent posts)...",
  "Reading Press page...",
  "Reading Platform page...",
  "Extracting brand voice signals...",
  "Done. Analyzed 6 pages.",
];

// ── Demo Critique Results (hardcoded for demo outputs) ──

export const DEMO_CRITIQUE_RESULTS: Record<AudienceId, CritiqueResult> = {
  investor: {
    original: DEMO_OUTPUTS[0]?.content ?? "",
    revised: null,
    finalVersion: DEMO_OUTPUTS[0]?.content ?? "",
    wasRevised: false,
    iteration1Scores: {
      hook: 9,
      audience_fit: 8,
      brand_voice: 8,
      claim_grounding: 9,
      format_compliance: 9,
      overall: 8.6,
    },
    iteration2Scores: null,
    issues: [],
    strengths: [
      "The hook ('the signal isn't the round size, it's the retention') reframes the announcement immediately — investors see pattern-matching language that signals a founder who thinks in their terms.",
      "The 'capital efficiency to date' paragraph is concrete and unpretentious. '40 customers, $28M raised. We're not burning to grow' is exactly the framing a Series B fund wants to read.",
    ],
  },
  partner: {
    original: DEMO_OUTPUTS[1]?.content ?? "",
    revised: `Hi [Name],

Reaching out because something Meridian shipped this week changes the conversation I think we should have.

We cut ML model deployment time from six weeks to three days for 40 enterprise customers — two are Fortune 500 logistics companies. We closed a $28M Series A this week to scale it further.

Here's why this is relevant to your team specifically:

• Enterprises you work with likely have trained models stuck in staging — we close that gap without requiring infrastructure rebuilds or renegotiating existing contracts
• Our compliance logging and audit trail layer maps directly onto regulated-industry requirements, which means shorter procurement cycles for joint customers
• We're expanding from logistics into financial services and healthcare — verticals where your relationships run deep and where deployment failure has real regulatory consequences

Happy to share more if relevant to what you're building toward.

— [Meridian Team]`,
    finalVersion: `Hi [Name],

Reaching out because something Meridian shipped this week changes the conversation I think we should have.

We cut ML model deployment time from six weeks to three days for 40 enterprise customers — two are Fortune 500 logistics companies. We closed a $28M Series A this week to scale it further.

Here's why this is relevant to your team specifically:

• Enterprises you work with likely have trained models stuck in staging — we close that gap without requiring infrastructure rebuilds or renegotiating existing contracts
• Our compliance logging and audit trail layer maps directly onto regulated-industry requirements, which means shorter procurement cycles for joint customers
• We're expanding from logistics into financial services and healthcare — verticals where your relationships run deep and where deployment failure has real regulatory consequences

Happy to share more if relevant to what you're building toward.

— [Meridian Team]`,
    wasRevised: true,
    iteration1Scores: {
      hook: 6,
      audience_fit: 7,
      brand_voice: 7,
      claim_grounding: 9,
      format_compliance: 8,
      overall: 7.4,
    },
    iteration2Scores: {
      hook: 8,
      audience_fit: 9,
      brand_voice: 8,
      claim_grounding: 9,
      format_compliance: 9,
      overall: 8.6,
    },
    issues: [
      {
        dimension: "Hook strength",
        severity: "medium",
        callout: "'Reaching out because Meridian just completed a milestone that's relevant to a conversation I think we should have' — the hook buries the lead and reads like a template opener.",
        fix_direction: "Lead with the specific result ($28M + 3-day deployment) in the first sentence so the value is visible before they decide whether to keep reading.",
      },
      {
        dimension: "Audience fit",
        severity: "medium",
        callout: "Bullet 1 ('Your customers likely have trained models sitting idle') uses 'likely' — hedging weakens credibility with a VP-level reader who expects you to have done your homework.",
        fix_direction: "Reframe as a stated fact with a reason why it's true in their context, not a guess about their situation.",
      },
    ],
    strengths: [
      "The soft CTA is exactly right — no 'let me know if you'd like to chat' language, just a clean peer-to-peer close.",
      "The three bullet structure correctly maps to distinct value angles rather than repeating the same point with different words.",
    ],
  },
  technical: {
    original: DEMO_OUTPUTS[2]?.content ?? "",
    revised: `1/ We just closed a $28M Series A. The more interesting number is 72 hours. That's how long it now takes our customers to put a trained ML model into production. Industry average: 6 weeks. Here's what we actually built. 🧵

2/ The blocker was never the model. It was the 12-step manual handoff between data science and platform eng: environment drift, dependency conflicts, compliance gate signoffs, rollback logic written from scratch every time. We attacked each one separately.

3/ Drift monitoring was the hardest part. Most monitoring fires after a model causes an incident. We needed leading indicators: input distribution shift detection, automated A/B rollback triggers, per-version latency percentile alerts. Reactive monitoring in regulated industries is a compliance event waiting to happen.

4/ We serve logistics and financial services — where a drifted model isn't a bug report, it's a regulatory filing. That constraint forced us to treat audit trails and model lineage as core primitives, not a logging afterthought bolted on at the end.

5/ Biggest open question: as LLM-based models enter enterprise production, does deployment complexity go up or down? Our intuition: up — non-determinism, prompt versioning, eval pipelines in the hot path. What are you seeing in your stack?`,
    finalVersion: `1/ We just closed a $28M Series A. The more interesting number is 72 hours. That's how long it now takes our customers to put a trained ML model into production. Industry average: 6 weeks. Here's what we actually built. 🧵

2/ The blocker was never the model. It was the 12-step manual handoff between data science and platform eng: environment drift, dependency conflicts, compliance gate signoffs, rollback logic written from scratch every time. We attacked each one separately.

3/ Drift monitoring was the hardest part. Most monitoring fires after a model causes an incident. We needed leading indicators: input distribution shift detection, automated A/B rollback triggers, per-version latency percentile alerts. Reactive monitoring in regulated industries is a compliance event waiting to happen.

4/ We serve logistics and financial services — where a drifted model isn't a bug report, it's a regulatory filing. That constraint forced us to treat audit trails and model lineage as core primitives, not a logging afterthought bolted on at the end.

5/ Biggest open question: as LLM-based models enter enterprise production, does deployment complexity go up or down? Our intuition: up — non-determinism, prompt versioning, eval pipelines in the hot path. What are you seeing in your stack?`,
    wasRevised: true,
    iteration1Scores: {
      hook: 7,
      audience_fit: 8,
      brand_voice: 7,
      claim_grounding: 8,
      format_compliance: 6,
      overall: 7.2,
    },
    iteration2Scores: {
      hook: 9,
      audience_fit: 9,
      brand_voice: 8,
      claim_grounding: 8,
      format_compliance: 9,
      overall: 8.6,
    },
    issues: [
      {
        dimension: "Format compliance",
        severity: "high",
        callout: "Tweet 3 ('The hardest part was drift monitoring that fires *before* a model causes an incident...') is 298 characters — 18 over the 280-character limit.",
        fix_direction: "Cut 'Most monitoring is reactive.' (a standalone sentence) and fold its meaning into the following sentence to stay under limit.",
      },
      {
        dimension: "Hook strength",
        severity: "low",
        callout: "Tweet 1 opens with 'We just closed a $28M Series A' — the funding is the least technically interesting thing in the thread. A technical audience may disengage before the interesting content.",
        fix_direction: "Lead with the number that signals technical achievement (72 hours vs 6 weeks) and introduce the round in the same breath as the context, not as the hook.",
      },
    ],
    strengths: [
      "Tweet 4 on audit trails and model lineage is the strongest in the thread — it names a real constraint (regulatory consequences) and explains why it shaped a specific architectural decision. This is the kind of specificity the technical audience stops scrolling for.",
      "The open question in Tweet 5 is genuine, not performative. 'Eval pipelines in the hot path' signals real production experience.",
    ],
  },
  talent: {
    original: DEMO_OUTPUTS[3]?.content ?? "",
    revised: null,
    finalVersion: DEMO_OUTPUTS[3]?.content ?? "",
    wasRevised: false,
    iteration1Scores: {
      hook: 9,
      audience_fit: 8,
      brand_voice: 9,
      claim_grounding: 9,
      format_compliance: 8,
      overall: 8.6,
    },
    iteration2Scores: null,
    issues: [],
    strengths: [
      "Opening with the actual problem ('Enterprises have trained models that work. They can't ship them.') instead of the company or the role is exactly right for this audience — it establishes that the work is real before making any ask.",
      "Holding 'We're hiring' for the final line lands well. The post earns it by describing what the next hire will actually build (monitoring layer, multi-model orchestration, compliance framework) — concrete enough to attract the right person and filter out the wrong ones.",
    ],
  },
  press: {
    original: DEMO_OUTPUTS[4]?.content ?? "",
    revised: `Enterprise AI teams aren't failing to train models. They're failing to ship them.

Meridian, an ML deployment startup, announced a $28M Series A led by Benchmark this week, serving 40 enterprise customers including two Fortune 500 logistics companies. The company's platform has compressed ML deployment cycles from six weeks to three days.

The counterintuitive finding: the bottleneck isn't the algorithm, it's the infrastructure wrapper — the compliance gates, environment reproducibility issues, and monitoring gaps that sit between a validated model and one that's running in production. Most enterprise AI investment has flooded into training. Almost none has gone into what happens next.

Suggested angle: The hidden reason enterprise AI pilots don't become products — and why fixing deployment, not models, might be the most important unsolved problem in applied ML.`,
    finalVersion: `Enterprise AI teams aren't failing to train models. They're failing to ship them.

Meridian, an ML deployment startup, announced a $28M Series A led by Benchmark this week, serving 40 enterprise customers including two Fortune 500 logistics companies. The company's platform has compressed ML deployment cycles from six weeks to three days.

The counterintuitive finding: the bottleneck isn't the algorithm, it's the infrastructure wrapper — the compliance gates, environment reproducibility issues, and monitoring gaps that sit between a validated model and one that's running in production. Most enterprise AI investment has flooded into training. Almost none has gone into what happens next.

Suggested angle: The hidden reason enterprise AI pilots don't become products — and why fixing deployment, not models, might be the most important unsolved problem in applied ML.`,
    wasRevised: true,
    iteration1Scores: {
      hook: 6,
      audience_fit: 8,
      brand_voice: 7,
      claim_grounding: 8,
      format_compliance: 7,
      overall: 7.2,
    },
    iteration2Scores: {
      hook: 9,
      audience_fit: 9,
      brand_voice: 8,
      claim_grounding: 9,
      format_compliance: 9,
      overall: 8.8,
    },
    issues: [
      {
        dimension: "Hook strength",
        severity: "high",
        callout: "'Most enterprise AI announcements focus on what was built. This one is about what keeps not shipping.' — this is a meta-commentary on other press releases, not a story hook. Journalists don't care about the form; they care about the finding.",
        fix_direction: "Lead with the actual insight as a plain declarative statement. The hook should be the thing a journalist could use as a pull quote or lede, not a framing device.",
      },
      {
        dimension: "Audience fit",
        severity: "low",
        callout: "The suggested story angle ('Why does it take six weeks to ship a model that took six days to train') is good but phrased as a rhetorical question — journalists prefer angles stated as theses they can either pitch or push back on.",
        fix_direction: "Rewrite the story angle as a statement: 'The hidden reason enterprise AI pilots don't become products' is stronger than a question.",
      },
    ],
    strengths: [
      "Placing the company name and milestone in sentence 2 is correct — it follows the spec and is the right instinct for this audience.",
      "The line 'Meridian's bet is that the deployment layer — not the training layer — is where the real enterprise AI value gets unlocked or permanently stuck' is the clearest articulation of the counter-narrative and could survive intact in the revised version.",
    ],
  },
};
