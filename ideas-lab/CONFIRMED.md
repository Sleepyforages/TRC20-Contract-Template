# CONFIRMED IDEAS (target: 10)

## ✅ 1. WikiPulse — Wikipedia revision-velocity emerging-tech signal feed
**Offer:** Cheap subscription API/dashboard detecting emerging technologies weeks early from Wikipedia revision-history velocity, article-creation and contributor-influx signals (TB-scale dumps, continuously updated). Positioned as a supplementary raw-signal feed that plugs into existing workflows (CB Insights, Beacon), not a platform.
**Buyer:** Corporate-innovation/strategy scouts, solo-GP VCs, CVC analysts — the segment that buys narrow point-signal tools rather than $50-265K/yr platforms.
**Criteria:**
- Novel: verified twice — no product uses Wikipedia edit-velocity (closest: academic pageview studies; SignalFire Beacon/CB Insights don't list Wikipedia as source; GitDealFlow checked — it's GitHub-commit-velocity only, its /wikipedia page is a citation helper).
- Tech: AI (NLP clustering, spike detection).
- Commercialisable: subscription feed; validated product shape (Evertrace, GitDealFlow monetize single-signal feeds).
- No R&D: Wikipedia dumps public + standard stream processing + embedding/clustering.
- Demand: PROVEN at category level — CB Insights ~$47K median/yr, Quid (2+PB trend platform), Gartner Hype Cycle subscriptions, Valuer.ai; narrow-feed buyers demonstrably exist.
- Bigdata: full Wikipedia revision history >20TB uncompressed (meets >1TB); HPC useful for backfill embedding runs.
**Evidence:** easyvc.ai/vs/cb-insights-pricing, quid.com, signalfire.com/beacon-ai, evertrace.ai, signals.gitdealflow.com/wikipedia (checked, not a competitor), journals.plos.org (academic only).

## ✅ 2. PlotFolio — portfolio analytics for death-care roll-ups
**Offer:** Cross-portfolio analytics for private-equity consolidators of cemeteries/funeral homes: inventory depletion forecasting, pre-need sales optimization, land-use planning, acquisition due-diligence benchmarks — the layer generic PE tools (iLEVEL/eFront) and operational software (PlotBox/CemSites) both miss. B2B to the roll-up, NOT pricing grief purchases (ethical reframe from original dynamic-pricing idea).
**Buyer:** PE firms and consolidators (SCI, Carriage Services, Axar/StoneMor, Foundation Partners, Rosewood/Milestone) — deathcare M&A at a two-decade high; SCI alone spent $181M on 32 properties in 2024.
**Criteria:**
- Novel: no portfolio-level death-care analytics vendor found; PlotBox/CemSites are single-site operational tools.
- Tech: AI (demand forecasting, GIS analytics, LSTM mortality/migration models).
- Commercialisable: per-property annual SaaS to well-capitalized PE buyers.
- No R&D: standard forecasting + GIS + document extraction on proven components.
- Demand: PROVEN — active roll-ups documented (Grata PE Playbook, ION Analytics, Bisnow, KFF); they currently use generic PE monitoring + per-site ops software (a manual/inferior alternative).
- Bigdata: TB-scale across portfolio — millions of plot records, scanned deeds, GIS maps, LiDAR/GPR cemetery surveys (StoneMor alone: 76k+ unsold spaces; BillionGraves: hundreds of millions of records industry-wide).
**Evidence:** grata.com death-services playbook, ionanalytics.com deathcare M&A, bisnow.com PE funeral homes, plotbox.com, cemsites.com, sec.gov StoneMor 10-K.

## ✅ 3. LienLift — self-storage lien-auction recovery optimization
**Offer:** Per-unit auction price prediction (CV on unit photos + hedonic models on auction outcomes) plus reserve/timing/channel recommendations, lifting operators' documented 39¢-on-the-dollar lien recovery. Optionally extends to default-risk early warning.
**Buyer:** Self-storage operators/REITs (18,500+ facilities run 40k+ paid lien auctions/month via StorageTreasures alone).
**Criteria:**
- Novel: no per-unit auction price-prediction product exists; industry press explicitly frames it as an unsolved "significant opportunity for AI-powered price prediction" (ISS/OpenTech). Ai Lean = adjacent delinquency workflow automation only.
- Tech: AI (CV on unit photos, hedonic/GBM pricing).
- Commercialisable: SaaS or per-auction fee; recovery uplift directly measurable in dollars.
- No R&D: standard CV + pricing models on existing auction-outcome data (orchestrator override of verifier's over-strict reading; hedonic pricing is textbook econometrics).
- Demand: PROVEN — documented 39% recovery-rate pain; $8.8M+ recovered rent via marketplace; Ai Lean raised $5M for the adjacent problem, proving spend in the category.
- Bigdata: auction photo corpora + outcomes + lease records across tens of thousands of facilities (TB-scale image data).
**Evidence:** opentechalliance.com 39¢ recovery article, ai-lean.com, insideselfstorage.com Ai Lean $5M, greyborneco.com.

## ✅ 4. AquiferIQ — data-driven well-siting for municipal & irrigation water
**Offer:** ML yield/depth prediction maps and site-screening reports built from state digitized water-well drilling-log databases + USGS aquifer/terrain layers, replacing (or de-risking) $50-100k test wells and five-figure hydrogeology consulting engagements. V1 scoped to states with digital well-log DBs (CA DWR WCRs, TX SDR, CO, KS...); scanned-archive states added later via mature document-AI.
**Buyer:** Municipal water authorities, irrigation districts, well-drilling contractors, rural developers.
**Criteria:**
- Novel: no commercial ML well-siting product in the US (MapAid/Databricks is a nonprofit East-Africa humanitarian tool; Leapfrog/GMS are expert modeling tools; Wellntel is hardware sensors).
- Tech: AI (spatial ML interpolation/prediction).
- Commercialisable: per-report or subscription; buyers already procure equivalent outputs from consultants.
- No R&D: standard spatial ML on already-digitized public data (v1 scoping removes the OCR mountain).
- Demand: PROVEN with direct public-sector spend evidence — $96,850 well-siting consultant contract in a district board doc; ENGEO paid siting proposals; $50-100k test wells routine.
- Bigdata: millions of well logs + LAS files + statewide aquifer rasters + 3DEP terrain derivatives = TB-scale; HPC useful for statewide interpolation runs.
**Evidence:** ncsd.ca.gov board doc D-4, sweetwater.org ENGEO proposal, startuphub.ai MapAid, wellntel.com, seequent.com.

---
Slots remaining: 6

## Parked (novel but demand unproven — candidates for reframing)
- W14 ObituaryMind: obituary-volume demand forecasting for death-care suppliers. No evidence anyone buys forecasting in this vertical.
- W18 LivestockAI: auction-house price forecasting. Data requires partnerships; auction houses' willingness to pay unproven.
- C18 lineage → became CONFIRMED #2 (PlotFolio).
