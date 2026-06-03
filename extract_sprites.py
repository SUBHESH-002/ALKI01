import cv2
import numpy as np

img = cv2.imread('Sprites/Rei Ayanami.png', cv2.IMREAD_UNCHANGED)
bgr = img[:, :, :3]
bg_color = np.array([110, 148, 55])
mask = cv2.inRange(bgr, bg_color - 10, bg_color + 10)
mask_inv = cv2.bitwise_not(mask)
contours, _ = cv2.findContours(mask_inv, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

coords = []
for contour in contours:
    if cv2.contourArea(contour) > 10:
        x, y, w, h = cv2.boundingRect(contour)
        coords.append({'x': x, 'y': y, 'w': w, 'h': h})

for c in sorted(coords, key=lambda c: (c['y'] // 10, c['x'])):
    print(f"Sprite: X={c['x']}, Y={c['y']}, W={c['w']}, H={c['h']}")
