/**
 * The catalogue, as data.
 *
 * Every description here is written from the book's own contents, not from
 * its file name. The order of the array becomes the order on the storefront.
 */
import path from "node:path";

export type CatalogueEntry = {
  slug: string;
  file: string;
  /** Name the buyer's download arrives with. */
  downloadName: string;
  pages: number;
  priceHuf: number;
  author: string;
  series?: string;

  titleHu: string;
  titleEn: string | null;
  subtitleHu: string | null;
  subtitleEn: string | null;
  blurbHu: string;
  blurbEn: string | null;
  descriptionHu: string;
  descriptionEn: string | null;

  /** Shorter title for the cover, where the full one would not fit. */
  coverTitle?: string;
  coverSubtitle?: string;
  accent: "gold" | "copper" | "jade" | "lapis" | "amethyst" | "saffron";
  mark: "wheel" | "lotus" | "knot" | "flame" | "triple" | "sun";
  featured?: boolean;
};

const BIG = "c:\\Users\\mzolt\\Desktop\\ClaudProjects\\nagy_konyvek";
const f = (name: string) => path.join(BIG, name);

const AUTHOR = "Molnár Zoltán";
const SERIES = "Tibeti ösvények";

const BIG_BOOKS: CatalogueEntry[] = [
  {
    slug: "mahamudra-osvenye",
    file: f("Mahamudra Ösvénye.pdf"),
    downloadName: "Mahamudra-osvenye.pdf",
    pages: 326,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    featured: true,
    accent: "gold",
    mark: "knot",

    titleHu: "Mahamudra Ösvénye",
    titleEn: "The Path of Mahamudra",
    subtitleHu: "Milarepa tanításai és gyakorlatai",
    subtitleEn: "The teachings and practices of Milarepa",

    blurbHu:
      "A Nagy Pecsét ösvénye végigvezetve, Milarepa életén és dalain keresztül: a samatha és a vipassana alapjaitól a tudat természetének közvetlen megpillantásáig. Tizenhat rész, az előkészületektől a végső gyümölcsig.",
    blurbEn:
      "The path of the Great Seal, traced through the life and songs of Milarepa: from the groundwork of samatha and vipassana to the direct glimpse of the nature of mind. Sixteen parts, from preparation to final fruition.",

    descriptionHu: `A "mahámudra" szanszkrit szó: maha annyi mint nagy, mudra pedig pecsét. A kagyü hagyomány központi tanítása arról szól, hogy a tudat természete már most tökéletes — nem megszerezni kell, hanem felismerni.

Ez a kötet nem fogalmi bevezető, hanem végigvezetés. Az első rész a mahámudra jelentését és indiai gyökereit tisztázza, majd Milarepa életrajza következik: a bűntől és a bánattól Marpa lábáig, a magányos remeteségtől a dalok bölcsességéig. Az életút itt nem díszítés, hanem a tanítás hordozója.

Innen a könyv a gyakorlásba fordul. Testtartás és légzés, a tudat megnyugtatása (samatha), a valóság természetének feltárása (vipassana), majd a tudat természetének közvetlen megpillantása. Külön fejezet foglalkozik a guru jógával, az illúzió játékával (mája), az érzelmek átalakításával, a halállal és a bardóval, a karmával és az újjászületéssel.

A záró részek a bölcsesség és az együttérzés egységét, a cselekvés és a meditáció egységét, végül a mahámudra végső gyümölcsét tárgyalják.

326 oldal, tizenhat nagy résszel. Gyakorlóknak, akik nem elégszenek meg az áttekintéssel.`,
    descriptionEn: `"Mahamudra" is Sanskrit: maha meaning great, mudra meaning seal. The central teaching of the Kagyu lineage holds that the nature of mind is already perfect — not something to acquire, but something to recognise.

This is not a conceptual introduction but a guided path. The opening clarifies the meaning and Indian roots of mahamudra, then turns to the life of Milarepa: from wrongdoing and grief to the feet of Marpa, from solitary retreat to the wisdom of the songs. The biography is not decoration here; it carries the teaching.

From there the book turns to practice. Posture and breath, calming the mind (samatha), uncovering the nature of reality (vipassana), and then the direct glimpse of mind's own nature. Separate chapters treat guru yoga, the play of illusion (maya), the transformation of emotion, death and the bardo, karma and rebirth.

The closing parts address the unity of wisdom and compassion, the unity of action and meditation, and finally the ultimate fruition of mahamudra.

326 pages in sixteen major parts. For practitioners who want more than an overview.`,
  },

  {
    slug: "tibeti-meditaciok-es-imak",
    file: f("Tibeti meditációs gyakorlatok és imák_v02.pdf"),
    downloadName: "Tibeti-meditaciok-es-imak.pdf",
    pages: 317,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    featured: true,
    accent: "jade",
    mark: "lotus",

    titleHu: "Tibeti Meditációk és Imák",
    titleEn: "Tibetan Meditations and Prayers",
    subtitleHu: "Átfogó útmutató a tudatosság fejlesztéséhez",
    subtitleEn: "A complete guide to developing awareness",

    blurbHu:
      "Átfogó, gyakorlatias bevezetés a tibeti meditáció és ima világába — kezdőknek is. A tudatos légzéstől a vipasszanán és a mandala-meditáción át a mindennapi élethez írt imákig.",
    blurbEn:
      "A complete, practical introduction to Tibetan meditation and prayer — beginners included. From mindful breathing through vipassana and mandala practice to prayers written for everyday life.",

    descriptionHu: `Ez a könyv abból a meggyőződésből indul, hogy a tibeti meditáció nem a szerzetesek és nem a „spirituálisan fejlettek" kiváltsága. A benne rejlő elvek univerzálisak, és működnek függetlenül attól, milyen háttérrel érkezik hozzájuk valaki.

Az első fejezetek a tudat működését és a meditáció célját tárgyalják, majd jön az alapgyakorlatok szintje: a tudatos légzés (sine), a helyes testtartás, a zavaró gondolatok kezelése, és a szeretetteljesség meditációja (metta). Minden technikánál ott van az elméleti háttér, az előkészület és a lépésről lépésre leírt kivitelezés.

A haladó fejezetek a vipasszanát és a mandala-meditációt mutatják be — a valóság természetének mélyebb megértését, illetve a vizualizáció és a szimbólumok erejét a tudat átalakításában.

A kötet második fele az imákkal foglalkozik: a mantra-imák, a dicsőítő és a védő imák típusaival, azzal, hogyan hatnak a tudatra és az érzelmekre, végül konkrét imákkal a mindennapi élethez — békéért, gyógyulásért, védelemért, szeretetért, bölcsességért, mindegyikhez magyarázattal.

317 oldal. Ha egyetlen kötettel szeretnél belépni a tibeti gyakorlás világába, ez az.`,
    descriptionEn: `This book starts from the conviction that Tibetan meditation is not reserved for monastics or for the "spiritually advanced". Its principles are universal and they work regardless of the background someone brings to them.

The opening chapters cover how the mind works and what meditation is for, then move to the foundational level: mindful breathing (shinay), correct posture, handling distracting thoughts, and loving-kindness practice (metta). Every technique comes with its theory, its preparation, and step-by-step instructions.

The advanced chapters present vipassana and mandala meditation — a deeper understanding of the nature of reality, and the power of visualisation and symbol in transforming the mind.

The second half turns to prayer: the types of mantra, praise and protection prayers, how they act on mind and emotion, and finally concrete prayers for everyday situations — for peace, healing, protection, love and wisdom, each with an explanation of its meaning and use.

317 pages. If you want one volume as your way into Tibetan practice, this is it.`,
  },

  {
    slug: "a-tudat-onmagaban-valo-tokeletessege",
    file: f("A TUDAT ÖNMAGÁBAN VALÓ TÖKÉLETESSÉGE DZOGCHEN.pdf"),
    downloadName: "A-tudat-onmagaban-valo-tokeletessege-Dzogcsen.pdf",
    pages: 157,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    accent: "lapis",
    mark: "wheel",

    titleHu: "A Tudat Önmagában Való Tökéletessége",
    titleEn: "The Self-Perfection of Mind",
    subtitleHu: "Dzogcsen — a Nagy Tökéletesség ösvénye",
    subtitleEn: "Dzogchen — the path of the Great Perfection",
    coverTitle: "A Tudat Tökéletessége",
    coverSubtitle: "Dzogcsen — a Nagy Tökéletesség ösvénye",

    blurbHu:
      "A Nagy Tökéletesség tana a nyingma hagyományban: a rigpa, a három kája és a spontán tökéletesség (lhundrub) fogalmaitól az ngöndro gyakorlatain át a haladó dzogcsen módszerekig.",
    blurbEn:
      "The Great Perfection in the Nyingma tradition: from rigpa, the three kayas and spontaneous perfection (lhundrub), through the ngöndro practices, to advanced Dzogchen methods.",

    descriptionHu: `A dzogcsen — „Nagy Tökéletesség" vagy „Teljes Tökély" — a tibeti buddhizmus legközvetlenebb ösvénye, amely a nyingma iskolában, a Régiek iskolájában kapott különleges hangsúlyt. Eredete nem kizárólag buddhista: egyes elemei már a buddhizmus Tibetbe érkezése előtt jelen voltak, a bön hagyományban.

A könyv a vonalak eredetével indul — Garab Dordzse életével és tanításaival, a korai mesterek szerepével —, majd tisztázza az alapfogalmakat: a természetes állapotot (rigpa), a három káját, és a dzogcsen hármas alapelvét: lényeg, természet, együttérzés.

Ezután az alapgyakorlatok (ngöndro) következnek: menedék és bódhicsitta, a Vadzsraszattva-tisztítás, a mandala-felajánlás, a guru jóga — mindegyikhez gyakorlati tanácsokkal és a jellemző hibák leírásával.

A második fél a gyakorló életére alkalmazza a tanítást: a gondolatok és az érzelmek természete, a test, a halál és a bardó, a guru–tanítvány kapcsolat, a karma, az együttérzés, és a dzogcsen helye a modern életben. Haladó gyakorlatok és a filozófia mélyebb rétegei zárják a kötetet, függelékben a fontos fogalmak magyarázatával.

157 oldal, tizenhét fejezet.`,
    descriptionEn: `Dzogchen — the "Great Perfection" — is the most direct path in Tibetan Buddhism, given particular emphasis in the Nyingma school, the school of the Ancients. Its origins are not exclusively Buddhist: some of its elements were present in Tibet before Buddhism arrived, in the Bön tradition.

The book begins with the origins of the lineages — the life and teachings of Garab Dorje, the role of the early masters — then clarifies the core terms: the natural state (rigpa), the three kayas, and Dzogchen's threefold principle of essence, nature and compassion.

The preliminary practices (ngöndro) follow: refuge and bodhicitta, Vajrasattva purification, mandala offering, guru yoga — each with practical guidance and a description of the mistakes most commonly made.

The second half applies the teaching to a practitioner's life: the nature of thought and emotion, the body, death and the bardo, the guru–student relationship, karma, compassion, and the place of Dzogchen in modern life. Advanced practices and the deeper strata of the philosophy close the volume, with a glossary of key terms.

157 pages in seventeen chapters.`,
  },

  {
    slug: "recsungpa-a-szent-eso-es-harmat",
    file: f("Recsung Dordzse Drakpa - A Szent Eső és Harmat.pdf"),
    downloadName: "Recsungpa-A-szent-eso-es-harmat.pdf",
    pages: 128,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    accent: "copper",
    mark: "flame",

    titleHu: "A Szent Eső és Harmat",
    titleEn: "Sacred Rain and Dew",
    subtitleHu: "Recsung Dordzse Drakpa élete — tibeti felszabadulástörténet",
    subtitleEn: "The life of Rechung Dorje Drakpa — a Tibetan liberation story",
    coverSubtitle: "Recsungpa, egy tibeti jógi életének regényes története",

    blurbHu:
      "Milarepa legközelebbi tanítványának, Recsungpának az élete, a 15. századi tibeti rnam thar alapján — közvetlenül a tibeti eredetiből fordítva, irodalmi igénnyel.",
    blurbEn:
      "The life of Rechungpa, Milarepa's closest disciple, from the fifteenth-century Tibetan rnam thar — translated directly from the Tibetan original, as literature.",

    descriptionHu: `Recsung Dordzse Drakpa Milarepa legközelebbi tanítványa volt: az, aki a tanítást továbbvitte. Élettörténete — a tibeti hagyományban rnam thar, „felszabadulástörténet" — nem életrajz a szó nyugati értelmében, hanem tanítás elbeszélés formájában.

Ez a kötet Tsangnyön Heruka 15. századi tibeti szövegéből készült. A magyar fordítás közvetlenül a tibeti eredetiből dolgozott: nem angol vagy más modern kiadás közvetítése, és nem azonos egyetlen létező modern fordítással sem. Nem hivatalos vallási kommentár, hanem egy történeti és spirituális forrásszöveg irodalmi igényű magyar feldolgozása.

A könyv a gyermekévektől indul — születés a havas földön, a fehér hegy ölelése, az ötszínű fény —, és végigkíséri Recsungpa útját a mesterrel való találkozástól a megvalósításig.

A kötet elején hódolat áll Buddhának, aki a felébredés útját feltárta; Milarepának, aki a megvalósítást példává tette; és Recsung Dordzse Drakpának, aki a tanítást továbbvitte.

128 oldal, prológussal és részekre bontott fejezetekkel.`,
    descriptionEn: `Rechung Dorje Drakpa was Milarepa's closest disciple: the one who carried the teaching onward. His life story — in the Tibetan tradition a rnam thar, a "liberation story" — is not biography in the Western sense but teaching in narrative form.

This volume is made from Tsangnyön Heruka's fifteenth-century Tibetan text. The Hungarian translation works directly from the Tibetan original: it is not relayed through an English or other modern edition, and it is not identical to any existing modern translation. It is not an official religious commentary but a literary Hungarian rendering of a historical and spiritual source text.

The book opens in childhood — birth in the land of snows, the embrace of the white mountain, the five-coloured light — and follows Rechungpa from his meeting with the master to realisation.

It begins with homage: to the Buddha, who opened the path of awakening; to Milarepa, who made realisation an example; and to Rechung Dorje Drakpa, who carried the teaching onward.

128 pages, with a prologue and chapters grouped into parts.`,
  },

  {
    slug: "halado-nyingma-gyakorlatok",
    file: f("HALADÓ NYINGMA GYAKORLATOK_A Régi Iskola Belső Ösvényeinek Feltárása.pdf"),
    downloadName: "Halado-nyingma-gyakorlatok.pdf",
    pages: 101,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    accent: "amethyst",
    mark: "triple",

    titleHu: "Haladó Nyingma Gyakorlatok",
    titleEn: "Advanced Nyingma Practices",
    subtitleHu: "A Régi Iskola belső ösvényeinek feltárása",
    subtitleEn: "Opening the inner paths of the Old School",

    blurbHu:
      "A kilenc jána rendszere, a három belső tantra — mahájóga, anujóga, atijóga — és a dzogcsen három osztálya. Azoknak, akik az alapokat már letették.",
    blurbEn:
      "The nine yanas, the three inner tantras — Mahayoga, Anuyoga, Atiyoga — and the three classes of Dzogchen. For those who have already laid the groundwork.",

    descriptionHu: `„A haladó szó a címben nem azt jelenti, hogy az olvasó felsőbbrendű lenne másoknál" — írja az előszó. Azt jelenti, hogy a menedékvétel, a bódhicsitta fejlesztése és az alapvető meditációs stabilitás már megvan, és a gyakorló készen áll a belső tantrák mélyebb rétegeire.

A nyingma a tibeti buddhizmus négy iskolája közül a legrégibb vonalvezetés, amely közvetlenül Padmaszambhava, Vimalamitra és Vairócsana tanításaiból ered. Különlegessége a kilenc jána — kilenc szellemi jármű — rendszere, amelynek csúcsán a dzogcsen áll.

A könyv végigvezet a belső tantrák három szintjén: a mahájóga teremtő (kjé rim) és beteljesítő (dzog rim) fázisán, az anujóga csatorna-, szél- és csepp-munkáján, majd az atijógán. A dzogcsen három osztálya — szem dé (az elme osztálya), long dé (a tér osztálya), men ngag dé (a titkos utasítások osztálya) — külön fejezeteket kap.

Szó esik a terma-hagyományról, a bardo tanításokról, a sötét elvonulásról és a szivárványtest jelenségéről is.

Egy dolgot az előszó nyomatékosan leszögez: ez a szöveg nem helyettesíti a hiteles mester személyes útmutatását. A haladó gyakorlatok beavatás (vang), szóbeli átvitel (lung) és személyes utasítás (tri) alapján végezhetők. A könyv célja, hogy intellektuális térképet adjon a meglévő tapasztalat mellé.

101 oldal.`,
    descriptionEn: `"The word advanced in the title does not mean the reader is superior to anyone," says the preface. It means that refuge, the cultivation of bodhicitta and basic meditative stability are already in place, and the practitioner is ready for the deeper strata of the inner tantras.

Nyingma is the oldest of the four schools of Tibetan Buddhism, descending directly from the teachings of Padmasambhava, Vimalamitra and Vairotsana. Its distinguishing feature is the system of nine yanas — nine spiritual vehicles — with Dzogchen at the summit.

The book works through the three levels of the inner tantras: the generation (kyerim) and completion (dzogrim) phases of Mahayoga, the channels, winds and drops of Anuyoga, and then Atiyoga. The three classes of Dzogchen — semde (mind class), longde (space class), mengagde (secret instruction class) — each receive their own chapter.

The terma tradition, the bardo teachings, dark retreat and the rainbow body are also covered.

The preface is emphatic on one point: this text does not replace the personal guidance of an authentic master. Advanced practices require empowerment (wang), oral transmission (lung) and personal instruction (tri). The book's purpose is to provide an intellectual map alongside existing experience.

101 pages.`,
  },

  {
    slug: "halado-tibeti-meditaciok-bardo",
    file: f("TIBETI MEDITÁCIÓS GYAKORLATOK ÉS IMÁK_II.rész.pdf"),
    downloadName: "Halado-tibeti-meditaciok-Bardo.pdf",
    pages: 99,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    accent: "saffron",
    mark: "sun",

    titleHu: "Haladó Tibeti Meditációs Gyakorlatok és Imák",
    titleEn: "Advanced Tibetan Meditation Practices and Prayers",
    subtitleHu: "A bardo tanítások és a tudat felszabadításának útja — II. rész",
    subtitleEn: "The bardo teachings and the path of liberating the mind — Part II",
    coverTitle: "A Bardo Tanításai",
    coverSubtitle: "A tudat felszabadításának útja — II. rész",

    blurbHu:
      "A hat bardo végigvezetve: az élet, az álom, a meditáció, a haldoklás, a dharmata és a létesülés köztes állapotai. Álomjóga, phowa, a tiszta fény felismerése.",
    blurbEn:
      "The six bardos, worked through: the intermediate states of life, dream, meditation, dying, dharmata and becoming. Dream yoga, phowa, recognising the clear light.",

    descriptionHu: `A „bardo" tibeti szó, jelentése köztes állapot: bar annyi mint között, do pedig lebegni, elhelyezkedni. A bardo tanítások a tibeti buddhizmus legmélyebb rétegéhez tartoznak, és a tudat minden átmeneti állapotát leírják — nem csak a halál utánit.

Ez a kötet a *Tibeti Meditációk és Imák* folytatása, és a hat bardót járja végig. Az élet bardója: a természetes állapot felismerése, a sine (samatha) és a lhaktong (vipasszana) meditációja, majd a mahámudra. Az álom bardója: az álomjóga alapjai és a lucid álmodás tibeti módszerei.

Innen a halál felé fordul: a haldoklás folyamata, a phowa — a tudat átvitele —, és a halál pillanatának gyakorlatai. A dharmata bardójában a tiszta fény felismerése és a békés és haragvó istenségek, a létesülés bardójában az újjászületés köztes állapota és kapuinak lezárása.

A záró rész napi gyakorlatok, mantrák és imák gyűjteménye.

99 oldal, nyolc részben. Az első kötet ismerete ajánlott, de nem feltétel.`,
    descriptionEn: `"Bardo" is Tibetan for intermediate state: bar meaning between, do meaning to float or to be situated. The bardo teachings belong to the deepest layer of Tibetan Buddhism and describe every transitional state of mind — not only the one after death.

This volume continues *Tibetan Meditations and Prayers* and works through all six bardos. The bardo of life: recognising the natural state, shinay (samatha) and lhaktong (vipassana) practice, then mahamudra. The bardo of dream: the foundations of dream yoga and Tibetan methods of lucid dreaming.

From there it turns toward death: the process of dying, phowa — the transference of consciousness — and the practices for the moment of death. In the bardo of dharmata, recognising the clear light and the peaceful and wrathful deities; in the bardo of becoming, the intermediate state of rebirth and closing its doors.

The closing part is a collection of daily practices, mantras and prayers.

99 pages in eight parts. Familiarity with the first volume helps but is not required.`,
  },
];

// The handbooks live in their own file; only the type crosses between them,
// so the import below is erased at runtime and there is no cycle.
import { HANDBOOKS } from "./catalogue-yogikus.mts";

/**
 * Storefront order: the long volumes first, then the handbook series. The
 * publisher uses the array index as sortIndex, so reordering here reorders
 * the shop.
 */
export const CATALOGUE: CatalogueEntry[] = [...BIG_BOOKS, ...HANDBOOKS];
