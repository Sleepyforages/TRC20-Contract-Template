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

## ✅ 5. RowGuard — automated easement-conflict detection for utility/pipeline rights-of-way
**Offer:** NLP parses county deed/easement records into geometry (metes-and-bounds → polygons) and overlays them on a utility's own GIS to pre-flag encroachments, conflicting easements and defective title BEFORE construction/acquisition — replacing manual per-project ROW conflict research.
**Buyer:** Utilities, pipeline operators, renewables developers, ROW service firms. ROW acquisition runs 5–10% of total pipeline project cost; defective easements are a documented cause of delays/overruns (e.g. Trans Mountain ~$86M).
**Criteria:**
- Novel: incumbent ROW platforms (Pandell LandWorks, Quorum Land, Irth geoAMPS, Landboss) are records/workflow systems — none do automated conflict detection from deed text vs GIS. (Fragile: DataTrace/First American hold building blocks — speed matters.)
- Tech: AI (LLM/OCR deed parsing, geospatial analysis).
- Commercialisable: per-corridor/project pricing or SaaS to ROW departments.
- No R&D: deed-text→geometry is commercially proven (DeedPlotter AI, Deed Reader Pro, Acres DeedAI); polygon-intersection is standard GIS.
- Demand: PROVEN — ROW conflict research is paid per-project professional work today; cost-overrun evidence documented.
- Bigdata: development phase ingests multi-county scanned deed/easement archives (millions of page images, TB-scale); nationwide title plants hold ~8B images.
**Evidence:** pandell.com, quorumsoftware.com, geoamps.com, deedplotter.ai, get.acres.com/deedai, datatracetitle.com, pipelineequities.com, globalnews.ca (Trans Mountain).

## ✅ 6. ParcelPast — per-parcel historical-imagery change-detection reports for title & environmental due diligence
**Offer:** Automated AI change-detection over georeferenced historical aerial imagery producing per-parcel reports (structures appearing/disappearing, encroachments, undisclosed additions, fill/dumping activity across decades) for title insurers, real-estate attorneys and Phase I ESA consultants. V1 built entirely on public-domain, already-georeferenced imagery: USGS DOQ (1987-2006) + NAIP (2003-present) = ~38 years continuous national coverage; state public-domain archives extend depth; NETR's 1,000TB archive is an upside licensing negotiation, not a dependency.
**Buyer:** Phase I ESA consultants (historical aerial review is MANDATORY under ASTM E1527-21/EPA for CERCLA liability protection — recurring, standards-driven demand; EDR bundles ~$375/report inside $2.2-4k engagements), title insurers, attorneys (ALTA surveys $3-15k).
**Criteria:**
- Novel: verified twice — no automated decades-deep per-parcel product (NETR = manual viewer; LightBox/EDR = PDFs for manual review; CAPE Analytics = recent imagery for insurance carriers; Agniforge = corridor drone/LiDAR).
- Tech: AI (CV change detection).
- Commercialisable: per-parcel report pricing riding existing ESA/title report workflows.
- No R&D: change detection on pre-georeferenced imagery is productized CV (CAPE/Ecopia run it at scale); cross-decade QA is engineering.
- Demand: PROVEN and standards-mandated (ASTM E1527-21).
- Bigdata: multi-TB public imagery archives (NAIP alone is hundreds of TB); HPC for national backfill processing.
**Evidence:** vonbriesen.com ASTM requirement, lightboxre.com EDR product, capeanalytics.com, historicaerials.com/terms (ToS constraint documented), usgs.gov DOQ coverage, arXiv 2112.04255.

