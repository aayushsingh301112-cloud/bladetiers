import { createFileRoute } from "@tanstack/react-router";

import { normalizePlayers, sortPlayers } from "@/lib/players";

/**
 * Thin read-only proxy in front of the Discord bot's players API.
 *
 * The upstream URL lives in the `PLAYERS_API_URL` server secret, so the VPS
 * host is never exposed to the browser and CORS is never an issue.
 * Nothing here uses AI: it is a plain JSON fetch.
 */
export const Route = createFileRoute("/api/public/players")({
  server: {
    handlers: {
      GET: async () => {
        const upstream = process.env["PLAYERS_API_URL"];

        if (!upstream) {
          return Response.json(
            { players: [], configured: false },
            { headers: { "cache-control": "no-store" } },
          );
        }

        try {
          const res = await fetch(upstream, {
            headers: { accept: "application/json" },
          });
          if (!res.ok) throw new Error(`upstream ${res.status}`);

          const players = sortPlayers(normalizePlayers(await res.json())).map((p) => {
            const texture = absolutize(p.skinTexture, upstream);
            return {
              ...p,
              skin: absolutize(p.skin, upstream),
              // Served same-origin so the 3D renderer can read the canvas back.
              skinTexture: texture ? `/api/public/skin?u=${encodeURIComponent(texture)}` : null,
            };
          });

          return Response.json(
            { players, configured: true },
            { headers: { "cache-control": "no-store" } },
          );
        } catch {
          return Response.json(
            { players: [], configured: true, error: "Players API unavailable" },
            { status: 502, headers: { "cache-control": "no-store" } },
          );
        }
      },
    },
  },
});

/** Turns `/skin_website/Name.png` into an absolute URL on the upstream host. */
function absolutize(skin: string | null, upstream: string): string | null {
  if (!skin) return null;
  try {
    return new URL(skin, upstream).toString();
  } catch {
    return null;
  }
}
