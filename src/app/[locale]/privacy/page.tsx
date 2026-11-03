import type { Metadata } from "next";

import { LegalPage, type Section } from "@/components/legal-page";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { company, env, siteUrl } from "@/lib/env";
import { resolvePage } from "@/lib/page-locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).legal.privacyTitle };
}

/**
 * Written from what the application actually stores and who it actually
 * sends data to - the schema and the integrations, not a template. A
 * generic notice would describe a shop that does not exist, which is worse
 * than none.
 */
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const host = siteUrl().replace(/^https?:\/\//, "");
  const seller = company().name;

  const hu: Section[] = [
    {
      heading: "Ki kezeli az adataidat",
      body: [
        `A ${env.storeName} webáruházat a ${seller} üzemelteti. A cég azonosító adatai a fenti táblázatban. Az oldal címe: ${host}.`,
        "Ez a tájékoztató arról szól, milyen adatot kér tőled a bolt, miért, meddig őrzi, és kinek adja tovább.",
      ],
    },
    {
      heading: "Milyen adatot kezelünk",
      body: [
        "**Fiók**: név, e-mail-cím, jelszó (soha nem magát a jelszót, csak annak visszafejthetetlen lenyomatát), a választott nyelv, és hogy megerősítetted-e az e-mail-címed.",
        "**Google-belépés esetén**: a Google-től kapott név, e-mail-cím és profilkép. Jelszó ilyenkor nem keletkezik.",
        "**Vásárlás**: a megrendelés tételei, összege, állapota, és a számlázási adatok — név, ország, irányítószám, település, cím, és ha megadod, adószám.",
        "**Letöltés**: minden letöltésnél rögzítjük az időpontot, az IP-címet és a böngésző azonosítóját. Erre azért van szükség, hogy a megvásárolt fájlok tömeges továbbadását észrevegyük.",
        "**Fizetés**: bankkártyaadatot a bolt nem lát és nem tárol. A fizetés végig a Stripe oldalán zajlik.",
      ],
    },
    {
      heading: "Miért kezeljük",
      body: [
        "**A szerződés teljesítéséhez**: fiók, megrendelés, letöltési jogosultság. Enélkül nem tudnánk átadni a megvásárolt könyvet.",
        "**Jogi kötelezettség miatt**: a számlázási adatokat a számviteli törvény alapján őrizzük, és a kiállított számlát a Számlázz.hu jelenti a NAV Online Számla rendszerébe.",
        "**Jogos érdekből**: a letöltési napló a visszaélések felismeréséhez.",
      ],
    },
    {
      heading: "Kinek adjuk tovább",
      body: [
        "Csak azoknak a szolgáltatóknak, amelyek nélkül a bolt nem működne:",
        "**Vercel** — az oldal futtatása és a könyvfájlok tárolása. A kiszolgáló Frankfurtban (EU) fut.",
        "**Neon** — az adatbázis, szintén Frankfurtban (EU).",
        "**Stripe** — a fizetés lebonyolítása. Ide a nevem, e-mail-címed és a számlázási címed jut el, valamint a vásárolt tételek.",
        "**Számlázz.hu** — a számla kiállítása és NAV-jelentése. Ide a számlázási adataid és a tételek jutnak el.",
        "**Google** — ha Google-fiókkal lépsz be; és ha a boltból érkező levelek Gmailen keresztül mennek ki.",
        "Marketingcélra adatot nem adunk tovább, és nem is adunk el senkinek.",
      ],
    },
    {
      heading: "Meddig őrizzük",
      body: [
        "**A fiókod adatait** addig, amíg a fiók létezik. Törlést bármikor kérhetsz.",
        "**A számlákat és a számlázási adatokat** a számviteli törvény szerint a kiállítástól számított **nyolc évig** meg kell őriznünk. Ezt akkor sem tudjuk korábban törölni, ha a fiókodat megszünteted — ilyenkor a számlához tartozó adatokat elkülönítve tartjuk, és csak erre a célra használjuk.",
        "**A letöltési naplót** egy évig.",
        "**A jelszó-helyreállító és e-mail-megerősítő linkeket** a lejáratukig (2, illetve 48 óra), utána a sor törölhető.",
      ],
    },
    {
      heading: "Milyen jogaid vannak",
      body: [
        "Kérheted, hogy **megmutassuk**, milyen adatot kezelünk rólad; hogy **javítsuk** a pontatlant; hogy **töröljük** (a fenti nyolcéves kötelezettség korlátai között); hogy **kiadjuk géppel olvasható formában**; és **tiltakozhatsz** a jogos érdeken alapuló kezelés ellen.",
        "A jelszavadat a fiókodnál bármikor magad is megváltoztathatod.",
        "Ha úgy érzed, rosszul kezeljük az adataidat, panasszal fordulhatsz a **Nemzeti Adatvédelmi és Információszabadság Hatósághoz** (NAIH, 1055 Budapest, Falk Miksa utca 9-11., ugyfelszolgalat@naih.hu), illetve bírósághoz.",
      ],
    },
    {
      heading: "Sütik",
      body: [
        "A bolt csak a működéséhez szükséges sütiket használja: a belépésed fenntartását, a kosaradat és a választott nyelvet. Nyomkövető és hirdetési süti nincs, és statisztikai célból sem figyelünk.",
      ],
    },
  ];

  const en: Section[] = [
    {
      heading: "Who handles your data",
      body: [
        `${env.storeName} is operated by ${seller}. The company's identifying details are in the table above. The site runs at ${host}.`,
        "This notice covers what the shop asks of you, why, how long it keeps it, and who else receives it.",
      ],
    },
    {
      heading: "What we hold",
      body: [
        "**Account**: name, email address, password (never the password itself, only an irreversible hash), your chosen language, and whether you have confirmed your address.",
        "**If you sign in with Google**: the name, email address and picture Google gives us. No password is created.",
        "**Purchases**: the items, amount and status of each order, plus billing details — name, country, postcode, town, address, and a tax number if you give one.",
        "**Downloads**: each download records the time, the IP address and the browser identifier. This exists so that wholesale redistribution of purchased files can be noticed.",
        "**Payment**: the shop never sees or stores card details. Payment happens entirely on Stripe's pages.",
      ],
    },
    {
      heading: "Why we hold it",
      body: [
        "**To perform the contract**: account, order, download entitlement. Without these we could not deliver the book you bought.",
        "**Legal obligation**: billing data is retained under Hungarian accounting law, and the invoice is reported to the NAV Online Invoice system through Számlázz.hu.",
        "**Legitimate interest**: the download log, for recognising abuse.",
      ],
    },
    {
      heading: "Who else receives it",
      body: [
        "Only the providers without which the shop could not run:",
        "**Vercel** — running the site and storing the book files. The servers run in Frankfurt (EU).",
        "**Neon** — the database, also in Frankfurt (EU).",
        "**Stripe** — taking payment. Your name, email address, billing address and the items purchased reach them.",
        "**Számlázz.hu** — issuing the invoice and reporting it to NAV. Your billing details and the items reach them.",
        "**Google** — if you sign in with a Google account, and if the shop's email goes out through Gmail.",
        "Nothing is passed on for marketing, and nothing is sold to anyone.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "**Account data** for as long as the account exists. You can ask for deletion at any time.",
        "**Invoices and billing data** must be kept for **eight years** from issue under Hungarian accounting law. We cannot delete these sooner even if you close your account; in that case the invoice data is kept separately and used only for that purpose.",
        "**The download log** for one year.",
        "**Password reset and email confirmation links** until they expire (2 and 48 hours), after which the row can be removed.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You may ask us to **show** what we hold about you; to **correct** anything inaccurate; to **delete** it (within the eight-year limit above); to **hand it over in machine-readable form**; and you may **object** to processing based on legitimate interest.",
        "You can change your password yourself at any time from your account page.",
        "If you believe we are handling your data badly, you may complain to the Hungarian data protection authority (**NAIH**, 1055 Budapest, Falk Miksa utca 9-11., ugyfelszolgalat@naih.hu) or go to court.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "The shop uses only the cookies it needs to work: keeping you signed in, holding your cart, and remembering your language. There are no tracking or advertising cookies, and no analytics.",
      ],
    },
  ];

  return (
    <LegalPage
      title={t.legal.privacyTitle}
      updatedLabel={t.legal.updated}
      warning={t.legal.draftWarning}
      sections={locale === "en" ? en : hu}
      companyLabels={t.legal.company}
    />
  );
}
