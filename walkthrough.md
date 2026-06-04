# Day 2: Sprite Swap System — Walkthrough

## What Changed

Replaced the complex **paper doll compositing system** (Rem sprite sheet with layered eye/mouth overlays) with a simple **pre-composed PNG sprite swap** using the Rei Ayanami sprite sheet.

---

## Files Modified / Created

### Sprite Extraction
| File | Purpose |
|------|---------|
| [crop_sprites.py](file:///g:/My%20Drive/Projects/ALKI01/crop_sprites.py) | Extracts individual expression PNGs from the sprite sheet |
| [inspect_sheet.py](file:///g:/My%20Drive/Projects/ALKI01/inspect_sheet.py) | Overlays a coordinate grid for visually identifying crop regions |

### Extracted Sprites (in `static/sprites/`)
| Sprite | Expression | Source Region |
|--------|-----------|---------------|
| [neutral.png](file:///g:/My%20Drive/Projects/ALKI01/static/sprites/neutral.png) | Calm, default face | Top-left portrait |
| [sad.png](file:///g:/My%20Drive/Projects/ALKI01/static/sprites/sad.png) | Bandaged/hurt face | Middle-left portrait |
| [surprised.png](file:///g:/My%20Drive/Projects/ALKI01/static/sprites/surprised.png) | Intense/serious face | Bottom-left portrait |
| `happy.png` | Alias of neutral | (Rei doesn't smile much 😄) |
| `idle.png` | Alias of neutral | Default state |

### Web App Updates
| File | What Changed |
|------|-------------|
| [index.html](file:///g:/My%20Drive/Projects/ALKI01/templates/index.html) | Replaced `#alki-paperdoll` div layers with single `<img>` tag |
| [style.css](file:///g:/My%20Drive/Projects/ALKI01/static/css/style.css) | Removed paper doll styles, added character viewport + emotion badge + dark glassmorphism theme |
| [main.js](file:///g:/My%20Drive/Projects/ALKI01/static/js/main.js) | Replaced `backgroundPosition` swapping with `img.src` swapping via `setEmotion()` function |
| [app.py](file:///g:/My%20Drive/Projects/ALKI01/app.py) | Added `/test/<emotion>` route for manual testing |

---

## How It Works Now

```
Browser loads → neutral.png displayed
      ↓
Backend sends emotion_update via SocketIO
      ↓  
main.js setEmotion() → swaps img.src to matching PNG
      ↓
CSS transition fades between sprites (0.25s)
```

### Test Routes
Visit these URLs to manually trigger sprite swaps:
- `http://localhost:5000/test/neutral`
- `http://localhost:5000/test/happy`
- `http://localhost:5000/test/sad`
- `http://localhost:5000/test/surprised`

The background emotion simulator still runs every 10 seconds, cycling through all emotions automatically.

---

## How to Run on Phone (Termux)

```bash
# Clone the repo
cd ~
git clone https://github.com/SUBHESH-002/ALKI01.git
cd ALKI01

# Install deps (Pillow must be installed via pkg on Termux — pip build fails on ARM)
pkg install python-pillow
pip install flask flask-socketio requests

# (Optional) Re-run sprite extraction if needed
python crop_sprites.py

# Set your Gemini API key
export GEMINI_API_KEY="your_gemini_api_key_here"

# Run the server
python app.py
```

Then open `http://localhost:5000` in your phone browser.

---

## Next Steps
- Replace Rei sprites with a properly licensed character (VRoid Hub, itch.io free assets, or custom VRoid Studio creation)
- Add more distinct expressions if using a character with a wider emotion range
- Connect real facial emotion detection to drive the sprite swaps
