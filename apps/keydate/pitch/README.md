# Pitch deck — JCI Edmonton, Creative Young Entrepreneur

`KeyDate-JCI-Edmonton.pptx` — 10 slides, 3-minute pitch plus 1 minute of Q&A.

**The slides are anchors, not a script.** 246 words across the whole deck,
averaging ~25 per slide, most of that headings and labels. Every sentence that
would otherwise sit on a wall lives in the speaker notes as a talking point
instead — if a judge can read the pitch off the screen, they stop listening to
the person delivering it. Presentation is 15 points and it scores the presenter,
not the slides.

## Why it's shaped this way

The competition rubric is 115 points, and it is not evenly weighted:

| Criterion | Points |
| --- | --- |
| Business and international impact | 35 |
| Community/social impact and sustainability | 20 |
| Clarity and quality of presentation | 15 |
| Innovation and originality | 15 |
| Scalability and growth potential | 15 |
| Leadership ability | 15 |

Impact plus community is 55 of 115 — nearly half. The instinct is to spend three
minutes on the product; that loses on points. The deck gives the product one
slide and the two impact criteria four.

Two known weak spots are addressed head-on rather than left for Q&A:
"international" is written into the 35-point criterion while the product is
Canada-specific (answered by the rules-engine/rulebook framing), and leadership
is 15 points for a solo founder (answered with shipped evidence, not adjectives).

## The story spine

The deck leads with the founder's own first purchase, not with market data. The
numbers appear once, on slide 4, as evidence for a feeling the room already has
— then it returns to the story.

**Slide 2 needs a real detail before this is presented.** It currently carries a
placeholder that is true of everyone, which is exactly why it is forgettable.
The speaker note says so.

## Figures used

- 2006 average Canadian home: **$276,974** (CREA — the record year, +11.1%)
- National average, June 2026: **~$696,078**

No national household-income figure is quoted anywhere. The comparable series
doesn't line up cleanly against 2006, and a shaky number invites a question that
costs more than the number gains.

## UI screenshots

Slides 5 and 8 carry real screens captured from a production build, not
mockups. `capture-ui.mjs` drives the app in a headless phone viewport at 3x and
writes them; the crop step is documented at the foot of that file.

The scenario is chosen, not incidental: an Edmonton two-storey on $92k income
with $9k saved puts the keys date years out *and* trips the stress-test warning,
so the dashboard shot argues "a date isn't an approval" without a slide having
to say it. The rent-vs-buy capture walks the rent up until the app returns
"Renting + investing wins", and asserts that verdict is on screen before
saving — that image is the evidence for the ethics slide, so it must actually
show the app telling someone not to buy.

Re-capture whenever the UI changes materially, or the deck starts advertising a
product that no longer exists.

## Which file to use

| File | Typeface | When |
| --- | --- | --- |
| **`KeyDate-JCI-Edmonton.pdf`** | Montserrat, **embedded** | **Present from this.** A PDF carries its own fonts and images, so it looks identical on any laptop, projector, or phone — nothing to install, nothing to substitute. |
| `KeyDate-JCI-Edmonton.pptx` | Arial | Editable, and safe everywhere. Arial is the one face present on every device and previewer. |
| `…-CenturyGothic.pptx` | Century Gothic | Closer to the intended geometric look. Ships with Office, but absent from most previewers. |
| `…-Montserrat.pptx` | Montserrat | Best looking, narrowest support — only correct where Montserrat is installed. |

**Why there is an Arial build at all.** A `.pptx` stores a font *name*, not the
font. Open one in a viewer that lacks that face — a phone preview, Google Drive,
Quick Look, Google Slides — and it silently substitutes, often a serif. The
deck is then reported as "looking like Times New Roman" while the file itself is
perfectly correct. Arial is the only typeface reliably present everywhere, so it
is the default; the PDF is the real answer.

## Making the PDF

    python3 render.py KeyDate-JCI-Edmonton-Montserrat.pptx --pdf
    node topdf.mjs

`render.py` reads the packed slide XML — real positions, sizes, colours, and
the embedded screenshots — into `preview.html`, and Chromium prints it at
13.333x7.5in. Montserrat is subset into the PDF, so it travels with the file.
Rebuild the PDF whenever the deck changes.

## Rebuilding

    node build-deck.cjs                    # Century Gothic → KeyDate-JCI-Edmonton.pptx
    DECK_FONT=montserrat node build-deck.cjs   # Montserrat variant

Requires `pptxgenjs`. `.cjs` because `apps/keydate` is an ES-module package.
Edit the generator rather than either `.pptx` so both stay reproducible and in
sync.

For visual QA, `render.py` draws the packed slide XML — real positions, real
sizes — to `preview.html` for screenshotting. LibreOffice can't open pptx in the
dev sandbox, so this is the check that catches overflow and collisions.

Caveat worth knowing: Century Gothic is a licensed Monotype face and isn't
installable in the dev sandbox, so QA renders it with a substitute. The
substitute is wider than the real thing, which makes the fit check conservative
rather than optimistic — but give the Century Gothic build one look on a real
machine before presenting.
