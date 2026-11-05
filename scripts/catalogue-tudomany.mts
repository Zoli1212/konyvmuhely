/**
 * The science shelf.
 *
 * Nothing to do with the rest of the catalogue except the author — which is
 * exactly why it has a shelf of its own rather than sitting among the
 * handbooks.
 */
import path from "node:path";

import type { CatalogueEntry } from "./catalogue.mts";

const DIR = "c:\\Users\\mzolt\\Desktop\\ClaudProjects";
const f = (name: string) => path.join(DIR, name);

const AUTHOR = "Molnár Zoltán";

export const SCIENCE_BOOKS: CatalogueEntry[] = [
  {
    slug: "production-ai-engineering",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("Production_AI_Engineering.pdf"),
    downloadName: "Production-AI-Engineering.pdf",
    pages: 2661,
    priceHuf: 14990,
    author: AUTHOR,
    series: "Éles üzemi architektúra",
    category: "SCIENCE",
    featured: true,
    accent: "lapis",
    mark: "triple",

    titleHu: "Production AI Engineering",
    titleEn: "Production AI Engineering",
    subtitleHu: "Éles üzemű AI-rendszerek tervezése, építése és üzemeltetése",
    subtitleEn: "Designing, building and running AI systems in production",
    coverTitle: "Production AI Engineering",
    coverSubtitle: "Nyolc sáv · 160 fejezet",

    blurbHu:
      "A Pythontól és a modellektől az ágensekig, a RAG-ig, a GPU-infrastruktúráig, az evalokig és a biztonságos éles üzemig. Nyolc sáv, 160 fejezet, 2661 oldal — nem API-dokumentáció és nem gyorstalpaló, hanem mérnöki szakkönyv.",
    blurbEn:
      "From Python and models to agents, RAG, GPU infrastructure, evals and secure production operation. Eight tracks, 160 chapters, 2,661 pages — neither API documentation nor a crash course, but an engineering handbook.",

    descriptionHu: `A legtöbb AI-tananyag ugyanabban a hibában marad meg: a prototípusok világában. Egy tizenöt soros Python-szkript egy notebookban, amely meghív egy LLM API-t, elhiteti a fejlesztővel, hogy működő szoftvert épített. Éles üzemben ez azonnal összeomlik, és a könyv ezzel a négy ponttal kezdi.

**A determinizmus hiánya.** A hagyományos szoftver determinisztikus állapotgép, az LLM sztochasztikus rendszer. Hogyan garantálsz SLA-t, tranzakciót és sémahelyességet egy olyan komponens mellett, amely hallucinálhat vagy strukturálatlan választ adhat?

**Késleltetés.** Egy mikroszerviz 10–50 ms alatt válaszol, egy összetett RAG-futószalag 800 ms-tól harminc másodpercig. Ez alapjaiban kérdőjelezi meg a szinkron HTTP-kezelést, a szálkezelést és a connection poolingot.

**GPU és költség.** A VRAM drága és véges. A naiv inference memóriaszivárgáshoz, OOM-hibákhoz és kezelhetetlen felhőszámlákhoz vezet.

**Biztonság.** Amikor a modell eszközt kap a kezébe — SQL-hozzáférést, fájlrendszert, bash terminált —, az SQL injection és az XSS mellé belép a prompt injection, az indirekt jailbreak és a confused-deputy támadás.

A könyv **nyolc sávra** tagolódik, egymásra épülve, de önállóan is olvashatóan.

**1. Python AI-mérnökség** — éles üzemi Python, aszinkronitás, NumPy, PyTorch belsők, FastAPI az útválasztástól a streamelésig, perzisztencia, ágens- és MCP-szolgáltatások, tesztelés és megfigyelhetőség.

**2. Adatmérnökség** — SQL és PostgreSQL éles üzemben, lekérdezés-teljesítmény, Parquet és Arrow, Polars, objektumtárolás, ETL, deduplikáció, szintetikus adat, adathalmaz-verziózás és adatkormányzás.

**3. Modellmérnökség** — a GPU gondolati modellje, a transformer architektúrája, figyelem Q/K/V-től a GQA-ig, tokenizálás, SFT, LoRA és QLoRA, DPO, elosztott tanítás, kvantálás, vLLM és SGLang, a következtetés teljesítménymérnöksége.

**4. Claude-mérnökség** — Messages API, eszközfuttatás, streamelés, MCP protokoll.

**5. Harness-mérnökség** — LangGraph, állapot, checkpointing, ember a hurokban, több ágens.

**6. RAG és keresés** — sűrű és ritka hibrid keresés, darabolás, újrarangsorolás.

**7. AI-infrastruktúra** — Linux, GPU-virtualizáció, Modal, RunPod, Replicate.

**8. Megbízhatóság, evalok és biztonság** — guardrailek, nyomkövetés, red teaming, SRE.

Minden sáv **záróprojekttel** végződik: éles üzemi AI API, adatplatform, saját modellfutószalag.

2661 oldal, 160 fejezet. Magyar nyelven, az angol szakkifejezések megtartásával — mert a dokumentációt úgyis angolul fogod olvasni.`,
    descriptionEn: `Most AI teaching material stays stuck in the same place: the world of prototypes. A fifteen-line Python script in a notebook that calls an LLM API convinces the developer they have built working software. In production that collapses immediately, and the book opens with the four reasons why.

**No determinism.** Conventional software is a deterministic state machine; an LLM is a stochastic system. How do you guarantee an SLA, a transaction and schema correctness alongside a component that can hallucinate or return unstructured output?

**Latency.** A microservice answers in 10–50 ms; a complex RAG pipeline takes anywhere from 800 ms to thirty seconds. That calls synchronous HTTP handling, threading and connection pooling into question at the root.

**GPU and cost.** VRAM is expensive and finite. Naive inference leads to memory leaks, OOM errors and unmanageable cloud bills.

**Security.** Once a model is handed tools — SQL access, a filesystem, a bash terminal — prompt injection, indirect jailbreaks and confused-deputy attacks join SQL injection and XSS.

The book is organised into **eight tracks**, each building on the last but readable on its own.

**1. Python AI engineering** — production Python, concurrency, NumPy, PyTorch internals, FastAPI from routing to streaming, persistence, agent and MCP services, testing and observability.

**2. Data engineering** — SQL and PostgreSQL in production, query performance, Parquet and Arrow, Polars, object storage, ETL, deduplication, synthetic data, dataset versioning and governance.

**3. Model engineering** — the GPU mental model, transformer architecture, attention from Q/K/V to GQA, tokenisation, SFT, LoRA and QLoRA, DPO, distributed training, quantisation, vLLM and SGLang, inference performance engineering.

**4. Claude engineering** — the Messages API, tool runtime, streaming, the MCP protocol.

**5. Harness engineering** — LangGraph, state, checkpointing, human in the loop, multi-agent systems.

**6. RAG and search** — dense and sparse hybrid retrieval, chunking, reranking.

**7. AI infrastructure** — Linux, GPU virtualisation, Modal, RunPod, Replicate.

**8. Reliability, evals and security** — guardrails, tracing, red teaming, SRE.

Every track closes with a **capstone project**: a production AI API, a data platform, a model pipeline of your own.

2,661 pages, 160 chapters. Written in Hungarian, keeping the English technical vocabulary — because the documentation you will be reading is in English anyway.`,
  },
];
