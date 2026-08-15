import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { KitTabs } from "@/components/KitTabs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blade Tiers — Minecraft PvP Tier Rankings" },
      {
        name: "description",
        content:
          "Blade Tiers ranks Minecraft PvP players across kits with live tier lists, player search and community Discords.",
      },
      { property: "og:title", content: "Blade Tiers — Minecraft PvP Tier Rankings" },
      {
        property: "og:description",
        content: "Live Minecraft PvP tier rankings, player search and community Discords.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-10">
        <h1 className="sr-only">Blade Tiers Minecraft PvP rankings</h1>
        <KitTabs />
      </main>
    </div>
  );
}
