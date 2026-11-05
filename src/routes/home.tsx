import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/HomePage";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Blade Tiers — Home" },
      {
        name: "description",
        content:
          "Blade Tiers: a competitive Minecraft PvP tierlist. Compete in ranked 1v1s, get tested by top players and claim your spot on the global leaderboard.",
      },
      { property: "og:title", content: "Blade Tiers — The #1 Cracked & Premium Tierlist" },
      {
        property: "og:description",
        content:
          "Compete in ranked 1v1s. Get tested by top players. Claim your spot on the global leaderboard.",
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
  component: HomeRoute,
});

function HomeRoute() {
  return <HomePage />;
}
