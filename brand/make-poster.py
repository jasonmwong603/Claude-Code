"""Build the KeyDate recruitment poster — US Letter, print ready.

One QR code, pointing at the waitlist signup on keydate.ca. Everything a
stranger needs to decide in the two seconds they look at it: whose it is, what
it promises, and where to point their camera.

Outputs, beside this file:
  poster.html            — self-contained source (fonts and images inlined)
  KeyDate-poster.pdf     — 8.5x11in, vector text, fonts embedded. Send this to a printer.
  KeyDate-poster.png     — 2448x3168 (288 dpi). For screens and messaging apps.

Run:  python3 brand/make-poster.py

Requires Chromium for the render step; the script finds it via PATH or the
usual install locations. Without it you still get poster.html, which any
browser will print to PDF correctly.
"""
import base64
import glob
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
QR = os.path.join(HERE, 'qr-keydate-poster.png')      # -> https://keydate.ca/?s=poster
LOGO = os.path.join(HERE, 'logo.png')

# The four Montserrat weights the layout actually uses. Inlined rather than
# linked: a poster gets opened on a machine that has never heard of Montserrat,
# and a silent fallback to Times is worse than a missing file.
WEIGHTS = {400: 'Regular', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold'}

FONT_DIRS = [
    os.path.join(HERE, 'fonts'),
    os.path.expanduser('~/.fonts'),
    os.path.expanduser('~/.local/share/fonts'),
    '/usr/share/fonts',
]


def data_uri(path: str, mime: str) -> str:
    with open(path, 'rb') as fh:
        return f'data:{mime};base64,' + base64.b64encode(fh.read()).decode('ascii')


def find_font(style: str) -> str | None:
    """Locate one Montserrat weight. fontconfig knows the real style names;
    filenames are only a fallback because a downloaded set may be named
    Montserrat-1.ttf through -4.ttf."""
    if shutil.which('fc-match'):
        out = subprocess.run(
            ['fc-match', '-f', '%{file}', f'Montserrat:style={style}'],
            capture_output=True, text=True,
        ).stdout.strip()
        # fc-match always answers something; only trust it if it really is Montserrat.
        if out and 'montserrat' in os.path.basename(out).lower():
            return out
    for root in FONT_DIRS:
        for path in glob.glob(os.path.join(root, '**', f'*ontserrat*{style}*.[to]tf'), recursive=True):
            return path
    return None


def font_css() -> str:
    faces, missing = [], []
    for weight, style in WEIGHTS.items():
        path = find_font(style)
        if not path:
            missing.append(style)
            continue
        mime = 'font/otf' if path.endswith('.otf') else 'font/ttf'
        fmt = 'opentype' if path.endswith('.otf') else 'truetype'
        faces.append(
            f"@font-face{{font-family:'Montserrat';font-style:normal;font-weight:{weight};"
            f"src:url({data_uri(path, mime)}) format('{fmt}')}}"
        )
    if missing:
        print(f'  ! Montserrat {", ".join(missing)} not found — falling back for those weights.',
              file=sys.stderr)
    return '\n'.join(faces)


HTML = """<!doctype html><meta charset="utf-8"><title>Join KeyDate today</title><style>
__FONTS__
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{width:8.5in;height:11in;font-family:'Montserrat',"Helvetica Neue",Arial,sans-serif;
  background:#1E4D3B;color:#fff;position:relative;overflow:hidden;
  padding:0.85in 0.7in 0.6in;text-align:center;-webkit-font-smoothing:antialiased}
/* Soft depth, so a flat green sheet doesn't read as a printer test page. */
body::before{content:'';position:absolute;inset:0;
  background:radial-gradient(120% 80% at 50% -10%, rgba(63,166,114,.30), transparent 60%)}
/* Three bands, spaced apart by the browser. Hand-tuning margins between seven
   separate elements is how leftover space ends up pooled in one arbitrary gap;
   space-between divides it by construction, so the code block lands optically
   centred without anyone nudging a number. */
.inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;
  justify-content:space-between;height:100%;width:100%}
.band{display:flex;flex-direction:column;align-items:center;width:100%}
.brandrow{display:flex;align-items:center;justify-content:center;gap:.16in;margin-bottom:.46in}
.brandrow img{width:.62in;height:.62in;border-radius:.15in;display:block}
.word{font-size:31pt;font-weight:800;letter-spacing:-.02em;line-height:1}
.word span{color:#3FA672}
h1{font-size:52pt;font-weight:800;line-height:1.02;letter-spacing:-.025em;margin-bottom:.24in}
h1 em{font-style:normal;color:#E8B84B}
.tag{font-size:17.5pt;font-weight:400;line-height:1.42;color:#DCEFE3;max-width:5.6in}
.tag b{font-weight:700;color:#fff}
/* White plate under the code: printed on green, a QR's quiet zone has to be
   part of the artwork or scanners hunt for an edge that isn't there.
   Width and height are stated outright rather than derived from padding, so the
   plate is exactly square instead of square to within a rounding error, and
   grid centring seats the code dead centre with no inline-layout slack.
   Two shadows, not one: a tight contact shadow plus a wide soft one. Both
   follow border-radius, so the corners stay round all the way out. */
.plate{width:3.57in;height:3.57in;background:#fff;border-radius:.34in;
  display:grid;place-items:center;
  box-shadow:0 .05in .14in rgba(0,0,0,.20), 0 .20in .55in rgba(0,0,0,.32)}
.plate img{width:3.05in;height:3.05in;display:block}
.scan{font-size:15pt;font-weight:700;color:#E8B84B;margin-top:.32in;letter-spacing:.02em}
/* The URL in plain text as well as in the code — some people won't scan a
   stranger's QR, and they should still be able to get there. */
.url{font-size:20pt;font-weight:800;margin-top:.08in;letter-spacing:-.01em}
.foot{font-size:10pt;color:#A9CBB8;line-height:1.6}
.foot b{color:#DCEFE3;font-weight:600}
</style>
<div class="inner">
  <div class="band">
    <div class="brandrow">
      <img src="__LOGO__" alt="">
      <div class="word">Key<span>Date</span></div>
    </div>
    <h1>Join KeyDate<br><em>today</em></h1>
    <p class="tag">Owning a home isn&rsquo;t impossible.<br><b>It has a date.</b></p>
  </div>
  <div class="band">
    <div class="plate"><img src="__QR__" alt="Scan for keydate.ca"></div>
    <div class="scan">SCAN TO JOIN THE BETA</div>
    <div class="url">keydate.ca</div>
  </div>
  <div class="band">
    <p class="foot"><b>Free &middot; No credit card &middot; Takes about a minute</b><br>
    Educational only &mdash; not financial, legal, or tax advice.</p>
  </div>
</div>
"""

CHROME_CANDIDATES = [
    os.environ.get('CHROME_PATH', ''),
    'chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable',
]


def find_chrome() -> str | None:
    for name in CHROME_CANDIDATES:
        if name and (shutil.which(name) or os.path.isfile(name)):
            return shutil.which(name) or name
    # Playwright's bundled build, if this is a dev container that has one.
    root = os.environ.get('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
    hits = sorted(glob.glob(os.path.join(root, 'chromium*', 'chrome-linux', 'chrome')))
    return hits[-1] if hits else None


def render(html_path: str) -> None:
    chrome = find_chrome()
    if not chrome:
        print('  ! Chromium not found — open poster.html and print to PDF instead.', file=sys.stderr)
        return
    url = 'file://' + html_path
    base = ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars']
    subprocess.run([chrome, *base, '--no-pdf-header-footer',
                    f'--print-to-pdf={os.path.join(HERE, "KeyDate-poster.pdf")}', url],
                   check=True, capture_output=True)

    # 3x device scale => 2448x3168, which is 288 dpi at letter size.
    #
    # Rendered into a window taller than the page and then cropped back down.
    # Chromium's --screenshot drops roughly the last 90px of the window, which
    # silently ate the disclaimer line when the window matched the page exactly
    # — the layout was correct (the PDF proves it), only the capture was short.
    png = os.path.join(HERE, 'KeyDate-poster.png')
    subprocess.run([chrome, *base, '--window-size=816,1200', '--force-device-scale-factor=3',
                    f'--screenshot={png}', url], check=True, capture_output=True)
    from PIL import Image
    Image.open(png).crop((0, 0, 816 * 3, 1056 * 3)).save(png)


if __name__ == '__main__':
    for path in (QR, LOGO):
        if not os.path.exists(path):
            sys.exit(f'missing {path} — run brand/make-qr.py first')

    html = (HTML.replace('__FONTS__', font_css())
                .replace('__LOGO__', data_uri(LOGO, 'image/png'))
                .replace('__QR__', data_uri(QR, 'image/png')))
    out = os.path.join(HERE, 'poster.html')
    with open(out, 'w') as fh:
        fh.write(html)
    render(out)
    for name in ('poster.html', 'KeyDate-poster.pdf', 'KeyDate-poster.png'):
        path = os.path.join(HERE, name)
        if os.path.exists(path):
            print(f'{name:22} {os.path.getsize(path) // 1024:>6} KB')
