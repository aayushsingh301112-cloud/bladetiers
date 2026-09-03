import { useEffect, useState } from "react";

import { renderSkin } from "@/lib/skin-render";

type Props = {
  /** Raw Minecraft skin texture URL (64x64 / 64x32). */
  skinUrl: string | null;
  /** Optional pre-rendered flat PNG used only if no raw texture exists. */
  fallbackUrl?: string | null;
  name: string;
  className?: string;
};

/**
 * Renders a real 3D Minecraft player model (skinview3d / three.js) from the
 * player's original uploaded skin texture. Rendering happens once per unique
 * skin in a shared offscreen WebGL context, so the leaderboard's periodic
 * refresh never spawns extra contexts.
 */
export function MinecraftPlayer({ skinUrl, fallbackUrl, name, className }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setSrc(null);
    setFailed(false);
    if (!skinUrl) return;

    renderSkin(skinUrl)
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [skinUrl]);

  const shown = src ?? (failed || !skinUrl ? (fallbackUrl ?? null) : null);
  if (!shown) return <div className={className} aria-hidden />;

  return (
    <img
      src={shown}
      alt={`${name} Minecraft character`}
      loading="lazy"
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
