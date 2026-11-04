"""
Builds the bilingual authorisation Patrik signs so Zoltan can act for the
company before Stripe.

Hungarian first, English after, in one file: Stripe's reviewers read English,
but the document has to stand up in Hungary, where the Hungarian text is the
one that governs. Blank lines are left where only the signatory can fill
them in - identity card numbers are not something to guess at.

    python scripts/make-meghatalmazas.py
"""

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, Cm, RGBColor

COMPANY = "Carbon-Code Kurzor Oktatási és Szolgáltató Korlátolt Felelősségű Társaság"
COMPANY_SHORT = "Carbon-Code Kurzor Kft."
SEAT = "4032 Debrecen, Mikszáth Kálmán utca 20. 1. em. 6. ajtó"
REG = "09-09-036714"
TAX = "32743485-1-09"
DIRECTOR = "Kalmár Patrik"
AGENT = "Molnár Zoltán"
AGENT_BORN = "1978. november 18."
AGENT_ADDRESS = "4032 Debrecen, Mikszáth Kálmán utca 20. 1. em. 6. ajtó"
SITE = "buddhista-konyvmuhely.vercel.app"

doc = Document()

style = doc.styles["Normal"]
style.font.name = "Calibri"
style.font.size = Pt(11)
style.paragraph_format.space_after = Pt(6)
style.paragraph_format.line_spacing = 1.15

for section in doc.sections:
    section.top_margin = Cm(2.2)
    section.bottom_margin = Cm(2.2)
    section.left_margin = Cm(2.4)
    section.right_margin = Cm(2.4)


def heading(text, size=16, space_before=0):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(14)
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(size)
    return p


