/**
 * Typographic cover generator.
 *
 * Builds a 2:3 cover from nothing but type and vector ornament, in the
 * storefront's own palette, so a catalogue of books that have no artwork
 * still reads as one deliberate series rather than a row of placeholders.
 *
 * Everything is drawn: no photography to license, no image model, no fonts
 * beyond what Windows ships. Each volume gets its own accent hue, which is
 * the only thing that varies - that is what makes them look related instead
 * of identical.
 *
 * Usage from another script:
 *   const png = await renderCover({ title, subtitle, author, accent, mark });
 */
import { Resvg } from "@resvg/resvg-js";

export const COVER_WIDTH = 1000;
export const COVER_HEIGHT = 1500;

/** Accent hues, picked to stay legible on the dark ground. */
export const ACCENTS = {
  gold: { line: "#cfa14f", glow: "#e0bd72", wash: "#2a2114" },
  copper: { line: "#c98a5a", glow: "#e0a97d", wash: "#2a1d14" },
  jade: { line: "#6fae8f", glow: "#93c9ad", wash: "#14241c" },
  lapis: { line: "#7b92cc", glow: "#9fb2e0", wash: "#161c2e" },
  amethyst: { line: "#9b83c4", glow: "#b9a4da", wash: "#1f182e" },
  saffron: { line: "#d49a3f", glow: "#eab868", wash: "#2b2010" },
} as const;

export type AccentName = keyof typeof ACCENTS;

/** Vector ornaments. Drawn rather than typed, so no font can fail to carry them. */
export type MarkName = "wheel" | "lotus" | "knot" | "flame" | "triple" | "sun";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Measured from rendered output rather than guessed: Georgia Bold set in caps
 * with the letter-spacing used below advances about 0.78em per character.
 * The first version of this file assumed 0.52 and the titles ran straight
 * through the frame.
 */
const CAPS_ADVANCE = 0.78;

/** Horizontal room inside the inner frame, with breathing space. */
const SAFE_WIDTH = COVER_WIDTH - 220;

/**
 * Picks the largest size at which the title fits the safe width in at most
 * four lines - including its longest single word, since Hungarian compounds
 * must not be broken mid-word.
 */
function fitTitle(upper: string): { size: number; lines: string[] } {
  for (let size = 92; size >= 40; size -= 2) {
    const maxChars = Math.floor(SAFE_WIDTH / (size * CAPS_ADVANCE));
    const longestWord = Math.max(...upper.split(/\s+/).map((w) => w.length));
    if (longestWord > maxChars) continue;

    const lines = wrapText(upper, maxChars);
    if (lines.length <= 4) return { size, lines };
  }

  const size = 40;
  return {
    size,
    lines: wrapText(upper, Math.floor(SAFE_WIDTH / (size * CAPS_ADVANCE))),
  };
}

/**
 * SVG has no automatic line breaking, so the title is wrapped here. Long
 * single words are left alone rather than broken mid-syllable, which
 * Hungarian compounds would make ugly.
 */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars || line === "") {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function ornament(mark: MarkName, cx: number, cy: number, accent: { line: string; glow: string }): string {
  const s = (d: string, extra = "") =>
    `<path d="${d}" fill="none" stroke="${accent.glow}" stroke-width="2.4" stroke-linecap="round" ${extra}/>`;

  switch (mark) {
    case "wheel": {
      // Eight-spoked wheel: the dharmacakra, reduced to its geometry.
      const spokes = Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return `<line x1="${cx + Math.cos(a) * 14}" y1="${cy + Math.sin(a) * 14}" x2="${cx + Math.cos(a) * 36}" y2="${cy + Math.sin(a) * 36}" stroke="${accent.glow}" stroke-width="2.2" stroke-linecap="round"/>`;
      }).join("");
      return `<circle cx="${cx}" cy="${cy}" r="42" fill="none" stroke="${accent.line}" stroke-width="2.6"/>
              <circle cx="${cx}" cy="${cy}" r="13" fill="none" stroke="${accent.glow}" stroke-width="2.2"/>${spokes}`;
    }
    case "lotus": {
      const petals = Array.from({ length: 7 }, (_, i) => {
        const a = -Math.PI / 2 + (i - 3) * 0.38;
        const tipX = cx + Math.cos(a) * 46;
        const tipY = cy + Math.sin(a) * 46 + 14;
        return s(
          `M ${cx} ${cy + 18} Q ${cx + Math.cos(a) * 20} ${cy + Math.sin(a) * 34 + 10} ${tipX} ${tipY}`,
        );
      }).join("");
      return `${petals}<path d="M ${cx - 52} ${cy + 20} Q ${cx} ${cy + 40} ${cx + 52} ${cy + 20}" fill="none" stroke="${accent.line}" stroke-width="2.6" stroke-linecap="round"/>`;
    }
    case "knot": {
      // Endless knot, suggested with two interlocking rounded squares.
      return `<rect x="${cx - 30}" y="${cy - 30}" width="60" height="60" rx="14" fill="none" stroke="${accent.line}" stroke-width="2.6" transform="rotate(45 ${cx} ${cy})"/>
              <rect x="${cx - 22}" y="${cy - 22}" width="44" height="44" rx="10" fill="none" stroke="${accent.glow}" stroke-width="2.2"/>`;
    }
    case "flame": {
      return `${s(`M ${cx} ${cy - 44} C ${cx + 30} ${cy - 10} ${cx + 22} ${cy + 26} ${cx} ${cy + 38} C ${cx - 22} ${cy + 26} ${cx - 30} ${cy - 10} ${cx} ${cy - 44} Z`)}
              ${s(`M ${cx} ${cy - 14} C ${cx + 14} ${cy + 4} ${cx + 10} ${cy + 22} ${cx} ${cy + 30} C ${cx - 10} ${cy + 22} ${cx - 14} ${cy + 4} ${cx} ${cy - 14} Z`)}`;
    }
    case "triple": {
      // Three jewels.
      return [0, 1, 2]
        .map((i) => {
          const x = cx + (i - 1) * 40;
          const y = cy + (i === 1 ? -14 : 8);
          return `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${i === 1 ? accent.line : accent.glow}" stroke-width="2.4"/>`;
        })
        .join("");
    }
    case "sun":
    default: {
      const rays = Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return `<line x1="${cx + Math.cos(a) * 26}" y1="${cy + Math.sin(a) * 26}" x2="${cx + Math.cos(a) * 44}" y2="${cy + Math.sin(a) * 44}" stroke="${accent.glow}" stroke-width="2.2" stroke-linecap="round"/>`;
      }).join("");
      return `<circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="${accent.line}" stroke-width="2.6"/>${rays}`;
    }
  }
}

