"""Side by side: reference screenshot | your layout, same height, for a structure check.
python3 skills/astodesign/scripts/compare.py <reference.png> <layout.png> <out.png>
Compares structure (regions, density, hierarchy), not colour: your layout should look like the system, not the reference."""
import sys
from PIL import Image, ImageDraw

if len(sys.argv) != 4:
    sys.exit(__doc__)
ref, mine, out = sys.argv[1:]
a, b = Image.open(ref).convert('RGB'), Image.open(mine).convert('RGB')
def fit(im, h=1400):
    im = im.resize((1280, max(1, im.height * 1280 // im.width)))
    return im.crop((0, 0, 1280, min(im.height, h)))
a, b = fit(a), fit(b)
H = max(a.height, b.height) + 40
canvas = Image.new('RGB', (a.width + b.width + 24, H), (246, 240, 226))
canvas.paste(a, (0, 40)); canvas.paste(b, (a.width + 24, 40))
d = ImageDraw.Draw(canvas)
d.text((8, 12), 'REFERENCE (structure only)', fill=(31, 26, 23))
d.text((a.width + 32, 12), 'LAYOUT', fill=(31, 26, 23))
canvas.save(out)
print(f'wrote {out}')
