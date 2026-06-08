"""Extract hero assets and CSS positions from Canva PPTX export."""
from __future__ import annotations

import json
import shutil
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

ROOT = Path(__file__).resolve().parents[1]
PPTX = Path(r"c:\Users\lett\Downloads\Letticia & João (1).pptx")
TMP = ROOT / ".tmp-pptx-new"
OUT = ROOT / "public/scrapbook/canva/hero"

ASSET_MAP = {
    "image1.jpeg": "bg-texture.jpeg",
    "image2.png": "ribbon-bottom.png",
    "image3.jpeg": "couple-photo.jpeg",
    "image4.png": "gold-frame.png",
    "image5.png": "floral-sticker.png",
    "image6.svg": "floral-sticker.svg",
}


def pct(x: float, y: float, w: float, h: float, sw: float, sh: float) -> dict:
    return {
        "left": round(x / sw * 100, 2),
        "top": round(y / sh * 100, 2),
        "width": round(w / sw * 100, 2),
        "height": round(h / sh * 100, 2),
    }


def parse_xfrm(xfrm) -> dict:
    off = xfrm.find("a:off", NS)
    ext = xfrm.find("a:ext", NS)
    rot = xfrm.get("rot", "0")
    return {
        "x": int(off.get("x", 0)),
        "y": int(off.get("y", 0)),
        "w": int(ext.get("cx", 0)),
        "h": int(ext.get("cy", 0)),
        "rot": int(rot),
    }


def abs_group_child(grp: dict, child: dict) -> dict:
    sx = grp["w"] / grp["ch_w"] if grp["ch_w"] else 1
    sy = grp["h"] / grp["ch_h"] if grp["ch_h"] else 1
    return {
        "x": grp["x"] + child["x"] * sx,
        "y": grp["y"] + child["y"] * sy,
        "w": child["w"] * sx,
        "h": child["h"] * sy,
        "rot": child["rot"],
    }


def path_to_d(path_el) -> str:
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
            parts.append("C " + " ".join(f"{pt.get('x')} {pt.get('y')}" for pt in pts[:3]))
        elif tag == "close":
            parts.append("Z")
    return " ".join(parts)


def extract_envelope_svgs(slide_xml: Path) -> None:
    root = ET.parse(slide_xml).getroot()
    for sp in root.iter("{http://schemas.openxmlformats.org/presentationml/2006/main}sp"):
        nv = sp.find("p:nvSpPr/p:cNvPr", NS)
        if nv is None:
            continue
        shape_id = nv.get("id")
        if shape_id not in ("5", "6"):
            continue
        path_el = sp.find(".//a:path", NS)
        if path_el is None:
            continue
        w, h = path_el.get("w"), path_el.get("h")
        d = path_to_d(path_el)
        name = "photo-clip" if shape_id == "5" else "envelope-frame"
        fill = "none" if shape_id == "5" else "#AD731C"
        target = OUT / f"{name}.svg"
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="{fill}" fill-rule="evenodd">
  <path d="{d}"/>
</svg>"""
        target.write_text(svg, encoding="utf-8")
        print(f"Wrote {target.name}")


def main() -> None:
    if not PPTX.exists():
        print(f"PPTX not found: {PPTX}", file=sys.stderr)
        sys.exit(1)

    if TMP.exists():
        shutil.rmtree(TMP)
    TMP.mkdir(parents=True)
    with zipfile.ZipFile(PPTX) as zf:
        zf.extractall(TMP)

    slide = TMP / "ppt/slides/slide1.xml"
    pres = ET.parse(TMP / "ppt/presentation.xml").getroot()
    sld_sz = pres.find("p:sldSz", NS)
    sw = int(sld_sz.get("cx"))
    sh = int(sld_sz.get("cy"))

    root = ET.parse(slide).getroot()
    layout: dict = {"slide": {"width": sw, "height": sh}, "layers": {}}
    bottom = 0

    for node in root.findall(".//p:spTree/*", NS):
        tag = node.tag.split("}")[-1]
        if tag == "sp":
            nv = node.find("p:nvSpPr/p:cNvPr", NS)
            name = nv.get("name", "") if nv is not None else ""
            sid = nv.get("id") if nv is not None else "?"
            xfrm = node.find("p:spPr/a:xfrm", NS)
            if xfrm is None:
                continue
            box = parse_xfrm(xfrm)
            bottom = max(bottom, box["y"] + box["h"])
            key = name.lower().replace(" ", "-")
            layout["layers"][key] = {**pct(box["x"], box["y"], box["w"], box["h"], sw, sh), "rot": box["rot"] / 60000}
        elif tag == "grpSp":
            nv = node.find("p:nvGrpSpPr/p:cNvPr", NS)
            gname = nv.get("name", "group") if nv is not None else "group"
            gxfrm = node.find("p:grpSpPr/a:xfrm", NS)
            goff = gxfrm.find("a:off", NS)
            gext = gxfrm.find("a:ext", NS)
            ch_off = gxfrm.find("a:chOff", NS)
            ch_ext = gxfrm.find("a:chExt", NS)
            grp = {
                "x": int(goff.get("x", 0)),
                "y": int(goff.get("y", 0)),
                "w": int(gext.get("cx", 0)),
                "h": int(gext.get("cy", 0)),
                "ch_w": int(ch_ext.get("cx", 1)),
                "ch_h": int(ch_ext.get("cy", 1)),
            }
            for sp in node.findall("p:sp", NS):
                nv = sp.find("p:nvSpPr/p:cNvPr", NS)
                sid = nv.get("id") if nv is not None else "?"
                xfrm = sp.find("p:spPr/a:xfrm", NS)
                child = parse_xfrm(xfrm)
                abs_box = abs_group_child(grp, child)
                bottom = max(bottom, abs_box["y"] + abs_box["h"])
                if sid == "5":
                    layout["layers"]["envelope-photo"] = pct(abs_box["x"], abs_box["y"], abs_box["w"], abs_box["h"], sw, sh)
                elif sid == "6":
                    layout["layers"]["envelope-frame-bounds"] = pct(abs_box["x"], abs_box["y"], abs_box["w"], abs_box["h"], sw, sh)

    layout["viewport"] = {
        "width": sw,
        "height": int(bottom + sh * 0.02),
        "height_pct": round((bottom + sh * 0.02) / sh * 100, 2),
    }

    OUT.mkdir(parents=True, exist_ok=True)
    media = TMP / "ppt/media"
    for src, dst in ASSET_MAP.items():
        shutil.copy2(media / src, OUT / dst)
        print(f"Copied {src} -> {dst}")

    extract_envelope_svgs(slide)
    (OUT / "layout.json").write_text(json.dumps(layout, indent=2), encoding="utf-8")
    print(json.dumps(layout, indent=2))


if __name__ == "__main__":
    main()
