import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
}

slide = Path(__file__).resolve().parents[1] / ".tmp-pptx-new/ppt/slides/slide1.xml"
out = Path(__file__).resolve().parents[1] / "public/scrapbook/canva/hero/envelope-frame.svg"

root = ET.parse(slide).getroot()


def path_to_d(path_el):
    parts = []
    for el in path_el:
        tag = el.tag.split("}")[-1]
        if tag == "moveTo":
            pt = el.find("a:pt", NS)
            parts.append(f"M {pt.get('x')} {pt.get('y')}")
        elif tag == "lnTo":
            pt = el.find("a:pt", NS)
            parts.append(f"L {pt.get('x')} {pt.get('y')}")
        elif tag == "cubicBezTo":
            pts = el.findall("a:pt", NS)
            parts.append(
                "C "
                + " ".join(f"{pt.get('x')} {pt.get('y')}" for pt in pts[:3])
            )
        elif tag == "close":
            parts.append("Z")
    return " ".join(parts)


for sp in root.iter("{http://schemas.openxmlformats.org/presentationml/2006/main}sp"):
    nv = sp.find("p:nvSpPr/p:cNvPr", NS)
    if nv is None:
        continue
    shape_id = nv.get("id")
    if shape_id not in ("5", "6"):
        continue
    path_el = sp.find(".//a:path", NS)
    w, h = path_el.get("w"), path_el.get("h")
    d = path_to_d(path_el)
    name = "photo-clip" if shape_id == "5" else "envelope-frame"
    target = out.parent / f"{name}.svg"
    fill = "none" if shape_id == "6" else "#AD731C"
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="{fill}" fill-rule="evenodd">
  <path d="{d}"/>
</svg>"""
    target.write_text(svg, encoding="utf-8")
    print(f"Wrote {target} ({len(svg)} bytes)")
