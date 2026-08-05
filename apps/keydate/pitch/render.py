"""Render the ACTUAL generated pptx geometry to HTML for visual QA.

LibreOffice can't load pptx in this sandbox, so instead of trusting the
generator script we parse the packed slide XML — real positions, real sizes,
real text — and lay it out at 100px per inch for a screenshot.
"""
import html
import re
import sys
import zipfile
from defusedxml import minidom

EMU = 914400.0
PX = 100.0  # px per inch
A = 'http://schemas.openxmlformats.org/drawingml/2006/main'

import base64, os
deck = sys.argv[1]
PDF_MODE = '--pdf' in sys.argv
z = zipfile.ZipFile(deck)

def rel_images(slide_name):
    """r:embed id -> data URI, for the pictures on one slide."""
    rels = f'ppt/slides/_rels/{os.path.basename(slide_name)}.rels'
    out = {}
    if rels not in z.namelist():
        return out
    doc = minidom.parseString(z.read(rels))
    for r in doc.getElementsByTagName('Relationship'):
        tgt = r.getAttribute('Target')
        if '/media/' in tgt or tgt.startswith('../media/'):
            path = 'ppt/' + tgt.replace('../', '')
            if path in z.namelist():
                b64 = base64.b64encode(z.read(path)).decode()
                out[r.getAttribute('Id')] = f'data:image/png;base64,{b64}'
    return out
slides = sorted(
    (n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)),
    key=lambda n: int(re.search(r'(\d+)', n.rsplit('/', 1)[1]).group(1)),
)


def child(node, name):
    for c in node.childNodes:
        if c.nodeType == 1 and c.localName == name:
            return c
    return None


def descend(node, *names):
    cur = node
    for n in names:
        cur = child(cur, n) if cur is not None else None
    return cur


def solid_color(node):
    """Nearest srgbClr under a fill node."""
    if node is None:
        return None
    els = node.getElementsByTagNameNS(A, 'srgbClr')
    return els[0].getAttribute('val') if els else None


def geom(sp):
    # Shapes carry xfrm under spPr; graphicFrames (charts) carry it directly.
    xfrm = descend(sp, 'spPr', 'xfrm') or child(sp, 'xfrm')
    if xfrm is None:
        return None
    off, ext = child(xfrm, 'off'), child(xfrm, 'ext')
    if off is None or ext is None:
        return None
    return (
        int(off.getAttribute('x')) / EMU, int(off.getAttribute('y')) / EMU,
        int(ext.getAttribute('cx')) / EMU, int(ext.getAttribute('cy')) / EMU,
    )


out = ['<meta charset="utf-8"><style>',
       'body{margin:0;background:#555;font-family:Calibri,Carlito,sans-serif}',
       '.slide{position:relative;width:1333px;height:750px;margin:18px auto;overflow:hidden;',
       'box-shadow:0 4px 18px rgba(0,0,0,.45)}',
       '.n{position:absolute;top:4px;right:8px;color:#fff;background:#000a;padding:2px 8px;',
       'font:12px monospace;z-index:99}',
       '.t{position:absolute;overflow:visible}',
       '@page{size:13.333in 7.5in;margin:0}',
       '@media print{body{background:#fff}',
       '.slide{margin:0;box-shadow:none;page-break-after:always;break-after:page}',
       '.n{display:none}}',
       '</style>']

