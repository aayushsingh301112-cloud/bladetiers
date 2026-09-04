import { useState } from "react";

import { Leaderboard } from "@/components/Leaderboard";
import { KITS, KitIcon } from "@/lib/kits";

export function KitTabs() {
  const [active, setActive] = useState("overall");

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="flex flex-wrap gap-1">
        {KITS.map((kit) => {
          const isActive = kit.key === active;
          return (
            <button
              key={kit.key}
              onClick={() => setActive(kit.key)}
              className={`relative flex min-w-[6.5rem] flex-col items-center gap-1.5 rounded-t-xl border border-b-0 px-4 py-3 transition-colors ${
                isActive
                  ? "border-border bg-card text-foreground"
                  : "border-transparent bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <KitIcon kit={kit} className="h-6 w-6" active={isActive} />
              <span className="text-sm font-semibold">{kit.label}</span>
              {isActive ? (
                <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-foreground" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl rounded-tl-none border border-border bg-card/60 p-4">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              i
            </span>
            Information
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">
                SERVER IP
              </p>
              <button
                onClick={() => navigator.clipboard?.writeText("chocomc.fun")}
                className="rounded-md bg-secondary px-2 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                chocomc.fun
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4 border-b border-border pb-3 text-xs font-semibold tracking-widest text-muted-foreground">
          <span>#</span>
          <span>PLAYER</span>
          <span className="text-right">REGION</span>
          <span className="text-right">TIERS</span>
        </div>

        <Leaderboard kitKey={active} />
      </div>
    </section>
  );
}
