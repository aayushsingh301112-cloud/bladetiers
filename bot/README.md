# Discord bot → website integration

Drop these two files next to your existing bot. They do **not** replace the bot,
the registration flow or your skin storage — they only expose what the website
needs. No AI, no Lovable credits at runtime.

```
Discord register → bot saves player data + original skin (unchanged)
                 → render_website_skin() writes skin_website/<Name>.png
                 → players_api.py serves GET /api/players + /skin_website/*
                 → website proxies it at /api/public/players and refreshes every 15s
```

## 1. Render the website skin on registration

```python
from render_skin import render_website_skin

# inside your /register command, after the original skin is saved:
render_website_skin(original_skin_path, ign)   # -> skin_website/Just2Tick.png
```

The original upload is never touched; the render is a transparent-background
character cutout (head, body, arms, legs, with the second/overlay layer).

## 2. Player data shape

Your bot's `data/players.json` (or whatever it already uses) should look like:

```json
[
  { "name": "Just2Tick", "region": "AS", "tiers": {} }
]
```

Tiers stay **empty** until tested. To assign one later:

```json
{ "name": "Just2Tick", "region": "AS", "points": 60, "title": "Combat Cadet",
  "tiers": { "vanilla": "HT2", "uhc": "LT1" } }
```

Valid kit keys: `ltms, vanilla, uhc, pot, nethop, smp, sword, axe, mace`.
Any missing/empty tier is hidden on the site — nothing is invented.

## 3. Serve it

```bash
pip install flask pillow
PLAYERS_FILE=data/players.json python players_api.py
```

Put it behind your existing reverse proxy over HTTPS.

## 4. Connect the website

Set the `PLAYERS_API_URL` secret in this Lovable project to the public URL of
`/api/players` (e.g. `https://api.chocomc.fun/api/players`). The website's
`/api/public/players` route proxies it server-side, so the VPS host stays
private and there are no CORS issues.

## 5. Original skins for the 3D renderer

The website now renders a real 3D Minecraft model (skinview3d/three.js) from the
**original uploaded skin texture**, so the API must expose it:

- `GET /skins/<Username>.png` → the raw 64x64 (or 64x32) upload
- each player object gains `"skin_original": "/skins/<Username>.png"`

`players_api.py` already does both; point `SKIN_DIR` at the bot's existing skin
folder (default `skins/`). The generated `skin_website/*.png` stays as a fallback.
