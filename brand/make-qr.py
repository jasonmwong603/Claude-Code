"""Generate KeyDate QR codes for print and screen.

Generated locally rather than through a QR web service on purpose: a hosted
generator sees every scan-destination you make, and the ones that hand back a
short redirect URL can change or expire what a printed poster points at. A QR
encodes the real destination and nothing sits in the middle.

Outputs, for each destination:
  qr-<name>.png  — 2000px, for print
  qr-<name>.svg  — vector, scales to any poster size without softening

Run:  python3 brand/make-qr.py
"""
import os

import qrcode
from qrcode.image.svg import SvgPathImage
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SPRUCE = (30, 77, 59)          # brand dark green — the "dark" modules
WHITE = (255, 255, 255)

# The tracked variant is the same destination with a source tag, so signups can
# be attributed. landing.html whitelists these values.
TARGETS = [
    ('keydate', 'https://keydate.ca/'),
    ('keydate-qr', 'https://keydate.ca/?s=qr'),
    ('keydate-poster', 'https://keydate.ca/?s=poster'),
]


def build(url: str):
    """Error correction H (~30%) so the code still reads with the logo covering
    the middle, and survives a scuffed or badly printed poster."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,          # the quiet zone; below 4 modules scanners struggle
    )
    qr.add_data(url)
    qr.make(fit=True)
    return qr


def png(url: str, path: str, size: int = 2000, logo: bool = True) -> None:
    qr = build(url)
    img = qr.make_image(fill_color=SPRUCE, back_color=WHITE).convert('RGB')
    img = img.resize((size, size), Image.NEAREST)   # keep module edges crisp

    if logo:
        mark = Image.open(os.path.join(HERE, 'logo.png')).convert('RGBA')
        # ~19% of the width. Error correction H tolerates ~30% loss, so this
        # leaves real headroom rather than sitting on the limit.
        side = int(size * 0.19)
        mark = mark.resize((side, side), Image.LANCZOS)
        pad = int(side * 0.10)
        plate = Image.new('RGB', (side + pad * 2, side + pad * 2), WHITE)
        plate.paste(mark, (pad, pad), mark)
        off = (size - plate.width) // 2
        img.paste(plate, (off, off))

    img.save(path)


def svg(url: str, path: str) -> None:
    build(url).make_image(image_factory=SvgPathImage).save(path)


if __name__ == '__main__':
    for name, url in TARGETS:
        png(url, os.path.join(HERE, f'qr-{name}.png'))
        svg(url, os.path.join(HERE, f'qr-{name}.svg'))
        print(f'{name:16} {url}')