for idx, name in enumerate(slides, 1):
    imgs = rel_images(name)
    doc = minidom.parseString(z.read(name))
    csld = doc.getElementsByTagNameNS('http://schemas.openxmlformats.org/presentationml/2006/main', 'cSld')[0]
    bg = solid_color(child(csld, 'bg')) or 'FFFFFF'
    out.append(f'<div class="slide" style="background:#{bg}"><div class="n">slide {idx}</div>')

    tree = child(csld, 'spTree')
    for sp in tree.childNodes:
        if sp.nodeType != 1:
            continue
        if sp.localName == 'graphicFrame':
            g = geom(sp)
            if g:
                x, y, w, h = g
                out.append(
                    f'<div class="t" style="left:{x*PX:.0f}px;top:{y*PX:.0f}px;width:{w*PX:.0f}px;'
                    f'height:{h*PX:.0f}px;border:2px dashed #3FA672;background:#3FA67222;'
                    f'color:#1E4D3B;font:bold 15px sans-serif;display:flex;align-items:center;'
                    f'justify-content:center">[ native chart ]</div>')
            continue
        if sp.localName == 'pic':
            g = geom(sp)
            if g:
                x, y, w, h = g
                blip = sp.getElementsByTagNameNS(A, 'blip')
                src = imgs.get(blip[0].getAttribute('r:embed')) if blip else None
                if src:
                    out.append(
                        f'<img src="{src}" style="position:absolute;left:{x*PX:.0f}px;'
                        f'top:{y*PX:.0f}px;width:{w*PX:.0f}px;height:{h*PX:.0f}px;'
                        f'object-fit:fill;filter:drop-shadow(0 4px 14px rgba(0,0,0,.35))">')
                else:
                    out.append(
                        f'<div class="t" style="left:{x*PX:.0f}px;top:{y*PX:.0f}px;'
                        f'width:{w*PX:.0f}px;height:{h*PX:.0f}px;border:2px solid #E8B84B"></div>')
            continue
        if sp.localName != 'sp':
            continue
        g = geom(sp)
        if not g:
            continue
        x, y, w, h = g

        prst = descend(sp, 'spPr', 'prstGeom')
        shape = prst.getAttribute('prst') if prst is not None else 'rect'
        fill = solid_color(descend(sp, 'spPr', 'solidFill'))
        ln = descend(sp, 'spPr', 'ln')
        lnc = solid_color(ln)
        # transparency 100% is written as an alpha child under the fill
        alpha = descend(sp, 'spPr', 'solidFill')
        transparent = bool(alpha and alpha.getElementsByTagNameNS(A, 'alpha'))

        radius = '999px' if shape == 'ellipse' else ('14px' if 'round' in shape.lower() else '0')
        css = (f'left:{x*PX:.0f}px;top:{y*PX:.0f}px;width:{w*PX:.0f}px;height:{h*PX:.0f}px;'
               f'border-radius:{radius};box-sizing:border-box;')
        if fill and not transparent:
            css += f'background:#{fill};'
        if lnc:
            css += f'border:2px solid #{lnc};'
        out.append(f'<div class="t" style="{css}"></div>')

        tx = child(sp, 'txBody')
        if tx is None:
            continue
        paras = []
        align = 'left'
        bodypr = child(tx, 'bodyPr')
        anchor = bodypr.getAttribute('anchor') if bodypr is not None else ''
        just = {'ctr': 'center', 'b': 'flex-end'}.get(anchor, 'flex-start')
        for p in tx.childNodes:
            if p.nodeType != 1 or p.localName != 'p':
                continue
            ppr = child(p, 'pPr')
            if ppr is not None and ppr.getAttribute('algn'):
                align = {'ctr': 'center', 'r': 'right'}.get(ppr.getAttribute('algn'), 'left')
            runs = []
            for r in p.childNodes:
                if r.nodeType != 1 or r.localName != 'r':
                    continue
                rpr = child(r, 'rPr')
                t = child(r, 't')
                txt = html.escape(t.firstChild.nodeValue) if (t and t.firstChild) else ''
                st = ''
                if rpr is not None:
                    sz = rpr.getAttribute('sz')
                    if sz:
                        st += f'font-size:{int(sz)/100:.1f}pt;'
                    if rpr.getAttribute('b') == '1':
                        st += 'font-weight:700;'
                    if rpr.getAttribute('i') == '1':
                        st += 'font-style:italic;'
                    c = solid_color(child(rpr, 'solidFill'))
                    if c:
                        st += f'color:#{c};'
                    lat = child(rpr, 'latin')
                    if lat is not None and lat.getAttribute('typeface'):
                        face = lat.getAttribute('typeface')
                        st += f'font-family:{face},Carlito,Caladea,serif;'
                runs.append(f'<span style="{st}">{txt}</span>')
            paras.append('<div>' + (''.join(runs) or '&nbsp;') + '</div>')
        if paras:
            out.append(
                f'<div class="t" style="left:{x*PX:.0f}px;top:{y*PX:.0f}px;width:{w*PX:.0f}px;'
                f'height:{h*PX:.0f}px;text-align:{align};padding:2px;box-sizing:border-box;'
                f'display:flex;flex-direction:column;justify-content:{just};'
                f'line-height:1.25">' + ''.join(paras) + '</div>')
    out.append('</div>')

open('preview.html', 'w').write('\n'.join(out))
print('wrote preview.html —', len(slides), 'slides')
