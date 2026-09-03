"""
Minimal read-only players API for the Tier Testing bot's VPS.

Exposes only public data:

    GET /api/players   ->  [{"name","region","skin","tiers"}, ...]
    GET /skin_website/<Username>.png

Never returns tokens, .env values, Discord IDs or filesystem paths.
Run it next to the bot (same machine, same data files):

    pip install flask pillow
    python players_api.py         # listens on 0.0.0.0:8080

Then put the public URL of /api/players into the website's PLAYERS_API_URL
secret. Nothing here uses AI.
"""

from __future__ import annotations

import json
import os
import re

from flask import Flask, jsonify, send_from_directory

# Point these at the bot's existing storage — do not duplicate it.
PLAYERS_FILE = os.environ.get("PLAYERS_FILE", "data/players.json")
SKIN_WEBSITE_DIR = os.environ.get("SKIN_WEBSITE_DIR", "skin_website")
# Original uploaded 64x64 skin textures (used by the website's 3D renderer).
SKIN_DIR = os.environ.get("SKIN_DIR", "skins")

SAFE_NAME = re.compile(r"^[A-Za-z0-9_]{1,16}$")

app = Flask(__name__)


def load_players() -> list[dict]:
    if not os.path.exists(PLAYERS_FILE):
        return []
    with open(PLAYERS_FILE, "r", encoding="utf-8") as fh:
        raw = json.load(fh)
    if isinstance(raw, dict):
        raw = list(raw.values())
    return raw if isinstance(raw, list) else []


def public_view(p: dict) -> dict | None:
    name = (p.get("name") or p.get("username") or p.get("ign") or "").strip()
    if not SAFE_NAME.match(name):
        return None

    # Drop empty / null tiers entirely so the website never renders a fake tier.
    tiers = {
        str(k).lower(): str(v).upper()
        for k, v in (p.get("tiers") or {}).items()
        if isinstance(v, str) and v.strip()
    }

    skin_file = os.path.join(SKIN_WEBSITE_DIR, f"{name}.png")
    original_file = os.path.join(SKIN_DIR, f"{name}.png")
    return {
        # Raw Minecraft texture -> rendered as a real 3D model on the website.
        "skin_original": f"/skins/{name}.png" if os.path.exists(original_file) else None,
        "name": name,
        "region": (p.get("region") or None),
        "skin": f"/skin_website/{name}.png" if os.path.exists(skin_file) else None,
        "points": p.get("points"),
        "title": p.get("title"),
        "tiers": tiers,
    }


@app.get("/skins/<path:filename>")
def original_skin(filename: str):
    resp = send_from_directory(SKIN_DIR, filename)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


@app.get("/api/players")
def players():
    out = [v for v in (public_view(p) for p in load_players()) if v]
    resp = jsonify(out)
    resp.headers["Cache-Control"] = "no-store"
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


@app.get("/skin_website/<path:filename>")
def skin(filename: str):
    resp = send_from_directory(SKIN_WEBSITE_DIR, filename)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
