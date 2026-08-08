# KeyDate brand assets

## Icons

`logo.png` (512), `icon-192.png`, `apple-touch-icon.png`, `favicon-32.png` —
served at the site root by the deploy workflow, referenced by the static pages.

All are **fully opaque squares**. Every surface that shows an app icon rounds it
itself; a pre-rounded PNG means two masks that never align exactly, and the
sliver between them reads as a pale rim. Rounding for in-page use comes from CSS
`border-radius`.

## The QR code

`python3 brand/make-qr.py` regenerates it.

`qr-keydate-poster.png` (2000px, for print) and `.svg` (scales to any size
without softening) both encode **`https://keydate.ca/?s=poster`** — the landing
page, where the waitlist form is.

One code, deliberately. Earlier variants pointed at the same page with different
tags; several codes across several surfaces is several chances to print the
wrong one.

**Why the `?s=` tag.** It lands in the waitlist `source` column, so the admin
roster shows which signups came from a scan rather than lumping them in with the
landing page. Word-of-mouth you can't measure is a guess. It changes nothing the
visitor sees. `landing.html` whitelists the accepted values — the parameter
arrives from a URL, and a URL is not a thing to trust.

**Generated locally, not through a QR website.** Hosted generators see every
destination you create, and the ones that hand back a short redirect can change
or expire what a printed poster points at. These encode the real URL with
nothing in the middle.

Error correction is level H (~30% recoverable), which is what lets the logo sit
in the middle. Verified by decoding the generated files back to their URLs, and
again after scaling to 100px and applying blur, low contrast, sensor noise and a
12 degree rotation — all still read.

## Poster

`python3 brand/make-poster.py` builds `KeyDate-poster.pdf` (8.5×11in, live text,
Montserrat embedded — this is the file to send to a printer) and
`KeyDate-poster.png` (2448×3168, 288 dpi — for screens and messaging apps). It
also writes `poster.html`, which is gitignored: it inlines the fonts and both
images, so it is a megabyte of generated output that any browser can print.

Requires the QR code and `logo.png` to exist first, plus Chromium to render.
Without Chromium you still get `poster.html` and can print it by hand.

The QR sits on a white plate rather than directly on the green. A code needs a
quiet zone of about four modules to be found at all, and on a coloured sheet
that margin has to be drawn as part of the artwork. `keydate.ca` also appears
below it in plain text — not everyone will scan a stranger's QR code, and those
people should still be able to get there.

Re-verified after rendering: the code still decodes from the finished poster
down to 350px wide, and through blur, dim light, sensor noise and a 12 degree
tilt.
