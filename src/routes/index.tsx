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
      <main className="mx-auto max-w-7xl px-4 py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Blade Tiers</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Tell me what to build next and this page will fill in.
        </p>
      </main>
    </div>
  );
}
