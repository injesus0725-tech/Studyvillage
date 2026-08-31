from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "assets" / "avatar-runtime"
OUTFIT_DIR = RUNTIME / "production" / "outfits"
PREVIEW_DIR = RUNTIME / "production" / "shop-previews"
FILES = [
    "forest-archer.png",
    "moon-priest.png",
    "pirate-captain.png",
    "school-scientist.png",
    "silver-knight.png",
    "star-mage.png",
]
HEAD_BOTTOM = 97


def main() -> None:
    base = Image.open(RUNTIME / "base-boy-v2.png").convert("RGBA")
    head = base.copy()
    alpha = head.getchannel("A")
    alpha.paste(0, (0, HEAD_BOTTOM, 256, 256))
    head.putalpha(alpha)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

    for name in FILES:
        outfit = Image.open(OUTFIT_DIR / name).convert("RGBA")
        preview = Image.alpha_composite(head, outfit)
        preview.save(PREVIEW_DIR / name, "PNG", optimize=True)
        print(PREVIEW_DIR / name)


if __name__ == "__main__":
    main()
