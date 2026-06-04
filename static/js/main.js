// ===================================================
// ALKI Companion — Day 2: Sprite Swap + Chat Logic
// ===================================================

// Connect to the Flask-SocketIO Server
const socket = io();

// ─── Sprite Map ───
// Maps emotion names to their corresponding PNG files
const sprites = {
    idle:      '/static/sprites/idle.png',
    neutral:   '/static/sprites/neutral.png',
    happy:     '/static/sprites/happy.png',
    sad:       '/static/sprites/sad.png',
    surprised: '/static/sprites/surprised.png'
};

// ─── DOM Elements ───
const characterImg  = document.getElementById('character');
const chatText      = document.getElementById('chat-text');
const chatInput     = document.getElementById('chat-input');
const sendBtn       = document.getElementById('send-btn');
const emotionBadge  = document.getElementById('emotion-badge');

// ─── Current State ───
let currentEmotion = 'neutral';

// ─── Sprite Swap Function ───
function setEmotion(emotion) {
    const spriteUrl = sprites[emotion] || sprites.neutral;
    
    if (currentEmotion === emotion) return; // No change needed
    currentEmotion = emotion;
    
    // Add swapping class for fade transition
    characterImg.classList.add('swapping');
    
    setTimeout(() => {
        characterImg.src = spriteUrl;
        characterImg.alt = `ALKI — ${emotion}`;
        characterImg.classList.remove('swapping');
    }, 150); // Match the CSS transition duration
    
    // Update emotion badge
    emotionBadge.textContent = emotion;
    emotionBadge.className = 'emotion-badge ' + emotion;
    
    console.log(`Sprite swapped to: ${emotion}`);
}

// ─── Socket.IO Event Handlers ───

socket.on('connect', () => {
    console.log('Successfully connected to ALKI server!');
    chatText.innerText = "Connection established. Ready!";
});

socket.on('server_response', (msg) => {
    console.log('Server says:', msg.data);
});

// Listen for emotion updates from the backend
socket.on('emotion_update', (data) => {
    const newEmotion = data.emotion;
    console.log('Emotion changed to:', newEmotion);
    
    // Update chat text
    chatText.innerText = `Mood: ${newEmotion}`;
    
    // Swap sprite
    setEmotion(newEmotion);
});

// ─── Chat Logic ───

function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;
    
    // Show user message
    chatText.innerText = `You: ${text}`;
    chatInput.value = "";
    
    // Send to backend
    socket.emit('chat_message', { text: text });
}

sendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Receive ALKI's reply
socket.on('chat_reply', (data) => {
    console.log('ALKI replied:', data.text);
    chatText.innerText = data.text;
});
