import type { Metadata } from "next";

import { LegalPage, type Section } from "@/components/legal-page";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { company, env, siteUrl } from "@/lib/env";
import { resolvePage } from "@/lib/page-locale";
import { storeVatMode } from "@/lib/vat";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).legal.termsTitle };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const host = siteUrl().replace(/^https?:\/\//, "");
  const seller = company().name;
  const exempt = storeVatMode() === "exempt";

  const hu: Section[] = [
    {
      heading: "A szolgáltató",
      body: [
        `A ${env.storeName} webáruház üzemeltetője és a könyvek kiadója a ${seller}. Az oldal címe: ${host}.`,
        exempt
          ? "A szolgáltató **alanyi adómentes**, így a számlán áfa nem szerepel."
          : "A feltüntetett árak az áfát tartalmazzák.",
      ],
    },
    {
      heading: "Mit veszel",
      body: [
        "Digitális könyveket: PDF, illetve ahol elérhető, EPUB fájlokat. A termék nem fizikai könyv, postázás nincs.",
        "A fájlok **DRM-mentesek**: bármelyik olvasóval megnyithatók, és nem járnak le.",
        "A megvásárolt kötetek a fiókod **Könyvtáram** oldalára kerülnek, és onnan **korlátlanul újraletölthetők**, amíg a bolt üzemel.",
        "A vásárlás egy példányra szóló, személyes felhasználási jogot ad. A fájlt továbbadni, megosztani, nyilvánosan elérhetővé tenni vagy továbbértékesíteni nem lehet.",
      ],
    },
    {
      heading: "A vásárlás menete",
      body: [
        "Kosárba teszed a köteteket, belépsz vagy regisztrálsz, majd a **Stripe** fizetési oldalán fizetsz bankkártyával. Kártyaadatot a bolt nem lát.",
        "Sikeres fizetés után a kötetek azonnal letölthetők, és e-mailben is megkapod a letöltési linkeket.",
        "A szerződés a sikeres fizetéssel jön létre, magyar nyelven. A megrendelést a rendszer rögzíti, a fiókodban utólag is megnézheted.",
      ],
    },
    {
      heading: "Számla",
      body: [
        "Minden vásárlásról **elektronikus számlát** állítunk ki a Számlázz.hu rendszerén keresztül, amely azt a NAV Online Számla rendszerébe is bejelenti.",
        "A számlát a visszaigazoló levélhez csatoljuk, és a megrendelésednél bármikor letöltheted.",
        "Ezért kéri a fizetési oldal a számlázási nevet és címet. Ha cégként vásárolsz, ott adhatod meg az adószámot is.",
      ],
    },
    {
      heading: "Elállási jog — ezt olvasd el",
      body: [
        "A fogyasztót digitális tartalom vásárlásakor főszabály szerint **tizennégy nap** elállási jog illeti meg.",
        "Ez a jog azonban **megszűnik**, ha a teljesítés a te kifejezett, előzetes beleegyezéseddel már megkezdődött, és tudomásul vetted, hogy ezzel elveszíted az elállási jogodat. A digitális könyv esetében a teljesítés a letöltés elindításával kezdődik meg.",
        "Magyarul: amíg nem töltötted le a könyvet, elállhatsz és visszakapod a pénzed. **A letöltés megkezdése után nem.** Ez nem a bolt szigora, hanem a 45/2014. (II. 26.) Korm. rendelet szabálya, és minden digitális tartalmat árusító boltra ugyanígy vonatkozik.",
        "Ha a fájl hibás, hiányos vagy nem nyitható meg, az nem elállás, hanem szavatossági kérdés — írj, és megoldjuk.",
      ],
    },
    {
      heading: "Ha baj van",
      body: [
        "Ha a letöltés nem indul el, a fájl sérült, vagy rossz kötetet kaptál, írj a lap alján megadott címre. Igyekszünk néhány napon belül válaszolni.",
        "Visszatérítés esetén a hozzáférés megszűnik: a visszatérített kötet kikerül a könyvtáradból.",
        "Fogyasztóként panasszal fordulhatsz a lakóhelyed szerinti **békéltető testülethez**, illetve a fogyasztóvédelmi hatósághoz.",
      ],
    },
    {
      heading: "Amit nem ígérünk",
      body: [
        "A kötetek tartalma ismeretterjesztő és gyakorlati célú. **Nem helyettesít orvosi, pszichológiai vagy más szakmai ellátást.** Ahol a szöveg gyakorlatokat ír le, azokat a saját felelősségedre végzed; betegség vagy kezelés esetén kérd ki orvosod véleményét.",
        "A bolt elérhetőségére nem vállalunk megszakításmentességet, de a megvásárolt köteteidet igyekszünk tartósan elérhetővé tenni.",
      ],
    },
  ];

  const en: Section[] = [
    {
      heading: "The seller",
      body: [
        `${env.storeName} is operated, and the books are published, by ${seller}. The site runs at ${host}.`,
        exempt
          ? "The seller is **exempt from VAT** under the Hungarian small-business exemption, so no VAT appears on the invoice."
          : "Prices shown include VAT.",
      ],
    },
    {
      heading: "What you are buying",
      body: [
        "Digital books: PDF, and EPUB where available. These are not physical books and nothing is posted.",
        "The files are **DRM-free**: they open in any reader and do not expire.",
        "Purchases appear on the **My library** page of your account and can be **re-downloaded without limit** for as long as the shop operates.",
        "A purchase grants a personal licence for one copy. The file may not be passed on, shared, made publicly available or resold.",
      ],
    },
    {
      heading: "How a purchase works",
      body: [
        "You add titles to the cart, sign in or register, and pay by card on **Stripe's** pages. The shop never sees card details.",
        "After successful payment the titles are immediately downloadable, and the download links are also emailed to you.",
        "The contract comes into being on successful payment. Orders are recorded and remain visible in your account.",
      ],
    },
    {
      heading: "Invoicing",
      body: [
        "Every purchase is invoiced electronically through Számlázz.hu, which also reports the invoice to the Hungarian tax authority's NAV Online Invoice system.",
        "The invoice is attached to your confirmation email and can be downloaded from your order at any time.",
        "This is why the payment page asks for a billing name and address. Businesses can also enter a tax number there.",
      ],
    },
    {
      heading: "Right of withdrawal — please read",
      body: [
        "A consumer buying digital content normally has **fourteen days** to withdraw.",
        "That right **lapses** once performance has begun with your express prior consent and your acknowledgement that you thereby lose it. For a digital book, performance begins when you start the download.",
        "In plain terms: until you have downloaded the book you may withdraw and be refunded. **After you start the download, you may not.** This is not the shop being strict; it follows from Hungarian government decree 45/2014 (II. 26.) and applies to every seller of digital content.",
        "If a file is corrupt, incomplete or will not open, that is not withdrawal but a warranty matter — write to us and we will sort it out.",
      ],
    },
    {
      heading: "If something goes wrong",
      body: [
        "If a download will not start, a file is damaged, or you received the wrong title, write to the address in the footer. We aim to reply within a few days.",
        "Where a refund is given, access ends: the refunded title is removed from your library.",
        "As a consumer you may also complain to the conciliation board for your area, or to the consumer protection authority.",
      ],
    },
    {
      heading: "What we do not promise",
      body: [
        "The books are educational and practical in purpose. **They do not replace medical, psychological or other professional care.** Where the text describes practices, you undertake them at your own risk; if you are ill or under treatment, consult your doctor.",
        "We do not guarantee uninterrupted availability of the shop, though we aim to keep your purchased titles reachable for the long term.",
      ],
    },
  ];

  return (
    <LegalPage
      title={t.legal.termsTitle}
      updatedLabel={t.legal.updated}
      warning={t.legal.draftWarning}
      sections={locale === "en" ? en : hu}
      companyLabels={t.legal.company}
    />
  );
}
