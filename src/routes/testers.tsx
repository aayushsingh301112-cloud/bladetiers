import { createFileRoute } from "@tanstack/react-router";

import { TestersPage } from "@/components/TestersPage";

export const Route = createFileRoute("/testers")({
  head: () => ({
    meta: [
      { title: "Blade Tiers — Testers" },
      {
        name: "description",
        content:
          "The testing staff behind Blade Tiers: who runs the tier tests and assigns every tier on the leaderboard.",
      },
      { property: "og:title", content: "Blade Tiers — Testers" },
      {
        property: "og:description",
        content:
          "Meet the Blade Tiers testing staff — the players who grade fights and assign every tier.",
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
  component: TestersRoute,
});

function TestersRoute() {
  return <TestersPage />;
}
