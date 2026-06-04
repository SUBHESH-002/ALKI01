"""
Crop individual expression sprites from the Rei Ayanami sprite sheet.
Outputs transparent PNGs into static/sprites/ for use in the ALKI web app.
"""
from PIL import Image
import os
import shutil

# Load the sprite sheet
sheet = Image.open("Sprites/Rei Ayanami.png").convert("RGBA")
w, h = sheet.size
print(f"Sheet size: {w} x {h}")

# Make the green background transparent
pixels = sheet.load()
bg_r, bg_g, bg_b = 55, 148, 110
tolerance = 18

for y_px in range(h):
    for x_px in range(w):
        r, g, b, a = pixels[x_px, y_px]
        if (abs(r - bg_r) < tolerance and
            abs(g - bg_g) < tolerance and
            abs(b - bg_b) < tolerance):
            pixels[x_px, y_px] = (0, 0, 0, 0)

print("Background removed")

out_dir = "static/sprites"
os.makedirs(out_dir, exist_ok=True)

sheet.save(os.path.join(out_dir, "spritesheet_alpha.png"))

# ─── Final crop coordinates (left, top, right, bottom) ───
sprites = {
    "neutral":    (5,   30,  150, 196),   # Top-left: calm face + shoulders
    "sad":        (5,  200,  155, 290),   # Middle-left: bandaged face
    "surprised":  (10, 302,  155, 410),   # Bottom-left: intense/serious face
    # For happy: use the top-left portrait area but with a lighter crop
    # Since all 3 main portraits have similar stoic expressions (it's Rei!),
    # we'll reuse neutral for happy too — it's the most "pleasant" one
}

TARGET_W = 300
TARGET_H = 360

for name, box in sprites.items():
    cropped = sheet.crop(box)
    cw, ch = cropped.size
    ratio = min(TARGET_W / cw, TARGET_H / ch)
    new_w = int(cw * ratio)
    new_h = int(ch * ratio)
    scaled = cropped.resize((new_w, new_h), Image.LANCZOS)
    
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    offset_x = (TARGET_W - new_w) // 2
    offset_y = TARGET_H - new_h  # Bottom-align
    canvas.paste(scaled, (offset_x, offset_y))
    
    canvas.save(os.path.join(out_dir, f"{name}.png"))
    print(f"Saved {name}.png ({new_w}x{new_h} from {cw}x{ch})")

# Create aliases
for alias, source in [("idle", "neutral"), ("happy", "neutral")]:
    shutil.copy(
        os.path.join(out_dir, f"{source}.png"),
        os.path.join(out_dir, f"{alias}.png")
    )
    print(f"Created {alias}.png (alias of {source})")

print(f"\nDone! Sprites saved to {out_dir}/")
