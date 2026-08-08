# KeyDate brand assets

## Icons

`logo.png` (512), `icon-192.png`, `apple-touch-icon.png`, `favicon-32.png` —
served at the site root by the deploy workflow, referenced by the static pages.

All are **fully opaque squares**. Every surface that shows an app icon rounds it
itself; a pre-rounded PNG means two masks that never align exactly, and the
sliver between them reads as a pale rim. Rounding for in-page use comes from CSS
`border-radius`.

## QR codes

`python3 brand/make-qr.py` regenerates all of them.

| File | Points at | Use for |
| --- | --- | --- |
| `qr-keydate-qr.*` | `keydate.ca/?s=qr` | **Default.** Word of mouth, stickers, phone-to-phone |
| `qr-keydate-poster.*` | `keydate.ca/?s=poster` | Anything printed and left somewhere |
| `qr-keydate.*` | `keydate.ca` | Untagged, when a clean URL matters |

PNG is 2000px for print; SVG scales to any size without softening.

**Why the `?s=` tag.** It lands in the waitlist `source` column, so the admin
roster shows which signups came from a scan rather than lumping them in with the
landing page. Word-of-mouth you can't measure is a guess. `landing.html`
whitelists the accepted values — the parameter arrives from a URL, and a URL is
not a thing to trust.

**Generated locally, not through a QR website.** Hosted generators see every
destination you create, and the ones that hand back a short redirect can change
or expire what a printed poster points at. These encode the real URL with
nothing in the middle.

Error correction is level H (~30% recoverable), which is what lets the logo sit
in the middle. Verified by decoding the generated files back to their URLs, and
again after scaling to 100px and applying blur, low contrast, sensor noise and a
12 degree rotation — all still read.
