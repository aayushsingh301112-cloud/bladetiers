import { Award } from "lucide-react";

import { MinecraftPlayer } from "@/components/MinecraftPlayer";
import { RANKED_KITS, KitIcon } from "@/lib/kits";
import type { Player } from "@/lib/players";

function tierColor(tier: string) {
  if (tier.startsWith("HT")) return "text-kit-gold";
  return "text-kit-silver";
}

/** Clean colored region badge — red for NA, green for EU, muted otherwise. */
function regionBadgeClass(region: string) {
  switch (region.toUpperCase()) {
    case "NA":
    case "SA":
      return "bg-red-500/15 text-red-400";
    case "EU":
      return "bg-green-500/15 text-green-400";
    case "AS":
      return "bg-amber-500/15 text-amber-400";
    case "AU":
    case "OC":
      return "bg-sky-500/15 text-sky-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function PlayerRow({ player, rank }: { player: Player; rank: number }) {
  const kitTiers = RANKED_KITS.filter((kit) => !!player.tiers[kit.key]);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/70 px-3 py-3 transition-colors hover:bg-card">
      {/* rank + model */}
      <div className="relative flex h-20 w-40 shrink-0 items-center justify-center overflow-hidden">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 pl-3 text-2xl font-black italic text-kit-gold">
          {rank}.
        </span>
        {player.skin ? (
          <MinecraftPlayer
            skinUrl={player.skin}
            name={player.name}
            className="h-20 w-auto object-contain"
          />
        ) : null}
      </div>

      {/* identity */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-semibold tracking-wide text-kit-silver">
          {player.name}
        </p>
        {player.title || player.points !== null ? (
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground/80">
            <Award className="h-4 w-4 text-kit-gold" fill="currentColor" strokeWidth={1.5} />
            {player.title ? <span>{player.title}</span> : null}
            {player.points !== null ? (
              <span className="font-medium text-muted-foreground">({player.points} points)</span>
            ) : null}
          </p>
        ) : null}
      </div>

      {/* region */}
      <div className="w-16 shrink-0 text-center">
        {player.region ? (
          <span
            className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-sm font-bold ${regionBadgeClass(player.region)}`}
          >
            {player.region}
          </span>
        ) : null}
      </div>

      {/* tiers — completely hidden until a real tier is assigned */}
      <div className="flex min-w-[8rem] shrink-0 justify-end gap-3">
        {kitTiers.map((kit) => {
          const tier = player.tiers[kit.key]!;
          return (
            <div key={kit.key} className="flex w-8 flex-col items-center gap-0.5">
              <KitIcon kit={kit} className="h-6 w-6" active />
              <span className={`text-[11px] font-bold ${tierColor(tier)}`}>{tier}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
