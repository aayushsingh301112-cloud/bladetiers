/**
 * Player data shape consumed by the website.
 *
 * The real source of truth is the Discord bot's backend (see `bot/` for the
 * reference implementation). The website never hardcodes players — it only
 * normalizes whatever the API returns.
 */
export type Player = {
  /** Minecraft username */
  name: string;
  /** e.g. "NA" | "EU" | "AS" | "AU" | "SA" */
  region: string | null;
  /** absolute or root-relative URL of the website-ready (transparent) skin render */
  skin: string | null;
  /** overall points, optional */
  points: number | null;
  /** combat title, e.g. "Combat Grandmaster" — optional */
  title: string | null;
  /**
   * Per-kit tiers, e.g. { vanilla: "HT1", uhc: "LT2" }.
   * A missing / null / empty value means "not tested yet" and is never rendered.
   */
  tiers: Record<string, string>;
};

type RawPlayer = Record<string, unknown>;

const str = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
};

function normalizeTiers(raw: RawPlayer): Record<string, string> {
  const out: Record<string, string> = {};

  // Shape A: { tiers: { vanilla: "HT1", ... } }
  const tiers = raw["tiers"];
  if (tiers && typeof tiers === "object" && !Array.isArray(tiers)) {
    for (const [k, v] of Object.entries(tiers as Record<string, unknown>)) {
      const value = str(v);
      if (value) out[k.toLowerCase()] = value.toUpperCase();
    }
  }

  // Shape B: single { tier: "HT1", kit: "vanilla" }
  const single = str(raw["tier"]);
  if (single) {
    const kit = str(raw["kit"])?.toLowerCase() ?? "overall";
    out[kit] = single.toUpperCase();
  }

  return out;
}

export function normalizePlayer(raw: RawPlayer): Player | null {
  const name = str(raw["name"]) ?? str(raw["username"]) ?? str(raw["ign"]);
  if (!name) return null;

  const pointsRaw = raw["points"];
  const points =
    typeof pointsRaw === "number" && Number.isFinite(pointsRaw)
      ? pointsRaw
      : typeof pointsRaw === "string" && pointsRaw.trim() !== "" && !Number.isNaN(Number(pointsRaw))
        ? Number(pointsRaw)
        : null;

  return {
    name,
    region: str(raw["region"])?.toUpperCase() ?? null,
    skin: str(raw["skin"]) ?? str(raw["skin_url"]) ?? str(raw["skinUrl"]),
    points,
    title: str(raw["title"]),
    tiers: normalizeTiers(raw),
  };
}

export function normalizePlayers(input: unknown): Player[] {
  const list = Array.isArray(input)
    ? input
    : input && typeof input === "object" && Array.isArray((input as { players?: unknown }).players)
      ? ((input as { players: unknown[] }).players as unknown[])
      : [];

  return list
    .filter((item): item is RawPlayer => !!item && typeof item === "object")
    .map(normalizePlayer)
    .filter((p): p is Player => p !== null);
}

/** Sorts by points desc, then alphabetically. Untested players fall to the bottom. */
export function sortPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    const ap = a.points ?? -1;
    const bp = b.points ?? -1;
    if (ap !== bp) return bp - ap;
    return a.name.localeCompare(b.name);
  });
}
