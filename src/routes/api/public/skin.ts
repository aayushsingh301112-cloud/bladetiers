import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const UPSTREAM_ORIGIN = "http://hopper.proxy.rlwy.net:46859";
const skinPathSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("/skin_website/") || value.startsWith("/skins/"));

export const Route = createFileRoute("/api/public/skin")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const parsed = skinPathSchema.safeParse(requestUrl.searchParams.get("path"));

        if (!parsed.success) return new Response("Invalid skin path", { status: 400 });

        try {
          const upstream = await fetch(new URL(parsed.data, UPSTREAM_ORIGIN));
          if (!upstream.ok || !upstream.body) {
            return new Response("Skin unavailable", { status: 502 });
          }

          return new Response(upstream.body, {
            status: 200,
            headers: {
              "Content-Type": upstream.headers.get("content-type") ?? "image/png",
              "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
          });
        } catch {
          return new Response("Skin unavailable", { status: 502 });
        }
      },
    },
  },
});