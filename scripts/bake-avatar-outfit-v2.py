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
ALPHA_MIN = 16
# The face stays owned by the approved base. Garment coverage starts immediately
# below this rectangle; do not erase neck/shoulder garment pixels after baking.
FACE_KEEP_OUT = (104, 48, 153, 96)
TORSO_Y0 = 97
TORSO_Y1 = 158
TORSO_MARGIN_X = 3
TORSO_MARGIN_Y = 2


def alpha(img: Image.Image):
    return img.getchannel("A")


def to_master(img: Image.Image) -> Image.Image:
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
            if px[x, y] > ALPHA_MIN:
                c += 1
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
    a = alpha(img)
    px = a.load()
    x0 = max(0, body_x - BODY_HALF_SCAN)
    x1 = min(MASTER - 1, body_x + BODY_HALF_SCAN)
    for y in range(MASTER - 1, 70, -1):
        hits = sum(1 for x in range(x0, x1 + 1) if px[x, y] > ALPHA_MIN)
        if hits >= 3:
            return y
    raise RuntimeError("could not locate dense foot row")


def approved_bases():
    rows = []
    images = []
    for path in BASE_FILES:
        if not path.exists():
            raise RuntimeError(f"missing approved base: {path}")
        base = to_master(Image.open(path))
        body_x = dense_body_center(base)
        foot_y = body_foot_y(base, body_x)
        rows.append((path.name, body_x, foot_y))
        images.append(base)
    xs = [row[1] for row in rows]
    feet = [row[2] for row in rows]
    if max(xs) - min(xs) > 4:
        raise RuntimeError(f"approved bases disagree on body center: {rows}")
    if max(feet) - min(feet) > 4:
        raise RuntimeError(f"approved bases disagree on foot line: {rows}")
    target_x = round(median(xs))
    target_foot_y = round(median(feet))
    print(f"approved base anchor: rows={rows}, targetX={target_x}, targetFootY={target_foot_y}")
    return images, target_x, target_foot_y


def translate(img: Image.Image, dx: int, dy: int) -> Image.Image:
    out = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
    out.alpha_composite(img, (dx, dy))
    return out


def expand_body_cover(img: Image.Image, target_foot_y: int, radius: int = BODY_EXPAND_RADIUS) -> Image.Image:
    src = img.copy()
    out = img.copy()
    sp = src.load()
    op = out.load()
    x0, x1 = 70, 186
    y0, y1 = TORSO_Y0, target_foot_y
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if sp[x, y][3] > ALPHA_MIN:
                continue
            best = None
            best_d = 999
            for yy in range(max(y0, y - radius), min(y1, y + radius) + 1):
                for xx in range(max(x0, x - radius), min(x1, x + radius) + 1):
                    p = sp[xx, yy]
                    if p[3] <= ALPHA_MIN:
                        continue
                    d = abs(xx - x) + abs(yy - y)
                    if d < best_d:
                        best_d = d
                        best = p
            if best is not None:
                op[x, y] = best
    return out


def nearest_garment_pixel(src: Image.Image, x: int, y: int, max_radius: int = 18):
    p = src.load()
    for radius in range(1, max_radius + 1):
        best = None
        best_d = 999
        for yy in range(max(TORSO_Y0, y - radius), min(TORSO_Y1, y + radius) + 1):
            for xx in range(max(0, x - radius), min(MASTER - 1, x + radius) + 1):
                rgba = p[xx, yy]
                if rgba[3] <= ALPHA_MIN:
                    continue
                d = abs(xx - x) + abs(yy - y)
                if d < best_d:
                    best_d = d
                    best = rgba
        if best is not None:
            return best
    return None


def cover_base_torso(outfit: Image.Image, bases) -> Image.Image:
    """Guarantee that approved base clothing cannot show through the one-piece outfit.

    Build the required torso mask from the real boy+girl alpha silhouettes. Only
    missing pixels inside that shared torso region are filled, using the nearest
    garment colour. Face/head pixels are excluded, weapons/capes are untouched,
    and the complete image is never translated or scaled here.
    """
    src = outfit.copy()
    out = outfit.copy()
    op = out.load()
    base_alpha = [alpha(base).load() for base in bases]
    fx0, fy0, fx1, fy1 = FACE_KEEP_OUT
    filled = 0
    for y in range(TORSO_Y0, TORSO_Y1 + 1):
        for x in range(MASTER):
            if fx0 <= x <= fx1 and fy0 <= y <= fy1:
                continue
            required = any(pa[x, y] > ALPHA_MIN for pa in base_alpha)
            if not required or op[x, y][3] > ALPHA_MIN:
                continue
            # Small margins around the actual base silhouette prevent white seams
            # caused by antialiasing without widening the whole costume.
            garment = nearest_garment_pixel(src, x, y)
            if garment is not None:
                op[x, y] = garment
                filled += 1
    # Seal a tiny antialias margin around pixels that were required by the base.
    sealed = out.copy()
    sp = out.load()
    qp = sealed.load()
    for y in range(TORSO_Y0, TORSO_Y1 + 1):
        for x in range(MASTER):
            if sp[x, y][3] > ALPHA_MIN:
                continue
            near_base = False
            for yy in range(max(TORSO_Y0, y - TORSO_MARGIN_Y), min(TORSO_Y1, y + TORSO_MARGIN_Y) + 1):
                for xx in range(max(0, x - TORSO_MARGIN_X), min(MASTER - 1, x + TORSO_MARGIN_X) + 1):
                    if any(pa[xx, yy] > ALPHA_MIN for pa in base_alpha):
                        near_base = True
                        break
                if near_base:
                    break
            if not near_base:
                continue
            garment = nearest_garment_pixel(out, x, y, max_radius=8)
            if garment is not None:
                qp[x, y] = garment
    print(f"torso cover filled={filled}")
    return sealed


def protect_face(img: Image.Image) -> Image.Image:
    out = img.copy()
    p = out.load()
    x0, y0, x1, y1 = FACE_KEEP_OUT
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            p[x, y] = (0, 0, 0, 0)
    return out


def bake(path: Path, bases, target_body_x: int, target_foot_y: int):
    img = Image.open(path).convert("RGBA")
    if img.size != (MASTER, MASTER):
        raise RuntimeError(f"{path.name}: expected 256x256, got {img.size}")
    body_x = dense_body_center(img)
    foot_y = body_foot_y(img, body_x)
    dx = target_body_x - body_x
    dy = target_foot_y - foot_y
    if abs(dx) > 36 or abs(dy) > 48:
        raise RuntimeError(f"{path.name}: source outside migration tolerance dx={dx}, dy={dy}")
    baked = translate(img, dx, dy)
    baked = expand_body_cover(baked, target_foot_y)
    baked = cover_base_torso(baked, bases)
    baked = protect_face(baked)
    baked.save(path, "PNG", optimize=True)
    print(f"{path.name}: bodyX {body_x}->{target_body_x}, footY {foot_y}->{target_foot_y}, dx={dx}, dy={dy}")


def main():
    bases, target_body_x, target_foot_y = approved_bases()
    for name in FILES:
        bake(OUTFIT_DIR / name, bases, target_body_x, target_foot_y)


if __name__ == "__main__":
    main()
