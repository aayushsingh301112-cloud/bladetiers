import { createFileRoute } from "@tanstack/react-router";

import { OverviewPage } from "@/components/OverviewPage";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "Blade Tiers — Overview" },
      {
        name: "description",
        content:
          "What Blade Tiers is: ranked Minecraft PvP tier tests, tiers per kit and the global leaderboard for chocomc.net.",
      },
      { property: "og:title", content: "Blade Tiers — Overview" },
      {
        property: "og:description",
        content:
          "Blade Tiers ranks the best Minecraft PvP players. Get tested, earn your tier and climb the leaderboard.",
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
  component: OverviewRoute,
});

function OverviewRoute() {
  return <OverviewPage />;
}
