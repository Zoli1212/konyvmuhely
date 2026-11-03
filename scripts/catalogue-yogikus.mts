/**
 * The Yogikus Könyvtár handbooks.
 *
 * Short, dense volumes, all at the same price. Ordered by theme rather than
 * by volume number or alphabet, so the catalogue reads as a path: the subtle
 * body first, then kundalini, tantra, healing, mind, and the Tibetan
 * material last.
 *
 * Every description is written from the book's own title page and opening
 * chapter.
 */
import path from "node:path";

import type { CatalogueEntry } from "./catalogue.mts";

const DIR = "c:\\Users\\mzolt\\Desktop\\ClaudProjects\\yogikus";
const f = (name: string) => path.join(DIR, name);

const AUTHOR = "Molnár Zoltán";
const SERIES = "Yogikus könyvtár";
/** Standard price for the series; an entry may override it. */
const PRICE = 990;

type Entry = Omit<CatalogueEntry, "author" | "series" | "priceHuf"> & {
  priceHuf?: number;
};

const ENTRIES: Entry[] = [
  // ---------- the subtle body ----------
  {
    slug: "csakrak-kezikonyve",
    file: f("csakrak_kezikonyv.pdf"),
    downloadName: "A-csakrak-kezikonyve.pdf",
    pages: 12,
    accent: "amethyst",
    mark: "lotus",
    titleHu: "A Csakrák Kézikönyve",
    titleEn: "The Handbook of the Chakras",
    subtitleHu: "A hét belső lótusz anatómiája",
    subtitleEn: "The anatomy of the seven inner lotuses",
    blurbHu:
      "A hét fő energiaörvény anatómiája a klasszikus tantrikus hagyomány szerint: szimbolika, tattvák, bídzsa-mantrák, a három granthi feloldása és a Kundaliní Sakti felemelkedésének lépései.",
    blurbEn:
      "The anatomy of the seven main energy centres in the classical tantric tradition: symbolism, tattvas, bija mantras, the untying of the three granthis, and the stages of the rising of Kundalini Shakti.",
    descriptionHu: `A „csakra" szó szerint kereket, örvényt jelent, de a szövegek még gyakrabban beszélnek padmáról, lótuszról. A kép nem véletlen: a lótusz a sötét iszapból gyökerezik, átnő a zavaros vízen, és a felszín fölött tárja ki szirmait.

A csakrák nem szervek. A pránamaja-kósa és a manómaja-kósa finom feszültségi csomópontjai, amelyek a gerinc tengelyében, a csitriní nádí mentén fűződnek fel, mint gyöngyök egy láncon.

A füzet végigveszi mind a hetet hatdimenziós szerkezetük szerint, és bemutatja a három granthi — a csomók — feloldását, amelyek nélkül a felemelkedés megakad.

Források: Sat-cakra-nirúpana, Góraksa Paddhati, Siva Szamhitá. 12 oldal.`,
    descriptionEn: `"Chakra" literally means wheel or vortex, but the texts speak more often of padma, the lotus. The image is deliberate: the lotus roots in dark mud, grows through troubled water, and opens its petals above the surface.

Chakras are not organs. They are subtle nodes of tension and awareness in the pranamaya and manomaya kosha, strung along the central axis of the spine on the chitrini nadi like beads on a thread.

The booklet works through all seven in their six-dimensional structure, and covers the untying of the three granthis — the knots — without which the ascent stalls.

Sources: Sat-chakra-nirupana, Goraksha Paddhati, Shiva Samhita. 12 pages.`,
  },
  {
    slug: "aura-kezikonyve",
    file: f("aura_kezikonyv.pdf"),
    downloadName: "Az-aura-kezikonyve.pdf",
    pages: 12,
    accent: "jade",
    mark: "sun",
    titleHu: "Az Aura Kézikönyve",
    titleEn: "The Handbook of the Aura",
    subtitleHu: "Az emberi energiamező és a fényburok misztériuma",
    subtitleEn: "The human energy field and the mystery of the light sheath",
    blurbHu:
      "A Taittiríja-upanisad öt kosája, az aura rétegei és színei, a pszichikai védelem technikái, és az energiatest érzékelésének gyakorlása.",
    blurbEn:
      "The five koshas of the Taittiriya Upanishad, the layers and colours of the aura, techniques of psychic protection, and training in perceiving the energy body.",
    descriptionHu: `Az „aura" a görög szóból ered: szellő, fényfuvallat. A keleti hagyomány prabhá-mandalának, fénylő mandalának nevezi, a belső életerő kisugárzását pedig tedzsasznak vagy ódzsasznak.

A füzet kiindulópontja az, hogy ez nem misztikus fikció: minden élő szervezetet körülvesz és átjár egy többdimenziós bioelektromágneses és finompránikus erőtér. Ahogy a Földet a mágneses mezeje védi a kozmikus sugárzástól, úgy képez az auramező elsődleges pajzsot a tudat és az anyagi világ között.

Az öt kósa rétegről rétegre, a színek jelentése, a mező sérüléseinek felismerése, a tisztítás és a védelem gyakorlatai, végül az érzékelés tanulható módszerei.

12 oldal.`,
    descriptionEn: `"Aura" comes from the Greek for breeze, a breath of light. The Eastern tradition calls this living sheath prabha-mandala, the radiant mandala, and the radiance of inner vitality tejas or ojas.

The booklet starts from the position that this is not mystical fiction: every living organism is surrounded and permeated by a multidimensional bioelectromagnetic and subtle-pranic field. As the Earth's magnetic field shields it from cosmic radiation, the auric field forms the primary shield between consciousness and the material world.

The five koshas layer by layer, the meaning of the colours, recognising damage to the field, practices of cleansing and protection, and finally learnable methods of perception.

12 pages.`,
  },
  {
    slug: "szusumna-nadi-kezikonyve",
    file: f("szusumna_kezikonyv.pdf"),
    downloadName: "A-szusumna-nadi-kezikonyve.pdf",
    pages: 13,
    accent: "lapis",
    mark: "flame",
    titleHu: "A Szusumná Nádí Kézikönyve",
    titleEn: "The Handbook of the Sushumna Nadi",
    subtitleHu: "A belső fény oszlopa — rétegei, áramlása, meditációja",
    subtitleEn: "The column of inner light — its layers, flow and meditation",
    blurbHu:
      "A jóga és a tantra központi energiacsatornája: a koncentrikus rétegek (Vadzsriní, Csitriní, Brahma-nádí), a prána áramlásának törvényei és a magasabb tudatállapotok elérése.",
    blurbEn:
      "The central channel of yoga and tantra: the concentric layers (Vajrini, Chitrini, Brahma-nadi), the laws governing the flow of prana, and the attainment of higher states.",
    descriptionHu: `A jógikus pszichofiziológia szerint a testet 72 000 nádí — finom pránacsatorna — hálózza be; a Siva Szamhitá 350 000-ről beszél. Ezek nem a boncasztalon látható erek vagy idegek, hanem a finomtest fényáramai.

E rengetegből három határozza meg az emberi létezést, és egy közülük a döntő: a szusumná, a központi oszlop. A füzet ennek a szerkezetét bontja ki — a koncentrikus rétegeket a külső Vadzsrinítől a Csitrinín át a legbelső Brahma-nádíig —, és azt, mi kell ahhoz, hogy a prána belépjen.

Források: Sat-cakra-nirúpana, Hatha Jóga Pradípiká, Siva Szamhitá. 13 oldal.`,
    descriptionEn: `Yogic psychophysiology counts 72,000 nadis — subtle channels of prana — throughout the body; the Shiva Samhita speaks of 350,000. These are not the vessels or nerves of the dissection table but the currents of light of the subtle body.

Of all of them, three govern human existence, and one is decisive: the sushumna, the central column. This bookletlet unfolds its structure — the concentric layers from the outer Vajrini through Chitrini to the innermost Brahma-nadi — and what it takes for prana to enter.

Sources: Sat-chakra-nirupana, Hatha Yoga Pradipika, Shiva Samhita. 13 pages.`,
  },
  {
    slug: "ida-es-pingala-nadi-kezikonyve",
    file: f("ida_es_pingala_kezikonyv.pdf"),
    downloadName: "Az-ida-es-pingala-nadi-kezikonyve.pdf",
    pages: 12,
    accent: "saffron",
    mark: "wheel",
    titleHu: "Az Idá és Pingalá Nádí Kézikönyve",
    titleEn: "The Handbook of the Ida and Pingala Nadis",
    subtitleHu: "A Hold és a Nap belső ösvénye — polaritás és szvara jóga",
    subtitleEn: "The inner path of Moon and Sun — polarity and svara yoga",
    blurbHu:
      "A két poláris csatorna energetikája és idegélettana, a szvara jóga orrciklusai, és az egyensúly megteremtésének gyakorlata.",
    blurbEn:
      "The energetics and neurophysiology of the two polar channels, the nasal cycles of svara yoga, and the practice of bringing them into balance.",
    descriptionHu: `„Ami fent van, az van lent is." Ahogy a látható univerzumban a Nap és a Hold váltakozása teremti meg a nappalokat, az évszakokat és az árapályt, úgy irányít az emberi pszichofiziológiában két ősi áramlat minden fizikai és mentális folyamatot.

Az Idá a gerinc bal oldalán fut: hűsítő, befelé forduló, holdtermészetű. A Pingalá a jobb oldalon: hevítő, kifelé forduló, naptermészetű. A kettő egyensúlya nem elvont eszmény — mérhető az orrlégzés ciklusaiban, és befolyásolható.

A füzet a szvara jóga rendszerét adja át: hogyan olvasd le, melyik csatorna aktív, mit érdemes ilyenkor csinálni, és hogyan válts tudatosan.

Források: Siva Szvaródaja, Hatha Jóga Pradípiká, Gheranda Szamhitá. 12 oldal.`,
    descriptionEn: `"As above, so below." As the alternation of Sun and Moon creates days, seasons and tides in the visible universe, two ancient currents govern every physical and mental process in human psychophysiology.

Ida runs along the left of the spine: cooling, inward-turning, lunar in nature. Pingala on the right: heating, outward-turning, solar. Their balance is not an abstract ideal — it is readable in the cycles of nasal breathing, and it can be influenced.

The bookletlet transmits the system of svara yoga: how to read which channel is active, what is worth doing while it is, and how to switch deliberately.

Sources: Shiva Svarodaya, Hatha Yoga Pradipika, Gheranda Samhita. 12 pages.`,
  },
  {
    slug: "harmadik-szem-kezikonyve",
    file: f("harmadik_szem_kezikonyv.pdf"),
    downloadName: "A-harmadik-szem-kezikonyve.pdf",
    pages: 13,
    accent: "amethyst",
    mark: "triple",
    titleHu: "A Harmadik Szem Kézikönyve",
    titleEn: "The Handbook of the Third Eye",
    subtitleHu: "Ádzsnyá csakra és a tobozmirigy misztériuma",
    subtitleEn: "The Ajna chakra and the mystery of the pineal gland",
    blurbHu:
      "A homlokközpont szellemi, neurológiai és ezoterikus anatómiája: a belső látás felébresztésének kriyái, a trátaka és a sámbhaví mudrá, a dekalcifikáció és a pszichés védelem.",
    blurbEn:
      "The spiritual, neurological and esoteric anatomy of the brow centre: the kriyas that awaken inner sight, trataka and shambhavi mudra, decalcification, and psychic protection.",
    descriptionHu: `Az ádzsnyá szanszkritul parancsot, közvetlen irányítást, belső tekintélyt jelent. Ez az a pont, ahol az egyéni tudatosság túllép a kettősségen.

A finomtestben a két polaritás — az Idá és a Pingalá — a gerinc mentén spirálisan emelkedik, és itt olvad össze a központi szusumnával. Ezt a fúziós pontot hívják muktatrivéninek, a felszabadulás hármas összefolyásának. Amikor a prána itt egyesül, a fogalmi elme fecsegése elcsendesedik, és a szubjektum–objektum szétválás megszűnik.

A füzet tárgyalja a tobozmirigy élettanát és a dekalcifikációs eljárásokat, a trátakát és a sámbhaví mudrát, valamint — és ez fontos — a pszichés védelmet, amelyet a megnyíló érzékelés megkövetel.

13 oldal.`,
    descriptionEn: `Ajna in Sanskrit means command, direct governance, inner authority. This is the point where individual awareness steps past duality.

In the subtle body the two polarities — Ida and Pingala — spiral up along the spine and merge here with the central sushumna. This fusion point is called muktatriveni, the triple confluence of liberation. When prana unites here, the chatter of the conceptual mind falls quiet and the split between subject and object dissolves.

The bookletlet covers the physiology of the pineal gland and decalcification protocols, trataka and shambhavi mudra, and — importantly — the psychic protection that opening perception demands.

13 pages.`,
  },

  // ---------- kundalini ----------
  {
    slug: "kundalini-felebresztese",
    file: f("kundalini_felebresztese_kezikonyv.pdf"),
    downloadName: "A-kundalini-felebresztese.pdf",
    pages: 10,
    accent: "copper",
    mark: "flame",
    titleHu: "A Kundaliní Felébresztése",
    titleEn: "Awakening the Kundalini",
    subtitleHu: "A kígyótűz misztériuma — gyakorlatok, zárak, integráció",
    subtitleEn: "The mystery of the serpent fire — practices, locks, integration",
    blurbHu:
      "A mikrokozmoszban szunnyadó őserő: a felébredés mechanikája, a prána és az apána egyesítése, a zárak szerepe, és az integráció — amiről a legtöbb forrás hallgat.",
    blurbEn:
      "The primal force asleep in the microcosm: the mechanics of awakening, the union of prana and apana, the role of the locks, and integration — which most sources leave out.",
    descriptionHu: `A kundaliní szó a kundala (tekervény, gyűrű) és a kunda (mélyedés, áldozati tűzgödör) szavakból ered. Jelentése: az összetekeredett kígyóerő, vagy a belső áldozati tűz ereje.

A tantrikus kozmológiában a kundaliní nem elszigetelt emberi energia, hanem maga a Mahásakti, az egyetemes teremtő erő, amely az emberi mikrokozmoszban egyetlen szunnyadó magként van jelen. Ő a teremtés dinamikus pólusa; párja, Siva, a mozdulatlan tudatosság, a fejtetőn, a szahaszrára lótuszában honol.

A füzet a három és fél csavarulat misztériumával indul, majd a felébredés tényleges mechanikájára tér: a prána és az apána egyesítésére, a zárakra, és arra, ami a legtöbb leírásból hiányzik — az integrációra.

Források: Hatha Jóga Pradípiká, Jóga Kundaliní Upanisad, Siva Szamhitá. 10 oldal.`,
    descriptionEn: `The word kundalini derives from kundala (a coil, a ring) and kunda (a hollow, a sacrificial fire pit). It means the coiled serpent power, or the force of the inner sacrificial fire.

In tantric cosmology kundalini is not an isolated human energy but Mahashakti herself, the universal creative force, present in the human microcosm as a single sleeping seed. She is the dynamic pole of creation; her counterpart Shiva, motionless awareness, dwells at the crown in the sahasrara lotus.

The bookletlet opens with the mystery of the three and a half coils, then turns to the actual mechanics of awakening: the union of prana and apana, the locks, and what most accounts omit — integration.

Sources: Hatha Yoga Pradipika, Yoga Kundalini Upanishad, Shiva Samhita. 10 pages.`,
  },
  {
    slug: "titkos-kundalini-meditaciok",
    file: f("titkos_kundalini_meditaciok_kezikonyv.pdf"),
    downloadName: "Titkos-kundalini-meditaciok.pdf",
    pages: 11,
    accent: "gold",
    mark: "flame",
    titleHu: "Titkos és Mágikus Kundaliní Meditációk",
    titleEn: "Secret and Magical Kundalini Meditations",
    subtitleHu: "Laja jóga, krijá dhjána, náda vidjá — VIII. kötet",
    subtitleEn: "Laya yoga, kriya dhyana, nada vidya — Volume VIII",
    blurbHu:
      "A rahaszja dhjána, a rejtett meditációk gyakorlata: laja jóga, krijá dhjána, náda vidjá és a belső tűz munkája.",
    blurbEn:
      "Rahasya dhyana, the practice of the hidden meditations: laya yoga, kriya dhyana, nada vidya, and the work of the inner fire.",
    descriptionHu: `A rahaszja szanszkritul titkot, rejtett misztériumot jelent. A kundaliní meditációi nem azért titkosak, mert egy szűk kaszt el akarná zárni őket, hanem azért, mert a megfelelő előkészület nélkül nem működnek — vagy rosszul működnek.

Ez a füzet a Yogikus Könyvtár nyolcadik darabja, és a meditációs oldalra összpontosít: a laja jógára, amelyben a tudat feloldódik; a krijá dhjánára; a náda vidjára, a belső hang útjára; és a belső tűz munkájára.

Források: Sankara Jógatárávalí, Hatha Jóga Pradípiká, Vidzsnyána Bhairava Tantra. 11 oldal.

A *Kundaliní felébresztése* füzet ismerete ajánlott.`,
    descriptionEn: `Rahasya is Sanskrit for secret, hidden mystery. The kundalini meditations are not secret because some narrow caste wants them withheld, but because without the right preparation they do not work — or work badly.

This is the eighth volume of the Yogikus Library and concentrates on the meditative side: laya yoga, in which awareness dissolves; kriya dhyana; nada vidya, the path of inner sound; and the work of the inner fire.

Sources: Shankara Yogataravali, Hatha Yoga Pradipika, Vijnana Bhairava Tantra. 11 pages.

Familiarity with *Awakening the Kundalini* is recommended.`,
  },
  {
    slug: "also-zarak-es-energiakapuk",
    file: f("asvini_mudra_es_mula_bandha_kezikonyv.pdf"),
    downloadName: "Az-also-zarak-es-energiakapuk-kezikonyve.pdf",
    pages: 11,
    accent: "copper",
    mark: "knot",
    titleHu: "Az Alsó Zárak és Energiakapuk Kézikönyve",
    titleEn: "The Handbook of the Lower Locks and Energy Gates",
    subtitleHu: "Asvini mudrá, múla bandha, szahadzsólí",
    subtitleEn: "Ashvini mudra, mula bandha, sahajoli",
    blurbHu:
      "A kismedencei kontroll és az apána prána uralása: a gyökérkapu élettana, a zárak pontos kivitelezése, és a két rekeszizom rezonanciája.",
    blurbEn:
      "Pelvic control and mastery of apana prana: the physiology of the root gate, the precise execution of the locks, and the resonance of the two diaphragms.",
    descriptionHu: `A jóga ezoterikus anatómiájában a törzs legalsó része — a medencefenék, a gát és a végbélnyílás területe — nem csupán a kiválasztás és a szaporodás zónája, hanem a teljes energiatest legfőbb fundamentuma: a gyökérkapu.

Fizikai szinten a medencefenék izomzata rugalmas függőágyat képez, amely megtámasztja a belső szerveket és stabilizálja a medenceövet. A modern ülő életmód, a krónikus stressz és a helytelen testtartás miatt ez az izomcsoport vagy krónikusan letapadt és merev, vagy elernyedt és tónustalan. Egyik állapotban sem működik záróként.

A füzet végigviszi az asvini mudrát, a múla bandhát és a szahadzsólít pontos kivitelezéssel, és bemutatja a két rekeszizom — a légzési és a medencei — rezonanciáját, amely az egész rendszert összekapcsolja.

Források: Gheranda Szamhitá, Hatha Jóga Pradípiká, Siva Szamhitá. 11 oldal.`,
    descriptionEn: `In the esoteric anatomy of yoga the lowest part of the trunk — the pelvic floor, the perineum, the anal region — is not merely a zone of elimination and reproduction but the foundation of the entire energy body: the root gate.

Physically the pelvic floor muscles form an elastic hammock supporting the internal organs and stabilising the pelvic girdle. Modern sedentary life, chronic stress and poor posture leave this group either chronically gripped and rigid, or slack and without tone. In neither state does it function as a lock.

The bookletlet works through ashvini mudra, mula bandha and sahajoli with precise execution, and presents the resonance of the two diaphragms — respiratory and pelvic — that couples the whole system.

Sources: Gheranda Samhita, Hatha Yoga Pradipika, Shiva Samhita. 11 pages.`,
  },
  {
    slug: "foldeles-es-energiak-levezetese",
    file: f("foldeles_energiak_levezetese_es_gyogyulas_kezikonyv.pdf"),
    downloadName: "A-foldeles-es-energiak-levezetese.pdf",
    pages: 13,
    accent: "jade",
    mark: "wheel",
    titleHu: "A Földelés és az Energiák Levezetése",
    titleEn: "Grounding and Discharging Energy",
    subtitleHu: "A belső stabilitás alkémiája — XVIII. kötet",
    subtitleEn: "The alchemy of inner stability — Volume XVIII",
    blurbHu:
      "A pránikus túltöltődés levezetése, az idegrendszeri kisülés és a sejtszintű regeneráció. Arról, ami a legtöbb spirituális ösvényről hiányzik.",
    blurbEn:
      "Discharging pranic overload, nervous-system release and cellular regeneration. About the thing most spiritual paths leave out.",
    descriptionHu: `„Miért bukik el a földetlen gyakorló?" — ezzel a kérdéssel nyit a füzet, és a válasz az egész könyv tétje.

A spirituális ösvények legnagyobb, gyakran tragikus félreértése a magasság kizárólagos imádata. A felületes jógaoktatás szinte kizárólag a felső központokat sürgeti: a harmadik szemet, a koronacsakrát, a fénybe emelkedést. Van azonban egy törvény, amelyet sem a fizika, sem az ezoterikus anatómia nem kerülhet meg: **semmilyen villám nem csaphat le biztonságosan olyan épületbe, amelynek nincs földelése.**

Amikor a gyakorló pránájámákat, krijákat és mély kundaliní-meditációkat végez, nagy feszültségű áramot gerjeszt a finomtestében. Ha a nádík még nem tiszták, vagy a gyökérkapu zárva van, ez a túlfeszültség megreked a felsőtestben. Az eredmény nem megvilágosodás, hanem energetikai rövidzárlat: pánik, belső remegés, álmatlanság, migrén, szívritmuszavar.

A füzet ennek a levezetését tanítja: a bhúmi szparsát, az idegrendszeri kisülés módszereit és a sejtszintű regenerációt.

13 oldal. Ha intenzíven gyakorolsz, ezt olvasd el elsőként.`,
    descriptionEn: `"Why does the ungrounded practitioner fail?" The booklet opens with that question, and the answer is what the whole volume is about.

The greatest and often tragic misunderstanding on spiritual paths is the exclusive worship of height. Superficial teaching urges the upper centres almost exclusively: the third eye, the crown, ascent into light. But there is a law neither physics nor esoteric anatomy can evade: **no lightning strikes safely into a building that has no earth.**

When a practitioner performs pranayama, kriyas and deep kundalini meditation, they generate a high-voltage current in the subtle body. If the nadis are not yet clear, or the root gate is closed, that overload lodges in the upper body. The result is not enlightenment but an energetic short circuit: panic, inner trembling, insomnia, migraine, cardiac arrhythmia.

The bookletlet teaches the discharge: bhumi sparsha, methods of nervous-system release, and cellular regeneration.

13 pages. If you practise intensively, read this one first.`,
  },

  // ---------- tantra ----------
  {
    slug: "tantra-alapkonyve",
    file: f("tantra_alapkonyv.pdf"),
    downloadName: "A-tantra-alapkonyve.pdf",
    pages: 11,
    accent: "amethyst",
    mark: "knot",
    titleHu: "A Tantra Alapkönyve",
    titleEn: "The Foundations of Tantra",
    subtitleHu: "A szakrális energetika és a Siva–Sakti unió — XV. kötet",
    subtitleEn: "Sacred energetics and the Shiva–Shakti union — Volume XV",
    blurbHu:
      "A nem-kettős tantrizmus belső alkímiája: a vitális energia transzmutálása ódzsasszá, a Srí Jantra geometriája és a 112 tudatkapu.",
    blurbEn:
      "The inner alchemy of non-dual tantra: transmuting vital energy into ojas, the geometry of the Sri Yantra, and the 112 gates of consciousness.",
    descriptionHu: `A tantrát a modern világ gyakran leegyszerűsíti szexuális technikák gyűjteményévé. A klasszikus indiai és tibeti hagyományban azonban a létezés legradikálisabb szellemi útja.

A szó két gyökből ered: *tan* — kiterjeszteni, kitágítani a tudatot — és *tra* — felszabadítani. A tantra jelentése tehát: a tudatosság kiterjesztése az anyagon keresztül a végső megszabadulásig.

Ez a radikális világigenlés különbözteti meg az aszketikus ösvényektől. Ahol azok a testet, a vágyat és a világot akadálynak tekintik, ott a tantra nem elnyomja az energiát, hanem üzemanyaggá alakítja. A világ nem ellenség, hanem az isteni energia eleven megnyilvánulása, a lílá, az isteni játék.

A füzet a kasmíri saivizmus, a kula és a kaula ösvények anyagát dolgozza fel: a Siva–Sakti uniót, a vitális energia ódzsasszá alakítását, a Srí Jantra geometriáját és a Vidzsnyána Bhairava 112 tudatkapuját.

11 oldal.`,
    descriptionEn: `The modern world often reduces tantra to a collection of sexual techniques. In the classical Indian and Tibetan traditions it is the most radical spiritual path there is.

The word has two roots: *tan* — to extend, to expand awareness — and *tra* — to liberate. Tantra therefore means: the expansion of consciousness through matter to final liberation.

This radical affirmation of the world is what distinguishes it from ascetic paths. Where those treat the body, desire and the world as obstacles, tantra does not suppress energy but converts it into fuel. The world is not an enemy but the living manifestation of divine energy — lila, the divine play.

The bookletlet draws on Kashmir Shaivism and the Kula and Kaula paths: the Shiva–Shakti union, the transmutation of vital energy into ojas, the geometry of the Sri Yantra, and the 112 gates of the Vijnana Bhairava.

11 pages.`,
  },
  {
    slug: "tantrikus-szex-kezikonyve",
    file: f("tantrikus_szex_kezikonyv.pdf"),
    downloadName: "A-tantrikus-szex-kezikonyve.pdf",
    pages: 15,
    accent: "copper",
    mark: "lotus",
    titleHu: "A Tantrikus Szex Kézikönyve",
    titleEn: "The Handbook of Tantric Sex",
    subtitleHu: "A szakrális szexualitás és a maithuna — XIX. kötet",
    subtitleEn: "Sacred sexuality and maithuna — Volume XIX",
    blurbHu:
      "A bioelektromos polaritás törvényei, a kobra-légzés, a magmegtartás, a völgyorgazmus, és a maithuna mozdulatlan fúziója.",
    blurbEn:
      "The laws of bioelectric polarity, the cobra breath, seminal retention, the valley orgasm, and the motionless fusion of maithuna.",
    descriptionHu: `A modern civilizáció a szexualitást két szélsőség közé szorította: a merev bűntudat és a kiüresedett, mechanikus hedonizmus közé. A digitális világban az érzékek túlingerlése és a pillanatnyi dopaminhajsza miatt a szex elveszítette szakrális mélységét. Az ára krónikus kimerültség, szorongás és elidegenedés.

A tantrikus hagyomány nem utasítja el a vágyat, és nem is hódol be neki öncélúan. Felismeri, hogy a szexuális energia a világegyetem legkoncentráltabb teremtő ereje — a Sakti eleven tüze a húsban —, és a beavatott kezében a legmagasabb rendű szádhanává válik.

A füzet a négy életcél és a káma megszentelésétől indul, majd a gyakorlat felé fordul: a bioelektromos polaritás törvényei, a jóni és a lingam anatómiája, a kobra-légzés, a vadzsrólí, a női völgyorgazmus, és a maithuna mozdulatlan fúziója.

15 oldal. Felnőtt olvasóknak.`,
    descriptionEn: `Modern civilisation has squeezed sexuality between two extremes: rigid guilt and hollow, mechanical hedonism. In the digital world, overstimulated senses and the chase for momentary dopamine have cost sex its sacred depth. The price is chronic exhaustion, anxiety and estrangement.

The tantric tradition neither rejects desire nor submits to it for its own sake. It recognises that sexual energy is the most concentrated creative force in the universe — the living fire of Shakti in flesh — and that in trained hands it becomes the highest form of sadhana.

The bookletlet begins with the four aims of life and the sanctification of kama, then turns to practice: the laws of bioelectric polarity, the anatomy of yoni and lingam, the cobra breath, vajroli, the female valley orgasm, and the motionless fusion of maithuna.

15 pages. For adult readers.`,
  },

  // ---------- healing ----------
  {
    slug: "betegsegek-gyogyitasa-kundalini-jogaval",
    file: f("kundalini_gyogyitas_kezikonyv.pdf"),
    downloadName: "Betegsegek-gyogyitasa-kundalini-jogaval.pdf",
    pages: 11,
    accent: "jade",
    mark: "lotus",
    titleHu: "Betegségek Gyógyítása Kundaliní Jógával",
    titleEn: "Healing Illness with Kundalini Yoga",
    subtitleHu: "A pránikus terápia kézikönyve — csakraterápia, kriják, mantrák",
    subtitleEn: "A handbook of pranic therapy — chakra therapy, kriyas, mantras",
    blurbHu:
      "A testi és lelki betegségek gyökerének feltárása és kezelése: a hét csakra pszichoszomatikája, a pránikus zárlatok oldása, kriják és mantrák.",
    blurbEn:
      "Finding and treating the root of physical and psychological illness: the psychosomatics of the seven chakras, releasing pranic blockages, kriyas and mantras.",
    descriptionHu: `A nyugati orvostudomány döntően a fizikai tünetek biokémiai elnyomására összpontosít. A jógikus orvoslás — a prána csikitszá — alapelve ezzel szemben így hangzik: minden fizikai betegség egy finomenergetikai elakadás anyagi megszilárdulása.

A betegség kialakulása három fázisra bontható. Először az ádhi: a félelem, a harag, az elfojtott bűntudat megzavarja az elme egyensúlyát a manómaja-kósában. Ezután a prána-avaródha: a mentális zavar miatt a prána áramlása lelassul vagy megakad valamelyik nádíban, és kimeríti a hozzá tartozó csakrát. Végül a megszilárdulás a fizikai testben.

A füzet ennek a láncnak a visszabontását tanítja: a hét csakra pszichoszomatikáját, a zárlatok feloldását, és a hozzájuk tartozó krijákat és mantrákat.

11 oldal. Nem helyettesíti az orvosi ellátást.`,
    descriptionEn: `Western medicine concentrates largely on the biochemical suppression of physical symptoms. The founding principle of yogic medicine — prana chikitsa — states the opposite: every physical illness is the material consolidation of a subtle-energetic blockage.

The arising of illness has three phases. First adhi: fear, anger or suppressed guilt disturb the mind's balance in the manomaya kosha. Then prana-avarodha: the mental disturbance slows or halts the flow of prana in one of the nadis and depletes the associated chakra. Finally, consolidation in the physical body.

The bookletlet teaches how to unwind that chain: the psychosomatics of the seven chakras, the release of blockages, and the kriyas and mantras that belong to each.

11 pages. Not a substitute for medical care.`,
  },
  {
    slug: "gyogyulas-a-mutetbol",
    file: f("mutetbol_gyogyulas_kezikonyv.pdf"),
    downloadName: "Gyogyulas-a-mutetbol.pdf",
    pages: 12,
    accent: "lapis",
    mark: "sun",
    titleHu: "Gyógyulás a Műtétből",
    titleEn: "Recovering from Surgery",
    subtitleHu: "Posztoperatív regeneráció és energetikai helyreállítás — XII. kötet",
    subtitleEn: "Post-operative regeneration and energetic repair — Volume XII",
    blurbHu:
      "A szövettani regenerációtól és a heggondozástól az altatás utáni méregtelenítésen át az átvágott meridiánok és az aura újrakapcsolásáig.",
    blurbEn:
      "From tissue regeneration and scar care through post-anaesthetic detoxification to reconnecting severed meridians and the auric field.",
    descriptionHu: `A sebészeti beavatkozás egyszerre életmentő orvosi segítség és mélyreható biológiai-energetikai trauma. A modern sebészet mikroszkopikus pontossággal állítja helyre a fizikai struktúrákat, de a valódi gyógyulás jóval túlmutat a bőr összevarrásán.

A füzet három síkon tárgyalja a hatást. Fizikai síkon: a szöveti folytonosság megszakadása, az erek elzárása, az idegvégződések sérülése, a gyulladásos citokinek áradata. Energetikai síkon: az éteri test megnyílása, aura-repedések az anesztézia miatt, az átvágott nádík és meridiánok. És érzelmi síkon, amiről a legkevesebb szó esik.

Ennek megfelelően épül a gyakorlati rész is: szövettani regeneráció és heggondozás, az altatás utáni méregtelenítés, majd a meridiánok és az aura újrakapcsolása.

12 oldal. Az orvosi utókezelés kiegészítése, nem helyettesítője.`,
    descriptionEn: `Surgery is at once life-saving medical help and a profound biological and energetic trauma. Modern surgery restores physical structures with microscopic precision, but real healing reaches far beyond the closing of the skin.

The bookletlet treats the impact on three planes. Physically: the interruption of tissue continuity, occluded vessels, damaged nerve endings, a flood of inflammatory cytokines. Energetically: the opening of the etheric body, auric tearing under anaesthesia, severed nadis and meridians. And emotionally, which is discussed least of all.

The practical part follows the same structure: tissue regeneration and scar care, post-anaesthetic detoxification, then the reconnection of the meridians and the auric field.

12 pages. A complement to medical aftercare, not a replacement for it.`,
  },
  {
    slug: "kristalyok-kezikonyve",
    file: f("kristalyok_kezikonyv.pdf"),
    downloadName: "A-kristalyok-kezikonyve.pdf",
    pages: 19,
    accent: "lapis",
    mark: "triple",
    titleHu: "A Kristályok Kézikönyve",
    titleEn: "The Handbook of Crystals",
    subtitleHu: "A Föld fénykódjai és mesterkristályai — IX. kötet",
    subtitleEn: "The Earth's light codes and master crystals — Volume IX",
    blurbHu:
      "Az ásványok szent geometriája, a hét csakra mesterkövei, a programozás, a kristályrácsok és az elixírek — a piezoelektromos rezonanciától a finomtestek harmonizálásáig.",
    blurbEn:
      "The sacred geometry of minerals, the master stones of the seven chakras, programming, crystal grids and elixirs — from piezoelectric resonance to harmonising the subtle bodies.",
    descriptionHu: `Az ásványvilág nem élettelen anyaghalmaz, hanem a Föld legrégebbi memóriatára és a fizikai dimenzió legrendezettebb állapota. Míg a biológiai sejtek dinamikus, de állandóan bomló egyensúlyban léteznek, a kristályok atomi szerkezetét minimális entrópia és tökéletes periodikus rácsrendezettség jellemzi.

Ebből következik a koherens rezonancia törvénye, amely a füzet gerince: amikor egy stressz vagy betegség által kimerített bioelektromágneses mező kapcsolatba lép egy kristály tökéletesen stabil rácsszerkezetével, az instabilabb rendszer igazodik a stabilabbhoz. A kristály nem ad valami idegent — stabil frekvenciájával emlékeztet.

A füzet végigveszi a kristályszerkezeteket, a hét csakra mesterköveit, a programozás módszerét, a kristályrácsok felépítését és az elixírkészítést.

19 oldal — a sorozat egyik legterjedelmesebb darabja.`,
    descriptionEn: `The mineral world is not inert matter but the Earth's oldest memory store and the most ordered state of the physical dimension. Where biological cells exist in a dynamic but constantly decaying equilibrium, the atomic structure of crystals is characterised by minimal entropy and perfect periodic lattice order.

From this follows the law of coherent resonance, which is the spine of the book: when a bioelectromagnetic field depleted by stress or illness meets the perfectly stable lattice of a crystal, the less stable system aligns with the more stable one. The crystal does not give something foreign — with its stable frequency, it reminds.

The bookletlet covers crystal structures, the master stones of the seven chakras, the method of programming, the construction of crystal grids, and the preparation of elixirs.

19 pages — one of the longest in the series.`,
  },

  // ---------- mind and living ----------
  {
    slug: "kiegyensulyozott-eletvitel-es-boldogsag",
    file: f("kiegyensulyozott_eletvitel_es_boldogsag_meditacioi_kezikonyv.pdf"),
    downloadName: "Kiegyensulyozott-eletvitel-es-boldogsag.pdf",
    pages: 11,
    accent: "saffron",
    mark: "sun",
    titleHu: "A Kiegyensúlyozott Életvitel és a Boldogság Meditációi",
    titleEn: "Meditations for a Balanced Life and Happiness",
    subtitleHu: "Gyakorlati útmutató a belső békéhez — XIII. kötet",
    subtitleEn: "A practical guide to inner peace — Volume XIII",
    coverTitle: "A Boldogság Meditációi",
    coverSubtitle: "Gyakorlati útmutató a belső békéhez — XIII. kötet",
    blurbHu:
      "A keleti bölcselet (szukha, szantósa, vu-vej) és a modern idegtudomány (szívkoherencia, vagus-szabályozás, neuroplaszticitás) szintézise a mindennapi derűhöz.",
    blurbEn:
      "A synthesis of Eastern thought (sukha, santosha, wu wei) and modern neuroscience (heart coherence, vagal regulation, neuroplasticity) for everyday equanimity.",
    descriptionHu: `A modern ember legfőbb tévedése, hogy a boldogságot külső célok elérésével, tárgyak birtoklásával és ingerek felhalmozásával azonosítja. A fogyasztói társadalom a dopaminvezérelt örömhajszolásra épül, aminek törvényszerű következménye a hedonikus futópad: bármilyen új autót vagy sikert érünk el, a kezdeti eufória elpárolog, az ingerküszöb megemelkedik, és visszazuhanunk az elégedetlenségbe.

A valódi boldogság nem az ingerek intenzitásából fakad, hanem a tudat belső rendezettségéből. A füzet ennek a fogalmait járja körül — az eudaimóniát, a szukhát, a szantósát, a vu-vejt —, majd a gyakorlat felé fordul.

Ami ebben a füzetben külön érték: a keleti fogalmakat következetesen összeveti a mérhető élettannal. A szívritmus-variabilitás és a szívkoherencia, a vagus-szabályozás, a neuroplaszticitás nem díszítés, hanem az a nyelv, amelyen a hagyomány állításai ellenőrizhetők.

11 oldal.`,
    descriptionEn: `The modern person's central error is to identify happiness with reaching external goals, owning things and accumulating stimulation. Consumer society is built on dopamine-driven pleasure-seeking, whose inevitable consequence is the hedonic treadmill: whatever new car or success we attain, the initial euphoria evaporates, the threshold rises, and we fall back into dissatisfaction.

Real happiness does not come from the intensity of stimulation but from the inner orderliness of the mind. The bookletlet works through the relevant concepts — eudaimonia, sukha, santosha, wu wei — and then turns to practice.

What makes this volume distinctive: it consistently sets the Eastern concepts against measurable physiology. Heart rate variability and cardiac coherence, vagal regulation and neuroplasticity are not decoration but the language in which the tradition's claims can be checked.

11 pages.`,
  },
  {
    slug: "pszionika-alapkonyve",
    file: f("pszionika_alapkonyv.pdf"),
    downloadName: "A-pszionika-alapkonyve.pdf",
    pages: 11,
    accent: "amethyst",
    mark: "wheel",
    titleHu: "A Pszionika Alapkönyve",
    titleEn: "The Foundations of Psionics",
    subtitleHu: "A tudat, az akarat és a bio-skaláris erők — XIV. kötet",
    subtitleEn: "Mind, will and bio-scalar forces — Volume XIV",
    blurbHu:
      "Szertartások és külső eszközök nélküli akaratkivetítés: a tobozmirigy gamma-koherenciája, a bioelektromágneses mező sűrítése, telepátia, telekinézis, távolbalátás, pszichés védelem.",
    blurbEn:
      "Projection of will without ritual or external tools: pineal gamma coherence, densifying the bioelectromagnetic field, telepathy, telekinesis, remote viewing, psychic defence.",
    descriptionHu: `A pszionika a görög pszükhé és az elektronika szavak fúziójából született kifejezés. Lényege: az emberi tudat közvetlen hatása a valóságra segédeszközök, szertartási kellékek és külső szimbólumok nélkül.

Itt húzódik a határ a klasszikus mágia felé, és a füzet ezt élesen meghúzza. A klasszikus mágia külső közvetítőkön hat: szimbólumokon, füstölőkön, igéken, szellemi entitásokon keresztül — külsőleg modulált energia. A pszionika nem kér segítséget istenektől és nem szövi a külső mágia szálait: az elme tiszta, belső biofizikai architektúráját használja generátorként.

A füzet végigveszi a fogalmi, történeti és fizikai alapvetést, majd a gyakorlatot: a tobozmirigy 40 Hz-es gamma-koherenciáját, a bioelektromágneses mező sűrítését, az akaratkivetítést, és — hangsúlyosan — a pszichés védelmet.

11 oldal.`,
    descriptionEn: `Psionics is a coinage fusing the Greek psyche with electronics. Its substance: the direct effect of human consciousness on reality without aids, ritual props or external symbols.

This is where the boundary with classical magic lies, and the booklet draws it sharply. Classical magic works through external intermediaries: symbols, incense, incantations, spirit entities — externally modulated energy. Psionics asks nothing of gods and weaves no outer threads: it uses the mind's own internal biophysical architecture as the generator.

The bookletlet covers the conceptual, historical and physical groundwork, then the practice: 40 Hz pineal gamma coherence, densifying the bioelectromagnetic field, projection of will, and — with emphasis — psychic defence.

11 pages.`,
  },
  {
    slug: "kvantum-valosag-alapkonyve",
    file: f("kvantum_valosag_alapkonyv.pdf"),
    downloadName: "A-kvantum-valosag-alapkonyve.pdf",
    pages: 59,
    // Five times the length of the other handbooks, and a different kind of
    // book: priced apart from the series.
    priceHuf: 1990,
    accent: "lapis",
    mark: "wheel",
    featured: true,
    titleHu: "A Kvantum Valóság Alapkönyve",
    titleEn: "The Foundations of Quantum Reality",
    subtitleHu: "A megfigyelő hatalma, nemlokalitás, holografikus rend — XVII. kötet",
    subtitleEn: "The observer's power, nonlocality, holographic order — Volume XVII",
    coverTitle: "A Kvantum Valóság",
    coverSubtitle: "Mért tény, értelmezés és belső tapasztalat — XVII. kötet",
    blurbHu:
      "Amit a huszadik század fizikája valóban felfedezett a valóság szövetéről — és ami ebből lefordítható a gyakorló tudat napi munkájára. Huszonnégy fejezet, harminchét gyakorlat.",
    blurbEn:
      "What twentieth-century physics actually discovered about the fabric of reality — and what of it translates into daily practice. Twenty-four chapters, thirty-seven exercises.",
    descriptionHu: `Ez a füzet két hagyomány határvonalán áll, és nem tesz úgy, mintha az a határvonal nem létezne. Az egyik oldalon a huszadik század fizikája: mérésekkel, egyenletekkel, hibasávokkal, reprodukált laborkísérletekkel. A másik oldalon a jógikus és tantrikus belső tudomány: évezredes megfigyelési jegyzőkönyvekkel arról, mi történik a tudattal, ha valaki évtizedeken át ül és figyel.

A két hagyomány nem ugyanarról beszél, és a füzet szerint a mai ezoterikus irodalom legnagyobb bűne éppen az, hogy összemossa őket. A „kvantum" lett a mágikus jelszó, amivel bármilyen állítást meg lehet szentelni.

Ez a füzet ennek az ellentétét vállalja. A fizikát pontosan idézi, a hagyományt pontosan idézi, és a kettő közötti hidakat külön megjelöli hídként. Minden lényeges tétel három jelölés egyikét kapja — mért tény, értelmezés, vagy belső tapasztalat —, és egyetlen állítás sem csempészi be magát egy másik tekintélyével. Ez a jelölésrendszer a füzet módszertani gerince.

Témái: a megfigyelő szerepe, szuperpozíció és összeomlás, nemlokalitás, a nullponti mező, a holografikus rend, és a kvantumkoherens gyógyítás kérdése.

59 oldal, huszonnégy fejezet, harminchét gyakorlat és egy negyvenkilenc napos program. A sorozat legterjedelmesebb kötete.`,
    descriptionEn: `This booklet stands on the border between two traditions and does not pretend the border is not there. On one side, twentieth-century physics: measurements, equations, error bars, replicated laboratory experiments. On the other, the yogic and tantric inner science: millennia of observational records of what happens to consciousness when someone sits and watches for decades.

The two traditions are not talking about the same thing, and in this book's view the gravest sin of today's esoteric literature is precisely that it blurs them. "Quantum" has become the magic word with which any claim can be sanctified.

This booklet takes the opposite position. It quotes the physics precisely, quotes the tradition precisely, and marks the bridges between them as bridges. Every substantive proposition carries one of three labels — measured fact, interpretation, or inner experience — and no claim smuggles itself in on another's authority. That labelling is the book's methodological spine.

Topics: the role of the observer, superposition and collapse, nonlocality, the zero-point field, holographic order, and the question of quantum-coherent healing.

59 pages, twenty-four chapters, thirty-seven exercises and a forty-nine-day programme. The longest volume in the series.`,
  },

  // ---------- Tibetan ----------
  {
    slug: "milarepa-a-fekete-magustol",
    file: f("milarepa_kezikonyv.pdf"),
    downloadName: "Milarepa-a-fekete-magustol-a-szentig.pdf",
    pages: 12,
    accent: "gold",
    mark: "flame",
    titleHu: "Milarepa: A Fekete Mágustól a Megvilágosodott Szentig",
    titleEn: "Milarepa: From Black Magician to Enlightened Saint",
    subtitleHu: "Élete, próbatételei, dalai és a mahámudrá ösvénye — XVI. kötet",
    subtitleEn: "His life, trials, songs and the path of mahamudra — Volume XVI",
    coverTitle: "Milarepa",
    coverSubtitle: "A fekete mágustól a megvilágosodott szentig — XVI. kötet",
    blurbHu:
      "A családi tragédia, a fekete mágia pusztító vihara, a bűnbánat, Marpa kőtornyai, és a Himalája csalánon élő zöld jógijának felemelkedése.",
    blurbEn:
      "Family tragedy, the destroying storm of black magic, repentance, Marpa's stone towers, and the rise of the Himalayan yogi who lived on nettles.",
    descriptionHu: `A tibeti buddhizmus legemberibb alakja Dzsecün Milarepa (1052–1135). Nem szeplőtelen istenségként született: gyarló, sebzett emberként járta meg a legsötétebb bűnök és a legmélyebb bűnbánat poklát, mielőtt egyetlen élet alatt elérte a teljes megvilágosodást.

Eredeti neve Mila Thöpaga volt — „akit jó hallgatni". Apja jómódú kereskedő volt Gungthang tartományában, anyja büszke, nemes lelkű asszony. Amikor Thöpaga tizenkét éves volt, apja halálos betegségbe esett, és halála előtt összehívta a rokonságot. A megszegett eskü, ami ezután következett, indítja el az egész történetet.

A füzet végigkíséri az utat: a rokoni árulást, a bosszút és a fekete mágiát, a bűnbánatot, Marpa kegyetlen próbatételeit — a kőtornyokat, amelyeket fel kellett építenie és le kellett bontania —, végül a magányos barlangéveket és a dalok bölcsességét.

12 oldal. Rövid, de a lényeget hordozza; aki többet akar, annak a *Mahamudra Ösvénye* a folytatás.`,
    descriptionEn: `The most human figure in Tibetan Buddhism is Jetsun Milarepa (1052–1135). He was not born an immaculate deity: as a flawed, wounded man he passed through the hell of the darkest wrongdoing and the deepest remorse before reaching full enlightenment in a single lifetime.

His original name was Mila Thöpaga — "he who is good to hear". His father was a prosperous merchant in Gungthang, his mother a proud and noble woman. When Thöpaga was twelve his father fell mortally ill and, before dying, gathered the family. The broken oath that followed sets the whole story in motion.

The bookletlet follows the path: the betrayal by relatives, the revenge and the black magic, the remorse, Marpa's merciless trials — the stone towers he had to build and tear down — and finally the solitary years in caves and the wisdom of the songs.

12 pages. Short, but it carries the essentials; for more, *The Path of Mahamudra* continues the story.`,
  },
  {
    slug: "nyingma-hagyomany-kezikonyve",
    file: f("nyingma_kezikonyv.pdf"),
    downloadName: "A-nyingma-hagyomany-kezikonyve.pdf",
    pages: 13,
    accent: "saffron",
    mark: "triple",
    titleHu: "A Nyingma Hagyomány és Meditációk Kézikönyve",
    titleEn: "The Handbook of the Nyingma Tradition and its Meditations",
    subtitleHu: "Enchiridion Nyingmapa — a kilenc jármű és a dzogcsen — X. kötet",
    subtitleEn: "Enchiridion Nyingmapa — the nine vehicles and Dzogchen — Volume X",
    coverTitle: "A Nyingma Hagyomány",
    coverSubtitle: "A kilenc jármű és a dzogcsen eredendő tisztasága — X. kötet",
    blurbHu:
      "A legrégebbi tibeti iskola doktrínái és praxisa: a kilenc jármű, a külső és belső ngöndro, siné és lhagtong, a tantrák, és a dzogcsen eredendő tisztasága.",
    blurbEn:
      "The doctrines and practice of the oldest Tibetan school: the nine vehicles, outer and inner ngöndro, shiné and lhagtong, the tantras, and the primordial purity of Dzogchen.",
    descriptionHu: `A nyingma — szó szerint „az Ősiek Iskolája" — a tibeti buddhizmus legrégebbi hagyománya. Míg a későbbi szarma, „új" iskolák a 10–11. századi második fordítási hullámban születtek, a nyingma gyökerei a 8. századba nyúlnak vissza, amikor Triszong Decen király meghívására megérkeztek Indiából a legmélyebb tantrikus tanítások a Hó Birodalmába.

A hagyomány három megvilágosodott oszlopra épül. Khenpo Sántaraksita, a nálandai egyetem dékánja, a szerzetesi fegyelem és a madhjamaka filozófia lehorgonyzója, aki megalapította az első tibeti kolostort, Szamjét. Guru Padmaszambhava, a vadzsrajána csodatevő mestere. És a harmadik, akivel a vonal teljessé vált.

A füzet Padmaszambhava, Longcsenpa és Dzsigme Lingpa tanításai alapján adja át a rendszert: a kilenc járművet, a külső és belső ngöndrót, a siné és lhagtong meditációt, a tantrákat, és a dzogcsen eredendő tisztaságát.

13 oldal. Ha mélyebben folytatnád, a *Haladó Nyingma Gyakorlatok* a következő lépés.`,
    descriptionEn: `Nyingma — literally "the School of the Ancients" — is the oldest tradition of Tibetan Buddhism. Where the later sarma or "new" schools arose in the second translation wave of the tenth and eleventh centuries, Nyingma's roots reach back to the eighth, when at King Trisong Detsen's invitation the deepest tantric teachings arrived in the Land of Snows from India.

The tradition rests on three enlightened pillars. Khenpo Shantarakshita, dean of Nalanda, who anchored monastic discipline and Madhyamaka philosophy and founded Tibet's first monastery at Samye. Guru Padmasambhava, the miracle-working master of Vajrayana. And the third, with whom the lineage was complete.

Drawing on Padmasambhava, Longchenpa and Jigme Lingpa, the booklet transmits the system: the nine vehicles, outer and inner ngöndro, shiné and lhagtong meditation, the tantras, and the primordial purity of Dzogchen.

13 pages. To go deeper, *Advanced Nyingma Practices* is the next step.`,
  },
];

export const HANDBOOKS: CatalogueEntry[] = ENTRIES.map((entry) => ({
  ...entry,
  author: AUTHOR,
  series: SERIES,
  priceHuf: entry.priceHuf ?? PRICE,
}));
