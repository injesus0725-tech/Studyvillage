from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
LEGACY = ROOT / "assets" / "avatar-rpg"
RUNTIME = ROOT / "assets" / "avatar-runtime"
OUTPUT = RUNTIME / "production" / "bases"

VARIANTS = {
    "character-boy-02": "base-boy-v2.png",
    "character-boy-03": "base-boy-v2.png",
    "character-boy-04": "base-boy-v2.png",
    "character-boy-05": "base-boy-v2.png",
    "character-girl-02": "base-girl-v2.png",
    "character-girl-03": "base-girl-v2.png",
    "character-girl-04": "base-girl-v2.png",
    "character-girl-05": "base-girl-v2.png",
}

HEAD_SOCKET_Y = 89
HAIR_EXTENSION_Y = 132


def build_variant(variant_id: str, master_name: str) -> Image.Image:
    """Bake an approved legacy head onto the fixed production body.

    Everything above the shared head socket comes from the complete legacy head,
    so eyes/mouth are never reconstructed. Below it, only pixels outside the
    production body's alpha silhouette may extend (long hair/ponytail).
    """
    head = Image.open(LEGACY / f"{variant_id}.png").convert("RGBA")
    master = Image.open(RUNTIME / master_name).convert("RGBA")
    if head.size != (256, 256) or master.size != (256, 256):
        raise RuntimeError(f"{variant_id}: all production sources must be 256x256")
    out = master.copy()
    for y in range(HAIR_EXTENSION_Y):
        for x in range(256):
            pixel = head.getpixel((x, y))
            if pixel[3] == 0:
                if y < HEAD_SOCKET_Y:
                    out.putpixel((x, y), pixel)
                continue
            if y < HEAD_SOCKET_Y or master.getpixel((x, y))[3] == 0:
                out.putpixel((x, y), pixel)
    return out


def production_foot_y(image: Image.Image) -> int:
    return max(y for y in range(256) for x in range(256) if image.getpixel((x, y))[3] >= 32)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for variant_id, master_name in VARIANTS.items():
        output = build_variant(variant_id, master_name)
        foot_y = production_foot_y(output)
        if foot_y != 237:
            raise RuntimeError(f"{variant_id}: fixed foot anchor must be Y=237, got {foot_y}")
        output.save(OUTPUT / f"{variant_id}.png", "PNG", optimize=True)
        print(f"{variant_id}: 256x256, center X=128, foot Y=237, head socket Y={HEAD_SOCKET_Y}")


if __name__ == "__main__":
    main()
