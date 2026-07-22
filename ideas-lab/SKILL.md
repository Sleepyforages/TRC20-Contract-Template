# Idea Harvest Skill — v3

## v3 learnings (iter2: 100 raw → 18 verified → 2 confirmed, 2 parked)
**Winning pattern (all 4 confirms so far):** an OVERLOOKED STAKEHOLDER in an existing money flow (PE roll-up, storage operator at auction, municipality siting a well, innovation scout) + the manual alternative is an EXPENSIVE PER-INSTANCE PROFESSIONAL SERVICE (consultant study $10-100k, test well, survey, platform subscription) + public/obtainable data. "Replace the consulting engagement with a data product."
**Demand-evidence hierarchy (best→worst):** (1) government procurement docs/board minutes/RFPs with dollar amounts — public, verifiable, novelty-safe; (2) industry press explicitly naming an unsolved gap; (3) funded startups in ADJACENT problem (proves category spend); (4) vendor content marketing = RED FLAG, the vendor IS the competitor.
**Verifier calibration:** R&D means unproven science / open research problems (analog-film georeferencing, radar QPE nowcasting, outdoor unstructured-terrain robots). Standard ML/CV/forecasting on obtainable data is ENGINEERING, not R&D — verifiers must not fail C for "requires building a model."
**Scoping rescues ideas:** v1-scope to the digitized subset (AquiferIQ: digital-log states only) can flip a no-R&D FAIL to PASS.
**New kill-patterns (add to list):** dynamic pricing/revenue mgmt for ANY hospitality-adjacent vertical (Campspot, PriceLabs, IDeaS); vertical field-service SaaS + "add prediction" (ServiceCore, Routeware, AMCS cover the boring fleets); reserve studies (SmartProperty Atlas); WIM enforcement analytics (Rekor, IRD); CEMS/power-plant intel for traders (IIR, Wood Mac, Yes Energy, Kpler); historical-series reconstruction (Global Financial Data); residuals/royalty automation (EP, Exactuals); photo→repair-guide CV (Streem, iFixit FixBot); cross-community benchmarking plays where a vertical SaaS incumbent just shipped it — CHECK INCUMBENT PRESS RELEASES, they move fast.

---

# (v2 below, still valid)

## Goal
Find 10 business ideas (hustles or products) that pass ALL criteria with high confidence.

## Criteria (ALL must hold)
1. **Novel (market level)** — no publicly known product/project addressing the same issue/service. Verified adversarially by web search.
2. **Tech base** — AI, Blockchain, and/or Robotics.
3. **Commercialisable** — clear payer + revenue mechanism.
4. **No R&D** — existing proven components only. Integration OK; invention/engineering-risk NOT OK (e.g. outdoor ground robots on unstructured terrain = R&D → fail).
5. **Provable demand** — DIRECT evidence of spend on a manual/inferior version of the same outcome. Inferred demand ("VCs buy tools generally") is insufficient for final pass.
6. **Bigdata/HPC** — >1TB data involved and/or HPC in dev or operation.

## KILL-PATTERNS (learned iter1 — auto-reject at generation, do not even emit)
- "<X> detection/monitoring via satellite" — EO analytics saturated (ImiSight, OpenET, Terra Trace, OCTAVE, Satelligence…)
- "Blockchain provenance/passport for <material/product>" — SMX, Circulor, Minespider, IBM Food Trust…
- "Simulation-as-a-service / analysis bureau for <part>" — decades-old consultancy segments (CAE Services, VICUSdt, Moldex3D)
- "Carfax for <asset>" — pattern too famous (Machinetrail, IRONcheck)
- "Compliance automation for <named EU/US regulation>" — vendor land-rush within months of any regulation (ProvenanceAI, Satelligence, Watershed)
- "Predictive maintenance for <equipment>"; "AI quality inspection on <production line>" — Augury, Inwatec etc.
- Any idea expressible as "<well-known pattern> for <industry>" — if the pattern has a name, someone built it.
- AI enhancement of medical images; fish/catch forecasting; gentrification prediction; deal-sourcing platforms (broad).

## WHERE NOVELTY SURVIVED (iter1 evidence)
- Hyper-specific unusual data source × unusual buyer (Wikipedia revision-velocity → VC scouts): C4, only weak-margin pass.
- Proven technique transplanted into ultra-conservative niche whose incumbent software is static (cemetery yield management): C18, novelty passed, demand unclear.
→ Novelty needs ≥2 simultaneously unusual dimensions, OR a niche too small/boring for startups but with real spend.

## Strategy v2: demand-first + intersections + static incumbents + gap mining
- **B Demand-first harvesting (with web search):** find DOCUMENTED pain first (forum threads, "still uses Excel/fax", job ads for manual data-entry roles, industry-press complaints), then wrap tech around it. Demand evidence is captured at generation time.
- **C Triple intersection:** rare dataset (>1TB) × non-obvious technique × specific buyer who already spends money on the outcome.
- **D Static-incumbent verticals:** verticals whose dominant software vendors ship no AI/data features (check their sites); the product = the capability the incumbent lacks, sold standalone.
- **A Gap mining:** unserved slices discovered inside iter1 verification evidence (e.g. OpenET has 6-week lag and no enforcement-grade reporting; incumbents serve sub-problems separately).
- **E Survivor strengthening:** C4 (find direct demand proof), C18 (reframe from "surge pricing" to inventory/yield analytics for death-care).

## Verification protocol (unchanged + stricter demand)
Adversarial web search per candidate: 3-5 refutation searches; verdicts A/B/C with URLs. B requires DIRECT spend evidence on same outcome. Any hard FAIL kills.

## Process notes
- Generation: haiku agents. Verification: sonnet agents with WebSearch. Fable: triage + final scoring only.
- Triage before verification saves ~4x verification cost; triage kill-rate iter1 was 82%, verification kill-rate 89% — expect ~1-2 finals per 100 raw. Budget iterations accordingly.
