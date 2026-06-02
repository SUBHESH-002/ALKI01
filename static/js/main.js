// Connect to the Flask-SocketIO Server
const socket = io();

// DOM Elements
const character = document.getElementById('alki-character');
const emotionLabel = document.getElementById('emotion-label');
const chatText = document.getElementById('chat-text');

socket.on('connect', () => {
    console.log('Successfully connected to ALKI server!');
    chatText.innerText = "Connection established. Ready!";
});

socket.on('server_response', (msg) => {
    console.log('Server says:', msg.data);
});

// Listen for simulated emotion updates from the backend
socket.on('emotion_update', (data) => {
    const newEmotion = data.emotion;
    console.log('Emotion changed to:', newEmotion);
    
    // Update UI text
    chatText.innerText = `You look ${newEmotion}!`;

    // Swap the character image (Day 2 visual logic)
    // Make sure you have neutral.gif, happy.gif, sad.gif, and surprised.gif in your static/assets folder!
    character.src = `/static/assets/${newEmotion}.gif`;
});
