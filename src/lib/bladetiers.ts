import combatAceAsset from "@/assets/achievement_titles/combat-ace.webp.asset.json";
import combatCadetAsset from "@/assets/achievement_titles/combat-cadet.svg.asset.json";
import combatGrandmasterAsset from "@/assets/achievement_titles/combat-grandmaster.webp.asset.json";
import combatNoviceAsset from "@/assets/achievement_titles/combat-novice.svg.asset.json";
import combatSpecialistAsset from "@/assets/achievement_titles/combat-specialist.svg.asset.json";
import rookieAsset from "@/assets/achievement_titles/rookie.svg.asset.json";

// Browser requests stay on the website's HTTPS origin. Server routes securely
// relay the Railway API and its skin files without changing their data shape.
export const PLAYERS_API_URL = "/api/public/players";
export const SKIN_PROXY_URL = "/api/public/skin";

export const TIER_POINTS: Record<string, number> = {
  HT1: 60,
  LT1: 50,
  HT2: 40,
  LT2: 30,
  HT3: 20,
  LT3: 15,
  HT4: 10,
  LT4: 8,
  HT5: 5,
  LT5: 3,
};

export type Player = {
  name: string;
  region?: string | null;
  skin?: string | null;
  skin_original?: string | null;
  discord_id?: string | null;
  tiers: Record<string, string>;
  points: number;
  title: string;
};

export type Gamemode = { id: string; name: string; icon: string };

export type CombatTitle = {
  name: string;
  icon: string | null;
  className: string;
};

const icon = (n: string) => `/assets/tier_icons/${n}.svg`;

export const DISPLAY_GAMEMODES: Gamemode[] = [
  { id: "overall", name: "Overall", icon: icon("overall") },
  { id: "ltm", name: "LTMs", icon: icon("2v2") },
  { id: "vanilla", name: "Vanilla", icon: icon("vanilla") },
  { id: "uhc", name: "UHC", icon: icon("uhc") },
  { id: "pot", name: "Pot", icon: icon("pot") },
  { id: "nethop", name: "NethOP", icon: icon("nethop") },
  { id: "smp", name: "SMP", icon: icon("smp") },
  { id: "sword", name: "Sword", icon: icon("sword") },
  { id: "axe", name: "Axe", icon: icon("axe") },
  { id: "mace", name: "Mace", icon: icon("mace") },
];

export const MATRIX_GAMEMODES: Gamemode[] = [
  { id: "mace", name: "Mace", icon: icon("mace") },
  { id: "sword", name: "Sword", icon: icon("sword") },
  { id: "nethop", name: "NethOP", icon: icon("nethop") },
  { id: "nethpot", name: "NethPot", icon: icon("pot") },
  { id: "axe", name: "Axe", icon: icon("axe") },
  { id: "uhc", name: "UHC", icon: icon("uhc") },
  { id: "smp", name: "SMP", icon: icon("smp") },
  { id: "vanilla", name: "Vanilla", icon: icon("vanilla") },
];

export const DISCORD_INVITE = "https://discord.gg/QxDVbSYQkT";
export const SERVER_IP = "chocomc.net";

export function calculatePlayerPoints(tiers: Record<string, string> = {}): number {
  let total = 0;
  for (const code of Object.values(tiers)) {
    if (typeof code === "string") total += TIER_POINTS[code.toUpperCase().trim()] ?? 0;
  }
  return total;
}

export function getCombatTitle(points: number): CombatTitle {
  if (points >= 400) return { name: "Combat Grandmaster", icon: combatGrandmasterAsset.url, className: "grandmaster" };
  if (points >= 250) return { name: "Combat Master", icon: null, className: "master" };
  if (points >= 100) return { name: "Combat Ace", icon: combatAceAsset.url, className: "ace" };
  if (points >= 50) return { name: "Combat Specialist", icon: combatSpecialistAsset.url, className: "specialist" };
  if (points >= 20) return { name: "Combat Cadet", icon: combatCadetAsset.url, className: "cadet" };
  if (points >= 10) return { name: "Combat Novice", icon: combatNoviceAsset.url, className: "novice" };
  return { name: "Rookie", icon: rookieAsset.url, className: "rookie" };
}

export function getTierLevel(tierCode?: string | null): number {
  if (!tierCode) return 99;
  const match = tierCode.match(/([HL]T)?(\d)/i);
  if (!match) return 99;
  const pos = (match[1] ?? "").toUpperCase() === "HT" ? 0 : 1;
  return parseInt(match[2]!, 10) * 10 + pos;
}

export const REGION_NAMES: Record<string, string> = {
  NA: "North America",
  SA: "South America",
  EU: "Europe",
  AS: "Asia",
  AU: "Australia",
  ME: "Middle East",
};

export function skinUrl(path?: string | null): string | null {
  if (!path) return null;
  let upstreamPath = path;
  try {
    const url = new URL(path);
    upstreamPath = `${url.pathname}${url.search}`;
  } catch {
    upstreamPath = path.startsWith("/") ? path : `/${path}`;
  }
  return `${SKIN_PROXY_URL}?path=${encodeURIComponent(upstreamPath)}`;
}

export async function getPlayers(): Promise<Player[]> {
  const res = await fetch(PLAYERS_API_URL, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API returned status ${res.status}`);
  const raw = (await res.json()) as unknown;
  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((p) => {
      const player = p as Record<string, unknown>;
      const tiers = (player["tiers"] as Record<string, string>) ?? {};
      const points = calculatePlayerPoints(tiers);
      return {
        ...(player as object),
        name: String(player["name"] ?? ""),
        region: (player["region"] as string) ?? null,
        skin: (player["skin"] as string) ?? null,
        skin_original: (player["skin_original"] as string) ?? null,
        discord_id: (player["discord_id"] as string) ?? null,
        tiers,
        points,
        title: getCombatTitle(points).name,
      } as Player;
    })
    .filter((p) => p.name)
    .sort((a, b) => b.points - a.points);
}
