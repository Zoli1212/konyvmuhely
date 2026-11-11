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
    slug: "boszorkany-szombat",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("boszorkany_szombat/Boszorkany Szombat.pdf"),
    downloadName: "Boszorkany-Szombat.pdf",
    pages: 227,
    priceHuf: 7990,
    author: AUTHOR,
    series: SERIES,
    category: "ESOTERIC",
    featured: true,
    accent: "amethyst",
    mark: "flame",

    titleHu: "Boszorkány Szombat",
    titleEn: "Witches' Sabbath",
    subtitleHu: "Kötés és oldás, átok és levétel — a boszorkánymunka nagy tára",
    subtitleEn: "Binding and loosing, curse and uncrossing — the great book of witchcraft",
    coverTitle: "Boszorkány Szombat",
    coverSubtitle: "A boszorkánymunka nagy tára",

    blurbHu:
      "Hetvenkét fejezet, tizenegy részben. Kötés szerelemre, nyelvre, kézre, pénzre, perre, helyre; oldás — saját, idegen, örökölt, halotti kötelék; gyertyaöntés, -olvasás és -fordítás; fekete tükör, pajzs, csapda, küldés; átok mérése, szóval, névvel, tárggyal, temetővel, nyommal; rontás ételen, ruhán, küszöbön, jószágon; levétel tojással, ólommal, sóval, fürdővel, füsttel, kilenceléssel; visszatérítés a vetőre; médiumság és az ősök asztala.",
    blurbEn:
      "Seventy-two chapters in eleven parts. Binding for love, tongue, hand, money, lawsuit, place; loosing — your own, another's, inherited, the tie to the dead; candle casting, reading and turning; black mirror, shield, trap, sending; cursing by measure, word, name, object, graveyard, track; crossing through food, clothing, threshold, livestock; uncrossing with egg, lead, salt, bath, smoke, the nine; returning it to the sender; mediumship and the ancestors' table.",

    descriptionHu: `Ez a legnagyobb és a legnyersebb kötet a sorozatban, és az alcíme pontos: **a boszorkánymunka nagy tára**. Nem bevezető, nem művelődéstörténet, és nem óvatoskodik. Hetvenkét fejezet, tizenegy részben, apparátus nélkül.

**A szombat műhelye** nyitja: a nyitás és a zárás rendje, a hold, a nap és az óra, a hely megválasztása. Utána a kelléktár — **a tűz és a vas tárgyai**, a fonál, a tű, a seprű, a tükör, a gyertya, a kés —, majd a receptek: **olajok** négy csoportban (kötő és vonzó, levevő és oldó, átok- és rontásolajok, látó és médiumolajok), **porok, reszelékek, hamvak**.

**A kötések** részletesen: szerelemre, **nyelvre** — hogy ne beszéljen —, kézre, pénzre, perre és helyre. Mellettük az **oldások**, és itt a könyv négyféle köteléket különböztet meg: a sajátodat, az idegenét, az **örököltet**, és a **halotti köteléket** — azt, ami egy halotthoz fűz.

**A gyertya** önálló rész: az öntés, az **olvasás** — mit mond a viasz, a láng, a korom —, a fordítás, és a kilenc napos munka rendje.

**A tükör** szintén: a fekete tükör elkészítése, a pajzs, a **csapda**, és a küldés.

Innen a nehéz anyag, négy részben. **Átok:** a mérés — hogy mekkorát és kinek —, a szó, a név, a tárgy, a temető és a nyom átkai. **Rontás:** ételen, ruhán, küszöbön, jószágon át, és a **rossz szem**. Azután a másik irány: **átoklevétel és rontáslevétel** — tojással, ólomöntéssel, sóval, fürdővel, füsttel, **kilenceléssel**. Végül a **visszatérítés a vetőre**, tételesen.

A záró rész a **médiumság**: halottidézés, az **ősök asztala**, és a jelek olvasása.

227 oldal, hetvenkét fejezet.

**Felnőtt tartalom.** A kötet átkokat, rontásokat és temetői munkát tárgyal gyakorlati részletességgel, saját felelősségre.`,
    descriptionEn: `This is the largest and rawest volume in the series, and its subtitle is exact: **the great book of witchcraft**. Not an introduction, not cultural history, and not cautious. Seventy-two chapters in eleven parts, with no apparatus.

**The workshop of the sabbath** opens it: the order of opening and closing, the moon, the day and the hour, choosing the place. Then the equipment — **the objects of fire and iron**, thread, needle, broom, mirror, candle, knife — and then the recipes: **oils** in four groups (binding and drawing, lifting and loosing, curse and crossing oils, seeing and medium oils), **powders, filings, ashes**.

**The bindings** in detail: for love, for the **tongue** — so it will not speak — for the hand, for money, for lawsuits and for a place. Beside them the **loosings**, and here the book distinguishes four kinds of tie: your own, another's, the **inherited**, and the **tie to the dead**.

**The candle** gets a part of its own: casting, **reading** — what the wax, the flame and the soot say — turning, and the order of the nine-day working.

**The mirror** likewise: making the black mirror, the shield, the **trap**, and sending.

From there the hard material, in four parts. **Curse:** the measuring — how much and on whom — the curses of word, name, object, graveyard and track. **Crossing:** through food, clothing, threshold, livestock, and the **evil eye**. Then the other direction: **lifting curse and crossing** — with egg, poured lead, salt, bath, smoke, **the nine**. And finally **returning it to the sender**, item by item.

The closing part is **mediumship**: calling the dead, the **ancestors' table**, and reading the signs.

227 pages, seventy-two chapters.

**Adult content.** The volume covers curses, crossings and graveyard work in practical detail, at the reader's own responsibility.`,
  },
  {
    slug: "magia-haladoknak",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("magia_haladoknak/Magia haladoknak.pdf"),
    downloadName: "Magia-haladoknak.pdf",
    pages: 118,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "ESOTERIC",
    featured: true,
    accent: "amethyst",
    mark: "triple",

    titleHu: "Mágia Haladóknak",
    titleEn: "Magic for the Advanced",
    subtitleHu: "Varázslatok, olajok, porok, konzervmunkák, szellemmunka",
    subtitleEn: "Workings, oils, powders, container work, spirit work",
    coverTitle: "Mágia Haladóknak",
    coverSubtitle: "A gyakorlat teljes tára",

    blurbHu:
      "Olajok, porok, füstölők és fürdők receptjei; pénz, siker, munka, per és hivatal; szerelem, szenvedély, hűség, elválasztás; védelem, rontáslevétel, visszatérítés, igazságtétel; mézesüveg, boszorkányüveg, bábu, lábnyom-munka, keresztút, temető; gyertya-, tükör- és zsinórmunka; ősök, familiáris, helyszellemek; álom, révülés, jóslás. Varázslatok, nem elmélet.",
    blurbEn:
      "Recipes for oils, powders, incenses and baths; money, success, work, lawsuits and officialdom; love, passion, fidelity, separation; protection, uncrossing, return, redress; honey jar, witch bottle, poppet, footprint work, crossroads, cemetery; candle, mirror and cord work; ancestors, the familiar, place spirits; dream, flight, divination. Workings, not theory.",

    descriptionHu: `Az első kötet, és a saját alcíme mondja ki, mire megy: **varázslatok, nem elmélet**.

A nyitó rész **a műhely**. **Olajok** pénzre, szerelemre, védelemre, szellemmunkára és gyógyításra — külön alfejezetben a **magyar formulák** —, az olajok kezelésével együtt. **Porok és füstölők**: vonzó, védő, tisztító, a szórás szabályaival. **Fürdők, mosóvizek, kenőcsök** használati rendje.

Onnan a tár, területenként.

**Pénz, munka, siker:** lodestone- és mágnesmunka, álláskeresés, üzlet, **szerencse, út, kockázat**, végül **per, hivatal, igazság** a bírósági munkákkal.

**Szerelem és szenvedély:** vonzás, **szenvedély és testmunka**, hűség, béke, család — és a másik irány: **elválasztás, szabadulás, gyász**, a fonál elvágásával.

**Védelem, tisztítás, visszatérítés** — és itt kezdődik az, ami ezt a könyvet használhatóvá teszi. **Diagnózis: mi van rajtad**, gyors próbákkal. Utána tisztítás és **rontáslevétel**, a napi védőréteg és a hordozott védelem, **ház- és tárgyvédelem**, **visszatérítés és tükörmunka**, végül **kötés, hűtés, csendesítés**.

A konzervmunkák saját fejezetben: **bábu, mézesüveg, boszorkányüveg**. Mellette a **lábnyom, por, keresztút** — a nyomföld és a szóróhelyek rendje.

**Halottak és szellemek:** **ősmunka** az oltárral, a kéréssel és **a fizetés rendjével**; **temető és halottmunka** a kijárás rendjével; **familiáris és helyszellemek**; **hívás, kör, elbocsátás**.

**Látás, álom, jóslás, beavatás:** az álommunka alapja, álomkérés, védelem álomban, **révülés és utazás**, végül **beavatás és erőmunka** az erő forrásaival.

**Ház, föld, emberek:** **gyertyamágia haladóknak**, **zsinór, csomó, fonal** a kötésekkel, **kert, állat, föld**, és **az év kapui** Gyertyaszentelőtől.

Az utolsó rész a nehéz anyag: **szerelmi kötések**, **átkok** — a méréssel, a szó és a tárgy átkaival —, **rontások** és az eldöntés rendje. Majd **a boszorkánylétra**, **a boszorkányseprű** mint határjelölő, és a **médiumság** három szabálya.

Zárásként **anyagtár és gyorstáblák**.

118 oldal, harminckilenc fejezet. A második kötet — [Mágia Haladóknak II.](/hu/books/magia-haladoknak-2) — ugyanezt a rendet viszi tovább nehezebb anyaggal.`,
    descriptionEn: `The first volume, and its own subtitle says what it is after: **workings, not theory**.

The opening part is **the workshop**. **Oils** for money, love, protection, spirit work and healing — with a section of their own for the **Hungarian formulas** — together with how oils are handled. **Powders and incenses**: drawing, protective, cleansing, with the rules for laying them. **Baths, washes and ointments** and the order of their use.

From there the collection, by domain.

**Money, work, success:** lodestone and magnet work, job seeking, business, **luck, travel, risk**, and finally **lawsuits, officialdom, justice** with the court workings.

**Love and passion:** attraction, **passion and body work**, fidelity, peace, family — and the other direction: **separation, release, grief**, with the cutting of the thread.

**Protection, cleansing, return** — and here begins what makes this book usable. **Diagnosis: what is on you**, with quick tests. Then cleansing and **uncrossing**, the daily protective layer and carried protection, **house and object warding**, **return and mirror work**, and finally **binding, cooling, quieting**.

Container work gets its own chapter: **poppet, honey jar, witch bottle**. Beside it **footprint, powder, crossroads** — track dirt and where it is laid.

**The dead and spirits:** **ancestor work** with the altar, the request and **the order of payment**; **cemetery and work with the dead**, with the rules of going out; **the familiar and place spirits**; **calling, circle, dismissal**.

**Sight, dream, divination, initiation:** the ground of dream work, dream requests, protection while dreaming, **flight and journeying**, and finally **initiation and power work** with the sources of power.

**House, land, people:** **candle magic for the advanced**, **cord, knot, thread** with the bindings, **garden, animal, land**, and **the gates of the year** from Candlemas.

The last part is the hard material: **love bindings**, **curses** — with the measuring, the curses of word and of object — **crossings** and the order of deciding. Then **the witch's ladder**, **the witch's broom** as a boundary marker, and the three rules of **mediumship**.

It closes with **a materials index and quick tables**.

118 pages, thirty-nine chapters. The second volume — [Magic for the Advanced II](/en/books/magia-haladoknak-2) — carries the same order into harder material.`,
  },
  {
    slug: "magia-haladoknak-2",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("magia_haladoknak_2/Magia haladoknak II_uj.pdf"),
    downloadName: "Magia-haladoknak-II.pdf",
    pages: 115,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "ESOTERIC",
    featured: true,
    accent: "amethyst",
    mark: "flame",

    titleHu: "Mágia Haladóknak II.",
    titleEn: "Magic for the Advanced II",
    subtitleHu: "Szerelem, pénz, védelem, halottak — a gyakorlat nagy tára",
    subtitleEn: "Love, money, protection, the dead — the great book of practice",
    coverTitle: "Mágia Haladóknak II.",
    coverSubtitle: "A gyakorlat nagy tára",

    blurbHu:
      "Ezerkétszáz varázslat, apparátus nélkül. Erős olajok, porok és ecetek receptjei, gyertyaöntés és bábu, zsoltárok és szentelmények, pénz- és hatalommunkák, per, szerelem és szexuális kötés, elválasztás, védőüvegek, rontáslevétel, visszatérítés és tükörmunka, sírföld és koporsószeg, halottidézés, familiáris, álomküldés, révülés, boszorkánylétra. Hatvan növény tételesen.",
    blurbEn:
      "Twelve hundred workings, with no apparatus. Recipes for strong oils, powders and vinegars, candle casting and poppets, psalms and sacramentals, money and power work, lawsuits, love and sexual binding, separation, protective bottles, uncrossing, return and mirror work, graveyard dirt and coffin nails, calling the dead, the familiar, dream sending, flight, the witch's ladder. Sixty plants listed one by one.",

    descriptionHu: `Ez a második kötet, és a hangsúlya máshol van, mint az elsőé: **az erős műhelyen**.

Az első rész maga a műhely — nem elmélet, hanem recept. **Erős olajok** a nagy formulákkal, vonzó és nyitó olajokkal, halott- és szellemolajokkal. **Porok, reszelékek, hamvak**: védő- és határporok, kemény porok, földek. **Ecetek, savak, keserű vizek**, köztük a **négy tolvaj**, a savanyító és elválasztó üvegek. **Viasz, faggyú, öntött gyertya, bábu.** És a **zsoltárok, szentek, szentelmények** — a népi gyakorlat keresztény rétege, amit a modern kiadványok rendszerint lehagynak.

Onnan a tár hat nagy fejezetcsoportban.

**Pénz, hatalom, per:** a lodestone-munka, üzlet és vevő, szerencsefordítás, a hely munkája, **tekintély és parancs**, végül a per előkészítése, a bíróság és a hatóság.

**Szerelem, szexus, kötés:** erős vonzás, **mézes- és cukros munkák**, szenvedély és szexuális kötés, békítés, család, otthon — és a másik irány: **elválasztás, szabadulás, eltávolítás**.

**Védelem és háború:** csapdák és **boszorkányüvegek**, a **rontás felismerése és levétele**, **visszatérítés és tükörmunka**, végül **kötés, hűtés, igazságtétel** — a sorrenddel együtt, amiben ezeket csinálni kell.

**Halottak és szellemek:** **sírföld, koporsószeg, temető**, halottidézés és médiumság, **familiáris** és szellemfogadás, szellemkiűzés és helytisztítás.

**Sors, látás, álom:** erős jóslás öntéssel, tükörrel, vízzel, füsttel; **álomküldés és álomfogás**; **a seprű, a kenőcs, a révülés**; **sorsfonál és boszorkánylétra**.

Függelékben **hatvan növény tételesen** és **hatvan egyperces fogás**.

115 oldal, ezerkétszáz varázslat. Nem önmunka és nem lélektan: anyag, fogás, sorrend.`,
    descriptionEn: `This is the second volume, and its weight falls elsewhere than the first's: on **the strong workshop**.

The opening part is the workshop itself — not theory but recipe. **Strong oils** with the great formulas, drawing and opening oils, oils of the dead and of spirits. **Powders, filings, ashes**: protective and boundary powders, harsh powders, earths. **Vinegars, acids, bitter waters**, including the **four thieves**, the souring and separating bottles. **Wax, tallow, cast candles, poppets.** And the **psalms, saints and sacramentals** — the Christian layer of folk practice that modern publications usually drop.

From there the collection, in six large groups.

**Money, power, law:** lodestone work, business and customers, turning luck, the work of a place, **authority and command**, and finally preparing a case, the court and the authorities.

**Love, sex, binding:** strong attraction, **honey and sugar workings**, passion and sexual binding, reconciliation, family, home — and the other direction: **separation, release, removal**.

**Protection and war:** traps and **witch bottles**, **recognising and lifting a curse**, **return and mirror work**, and finally **binding, cooling, redress** — together with the order in which these must be done.

**The dead and spirits:** **graveyard dirt, coffin nails, the cemetery**, calling the dead and mediumship, the **familiar** and taking on a spirit, exorcism and clearing a place.

**Fate, sight, dream:** strong divination by casting, mirror, water and smoke; **dream sending and dream catching**; **the broom, the ointment, the flight**; **the thread of fate and the witch's ladder**.

The appendix lists **sixty plants** one by one and **sixty one-minute methods**.

115 pages, twelve hundred workings. Not self-work and not psychology: material, grip, sequence.`,
  },
  {
    slug: "tantrikus-masszazs-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("tantrikus_masszazs_nagykonyve/A tantrikus masszazs nagykonyve.pdf"),
    downloadName: "A-tantrikus-masszazs-nagykonyve.pdf",
    pages: 326,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "ESOTERIC",
    featured: true,
    // Two chapters describe genital massage. Clearer-cut than the tantra
    // volume, and marked for the same reason: the buyer should know before
    // paying, not after opening.
    ageRestricted: true,
    accent: "copper",
    mark: "lotus",

    titleHu: "A Tantrikus Masszázs Nagykönyve",
    titleEn: "The Great Book of Tantric Massage",
    subtitleHu: "Érintés, jelenlét, beleegyezés",
    subtitleEn: "Touch, presence, consent",
    coverTitle: "A Tantrikus Masszázs",
    coverSubtitle: "Érintés, jelenlét, beleegyezés",

    blurbHu:
      "A hagyomány és a modern nyugati iskola szétválasztva, az érintés élettana, a beleegyezés és a keretek, a teljes testmenet, has, rekesz és medencefenék, jóni- és lingam-munka, az energia felvezetése, az érzelmi felszabadulás kezelése — és egy teljes fejezet a visszaélésről és a szakmai etikáról. Tizenkilenc fejezet.",
    blurbEn:
      "The tradition and the modern Western school told apart, the physiology of touch, consent and boundaries, the full body sequence, belly, diaphragm and pelvic floor, yoni and lingam work, raising the energy, handling emotional release — and a full chapter on abuse and professional ethics. Nineteen chapters.",

    descriptionHu: `Ezen a területen a legtöbb kiadvány két dolgot kever össze: azt, ami valóban indiai hagyomány, és azt, ami a hetvenes évek Kaliforniájában keletkezett. A könyv **két külön fejezetben** tárgyalja a kettőt, és kimondja azt is, **ami NINCS a hagyományban** — a hamis eredettörténetekkel és a dévadászi-kérdéssel együtt.

**A modern iskola** ugyanilyen nyíltan: a neotantra születése, Wilhelm Reich és a testterápia, az Esalen, Margot Anand, a berlini vonal, a magyar helyzet — és hogy **mi történt a kereskedelmi fordulatban**. Egy alfejezet arról, **hogyan ismerhető fel a jó és a rossz iskola**.

**Két térkép, egy test.** A finomtest — prána, öt szél, három nádí, csakrák — és a tényleges anatómia: bőr, **fascia**, izmok, vegetatív idegrendszer, női és férfi anatómia, szexuális válaszciklus, hormonális háttér. Benne egy alfejezet arról, **hol nem szabad nyomni**.

**Az érintés élettana**, ami a könyv gerince: a **C-taktilis rostok** és az optimális érintés sebessége, a **paraszimpatikus váltás**, a fascia válaszai, a fájdalomkapu, a habituáció, a testséma — és külön alfejezet arról, **amit a kutatás alátámaszt, és amit nem**.

Innen a gyakorlat, felépítve: **a beleegyezés és a keretek**, a gyakorló felkészülése, a tér és a rituálé, légzés, hang, mozgás, az **alaptechnikák**, majd a **teljes testmenet**. A has, a rekesz és a medencefenék. A **jóni-** és a **lingam-masszázs**. Az energia felvezetése és a csúcspont kezelése.

Két fejezet, ami nélkül ez a könyv felelőtlen lenne.

**Az érzelmi felszabadulás kezelése** — mert ez a munka kiold dolgokat, és a gyakorlónak tudnia kell, mit csináljon, amikor megtörténik.

**Az árnyék:** visszaélés, kizsákmányolás, szakmai etika. Plusz az **ellenjavallatok**: kinek nem való, és mikor nem szabad.

Az első fejezet előre tisztázza a **leggyakoribb tévhiteket**, megmondja, **kinek való és kinek nem**, és azt is, **amit a könyv nem tartalmaz**.

326 oldal, tizenkilenc fejezet.

**Felnőtt tartalom.** Két fejezet a nemi szervek masszázsát tárgyalja, anatómiai és gyakorlati részletességgel. 18 éven aluliaknak nem ajánljuk.`,
    descriptionEn: `In this field most publications conflate two things: what is genuinely Indian tradition, and what arose in 1970s California. The book treats them in **two separate chapters**, and states plainly **what is NOT in the tradition** — along with the false origin stories and the devadasi question.

**The modern school** gets the same candour: the birth of neotantra, Wilhelm Reich and body therapy, Esalen, Margot Anand, the Berlin line, the Hungarian situation — and **what happened in the commercial turn**. With a section on **how to tell a good school from a bad one**.

**Two maps, one body.** The subtle body — prana, the five winds, three nadis, chakras — and the actual anatomy: skin, **fascia**, muscles, the autonomic nervous system, female and male anatomy, the sexual response cycle, hormonal background. Including a section on **where not to press**.

**The physiology of touch**, which is the book's spine: the **C-tactile fibres** and the optimal speed of touch, the **parasympathetic shift**, fascial responses, the pain gate, habituation, body schema — and a section of its own on **what the research supports and what it does not**.

From there the practice, built up: **consent and boundaries**, the practitioner's preparation, space and ritual, breath, sound, movement, the **basic techniques**, then the **full body sequence**. The belly, the diaphragm and the pelvic floor. **Yoni** and **lingam** massage. Raising the energy and handling the peak.

Two chapters without which this book would be irresponsible.

**Handling emotional release** — because this work unlocks things, and the practitioner needs to know what to do when it happens.

**The shadow:** abuse, exploitation, professional ethics. Plus the **contraindications**: who it is not for, and when it must not be done.

The first chapter clears up the **commonest misconceptions** in advance, says **who it is for and who it is not**, and also **what the book does not contain**.

326 pages, nineteen chapters.

**Adult content.** Two chapters cover genital massage in anatomical and practical detail. Not recommended for readers under 18.`,
  },
  {
    slug: "magia-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("magia_nagykonyve/A magia nagykonyve.pdf"),
    downloadName: "A-magia-nagykonyve.pdf",
    pages: 229,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "ESOTERIC",
    featured: true,
    accent: "lapis",
    mark: "knot",

    titleHu: "A Mágia Nagykönyve",
    titleEn: "The Great Book of Magic",
    subtitleHu: "Világkép, erő, látás, anyag, művelet — és a műveletek tára",
    subtitleEn: "Worldview, power, sight, matter, operation — and the book of workings",
    coverTitle: "A Mágia Nagykönyve",
    coverSubtitle: "A gyakorlat és a műveletek tára",

    blurbHu:
      "A négy láb — szándék, anyag, idő, szellem —, a hasonlóság és az érintkezés törvénye, a tudók népe a bábától a táltosig, az erő öt forrása és tizenkét szivárgója, a második látás, az év mágikus naptára, negyven növény, a kilenc lépésű ritus, jóslás, a tíz alapművelet, az etika és a visszaütés. Plusz a műveletek tára: háromszáznál több rövid munka.",
    blurbEn:
      "The four legs — intent, matter, time, spirit — the laws of similarity and contact, the folk of the knowing from midwife to táltos, the five sources of power and its twelve leaks, second sight, the magical calendar of the year, forty plants, the nine-step rite, divination, the ten basic operations, ethics and backlash. Plus the book of workings: over three hundred short operations.",

    descriptionHu: `A mágiáról szóló könyvek többsége vagy receptgyűjtemény forrás nélkül, vagy művelődéstörténet gyakorlat nélkül. Ez a kötet **mindkettőt** adja, de a sorrend nem véletlen: előbb a szerkezet, utána a receptek.

Az alap a **négy láb**: szándék, anyag, idő, szellem. Minden művelet, ami a könyvben szerepel, ennek a négynek a beállítása — és amikor valami nem fog, a hibát is ezen a négyen keresi. A két törvény, amelyre az egész épül: a **hasonlóság** és az **érintkezés**, meg a név és a szó ereje.

**A tudók népe.** Bába, néző, tudós ember, táltos — a magyar hagyomány saját szakmái —, mellettük a boszorkányság, a hoodoo, a brujería, a seiðr és a hermetika. Nem egybemosva: mindegyik a maga logikájával.

**Az erő** öt forrása és **tizenkét szivárgója** — hová folyik el, amit összegyűjtöttél —, és a titok szabálya. **A látás:** a második látás, víz, tükör, füst, álom.

**Az idő és a hely:** a hold, a hét napjai, **az év mágikus naptára**, és azok a helyek, amelyeket a hagyomány erősnek tart — a határ, a keresztút, a kútfő, a tűzhely.

**Az anyag** két fejezetben: **negyven növény**, azután a kő, fém, föld, csont — só, vas, ezüst, sírföld, vörös fonal. A tűz és a gyertya, a viasz és az ólom, a szentelt víz és a füstölő.

**A ritus szerkezete:** a **kilenc lépés**, amelyből egy munka áll. **Jóslás.** A **tíz alapművelet**. A tárgyak: amulett, talizmán, zsákocska, **boszorkányüveg**, bábu. **A szellemekkel való munka:** az ősök — ahol kezdeni kell —, a helyszellemek, a familiáris, az alku és a tiltott kérés, és mi a teendő, **amikor nem az jön, akit hívtál**.

Azután a rendtartás, és itt válik el ez a könyv a műfaj többségétől. **Az etika és a visszaütés:** mi üt vissza *valójában*, mi a hagyomány tényleges álláspontja, a szürke gyakorlat öt szabálya, a harag és a bosszú kezelése, és hol a határ a gyerekeknél, betegeknél, halottaknál.

**Amikor nem sikerül** — egy teljes fejezet hibakeresésről: tényleg nem fogott? a kérés hibái, a négy láb vizsgálata, **amikor te álltál ellen**, és amikor **nem szabad**.

Végül **a műveletek tára**: háromszáznál több rövid, gyors munka pénzre, szerelemre, védelemre, gyógyításra, házra, hivatalra. Mellé a magyar néphit lényei, konyhamágia, ötven egyperces fogás, **az év nyolc kapuja**, álomszótár és jelszótár.

229 oldal, harmincnyolc fejezet és függelék.`,
    descriptionEn: `Most books on magic are either recipe collections without sources, or cultural history without practice. This one gives **both**, but the order is deliberate: structure first, recipes after.

The ground is the **four legs**: intent, matter, time, spirit. Every operation in the book is a setting of those four — and when something fails, the fault is looked for in the same four. The two laws everything rests on: **similarity** and **contact**, together with the power of the name and the word.

**The folk of the knowing.** Midwife, seer, cunning man, táltos — the Hungarian tradition's own trades — alongside witchcraft, hoodoo, brujería, seiðr and hermeticism. Not blended together: each with its own logic.

**Power**: its five sources and **twelve leaks** — where what you gather drains away — and the rule of secrecy. **Sight:** second sight, water, mirror, smoke, dream.

**Time and place:** the moon, the days of the week, **the magical calendar of the year**, and the places the tradition holds strong — the boundary, the crossroads, the spring, the hearth.

**Matter** in two chapters: **forty plants**, then stone, metal, earth, bone — salt, iron, silver, graveyard dirt, red thread. Fire and candle, wax and lead, holy water and incense.

**The structure of a rite:** the **nine steps** that make up a working. **Divination.** The **ten basic operations**. The objects: amulet, talisman, bag, **witch bottle**, poppet. **Working with spirits:** the ancestors — where one must begin — place spirits, the familiar, the bargain and the forbidden request, and what to do **when it is not who you called that comes**.

Then the discipline, and here the book parts company with most of its genre. **Ethics and backlash:** what *actually* rebounds, what the tradition's real position is, the five rules of grey practice, handling anger and revenge, and where the line falls with children, the sick and the dead.

**When it fails** — a full chapter on diagnosis: did it really fail? faults in the request, examining the four legs, **when it was you who resisted**, and when it **must not be done**.

Finally **the book of workings**: over three hundred short, quick operations for money, love, protection, healing, house and office. Alongside them the beings of Hungarian folk belief, kitchen magic, fifty one-minute methods, **the eight gates of the year**, a dream lexicon and a lexicon of signs.

229 pages, thirty-eight chapters and appendix.`,
  },
  {
    slug: "csikung-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("csikung_nagykonyve/A csikung nagykonyve.pdf"),
    downloadName: "A-csikung-nagykonyve.pdf",
    pages: 217,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "ESOTERIC",
    featured: true,
    accent: "copper",
    mark: "wheel",

    titleHu: "A Csikung Nagykönyve",
    titleEn: "The Great Book of Qigong",
    subtitleHu: "A csi művelésének teljes rendszere",
    subtitleEn: "The complete system of cultivating qi",
    coverTitle: "A Csikung Nagykönyve",
    coverSubtitle: "A csi művelése",

    blurbHu:
      "A csi és a három kincs, meridiánok és dantienek, a három szabályozás, cövekállás, Nyolc Brokát, Ínátalakítás, az Öt Állat Játéka, hat gyógyító hang, belső mosoly, kis égi kör, orvosi csikung, külső csi, vaj kung és nej kung, a belső alkímia — és a csi-zavar kezelése. Tizenhét fejezet, kétszáz feletti alfejezet.",
    blurbEn:
      "Qi and the three treasures, meridians and dantians, the three regulations, standing post, the Eight Brocades, Muscle-Tendon Change, the Five Animal Frolics, the six healing sounds, the inner smile, the microcosmic orbit, medical qigong, external qi, wai gong and nei gong, inner alchemy — and how to handle qi disturbance. Seventeen chapters, over two hundred sections.",

    descriptionHu: `A csikung legtöbb nyugati bemutatása gyakorlatgyűjtemény: itt van nyolc mozdulat, csináld reggelente. A mozdulatok megvannak, de a rendszer nincs — és ezért nem is épül semmi belőle.

Ez a kötet **a három szabályozással** kezd, mert az az egész rendszer magja: a test, a légzés és a tudat szabályozása. Minden gyakorlat, ami a könyvben szerepel, ennek a háromnak a valamilyen beállítása. Aki ezt érti, az bármelyik formát helyesen tudja végezni; aki nem, az a mozdulatot másolja.

**A csi és a három kincs.** Mit jelent a csi a kínai gondolkodásban, honnan jön, a **dzsing**, a **sen**, az alkímiai lépcső közöttük. A csi négy zavara, **hogyan fogy és hogyan gyűlik**, a napi és évszakos ingadozás — és hogy mire számíthatsz, amikor elkezd gyűlni.

**A történet**, amelyből kiderül, miért zavaros ma a kép: a Huang Ti Nej Csing, a taoista vonal, külső és belső alkímia, a Sao-lin, Hua To Öt Állat Játéka — majd az, hogy **a „csikung" szó 1949 után született**, a nyolcvanas évek láza, **1999 fordulata**, és a csikung Magyarországon.

**A finomtest térképe:** a tizenkét főmeridián, a **szervóra**, a nyolc rendkívüli edény, a zsen és a tu tengely, **a három dantien**, a tizenkét pont, amit ismerned kell, a három kapu a gerincen, a **vej csi** mező.

Azután a gyakorlás, felépítve. **Cövekállás** (csan csuang) — a legtöbbet hozó és leginkább elhanyagolt gyakorlat. A klasszikus formák: **Nyolc Brokát**, **Ínátalakítás**, az **Öt Állat Játéka**. A **hat gyógyító hang** és a **belső mosoly**. A **kis égi kör** keringetése.

**Orvosi csikung** az öt elem rendszerében, **külső csi**, a **csing megőrzése**, a **vaj kung** és **nej kung** különbsége, végül a **nej tan**: a belső alkímia.

És amit a legtöbb kiadvány elhallgat: egy fejezet a **csi-zavarról**, a csapdákról és a biztonságról. Mit jelent, mitől alakul ki, hogyan ismerd fel, mit csinálj vele.

Az első fejezet ad egy azonnal elkezdhető gyakorlatot (a **vucsi állást**), megmondja, **mit fogsz érezni az első hetekben**, felsorolja a **kilenc leggyakoribb kezdő hibát**, és azt is, **miért hagyják abba** a legtöbben.

217 oldal, tizenhét fejezet.`,
    descriptionEn: `Most Western presentations of qigong are exercise collections: here are eight movements, do them in the morning. The movements are there, the system is not — which is why nothing is built from them.

This volume starts with **the three regulations**, because that is the core of the whole system: regulating the body, the breath and the mind. Every practice in the book is some setting of those three. Understand that and you can perform any form correctly; miss it and you are copying a movement.

**Qi and the three treasures.** What qi means in Chinese thought, where it comes from, **jing**, **shen**, and the alchemical ladder between them. The four disturbances of qi, **how it is depleted and how it accumulates**, its daily and seasonal fluctuation — and what to expect when it starts to gather.

**The history**, which explains why the picture is muddled today: the Huangdi Neijing, the Taoist line, outer and inner alchemy, Shaolin, Hua Tuo's Five Animal Frolics — and then the fact that **the word "qigong" was coined after 1949**, the fever of the 1980s, **the turn of 1999**, and qigong in Hungary.

**The map of the subtle body:** the twelve main meridians, the **organ clock**, the eight extraordinary vessels, the ren and du axes, **the three dantians**, the twelve points you need to know, the three gates along the spine, the **wei qi** field.

Then the practice, built up in order. **Standing post** (zhan zhuang) — the practice that gives most and is neglected most. The classical forms: the **Eight Brocades**, **Muscle-Tendon Change**, the **Five Animal Frolics**. The **six healing sounds** and the **inner smile**. Circulating the **microcosmic orbit**.

**Medical qigong** within the five-element system, **external qi**, **preserving jing**, the difference between **wai gong** and **nei gong**, and finally **nei dan**: inner alchemy.

And what most publications leave out: a chapter on **qi disturbance**, the traps and safety. What it is, what brings it on, how to recognise it, what to do about it.

The first chapter gives a practice you can start at once (the **wuji stance**), says **what you will feel in the first weeks**, lists the **nine commonest beginner errors**, and also **why most people give up**.

217 pages, seventeen chapters.`,
  },
  {
    slug: "joga-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("joga_nagykonyve/A joga nagykonyve.pdf"),
    downloadName: "A-joga-nagykonyve.pdf",
    pages: 185,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "YOGA",
    featured: true,
    accent: "jade",
    mark: "lotus",

    titleHu: "A Jóga Nagykönyve",
    titleEn: "The Great Book of Yoga",
    subtitleHu: "A teljes ösvény: filozófia, ászana, pránájáma, finomtest",
    subtitleEn: "The complete path: philosophy, asana, pranayama, subtle body",
    coverTitle: "A Jóga Nagykönyve",
    coverSubtitle: "A teljes ösvény",

    blurbHu:
      "Számkhja, gunák és klésák, Patandzsali nyolc ága, jama és nijama, ászana funkcionális anatómiával, pránájáma, nádík és csakrák, bandha és mudrá, pratjáhára, dháraná, dhjána és szamádhi, kundaliní, a négy jógaút, sátkarma és dinacsarja. Tizenhét fejezet, száznyolcvan alfejezet.",
    blurbEn:
      "Samkhya, the gunas and kleshas, Patanjali's eight limbs, yama and niyama, asana with functional anatomy, pranayama, nadis and chakras, bandha and mudra, pratyahara, dharana, dhyana and samadhi, kundalini, the four yogic paths, shatkarma and dinacharya. Seventeen chapters, a hundred and eighty sections.",

    descriptionHu: `A második alfejezet címe: **„Mi a jóga, ha nem testgyakorlás."** A harmadiké: **„Hogyan lett a jógából fitnesz."** A könyv ezzel kezd, mert enélkül a többi nem érthető — a nyugaton ismert jóga egy több ezer éves rendszer egyetlen ágának a huszadik századi átalakulása.

Az első fejezet letisztázza a **tizenkét alapfogalmat** és a **nyolc leggyakoribb tévhitet**, elhelyezi a jógát a **hat darsana** között, és megválaszolja, hogy mi a viszonya a valláshoz.

**A történet.** Az indusvölgyi nyomok — és amit **nem tudunk** róluk —, a védikus tapasz, az upanisadok belső áldozata, a sramana-mozgalom közös gyökere, a Bhagavad-gítá három útja, Patandzsali, a tantra fordulata, a hathajóga születése, a gyarmati kor, **Krishnamacharya tornaterme**, és a jóga Magyarországon.

**A filozófiai alap**, amit a legtöbb kiadvány kihagy, pedig nélküle a gyakorlás technikák halmaza marad. Számkhja: purusa mint tanú, prakriti huszonnégy kategóriája, **a három guna** és a felismerésük, a csitta, **az öt vritti**, **az öt klésa**, karma és szamszkára, **abhjásza és vairágja** mint a két szárny.

**Patandzsali nyolc ága:** miért nyolc és miért ebben a sorrendben, a külső és a belső négy, **a kilenc akadály**, a négy hozzáállás, a szamádhi fokozatai, a krijá-jóga — és külön alfejezet arról, **mi hiányzik Patandzsaliból**.

**Jama és nijama** tételesen, a pratipaksa-bhávana módszerével, konkrét helyzetekkel — és azzal, **amikor az elvek ütköznek**.

**Ászana:** szthira és szukha, mi történik a testben, az ászanacsaládok. Utána egy teljes fejezet **funkcionális anatómia**: a gerinc négy görbülete, **mit bír a porckorong**, a medence, a csípőízület egyéni változatai, a váll, a térd, a rekeszizom, a fascia — **a hajlékonyság mítosza** és **a sérülés anatómiája**.

**Pránájáma:** az öt váju, a légzés mechanikája, teljes jógalégzés, nádí-sódhana, udzsáji, hűtő és hevítő légzések, kapálabháti és bhasztriká, a **kumbhaka** — sorrenddel, adagolással és a gyakori hibákkal.

**A finomtest:** a nádík, idá, pingalá, szusumná, a **szvara-jóga**, a csakrák és a forrásaik. **Bandha és mudrá**: a prána–apána logika, a három zár külön és együtt, a kéz- és test-mudrák, biztonsággal.

Azután a befelé vezető út: **pratjáhára** (a teknős hasonlat és a félreértés, jóga-nidrá), **dháraná** (trátaka, mantra, nádánuszandhána), **dhjána és szamádhi**, a szamjama.

A záró fejezetek: **kundaliní**, a **karma-, bhakti-, dzsnyána- és hathajóga**, a sátkarma, az étrend és a dinacsarja, végül **a saját gyakorlás felépítése**.

185 oldal, tizenhét fejezet.`,
    descriptionEn: `The second section is titled **"What yoga is, if not physical exercise."** The third: **"How yoga became fitness."** The book opens there, because without it the rest does not make sense — the yoga known in the West is the twentieth-century transformation of a single branch of a system thousands of years old.

The first chapter clears up the **twelve basic terms** and the **eight commonest misconceptions**, places yoga among the **six darshanas**, and answers how it relates to religion.

**The history.** Indus valley traces — and what we **do not** know about them — Vedic tapas, the inner sacrifice of the Upanishads, the shared root of the shramana movement, the three paths of the Bhagavad Gita, Patanjali, the tantric turn, the birth of hatha yoga, the colonial period, **Krishnamacharya's gymnasium**, and yoga in Hungary.

**The philosophical ground**, which most publications skip, though without it practice stays a heap of techniques. Samkhya: purusha as witness, the twenty-four categories of prakriti, **the three gunas** and how to recognise them, chitta, **the five vrittis**, **the five kleshas**, karma and samskara, **abhyasa and vairagya** as the two wings.

**Patanjali's eight limbs:** why eight and why in this order, the outer four and the inner four, **the nine obstacles**, the four attitudes, the stages of samadhi, kriya yoga — and a section of its own on **what is missing from Patanjali**.

**Yama and niyama** one by one, with the method of pratipaksha-bhavana, in concrete situations — and on **what to do when the principles conflict**.

**Asana:** sthira and sukha, what happens in the body, the families of postures. Then a full chapter of **functional anatomy**: the four curves of the spine, **what a disc can and cannot take**, the pelvis, individual variation in the hip joint, the shoulder, the knee, the diaphragm, the fascia — **the myth of flexibility** and **the anatomy of injury**.

**Pranayama:** the five vayus, the mechanics of breathing, full yogic breath, nadi shodhana, ujjayi, cooling and heating breaths, kapalabhati and bhastrika, **kumbhaka** — with sequence, dosage and the common errors.

**The subtle body:** the nadis, ida, pingala, sushumna, **svara yoga**, the chakras and their sources. **Bandha and mudra**: the prana–apana logic, the three locks separately and together, hand and body mudras, with safety.

Then the inward path: **pratyahara** (the tortoise simile and its misreading, yoga nidra), **dharana** (trataka, mantra, nadanusandhana), **dhyana and samadhi**, samyama.

The closing chapters: **kundalini**, the **karma, bhakti, jnana and hatha** paths, shatkarma, diet and dinacharya, and finally **building your own practice**.

185 pages, seventeen chapters.`,
  },
  {
    slug: "meditacio-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("meditacio_nagykonyve/A meditacio nagykonyve.pdf"),
    downloadName: "A-meditacio-nagykonyve.pdf",
    pages: 224,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "YOGA",
    featured: true,
    accent: "jade",
    mark: "sun",

    titleHu: "A Meditáció Nagykönyve",
    titleEn: "The Great Book of Meditation",
    subtitleHu: "A légzéstől a dzshánákig, a belátástól a természetes állapotig",
    subtitleEn:
      "From the breath to the jhanas, from insight to the natural state",
    coverTitle: "A Meditáció Nagykönyve",
    coverSubtitle: "A tudat művelése",

    blurbHu:
      "Samatha és a kilenc szakasz, a dzshánák, ánápánaszati, a négy éberségalap, a belátás tizenhat tudása, metta és tonglen, zazen és kóan, lamrim és istenségjóga, mahámudrá és dzogcsen — Patandzsalival, taoista, szúfi és keresztény utakkal, és azzal, amit az agykutatás mond. Tizenhét fejezet, 248 alfejezet.",
    blurbEn:
      "Samatha and its nine stages, the jhanas, anapanasati, the four foundations of mindfulness, the sixteen insight knowledges, metta and tonglen, zazen and koan, lamrim and deity yoga, mahamudra and Dzogchen — with Patanjali, Taoist, Sufi and Christian paths, and what the neuroscience says. Seventeen chapters, 248 sections.",

    descriptionHu: `Az első alfejezet címe: **„A szó, amely félrevezet."** A könyv azzal kezd, hogy a *meditáció* egyetlen szóval jelöl több tucat, egymástól gyökeresen eltérő műveletet — és hogy a legtöbb kudarc abból ered, hogy valaki a céljához nem illő technikát gyakorol évekig.

Innen a **négy mechanizmus**, ami ténylegesen dolgozik, és a **két tengely**, amely mentén minden módszer elhelyezhető: a **stabilitás** és a **tisztaság**. Ezzel a két koordinátával a könyv megmondja, melyik ösvény való neked — nem ízlés, hanem szerkezet alapján.

**A test.** A hét pont, szék, pad vagy föld, a fájdalom kezelése, légzés és idegrendszer, a tekintet, az ülés szerkezete, és ami hosszú gyakorlásban elromlik.

**Samatha.** A kilenc szakasz, a hat erő, a két őr — éberség és introspekció —, az **öt hiba és a nyolc ellenszer**, a negyven klasszikus tárgy, a kaszinák, a nimitta, a píti. Hatvannapos protokollal, és egy alfejezettel arról, mit tegyél, **ha nem épül a koncentráció**.

**A dzshánák.** A belépés feltételei, az öt tényező, az első négy dzshána, a négy formanélküli szféra, kemény és lágy dzshánák, **hamis dzshánák és csapdák** — és a tisztességes kérdés: *kell-e neked egyáltalán dzshána*.

**Ánápánaszati** tizenhat lépésben, a thai erdei és a zen változattal, és azzal, mit csinálj, **amikor a légzés eltűnik**.

**A négy éberségalap és a vipasszaná**, a mahási-jegyzés és a goenka-testpásztázás.

**A belátás szakaszai.** A tizenhat tudás, köztük a **dukkha-nyánák** — a „sötét éjszaka" —, és külön alfejezet arról, mit csinálj benne. Az ösvény-pillanat, a négy ösvény, a tíz béklyó, a ciklusok, és őszintén: **a térkép veszélyei**.

**A szív művelése.** Metta, karuná, muditá, upékkhá a közeli és távoli ellenségeikkel, **tonglen**, a megbocsátás, és az önegyüttérzés — amit a könyv nyugati hiánynak nevez.

Azután a hagyományok a maguk módszertanával: **zen** (zazen, kóan, sikantaza), a **tibeti ösvény** (analitikus meditáció, lamrim, zsiné, ngöndro, lodzsong, istenségjóga, álomjóga, a halál gyakorlása), végül **mahámudrá és dzogcsen** — a négy jóga, a rámutatás, rushen, szemdzin, trekcsö, tögal, és hogy *mi a különbség a kettő között*.

A záró fejezetek: Patandzsali és a mantra, taoista, szúfi és keresztény utak, **MBSR és az agykutatás**, az akadályok és az **árnyékoldal**, az elvonulás és a tanító kérdése.

224 oldal, tizenhét fejezet, 248 alfejezet.`,
    descriptionEn: `The first section is titled **"The word that misleads."** The book opens by pointing out that *meditation* names dozens of radically different operations with a single word — and that most failure comes from practising, for years, a technique that does not fit the goal.

From there the **four mechanisms** that actually do the work, and the **two axes** along which every method can be placed: **stability** and **clarity**. With those two coordinates the book can say which path suits you — by structure, not by taste.

**The body.** The seven points, chair, bench or floor, dealing with pain, breath and nervous system, the gaze, the structure of a sitting, and what goes wrong over long practice.

**Samatha.** The nine stages, the six powers, the two guards — mindfulness and introspection — the **five faults and eight antidotes**, the forty classical objects, the kasinas, the nimitta, piti. With a sixty-day protocol, and a section on what to do **when concentration will not build**.

**The jhanas.** Conditions for entry, the five factors, the first four jhanas, the four formless spheres, hard and soft jhanas, **false jhanas and traps** — and the honest question: *do you need jhana at all*.

**Anapanasati** in sixteen steps, with the Thai forest and Zen variants, and what to do **when the breath disappears**.

**The four foundations and vipassana**, Mahasi noting and Goenka body-scanning.

**The stages of insight.** The sixteen knowledges, including the **dukkha ñanas** — the "dark night" — with a section of its own on what to do inside it. The path moment, the four paths, the ten fetters, the cycles, and frankly: **the dangers of the map**.

**Cultivating the heart.** Metta, karuna, mudita, upekkha with their near and far enemies, **tonglen**, forgiveness, and self-compassion — which the book calls a Western absence.

Then the traditions with their own methods: **Zen** (zazen, koan, shikantaza), the **Tibetan path** (analytical meditation, lamrim, shiné, ngöndro, lojong, deity yoga, dream yoga, practising death), and finally **mahamudra and Dzogchen** — the four yogas, pointing out, rushen, semdzin, trekchö, tögal, and *what the difference between the two actually is*.

The closing chapters: Patanjali and mantra, Taoist, Sufi and Christian paths, **MBSR and the neuroscience**, the obstacles and the **shadow side**, retreat and the question of a teacher.

224 pages, seventeen chapters, 248 sections.`,
  },
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
