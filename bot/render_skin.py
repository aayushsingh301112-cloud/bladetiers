"""
Website skin renderer for the Tier Testing Discord bot.

Takes an uploaded Minecraft skin (64x64 or legacy 64x32) and renders a flat
"character cutout" (head + body + arms + legs, front view) with a fully
transparent background, then saves it to skin_website/<Username>.png.

Pure Pillow — no AI, no external API, no credits.

    pip install pillow

    from render_skin import render_website_skin
    render_website_skin("skins/Just2Tick.png", "Just2Tick")
"""

from __future__ import annotations

import os
import re
from PIL import Image

SKIN_WEBSITE_DIR = os.environ.get("SKIN_WEBSITE_DIR", "skin_website")

# Scale of the final image (1 unit = 1 skin pixel). 16 -> 512px tall render.
SCALE = 16

# (x, y, w, h) regions of a 64x64 skin, front view.
BASE = {
    "head": (8, 8, 8, 8),
    "body": (20, 20, 8, 12),
    "arm_r": (44, 20, 4, 12),   # player's right arm (viewer's left)
    "leg_r": (4, 20, 4, 12),
    "hat": (40, 8, 8, 8),
}
# Second layer / modern-only slots
OVERLAY = {
    "jacket": (20, 36, 8, 12),
    "sleeve_r": (44, 36, 4, 12),
    "sleeve_l": (52, 52, 4, 12),
    "pants_r": (4, 36, 4, 12),
    "pants_l": (4, 52, 4, 12),
}
MODERN = {
    "arm_l": (36, 52, 4, 12),
    "leg_l": (20, 52, 4, 12),
}

SAFE_NAME = re.compile(r"^[A-Za-z0-9_]{1,16}$")


def _crop(skin: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    x, y, w, h = box
    return skin.crop((x, y, x + w, y + h))


def _has_pixels(img: Image.Image) -> bool:
    alpha = img.getchannel("A")
    return alpha.getextrema()[1] > 0


def render_website_skin(skin_path: str, username: str, out_dir: str = SKIN_WEBSITE_DIR) -> str:
    """Render a transparent front-facing cutout. Returns the output file path.

    The original uploaded skin at `skin_path` is never modified.
    """
    if not SAFE_NAME.match(username):
        raise ValueError("invalid Minecraft username")

    skin = Image.open(skin_path).convert("RGBA")
    if skin.width != 64 or skin.height not in (32, 64):
        skin = skin.resize((64, 64), Image.NEAREST)
    legacy = skin.height == 32
    if legacy:
        padded = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
        padded.paste(skin, (0, 0))
        skin = padded

    head = _crop(skin, BASE["head"])
    hat = _crop(skin, BASE["hat"])
    if _has_pixels(hat):
        head = Image.alpha_composite(head, hat)

    body = _crop(skin, BASE["body"])
    arm_r = _crop(skin, BASE["arm_r"])
    leg_r = _crop(skin, BASE["leg_r"])

    # Legacy skins mirror the right limbs; modern skins have dedicated slots.
    arm_l = _crop(skin, MODERN["arm_l"])
    if legacy or not _has_pixels(arm_l):
        arm_l = arm_r.transpose(Image.FLIP_LEFT_RIGHT)
    leg_l = _crop(skin, MODERN["leg_l"])
    if legacy or not _has_pixels(leg_l):
        leg_l = leg_r.transpose(Image.FLIP_LEFT_RIGHT)

    if not legacy:
        for part, key, mirror_of in (
            ("body", "jacket", None),
            ("arm_r", "sleeve_r", None),
            ("arm_l", "sleeve_l", "sleeve_r"),
            ("leg_r", "pants_r", None),
            ("leg_l", "pants_l", "pants_r"),
        ):
            layer = _crop(skin, OVERLAY[key])
            if not _has_pixels(layer) and mirror_of:
                layer = _crop(skin, OVERLAY[mirror_of]).transpose(Image.FLIP_LEFT_RIGHT)
            if not _has_pixels(layer):
                continue
            target = {"body": body, "arm_r": arm_r, "arm_l": arm_l, "leg_r": leg_r, "leg_l": leg_l}[part]
            merged = Image.alpha_composite(target, layer)
            if part == "body":
                body = merged
            elif part == "arm_r":
                arm_r = merged
            elif part == "arm_l":
                arm_l = merged
            elif part == "leg_r":
                leg_r = merged
            else:
                leg_l = merged

    # Layout in skin-pixel units: 16 wide x 32 tall, transparent background.
    canvas = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
    canvas.paste(head, (4, 0))
    canvas.paste(body, (4, 8))
    canvas.paste(arm_l, (0, 8))    # viewer's left
    canvas.paste(arm_r, (12, 8))
    canvas.paste(leg_l, (4, 20))
    canvas.paste(leg_r, (8, 20))

    canvas = canvas.resize((16 * SCALE, 32 * SCALE), Image.NEAREST)

    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{username}.png")
    canvas.save(out_path, "PNG")
    return out_path


if __name__ == "__main__":
    import sys

    print(render_website_skin(sys.argv[1], sys.argv[2]))
