from pathlib import Path
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
TARGET_BODY_X = 128
TARGET_FOOT_Y = 237
# Production outfits own the body and neckline; the approved base owns only
# the face/head opening.  Clearing through Y=96 erased eight rows of authored
# collars after the fixed -8 anchor translation and created a visible gap.
FACE_KEEP_OUT = (104, 48, 153, 88)


def alpha(img: Image.Image):
    return img.getchannel("A")


def to_master(img: Image.Image) -> Image.Image:
    if img.size == (MASTER, MASTER):
        return img.convert("RGBA")
    return img.convert("RGBA").resize((MASTER, MASTER), Image.Resampling.NEAREST)


def visible_foot_y(img: Image.Image) -> int:
    bbox = alpha(img).getbbox()
    if not bbox:
        raise RuntimeError("could not locate visible outfit pixels")
    return bbox[3] - 1


def approved_bases():
    rows = []
    for path in BASE_FILES:
        if not path.exists():
            raise RuntimeError(f"missing approved base: {path}")
        base = to_master(Image.open(path))
        foot_y = visible_foot_y(base)
        rows.append((path.name, foot_y))
    feet = [row[1] for row in rows]
    if max(feet) - min(feet) > 4:
        raise RuntimeError(f"approved bases disagree on foot line: {rows}")
    if any(abs(foot - TARGET_FOOT_Y) > 1 for foot in feet):
        raise RuntimeError(f"approved bases disagree with foot anchor {TARGET_FOOT_Y}: {rows}")
    print(f"approved base anchor: rows={rows}, targetX={TARGET_BODY_X}, targetFootY={TARGET_FOOT_Y}")
    return TARGET_FOOT_Y


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


def bake(path: Path, target_foot_y: int):
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
    foot_y = visible_foot_y(img)
    # The approved source art is already authored around body X=128.  Swords,
    # staffs, bows and capes are deliberately asymmetric, so alpha-derived X
    # centering would move the body differently for every outfit.
    dx = 0
    dy = target_foot_y - foot_y
    if abs(dx) > 36 or abs(dy) > 48:
        raise RuntimeError(f"{path.name}: source outside migration tolerance dx={dx}, dy={dy}")
    baked = translate(img, dx, dy)
    baked = protect_face(baked)
    baked.save(path, "PNG", optimize=True)
    print(f"{path.name}: bodyX 128->128, footY {foot_y}->{target_foot_y}, dx={dx}, dy={dy}")


def main():
    target_foot_y = approved_bases()
    for name in FILES:
        bake(OUTFIT_DIR / name, target_foot_y)


if __name__ == "__main__":
    main()
