from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTFIT_DIR = ROOT / "assets" / "avatar-runtime" / "production" / "outfits"
FILES = [
    "forest-archer.png",
    "moon-priest.png",
    "pirate-captain.png",
    "school-scientist.png",
    "silver-knight.png",
    "star-mage.png",
]

MASTER = 256
TARGET_BODY_X = 128
TARGET_FOOT_Y = 246
BODY_SCAN_Y0 = 108
BODY_SCAN_Y1 = 242
BODY_HALF_SCAN = 76
BODY_EXPAND_RADIUS = 2
FACE_KEEP_OUT = (104, 48, 153, 104)  # x0, y0, x1, y1; actual face remains visible


def alpha(img: Image.Image):
    return img.getchannel("A")


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
        return TARGET_BODY_X
    acc = 0
    half = total / 2
    for x, w in enumerate(weights):
        acc += w
        if acc >= half:
            return x
    return TARGET_BODY_X


def body_foot_y(img: Image.Image, body_x: int) -> int:
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
    return TARGET_FOOT_Y


def translate(img: Image.Image, dx: int, dy: int) -> Image.Image:
    out = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
    out.alpha_composite(img, (dx, dy))
    return out


def expand_body_cover(img: Image.Image, radius: int = BODY_EXPAND_RADIUS) -> Image.Image:
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
    y0, y1 = 100, TARGET_FOOT_Y
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


def bake(path: Path):
    img = Image.open(path).convert("RGBA")
    if img.size != (MASTER, MASTER):
        raise RuntimeError(f"{path.name}: expected 256x256, got {img.size}")

    body_x = dense_body_center(img)
    foot_y = body_foot_y(img, body_x)
    dx = TARGET_BODY_X - body_x
    dy = TARGET_FOOT_Y - foot_y

    # Clamp migration correction. If an old source is wildly malformed, fail QA
    # instead of silently shrinking/scaling the complete image.
    if abs(dx) > 28 or abs(dy) > 32:
        raise RuntimeError(f"{path.name}: source outside migration tolerance dx={dx}, dy={dy}")

    baked = translate(img, dx, dy)
    baked = expand_body_cover(baked)
    baked = protect_face(baked)
    baked.save(path, "PNG", optimize=True)
    print(f"{path.name}: bodyX {body_x}->{TARGET_BODY_X}, footY {foot_y}->{TARGET_FOOT_Y}, dx={dx}, dy={dy}")


def main():
    for name in FILES:
        bake(OUTFIT_DIR / name)


if __name__ == "__main__":
    main()
