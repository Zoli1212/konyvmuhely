/**
 * The long volumes that are not Tibetan — the yoga and esoteric shelves.
 *
 * Separate from the Tibetan series, because they do not belong to it: the
 * series name is printed on the cover, and "Tibeti ösvények" above a book
 * on Hermetic beauty lore or the serpent power would simply be wrong.
 *
 * They share a series line but not a shelf: each entry names its own.
 */
import path from "node:path";

import type { CatalogueEntry } from "./catalogue.mts";

const DIR = "c:\\Users\\mzolt\\Desktop\\ClaudProjects\\nagy_konyvek";
const f = (name: string) => path.join(DIR, name);

const AUTHOR = "Molnár Zoltán";
const SERIES = "Ezoterikus nagykönyvek";

export const ESOTERIC_BOOKS: CatalogueEntry[] = [
  {
    slug: "kundalini-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("kundalini_nagykonyve/A kundalini nagykonyve.pdf"),
    downloadName: "A-kundalini-nagykonyve.pdf",
    pages: 168,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "YOGA",
    featured: true,
    accent: "saffron",
    mark: "flame",

    titleHu: "A Kundaliní Nagykönyve",
    titleEn: "The Great Book of Kundalini",
    subtitleHu: "A kígyóerő teljes útja: felébresztés, krízis, integráció",
    subtitleEn:
      "The full path of the serpent power: awakening, crisis, integration",
    coverTitle: "A Kundaliní Nagykönyve",
    coverSubtitle: "A kígyóerő teljes útja",

    blurbHu:
      "Nádík, csakrák és granthik, az öt váju és az ódzsasz, bandhák és mudrák, a pránájáma mint motor, a felébresztés négy útja, belső alkímia, tünettan, a kundaliní-krízis kezelése, árnyék és sziddhik, végül a stabilizáció. Tizenhét fejezet, több mint száz alfejezet.",
    blurbEn:
      "Nadis, chakras and granthis, the five vayus and ojas, bandhas and mudras, pranayama as the engine, the four roads to awakening, inner alchemy, symptomatology, handling a kundalini crisis, shadow and siddhis, and finally stabilisation. Seventeen chapters, over a hundred sections.",

    descriptionHu: `A kundaliníról két dolgot szokás írni: vagy misztikus ködöt, vagy ijesztgetést. Ez a könyv egyiket sem teszi. Öt tételben kimondja, **mit állít a hagyomány** — és hat pontban azt is, **mit nem**, mert a félreértések ott kezdődnek, hogy valaki többet olvas bele, mint ami benne van.

A szerkezet végigviszi az egész utat, és a súlypontja nem ott van, ahol a legtöbb kiadványé.

**A finomtest anatómiája:** az öt burok, a prána és az öt váju, az alvájuk, a nádík rendszere, idá és pingalá a szvara-jógával, a szusumná és a benne futó csatornák, a **három granthi**, a bindu, az amrita és az ódzsasz. Külön alfejezet arról, hogyan térképezd fel a sajátodat — és egy a fogalmak használati szabályáról.

**A csakrák** egyenként, a gyökértől az ezerszirmúig, pszichológiai olvasattal és a tengely dinamikájával.

Az ötödik fejezet címe önmagáért beszél: **„Előkészítés: a tartály építése"** — és az első alfejezete az, hogy *miért ez a könyv legfontosabb fejezete*. Idegrendszer, alvás, étrend, jama és nijama nem erkölcstanként, hanem statikaként, brahmacsarja a maga valóságában, kilencven napos alapozó program — és egy alfejezet arról, **mikor ne kezdj bele**.

Onnan a **test:** sátkarma, a számító ászanák, múla, uddíjána és dzsálandhara bandha, mahá bandha, mahámudrá, a gerinchullám, khécsarí. Majd a **pránájáma** mint motor, a **mantra és a nádá**, az adzsapá-dzsapa, és a **belső alkímia** nap-hold rendszere a nektárral, a kis keringéssel és a vizualizáció csapdáival.

Ami a könyvet komollyá teszi, az a következő három fejezet.

**Tünettan.** Hő és hideg, remegés és kriyák, spontán testhelyzetek, fényjelenségek, belső hangok, erotikus hullámok, érzelmi kitörések, spontán kumbhaka — és egy alfejezet arról, **mi nem kundaliní**.

**A kundaliní-krízis.** A négy út a bajba, súlyossági fokozatok, az első lépés a fékezés, a földelés eszköztára, **kundaliní vagy pszichózis**, kihez fordulj, orvosok és gyógyszerek, a hosszú lábadozás, hogyan segíts másnak, és a megelőzés tizenkét szabálya.

**Az árnyék.** Düh, halálfélelem, szégyen és trauma, hatalom, magány, a tanító kérdése, a közösségek árnyéka, a spirituális versengés — és a **visszaélés felismerése és a kilépés**.

Végül a stabilizáció és az integráció: az első hetek, a kapcsolatok, a szahadzsa állapot, mit mondj és mit ne, tíz év múlva.

Függelék: szószedet, csakratáblázat, technikák gyorstáblája, napi rendek, **kétéves ív**, ellenjavallatok, **elsősegély — mit csinálj, ha…**, mítoszok és tévhitek, naplósablon, huszonöt kérdéses ellenőrzőlista.

168 oldal, tizenhét fejezet.`,
    descriptionEn: `Two things usually get written about kundalini: mystical fog, or scare stories. This book does neither. It states in five propositions **what the tradition claims** — and in six points **what it does not**, because misunderstanding starts when someone reads more into it than is there.

The structure covers the whole path, and its centre of gravity is not where most publications put theirs.

**The anatomy of the subtle body:** the five sheaths, prana and the five vayus, the sub-vayus, the system of nadis, ida and pingala with svara yoga, sushumna and the channels within it, the **three granthis**, bindu, amrita and ojas. A section of its own on mapping your own — and another on how the terminology may be used.

**The chakras** one by one, from root to thousand-petalled, with a psychological reading and the dynamics of the axis.

The fifth chapter's title speaks for itself: **"Preparation: building the vessel"** — and its first section is *why this is the most important chapter in the book*. Nervous system, sleep, diet, yama and niyama treated as statics rather than moralising, brahmacharya as it actually is, a ninety-day groundwork programme — and a section on **when not to begin**.

From there the **body:** shatkarma, the asanas that matter, mula, uddiyana and jalandhara bandha, maha bandha, mahamudra, the spinal wave, khechari. Then **pranayama** as the engine, **mantra and nada**, ajapa-japa, and the **inner alchemy** of sun and moon with the nectar, the microcosmic orbit and the traps of visualisation.

What makes the book serious are the three chapters that follow.

**Symptomatology.** Heat and cold, trembling and kriyas, spontaneous postures, light phenomena, inner sounds, erotic waves, emotional outbursts, spontaneous kumbhaka — and a section on **what is not kundalini**.

**The kundalini crisis.** The four roads into trouble, degrees of severity, braking as the first step, the grounding toolkit, **kundalini or psychosis**, who to turn to, doctors and medication, the long convalescence, how to help someone else, and twelve rules of prevention.

**The shadow.** Anger, fear of death, shame and trauma, power, loneliness, the question of the teacher, the shadow side of communities, spiritual competitiveness — and **recognising abuse and getting out**.

Finally stabilisation and integration: the first weeks, relationships, the sahaja state, what to say and what not to, ten years on.

Appendix: glossary, chakra table, a quick table of techniques, daily routines, a **two-year arc**, contraindications, **first aid — what to do if…**, myths and misconceptions, a journal template, a twenty-five question checklist.

168 pages, seventeen chapters.`,
  },
  {
    slug: "szepseg-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("szepseg_nagykonyve/A szepseg nagykonyve.pdf"),
    downloadName: "A-szepseg-nagykonyve.pdf",
    pages: 279,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "ESOTERIC",
    featured: true,
    accent: "amethyst",
    mark: "lotus",

    titleHu: "A Szépség Nagykönyve",
    titleEn: "The Great Book of Beauty",
    subtitleHu: "Ezoterikus szépségtan: sugárzás, finomtest, jelenlét",
    subtitleEn: "An esoteric science of beauty: radiance, subtle body, presence",
    coverTitle: "A Szépség Nagykönyve",
    coverSubtitle: "Sugárzás és jelenlét",

    blurbHu:
      "A szépség nem adottság, hanem erő — ami árad, és amit gyakorolni lehet. Aura és ódzsasz, a csakrák és az arc, tekintet és trátaka, hang és jelenlét, pszionika, magnetizmus, szexuális energia, rituálé, árnyékmunka és az öregedés energetikája. Tizenhét fejezet, több mint száz alfejezet.",
    blurbEn:
      "Beauty is not a given but a force — something that radiates, and something that can be practised. Aura and ojas, the chakras and the face, gaze and trataka, voice and presence, psionics, magnetism, sexual energy, ritual, shadow work and the energetics of ageing. Seventeen chapters, over a hundred sections.",

    descriptionHu: `A hétköznapi gondolkodás a szépséget tulajdonságnak tekinti: valaki szép vagy nem szép, ahogy valaki magas vagy alacsony. Adottság, amihez legfeljebb hozzá lehet tenni kozmetikával, és ami az évekkel fogy.

Az ezoterikus hagyományok — a platonikustól a hermetikuson és a tantrikuson át a taoistáig — egységesen másként kezelik. **A szépség nem állapot, hanem erő**: valami, ami árad, és aminek a mennyisége és minősége változtatható. Nem birtokolod; csinálod, pillanatról pillanatra.

A könyv azzal a bizonyítékkal kezd, amit bárki ellenőrizhet. Nézz meg valakit reggel, kialvatlanul, egy rossz hír után — és ugyanazt az embert aznap este, miután valami jó történt vele. A csontszerkezet ugyanaz, a bőr ugyanaz. Mégis más ember néz vissza rád. **Ami megváltozott, az nem a forma, hanem a sugárzás.**

És amit a hagyomány **nem** állít: hogy a genetika ne számítana. A csontszerkezetet, a bőrtípust, a testalkatot energiamunkával nem lehet megváltoztatni, és aki ilyet ígér, az hazudik. Az állítás szerényebb és pontosabb — a formán belül hatalmas tartomány van, és a legtöbb ember ennek az alsó harmadában él.

A rendszer szétválasztja a **három szépséget**, mert a legtöbb félreértés abból ered, hogy összekeverjük őket: a **forma** (rúpa), a **sugárzás** és a **jelenlét**.

Innen a metafizika — a platóni Szép ideája, a hermetikus hagyomány, Tiferet a kabbalában, Lalitá Tripuraszundarí, a taoista szépségtan, a Vénusz-archetípus —, de végig azzal a kérdéssel, hogy **mit tartsunk meg és mit vessünk el**.

Azután a gyakorlat. **A finomtest:** az aura rétegei, a csakrák és az arc, az **ódzsasz** és a **tedzsasz**, a nádik és a bőr. **A test mint hordozó:** légzés és arcszín, testtartás, alvás, táplálkozás, fény, földelés.

**A szem:** a tekintet mint energiaáram, a **trátaka**, a szemkontaktus gyakorlása, a „rossz szem" és a védelem. **Az arc:** fiziognómia, feszültségminták és karakterpáncél, arclazítás, a belső mosoly, arc-jóga, masszázs. **A hang:** hangszín és energiaállapot, mantra, éneklés, a csend ereje, és a jelenlét, ami a hangon túl van.

**Meditáció szépséggyakorlatként:** fénymeditáció, szívközpont, tükör- és önképmeditáció. **Pszionika:** gondolatforma, intenció, töltés, védelem, pszi-higiénia — külön alfejezettel a biztonságról, a határokról és a gyakori hibákról.

**Magnetizmus és glamour**, a karizma felépítése — és az is, **amikor a vonzerő árt**. **Szexuális energia:** megtartás, szublimáció, az ódzsasz építése, a ciklusok, a mérték kérdése. **Kristályok, illatok, eszközök** — benne egy alfejezet arról, **mi működik és mi placebo**. **Rituálé és ciklusok:** a holdciklus, a Vénusz-nap, a magyar népi szépséghagyomány.

Két fejezet, ami nélkül ez a könyv hiányos lenne. **Az árnyék:** a szépség mint menekülés, a tükörfüggőség, a testkép torzulásai, a tökéletességigény — és hogy **mikor kell szakember**. **Az öregedés:** mi öregszik és mi nem, az arc az évtizedekben, a méltóság mint szépségforma, a halál és a szépség.

Függelék: glosszárium, a gyakorlatok összefoglaló táblája, napi, heti és éves rend, hibakereső táblázat, a hagyományok összehasonlítása, **amit a tudomány mond**, biztonsági útmutató, és egy hároméves terv.

279 oldal, tizenhét fejezet. Harmincnapos indító programmal.`,
    descriptionEn: `Everyday thinking treats beauty as a property: someone is beautiful or not, the way someone is tall or short. A given, to which cosmetics can add a little, and which the years take away.

The esoteric traditions — Platonic, Hermetic, tantric and Taoist alike — treat it differently. **Beauty is not a state but a force**: something that radiates, whose quantity and quality can be changed. You do not possess it; you do it, moment by moment.

The book opens with evidence anyone can check. Look at someone in the morning, short of sleep, after bad news — and at the same person that evening, after something good has happened. The bone structure is the same. The skin is the same. Yet a different person looks back at you. **What changed is not the form but the radiance.**

And what the tradition does **not** claim: that genetics do not matter. Bone structure, skin type and build cannot be changed by energy work, and anyone promising otherwise is lying. The claim is more modest and more exact — within the form there is an enormous range, and most people live in the bottom third of it.

The system separates the **three beauties**, because most confusion comes from mixing them up: **form** (rupa), **radiance** and **presence**.

From there the metaphysics — the Platonic idea of the Beautiful, the Hermetic tradition, Tiferet in Kabbalah, Lalita Tripurasundari, Taoist beauty lore, the Venus archetype — always with the question of **what to keep and what to discard**.

Then the practice. **The subtle body:** the layers of the aura, the chakras and the face, **ojas** and **tejas**, the nadis and the skin. **The body as vehicle:** breath and complexion, posture, sleep, diet, light, grounding.

**The eye:** gaze as a current, **trataka**, practising eye contact, the "evil eye" and protection. **The face:** physiognomy, tension patterns and character armour, facial release, the inner smile, face yoga, massage. **The voice:** timbre and energetic state, mantra, singing, the power of silence, and the presence beyond the voice.

**Meditation as beauty practice:** light meditation, the heart centre, mirror and self-image meditation. **Psionics:** thought-form, intention, charging, protection, psi-hygiene — with a section of its own on safety, limits and the common errors.

**Magnetism and glamour**, building charisma — and also **when attraction does harm**. **Sexual energy:** retention, sublimation, building ojas, the cycles, the question of measure. **Crystals, scents, tools** — including a section on **what works and what is placebo**. **Ritual and cycles:** the lunar cycle, the day of Venus, Hungarian folk beauty lore.

Two chapters without which the book would be incomplete. **The shadow:** beauty as escape, mirror dependence, distortions of body image, perfectionism — and **when a professional is needed**. **Ageing:** what ages and what does not, the face across the decades, dignity as a form of beauty, death and beauty.

Appendix: glossary, a summary table of the practices, daily, weekly and yearly rhythms, a troubleshooting table, a comparison of the traditions, **what science says**, a safety guide, and a three-year plan.

279 pages, seventeen chapters. With a thirty-day starter programme.`,
  },
];
