# Ideas Lab — Run Log

Goal: 10 ideas passing all 6 criteria with high confidence.
Target X=10, raw batch per iteration = 100 (X*10).

## Inventory of tools
- WebSearch / WebFetch — novelty & demand verification
- Bigdata.com MCP — market/financial evidence (news, filings, research)
- Hugging Face MCP — dataset discovery (>1TB check)
- GitHub search — check for existing open-source competitors
- Agent tool — haiku (bulk generation), sonnet (verification), Fable (orchestration/eval only)

## Iterations

### Iteration 1 (2026-07-22)
- Strategy: 5-lens generation (pain-mining, dataset-first, cross-pollination, regulation, HPC-arbitrage), 100 raw → triage 18 → adversarial verification.
- Cost: ~5 haiku gen agents (~19k tok each), 6 sonnet verify agents (~47k tok each).
- Result: **0 confirmed** | 1 provisional (C4 TechWave — novel, demand inferred) | 1 unclear (C18 CemeteryDynamic — novel, demand unproven, ethics risk).
- Funnel: 100 raw → 18 triaged (82% kill: known competitors) → 1.5 surviving (92% verification kill).
- Key knowledge extracted → SKILL v2: kill-patterns list (satellite-detection, blockchain-provenance, sim-bureaus, Carfax-for-X, regulation-compliance all saturated); novelty requires ≥2 unusual dimensions or boring-niche-with-spend; demand must be direct evidence; lens quality ranking: dataset-first > cross-pollination > HPC > regulation > pain-mining (0 survivors).
- Verification also surfaced exploitable GAPS: OpenET 6-wk lag/no enforcement reports; scrap-yard sub-problems unfused; Foundation EGI doesn't cover appliance right-to-repair depth.

### Iteration 2 (2026-07-22) — COMPLETE
- Strategy v2: demand-first harvesting (search-enabled generation), triple intersections, static-incumbent verticals, gap mining, survivor strengthening.
- Result: **+4 confirmed (running total 4/10)**: #1 WikiPulse (survivor-strengthening on iter1 C4), #2 PlotFolio (reframe of iter1 C18), #3 LienLift (W12 narrowed), #4 AquiferIQ (W7 scoped). 2 parked (ObituaryMind, LivestockAI). 14/18 verification fails.
- Funnel: 100 raw → 18 verified → 2 direct confirms + 2 confirms via survivor work. Survivor strengthening/reframing had 100% hit rate (2/2) — cheapest confirms so far. Gap-mining and scoping rescues work.
- Learnings → SKILL v3: consultant-replacement pattern; demand-evidence hierarchy (gov procurement docs best, vendor content = competitor tell); verifier R&D calibration; incumbent-press-release check; new kill-patterns.

### Iteration 3 (2026-07-22, running)
- Primary lens: CONSULTANT-REPLACEMENT — mine public procurement portals/board minutes/RFPs for recurring paid studies ($10k-500k) convertible to data products. Secondary: parked-idea strengthening (ObituaryMind demand), intersection round 3 avoiding kill list, incumbent-press-release pre-check in generation.
