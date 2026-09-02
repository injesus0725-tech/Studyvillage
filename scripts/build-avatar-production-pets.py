from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "assets" / "avatar-runtime" / "production"
SOURCE_DIR = RUNTIME / "sources" / "pets"
OUTPUT_DIR = RUNTIME / "pets"
FILES = ["maltese.png", "toy-poodle.png", "corgi.png", "cheese-cat.png", "lop-rabbit.png", "baby-dragon.png"]
MASTER = 256
SCALE = 1.50
RIGHT_MARGIN = 16
BOTTOM_MARGIN = 8


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name in FILES:
        source = Image.open(SOURCE_DIR / name).convert("RGBA")
        box = source.getchannel("A").getbbox()
        if not box:
            raise RuntimeError(f"{name}: missing visible pet pixels")
        pet = source.crop(box)
        size = (round(pet.width * SCALE), round(pet.height * SCALE))
        pet = pet.resize(size, Image.Resampling.NEAREST)
        x = MASTER - RIGHT_MARGIN - pet.width
        y = MASTER - BOTTOM_MARGIN - pet.height
        output = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
        output.alpha_composite(pet, (x, y))
        output.save(OUTPUT_DIR / name, "PNG", optimize=True)
        print(f"{name}: {box[2]-box[0]}x{box[3]-box[1]} -> {pet.width}x{pet.height}, anchor=({x},{y})")


if __name__ == "__main__":
    main()
