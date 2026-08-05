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

## Font

The deck is set in **Montserrat** — one family, weight doing the contrast.

**Montserrat does not ship with Office.** On a machine without it installed,
PowerPoint substitutes a default and the layout shifts. Before presenting:

1. Install Montserrat (free, fonts.google.com/specimen/Montserrat) on whatever
   machine will drive the projector, **or**
2. Export to PDF (File → Export → PDF) and present from that — PDF embeds the
   font, so it renders identically anywhere. Worth doing regardless as a backup.

To fall back to a font that is always present, change `HEAD`/`BODY` in the
generator to `Century Gothic` (nearest Office-bundled geometric sans) and
rebuild. Display sizes are tuned for Montserrat's width; a swap may need them
nudged.

## Rebuilding

    node build-deck.cjs

Requires `pptxgenjs`. `.cjs` because `apps/keydate` is an ES-module package.
Edit the generator rather than the `.pptx` so the deck stays reproducible.

For visual QA, `render.py` draws the packed slide XML — real positions, real
sizes — to `preview.html` for screenshotting. LibreOffice can't open pptx in the
dev sandbox, so this is the check that catches overflow and collisions.
