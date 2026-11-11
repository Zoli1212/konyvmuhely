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
    slug: "ai-architekturak-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("ai_architekturak_nagykonyve/Az AI-architekturak nagykonyve.pdf"),
    downloadName: "Az-AI-architekturak-nagykonyve.pdf",
    pages: 230,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "lapis",
    mark: "triple",

    titleHu: "Az AI-architektúrák Nagykönyve",
    titleEn: "The Great Book of AI Architecture",
    subtitleHu: "Követelménytől a kompromisszumig — és hogyan vonjuk vissza",
    subtitleEn: "From requirement to trade-off — and how to roll it back",
    coverTitle: "Az AI-architektúrák Nagykönyve",
    coverSubtitle: "Tervezés, kényszerek, üzem",

    blurbHu:
      "A tervezés módszere tizennégy lépésben, kapacitásbecslés, döntésnapló; modellhívás, átjáró, visszakeresés, ágensréteg, sor, állapot; hét alapminta, streamelés, többbérlősség, emberi jóváhagyás; késleltetés- és költségkényszer, adatszuverenitás, bizalmi határok; a négy tengely, hibatűrés, megfigyelhetőség. Négy végigtervezett rendszer, huszonhét fejezet.",
    blurbEn:
      "A design method in fourteen steps, capacity estimation, a decision log; model calls, gateway, retrieval, agent layer, queues, state; seven base patterns, streaming, multi-tenancy, human approval; latency and cost constraints, data sovereignty, trust boundaries; the four axes, fault tolerance, observability. Four systems designed end to end, twenty-seven chapters.",

    descriptionHu: `Az alcím a lényeg: **követelménytől a kompromisszumig — és hogyan vonjuk vissza.** Ez a kötet nem diagramgyűjtemény és nem interjúfelkészítő. Azzal foglalkozik, ami a diagram megrajzolása után jön: mi történik, ha a rendszer felét sikerül, mibe kerül egy kérés belülről, és mit lehet belőle **visszacsinálni**.

Az első fejezet kimondja, **miben más** egy AI-rendszer architektúrája. Hat tulajdonság tol el minden döntést, és négy közülük ritkán kerül elő tervezéskor: a **nemdeterminizmus** és ami belőle következik; hogy a **hibák szorzódnak és korreláltak**; hogy a **költség a kérés belsejében van**, nem a gépek számában; és hogy a **késleltetésnek alsó határa van**, amit semmilyen gyorsítótár nem visz a nulla felé. Van egy alfejezet **„A megtévesztő diagram"** címmel, és egy arról, **mit tudsz visszavonni**.

**A tervezés módszere** nem elvi ajánlás, hanem tizennégy végigvitt lépés: a feladat, a használó, a siker; a **minőségi célérték** kimondása; a nemfunkcionális kényszerek; a **tiltólista** — mit nem csinál a rendszer —; a legegyszerűbb megoldás próbája; az adatút és a bizalmi határok; **mi történik, ha félig sikerül**; a mérési terv; mit cserélünk el mire; és a **visszavonási terv**. Mellette **kapacitásbecslés**: a hat szám, tokenköltségvetés kérésenként, csúcs és átlag négy külön számmal, és a **KV-gyorsítótár mint a tényleges korlát**.

**Az építőelemek** rétegenként: a modellhívás mint architekturális elem, a **modellátjáró**, a visszakeresési réteg, az **ágensréteg**, a sor, a folyam és az **idempotencia**, végül az állapot négy fajtája — munkamenet, előzmény, feladat, memória.

**A minták:** hét alapminta **és a határaik**, szinkron, aszinkron és streamelő működés, **többbérlősség**, és az **emberi jóváhagyás a rendszerben** — nem mint felületi elem, hanem mint architekturális döntés.

**A kényszerek**, amelyekre a legtöbb terv ráfut: több modell és több szolgáltató, a **késleltetés költségvetése**, a **költség mint architektúra**, az adat szuverenitása, megőrzése és megfelelése, végül a **bizalmi határok és a hatáskör**.

**Az üzem:** a négy tengely kiadással és visszagörgetéssel, **hibatűrés, leromlás, kiesés**, és a megfigyelhetőségi architektúra.

Négy rendszer végig van tervezve a könyvben, a követelményektől a visszavonási tervig.

230 oldal, huszonhét fejezet.`,
    descriptionEn: `The subtitle is the point: **from requirement to trade-off — and how to roll it back.** This is not a diagram collection and not interview preparation. It deals with what comes after the diagram is drawn: what happens when half the system succeeds, what a request costs on the inside, and what can be **undone**.

The first chapter states **what is different** about the architecture of an AI system. Six properties shift every decision, and four of them rarely come up at design time: **non-determinism** and what follows from it; that **errors multiply and are correlated**; that **cost sits inside the request**, not in the machine count; and that **latency has a floor** no cache will push toward zero. There is a section called **"The misleading diagram"**, and another on **what you can actually roll back**.

**The design method** is not a set of principles but fourteen worked steps: the task, the user, success; stating the **quality target**; the non-functional constraints; the **do-not list** — what the system will not do; the test of the simplest solution; the data path and trust boundaries; **what happens when it half-succeeds**; the measurement plan; what is traded for what; and the **rollback plan**. Alongside it, **capacity estimation**: the six numbers, a token budget per request, peak and average as four separate figures, and **the KV cache as the real limit**.

**The building blocks**, layer by layer: the model call as an architectural element, the **model gateway**, the retrieval layer, the **agent layer**, queues, streams and **idempotency**, and finally the four kinds of state — session, history, task, memory.

**The patterns:** seven base patterns **and their limits**, synchronous, asynchronous and streaming operation, **multi-tenancy**, and **human approval inside the system** — as an architectural decision, not a UI element.

**The constraints** most designs run into: multiple models and providers, the **latency budget**, **cost as architecture**, data sovereignty, retention and compliance, and finally **trust boundaries and scope**.

**Operations:** the four axes with release and rollback, **fault tolerance, degradation, outage**, and observability architecture.

Four systems are designed end to end in the book, from requirements to rollback plan.

230 pages, twenty-seven chapters.`,
  },
  {
    slug: "langgraph-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("langgraph_nagykonyve/A LangGraph nagykonyve.pdf"),
    downloadName: "A-LangGraph-nagykonyve.pdf",
    pages: 201,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "lapis",
    mark: "knot",

    titleHu: "A LangGraph Nagykönyve",
    titleEn: "The Great Book of LangGraph",
    subtitleHu: "Ágensek gráffal — és ami a tutorial után jön",
    subtitleEn: "Agents as graphs — and what comes after the tutorial",
    coverTitle: "A LangGraph Nagykönyve",
    coverSubtitle: "Ágensek gráffal",

    blurbHu:
      "Miért gráf és miért nem lánc, a Pregel-modell, állapot és reducerek, csomópontok, élek, Command, párhuzamosság és map-reduce, algráfok, checkpointerek és időutazás, interrupt és emberi jóváhagyás, a store, streaming, ToolNode, a ReAct-ágens, RAG gráfban, felügyelő és csapat, funkcionális API, hibakezelés, kiértékelés, telepítés, költség — és amit a LangGraph nem old meg. Harminchárom fejezet.",
    blurbEn:
      "Why a graph and not a chain, the Pregel model, state and reducers, nodes, edges, Command, parallelism and map-reduce, subgraphs, checkpointers and time travel, interrupt and human approval, the store, streaming, ToolNode, the ReAct agent, RAG in a graph, supervisor and team, the functional API, error handling, evaluation, deployment, cost — and what LangGraph does not solve. Thirty-three chapters.",

    descriptionHu: `Az alcím mondja ki, mire megy: **ami a tutorial után jön**. A LangGraph bemutatói egy tízsoros ReAct-ágenssel végződnek, és onnantól az olvasó magára marad azzal, hogy mi történik, ha a hurok nem áll le, ha a futás félbeszakad, vagy ha valakinek jóvá kell hagynia egy lépést.

A könyv az **első döntésnél** kezd: miért gráf és **miért nem lánc**. A ciklus az, amit egy DAG nem tud, és minden más ebből következik. Rögtön ott van az is, **mit vesztünk a gráffal** — az ár —, és **mikor nem kell LangGraph**.

**A Pregel-modell**, amelyre az egész épül: szuperlépések, üzenetátadás, és hogy miért determinisztikus a párhuzamos végrehajtás.

**A gráf:** állapot és **reducerek**, csomópontok, élek, a **Command** — frissítés és irányítás egyszerre —, párhuzamosság, a **Send** és a **map-reduce** minta, végül az **algráfok**. Ez utóbbinál egy olyan csapda, ami a legtöbb kezdő rendszert megfekteti: a függvénybe csomagolt algráfban **az interrupt() nem folytatható a szülőn keresztül**, tehát a jóváhagyás nem működik.

**Állapot és idő** — innen lesz a keretrendszer több, mint egy for-ciklus. **Checkpointerek** és szálak, **időutazás** (visszalépés és elágazás), **interrupt és az emberi jóváhagyás**, a **store** és a hosszú távú memória, végül a **streaming** a maga öt módjával.

**Eszközök és minták:** a **ToolNode**, a **ReAct-ágens**, **RAG gráfban**, a **felügyelő-minta**, csapat és hálózat, az **átadás**, és a **funkcionális API** — amikor nem kell gráfot rajzolni.

**Üzem**, amiről a bemutatók hallgatnak: **hibakezelés és idempotencia** — mit szabad újrapróbálni és mit nem —, **LangSmith** és a megfigyelhetőség, **kiértékelés**, **telepítés**, **költség, késleltetés, gyorsítótár**.

Az utolsó rész a tisztesség próbája: **amit a LangGraph nem old meg**, és a **nyitott kérdések a verziósodrással** — mi stabil és mi mozog.

Minden fejezet **„a mai álláspont"** alfejezettel zárul.

201 oldal, harminchárom fejezet, 332 alfejezet. Nem referencia és nem gyorstalpaló: minden szabály abból, amiért így döntöttek.`,
    descriptionEn: `The subtitle says what it is after: **what comes after the tutorial**. LangGraph's introductions end with a ten-line ReAct agent, and from there the reader is on their own with what happens when the loop will not stop, when a run breaks off halfway, or when someone has to approve a step.

The book starts at the **first decision**: why a graph and **why not a chain**. The cycle is what a DAG cannot do, and everything else follows from it. It also states up front **what the graph costs** — and **when LangGraph is not needed**.

**The Pregel model** everything rests on: supersteps, message passing, and why parallel execution stays deterministic.

**The graph:** state and **reducers**, nodes, edges, **Command** — update and control in one — parallelism, **Send** and the **map-reduce** pattern, and finally **subgraphs**. There it covers the trap that sinks most beginners' systems: in a subgraph wrapped in a function, **interrupt() cannot be resumed through the parent**, so approval does not work.

**State and time** — this is where the framework becomes more than a for-loop. **Checkpointers** and threads, **time travel** (rewind and branch), **interrupt and human approval**, the **store** and long-term memory, and **streaming** with its five modes.

**Tools and patterns:** **ToolNode**, the **ReAct agent**, **RAG in a graph**, the **supervisor pattern**, team and network, **handoff**, and the **functional API** — for when you do not want to draw a graph at all.

**Operations**, which the tutorials pass over: **error handling and idempotency** — what may be retried and what may not — **LangSmith** and observability, **evaluation**, **deployment**, **cost, latency, caching**.

The closing part is the test of honesty: **what LangGraph does not solve**, and the **open questions with the version drift** — what is stable and what is moving.

Every chapter closes with a section called **"the current position"**.

201 pages, thirty-three chapters, 332 sections. Neither a reference nor a crash course: every rule derived from the decision behind it.`,
  },
  {
    slug: "robotika-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("robotika_nagykonyve/A robotika nagykonyve.pdf"),
    downloadName: "A-robotika-nagykonyve.pdf",
    pages: 234,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "copper",
    mark: "knot",

    titleHu: "A Robotika Nagykönyve",
    titleEn: "The Great Book of Robotics",
    subtitleHu: "Az automatáktól a tanuló gépekig",
    subtitleEn: "From automata to learning machines",
    coverTitle: "A Robotika Nagykönyve",
    coverSubtitle: "Mechanika, érzékelés, szabályozás, tanulás",

    blurbHu:
      "Hérón automatáitól Wiener kibernetikáján és az Unimate-en át a mai tanuló gépekig: kinematika és a Jacobi-mátrix, hajtások, lábak, kezek, érzékelők és pontfelhő, Kalman-szűrő, SLAM, PID és impedancia, A*, RRT, MPC, ROS, imitációs és megerősítéses tanulás, sim-to-real, látás-nyelv-cselekvés modellek. Harminckét fejezet.",
    blurbEn:
      "From Heron's automata through Wiener's cybernetics and the Unimate to today's learning machines: kinematics and the Jacobian, actuators, legs, hands, sensors and point clouds, the Kalman filter, SLAM, PID and impedance control, A*, RRT, MPC, ROS, imitation and reinforcement learning, sim-to-real, vision-language-action models. Thirty-two chapters.",

    descriptionHu: `A robotikáról szóló ismeretterjesztés két irányba szokott elcsúszni: vagy demóvideókat mutat, vagy képleteket. Ez a kötet **a Moravec-paradoxonnal** kezd — hogy a nehéznek hitt dolgok (sakk, logika) könnyűek a gépnek, a könnyűnek hittek (járás, fogás) pedig nehezek —, és ebből vezeti le, **miért nehéz a robotika**.

Az első fejezetben ott van az is, **mi nem robot**, **mit tud ma egy robot és mit nem**, és hogy **Asimov törvényei miért nem mérnöki eszközök**.

**A történet**, amely nélkül a mai megoldások önkényesnek látszanak. Hérón első programozható gépe, al-Dzsazari bütykös hengere, Vaucanson kacsája, **Kempelen Farkas** sakkozója és beszélőgépe, **Jacquard** — ahol a program elválik a géptől —, Babbage és Lovelace. Külön alfejezet arról, **miért nem lett robot a 19. században**.

**A kibernetika:** Watt gömbös szabályozója, Maxwell, a légvédelmi löveg, **Wiener 1948**, a frekvenciatartomány (Black, Nyquist, Bode), **Grey Walter teknősei** mint az első autonóm robotok — és hogy **miért tűnt el a kibernetika mint név**.

Azután az ipari robot Devoltól a PUMA-ig, **Shakey és a szimbolikus korszak**, végül **Brooks testetöltött fordulata**, amely az egész területet átrendezte.

Innen a mérnöki anyag, rétegenként. **Kinematika** és a **Jacobi-mátrix**, dinamika valós időben. **Hajtások, lábak, kezek.** **Érzékelők** és a pontfelhő. **Kalman-szűrő**, **SLAM**. Szabályozás: **PID** és **impedancia**. Tervezés: a **konfigurációs tér**, **A\\***, **RRT**, **MPC**. És a **ROS**, amin mindez fut.

A mai rész: **imitációs és megerősítéses tanulás**, a **sim-to-real** szakadék, és a **látás-nyelv-cselekvés modellek** — ahol a terület épp most tart.

Végül az, amit a demóvideók nem mutatnak: a **kollaboratív robotok**, az **ipari valóság**, a **biztonság és a szabványok**, és a **nyitott kérdések**.

Minden fejezet **„a mai álláspont"** alfejezettel zárul: ami működik, ami nem, és ami nyitva van.

234 oldal, harminckét fejezet és függelék.`,
    descriptionEn: `Popular accounts of robotics tend to slide one of two ways: demo videos, or formulas. This volume starts with **Moravec's paradox** — that what we assumed was hard (chess, logic) is easy for a machine, and what we assumed was easy (walking, grasping) is hard — and derives from it **why robotics is difficult**.

The first chapter also covers **what is not a robot**, **what a robot can and cannot do today**, and why **Asimov's laws are not engineering tools**.

**The history**, without which today's solutions look arbitrary. Heron's first programmable machine, al-Jazari's camshaft, Vaucanson's duck, **Farkas Kempelen's** chess player and speaking machine, **Jacquard** — where the program separates from the machine — Babbage and Lovelace. With a section on **why the 19th century did not produce the robot**.

**Cybernetics:** Watt's centrifugal governor, Maxwell, the anti-aircraft gun, **Wiener in 1948**, the frequency domain (Black, Nyquist, Bode), **Grey Walter's tortoises** as the first autonomous robots — and why **cybernetics disappeared as a name**.

Then the industrial robot from Devol to the PUMA, **Shakey and the symbolic era**, and finally **Brooks's embodied turn**, which rearranged the whole field.

From there the engineering, layer by layer. **Kinematics** and the **Jacobian**, dynamics in real time. **Actuators, legs, hands.** **Sensors** and the point cloud. The **Kalman filter**, **SLAM**. Control: **PID** and **impedance**. Planning: **configuration space**, **A\\***, **RRT**, **MPC**. And **ROS**, which all of it runs on.

The present: **imitation and reinforcement learning**, the **sim-to-real** gap, and **vision-language-action models** — where the field actually stands.

Finally what the demo videos leave out: **collaborative robots**, **industrial reality**, **safety and standards**, and the **open questions**.

Every chapter closes with a section called **"the current position"**: what works, what does not, and what is still open.

234 pages, thirty-two chapters and appendix.`,
  },
  {
    slug: "kvantumfizika-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("kvantumfizika_nagykonyve/A kvantumfizika nagykonyve.pdf"),
    downloadName: "A-kvantumfizika-nagykonyve.pdf",
    pages: 233,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "amethyst",
    mark: "triple",

    titleHu: "A Kvantumfizika Nagykönyve",
    titleEn: "The Great Book of Quantum Physics",
    subtitleHu: "A klasszikus fizika repedéseitől a kvantuminformációig",
    subtitleEn: "From the cracks in classical physics to quantum information",
    coverTitle: "A Kvantumfizika Nagykönyve",
    coverSubtitle: "Elméletek, kísérletek, viták",

    blurbHu:
      "Maxwell mezőjétől és Boltzmann valószínűségétől Planck kvantumán, Bohr atomján, Heisenberg mátrixain és Schrödinger egyenletén át az EPR-ig, Bell egyenlőtlenségéig, a dekoherenciáig és a kvantuminformációig. A nyolc mai értelmezés, és ami nyitva van. Harmincegy fejezet.",
    blurbEn:
      "From Maxwell's field and Boltzmann's probability through Planck's quantum, Bohr's atom, Heisenberg's matrices and Schrödinger's equation to EPR, Bell's inequality, decoherence and quantum information. The eight live interpretations, and what remains open. Thirty-one chapters.",

    descriptionHu: `A kvantumfizikáról szóló ismeretterjesztés rendszerint ott kezd, ahol a furcsaság kezdődik — és ettől a furcsaság megmagyarázhatatlan marad. Ez a kötet **a klasszikus világképpel indul**: mit tudtunk biztosan 1890-ben, és **hol repedt meg**.

Enélkül Planck lépése érthetetlen. Az első rész ezért végigviszi, hogy **miért nem létezhet a klasszikus atom**, hol bukott meg az **ekvipartíció tétele**, és mit mondott 1894-ben Michelson — szemben azzal, ami a valóság volt.

**A felépítés a történet sorrendjét követi**, mert a fogalmak abban a sorrendben lesznek érthetők. Maxwell mezője és az eltolási áram. **Boltzmann**: az entrópia mint megszámlálás, és a két ellenvetés, amely majdnem kidöntötte. A **feketetest-sugárzás** — „a fizika legtisztább kérdése" —, és **hogyan számolt Boltzmann, és mit csinált Planck másképp**.

Innen **Einstein fénykvantuma**, **Bohr atomja**, **de Broglie hulláma**, **Heisenberg mátrixai**, **Schrödinger egyenlete**, **Born valószínűségi értelmezése**, **Dirac antianyaga**, **Pauli elve**, és **Neumann** Hilbert-tere — a matematikai váz, amelyen az egész áll.

Azután a viták, amelyek máig tartanak. **Einstein és Bohr**, az **EPR-érv**, a **macska**, és **Bell egyenlőtlensége** — az a pont, ahol a filozófiai kérdésből mérhető kísérlet lett.

**Feynman útintegrálja**, a **Standard modell**, a **dekoherencia** — és a **nyolc mai értelmezés** egyenként, elfogultság nélkül: koppenhágai, sokvilág, de Broglie–Bohm, GRW, QBism és a többi. A könyv nem dönt helyetted; megmutatja, melyik mit magyaráz meg és mit nem.

Végül a **kvantuminformáció** és a **nyitott kérdések**.

Minden fejezet **„a mai álláspont"** alfejezettel zárul — ami elválasztja azt, amit tudunk, attól, amit hiszünk, és attól, ami nyitva van.

233 oldal, harmincegy fejezet és függelék.`,
    descriptionEn: `Popular accounts of quantum physics usually begin where the strangeness begins — which is exactly why the strangeness stays unexplained. This volume starts with **the classical picture**: what was known for certain in 1890, and **where it cracked**.

Without that, Planck's move makes no sense. So the first part works through **why a classical atom cannot exist**, where the **equipartition theorem** failed, and what Michelson said in 1894 — against what was actually the case.

**The structure follows the story's own order**, because that is the order in which the concepts become intelligible. Maxwell's field and the displacement current. **Boltzmann**: entropy as counting, and the two objections that nearly brought it down. **Black-body radiation** — "the cleanest question in physics" — and **how Boltzmann counted, and what Planck did differently**.

From there **Einstein's light quantum**, **Bohr's atom**, **de Broglie's wave**, **Heisenberg's matrices**, **Schrödinger's equation**, **Born's probability reading**, **Dirac's antimatter**, **Pauli's principle**, and **von Neumann's** Hilbert space — the mathematical frame the whole thing rests on.

Then the arguments that are still running. **Einstein and Bohr**, the **EPR argument**, the **cat**, and **Bell's inequality** — the point at which a philosophical question became a measurable experiment.

**Feynman's path integral**, the **Standard Model**, **decoherence** — and the **eight live interpretations** one by one, without taking sides: Copenhagen, many-worlds, de Broglie–Bohm, GRW, QBism and the rest. The book does not decide for you; it shows what each explains and what it does not.

Finally **quantum information** and the **open questions**.

Every chapter closes with a section called **"the current position"** — separating what is known from what is believed, and from what is still open.

233 pages, thirty-one chapters and appendix.`,
  },
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
    slug: "python-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("python_nagykonyve/A Python nagykonyve.pdf"),
    downloadName: "A-Python-nagykonyve.pdf",
    pages: 330,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "jade",
    mark: "knot",

    titleHu: "A Python Nagykönyve",
    titleEn: "The Great Book of Python",
    subtitleHu: "A nyelv a tervezési döntései felől",
    subtitleEn: "The language seen through its design decisions",
    coverTitle: "A Python Nagykönyve",
    coverSubtitle: "Tizennyolc fejezet, háromszáz alfejezet",

    blurbHu:
      "Nem referencia és nem gyorstalpaló. Az objektummodelltől a memóriakezelésen, az attribútumkeresésen és a bájtkódon át a GIL-ig és az éles üzemig — minden szabály abból, amiért így döntöttek. Tizennyolc fejezet, 330 oldal.",
    blurbEn:
      "Neither a reference nor a crash course. From the object model through memory management, attribute lookup and bytecode to the GIL and production practice — every rule derived from the decision behind it. Eighteen chapters, 330 pages.",

    descriptionHu: `A Pythonról szóló könyvek többsége szabálylistát ad: ezt így kell, azt úgy, ez a csapda, azt kerüld. A szabályokat meg lehet tanulni, de nem állnak össze semmivé — és az első nem tankönyvi helyzetben kiderül, hogy a tudás lyukas.

Ez a kötet **a döntésekkel kezd, amelyekből a szabályok következnek**. Majdnem minden, ami a Pythonban elsőre furcsa, egy kimondható tervezési választás egyenes folyománya. Ha a választást értjük, a szabályt nem kell megjegyezni.

**I. A nyelv természete.** Miért lett ilyen: minden objektum, dinamikus de erős tipizálás, a behúzás mint szintaxis, az olvashatóság mint kényszer. Az EAFP és a versenyhelyzet, amely miatt nem stílus, hanem helyesség. A PEP-folyamat, az ötéves támogatási ablak, és **amit a Python nem tud jól** — öt terület, ahol más nyelv a helyes választás.

**Az objektummodell:** a \`PyObject\` fejléce, az azonosság és a hírhedt egészszám-csapda, mutábilis és immutábilis, a \`__new__\` és a \`__init__\` szétválasztása, a pickle mint biztonsági felület.

**A névterek** mint szótárak: LEGB, az értékadás lokálissá tesz, zárványok és cellák, a ciklusváltozó-csapda, és a \`match\` névkötési szabálya, amely **csendben rossz eredményt ad**, ha nem ismerjük.

**A memória:** hivatkozásszámlálás és ciklusgyűjtő együtt, a \`__del__\` és miért kerüljük, gyenge hivatkozások, hogyan szivárog a memória — és a \`gc.freeze\`, amely a fork utáni lapmásolást megakadályozza.

**II. Adatok.** Miért nem 0.3 a 0.1 + 0.2, és mit kezdjünk vele: pénz, idő, mérték — a három tipikus tévedés. Numerikusan stabil képletek, kioltás, \`math.fsum\`. Unicode: kódpont, grafémaklaszter, normalizálás, mojibake, **homográf- és kétirányú támadás**, és a magyar nyelv sajátosságai. A lista mint dinamikus tömb, a \`deque\`, a \`heapq\`, a \`bisect\` — és egy költségtáblázat, amelyből a legtöbb hibás adatszerkezet-választás kiderül. A hasítótábla belülről, a kompakt szótár, és a hasításütközéses szolgáltatásmegtagadás.

**III. Végrehajtás.** Függvények, zárványok, dekorátorok — újrapróbálkozás szóródással, áramkör-megszakító, és hogy miért rossz a mellékhatás rossz helyen. Iterátorok és generátorok: a lustaság négy csapdája, egy teljes adatfolyam-feldolgozó, aszinkron iteráció. A kivételkezelés **háromrétegű stratégiája** — fordítás, átengedés, határ —, időkorláttal, idempotenciakulccsal és kecses leállítással. Az importrendszer hat lépése, körkörös importok, virtuális környezetek, **a függőség mint kockázat**.

**IV. Objektumok.** Az attribútumkeresés pontos sorrendje — és ebből egyetlen mechanizmusként esik ki a \`@property\`, a \`@classmethod\`, a \`__slots__\`, a kötött metódus és a \`cached_property\`. A leíróprotokoll, a metaosztály helyett \`__init_subclass__\`, és egy hatvan soros deklaratív modell, amely ugyanazon az elven áll, mint a Django és a Pydantic. MRO, a \`super()\`, amely **nem a szülőt jelenti**, keverékek, tartalmazás, dunder-térkép. Típusjelölések és protokollok: szerkezeti típusosság, generikusok, adatosztályok, és **a lehetetlen állapotok kizárása** a típussal.

**V. A futtató és a gyakorlat.** Mi történik a \`python program.py\` után: AST, bájtkód, az adaptív értelmező, amely futás közben átírja magát. A GIL — mit véd, mit nem, és miért nem teszi szálbiztossá a kódunkat —, a szabad szálú build és az alértelmezők. Konkurencia egyetlen kérdésből: **mire vár a program?** Végül a gyakorlat: hibakeresés, tesztelés, tulajdonságalapú tesztelés, profilozás, csomagolás, naplózás, biztonság, kiadás.

330 oldal, tizennyolc fejezet, háromszáz alfejezet. Mérhető számokkal, futtatható példákkal, és azzal a szemponttal minden döntésnél, hogy **melyik változatot fogja hat hónap múlva valaki más gyorsabban megérteni.**`,
    descriptionEn: `Most books on Python hand you a list of rules: do this, avoid that, here is a pitfall. Rules can be memorised, but they do not add up to anything — and the first situation outside the textbook reveals the gaps.

This volume starts with **the decisions the rules follow from**. Almost everything that seems strange about Python is the direct consequence of a design choice that can be stated plainly. Understand the choice and the rule needs no memorising.

**I. The nature of the language.** Why it turned out this way: everything is an object, dynamic but strong typing, indentation as syntax, readability as a constraint. EAFP and the race condition that makes it correctness rather than style. The PEP process, the five-year support window, and **what Python is not good at** — five areas where another language is the right choice.

**The object model:** the \`PyObject\` header, identity and the notorious small-integer trap, mutable versus immutable, the separation of \`__new__\` and \`__init__\`, pickle as an attack surface.

**Namespaces** as dictionaries: LEGB, assignment making a name local, closures and cells, the loop-variable trap, and the \`match\` name-binding rule that **silently gives wrong answers** if you do not know it.

**Memory:** reference counting and the cycle collector together, \`__del__\` and why to avoid it, weak references, how memory leaks — and \`gc.freeze\`, which stops copy-on-write page duplication after a fork.

**II. Data.** Why 0.1 + 0.2 is not 0.3 and what to do about it: money, time, units — the three typical mistakes. Numerically stable formulations, cancellation, \`math.fsum\`. Unicode: code point, grapheme cluster, normalisation, mojibake, **homograph and bidirectional attacks**. The list as a dynamic array, \`deque\`, \`heapq\`, \`bisect\` — and a cost table that explains most wrong data-structure choices. The hash table from the inside, the compact dict, and hash-collision denial of service.

**III. Execution.** Functions, closures, decorators — retry with jitter, circuit breakers, and why a side effect in the wrong place hurts. Iterators and generators: the four traps of laziness, a complete streaming pipeline, async iteration. A **three-layer exception strategy** — translate, propagate, boundary — with timeouts, idempotency keys and graceful shutdown. The six steps of the import system, circular imports, virtual environments, **dependencies as risk**.

**IV. Objects.** The exact order of attribute lookup — from which \`@property\`, \`@classmethod\`, \`__slots__\`, bound methods and \`cached_property\` all fall out as one mechanism. The descriptor protocol, \`__init_subclass__\` instead of metaclasses, and a sixty-line declarative model built on the same principle as Django and Pydantic. The MRO, \`super()\` which **does not mean "the parent"**, mixins, composition, a dunder map. Type hints and protocols: structural typing, generics, dataclasses, and **making illegal states unrepresentable**.

**V. The runtime and the practice.** What happens after \`python program.py\`: AST, bytecode, the adaptive interpreter that rewrites itself while running. The GIL — what it protects, what it does not, and why it does not make your code thread-safe — the free-threaded build and subinterpreters. Concurrency from a single question: **what is the program waiting for?** Finally the practice: debugging, testing, property-based testing, profiling, packaging, logging, security, release.

330 pages, eighteen chapters, three hundred sections. With measured numbers, runnable examples, and one question behind every decision: **which version will someone else understand faster in six months?**`,
  },
  {
    slug: "fastapi-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("fastapi_nagykonyve/A FastAPI nagykonyve.pdf"),
    downloadName: "A-FastAPI-nagykonyve.pdf",
    pages: 344,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "jade",
    mark: "triple",

    titleHu: "A FastAPI Nagykönyve",
    titleEn: "The Great Book of FastAPI",
    subtitleHu: "A típusjelöléstől az éles üzemig",
    subtitleEn: "From type hints to production",
    coverTitle: "A FastAPI Nagykönyve",
    coverSubtitle: "Tizennyolc fejezet, háromszáz alfejezet",

    blurbHu:
      "Nem referencia és nem gyorstalpaló. Az ASGI-tól a Pydanticon, a függőséginjektáláson és az adatrétegen át a telepítésig — minden szabály abból, amiért így döntöttek. Tizennyolc fejezet, 344 oldal.",
    blurbEn:
      "Neither a reference nor a crash course. From ASGI through Pydantic, dependency injection and the data layer to deployment — every rule derived from the decision behind it. Eighteen chapters, 344 pages.",

    descriptionHu: `A FastAPI-ról szóló anyagok többsége ugyanott áll meg: megmutat egy dekorátort, egy Pydantic-modellt, és kész a végpont. Ami utána jön — az adatréteg, a tranzakcióhatárok, a blokkoló hívások, a jogosultság, a telepítés —, az hiányzik. Pedig **a valódi nehézségek ott vannak**, nem a keretrendszerben.

Ez a kötet **a döntéssel kezd, amelyből minden következik**: ha a típusjelölés futásidőben is olvasható, akkor a függvény aláírása az egész API-szerződés. Innen vezethető le a validálás, a dokumentáció, a kimenet szűrése és a függőséginjektálás is.

**I. Alapok és ASGI.** Mi az ASGI, és miért kellett; a \`scope\`/\`receive\`/\`send\` hármas; egy kérés teljes útja a TCP-kapcsolattól a kiküldött bájtokig; köztes rétegek mint hagyma és **a sorrend, amit mindenki elront**; útvonalillesztés, öt paraméterforrás, és **a válasz mint szerződés** — amiért a kimenetet is validálni érdemes.

**II. A szerződés: Pydantic.** A Rust mag és a v2 teljesítménymodellje; a kényszerítés, amit tudni kell; négy validálási beavatkozási pont; magyar adattípusok — adószám, bankszámla, telefonszám — ellenőrző számjeggyel; **mi ne kerüljön a modellbe**; három modell erőforrásonként; részleges frissítés úgy, hogy a \`null\` és a „nem adták meg" megkülönböztethető legyen; címkézett uniók; verziózás és a törő változások gépi ellenőrzése.

**III. A függőségek.** A \`Depends\`-fa feloldása és gyorsítótárazása; a rendszer négy korlátja; a \`yield\`-függőségek és **a takarítás sorrendje** — ebből vezethető le, hol legyen a tranzakcióhatár; jelszókezelés, a **JWT őszinte mérlege** (mikor ne használjuk), négyszintű jogosultság, többbérlős izoláció három védelmi réteggel; köztes réteg, függőség vagy dekorátor — és a sebességkorlát zsetonvödörrel.

**IV. Adatok és a külvilág.** SQLAlchemy 2.0 aszinkron módban: \`expire_on_commit\`, az **N+1 és a felderítése**, migrációk biztonságos alakja, amit a Postgres tud és kár nem használni; **mi blokkol pontosan**, hogyan mérjük a ciklus-késést, visszanyomás és terhelésvédelem; SSE kontra WebSocket és az üzenetsorrend-garanciák; naplózás, metrika, nyomkövetés — és a riasztások, amelyek tényleg hasznosak.

**V. Éles üzem.** Tesztpiramis, az adatbázis négy stratégiája a tesztben, séma alapú tesztelés; konténer, munkásszám, Kubernetes-leíró, biztonsági ellenőrzőlista, migráció régi rendszerről, és **az első éles nap** listája.

344 oldal, tizennyolc fejezet, háromszáz alfejezet. Mért számokkal, futtatható példákkal, és ott, ahol a dokumentáció nem foglal állást — tranzakcióhatár, verziózás, projektszerkezet —, **indokolt ajánlással**.`,
    descriptionEn: `Most FastAPI material stops at the same place: it shows a decorator, a Pydantic model, and the endpoint is done. What comes after — the data layer, transaction boundaries, blocking calls, authorisation, deployment — is missing. Yet **that is where the real difficulty lies**, not in the framework.

This volume starts with **the decision everything follows from**: if type hints are readable at runtime, then the function signature is the entire API contract. Validation, documentation, output filtering and dependency injection all follow from it.

**I. Foundations and ASGI.** What ASGI is and why it was needed; the \`scope\`/\`receive\`/\`send\` triple; the full path of a request from the TCP connection to the bytes sent; middleware as an onion and **the ordering everyone gets wrong**; route matching, five parameter sources, and **the response as a contract** — why output deserves validation too.

**II. The contract: Pydantic.** The Rust core and the v2 performance model; coercion and what to know about it; four validation hook points; custom types with their own behaviour; **what does not belong in a model**; three models per resource; partial updates that distinguish \`null\` from "not provided"; tagged unions; versioning with machine-checked breaking changes.

**III. Dependencies.** Resolving and caching the \`Depends\` tree; the four limits of the system; \`yield\` dependencies and **the order of cleanup** — from which the transaction boundary follows; password handling, **an honest assessment of JWT** (when not to use it), four levels of authorisation, multi-tenant isolation in three layers; middleware, dependency or decorator — and rate limiting with a token bucket.

**IV. Data and the outside world.** SQLAlchemy 2.0 in async mode: \`expire_on_commit\`, **N+1 and how to catch it**, safe migration shapes, what Postgres offers and is a shame to ignore; **what exactly blocks**, measuring event-loop lag, backpressure and load shedding; SSE versus WebSocket and message ordering guarantees; logging, metrics, tracing — and the alerts that are actually useful.

**V. Production.** The test pyramid, four database strategies in tests, schema-based testing; containers, worker counts, a Kubernetes manifest, a security checklist, migrating from a legacy system, and **a first-day-live** checklist.

344 pages, eighteen chapters, three hundred sections. With measured numbers, runnable examples, and — where the documentation takes no position — **a reasoned recommendation**.`,
  },
  {
    slug: "claude-code-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("claude_code_nagykonyve/A Claude Code nagykonyve.pdf"),
    downloadName: "A-Claude-Code-nagykonyve.pdf",
    pages: 316,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "copper",
    mark: "triple",

    titleHu: "A Claude Code Nagykönyve",
    titleEn: "The Great Book of Claude Code",
    subtitleHu: "A berendezés többet ér, mint az utasítgatás",
    subtitleEn: "Setup beats instruction",
    coverTitle: "A Claude Code Nagykönyve",
    coverSubtitle: "Tizennyolc fejezet, 366 alfejezet",

    blurbHu:
      "Nem prompttechnika és nem funkciólista. Az ügynökhurok mechanizmusától a projekt berendezéséig: CLAUDE.md, jogosultságok, parancsok, horgok, alügynökök, MCP, képességek, CI. Tizennyolc fejezet, 316 oldal.",
    blurbEn:
      "Neither prompt tricks nor a feature list. From the mechanics of the agent loop to setting up a project: CLAUDE.md, permissions, commands, hooks, subagents, MCP, skills, CI. Eighteen chapters, 316 pages.",

    descriptionHu: `A legtöbb anyag, amely a kódoló ügynökökről szól, ugyanazt a hibát követi el: **prompttechnikát tanít.** Mintha a jó eredmény azon múlna, hogyan fogalmazunk. A gyakorlat ennek az ellenkezőjét mutatja — ugyanaz a modell, ugyanaz a feladat, de **gyors tesztkörrel és szigorú típusellenőrzővel** más eredményt ad, mint egy olyan projektben, ahol semmit nem lehet gyorsan ellenőrizni.

Ez a kötet végig erre az állításra épít: **a berendezés többet ér, mint az utasítgatás.**

**I. Az ügynök természete.** Mi a Claude Code, és milyen döntésekből lett az; honnan jött ez az eszközosztály — a kódkiegészítőtől a csevegőablakon át az ügynökig —, és miben más a megfigyelés a feltételezésnél. Az ügynökhurok lépésről lépésre, egy valódi kör teljes nyomkövetésével; a hurok hat megállási feltétele, a párhuzamos eszközhívások, és **négy elfajulás** — a tágulás, az oszcilláció, a halmozódás, a hamis siker —, mindegyik felismerhető jellel. **A kontextus mint sodrószalag:** mi fogyasztja valójában (számokkal), hogyan szerkeszthető, mit veszít a tömörítés, és egy nagy feladat teljes kontextusterve. Az eszközkészlet: miért kevés és általános, mit nem tartalmaz szándékosan, és hogyan olvassuk az eszközhívások naplóját — két valódi napló, egy egészséges és egy beteg, soronkénti elemzéssel.

**II. A munkamenet.** A kérés három rétege: mit, miért, hogyan ne; tíz megfogalmazás, amely megbízhatóan működik, és mindegyik mögött a mechanizmus. **Négy beszélgetés, négy kimenetel** — ugyanaz a feladat semmitmondó, túl részletes, jó, és mércével ellátott kéréssel. A megszakítás művészete: mikor azonnal, mikor várjunk, és mit mondjunk utána. Fájlok és keresés: a keresési stratégia négy módja, nagy és generált fájlok, többfájlos változtatások felmérés–szakaszolás–ellenőrzés menetben, halott kód, függőségfrissítés adapterréteggel. Git: a commitüzenet, a PR-leírás, **az átnézés három menete**, konfliktusfeloldás, a git mint felderítőeszköz. Hibakeresés és tesztelés: a hibajelentésből induló munka, villódzó tesztek, a gyors kör megépítése, és **egy nehéz hiba hét lépésben** — a bejelentéstől a CLAUDE.md-bejegyzésig.

**III. A projekt berendezése.** A CLAUDE.md: háromszintű memória, a bejegyzések megfogalmazása, tíz dolog, amit sosem szabad beleírni, három kész fájl három projekttípusra, és négy próba arra, hogy jó-e. Jogosultságok: a mintaillesztés részletei, **a kockázat valódi térképe**, az engedélymódok, egy fenyegetési modell a mindennapokra, és mit tegyünk, ha mégis baj lesz. Beállítások: a \`.claude\` szerkezete, monorepó, a rétegek eredője, **egy teljes, átvehető projektberendezés**. Egyéni parancsok: hat parancs, amely majdnem mindenhol megéri, és hat, amely nem vált be — négy kérdéssel, amely előre megmondja, melyik lesz melyik.

**IV. Kiterjesztés.** Alügynökök: a feladatleírás öt eleme, a költségük végigszámolva, négy átvehető definíció, és **egy felderítés elejétől végéig** — negyvenkétezer token helyett ötszáz. Horgok: hat, amely megéri, öt, amelyet ne írjunk meg, a hét szabály és egy sablon, amely mindet betartja; a blokkoló üzenet megfogalmazása. MCP: a protokoll logikája, mikor jobb a parancssor, egy teljes saját kiszolgáló, és a külső tartalom mint támadási felület. Képességek: a leírás, amely dönt, segédfájlok és ellenőrző szkriptek, és a kiterjesztések sorrendje megtérülés szerint.

**V. Automatizálás és gyakorlat.** Fej nélküli mód, egy teljes CI-munkafolyamat, SDK-alapú kötegelt feldolgozás, költségkorlátok, és **mit ne automatizáljunk**. A végén a megbízhatósági térkép, a hat szokás, a négy antiminta, három teljes munkamenet időbélyegekkel, a négyhetes bevezetési terv, és egy diagnózis arra, ha mégsem működik.

316 oldal, tizennyolc fejezet, 366 alfejezet, 738 kereszthivatkozással. Mechanizmusokra építve — mert a parancsnevek és a kapcsolók változnak, az ügynökhurok, a kontextusgazdálkodás és a kérés–kényszer különbsége nem.`,
    descriptionEn: `Most material on coding agents makes the same mistake: **it teaches prompt technique**, as if good results depended on phrasing. Practice shows the opposite — the same model on the same task performs differently in a project with a ten-second test loop and a strict type checker than in one where nothing can be verified quickly.

This volume builds on that claim throughout: **setup beats instruction.**

**I. The nature of the agent.** What Claude Code is and the decisions that shaped it; where this class of tool came from — completion, chat window, agent — and why observation beats assumption. The agent loop step by step with a full trace of one real turn; the loop's six stopping conditions, parallel tool calls, and **four degenerations** — widening, oscillation, accumulation, false success — each with a recognisable sign. **Context as a conveyor belt:** what actually consumes it (with numbers), how to shape it, what compaction loses, and a full context plan for a large task. The tool set: why it is small and general, what it deliberately omits, and how to read the tool-call log — two real logs, one healthy and one sick, line by line.

**II. The session.** The three layers of a request: what, why, how not; ten phrasings that reliably work, each with its mechanism. **Four conversations, four outcomes** — the same task asked vaguely, over-specified, well, and with a success metric. The art of interruption. Files and search: four search strategies, large and generated files, multi-file changes, dead code, dependency upgrades via an adapter layer. Git: commit messages, PR descriptions, **the three passes of review**, conflict resolution, git as a discovery tool. Debugging and testing: working from a bug report, flaky tests, building the fast loop, and **one hard bug in seven steps**.

**III. Setting up the project.** CLAUDE.md: three-level memory, how to phrase entries, ten things never to put in it, three complete files for three project types, four tests of whether it is any good. Permissions: pattern matching, **the real risk map**, permission modes, a practical threat model, and what to do when something does go wrong. Settings: the \`.claude\` layout, monorepos, how the layers resolve, **one complete, adoptable project setup**. Custom commands: six that are almost always worth it, six that failed — with four questions that tell you which is which in advance.

**IV. Extension.** Subagents: the five elements of a task description, their cost worked out, four adoptable definitions, and **one discovery run end to end** — five hundred tokens instead of forty-two thousand. Hooks: six worth writing, five not to write, seven rules and a template that follows all of them. MCP: the protocol's logic, when the command line is better, a complete custom server, and external content as attack surface. Skills: the description that decides, helper files and check scripts, and the order of extensions by return.

**V. Automation and practice.** Headless mode, a complete CI workflow, SDK-based batch processing, cost limits, and **what not to automate**. Finally: the reliability map, six habits, four anti-patterns, three complete sessions with timestamps, a four-week adoption plan, and a diagnosis for when it still is not working.

316 pages, eighteen chapters, 366 sections, 738 cross-references. Built on mechanisms — because command names and flags change, while the agent loop, context management, and the difference between asking and enforcing do not.`,
  },
  {
    slug: "gpu-szerverek-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: nk("gpu_szerverek_nagykonyve/A GPU-szerverek nagykonyve.pdf"),
    downloadName: "A-GPU-szerverek-nagykonyve.pdf",
    pages: 306,
    priceHuf: 4990,
    author: AUTHOR,
    series: "Tudományos nagykönyvek",
    category: "SCIENCE",
    featured: true,
    accent: "amethyst",
    mark: "sun",

    titleHu: "A GPU-szerverek Nagykönyve",
    titleEn: "The Great Book of GPU Servers",
    subtitleHu: "A VRAM-tól a számláig",
    subtitleEn: "From VRAM to the invoice",
    coverTitle: "A GPU-szerverek Nagykönyve",
    coverSubtitle: "Tizennyolc fejezet, Modal és RunPod",

    blurbHu:
      "Mibe kerül, miért lassú, és miért nem fér el. A GPU architektúrájától a VRAM-képleteken és a konténereken át a Modal és a RunPod éles üzeméig. Tizennyolc fejezet, 306 oldal, végigszámolt példákkal.",
    blurbEn:
      "What it costs, why it is slow, and why it does not fit. From GPU architecture through VRAM formulas and containers to running Modal and RunPod in production. Eighteen chapters, 306 pages, with worked examples.",

    descriptionHu: `A bérelt GPU-nál három kérdés jön elő újra és újra: **mibe kerül, miért lassú, és miért nem fér el.** Mindhárom megválaszolható — de nem katalógusadatból, hanem néhány képletből és egy méréssel.

Ez a kötet ezekre a kérdésekre ad eszközt, és nem a felületi részletekre épít: a platformok parancsai változnak, a VRAM-számítás, a roofline-gondolat, a hidegindítás szerkezete és a költségmodell logikája nem.

**I. A GPU mint erőforrás.** Mi a GPU-szerver, honnan jött ez az eszközosztály, és **mikor ne béreljünk** — öt eset, amikor a CPU vagy egy kész API olcsóbb. A nemzedékek, amelyek tényleg számítanak: VRAM, memóriasávszélesség, formátumok, összeköttetés. Az architektúra: a tömeges párhuzamosság, a memóriahierarchia, **a kernelindítás költsége** és a kis kötegek átka; tenzormagok és formátumok, és miért a FLOP-ok öt százaléka viszi az idő negyven százalékát; aszinkronitás, folyamok, és a PCIe mint harminc-százszoros szűkület. **A VRAM mint a legszűkebb erőforrás:** a tanítási és inferencia-képletek, a kulcs-érték gyorsítótár mérete végigszámolva, a töredezettség, hét megtakarítási eszköz növekvő ár szerint, a memóriahibák négy osztálya — és **négy teljes tervezési példa**, a paraméterszámtól a kártyaválasztásig.

**II. Futtatás.** A szoftververem nyolc rétege, a kompatibilitás egyetlen igazi szabálya, a hibaüzenetek olvasása rétegenként, verziórögzítés és reprodukálhatóság, környezetkezelés és a verem frissítése füstpróbával. Konténerek: a képméret csökkentése, rétegsorrend és gyorsítótárazás, **egy teljes képfájl soronkénti indoklással**, képtárolók, és az indítási kapcsolók, amelyek hiánya jellegzetes hibákat okoz. Ütemezés és megosztás: MIG, MPS, időosztás és Kubernetes — **mikor melyik, négy valódi helyzeten**. Több GPU: a kommunikációs minták költségszámítással, mikor nem érdemes, a négy párhuzamosítási mód együtt, holtpontok és NCCL-hibák. **A költségmodell:** az effektív óradíj, vásárlás kontra bérlés fordulóponttal, megszakítható példányok, és három végigszámolt költségszámítás.

**III. Modal.** A függvény mint felhő: a modell, a helyi fejlesztés viszonya, hibakezelés és újrapróbálkozás, osztályalapú függvények életciklussal, a képfájl kódból, és a modell korlátai. Tárolás: képek, kötetek, titkok, **a kép–kötet határ**, adatformátumok, gyorsítótárazás, és a kötetek karbantartása. GPU-munka: kötegelt feldolgozás, **a hidegindítás négy összetevője** és csökkentése, egy teljes finomhangolás, GPU-típus választása méréssel, többkártyás munka, költségfigyelés. Éles üzem: webes végpontok, verziózás, riasztás teendőkkel, ütemezett munkák, **egy éles végpont teljes kódja**, és a környezetek szétválasztása.

**IV. RunPod.** A pod és a serverless modellje, a gépközeli munkamód következményei, a döntés a kettő között, kapacitás és elérhetőség, az első pod beállítása lépésről lépésre, több pod együtt, és a pod mint fejlesztői környezet. Tárolás: a négy réteg összevetése, adatmozgatás be és ki, **ellenőrzőpontok és helyreállítás**, az adatbetöltés mint szűk keresztmetszet, mentés, objektumtár-beállítás. Serverless: **a kezelőfüggvény felépítése**, aszinkron és folyamkimenet, a munkavégzők méretezése, hibakeresés, kiadás. Üzemeltetés: automatizálás és **az üresjárat-őr**, hálózat és biztonság, naplózás, és egy teljes életciklus-lista.

**V. Éles üzem.** Inferencia-kiszolgálás: folyamatos kötegelés, PagedAttention, a kiszolgáló hangolása paraméterenként, kvantálás méréssel, **terhelésmérés és a telítési pont**, a késleltetés–átbocsátás csere, modellválasztás és útválasztás tizenkétszeres megtakarítással. Megfigyelés: a profilozás négy eszköze, egy nyolcpaneles műszerfal normális tartományokkal, **a költségoptimalizálás sorrendje megtérülés szerint**, és három gyakori panasz végigvezetett diagnózissal.

306 oldal, tizennyolc fejezet, 309 alfejezet. Mechanizmusokra építve, végigszámolt példákkal — és azzal a visszatérő tanulsággal, hogy **a GPU-s rendszerek problémái ritkán ott vannak, ahol a figyelem.**`,
    descriptionEn: `With rented GPUs, three questions keep coming back: **what does it cost, why is it slow, and why does it not fit.** All three are answerable — not from a datasheet, but from a few formulas and one measurement.

This volume gives tools for those questions and does not build on surface detail: platform commands change; VRAM arithmetic, the roofline idea, the structure of cold starts and the logic of the cost model do not.

**I. The GPU as a resource.** What a GPU server is, where this class of service came from, and **when not to rent one** — five cases where a CPU or an existing API is cheaper. The generation differences that actually matter: VRAM, memory bandwidth, formats, interconnect. Architecture: massive parallelism, the memory hierarchy, **the cost of launching a kernel** and the curse of small batches; tensor cores and formats, and why five per cent of the FLOPs take forty per cent of the time; asynchrony, streams, and PCIe as a thirty-to-hundredfold bottleneck. **VRAM as the tightest resource:** training and inference formulas, the KV cache sized out, fragmentation, seven savings tools ordered by cost, four classes of out-of-memory error — and **four complete sizing examples**, from parameter count to card choice.

**II. Running it.** The eight layers of the software stack, the one real compatibility rule, reading error messages by layer, version pinning and reproducibility, environment management and stack upgrades with a smoke test. Containers: shrinking images, layer order and caching, **a complete Dockerfile justified line by line**, registries, and the run flags whose absence causes characteristic failures. Scheduling and sharing: MIG, MPS, time slicing and Kubernetes — **which one when, across four real situations**. Multi-GPU: communication patterns with cost arithmetic, when it is not worth it, the four parallelism modes together, deadlocks and NCCL errors. **The cost model:** effective hourly rate, buy versus rent with the break-even point, preemptible instances, and three worked cost calculations.

**III. Modal.** The function as cloud: the model, its relationship to local development, error handling and retries, class-based functions with lifecycles, images from code, and the model's limits. Storage: images, volumes, secrets, **the image–volume boundary**, data formats, caching, and volume maintenance. GPU work: batch processing, **the four components of cold start** and how to cut them, a complete fine-tuning run, choosing a GPU type by measurement, multi-GPU work, cost tracking. Production: web endpoints, versioning, alerts with runbooks, scheduled jobs, **the complete code of a production endpoint**, and separating environments.

**IV. RunPod.** The pod and serverless models, the consequences of machine-level work, choosing between them, capacity and availability, setting up the first pod step by step, running several pods, and the pod as a development environment. Storage: the four tiers compared, moving data in and out, **checkpoints and recovery**, data loading as a bottleneck, backups, object store setup. Serverless: **the structure of the handler**, async and streaming output, sizing workers, debugging, releases. Operations: automation and **the idle guard**, networking and security, logging, and a full lifecycle checklist.

**V. Production.** Inference serving: continuous batching, PagedAttention, tuning the server parameter by parameter, quantisation with measurement, **load testing and the saturation point**, the latency–throughput trade-off, model selection and routing with a twelvefold saving. Observability: four profiling tools, an eight-panel dashboard with normal ranges, **the order of cost optimisation by return**, and three common complaints with worked diagnoses.

306 pages, eighteen chapters, 309 sections. Built on mechanisms, with worked examples — and the recurring lesson that **the problems of GPU systems are rarely where the attention is.**`,
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
