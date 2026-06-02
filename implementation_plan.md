# ALKI Implementation Plan

Build ALKI, a desktop AI companion running locally on an Android device (via Termux). ALKI uses the device camera for emotion detection, a wake-word engine for voice input, an LLM for intelligence, and TTS with simple sprite/GIF animations for output.

## User Review Required
> [!IMPORTANT]
> **Real-time WebSockets:** We are switching from the original HTTP polling idea to **Flask-SocketIO**. This means the Python backend will push emotion changes and voice triggers to the frontend instantly, saving battery and eliminating lag.
> **Wake-word Engine:** We will use **Picovoice Porcupine** instead of the browser's Web Speech API for the wake-word ("Hey Alki"). This requires a free AccessKey from the Picovoice console. Is that acceptable, or would you prefer to stick strictly to built-in browser APIs?
> **Animation Assets:** For Phase 1, we will use the **Visual Novel technique** (swapping GIFs or base images). We will need actual image/GIF files (e.g., `idle.gif`, `talking.gif`, `happy.gif`, `sad.gif`) to proceed with Day 2 execution.

## Proposed Architecture

We will structure the project into modular components so it is easy to maintain and expand later.

### Directory Structure
```text
ALKI/
├── app.py                 (Main Flask-SocketIO server)
├── requirements.txt       (Python dependencies)
├── core/                  (Backend logic modules)
│   ├── emotion.py         (OpenCV + MediaPipe face landmarker)
│   ├── llm.py             (Claude/Gemini API integration + Prompt logic)
│   └── audio.py           (Edge-TTS generation + Porcupine wake-word)
├── static/                (Frontend assets)
│   ├── css/style.css      (Fullscreen dark UI styling)
│   ├── js/main.js         (Socket.IO client, GIF swapping, TTS audio playback)
│   └── assets/            (Where we will put the GIFs and audio files)
└── templates/
    └── index.html         (The main companion screen)
```

## Revised 7-Day Roadmap (Execution Plan)

### Phase 1: Foundation (Days 1–2)
*   **Day 1 (Server & UI Boilerplate):** Set up the `app.py` Flask-SocketIO server. Create the fullscreen `index.html` UI with a dark background. Verify the server can push a test message to the browser via WebSockets.
*   **Day 2 (Visuals):** Implement the Javascript logic in `main.js` to swap character GIFs based on WebSocket events. Add placeholder GIFs for Idle, Happy, Sad, and Talking.

### Phase 2: Intelligence & Voice (Days 3–4)
*   **Day 3 (The Brain):** Implement `core/llm.py`. Draft the master system prompt defining ALKI's personality. Wire it to a WebSocket event so typing in the browser sends a message to the LLM, and pushes the text response back to the chat bubble.
*   **Day 4 (The Voice):** Implement `core/audio.py` using `edge-tts`. When the LLM generates a response, save it as a temporary MP3 file, and notify the frontend to play it and trigger the `talking.gif` animation. 

### Phase 3: Vision & Awareness (Days 5–6)
*   **Day 5 (Emotion Detection):** Implement `core/emotion.py` using OpenCV and MediaPipe. Run this as a background thread in `app.py`. Emit a WebSocket event (e.g., `{'emotion': 'happy'}`) whenever the user's expression changes.
*   **Day 6 (Behavioral Sync):** Connect the emotion state to the LLM system prompt (e.g., "The user is currently: sad"). Map the emotion WebSocket events to update the character GIF instantly on the frontend. Add logic to prevent the microphone from listening while TTS is playing.

### Phase 4: Polish (Day 7)
*   **Day 7 (Wake-word & Polish):** Integrate Picovoice Porcupine for the "Hey ALKI" wake-word. Clean up the UI, add an ambient glow based on emotion, and finalize the codebase for demo recording.

## Verification Plan

### Automated/Code Verification
*   **Backend:** We will write unit tests for the LLM response generation and the Emotion proxy logic (feeding a static image to verify MediaPipe output).
*   **WebSockets:** We will use a script to simulate WebSocket connections to ensure `app.py` handles push events correctly without blocking.

### Manual Verification
*   **Environment:** We will write a small script to test if the Termux environment can successfully access the Android Camera (`/dev/videoX`) and Microphone before building the full pipeline.
*   **UI Testing:** We will open `localhost:5000` on the Android browser and manually verify that fullscreen kiosk mode works and animations transition smoothly.
