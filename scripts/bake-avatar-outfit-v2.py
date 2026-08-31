from pathlib import Path
from statistics import median
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RUNTIME_DIR = ROOT / "assets" / "avatar-runtime"
OUTFIT_DIR = RUNTIME_DIR / "production" / "outfits"
BASE_FILES = [RUNTIME_DIR / "base-boy-v2.png", RUNTIME_DIR / "base-girl-v2.png"]
FILES = [
    "forest-archer.png",
    "moon-priest.png",
    "pirate-captain.png",
    "school-scientist.png",
    "silver-knight.png",
    "star-mage.png",
]

MASTER = 256
BODY_SCAN_Y0 = 108
BODY_SCAN_Y1 = 242
BODY_HALF_SCAN = 76
BODY_EXPAND_RADIUS = 2
# Keep only the actual face area transparent. The lower edge must stay above the
# shared neckline; the outfit itself owns the torso from the neckline downward.
FACE_KEEP_OUT = (104, 48, 153, 104)  # x0, y0, x1, y1


def alpha(img: Image.Image):
    return img.getchannel("A")


def to_master(img: Image.Image) -> Image.Image:
    """Map any approved base source to the exact runtime 256x256 coordinate space."""
    if img.size == (MASTER, MASTER):
        return img.convert("RGBA")
    return img.convert("RGBA").resize((MASTER, MASTER), Image.Resampling.NEAREST)


def dense_body_center(img: Image.Image) -> int:
    a = alpha(img)
    px = a.load()
    weights = []
    for x in range(MASTER):
        c = 0
        for y in range(BODY_SCAN_Y0, BODY_SCAN_Y1 + 1):
            if px[x, y] > 16:
                c += 1
        # Dense torso/leg columns dominate; thin weapons/capes do not.
        weights.append(c * c)
    total = sum(weights)
    if total <= 0:
        return MASTER // 2
    acc = 0
    half = total / 2
    for x, w in enumerate(weights):
        acc += w
        if acc >= half:
            return x
    return MASTER // 2


def body_foot_y(img: Image.Image, body_x: int) -> int:
    """Find the lowest dense row around the body, ignoring isolated decoration pixels."""
    a = alpha(img)
    px = a.load()
    x0 = max(0, body_x - BODY_HALF_SCAN)
    x1 = min(MASTER - 1, body_x + BODY_HALF_SCAN)
    for y in range(MASTER - 1, 70, -1):
        hits = 0
        for x in range(x0, x1 + 1):
            if px[x, y] > 16:
                hits += 1
        if hits >= 3:
            return y
    raise RuntimeError("could not locate dense foot row")


def approved_base_anchor():
    """Read the anchor from the actual approved free boy/girl bases.

    This is an OFFLINE production measurement, not runtime normalization. Runtime
    still draws every finished PNG at 0,0. Using the real base prevents a guessed
    foot line (the old hard-coded 246) from moving all costumes together.
    """
    rows = []
    for path in BASE_FILES:
        if not path.exists():
            raise RuntimeError(f"missing approved base: {path}")
        base = to_master(Image.open(path))
        body_x = dense_body_center(base)
        foot_y = body_foot_y(base, body_x)
        rows.append((path.name, body_x, foot_y))

    xs = [row[1] for row in rows]
    feet = [row[2] for row in rows]
    # Boy and girl bodies are required to share the same body/foot anchors. A
    # large disagreement means the bases themselves violate the production spec.
    if max(xs) - min(xs) > 4:
        raise RuntimeError(f"approved bases disagree on body center: {rows}")
    if max(feet) - min(feet) > 4:
        raise RuntimeError(f"approved bases disagree on foot line: {rows}")

    target_x = round(median(xs))
    target_foot_y = round(median(feet))
    print(f"approved base anchor: rows={rows}, targetX={target_x}, targetFootY={target_foot_y}")
    return target_x, target_foot_y


def translate(img: Image.Image, dx: int, dy: int) -> Image.Image:
    out = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
    out.alpha_composite(img, (dx, dy))
    return out


def expand_body_cover(img: Image.Image, target_foot_y: int, radius: int = BODY_EXPAND_RADIUS) -> Image.Image:
    """Thicken only the central garment zone so the free base clothing cannot peek out.

    This is deliberately NOT a whole-image scale. Side weapons, bows, capes and tall
    decorations remain where the artist placed them. New pixels copy the nearest
    opaque garment pixel, preserving the pixel-art edge instead of blurring it.
    """
    src = img.copy()
    out = img.copy()
    sp = src.load()
    op = out.load()
    x0, x1 = 70, 186
    y0, y1 = 100, target_foot_y
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if sp[x, y][3] > 16:
                continue
            best = None
            best_d = 999
            for yy in range(max(y0, y - radius), min(y1, y + radius) + 1):
                for xx in range(max(x0, x - radius), min(x1, x + radius) + 1):
                    p = sp[xx, yy]
                    if p[3] <= 16:
                        continue
                    d = abs(xx - x) + abs(yy - y)
                    if d < best_d:
                        best_d = d
                        best = p
            if best is not None:
                op[x, y] = best
    return out


def protect_face(img: Image.Image) -> Image.Image:
    out = img.copy()
    p = out.load()
    x0, y0, x1, y1 = FACE_KEEP_OUT
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            p[x, y] = (0, 0, 0, 0)
    return out


def bake(path: Path, target_body_x: int, target_foot_y: int):
    img = Image.open(path).convert("RGBA")
    if img.size != (MASTER, MASTER):
        raise RuntimeError(f"{path.name}: expected 256x256, got {img.size}")

    body_x = dense_body_center(img)
    foot_y = body_foot_y(img, body_x)
    dx = target_body_x - body_x
    dy = target_foot_y - foot_y

    # Translation only: no scale/crop. If a source is wildly malformed, fail QA
    # rather than hiding it with a runtime correction.
    if abs(dx) > 36 or abs(dy) > 48:
        raise RuntimeError(f"{path.name}: source outside migration tolerance dx={dx}, dy={dy}")

    baked = translate(img, dx, dy)
    baked = expand_body_cover(baked, target_foot_y)
    baked = protect_face(baked)
    baked.save(path, "PNG", optimize=True)
    print(
        f"{path.name}: bodyX {body_x}->{target_body_x}, "
        f"footY {foot_y}->{target_foot_y}, dx={dx}, dy={dy}"
    )


def main():
    target_body_x, target_foot_y = approved_base_anchor()
    for name in FILES:
        bake(OUTFIT_DIR / name, target_body_x, target_foot_y)


if __name__ == "__main__":
    main()
