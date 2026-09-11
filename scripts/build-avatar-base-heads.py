from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "assets" / "avatar-runtime"
SOURCE_DIR = RUNTIME / "production" / "sources" / "bases"
FILES = ["base-boy-v2.png", "base-girl-v2.png"]
NECK_ROWS = {84: 0.48, 85: 0.58, 86: 0.62, 87: 0.58, 88: 0.46}


def face_skin_reference(img: Image.Image) -> tuple[int, int, int]:
    values = []
    for y in range(58, 74):
        for x in range(120, 137):
            r, g, b, a = img.getpixel((x, y))
            if a > 200 and r > 150 and g > 80:
                values.append((r, g, b))
    if len(values) < 100:
        raise RuntimeError("could not measure the base face skin reference")
    return tuple(round(sum(pixel[channel] for pixel in values) / len(values)) for channel in range(3))


def soften_neck_shadow(img: Image.Image) -> Image.Image:
    """Match the shared neck socket to the face while retaining edge shading."""
    out = img.copy()
    target = face_skin_reference(out)
    for y, row_strength in NECK_ROWS.items():
        for x in range(118, 139):
            r, g, b, a = out.getpixel((x, y))
            if a < 32:
                continue
            edge = min(1.0, (x - 117) / 4, (139 - x) / 4)
            strength = row_strength * max(0.25, edge)
            rgb = tuple(round(value * (1 - strength) + target[i] * strength) for i, value in enumerate((r, g, b)))
            out.putpixel((x, y), (*rgb, a))
    return out


def main() -> None:
    for name in FILES:
        source = Image.open(SOURCE_DIR / name).convert("RGBA")
        if source.size != (256, 256):
            raise RuntimeError(f"{name}: expected 256x256, got {source.size}")
        output = soften_neck_shadow(source)
        output.save(RUNTIME / name, "PNG", optimize=True)
        print(f"{name}: neck skin matched to face reference {face_skin_reference(source)}")


if __name__ == "__main__":
    main()
