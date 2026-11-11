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
    slug: "szatipatthana-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("szatipatthana_nagykonyve/A szatipatthana nagykonyve.pdf"),
    downloadName: "A-szatipatthana-nagykonyve.pdf",
    pages: 432,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "BUDDHIST",
    featured: true,
    accent: "saffron",
    mark: "lotus",

    titleHu: "A Szatipatthána Nagykönyve",
    titleEn: "The Great Book of Satipatthana",
    subtitleHu: "A négy éberségi alapzat: a szutta, a hagyomány, a gyakorlás",
    subtitleEn: "The four foundations of mindfulness: text, tradition, practice",
    coverTitle: "A Szatipatthána Nagykönyve",
    coverSubtitle: "A négy éberségi alapzat",

    blurbHu:
      "A Szatipatthána-szutta teljes feldolgozása: a három szövegváltozat, mi a szati valójában, a refrén mint módszer, a légzés tizenhat lépése, a testtartások és a tiszta tudás, a test részei és a négy elem, a temetőszemlélések, az érzések, a tudatállapotok, az öt akadály, az öt halmaz, a hat érzékkapu, a hét ébredési tényező, a négy igazság mint gyakorlat. Tizenkilenc fejezet, kétszáz feletti kidolgozott gyakorlat.",
    blurbEn:
      "The Satipatthana Sutta worked through in full: the three recensions, what sati actually is, the refrain as method, the sixteen steps of breathing, the postures and clear comprehension, the parts of the body and the four elements, the charnel-ground contemplations, feelings, states of mind, the five hindrances, the five aggregates, the six sense doors, the seven awakening factors, the four truths as practice. Nineteen chapters, over two hundred worked exercises.",

    descriptionHu: `Négyszázharminckét oldal egyetlen szuttáról — és ez pontosan annyi, amennyit a szöveg elbír. A Szatipatthána-szutta a buddhista gyakorlás legtöbbet idézett és legkevésbé végigolvasott alapszövege: mindenki ismeri a négy alapzat nevét, és kevesen tudják, **mit mond a refrén**, amit a szutta huszonegyszer elismétel.

A könyv gerince éppen ez. A refrén **nem díszítés, hanem a módszer** — ugyanaz az utasítás mind a huszonegy helyen, és aki ezt érti, az bármelyik gyakorlatot helyesen végzi. Külön fejezet szól róla, mielőtt az alapzatok sorra kerülnének.

Előtte két tisztázás. **Mi a szati valójában** — az „éberség" szó miért kevés, mi az **emlékezés-gyök**, a szati **nyolc funkciója**, és mi a különbsége a figyelemtől. Mellette a **szampadzsannya**, a tiszta tudás, és az **átápí**, a nem lanyhuló erőfeszítés. Azután **a szöveg**: a három változat (MN 10, DN 22, MN 118), a szerkezet, a fordítási nehézségek, a kommentárhagyomány — és tisztességesen az is, **amit a szutta nem mond meg**.

Innen a négy alapzat, mindegyik a maga teljes anyagával.

**A test:** a **légzés tizenhat lépése**, a **testtartások és a tiszta tudás**, a test részei, a **négy elem**, végül a **temetőszemlélések** — a romlandóság szemlélése, amit a népszerű irodalom rendre kihagy.

**Az érzések:** a vedanánupasszaná, a kellemes, kellemetlen és semleges érzés megkülönböztetése, és az a pont, ahol az érzésből vágy lesz.

**A tudat:** a cittánupasszaná, a tudatállapotok felismerése — és hozzá az **öt akadály** a maguk ellenszereivel.

**A jelenségek:** az **öt halmaz** mint a tapasztalás szétszedése, a **hat érzékkapu** és a kontaktus szerkezete, a **hét ébredési tényező** a kiegyensúlyozás módszerével, végül **a négy nemes igazság mint gyakorlat** — nem tételként, hanem műveletként.

A záró fejezetek teszik használhatóvá: **a gyakorlás rendszere** — napi rend, ülés, hétköznap — és **a nehézségek és buktatók**.

Az első fejezet előre elrendezi, ami a legtöbb félreértést okozza: **mire nem való** a szatipatthána, mi a viszonya a **modern mindfulnesshez**, **amit a kutatás tud és amit nem**, a **szíla** mint előfeltétel, **mire számíts az első három hónapban**, és **amit a könyv nem tartalmaz**.

432 oldal, tizenkilenc fejezet, kétszáz feletti kidolgozott gyakorlat.`,
    descriptionEn: `Four hundred and thirty-two pages on a single sutta — and that is exactly what the text can carry. The Satipatthana Sutta is the most quoted and least read-through foundational text of Buddhist practice: everyone knows the names of the four foundations, and few know **what the refrain says** — the one the sutta repeats twenty-one times.

That refrain is the book's spine. It is **not decoration but the method** — the same instruction in all twenty-one places, and whoever understands it can perform any of the exercises correctly. It gets a chapter of its own before the foundations are taken up.

Two clarifications come first. **What sati actually is** — why "mindfulness" is not enough, what the **memory root** means, the **eight functions** of sati, and how it differs from attention. Alongside it **sampajañña**, clear comprehension, and **ātāpī**, unflagging effort. Then **the text**: the three recensions (MN 10, DN 22, MN 118), the structure, the difficulties of translation, the commentarial tradition — and, honestly, **what the sutta does not tell you**.

From there the four foundations, each with its full material.

**The body:** the **sixteen steps of breathing**, the **postures and clear comprehension**, the parts of the body, the **four elements**, and finally the **charnel-ground contemplations** — the contemplation of decay that popular literature routinely omits.

**Feelings:** vedanānupassanā, telling pleasant, unpleasant and neutral apart, and the exact point at which feeling becomes craving.

**Mind:** cittānupassanā, recognising states of mind — with the **five hindrances** and their antidotes.

**Phenomena:** the **five aggregates** as the dismantling of experience, the **six sense doors** and the structure of contact, the **seven awakening factors** with the method of balancing them, and finally **the four noble truths as practice** — not as propositions but as operations.

The closing chapters make it usable: **the system of practice** — daily order, sitting, ordinary life — and **the difficulties and pitfalls**.

The first chapter settles in advance what causes most of the confusion: **what satipatthana is not for**, how it relates to **modern mindfulness**, **what the research knows and what it does not**, **sīla** as a precondition, **what to expect in the first three months**, and **what the book does not contain**.

432 pages, nineteen chapters, over two hundred worked exercises.`,
  },
  {
    slug: "tibeti-bolcsessegek-nagykonyve",
    file: f("A TIBETI BÖLCSESSÉGEK ÉS MONDÁSOK NAGYKÖNYVE.pdf"),
    downloadName: "A-tibeti-bolcsessegek-nagykonyve.pdf",
    pages: 233,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "BUDDHIST",
    featured: true,
    accent: "gold",
    mark: "wheel",

    titleHu: "A Tibeti Bölcsességek és Mondások Nagykönyve",
    titleEn: "The Great Book of Tibetan Wisdom and Sayings",
    subtitleHu: "A mondás, amit megjegyzel — és a fogás, amit vele csinálsz",
    subtitleEn: "The saying you remember — and what you do with it",
    coverTitle: "Tibeti Bölcsességek",
    coverSubtitle: "Mondások és fogások",

    blurbHu:
      "Nyolcszáznál több mondás, mindegyikhez fogás. A hét műfaj a közmondástól a szívbéli tanácsig, Szakja Pandita kincstára, Gampopa tízesei, Atísa drágakő-füzére, a tudatedzés ötvenkilenc jelszava, Padmaszambhava tanácsai, Milarépa énekei, Longcsenpa harminc tanácsa — és a népi mondások tizennégy témában. Harmincöt fejezet.",
    blurbEn:
      "Over eight hundred sayings, each with something to do with it. The seven genres from proverb to heart advice, Sakya Pandita's treasury, Gampopa's tens, Atisha's jewel garland, the fifty-nine slogans of mind training, Padmasambhava's counsels, Milarepa's songs, Longchenpa's thirty pieces of advice — and the folk sayings in fourteen themes. Thirty-five chapters.",

    descriptionHu: `A mondásgyűjteményekkel az a baj, hogy el lehet olvasni őket. Végigfut az ember nyolcszáz bölcsességen, mindegyiknél bólint, és másnapra egy sem marad meg — mert a mondás nem olvasnivaló, hanem **eszköz**.

Ez a kötet ezért minden tételhez **fogást** ad: mit csinálj vele. A harmadik fejezet külön a módszerről szól — a hét lépés, **hogyan jegyezz meg egy mondást négy fogással**, az **öt mód, ahogy el szoktuk rontani**, és mit tegyél, **amikor nem fog**.

Előtte viszont tisztáz valamit, ami nélkül az egész összekeveredik: **a hét műfajt**, és hogy **melyikkel mit szabad tenni**.

A **gtam dpe** a közmondás, a **legs bshad** az aforizma, az **mgur** a megvalósítás-ének, a **zhal gdams** a szívbéli tanács, a **blo sbyong** a tudatedzés-jelszó, a **bslab bya** a tízes-lista, a **rnam thar** pedig az életrajzi anekdota.

Ez nem tudományos finomkodás: egy közmondással és egy megvalósítás-énekkel **nem ugyanazt lehet kezdeni**. A fejezet végigveszi a műfajokat egymás ellen, és kimond **négy ütközést, amelyet a könyv nem old fel**.

**A klasszikus források**, fejezetenként: **Szakja Pandita** kincstára három fejezetben — beszéd és hallgatás, hatalom, vagyon, barát, ellenség —, **Gampopa tízesei** kettőben, **Atísa drágakő-füzére** és a kadampa mesterek, a **tudatedzés ötvenkilenc jelszava**, **Padmaszambhava tanácsai**, **Milarépa énekei**, **Longcsenpa harminc szívbéli tanácsa**, Patrul Rinpocse, Dzsamgön Kongtrül, Sabkar, **Padampa Szangje száz tanácsa**, Macsig Labdrön — végül a huszadik századi mesterek Dudzsom és Dilgo Khjence Rinpocsétól.

**A népi mondások** tizennégy témában, és itt derül ki, hogy ez a hagyomány nem csupa fenség: **beszéd és hallgatás**, barát, rokon, szomszéd, **az ellenség és a sértés**, pénz, **munka és lustaság**, étel, test, betegség, **hatalom, hivatal, úr és szolga**, az ostoba és a bölcs, **düh, pletyka, irigység, büszkeség**, idő, szerencse, sors, karma, a hegy és az állat mint hasonlat, **halál, gyász, öregség**, család, házasság, gyerek — és egy teljes fejezet **nevetésről és fekete humorról**, benne a vallási képmutatásról.

A záró három fejezet teszi használhatóvá: **melyik mondás mikor** — helyzetek szerinti rendezés —, **a napi gyakorlat** nyolcszáz mondásra két évre bontva, és **a félreértett és hamis mondások** tíz félreértéssel.

Minden fejezet úgy zárul, hogy **„a mondás, amit ma viszel"**.

233 oldal, harmincöt fejezet.`,
    descriptionEn: `The trouble with collections of sayings is that they can be read. You run through eight hundred pieces of wisdom, nod at each, and by the next day not one has stayed — because a saying is not reading matter, it is a **tool**.

So this volume gives every entry something **to do with it**. The third chapter is about method alone — the seven steps, **how to commit a saying to memory with four techniques**, the **five ways we habitually get this wrong**, and what to do **when a saying does not take**.

Before that it settles something without which the whole thing blurs: **the seven genres**, and **what may be done with each**.

**gtam dpe** is the proverb, **legs bshad** the aphorism, **mgur** the song of realisation, **zhal gdams** the heart advice, **blo sbyong** the mind-training slogan, **bslab bya** the list of tens, and **rnam thar** the biographical anecdote.

This is not scholarly fussiness: a proverb and a song of realisation **cannot be used the same way**. The chapter sets the genres against each other and states **four conflicts the book does not resolve**.

**The classical sources**, chapter by chapter: **Sakya Pandita's** treasury in three — speech and silence, power, wealth, friend, enemy — **Gampopa's tens** in two, **Atisha's jewel garland** and the Kadampa masters, the **fifty-nine slogans of mind training**, **Padmasambhava's counsels**, **Milarepa's songs**, **Longchenpa's thirty pieces of heart advice**, Patrul Rinpoche, Jamgön Kongtrul, Shabkar, **Padampa Sangye's hundred counsels**, Machig Labdrön — and finally the twentieth-century masters from Dudjom to Dilgo Khyentse Rinpoche.

**The folk sayings** in fourteen themes, where it becomes clear that this tradition is not all loftiness: **speech and silence**, friend, relative, neighbour, **the enemy and the insult**, money, **work and idleness**, food, body, illness, **power, office, master and servant**, the fool and the wise, **anger, gossip, envy, pride**, time, luck, fate, karma, mountain and animal as simile, **death, grief, old age**, family, marriage, children — and a full chapter on **laughter and black humour**, religious hypocrisy included.

The closing three chapters are what make it usable: **which saying when** — arranged by situation — **the daily practice**, eight hundred sayings spread over two years, and **the misunderstood and the fake sayings**, with ten misreadings.

Every chapter ends with **"the saying you take with you today"**.

233 pages, thirty-five chapters.`,
  },
  {
    slug: "uresseg-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("uresseg_nagykonyve/Az uresseg nagykonyve.pdf"),
    downloadName: "Az-uresseg-nagykonyve.pdf",
    pages: 250,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    category: "BUDDHIST",
    featured: true,
    accent: "lapis",
    mark: "sun",

    titleHu: "Az Üresség Nagykönyve",
    titleEn: "The Great Book of Emptiness",
    subtitleHu: "A madhjamaka: Nágárdzsuna érvei és hasonlatai",
    subtitleEn: "Madhyamaka: Nagarjuna's arguments and similes",
    coverTitle: "Az Üresség Nagykönyve",
    coverSubtitle: "A madhjamaka iskola",

    blurbHu:
      "A madhjamaka teljes feldolgozása: a szvabháva születése, a pradnyápáramitá, Nágárdzsuna és a Múlamadhjamakakáriká, a prasanga, a tetralemma, a keletkezés és a mozgás cáfolata, a hétszeres szekérvizsgálat, a két igazság, az üresség üressége, a nihilizmus vádja, Csandrakírti, rangtong és sentong. Harminc fejezet.",
    blurbEn:
      "Madhyamaka in full: the rise of svabhava, the Prajnaparamita, Nagarjuna and the Mulamadhyamakakarika, prasanga, the tetralemma, the refutations of arising and motion, the sevenfold chariot analysis, the two truths, the emptiness of emptiness, the charge of nihilism, Candrakirti, rangtong and shentong. Thirty chapters.",

    descriptionHu: `Az üresség a buddhizmus legfélreértettebb fogalma, és a félreértések nem véletlenszerűek: mindig ugyanabból a hibából erednek. A könyv ezért **pontosan megmondja, mit tagad a madhjamaka** — a **szvabhávát**, az önálló, független létezést —, és **mit nem**: a létezést magát.

Ezért van a kötet végén **negyvenöt félreértés** tételesen, és ezért kap önálló fejezetet **a nihilizmus vádja**: ha semmi nem létezik önállóan, mi lesz a karmával, az etikával, a működéssel?

**Az előzmények.** Az abhidharma dharma-elmélete, amelyből a szvabháva fogalma megszületett, majd a **pradnyápáramitá** szútrák, amelyekből a madhjamaka kinő. Aztán **Nágárdzsuna** és a Múlamadhjamakakáriká.

**A módszer**, amit a legtöbb ismertetés kihagy. A **prasanga**: cáfolat saját tézis nélkül — nem állít, hanem az ellenfél állításából vezet le ellentmondást. A **tetralemma** négy sarka. És a **függő keletkezés**, amit a könyv „az érvek királyának" nevez.

Azután az érvek egyenként, mindegyik külön fejezetben: **a keletkezés cáfolata** (a négy ág), **a mozgás cáfolata**, a **tűz és tüzelő** azonosság-különbözőség vizsgálata, a **jellemzők regresszusa**, a cselekvő és a cselekvés, az **én cáfolata a hétszeres szekérvizsgálattal**, majd idő, tér, elemek, érzékelés, végül **nirvána, szamszára és a Tathágata**.

Külön fejezet **a hasonlatok nagy katalógusa** — tükörkép, visszhang, délibáb, álom, holdtükröződés —, mert ezek nem díszítések, hanem a tanítás hordozói.

**A két igazság** és **az üresség üressége**: hogy maga az üresség sem szvabháva, különben az egész rendszer megdőlne.

Majd a továbbélés: **Árjadéva, Buddhapálita, Bhávavivéka** és a szétválás, **Csandrakírti**, Sántidéva, Sántaraksita és Kamalasíla; a madhjamaka **Kelet-Ázsiában** (Csi-cang és a szanlun) és **Tibetben** — a **rangtong–sentong** vita.

A záró fejezetek: **az üresség mint gyakorlat** — mert ez nem pusztán filozófia —, az üresség és a nyugati filozófia (**Wittgenstein**, **Parfit**), és a logika mai olvasatai, köztük a **parakonzisztens** értelmezés.

250 oldal, harminc fejezet.`,
    descriptionEn: `Emptiness is the most misunderstood concept in Buddhism, and the misunderstandings are not random: they come from the same mistake every time. So the book states exactly **what Madhyamaka denies** — **svabhava**, independent intrinsic existence — and **what it does not**: existence itself.

That is why the volume closes with **forty-five misunderstandings** listed one by one, and why **the charge of nihilism** gets a chapter of its own: if nothing exists independently, what becomes of karma, of ethics, of anything working at all?

**The background.** The Abhidharma dharma theory out of which the notion of svabhava arose, then the **Prajnaparamita** sutras from which Madhyamaka grows. Then **Nagarjuna** and the Mulamadhyamakakarika.

**The method**, which most accounts skip. **Prasanga**: refutation without a thesis of one's own — it asserts nothing, it derives a contradiction from the opponent's claim. The four corners of the **tetralemma**. And **dependent origination**, which the book calls "the king of arguments".

Then the arguments one by one, each in its own chapter: **the refutation of arising** (the four alternatives), **the refutation of motion**, the **fire and fuel** examination of sameness and difference, the **regress of characteristics**, agent and action, **the refutation of self by the sevenfold chariot analysis**, then time, space, elements, perception, and finally **nirvana, samsara and the Tathagata**.

A chapter of its own holds **the great catalogue of similes** — reflection, echo, mirage, dream, the moon on water — because these are not decoration but the vehicle of the teaching.

**The two truths** and **the emptiness of emptiness**: that emptiness itself is not a svabhava either, or the whole system would collapse.

Then the afterlife: **Aryadeva, Buddhapalita, Bhavaviveka** and the parting of ways, **Candrakirti**, Shantideva, Shantarakshita and Kamalashila; Madhyamaka in **East Asia** (Jizang and Sanlun) and in **Tibet** — the **rangtong–shentong** controversy.

The closing chapters: **emptiness as practice** — because this is not philosophy alone — emptiness and Western philosophy (**Wittgenstein**, **Parfit**), and today's logical readings, including the **paraconsistent** interpretation.

250 pages, thirty chapters.`,
  },
  {
    slug: "buddhizmus-nagykonyve",
    // The builder's own output, so rebuilding the book is all it takes for
    // the next publish to carry the change.
    file: f("buddhista_alapismeretek/A buddhizmus nagykonyve.pdf"),
    downloadName: "A-buddhizmus-nagykonyve.pdf",
    pages: 233,
    priceHuf: 4990,
    author: AUTHOR,
    series: SERIES,
    featured: true,
    accent: "saffron",
    mark: "wheel",

    titleHu: "A Buddhizmus Nagykönyve",
    titleEn: "The Great Book of Buddhism",
    subtitleHu: "Alapismeretek a négy igazságtól a három járműig",
    subtitleEn: "The essentials, from the four truths to the three vehicles",
    coverTitle: "A Buddhizmus Nagykönyve",
    coverSubtitle: "Alapismeretek",

    blurbHu:
      "A Buddha tanításának teljes alapozása: négy nemes igazság, nyolcas ösvény, három jellegzetesség, öt halmaz, függő keletkezés, karma, menedék, síla, samatha és vipasszaná, abhidharma, a négy éberségalap, a brahmavihárák, a három jármű és a kánonok. Tizenhét fejezet, százhetvenhat alfejezet.",
    blurbEn:
      "A complete grounding in the Buddha's teaching: the four noble truths, the eightfold path, the three marks, the five aggregates, dependent origination, karma, refuge, sila, samatha and vipassana, abhidharma, the four foundations of mindfulness, the brahmaviharas, the three vehicles and the canons. Seventeen chapters, a hundred and seventy-six sections.",

    descriptionHu: `A buddhizmus meghatározásával az a nehézség, hogy a nyugati *vallás* fogalma rosszul illeszkedik rá. Nincs benne teremtő isten, nincs kinyilatkoztatott szentírás, nincs hitvallás, amelynek elfogadása tagsággal járna. Ugyanakkor van szerzetesrend, szertartás, erkölcsi szabályrendszer, kozmológia és halál utáni tanítás.

A hagyomány saját önmeghatározása pontosabb: a buddhizmus **ösvény**. Olyasvalami, amit az ember bejár, nem olyasvalami, amiben hisz. A Buddha nem azt kérte, hogy fogadják el, amit mond, hanem hogy próbálják ki.

Ebből három gyakorlati következmény adódik, és a könyv ezeken áll. **Nem kell elhinned semmit, hogy elkezdhesd** — a meditáció és az erkölcsi gyakorlás nem igényel előzetes elkötelezést a karma vagy az újraszületés mellett. **A saját tapasztalat a mérce, de nem akármilyené**: egy szétszórt tudat megfigyelései annyit érnek, mint egy remegő kézben tartott mikroszkóp, és ezért van a meditáció a rendszer közepén — nem élményszerzés, hanem műszerkalibrálás. **Az ösvénynek sorrendje van**: erkölcs, elmélyedés, bölcsesség. Aki a meditációval kezd, miközben az élete szétesik, a technikát fogja okolni.

A kötet végigviszi az egész alapozást. A **Buddha élete** és kora, a **négy nemes igazság** orvosi szerkezete, a **nemes nyolcas ösvény** nem lépcsőként, hanem spirálként. A **három jellegzetesség** és az **öt halmaz**, az éntelenség és az a kérdés, mit kezdjünk az újraszületéssel én nélkül.

A **függő keletkezés** tizenkét láncszeme, a **karma** — mit jelent és mit nem —, a hat létforma. A **három menedék**, és az is, mi a teendő, amikor a menedék megrendül. A **síla**: öt, nyolc és tíz fogadalom, a vinaja, az adakozás, az etikai dilemmák.

A **meditáció**: testtartás, ánápánaszati, samatha, az öt akadály, vipasszaná, napi rend és a gyakori hibák. Az **abhidharma** mint a tudat működésének térképe — tudatpillanat, tudati tényezők, a három gyökérméreg, és az érzékelés folyamatában az a pont, ahol be lehet avatkozni.

A **Szatipatthána-szutta** négy alapja egyenként, a **négy brahmavihára** a közeli és távoli ellenségeikkel, a **három jármű** a théravádától a vadzsrajánáig, az **üresség** és a madhjamaka, a buddhatermészet.

Végül a **kánonok** — páli, tibeti, kínai —, hogy hogyan olvass buddhista szöveget és milyen sorrendben, a buddhizmus **története és földrajza**, és egy teljes fejezet arról, hogyan néz ki mindez a mindennapokban: napi gyakorlás, elvonulás, tanító és közösség, munka, család, pénz, betegség és halál, az első év ütemterve.

Függelék: glosszárium, a számozott listák, a három hagyomány összehasonlítása, fontos alakok időrendben, kiejtési és átírási útmutató, kérdések és válaszok.

233 oldal, tizenhét fejezet, százhetvenhat alfejezet. Ez a kötet az alap; a tibeti anyagok innen indulnak tovább.`,
    descriptionEn: `Defining Buddhism is awkward because the Western notion of *religion* fits it badly. There is no creator god, no revealed scripture in the sense the Bible or the Qur'an is one, and no creed whose acceptance confers membership. And yet there is a monastic order, ritual, a moral code, a cosmology and a teaching about death.

The tradition's own self-description is more exact: Buddhism is a **path**. Something a person walks, not something they believe. The Buddha did not ask his listeners to accept what he said, but to test it.

Three practical consequences follow, and the book rests on them. **You need believe nothing to begin** — meditation and ethical practice require no prior commitment to karma or rebirth. **Your own experience is the measure, but not just any experience**: the observations of a scattered mind are worth about as much as a microscope held in a shaking hand, which is why meditation sits at the centre of the system — not as experience-gathering but as calibration. **The path has an order**: ethics, concentration, wisdom. Begin with meditation while your life falls apart and you will blame the technique.

The volume works through the whole grounding. The **Buddha's life** and his age; the medical structure of the **four noble truths**; the **eightfold path** not as a staircase but as a spiral. The **three marks** and the **five aggregates**, non-self, and the question of what to make of rebirth without a self.

The twelve links of **dependent origination**, **karma** — what it means and what it does not — and the six realms. The **three refuges**, including what to do when refuge falters. **Sila**: the five, eight and ten precepts, the vinaya, giving, ethical dilemmas.

**Meditation**: posture, anapanasati, samatha, the five hindrances, vipassana, daily structure and the common faults. **Abhidharma** as a map of how mind works — mind-moments, mental factors, the three root poisons, and the point in perception where intervention is possible.

The four foundations of the **Satipatthana Sutta** one by one, the **four brahmaviharas** with their near and far enemies, the **three vehicles** from Theravada to Vajrayana, **emptiness** and Madhyamaka, buddha-nature.

Finally the **canons** — Pali, Tibetan, Chinese — how to read a Buddhist text and in what order, the **history and geography** of Buddhism, and a full chapter on what all this looks like day to day: daily practice, retreat, finding a teacher and a community, work, family, money, illness and death, and a timetable for the first year.

Appendix: glossary, the numbered lists, a comparison of the three traditions, key figures in chronological order, a pronunciation and transliteration guide, questions and answers.

233 pages, seventeen chapters, a hundred and seventy-six sections. This volume is the foundation; the Tibetan material starts from here.`,
  },
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
