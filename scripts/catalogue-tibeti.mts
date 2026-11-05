/**
 * The Tibetan inner yoga booklets.
 *
 * Five short booklets that form one progression rather than five separate
 * subjects: clearing the channels, then moving the winds through them, then
 * untying the knots, then the secret practice, and finally the rainbow body
 * the whole path aims at. Kept in that order, because reading the fourth
 * before the second would be reading the answer before the question.
 *
 * Every description is written from the booklet's own text.
 */
import path from "node:path";

import type { CatalogueEntry } from "./catalogue.mts";

const DIR = "c:\\Users\\mzolt\\Desktop\\ClaudProjects\\tibeti_buddhizmus";
const f = (name: string) => path.join(DIR, name);

const AUTHOR = "Molnár Zoltán";
const SERIES = "Tibeti belső jóga";
const PRICE = 990;

type Entry = Omit<CatalogueEntry, "author" | "series" | "priceHuf"> & {
  priceHuf?: number;
};

const ENTRIES: Entry[] = [
  {
    slug: "kilenc-tisztito-legzes",
    file: f("kilenc_tisztito_legzes_fuzet.pdf"),
    downloadName: "A-kilenc-tisztito-legzes-kezikonyve.pdf",
    pages: 6,
    accent: "lapis",
    mark: "triple",
    titleHu: "A Kilenc Tisztító Légzés Kézikönyve",
    titleEn: "The Handbook of the Nine Purifying Breaths",
    subtitleHu: "A tibeti belső jóga előkészítő gyakorlata — I. füzet",
    subtitleEn: "The preparatory practice of Tibetan inner yoga — Booklet I",
    coverTitle: "A Kilenc Tisztító Légzés",
    coverSubtitle: "rlung ro dgu bkrung",
    blurbHu:
      "A Kilencpontos Légzés (rlung ro dgu bkrung) teljes leírása: a három energiacsatorna, a három idősík és a tudat három mérge — kilenc légzés, amely minden mélyebb gyakorlás előtt megtisztítja a terepet.",
    blurbEn:
      "The Nine-Point Breath (rlung ro dgu bkrung) in full: three channels, three times and the three poisons of the mind — nine breaths that clear the ground before any deeper practice.",
    descriptionHu: `A tibeti hagyomány **rlung ro dgu bkrung** néven ismeri, ami szó szerint annyit tesz: *a kilenc tisztátalan szél kivezetése*. Magyarul leggyakrabban Kilencpontos Légzésnek mondjuk.

Ez a Vadzsrajána, a dzogcsen és a bön hagyomány legősibb előkészítő módszere. Nem önálló cél: azért áll minden más gyakorlat előtt, mert a csatornákban rekedt szél és a tudatot elhomályosító érzelmi hordalék nélkül a mélyebb meditáció vagy elnehezül, vagy csapong.

A füzet felépíti a három csatorna architektúráját — az **Uma** középső csatornát, a jobb **Roma** és a bal **Kyangma** mellékcsatornát —, majd a kilenc légzést három hármas szakaszra bontva viszi végig. Az első három a **múlt** akadályait és a haragot, a második három a **jövő** szorongásait és a vágyat, az utolsó három a **jelen** nemtudását tisztítja.

A lépések külön szerepelnek férfiaknál és nőknél, mert a két oldal szerepe a hagyományban felcserélődik — ez az a részlet, amit a legtöbb rövid leírás elhagy, és ami miatt a gyakorlat félrecsúszik.

Záró összefoglaló mátrix, napi gyakorlási útmutató. 6 oldal.`,
    descriptionEn: `The Tibetan tradition calls it **rlung ro dgu bkrung** — literally, *expelling the nine impure winds*. In English it is usually the Nine-Point Breath.

It is the oldest preparatory method of Vajrayana, Dzogchen and Bön. Not an end in itself: it comes before everything else because wind trapped in the channels, and the emotional residue that clouds the mind, leave deeper meditation either heavy or scattered.

The booklet sets out the architecture of the three channels — the central **Uma**, the right **Roma** and the left **Kyangma** — then works through the nine breaths in three groups of three. The first three clear the obstacles of the **past** and anger, the second three the anxieties of the **future** and desire, the last three the ignorance of the **present**.

The steps are given separately for men and women, because the tradition reverses the role of the two sides — the detail most short accounts omit, and the reason the practice so often goes astray.

A summary matrix and daily guidance close the booklet. 6 pages.`,
  },

  {
    slug: "tsa-lung-alapgyakorlatok",
    file: f("tsa_lung_kezikonyv.pdf"),
    downloadName: "Az-alap-tsa-lung-gyakorlatok-kezikonyve.pdf",
    pages: 6,
    accent: "jade",
    mark: "wheel",
    titleHu: "Az Alap Tsa-Lung Gyakorlatok Kézikönyve",
    titleEn: "The Handbook of Basic Tsa-Lung Practice",
    subtitleHu: "Az öt szél és az öt csakra belső jógája — II. füzet",
    subtitleEn: "The inner yoga of the five winds and five chakras — Booklet II",
    coverTitle: "Az Alap Tsa-Lung",
    coverSubtitle: "Csatorna és szél",
    blurbHu:
      "Az öt alapvető Tsa-Lung gyakorlat: a váza-légzés művészete, az öt fő szél és a hozzájuk tartozó csakrák megnyitása — dinamikus mozdulat, bent tartott lélegzet és fókuszált figyelem hármasa.",
    blurbEn:
      "The five basic Tsa-Lung exercises: the art of vase breathing, the five principal winds and the opening of their chakras — movement, held breath and focused attention together.",
    descriptionHu: `A **Tsa-Lung** szó szerint *csatorna-szél*. A tibeti gyógyászat és belső jóga szerint az ember három elválaszthatatlan szinten létezik: a fizikai testben, a csatornák, szelek és esszencia-cseppek finomenergetikai testében, és a tiszta éberség tudati természetében.

A füzet abból a tapasztalatból indul, amit szinte minden meditáló ismer: az ülés vagy elnehezül, vagy csapong. Az ok majdnem mindig ugyanaz — **a csatornákban megrekedt szélenergia**. A Tsa-Lung ezt mozdítja ki: dinamikus testmozdulat, megtartott lélegzet és fókuszált figyelem hármasával oldja a csakrák körüli csomókat, és a szelet a középső csatornába tereli.

Először a **váza-légzés** (Bumpa-chen) négy szabálya, amely nélkül a gyakorlatok puszta tornává válnak. Azután az öt szél és csakrájuk, egyenként:

a torokcsakra és a **felfelé tartó szél** (Gyen-Gyu), a szívcsakra és az **életfenntartó szél** (Sog-Dzin), a köldökcsakra és az **emésztő tűz-szél** (Mye-Nyam), a titkos csakra és a **lefelé tisztító szél** (Thur-Sel), végül a fejtető és a **mindent átható szél** (Khyab-Byed).

Mindegyikhez pontos lépéssor. Zárásként napi gyakorlási rend és a gyakorló tíz aranyszabálya. 6 oldal.`,
    descriptionEn: `**Tsa-Lung** means, literally, *channel-wind*. In Tibetan medicine and inner yoga a person exists on three inseparable levels: the physical body, the subtle body of channels, winds and essence-drops, and the mind's nature as pure awareness.

The booklet starts from an experience almost every meditator knows: the sitting either goes heavy or will not settle. The cause is nearly always the same — **wind stalled in the channels**. Tsa-Lung shifts it: movement, held breath and focused attention together loosen the knots around the chakras and draw the wind into the central channel.

First the four rules of **vase breathing** (Bumpa-chen), without which the exercises are mere gymnastics. Then the five winds and their chakras, one by one:

the throat and the **upward-moving wind** (Gyen-Gyu), the heart and the **life-sustaining wind** (Sog-Dzin), the navel and the **fire-like digestive wind** (Mye-Nyam), the secret chakra and the **downward-clearing wind** (Thur-Sel), and the crown with the **all-pervading wind** (Khyab-Byed).

Each with its exact sequence of steps. A daily programme and the practitioner's ten golden rules close the booklet. 6 pages.`,
  },

  {
    slug: "halado-tsa-lung",
    file: f("halado_tsa_lung_kezikonyv.pdf"),
    downloadName: "A-halado-tsa-lung-gyakorlatok-kezikonyve.pdf",
    pages: 6,
    accent: "copper",
    mark: "flame",
    titleHu: "A Haladó Tsa-Lung Gyakorlatok Kézikönyve",
    titleEn: "The Handbook of Advanced Tsa-Lung Practice",
    subtitleHu: "Trul-khor, csakra-csomók és a belső tűz — III. füzet",
    subtitleEn: "Trul-khor, the chakra knots and the inner fire — Booklet III",
    coverTitle: "A Haladó Tsa-Lung",
    coverSubtitle: "Trul-khor és tummo",
    blurbHu:
      "A csakra-csomók (düd) kioldása: haragvó váza-légzés, a négy haladó trul-khor mozgássorozat, a belső tűz (tummo) előkészítése és a thigle esszenciák keringetése.",
    blurbEn:
      "Untying the chakra knots (düd): wrathful vase breathing, the four advanced trul-khor sequences, preparation for inner fire (tummo) and the circulation of the thigle essences.",
    descriptionHu: `Az alapozó Tsa-Lung a csatornákban rekedt **durva** szeleket mozdítja ki. A haladó szint — tibetiül **trul-khor**, *mágikus kerék* — ennél mélyebbre nyúl: a finomtest legszívósabb zárait, a **csakra-csomókat** (düd) célozza.

A csomó onnan ered, hogy a jobb Roma és a bal Kyangma nem párhuzamosan fut a középső csatorna mellett, hanem a csakráknál rátekeredik. Amíg ez a tekeredés szoros, a szél nem tud a középső csatornába lépni — hiába minden alapgyakorlat.

A füzet a **haragvó váza-légzéssel** kezdi, amely abban különbözik a lágytól, hogy nem tartani, hanem nyomni akar. Innen vezet a **tummo**, a belső tűz előkészítő Tsa-Lungjához, majd a **négy haladó trul-khor** mozgássorozathoz, amelyek a csomókat egyenként bontják.

Külön fejezet a **thigle** esszencia-cseppek felemeléséről és a szívközpontban való keringetéséről.

És egy rész, amit a legtöbb kiadvány kihagy: a **srog-lung**, a szélzavar — mit jelent, miről ismerszik fel, és hogyan kell megelőzni. A haladó gyakorlás legvalóságosabb kockázata, ezért kerül ide, nem lábjegyzetbe.

Összefoglaló mátrix, napi mesterprogram, tíz aranyszabály. 6 oldal.

Előfeltétel: *Az Alap Tsa-Lung Gyakorlatok Kézikönyve*.`,
    descriptionEn: `Basic Tsa-Lung shifts the **coarse** winds stalled in the channels. The advanced level — in Tibetan **trul-khor**, *magical wheel* — reaches further: to the subtle body's most stubborn locks, the **chakra knots** (düd).

The knot arises because the right Roma and left Kyangma do not run parallel to the central channel but wind around it at each chakra. While that winding stays tight, no wind can enter the central channel, however much basic practice is done.

The booklet opens with **wrathful vase breathing**, which differs from the gentle form in that it does not hold but presses. From there to the preparatory Tsa-Lung for **tummo**, the inner fire, and then the **four advanced trul-khor** sequences that undo the knots one by one.

A separate chapter covers raising the **thigle** essence-drops and circulating them in the heart centre.

And a part most publications leave out: **srog-lung**, wind disturbance — what it is, how to recognise it, how to prevent it. It is the most real risk of advanced practice, which is why it belongs in the text rather than a footnote.

Summary matrix, daily master programme, ten golden rules. 6 pages.

Prerequisite: *The Handbook of Basic Tsa-Lung Practice*.`,
  },

  {
    slug: "titkos-tsa-lung",
    file: f("titkos_tsa_lung_kezikonyv.pdf"),
    downloadName: "A-titkos-tsa-lung-gyakorlatok-kezikonyve.pdf",
    pages: 5,
    accent: "amethyst",
    mark: "knot",
    titleHu: "A Titkos Tsa-Lung Gyakorlatok Kézikönyve",
    titleEn: "The Handbook of Secret Tsa-Lung Practice",
    subtitleHu: "A négy öröm és a belső alkímia — IV. füzet",
    subtitleEn: "The four joys and the inner alchemy — Booklet IV",
    coverTitle: "A Titkos Tsa-Lung",
    coverSubtitle: "Sang-wa tsa-lung",
    blurbHu:
      "A titkos csakra belső jógája: a négy öröm folyama, a thigle visszatartása és szublimációja, a karmamudrá és a dzsnyánamudrá, és a szív elpusztíthatatlan cseppje.",
    blurbEn:
      "The inner yoga of the secret chakra: the stream of the four joys, the retention and sublimation of thigle, karmamudra and jnanamudra, and the indestructible drop of the heart.",
    descriptionHu: `A tantrikus hagyomány — az Anuttarajóga Tantrák, a dzogcsen Menngagdé és a bön anya-tantra — háromszintűnek látja a Tsa-Lungot. Ez a füzet a harmadikat, a **Sang-wa Tsa-Lungot**, a titkos szintet tárgyalja.

A kiindulópont a vágy. A hagyomány három ösvényt ismer a kezelésére: az elutasítást, az átalakítást és a felszabadítást — és a titkos Tsa-Lung a harmadikhoz tartozik. Nem elnyomja az energiát, hanem **irányt ad neki**.

A füzet végigveszi a titkos csakra és az életerő-esszencia (**thigle**) viszonyát, majd a **négy öröm** (Catur-Ananda) belső folyamát: hogyan halad az energia csakráról csakrára, és mi különbözteti meg az egyes fokozatokat.

Ezután a legkényesebb rész: a thigle **visszatartása, megfordítása és szublimációja**. Majd a **karmamudrá** és a **dzsnyánamudrá** — a testben és a képzeletben végzett bölcsesség-társ jóga — különbsége, végül a szív **elpusztíthatatlan cseppje** (Mi-shigs-pa'i thigle), ahol az egész ösvény összeér.

Önálló fejezet szól a figyelmeztetésekről és a **szamaja** tisztaságáról. Ez a szint hagyományosan nem önálló olvasmány, hanem beavatáshoz és élő mester kíséretéhez kötött — a füzet ezt kimondja, nem kerüli meg.

5 oldal. Előfeltétel: a Haladó Tsa-Lung.`,
    descriptionEn: `The tantric tradition — the Anuttarayoga Tantras, Dzogchen Menngagde and the Bön mother tantras — sees Tsa-Lung as having three levels. This booklet treats the third, **Sang-wa Tsa-Lung**, the secret level.

The starting point is desire. The tradition knows three paths for dealing with it: renunciation, transformation and liberation — and secret Tsa-Lung belongs to the third. It does not suppress the energy; it **gives it direction**.

The booklet works through the relation between the secret chakra and the life essence (**thigle**), then the inner stream of the **four joys** (Catur-Ananda): how the energy moves from chakra to chakra, and what distinguishes each stage.

Then the most delicate part: the **retention, reversal and sublimation** of thigle. Next the difference between **karmamudra** and **jnanamudra** — the consort yoga performed in the body and in the imagination — and finally the **indestructible drop** of the heart (Mi-shigs-pa'i thigle), where the whole path converges.

A chapter of its own covers the warnings and the purity of **samaya**. This level is traditionally not solitary reading but bound to initiation and a living teacher — the booklet says so rather than stepping around it.

5 pages. Prerequisite: Advanced Tsa-Lung.`,
  },

  {
    slug: "fenytest-kezikonyve",
    file: f("fenytest_kezikonyv.pdf"),
    downloadName: "A-fenytest-kezikonyve.pdf",
    pages: 6,
    accent: "gold",
    mark: "sun",
    titleHu: "A Kisebb és Nagyobb Fénytest Kézikönyve",
    titleEn: "The Handbook of the Lesser and Greater Light Body",
    subtitleHu: "A szivárványtest és a dzogcsen végső ösvénye — V. füzet",
    subtitleEn: "The rainbow body and the final path of Dzogchen — Booklet V",
    coverTitle: "A Fénytest",
    coverSubtitle: "Jalü — a szivárványtest",
    blurbHu:
      "A dzogcsen csúcsa: trekcsö és tögal, a Kati kristálycsatorna, a tögal négy látomása, és az öt elem visszaoldása a tiszta fénybe — a szivárványtest (jalü) ösvénye.",
    blurbEn:
      "The summit of Dzogchen: trekchö and tögal, the Kati crystal channel, the four visions, and the dissolution of the five elements into clear light — the path of the rainbow body (jalü).",
    descriptionHu: `A tibeti buddhizmus legmagasabb tanításaiban — a **dzogcsenben** és a bön dzogcsenben — a megvalósítás végső gyümölcse a **szivárványtest**: tibetiül *'ja' lus*, kiejtve **jalü**.

Ez nem pusztán tudati megvilágosodás. A hagyomány szerint a megvalósítás a fizikai test elemeit is átlényegíti. A tibeti történelem az ősi mesterektől — Garab Dordzse, Padmaszambhava, Vimalamitra — a modern korig több ezer tanúsított esetet tart számon; Shardza Tashi Gyaltsen 1935-ben, Khenpo A-csö 1998-ban.

A füzet először elválasztja a **kisebb** és a **nagyobb** fénytestet, mert a kettőt rendszeresen összemossák. Azután a megvalósítás két oszlopát: a **trekcsöt**, az átvágást, és a **tögalt**, az átugrást — és megmutatja, miért nem cserélhető fel a sorrendjük.

Innen a **Kati kristálycsatorna** és a három nyugvás, majd a **tögal négy látomása** (snang-ba bzhi): mi jelenik meg, milyen sorrendben, és mi különbözteti meg a valódi látomást a képzelgéstől.

Végül az **öt elem visszaoldása** a tiszta fénybe — az a folyamat, aminek a szivárványtest a végpontja.

Külön fejezet az előfeltételekről és a figyelmeztetésekről. Ez a szint élő mester nélkül nem gyakorolható; a füzet térkép, nem beavatás.

6 oldal.`,
    descriptionEn: `In the highest teachings of Tibetan Buddhism — **Dzogchen** and Bön Dzogchen — the final fruit of realisation is the **rainbow body**: in Tibetan *'ja' lus*, pronounced **jalü**.

This is not enlightenment of mind alone. In the tradition, realisation transfigures the elements of the physical body too. Tibetan history records thousands of attested cases, from the early masters — Garab Dorje, Padmasambhava, Vimalamitra — to the modern era: Shardza Tashi Gyaltsen in 1935, Khenpo A-chö in 1998.

The booklet first separates the **lesser** from the **greater** light body, because the two are routinely conflated. Then the two pillars of realisation: **trekchö**, cutting through, and **tögal**, leaping over — and why their order cannot be swapped.

From there the **Kati crystal channel** and the three ways of resting, then the **four visions of tögal** (snang-ba bzhi): what appears, in what order, and what separates genuine vision from imagination.

Finally the **dissolution of the five elements** into clear light — the process of which the rainbow body is the end point.

A separate chapter covers prerequisites and warnings. This level cannot be practised without a living teacher; the booklet is a map, not an initiation.

6 pages.`,
  },
];

export const TIBETAN_BOOKLETS: CatalogueEntry[] = ENTRIES.map((entry) => ({
  ...entry,
  author: AUTHOR,
  series: SERIES,
  priceHuf: entry.priceHuf ?? PRICE,
  category: "BUDDHIST",
}));
