#!/usr/bin/env python3
"""Generate KeyDate app icons (a gold key on a spruce rounded square).

Run from apps/keydate/:  python3 scripts/gen-icons.py
Outputs PNGs into public/ and a 1024px source into resources/ for
`npx @capacitor/assets generate` to turn into native iOS/Android icons.

Requires Pillow (pip install pillow). The rendered PNGs are committed, so you
only need to re-run this if you change the mark.
"""
from PIL import Image, ImageDraw
import os

SPRUCE = (30, 77, 59, 255)   # #1E4D3B
GOLD = (232, 184, 75, 255)   # #E8B84B
SS = 4                       # supersample factor for smooth edges
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def draw_key(d, S, scale=1.0):
    """Draw a centred key mark on a S×S canvas at the given content scale."""
    cx = S / 2
    # Geometry in a 1024 reference, scaled to S and by `scale`.
    u = (S / 1024) * scale
    # Bow (ring) near the top.
    ring_cy = cx - 150 * (S / 1024)  # keep ring vertically a touch above centre
    ring_cy = S * 0.36
    outer = 150 * u
    inner = 82 * u
    d.ellipse([cx - outer, ring_cy - outer, cx + outer, ring_cy + outer], fill=GOLD)
    d.ellipse([cx - inner, ring_cy - inner, cx + inner, ring_cy + inner], fill=SPRUCE)
    # Shaft (blade) going down from the ring.
    shaft_w = 66 * u
    shaft_top = ring_cy + inner * 0.2
    shaft_bot = S * 0.80
    d.rounded_rectangle(
        [cx - shaft_w / 2, shaft_top, cx + shaft_w / 2, shaft_bot],
        radius=shaft_w / 2, fill=GOLD,
    )
    # Two teeth sticking out to the right near the bottom.
    tooth_w = 70 * u
    tooth_h = 34 * u
    for ty in (S * 0.63, S * 0.72):
        d.rounded_rectangle(
            [cx + shaft_w / 2 - 2, ty, cx + shaft_w / 2 + tooth_w, ty + tooth_h],
            radius=tooth_h / 3, fill=GOLD,
        )


def make(size, path, maskable=False):
    S = size * SS
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if maskable:
        # Full-bleed background; content stays within the centre safe zone.
        d.rectangle([0, 0, S, S], fill=SPRUCE)
        draw_key(d, S, scale=0.62)
    else:
        radius = int(S * 0.22)
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=radius, fill=SPRUCE)
        draw_key(d, S, scale=0.82)
    img = img.resize((size, size), Image.LANCZOS)
    img.save(path)
    print("wrote", os.path.relpath(path, HERE))


def main():
    pub = os.path.join(HERE, "public")
    res = os.path.join(HERE, "resources")
    os.makedirs(pub, exist_ok=True)
    os.makedirs(res, exist_ok=True)
    make(192, os.path.join(pub, "icon-192.png"))
    make(512, os.path.join(pub, "icon-512.png"))
    make(512, os.path.join(pub, "icon-512-maskable.png"), maskable=True)
    make(180, os.path.join(pub, "apple-touch-icon.png"))
    make(1024, os.path.join(res, "icon.png"))            # @capacitor/assets source
    make(1024, os.path.join(res, "icon-foreground.png"), maskable=True)


if __name__ == "__main__":
    main()
