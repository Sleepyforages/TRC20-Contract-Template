# Idea Harvest Skill — v1

## Goal
Find 10 business ideas (hustles or products) that pass ALL criteria with high confidence.

## Criteria (ALL must hold)
1. **Novel (market level)** — no publicly known product/project addressing the same issue or providing the same service. Verified by web search: if a direct competitor is found, FAIL. Adjacent/partial solutions are OK if the core offer differs materially.
2. **Tech base** — uses one or more of: AI, Blockchain, Robotics.
3. **Commercialisable** — a clear paying customer and revenue mechanism exists.
4. **No R&D** — buildable today entirely from existing, proven components (models, APIs, hardware, datasets). Integration/engineering OK; research/invention NOT OK.
5. **Provable demand** — evidence people already pay for a manual/inferior version, or documented complaints/spending in the niche (forums, job posts, market reports, search volume). Since the idea itself is novel, demand is proven via adjacent evidence.
6. **Bigdata/HPC** — involves >1TB of data (as input, asset, or service) and/or HPC (in development or operation).

## Strategy v1: Multi-lens generation → triage → adversarial verification
### Generation lenses (each agent gets one)
- L1 Pain mining: expensive manual workflows in data-heavy industries → automate with AI.
- L2 Dataset-first: existing open/commercial >1TB datasets nobody has productised.
- L3 Cross-pollination: take a proven business model from industry A, apply to underserved industry B with AI/robotics.
- L4 Compliance/regulation: new 2024-2026 regulations creating mandatory demand; blockchain/AI for audit/provenance.
- L5 HPC arbitrage: idle compute, simulation-as-a-service, model distillation services for niches.

### Generation rules (per raw idea, keep it to 4 lines)
- NAME | one-sentence offer | who pays & why | which tech + which >1TB data / HPC angle
- Aim for boring-but-specific niches, not sci-fi. No idea that needs new science.
- Prefer B2B niches (demand is provable via spend); avoid consumer apps (crowded → novelty fails).

### Triage (orchestrator, no tools)
Score 0-2 per criterion from face value; kill anything with an obvious known competitor or R&D smell. Advance top ~25%.

### Verification (per candidate, agent with WebSearch)
1. Search 3-5 phrasings of the offer + "startup|product|service|github". List closest existing products and why they differ. Verdict: NOVEL / NOT NOVEL / UNCLEAR.
2. Search for demand evidence: who pays for the manual version today, market size, complaints.
3. Verdict per criterion with citations. Kill on any hard FAIL.

## Learned rules (updated each iteration)
- (v1 — none yet)
