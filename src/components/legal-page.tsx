import { WarningIcon } from "@/components/icons";
import { company } from "@/lib/env";

export type Section = {
  heading: string;
  body: string[];
};

/**
 * Shared frame for the privacy notice and the terms.
 *
 * Paragraphs may carry **bold** runs, because legal text leans on a few
 * emphasised terms and writing JSX for each would bury the content. The
 * parser is deliberately minimal: split on the delimiter, bold every odd
 * segment. Nothing here is user input, so there is no injection surface.
 */
function renderEmphasis(text: string, key: number) {
  const parts = text.split("**");
  return (
    <p key={key}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-paper">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </p>
  );
}

/**
 * The seller's identity, as Hungarian law requires a webshop to publish it.
 * A value that has not been configured is shown as an obvious gap rather
 * than skipped, so an incomplete page looks incomplete.
 */
function CompanyBlock({ labels }: { labels: Record<string, string> }) {
  const c = company();

  const rows: [string, string | null][] = [
    // Only when it says something the short name does not, which is the
    // usual case: "Kft." stands in for a dozen words of registered name.
    [labels.name, c.legalName ?? c.name],
    [labels.seat, c.seat],
    [labels.reg, c.registrationNumber],
    [labels.tax, c.taxNumber],
    [labels.rep, c.representative],
    [labels.email, c.email],
    [labels.phone, c.phone],
  ];

  return (
    <dl className="panel mt-8 grid gap-x-8 gap-y-3 px-5 py-5 text-sm sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-mute">{label}</dt>
          <dd className={value ? "text-paper" : "text-rose-400"}>
            {value ?? labels.missing}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function LegalPage({
  title,
  updatedLabel,
  warning,
  sections,
  companyLabels,
}: {
  title: string;
  updatedLabel: string;
  warning: string;
  sections: Section[];
  companyLabels?: Record<string, string>;
}) {
  // Rendered on the server at request time; the date tracks deployments
  // rather than being a hand-maintained constant that goes stale.
  const updated = new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="shell max-w-3xl py-14">
      <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold text-paper">
        {title}
      </h1>
      <p className="mt-2 text-sm text-mute">
        {updatedLabel}: {updated}
      </p>

      <div className="panel mt-8 flex items-start gap-3 border-gold-600/35 bg-gold-500/5 px-5 py-4">
        <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
        <p className="text-sm leading-relaxed text-paper-dim">{warning}</p>
      </div>

      {companyLabels ? <CompanyBlock labels={companyLabels} /> : null}

      <div className="mt-12 space-y-11">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold text-paper">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-paper-dim">
              {section.body.map(renderEmphasis)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
