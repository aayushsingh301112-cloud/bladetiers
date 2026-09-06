import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM_PLAYERS_URL = "http://hopper.proxy.rlwy.net:46859/api/players";

export const Route = createFileRoute("/api/public/players")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const upstream = await fetch(UPSTREAM_PLAYERS_URL, {
            headers: { Accept: "application/json" },
          });

          if (!upstream.ok) {
            return Response.json(
              { error: "Rankings source unavailable" },
              { status: 502, headers: { "Cache-Control": "no-store" } },
            );
          }

          return new Response(await upstream.text(), {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "public, max-age=15, s-maxage=15",
            },
          });
        } catch {
          return Response.json(
            { error: "Rankings source unavailable" },
            { status: 502, headers: { "Cache-Control": "no-store" } },
          );
        }
      },
    },
  },
});