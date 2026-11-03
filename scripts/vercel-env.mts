/**
 * Sets environment variables on the Vercel project without the CLI.
 *
 * The CLI wants an interactive link step and a `.vercel` directory; this talks
 * to the REST API instead, which works from a plain terminal and never writes
 * the token to disk. Values are read from stdin as JSON so a secret never
 * appears in shell history or in a process listing.
 *
 *   VERCEL_TOKEN=... echo '{"KEY":"value"}' | npx tsx scripts/vercel-env.mts
 *
 * Existing variables are replaced. Anything whose name hints at a secret is
 * stored encrypted; the rest stay plain so they can be read back for checking.
 */
const token = process.env.VERCEL_TOKEN;
const projectQuery = process.env.VERCEL_PROJECT ?? "buddhista-konyvmuhely";
const targets = ["production", "preview", "development"];

if (!token) {
  console.error("Set VERCEL_TOKEN.");
  process.exit(1);
}

const SECRET = /KEY|SECRET|TOKEN|PASSWORD|URL$/i;

async function api(path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.vercel.com${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...init.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} → ${response.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

const vars = JSON.parse((await readStdin()).trim() || "{}") as Record<string, string>;
const names = Object.keys(vars);

if (names.length === 0) {
  console.error("Nothing on stdin. Pipe in a JSON object of name/value pairs.");
  process.exit(1);
}

const { projects } = await api(`/v9/projects?search=${encodeURIComponent(projectQuery)}&limit=20`);
const project = projects?.find((p: { name: string }) => p.name === projectQuery) ?? projects?.[0];

if (!project) {
  console.error(`No project matching "${projectQuery}".`);
  process.exit(1);
}
console.log(`Project: ${project.name} (${project.id})`);

// One listing, so each variable costs a single write rather than a lookup too.
const existing = await api(`/v9/projects/${project.id}/env?decrypt=false`);
const byKey = new Map<string, { id: string }[]>();
for (const row of existing.envs ?? []) {
  const list = byKey.get(row.key) ?? [];
  list.push(row);
  byKey.set(row.key, list);
}

for (const [key, value] of Object.entries(vars)) {
  for (const old of byKey.get(key) ?? []) {
    await api(`/v9/projects/${project.id}/env/${old.id}`, { method: "DELETE" });
  }

  await api(`/v10/projects/${project.id}/env`, {
    method: "POST",
    body: JSON.stringify({
      key,
      value,
      type: SECRET.test(key) ? "encrypted" : "plain",
      target: targets,
    }),
  });

  console.log(`  ${key} → ${targets.join(", ")} (${SECRET.test(key) ? "encrypted" : "plain"})`);
}

console.log(`\n${names.length} variable(s) set. Redeploy for them to take effect.`);
