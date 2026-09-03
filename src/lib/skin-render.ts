/**
 * Renders real 3D Minecraft player models with skinview3d (three.js) and
 * caches the result as a transparent PNG data URL.
 *
 * A single offscreen SkinViewer / WebGL context is shared by the whole
 * leaderboard, so a 20-row list never creates 20 WebGL contexts and the
 * periodic refresh re-uses the cache instead of re-rendering.
 * Browser-only: never import this from SSR code paths.
 */

const WIDTH = 260;
const HEIGHT = 420;

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

type Viewer = {
  loadSkin: (src: string, opts?: { model?: "default" | "slim" | "auto-detect" }) => Promise<void>;
  render: () => void;
  canvas: HTMLCanvasElement;
  camera: { position: { z: number }; rotation: { x: number } };
  playerObject: { rotation: { x: number; y: number }; skin: unknown };
  animation: unknown;
  zoom: number;
  autoRotate: boolean;
  dispose: () => void;
};

let viewerPromise: Promise<Viewer> | null = null;

async function getViewer(): Promise<Viewer> {
  if (!viewerPromise) {
    viewerPromise = (async () => {
      const { SkinViewer } = await import("skinview3d");
      const canvas = document.createElement("canvas");
      const viewer = new SkinViewer({
        canvas,
        width: WIDTH,
        height: HEIGHT,
        preserveDrawingBuffer: true,
        renderPaused: true,
      }) as unknown as Viewer;
      viewer.autoRotate = false;
      viewer.animation = null;
      viewer.zoom = 0.85;
      return viewer;
    })();
  }
  return viewerPromise;
}

/** Renders `skinUrl` (a raw 64x64 / 64x32 Minecraft texture) to a PNG data URL. */
export function renderSkin(skinUrl: string): Promise<string> {
  const cached = cache.get(skinUrl);
  if (cached) return Promise.resolve(cached);

  const existing = inflight.get(skinUrl);
  if (existing) return existing;

  // Serialize renders: one shared viewer can only hold one skin at a time.
  const job = queue
    .catch(() => undefined)
    .then(async () => {
      const viewer = await getViewer();
      await viewer.loadSkin(skinUrl, { model: "auto-detect" });
      // Stable, slightly-turned "ready" pose — no animation, no autorotation.
      viewer.playerObject.rotation.y = Math.PI / 7;
      viewer.playerObject.rotation.x = 0;
      viewer.render();
      const url = viewer.canvas.toDataURL("image/png");
      cache.set(skinUrl, url);
      inflight.delete(skinUrl);
      return url;
    })
    .catch((err) => {
      inflight.delete(skinUrl);
      throw err;
    });
  queue = job.catch(() => undefined);

  inflight.set(skinUrl, job);
  return job;
}