## ✅ 7. MitigationWatch — imagery-based monitoring & reporting automation for wetland/stream mitigation banks
**Offer:** Hybrid remote-sensing service for mitigation banks' mandatory 5-10 year USACE monitoring commitments: drone/satellite time-series tracks vegetation establishment, hydrology indicators and encroachment between required field visits, auto-assembles district-compliant annual monitoring reports from imagery + field data. Scoped as augmentation (flag problems early, automate reporting), not field-visit replacement — so no policy change needed.
**Buyer:** Mitigation bankers (NMBA industry; hundreds of active banks), in-lieu-fee programs, DOTs with permittee-responsible mitigation — all pay consultants thousands per site-year for compulsory monitoring reports.
**Criteria:**
- Novel: no commercial product automates mitigation-bank monitoring analytics/reporting (Ecobot = field-data forms SaaS, explicitly field-centric; RES flies drones in-house for its own banks — practice, not product; WSP = general UAV services; ERDC "drone truthing" = research).
- Tech: AI (multispectral vegetation classification, change detection).
- Commercialisable: per-site-year subscription riding mandatory recurring spend.
- No R&D: NDVI/multispectral classification and change detection are mature techniques from ag/forestry.
- Demand: PROVEN structurally — monitoring reports are compulsory under USACE mitigation banking instruments for 5-10 years; consultant spend documented.
- Bigdata: multi-year drone orthomosaics across a portfolio of hundreds of banks = multi-TB; satellite baseline (NAIP/Sentinel) at TB-scale.
**Evidence:** ecobot.com/monitoring, res.us (annual drone flights), erdc.usace.army.mil drone-truthing, USACE district monitoring templates (mvp/saw.usace.army.mil).

## ✅ 8. RailTitle — the digital rail-corridor title layer (ICC valuation maps, digitized + AI-indexed)
**Offer:** Digitize, georeference and AI-index the ICC railroad valuation archive (RG 134: ~125,000 right-of-way/tract maps + valuation schedules, 1915-1920, largely undigitized at the National Archives) into the authoritative national rail-corridor title/ROW layer; sold per-case/per-corridor to Trails Act takings attorneys, railroads, fiber/telecom corridor lessees, utilities needing crossing agreements, DOTs and title insurers. Classic schlep: tedious capital digitization work nobody wants — which is why it's still open.
**Buyer:** Active Trails Act plaintiffs' bar (Stewart Wald & McCulley et al. — every case needs valuation-map research); corridor commerce (fiber, crossings); today all buy manual per-case NARA research from boutiques (TRG, Westmoreland Research).
**Criteria:**
- Novel: no product or national-intent project exists. TRG/Westmoreland = manual per-case retrieval services (demand evidence, per AquiferIQ/ParcelPast precedent — manual consultants ≠ product competitors). MnDOT (one state, internal records purpose), ELHS/Redlands (one railroad, heritage), UConn (academic subset), NARA crowdtagging = partial, different-purpose efforts with no commercial deliverable or national mandate — distinguished from CATALOG/AgTile-US kill precedents which had same-deliverable national intent. Verifier concedes the national+AI+productized bundle "looks genuinely open"; orchestrator override documented.
- Tech: AI (map OCR/feature extraction, georeferencing automation, entity-linked index).
- Commercialisable: per-case litigation packages + corridor subscriptions.
- No R&D: georeferencing this exact map series is empirically demonstrated (MnDOT, ELHS ArcGIS projects); scanning at NARA is permitted routine practice.
- Demand: PROVEN — named litigation industry requiring exactly this research; commercial research boutiques monetize it manually today; STB NITU pipeline generates new cases continuously.
- Bigdata: ~11,000 cubic feet; 125k large-format archival scans (100-300MB each) + schedules = multi-TB document-image archive.
**Evidence:** taylorresearchgroup.com, westmorelandresearch.org, dot.state.mn.us/surveying/railroad.html, inspire.redlands.edu, swslegal.com, archives.gov RG 134.

## ✅ 9. CornerVault — national AI-indexed PLSS corner-record & monument tie-sheet archive
**Offer:** Aggregates, OCRs and map-indexes the millions of survey corner records/monument tie sheets currently fragmented across county surveyor offices, registers of deeds and inconsistent state portals in ~30 PLSS states; subscription search for land surveyors (per-corner evidence packets: sketches, photos, accessories, retracement history), per-search for title/engineering users.
**Buyer:** 40k+ US land surveyors who today burn hours per boundary job hunting corner evidence county-by-county (solo practitioners first — stair-step tactic); title/engineering firms second.
**Criteria:**
- Novel: no national aggregator exists (free or commercial). Closest: cp-db.com — a SINGLE-STATE (Colorado) subscription monument-record product = demand validation, not a national killer; Indiana's official statewide attempt covers 5/92 counties; Arkansas/Washington systems are single-state or different deliverables (geodetic control ≠ tie sheets); BLM GLO = 1800s plats, different corpus.
- Tech: AI (OCR/CV indexing of heterogeneous scanned sheets, geo-linking to PLSS fabric).
- Commercialisable: proven subscription model at state level (cp-db.com); national coverage is the product.
- No R&D: standard document AI + PLSS georeferencing (BLM CadNSDI fabric exists as spine).
- Demand: PROVEN — surveyors pay cp-db.com today; county research hours/fees are the manual alternative; corner-record filing is statutory in PLSS states (recurring corpus growth).
- Bigdata: millions of sheets (1-2MB each) → single-digit-TB document-image archive, honestly >1TB; county-sourcing schlep is the moat.
**Evidence:** cp-db.com, maps.indiana.edu PLSS tie cards (5/92), gis.arkansas.gov, wsdot.wa.gov/monument, glorecords.blm.gov, sco.wisc.edu PLSS forum.

