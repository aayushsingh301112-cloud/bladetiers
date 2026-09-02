import { useQuery } from "@tanstack/react-query";

import { PlayerRow } from "@/components/PlayerRow";
import { normalizePlayers, sortPlayers, type Player } from "@/lib/players";

type PlayersResponse = { players: Player[]; configured?: boolean; error?: string };

async function fetchPlayers(): Promise<PlayersResponse> {
  const res = await fetch("/api/public/players", { headers: { accept: "application/json" } });
  const json = (await res.json()) as PlayersResponse;
  return {
    ...json,
    players: sortPlayers(normalizePlayers(json.players)),
  };
}

export function Leaderboard({ kitKey }: { kitKey: string }) {
  // Periodic refresh so newly registered players show up on their own.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="space-y-2 pt-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[4.5rem] animate-pulse rounded-xl bg-card/60" />
        ))}
      </div>
    );
  }

  if (isError || data?.error) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Couldn&apos;t reach the rankings service. Retrying automatically…
      </p>
    );
  }

  const all = data?.players ?? [];
  const players = kitKey === "overall" ? all : all.filter((p) => !!p.tiers[kitKey]);

  if (players.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {data?.configured === false
          ? "Rankings source not connected yet."
          : "No players here yet — register through the Discord bot to appear."}
      </p>
    );
  }

  return (
    <div className="space-y-2 pt-3">
      {players.map((player, i) => (
        <PlayerRow key={player.name} player={player} rank={i + 1} />
      ))}
    </div>
  );
}
