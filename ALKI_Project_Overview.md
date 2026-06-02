# 🌟 ALKI: Adaptive Learning Kinetic Intelligence

## 🤔 What is ALKI? (The Simple Version)
Imagine having a tiny, smart digital friend living inside your phone, kind of like a super-advanced Tamagotchi or a personal sidekick from a sci-fi movie! 

ALKI is an animated anime-style character that can:
*   **See you** through the phone's camera.
*   **Notice how you feel** (are you smiling? looking sad?).
*   **Listen to you** when you speak.
*   **Think** and remember things about you.
*   **Talk back** with a real voice and show different facial expressions.

Instead of a boring text chat, ALKI is a living character that sits on your desk, keeps you company, and adapts to your mood!

---

## 🧭 The 5 Ws and 1 How

*   **WHAT is it?** A personal AI companion featuring an animated character that reacts to your emotions and voice in real-time.
*   **WHY build it?** To give your old phone (an Infinix Hot 9 Pro) a cool new purpose instead of collecting dust. It's also an amazing project that combines art, AI, and coding into something you can actually interact with every day.
*   **WHERE will it live?** Everything runs on your phone! It acts as both the "computer" running the code and the "screen" displaying the character. It will sit on your desk in full-screen mode.
*   **WHEN will it be built?** The goal is to build the core prototype in just **7 Days**.
*   **HOW does it work?** By using the phone's camera and microphone to gather input, sending that to a smart AI brain, and displaying a web page with an animated character that speaks back.

---

## 🏗️ Architecture & Pipeline (How the Magic Happens)

Here is the step-by-step pipeline of how ALKI works, from the moment you look at it, to the moment it talks back.

1.  **📥 Input (Senses)**
    *   **Camera:** Looks at your face.
    *   **Microphone:** Listens for your voice or a "wake word" (like "Hey ALKI").
2.  **⚙️ Processing (Understanding)**
    *   **Emotion Detector:** Uses math and code to figure out if you are happy, sad, surprised, or neutral.
    *   **Speech-to-Text:** Turns your spoken words into text the computer can read.
3.  **🧠 The Brain (Thinking)**
    *   **LLM (Large Language Model):** This is the AI's brain (like Claude or Gemini). We send it what you said, plus how you are feeling (e.g., "The user said 'Hello' and looks happy"). The brain then comes up with a clever, caring, or funny response.
4.  **📤 Output (Reacting)**
    *   **Text-to-Speech (TTS):** Turns the brain's text response into a real spoken voice.
    *   **Animation:** Changes the character's expression (e.g., makes ALKI smile) and animates the mouth.
    *   **Screen:** Displays a text bubble with what ALKI is saying.

---

## 🧰 Tools & Tech Stack

To build ALKI, we will use these specific tools:

*   **Termux:** A magic app that lets you run real computer code (Linux) on your Android phone.
*   **Python:** The main programming language we will use. It's great for beginners and AI!
*   **Flask:** A tool in Python that lets us create a mini "website" that runs directly on the phone to display the character.
*   **MediaPipe / OpenCV:** The "eyes." These are code libraries that can detect faces and emotions through the camera.
*   **Vosk / Whisper:** The "ears." These tools turn spoken words into text.
*   **Claude API / Gemini API:** The "brain." These are super-smart AI services we talk to over the internet to generate ALKI's responses.
*   **Edge-TTS:** The "mouth." A tool that creates high-quality, anime-sounding voices from text.
*   **Live2D / GIFs:** The "body." The art and animations used to display ALKI on the screen.

---

## 📚 Things to Know & Learn

If you want to master this project, here are the skills you will pick up along the way:

1.  **Terminal Basics:** Learning how to type commands into Termux instead of clicking buttons. *(What to learn: basic Linux commands like `cd`, `ls`, `pkg install`)*.
2.  **Python Scripting:** Writing scripts that connect different pieces of technology together. *(What to learn: Python functions, loops, and APIs)*.
3.  **Web Basics (HTML/CSS):** Making the character look good on the phone screen. *(What to learn: How to center an image on a webpage and make a dark background)*.
4.  **Prompt Engineering:** Teaching the AI how to behave. *(What to learn: How to write a "System Prompt" that gives the AI a personality, a backstory, and rules to follow)*.

---

## 🗺️ The 7-Day Roadmap (Prototype Phase)

Here is your exact mission for the first week:

*   **Day 1 (The Stage):** Set up Termux on the phone. Install Python and Flask. Get a simple blank webpage to show up on the phone's browser.
*   **Day 2 (The Body):** Put a simple animated character (a GIF or sprite) on that webpage. Make it look like a real app.
*   **Day 3 (The Brain):** Connect the Claude/Gemini API. Add a text box so you can type to ALKI and she types back with personality.
*   **Day 4 (The Voice):** Add Text-to-Speech (Edge-TTS). Now, when ALKI replies, she speaks out loud!
*   **Day 5 (The Eyes):** Turn on the front camera using Python (MediaPipe). Make the code detect if you are smiling, sad, or neutral.
*   **Day 6 (The Soul):** Connect the emotions to ALKI! If the camera sees you smile, tell the AI brain you are happy, and make the character GIF change to a happy expression.
*   **Day 7 (The Polish):** Add a button to tap and speak (instead of typing). Clean up the design. Record a video of you talking to ALKI to show off your amazing work!

---

## 🚀 Future Phases (Leveling Up)

Once the 7-day prototype is done, ALKI can get even cooler over time:
*   **Memory:** Giving ALKI a database so she remembers your name and past conversations.
*   **Live2D Upgrades:** Using smooth, professional Vtuber-style animations instead of GIFs.
*   **100% Offline Mode:** Running a smaller AI brain entirely on the phone so it works without the internet!
*   **Facial Recognition:** Teaching ALKI to know the difference between you and your friends.
