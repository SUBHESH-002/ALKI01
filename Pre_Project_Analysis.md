# ALKI: Pre-Project Analysis & Technical Q&A

This document answers the core queries and technical questions to prepare for the development of the ALKI project.

---

## 1. Suggestions & Improvements Before Starting
While the 7-day roadmap is incredibly solid, here are a few architectural improvements to make ALKI smoother and more responsive on an old Android phone:

*   **Use WebSockets instead of Polling:** The original plan suggested having the front-end poll a Flask endpoint every 2 seconds for emotion updates. This can be laggy and drain the phone's battery. Instead, use **Socket.IO** (or pure WebSockets) so the backend can instantly *push* the emotion change to the frontend the millisecond it detects a smile.
*   **Keep the LLM Context Light:** When you pass the emotion state to the LLM (e.g., "The user is smiling"), do it as a system-level hidden instruction right before generation rather than stuffing the entire chat history. This saves tokens and keeps generation fast.
*   **Prevent Audio Overlap:** Make sure there's logic to stop the character from listening (Microphone mute) while the Text-to-Speech (TTS) is playing. Otherwise, ALKI might hear her own voice and try to reply to herself in an infinite loop!

## 2. Missing Details / Information Lacking
Before we write the first line of code, we need to decide on:
*   **Wake-word Engine:** How exactly will ALKI know you are talking to her without tapping the screen? The Web Speech API is good, but tools like **Picovoice Porcupine** are lightweight, offline, and run perfectly in Python on Termux for wake-word detection (e.g., "Hey Alki").
*   **Environmental Constraints:** MediaPipe (emotion detection) needs good lighting. If the phone is sitting on your desk at night, it might fail to see your face. We might need a fallback state if no face is detected (e.g., ALKI goes to "sleep" or idle mode).
*   **Asset Availability:** We need the actual character images before Day 2. We need to decide if we are downloading free assets from itch.io, drawing them, or generating them using AI (like Midjourney).

## 3. Pre-existing Models & Projects
There is a massive open-source community around AI companions. Here is what exists and what we can learn from them:

*   **Project AIRI / Neuro-sama clones:** These are AI VTubers that use local LLMs and Live2D avatars. *What to learn:* They use very strict system prompts to maintain the character's "lore" so they don't break character and act like ChatGPT. We must heavily prompt our LLM.
*   **Soul of Waifu / SillyTavern:** These are chat interfaces for roleplay. *What to learn:* They handle memory exceptionally well. They use a technique called "Vector Databases" (like ChromaDB) to store past memories and fetch them when relevant. We can use a simpler SQLite version for ALKI's Phase 5.
*   **OpenBlob / Clawd:** Desktop pets that live on the PC screen. *What to learn:* They use very simple pixel-art animations (idle, thinking, happy) which proves that you don't need complex 3D models to make a character feel alive.

## 4. Animation: Old Game Industry Techniques & Sprite Sheets
In the early days of game development (like Pokémon on GameBoy or old visual novels), memory was incredibly limited. Here is how they handled animations, which is exactly what we should do for ALKI's prototype:

### The "Visual Novel" Technique (Easiest)
Instead of full animation, you just have a static image of the character. You only animate two things:
1.  **Eyes:** Every 4-5 seconds, swap the eye graphic for a "closed" frame for 100 milliseconds to simulate a blink.
2.  **Mouth:** When TTS is playing audio, swap the mouth graphic rapidly between "open" and "closed" frames to simulate talking (flapping).
*This requires just a few image files layered on top of each other using CSS absolute positioning.*

### The "Sprite Sheet" Technique (Retro Style)
A sprite sheet is one single image file that contains a grid of every frame of animation. 
*   **How it works on the web:** You put the sprite sheet inside a small HTML `<div>` (like a window). You use CSS to rapidly shift the `background-position` of the image, showing one frame at a time. It works just like a physical flipbook.
*   **Tools for making Sprites:** 
    *   **Aseprite** (The industry standard for pixel art).
    *   **Piskel** (Free and runs in the browser).
    *   **AI Generators:** You can use AI tools like Scenario.com or Midjourney with prompts like *"pixel art character sprite sheet, idle animation grid, white background"* to generate a sheet, then cut it up.

### Suggestion for Phase 1
Skip the Sprite Sheets for Day 2. Just use 4 separate **GIFs** (Idle.gif, Happy.gif, Sad.gif, Talking.gif). In the browser, you just use Javascript to change the `<img src="...">` depending on the state. It takes 3 lines of code and gives you instant results!
