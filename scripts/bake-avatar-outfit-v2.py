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
ALPHA_MIN = 16
# Production outfits own the body; the approved base owns the face/head opening.
FACE_KEEP_OUT = (104, 48, 153, 96)


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
    for path in BASE_FILES:
        if not path.exists():
            raise RuntimeError(f"missing approved base: {path}")
        base = to_master(Image.open(path))
        body_x = dense_body_center(base)
        foot_y = body_foot_y(base, body_x)
        rows.append((path.name, body_x, foot_y))
    xs = [row[1] for row in rows]
    feet = [row[2] for row in rows]
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


def protect_face(img: Image.Image) -> Image.Image:
    out = img.copy()
    p = out.load()
    x0, y0, x1, y1 = FACE_KEEP_OUT
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            p[x, y] = (0, 0, 0, 0)
    return out


def bake(path: Path, target_body_x: int, target_foot_y: int):
    """Anchor authored artwork only; never synthesize garment pixels.

    The previous migration pass copied nearest outfit colours into transparent
    pixels across the base torso silhouette. Re-running that pass on already
    baked PNGs progressively manufactured pale/grey body-shaped halos. A
    production bake must be idempotent: translate to the approved anchor and
    clear only the face opening. No dilation, nearest-colour fill, or base-mask
    sealing is permitted here.
    """
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
    baked = protect_face(baked)
    baked.save(path, "PNG", optimize=True)
    print(f"{path.name}: bodyX {body_x}->{target_body_x}, footY {foot_y}->{target_foot_y}, dx={dx}, dy={dy}")


def main():
    target_body_x, target_foot_y = approved_bases()
    for name in FILES:
        bake(OUTFIT_DIR / name, target_body_x, target_foot_y)


if __name__ == "__main__":
    main()
