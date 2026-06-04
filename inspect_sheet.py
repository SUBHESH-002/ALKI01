"""
Inspect the Rei Ayanami sprite sheet by overlaying a coordinate grid.
This produces a grid_preview.png that shows pixel coordinates over the sheet.
"""
from PIL import Image, ImageDraw, ImageFont

sheet = Image.open("Sprites/Rei Ayanami.png")
w, h = sheet.size
print(f"Total size: {w} x {h} pixels")

# Draw a grid every 50px to help identify coordinates visually
draw = ImageDraw.Draw(sheet)
for x in range(0, w, 50):
    draw.line([(x, 0), (x, h)], fill=(255, 0, 0, 128), width=1)
    draw.text((x + 2, 2), str(x), fill=(255, 0, 0))
for y in range(0, h, 50):
    draw.line([(0, y), (w, y)], fill=(255, 0, 0, 128), width=1)
    draw.text((2, y + 2), str(y), fill=(255, 0, 0))

sheet.save("grid_preview.png")
print("Saved grid_preview.png — open it to read exact coordinates for cropping")