export type CoverSpec = {
  title: string;
  subtitle?: string | null;
  author: string;
  /** Small line above the ornament, e.g. the series name. */
  eyebrow?: string | null;
  accent: AccentName;
  mark: MarkName;
};

export function buildCoverSvg(spec: CoverSpec): string {
  const W = COVER_WIDTH;
  const H = COVER_HEIGHT;
  const accent = ACCENTS[spec.accent];

  const { size: titleSize, lines: titleLines } = fitTitle(spec.title.toUpperCase());
  const titleLeading = titleSize * 1.14;

  const subtitlePreview = spec.subtitle ? wrapText(spec.subtitle, 42).slice(0, 3) : [];

  // The whole block - ornament, title, subtitle, rule - is centred as one
  // unit at 46% of the height. Fixing the title's top instead left a long
  // dead strip above the author line on shorter titles.
  const blockHeight =
    120 + titleLines.length * titleLeading + (subtitlePreview.length ? 40 + subtitlePreview.length * 44 : 0) + 46;
  const blockTop = H * 0.46 - blockHeight / 2;

  const ornamentY = blockTop + 50;
  const titleTop = blockTop + 150 + titleSize * 0.35;

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<text x="${W / 2}" y="${titleTop + i * titleLeading}" text-anchor="middle" font-family="Georgia" font-weight="bold" font-size="${titleSize}" fill="#f6f1e8" letter-spacing="1.5">${escapeXml(line)}</text>`,
    )
    .join("\n    ");

  const subtitleLines = subtitlePreview;
  const subtitleTop = titleTop + (titleLines.length - 1) * titleLeading + 86;

  const subtitleTspans = subtitleLines
    .map(
      (line, i) =>
        `<text x="${W / 2}" y="${subtitleTop + i * 44}" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="34" fill="${accent.glow}">${escapeXml(line)}</text>`,
    )
    .join("\n    ");

  const ruleY = subtitleTop + subtitleLines.length * 44 + 46;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d0c14"/>
      <stop offset="55%" stop-color="#08070c"/>
      <stop offset="100%" stop-color="#0b0a11"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="26%" r="62%">
      <stop offset="0%" stop-color="${accent.wash}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${accent.wash}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent.line}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${accent.line}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${accent.line}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ground)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>

  <!-- Inset frame: two hairlines, the outer one dimmer, which reads as depth. -->
  <rect x="46" y="46" width="${W - 92}" height="${H - 92}" fill="none" stroke="${accent.line}" stroke-opacity="0.28" stroke-width="2"/>
  <rect x="62" y="62" width="${W - 124}" height="${H - 124}" fill="none" stroke="${accent.line}" stroke-opacity="0.55" stroke-width="1"/>

  ${spec.eyebrow ? `<text x="${W / 2}" y="${blockTop - 40}" text-anchor="middle" font-family="Georgia" font-size="24" fill="${accent.line}" letter-spacing="7">${escapeXml(spec.eyebrow.toUpperCase())}</text>` : ""}

  <g>${ornament(spec.mark, W / 2, ornamentY, accent)}</g>

  ${titleTspans}
  ${subtitleTspans}

  <rect x="${W / 2 - 150}" y="${ruleY}" width="300" height="2" fill="url(#rule)"/>

  <text x="${W / 2}" y="${H - 170}" text-anchor="middle" font-family="Georgia" font-size="30" fill="#cac4b9" letter-spacing="5">${escapeXml(spec.author.toUpperCase())}</text>

  <rect x="${W / 2 - 60}" y="${H - 128}" width="120" height="1" fill="${accent.line}" fill-opacity="0.5"/>
</svg>`;
}

export function renderCover(spec: CoverSpec): Buffer {
  const resvg = new Resvg(buildCoverSvg(spec), {
    font: { fontDirs: ["C:\\Windows\\Fonts"], defaultFontFamily: "Georgia" },
    fitTo: { mode: "width", value: COVER_WIDTH },
  });
  return Buffer.from(resvg.render().asPng());
}
