"""
Shrink and rename design artwork for the /portfolio Digital Design gallery.

Drop raw exports (any size, any name) into one of:
  public/portfolio/digital-design/graphic-design/
  public/portfolio/digital-design/web-design/

then run this. Each image is resized to at most 2000 px on its long edge,
saved as a progressive JPEG (WebP when it has transparency), and renamed to
kebab-case - "Remax Pen test 2@4x.png" becomes "remax-pen-test-2.jpg". The
raw file is deleted once the web copy has been written and re-opened, so
keep your full-size originals somewhere outside the repo.

Files already at web size with a clean name are left alone, so it is safe to
re-run. The gallery titles come from these filenames - name the file after
what it shows (client + subject) before running.

Usage:  python scripts/optimize-designs.py
"""

import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent / "public" / "portfolio" / "digital-design"
FOLDERS = ["graphic-design", "web-design"]
EXTS = {".png", ".jpg", ".jpeg", ".webp"}
MAX_EDGE = 2000
MAX_BYTES = 1_500_000
JPEG_QUALITY = 82
WEBP_QUALITY = 85

# Exports run to 100+ MB at @4x; Pillow's bomb guard would refuse them.
Image.MAX_IMAGE_PIXELS = None


def slugify(stem: str) -> str:
    stem = re.sub(r"@\d+(\.\d+)?x", " ", stem)  # drop "@4x" export suffixes
    stem = re.sub(r"[^a-z0-9]+", "-", stem.lower())
    return stem.strip("-") or "design"


def has_alpha(im: Image.Image) -> bool:
    if im.mode == "P":
        im = im.convert("RGBA")
    if im.mode not in ("RGBA", "LA"):
        return False
    return im.getchannel("A").getextrema()[0] < 255


def is_clean(path: Path) -> bool:
    """Already processed: slug name, web format, web size."""
    if path.stem != slugify(path.stem) or path.suffix not in (".jpg", ".webp"):
        return False
    if path.stat().st_size > MAX_BYTES:
        return False
    with Image.open(path) as im:
        return max(im.size) <= MAX_EDGE


def free_name(folder: Path, slug: str, ext: str, taken: set[Path], source: Path) -> Path:
    target, n = folder / f"{slug}{ext}", 2
    while target != source and (target in taken or target.exists()):
        target, n = folder / f"{slug}-{n}{ext}", n + 1
    return target


def optimize(path: Path, taken: set[Path]) -> Path:
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        alpha = has_alpha(im)
        ext = ".webp" if alpha else ".jpg"
        target = free_name(path.parent, slugify(path.stem), ext, taken, path)
        tmp = target.with_suffix(target.suffix + ".tmp")
        if alpha:
            im.convert("RGBA").save(tmp, "WEBP", quality=WEBP_QUALITY, method=6)
        else:
            if im.mode in ("RGBA", "LA", "P"):
                rgba = im.convert("RGBA")
                flat = Image.new("RGB", rgba.size, "white")
                flat.paste(rgba, mask=rgba.getchannel("A"))
                im = flat
            im.convert("RGB").save(
                tmp, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True
            )
    with Image.open(tmp) as check:
        check.verify()
    if path != target:
        path.unlink()
    tmp.replace(target)
    return target


def main() -> int:
    for name in FOLDERS:
        folder = ROOT / name
        folder.mkdir(parents=True, exist_ok=True)
        files = sorted(p for p in folder.iterdir() if p.suffix.lower() in EXTS)
        taken = set(files)
        for path in files:
            if is_clean(path):
                continue
            before = path.stat().st_size
            out = optimize(path, taken)
            taken.discard(path)
            taken.add(out)
            print(f"{name}/{path.name}  ->  {out.name}  ({before / 1e6:.1f} MB -> {out.stat().st_size / 1e6:.2f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