def sub(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(11)
    return p


def para(text, justify=True):
    p = doc.add_paragraph(text)
    if justify:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    return p


def bullet(text):
    p = doc.add_paragraph(text, style="List Bullet")
    p.paragraph_format.space_after = Pt(3)
    return p


def field(label, value=""):
    """A labelled line; an empty value leaves a rule to write on."""
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    p.add_run(f"{label}: ").bold = True
    p.add_run(value if value else "………………………………………………………")
    return p


def signature_block(labels):
    """Side-by-side signature lines."""
    table = doc.add_table(rows=2, cols=len(labels))
    table.autofit = True
    for i, label in enumerate(labels):
        line = table.cell(0, i).paragraphs[0]
        line.alignment = WD_ALIGN_PARAGRAPH.CENTER
        line.paragraph_format.space_before = Pt(28)
        line.add_run("……………………………………………")
        caption = table.cell(1, i).paragraphs[0]
        caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = caption.add_run(label)
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor(0x44, 0x44, 0x44)
    return table


# ─────────────────────────── Hungarian ───────────────────────────

heading("MEGHATALMAZÁS")

sub("I. A meghatalmazó")
para(
    f"Cégnév: {COMPANY} (rövidített név: {COMPANY_SHORT})\n"
    f"Székhely: {SEAT}\n"
    f"Cégjegyzékszám: {REG}\n"
    f"Adószám: {TAX}\n"
    f"Képviseli: {DIRECTOR} ügyvezető, önálló képviseleti joggal",
    justify=False,
)
para("a továbbiakban: Meghatalmazó", justify=False)

sub("II. A meghatalmazott")
field("Név", AGENT)
field("Születési idő", AGENT_BORN)
field("Lakcím", AGENT_ADDRESS)
field("Személyazonosító okmány száma")
para("a továbbiakban: Meghatalmazott", justify=False)

sub("III. A meghatalmazás tárgya")
para(
    "A Meghatalmazó meghatalmazza a Meghatalmazottat, hogy a Meghatalmazó "
    "nevében és képviseletében eljárjon a Stripe Payments Europe, Limited "
    "(székhely: The One Building, 1 Grand Canal Street Lower, Dublin 2, "
    "Írország) és kapcsolt vállalkozásai előtt, a Meghatalmazó által "
    f"üzemeltetett {SITE} webáruház fizetési szolgáltatásával összefüggésben."
)

sub("IV. A meghatalmazás terjedelme")
para("A Meghatalmazott az alábbiakra jogosult:")
bullet("a Stripe fiók megnyitása, kezelése és adminisztrálása;")
bullet(
    "a Meghatalmazó cégadatainak megadása és módosítása a Stripe átvilágítási "
    "(KYC) eljárásában;"
)
bullet(
    "a Stripe szolgáltatási feltételeinek elfogadása a Meghatalmazó nevében;"
)
bullet("technikai hozzáférési kulcsok (API kulcsok) létrehozása és visszavonása;")
bullet("a tranzakciók, kifizetések és visszatérítések kezelése;")
bullet(
    "a fentiekhez szükséges nyilatkozatok megtétele és dokumentumok benyújtása."
)

sub("V. Korlátozások")
para(
    "A Meghatalmazott nem jogosult a kifizetési (payout) bankszámlaszám "
    "megváltoztatására, a fiók megszüntetésére, továbbá a Meghatalmazó "
    "nevében pénzügyi kötelezettségvállalásra a fenti tárgykörön kívül. "
    "A Meghatalmazott a meghatalmazást másra nem ruházhatja át."
)

sub("VI. Időbeli hatály")
para(
    "A jelen meghatalmazás a kiállítás napjától határozatlan ideig, "
    "visszavonásig érvényes. A Meghatalmazó a meghatalmazást bármikor, "
    "indokolás nélkül, írásban visszavonhatja."
)

sub("VII. Záró rendelkezések")
para(
    "A jelen meghatalmazás magyar és angol nyelven készült. Eltérés esetén "
    "a magyar nyelvű szöveg az irányadó. A jelen okiratra a magyar jog az "
    "irányadó."
)

doc.add_paragraph()
field("Kelt")

signature_block([
    f"Meghatalmazó\n{DIRECTOR} ügyvezető\n{COMPANY_SHORT}",
    f"Meghatalmazott\n{AGENT}",
])

doc.add_paragraph()
sub("Előttünk, mint tanúk előtt:")
para(
    "(Teljes bizonyító erejű magánokirathoz két tanú aláírása szükséges.)",
    justify=False,
)

for number in (1, 2):
    doc.add_paragraph()
    p = doc.add_paragraph()
    p.add_run(f"{number}. tanú").bold = True
    field("Név")
    field("Lakcím")
    field("Aláírás")

doc.add_page_break()

# ─────────────────────────── English ───────────────────────────

heading("POWER OF ATTORNEY")

sub("I. The principal")
para(
    f"Company name: {COMPANY}\n"
    f"(short name: {COMPANY_SHORT})\n"
    f"Registered seat: {SEAT}, Hungary\n"
    f"Company registration number: {REG}\n"
    f"Tax number: {TAX}\n"
    f"Represented by: {DIRECTOR}, managing director, with sole signing authority",
    justify=False,
)
para("hereinafter: the Principal", justify=False)

sub("II. The attorney")
field("Name", AGENT)
field("Date of birth", "18 November 1978")
field("Address", f"{AGENT_ADDRESS}, Hungary")
field("Identity document number")
para("hereinafter: the Attorney", justify=False)

sub("III. Subject of the authorisation")
para(
    "The Principal hereby authorises the Attorney to act in the name and on "
    "behalf of the Principal before Stripe Payments Europe, Limited "
    "(registered office: The One Building, 1 Grand Canal Street Lower, "
    "Dublin 2, Ireland) and its affiliates, in connection with the payment "
    f"services of the online shop {SITE} operated by the Principal."
)

sub("IV. Scope of the authorisation")
para("The Attorney is entitled to:")
bullet("open, operate and administer the Stripe account;")
bullet(
    "provide and amend the Principal's company details in Stripe's "
    "know-your-customer (KYC) procedure;"
)
bullet("accept Stripe's terms of service on behalf of the Principal;")
bullet("create and revoke technical access credentials (API keys);")
bullet("manage transactions, payouts and refunds;")
bullet(
    "make the declarations and submit the documents required for the above."
)

sub("V. Limitations")
para(
    "The Attorney is not entitled to change the payout bank account, to close "
    "the account, or to undertake financial obligations on behalf of the "
    "Principal beyond the subject matter set out above. The Attorney may not "
    "delegate this authorisation to any other person."
)

sub("VI. Term")
para(
    "This power of attorney is valid from the date of issue for an indefinite "
    "period, until revoked. The Principal may revoke it at any time, in "
    "writing, without giving reasons."
)

sub("VII. Closing provisions")
para(
    "This power of attorney has been drawn up in Hungarian and English. In "
    "the event of any discrepancy, the Hungarian text shall prevail. This "
    "document is governed by Hungarian law."
)

doc.add_paragraph()
field("Place and date")

signature_block([
    f"Principal\n{DIRECTOR}, managing director\n{COMPANY_SHORT}",
    f"Attorney\n{AGENT}",
])

doc.add_paragraph()
sub("Before us, as witnesses:")
para(
    "(Under Hungarian law a private document of full probative force requires "
    "two witnesses.)",
    justify=False,
)

for number in (1, 2):
    doc.add_paragraph()
    p = doc.add_paragraph()
    p.add_run(f"Witness {number}").bold = True
    field("Name")
    field("Address")
    field("Signature")

OUT = "c:\\Users\\mzolt\\Desktop\\ClaudProjects\\Meghatalmazas_Stripe_HU_EN.docx"
doc.save(OUT)
print(f"written: {OUT}")
