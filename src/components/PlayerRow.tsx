import { Award } from "lucide-react";

import { RANKED_KITS } from "@/lib/kits";
import type { Player } from "@/lib/players";

function tierColor(tier: string) {
  if (tier.startsWith("HT")) return "text-kit-gold";
  return "text-kit-silver";
}

export function PlayerRow({ player, rank }: { player: Player; rank: number }) {
  const kitTiers = RANKED_KITS.filter((kit) => !!player.tiers[kit.key]);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/70 px-3 py-2 transition-colors hover:bg-card">
      {/* rank + skin plate */}
      <div className="relative flex h-14 w-40 shrink-0 items-center overflow-hidden rounded-lg bg-kit-gold/90">
        <span
          className="pl-3 text-2xl font-black italic text-background"
          style={{ fontStyle: "italic" }}
        >
          {rank}.
        </span>
        {player.skin ? (
          <img
            src={player.skin}
            alt={`${player.name} Minecraft skin`}
            loading="lazy"
            className="ml-2 h-14 w-auto object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        ) : null}
        <span
          className="absolute inset-y-0 right-0 w-8 bg-card"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* identity */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-extrabold text-kit-blue">{player.name}</p>
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
          <span className="inline-flex items-center justify-center rounded-md bg-primary/20 px-2.5 py-1 text-sm font-bold text-primary">
            {player.region}
          </span>
        ) : null}
      </div>

      {/* tiers — completely hidden until a real tier is assigned */}
      <div className="flex min-w-[8rem] shrink-0 justify-end gap-3">
        {kitTiers.map((kit) => {
          const tier = player.tiers[kit.key]!;
          const Icon = kit.icon;
          return (
            <div key={kit.key} className="flex w-8 flex-col items-center gap-0.5">
              <Icon
                className={`h-5 w-5 ${kit.color}`}
                strokeWidth={2.25}
                fill={kit.filled ? "currentColor" : "none"}
              />
              <span className={`text-[11px] font-bold ${tierColor(tier)}`}>{tier}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
