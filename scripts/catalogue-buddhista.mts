/**
 * Buddhist long volumes that are not Tibetan.
 *
 * The series name is printed on the cover, so a book on Asanga and
 * Vasubandhu cannot carry "Tibeti ösvények": Yogacara is Indian, four
 * centuries before Buddhism reached Tibet.
 */
import path from "node:path";

import type { CatalogueEntry } from "./catalogue.mts";

const DIR = "c:\\Users\\mzolt\\Desktop\\ClaudProjects\\nagy_konyvek";
const f = (name: string) => path.join(DIR, name);

const AUTHOR = "Molnár Zoltán";
const SERIES = "Buddhista nagykönyvek";

export const BUDDHIST_BOOKS: CatalogueEntry[] = [
  {
    slug: "csak-tudat-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("csak_tudat_nagykonyve/A csak tudat nagykonyve.pdf"),
    downloadName: "A-csak-tudat-nagykonyve.pdf",
    pages: 285,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "BUDDHIST",
    featured: true,
    accent: "amethyst",
    mark: "triple",

    titleHu: "A Csak Tudat Nagykönyve",
    titleEn: "The Great Book of Mind-Only",
    subtitleHu: "A jógácsára: Aszanga, Vaszubandhu és a tudat-tan",
    subtitleEn: "Yogacara: Asanga, Vasubandhu and the doctrine of mind",
    coverTitle: "A Csak Tudat Nagykönyve",
    coverSubtitle: "A jógácsára iskola",

    blurbHu:
      "A jógácsára teljes feldolgozása: az abhidharma öröksége, a forrásszútrák, Maitréjanátha öt értekezése, Aszanga és Vaszubandhu, a nyolc tudat, az álajavidnyána és a magok, a három természet, az alap átfordulása, a tathágatagarbha, a vita a madhjamakával, Dignága és Dharmakírti, Hszüan-cang, sentong és rangtong. Tizenkilenc fejezet.",
    blurbEn:
      "Yogacara in full: the legacy of Abhidharma, the source sutras, Maitreyanatha's five treatises, Asanga and Vasubandhu, the eight consciousnesses, alayavijnana and the seeds, the three natures, the turning of the basis, tathagatagarbha, the debate with Madhyamaka, Dignaga and Dharmakirti, Xuanzang, shentong and rangtong. Nineteen chapters.",

    descriptionHu: `A jógácsárát a nyugati szakirodalom sokáig „buddhista idealizmusként" kezelte, és ezzel félre is vezette az olvasóit. Ez a kötet az első fejezetben külön alfejezetet szentel annak, **amit a tan NEM állít** — és egy másikat annak, hogy **mi a különbség a nyugati idealizmustól**.

Az **alaptétel** pontos megfogalmazásával kezd: mit jelent a *vidnyapti*, és **a három szint, amelyen a tétel működik**. Mert a „minden csak tudat" mondat háromféleképpen érthető, és csak az egyik az, amit az iskola valóban tanít.

**Az előzmények.** Az abhidharma születése, a szarvásztiváda „minden létezik" tétele, a szautrántika magok, Nágárdzsuna és a madhjamaka, a Szandhinirmócsana és a „harmadik kerékfordítás" — **a pillanatiság és a folytonosság problémája**, amelyre az egész rendszer válasz.

**A források:** a Dasabhúmika és a híres „csak tudat" mondat, a Szandhinirmócsana, a Lankávatára és annak hatása a **csanra**. Majd **Maitréjanátha öt értekezése**, köztük a Madhjántavibhága és az üresség „helyes" meghatározása, és az a feszültség, amit a Ratnagótravibhága hoz a buddha-természet és az üresség közé.

**Aszanga és Vaszubandhu** egy-egy teljes fejezetben, a műveikkel, a testvérek legendájával — és azzal a tisztességes kérdéssel, hogy **mi Aszanga valódi hozzájárulása**.

**A nyolc tudat tana:** az öt érzéktudat, a mánóvidnyána, a **manasz** és hogy mikor szűnik meg, végül az **álajavidnyána**. Az ötvenegy tudattényező, a nyolcas rendszer vitái.

**Az álaja és a magok:** a hat név, az érvek mellette, az óceán és a hullámok képe, az **illatosítás**, a viszonya az újraszületéshez — és külön alfejezet a **kritikákról** meg a modern olvasatról.

**A három természet** — függő, képzelt, beteljesült —, a két modellje, a három lényegnélküliség, és a kérdés, amely a madhjamakával való vitát eldönti: **mi üres mitől**.

**Az érvek:** az álom mint modell, a **„négyféle víz"**, a hely és idő meghatározottsága, a közös tapasztalat, az atomcáfolat — és a szolipszizmus vádjára adott válasz.

**Az út:** a két akadály, az öt út, a tíz bhúmi, az **alap átfordulása**, a négy bölcsesség. **A buddhaság:** a három test, a nem időző nirvána, a **tathágatagarbha** és viszonya az álajához, a gótra és az ötféle család.

A záró fejezetek a továbbélés: a **vita a madhjamakával**, Dignága és Dharmakírti ismeretelmélete, **Hszüan-cang** és a kínai Fa-hsziang iskola, a tibeti **sentong–rangtong** vita, és a jógácsára ma.

285 oldal, tizenkilenc fejezet. Minden fejezet összefoglalással zárul.`,
    descriptionEn: `Western scholarship long treated Yogacara as "Buddhist idealism", and in doing so misled its readers. This volume gives a section of its own in the first chapter to **what the doctrine does NOT claim** — and another to **how it differs from Western idealism**.

It begins with an exact statement of the **central thesis**: what *vijñapti* means, and **the three levels on which the thesis operates**. Because "everything is mind only" can be read three ways, and only one of them is what the school actually teaches.

**The background.** The birth of Abhidharma, the Sarvastivada claim that "everything exists", the Sautrantika seeds, Nagarjuna and Madhyamaka, the Samdhinirmocana and the "third turning of the wheel" — and **the problem of momentariness and continuity**, to which the whole system is an answer.

**The sources:** the Dasabhumika and its famous "mind only" line, the Samdhinirmocana, the Lankavatara and its influence on **Chan**. Then **Maitreyanatha's five treatises**, including the Madhyantavibhaga and its "correct" definition of emptiness, and the tension the Ratnagotravibhaga introduces between buddha-nature and emptiness.

**Asanga and Vasubandhu** each get a full chapter, with their works, the legend of the brothers — and the honest question of **what Asanga's real contribution was**.

**The eight consciousnesses:** the five sense consciousnesses, manovijñana, **manas** and when it ceases, and finally **alayavijñana**. The fifty-one mental factors, and the disputes over the eightfold scheme.

**The alaya and the seeds:** its six names, the arguments for it, the image of the ocean and its waves, **perfuming**, its relation to rebirth — with sections of their own on the **criticisms** and on modern readings.

**The three natures** — dependent, imagined, perfected — their two models, the three absences of own-being, and the question that settles the debate with Madhyamaka: **what is empty of what**.

**The arguments:** the dream as model, the **"four kinds of water"**, the determinacy of place and time, shared experience, the refutation of atoms — and the answer to the charge of solipsism.

**The path:** the two obscurations, the five paths, the ten bhumis, the **turning of the basis**, the four wisdoms. **Buddhahood:** the three bodies, the non-abiding nirvana, **tathagatagarbha** and its relation to the alaya, gotra and the five families.

The closing chapters follow the afterlife of the school: the **debate with Madhyamaka**, the epistemology of Dignaga and Dharmakirti, **Xuanzang** and the Chinese Faxiang school, the Tibetan **shentong–rangtong** controversy, and Yogacara today.

285 pages, nineteen chapters. Every chapter closes with a summary.`,
  },
];
