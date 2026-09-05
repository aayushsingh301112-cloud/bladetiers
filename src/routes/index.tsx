import { createFileRoute } from "@tanstack/react-router";

import { BladeApp } from "@/components/BladeApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blade Tiers — Minecraft PvP Rankings" },
      {
        name: "description",
        content:
          "Blade Tiers: competitive Minecraft PvP tier rankings and player tier lists for chocomc.net.",
      },
      { property: "og:title", content: "Blade Tiers — Minecraft PvP Rankings" },
      {
        property: "og:description",
        content: "Live Minecraft PvP tier rankings and player profiles for chocomc.net.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: "/css/style.css" },
      { rel: "icon", href: "/favicon.webp", type: "image/webp" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <BladeApp />;
}
