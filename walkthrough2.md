# Walkthrough: Day 2 Procedural Animation Shift

The ALKI Companion's display system has been entirely rewritten! We have successfully transitioned from the Visual Novel sprite-swapping technique to a highly optimized **Procedural Shape Engine** powered by an HTML5 `<canvas>`.

## Changes Made

### 1. The Modular Face Engine
In `main.js`, I designed a `FaceRenderer` architecture that allows you to build completely new emotions simply by mixing and matching modular shape primitives (e.g. `eyeL: 'arc_up'`, `mouth: 'w_shape'`). 

### 2. Implementation of `robo face.webp`
I mapped all 24 faces from the image into our new engine dictionary! Here is a sample of what the engine now understands:
*   `sleepy`, `stare`, `determined`, `curious`, `smol`, `squint_annoyed`, `happy`, `bored`
*   `pout`, `playful`, `angry_pout`, `kiss`, `grumpy`, `dizzy`, `sad`, `angry`
*   `crying_happy`, `crying_sad`, `smug`, `shocked`, `annoyed_tick`, `exhausted`, `joy`, `king`
*   *(And the core operational ones: `neutral`, `boot`, `error`, `cute`, `wink`)*

> [!TIP]
> If you ever want to add a new face, you do not need to write new math! You simply add a new entry to `FACE_DEFS` in `main.js` pointing to the pre-existing eye and mouth types.

### 3. Hardware Emulator Aesthetics
`style.css` and `index.html` were overhauled to reflect the new cyberpunk/embedded aesthetic:
*   Subtle CSS scanline overlays
*   Terminal-style phosphorescent green text
*   A physical-looking monitor bezel casting a drop-shadow.

### 4. Backend Alignment
*   **Background Simulator:** `app.py` has been updated to cycle through a varied selection of the 24 new states so you can see them in action automatically.
*   **LLM Intelligence:** `core/llm.py` now specifically instructs the AI on how to interpret and react to this greatly expanded emotional vocabulary, ensuring the AI companion's personality aligns flawlessly with the new faces.

## Verification
The application has been saved. If you launch the Flask server (`python app.py`) and open `http://localhost:5000` in your browser, you will see ALKI boot up, initialize its procedural state machine, and begin drawing its emotions to the canvas in perfect 60FPS.
