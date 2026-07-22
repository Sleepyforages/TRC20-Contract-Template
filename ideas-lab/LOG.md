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

### Iteration 2 (2026-07-22, running)
- Strategy v2: demand-first harvesting (search-enabled generation), triple intersections, static-incumbent verticals, gap mining, survivor strengthening.
