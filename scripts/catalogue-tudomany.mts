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

const NAGY_KONYVEK = path.join(DIR, "nagy_konyvek");
const nk = (name: string) => path.join(NAGY_KONYVEK, name);

export const SCIENCE_BOOKS: CatalogueEntry[] = [
  {
    slug: "relativitas-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("relativitas_nagykonyve/A relativitas nagykonyve.pdf"),
    downloadName: "A-relativitas-nagykonyve.pdf",
    pages: 269,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "lapis",
    mark: "sun",

    titleHu: "A Relativitás Nagykönyve",
    titleEn: "The Great Book of Relativity",
    subtitleHu: "Mozgó órák, fénysebesség, görbült téridő, fekete lyukak",
    subtitleEn: "Moving clocks, the speed of light, curved spacetime, black holes",
    coverTitle: "A Relativitás Nagykönyve",
    coverSubtitle: "Einstein és az előzmények",

    blurbHu:
      "Galileitől és Newtontól az éter bukásán, Michelson–Morleyn, Lorentzen és Poincarén át az 1905-ös csodaévig — majd idődilatáció, E = mc², Minkowski téridő, az ikerparadoxon, az ekvivalencia elve, görbült téridő, GPS, gravitációs hullámok, fekete lyukak és a táguló univerzum. Tizennyolc fejezet, kétszáz feletti alfejezet.",
    blurbEn:
      "From Galileo and Newton through the collapse of the ether, Michelson–Morley, Lorentz and Poincaré to the miracle year of 1905 — then time dilation, E = mc², Minkowski spacetime, the twin paradox, the equivalence principle, curved spacetime, GPS, gravitational waves, black holes and the expanding universe. Eighteen chapters, over two hundred sections.",

    descriptionHu: `A relativitásról szóló könyvek két hibába szoktak esni: vagy képletet zúdítanak az olvasóra, vagy annyira elkenik, hogy a végén semmi nem marad belőle. Ez a kötet **a kérdéssel kezd, amelyből minden következik**, és onnan építkezik — gondolatkísérletekkel, mérésekkel, történettel.

Az első fejezetben ott van **a legnagyobb tévhitek előre tisztázva**, egy útmutató arról, **hogyan gondolkodj a gondolatkísérletekről**, és **tizenkét szám, amit érdemes fejben tartani**. Meg az, hogy **mire számíts és mire ne**.

**Az előzmények.** Galilei hajójának gyomra, az inerciarendszer, a Galilei-transzformáció, Newton abszolút tere és a **vödör, amely kétszáz évre feladta a leckét** — Leibniz, Berkeley és Mach kritikájával. Az első repedés: az elektromosság. És a tisztességes kérdés, **mit tartunk meg Newtontól**.

**A fény.** Van-e egyáltalán sebessége? Rømer a Jupiter holdjaival 1676-ban, Bradley aberrációja, Fizeau fogaskereke, Foucault forgótükre, Maxwell négy egyenlete — a fénysebesség mint **egységdefiníció** és mint **információs korlát**.

**Az éter bukása.** Michelson interferométere, az 1887-es kísérlet, a mentési kísérletek, FitzGerald ötlete, Lorentz teljes apparátusa, és **Poincaré, aki a legközelebb jutott**. Külön alfejezet arról, **mit tanít a bukás a tudományról**.

**Einstein és 1905.** Az iránytű, a rossz diák mítosza, a berni szabadalmi hivatal, a csodaév, Besso és az áttörés — és az **Einstein-mítosz** maga.

Innen a speciális elmélet teljes gépezete: idődilatáció, hosszkontrakció, **az egyidejűség vége**, Doppler és vöröseltolódás, **E = mc²** — a kötési energiától a maghasadáson és a fúzión át odáig, hogy **honnan jön a tömegünk**. Majd **Minkowski** geometriája: az esemény, a téridő-intervallum, a fénykúp, a metrika mint a geometria kódja.

**A paradoxonok** egy teljes fejezetben: az ikerparadoxon Doppler-számolással, a létra és a csűr, ami gyorsabbnak *látszik* a fénynél, **miért tilos a fénysebesség túllépése**, és lehetséges-e az időutazás.

**Az ekvivalencia elve** — „a legboldogabb gondolat" —, **Eötvös Loránd torziós ingájával**, a gravitációs időlassulással és a fény elhajlásával. Azután az **általános elmélet**: mit jelent, hogy a tér görbült, Riemann geometriája, a metrikus tenzor, a geodetikusok.

A záró fejezetek a következmények: **GPS**, gravitációs hullámok, fekete lyukak, táguló univerzum.

269 oldal, tizennyolc fejezet. Matematika annyi, amennyi elkerülhetetlen — de egy sem úgy, hogy ne mondaná meg, mit jelent.`,
    descriptionEn: `Books on relativity tend to fall into one of two traps: they bury the reader in formulas, or they smooth everything over until nothing is left. This volume starts with **the question from which everything follows** and builds from there — through thought experiments, measurements and history.

The first chapter clears **the biggest misconceptions up front**, offers a guide to **how to think about thought experiments**, and gives **twelve numbers worth keeping in your head**. Along with what to expect, and what not to.

**The background.** The hold of Galileo's ship, inertial frames, the Galilean transformation, Newton's absolute space and **the bucket that set a two-hundred-year problem** — with the criticism of Leibniz, Berkeley and Mach. The first crack: electricity. And the honest question of **what we keep from Newton**.

**Light.** Does it even have a speed? Rømer with Jupiter's moons in 1676, Bradley's aberration, Fizeau's toothed wheel, Foucault's rotating mirror, Maxwell's four equations — the speed of light as a **definition of units** and as an **information limit**.

**The fall of the ether.** Michelson's interferometer, the 1887 experiment, the rescue attempts, FitzGerald's idea, Lorentz's full apparatus, and **Poincaré, who came closest**. With a section on **what the collapse teaches about science**.

**Einstein and 1905.** The compass, the myth of the bad student, the patent office in Bern, the miracle year, Besso and the breakthrough — and the **Einstein myth** itself.

From there the full machinery of the special theory: time dilation, length contraction, **the end of simultaneity**, Doppler and redshift, **E = mc²** — from binding energy through fission and fusion to **where our mass comes from**. Then **Minkowski's** geometry: the event, the spacetime interval, the light cone, the metric as the code of geometry.

**The paradoxes** get a chapter of their own: the twin paradox worked through with Doppler, the ladder and the barn, what only *appears* faster than light, **why the speed of light cannot be exceeded**, and whether time travel is possible.

**The equivalence principle** — "the happiest thought" — with **Loránd Eötvös's torsion balance**, gravitational time dilation and the bending of light. Then the **general theory**: what curved space means, Riemann's geometry, the metric tensor, geodesics.

The closing chapters are the consequences: **GPS**, gravitational waves, black holes, the expanding universe.

269 pages, eighteen chapters. As much mathematics as is unavoidable — and none of it without saying what it means.`,
  },
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

    extraFiles: [
      {
        file: f("Production_AI_Engineering_EN.epub"),
        downloadName: "Production-AI-Engineering-EN.epub",
        format: "EPUB",
        locale: "EN",
        contentType: "application/epub+zip",
      },
    ],

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
