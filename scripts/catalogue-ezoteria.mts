/**
 * The esoteric shelf's long volumes.
 *
 * Separate from the Tibetan series, because they do not belong to it: the
 * series name is printed on the cover, and "Tibeti ösvények" above a book
 * on Hermetic and Taoist beauty lore would simply be wrong.
 */
import path from "node:path";

import type { CatalogueEntry } from "./catalogue.mts";

const DIR = "c:\\Users\\mzolt\\Desktop\\ClaudProjects\\nagy_konyvek";
const f = (name: string) => path.join(DIR, name);

const AUTHOR = "Molnár Zoltán";
const SERIES = "Ezoterikus nagykönyvek";

export const ESOTERIC_BOOKS: CatalogueEntry[] = [
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
