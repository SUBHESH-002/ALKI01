// Connect to the Flask-SocketIO Server
const socket = io();

// DOM Elements
const layerEyes = document.getElementById('layer-eyes');
const layerMouth = document.getElementById('layer-mouth');
const chatText = document.getElementById('chat-text');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

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

    // Swap the character features (Day 2 Paper Doll logic)
    const emotionMap = {
        'neutral': { eyes: '-3px -116px', mouth: '-3px -44px' },
        'happy': { eyes: '-3px -116px', mouth: '-3px -44px' }, // Needs proper mapping later!
        'sad': { eyes: '-3px -116px', mouth: '-3px -44px' }, // Needs proper mapping later!
        'surprised': { eyes: '-3px -116px', mouth: '-3px -44px' } // Needs proper mapping later!
    };
    
    if (emotionMap[newEmotion] && layerEyes && layerMouth) {
        layerEyes.style.backgroundPosition = emotionMap[newEmotion].eyes;
        layerMouth.style.backgroundPosition = emotionMap[newEmotion].mouth;
    }
});

// Chat Logic (Day 3)
function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;
    
    // Show user message briefly
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