## ✅ 10. StrikeMap — NEXRAD-driven analytics for FAA Wildlife Hazard Assessments
**Offer:** Analytics platform that fuses per-airport NEXRAD-derived bird-activity climatology (published aeroecology methods), FAA Wildlife Strike Database analytics and land-use/attractant mapping into the quantitative sections of Part 139 Wildlife Hazard Assessments, Wildlife Hazard Site Visits and annual WHMP reviews — sold to the qualified airport wildlife biologists who produce them (USDA APHIS under cost-recovery agreements; consultants like Loomacres) and to Part 139 airports directly.
**Buyer:** WHA producers and 500+ certificated airports. Documented spend: Loomacres WHA+WHMP contract $65,140 (Rancho Cordova); APHIS assisted 872 airports/airbases (FY2018, 297 staff-years, ~52% cooperator-funded).
**Criteria:**
- Novel: no product or consultant workflow fuses NEXRAD climatology into WHA deliverables — regulatory standard (AC 150/5200-38) is 12-month field survey + strike-DB lookup. AHAS = real-time tactical avoidance tool (different deliverable); ProDiGIQ = strike-logging/record-keeping; Robin/DeTect = detection hardware; academic aeroecology labs = research, not WHA content providers. Verified twice (initial + refined-calibration re-verification).
- Tech: AI (radar bioscatter classification, climatology modeling — published BirdCast-class methods).
- Commercialisable: per-WHA analytics packages + airport subscriptions for continuous WHMP review support.
- No R&D: NEXRAD ornithology methods are published and run in production (BirdCast); productization is engineering.
- Demand: PROVEN — WHAs are federally mandated (14 CFR 139.337), recurring, and purchased today at five-figure price points from manual providers.
- Bigdata: NEXRAD Level II archive ~250-270TB compressed (~1PB uncompressed); airport-relevant climatology slices in tens-of-TB; cloud-parallel processing precedent established.
**Evidence:** faa.gov AC 150/5200-38, law.cornell.edu 14 CFR 139.337, usahas.com (different deliverable), prodigiq.com, aphis.usda.gov airports, rcgov.org Loomacres contract, registry.opendata.aws NEXRAD.

---
# 🏁 GOAL ACHIEVED: 10/10 ideas confirmed with high confidence.

## Killed in iter7 (additional)
- MineMapIQ: PA/IL/OH free georeferenced mine viewers = same deliverable at buyer-relevant scale; OSMRE NMMR modernization (319k TIFFs/31TB) is the federal same-deliverable project. Honest criterion kill.

## Killed in iter6 (additional)
- OrphanFinder: DOE CATALOG consortium = publicly known PROJECT addressing same issue (U-Net on historical topo maps, 1,301 candidate wells found, explicit at-scale deployment mandate); Zefiro Methane commercial adjacent. Criteria include "projects" — consistent with ArchScreen precedent → kill despite strong demand ($4.7B IIJA).

## Killed in iter5
- TowRecover (towed-vehicle auction analytics): IAA Vehicle Value/ACV MAX = same service, same asset class, sibling channel; Autura owns distribution. Strict novelty kill.

## Parked (novel but demand unproven — candidates for reframing)
- W14 ObituaryMind: obituary-volume demand forecasting for death-care suppliers. No evidence anyone buys forecasting in this vertical.
- W18 LivestockAI: auction-house price forecasting. Data requires partnerships; auction houses' willingness to pay unproven.
- C18 lineage → became CONFIRMED #2 (PlotFolio).
