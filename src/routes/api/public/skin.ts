import { createFileRoute } from "@tanstack/react-router";

/**
 * Same-origin proxy for the original uploaded Minecraft skin texture.
 *
 * The 3D renderer reads pixels back out of a canvas, which requires the
 * texture to be same-origin (or CORS-clean). Proxying also keeps the VPS
 * host private. Only paths on the configured upstream are allowed.
 */
export const Route = createFileRoute("/api/public/skin")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const upstream = process.env["PLAYERS_API_URL"];
        if (!upstream) return new Response("Not configured", { status: 404 });

        const raw = new URL(request.url).searchParams.get("u");
        if (!raw) return new Response("Missing u", { status: 400 });

        let target: URL;
        try {
          target = new URL(raw, upstream);
        } catch {
          return new Response("Bad url", { status: 400 });
        }
        if (target.origin !== new URL(upstream).origin) {
          return new Response("Forbidden", { status: 403 });
        }

        const res = await fetch(target.toString());
        if (!res.ok) return new Response("Not found", { status: 404 });

        return new Response(res.body, {
          headers: {
            "content-type": res.headers.get("content-type") ?? "image/png",
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
