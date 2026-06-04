// ===================================================
// ALKI Companion — Hardware Emulator UI (Canvas)
// ===================================================

const socket = io();

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const chatText = document.getElementById('chat-text');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const emotionBadge = document.getElementById('emotion-badge');

// --- Modular Face Rendering System ---
// This allows easy additions of new emotions by combining eye and mouth types.

const FACE_DEFS = {
    // Column 1
    'sleepy': { eyeL: 'line', eyeR: 'line', mouth: 'w_shape' },
    'stare': { eyeL: 'circle', eyeR: 'circle', mouth: 'line' },
    'determined': { eyeL: 'slash_fwd', eyeR: 'slash_back', mouth: 'w_shape' },
    'curious': { eyeL: 'circle_large', eyeR: 'circle_large', mouth: 'w_shape' },
    'smol': { eyeL: 'circle_small', eyeR: 'circle_small', mouth: 'w_shape' },
    'squint_annoyed': { eyeL: 'angle_in', eyeR: 'angle_in', mouth: 'x_shape' },
    'happy': { eyeL: 'arc_up', eyeR: 'arc_up', mouth: 'line' }, // simplified ^_^
    'bored': { eyeL: 'line', eyeR: 'line', mouth: 'diagonal' },

    // Column 2
    'pout': { eyeL: 'line', eyeR: 'line', mouth: '3_shape' },
    'playful': { eyeL: 'arc_up', eyeR: 'arc_up', mouth: 'w_tongue' },
    'angry_pout': { eyeL: 'slash_fwd', eyeR: 'slash_back', mouth: '3_shape' },
    'kiss': { eyeL: 'circle_large', eyeR: 'circle_large', mouth: '3_shape' },
    'grumpy': { eyeL: 'arc_down', eyeR: 'arc_down', mouth: 'line' },
    'dizzy': { eyeL: 'spiral', eyeR: 'spiral', mouth: 'squiggly' },
    'sad': { eyeL: 'line_vert', eyeR: 'line_vert', mouth: 'line', tears: true },
    'angry': { eyeL: 'angle_in', eyeR: 'angle_in', mouth: 'triangle' },

    // Column 3
    'crying_happy': { eyeL: 'arc_up', eyeR: 'arc_up', mouth: 'o_shape', tears: true },
    'crying_sad': { eyeL: 'arc_down', eyeR: 'arc_down', mouth: 'line', tears: true },
    'smug': { eyeL: 'arc_down', eyeR: 'arc_down', mouth: 'w_shape' },
    'shocked': { eyeL: 'circle', eyeR: 'circle', mouth: 'triangle_large' },
    'annoyed_tick': { eyeL: 'line', eyeR: 'line', mouth: 'line', tick: true },
    'exhausted': { eyeL: 'double_line', eyeR: 'double_line', mouth: 'line' },
    'joy': { eyeL: 'circle_small', eyeR: 'circle_small', mouth: 'u_shape' },
    'king': { eyeL: 'circle_small', eyeR: 'circle_small', mouth: 'crown' },

    // Core mapping
    'neutral': { eyeL: 'circle', eyeR: 'circle', mouth: 'line' },
    'cute': { eyeL: 'angle_in', eyeR: 'angle_in', mouth: 'w_shape' },
    'error': { eyeL: 'cross', eyeR: 'cross', mouth: 'squiggly' },
    'wink': { eyeL: 'arc_up', eyeR: 'circle', mouth: 'u_shape' },
};

function drawEye(ctx, type, cx, cy, scaleY, isLeft, time) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, scaleY);
    
    switch(type) {
        case 'circle':
            ctx.beginPath(); ctx.ellipse(0, 0, 15, 25, 0, 0, Math.PI * 2); ctx.fill(); break;
        case 'circle_large':
            ctx.beginPath(); ctx.ellipse(0, 0, 25, 25, 0, 0, Math.PI * 2); ctx.stroke(); break;
        case 'circle_small':
            ctx.beginPath(); ctx.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2); ctx.fill(); break;
        case 'line':
            ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke(); break;
        case 'double_line':
            ctx.beginPath(); ctx.moveTo(-20, -5); ctx.lineTo(20, -5); ctx.stroke(); 
            ctx.beginPath(); ctx.moveTo(-20, 5); ctx.lineTo(20, 5); ctx.stroke(); break;
        case 'line_vert':
            ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 20); ctx.stroke(); 
            // T_T roof
            ctx.beginPath(); ctx.moveTo(-15, -20); ctx.lineTo(15, -20); ctx.stroke(); break;
        case 'arc_up': // ^
            ctx.beginPath(); ctx.moveTo(-20, 10); ctx.quadraticCurveTo(0, -20, 20, 10); ctx.stroke(); break;
        case 'arc_down': // v
            ctx.beginPath(); ctx.moveTo(-20, -10); ctx.quadraticCurveTo(0, 20, 20, -10); ctx.stroke(); break;
        case 'slash_fwd': // \ for left, / for right ? Wait, left eye \ is slash_back
            if (isLeft) { ctx.beginPath(); ctx.moveTo(-20, -15); ctx.lineTo(20, 15); ctx.stroke(); }
            else { ctx.beginPath(); ctx.moveTo(-20, 15); ctx.lineTo(20, -15); ctx.stroke(); }
            break;
        case 'slash_back':
            if (isLeft) { ctx.beginPath(); ctx.moveTo(-20, 15); ctx.lineTo(20, -15); ctx.stroke(); }
            else { ctx.beginPath(); ctx.moveTo(-20, -15); ctx.lineTo(20, 15); ctx.stroke(); }
            break;
        case 'angle_in': // > < 
            if (isLeft) { ctx.beginPath(); ctx.moveTo(-20, -15); ctx.lineTo(10, 0); ctx.lineTo(-20, 15); ctx.stroke(); }
            else { ctx.beginPath(); ctx.moveTo(20, -15); ctx.lineTo(-10, 0); ctx.lineTo(20, 15); ctx.stroke(); }
            break;
        case 'cross': // X
            ctx.beginPath(); ctx.moveTo(-15, -15); ctx.lineTo(15, 15); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-15, 15); ctx.lineTo(15, -15); ctx.stroke(); break;
        case 'spiral':
            ctx.beginPath();
            for (let i = 0; i <= 20; i++) {
                const angle = i * 0.8 + time * 0.005;
                const radius = (i / 20) * 22;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke(); break;
    }
    ctx.restore();
}

function drawMouth(ctx, type, cx, cy, scaleY) {
    ctx.save();
    ctx.translate(cx, cy);
    // Mouths mostly don't scale with blink, but we can if we want
    
    switch(type) {
        case 'line':
            ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(25, 0); ctx.stroke(); break;
        case 'diagonal':
            ctx.beginPath(); ctx.moveTo(-20, 10); ctx.lineTo(20, -10); ctx.stroke(); break;
        case 'w_shape':
            ctx.beginPath();
            ctx.moveTo(-25, -10); ctx.quadraticCurveTo(-12, 15, 0, -5); ctx.quadraticCurveTo(12, 15, 25, -10);
            ctx.stroke(); break;
        case 'w_tongue':
            ctx.beginPath();
            ctx.moveTo(-25, -10); ctx.quadraticCurveTo(-12, 15, 0, -5); ctx.quadraticCurveTo(12, 15, 25, -10);
            ctx.stroke();
            // Tongue
            ctx.beginPath(); ctx.moveTo(-10, 5); ctx.lineTo(-10, 20); ctx.arc(0, 20, 10, Math.PI, 0, true); ctx.lineTo(10, 5); ctx.stroke();
            break;
        case '3_shape':
            ctx.beginPath();
            ctx.arc(0, -10, 10, -Math.PI/2, Math.PI/2);
            ctx.arc(0, 10, 10, -Math.PI/2, Math.PI/2);
            ctx.stroke(); break;
        case 'u_shape': // Smile
            ctx.beginPath(); ctx.arc(0, -10, 25, 0, Math.PI); ctx.stroke(); break;
        case 'o_shape': // Open / shocked
            ctx.beginPath(); ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI*2); ctx.stroke(); break;
        case 'triangle': // ^ shape
            ctx.beginPath(); ctx.moveTo(-15, 10); ctx.lineTo(0, -10); ctx.lineTo(15, 10); ctx.stroke(); break;
        case 'triangle_large': // A shape
            ctx.beginPath(); ctx.moveTo(-20, 15); ctx.lineTo(0, -20); ctx.lineTo(20, 15); ctx.closePath(); ctx.stroke(); break;
        case 'x_shape':
            ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(10, 10); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-10, 10); ctx.lineTo(10, -10); ctx.stroke(); break;
        case 'squiggly':
            ctx.beginPath(); ctx.moveTo(-30, 5); ctx.lineTo(-15, -10); ctx.lineTo(0, 5); ctx.lineTo(15, -10); ctx.lineTo(30, 5); ctx.stroke(); break;
        case 'crown': // oWo mouth / crown shape
            ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(-10, 10); ctx.lineTo(0, -5); ctx.lineTo(10, 10); ctx.lineTo(20, -10); ctx.stroke(); break;
    }
    ctx.restore();
}

function drawDecorations(ctx, def, time) {
    if (def.tears) {
        // Simple tear drops animating down
        const dropY = (time * 0.05) % 30;
        ctx.beginPath(); ctx.ellipse(90, 110 + dropY, 5, 10, 0, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(210, 110 + dropY, 5, 10, 0, 0, Math.PI*2); ctx.stroke();
    }
    if (def.tick) {
        // Annoyance tick mark
        ctx.beginPath();
        ctx.moveTo(240, 40); ctx.lineTo(260, 40); ctx.lineTo(260, 60); ctx.moveTo(250, 40); ctx.lineTo(250, 50); ctx.stroke();
    }
}

// --- Hardware Engine ---

let currentEmotion = 'boot';
let targetEmotion = 'neutral';
let blinkState = 1.0; 
let isBlinking = false;
let blinkSpeed = 0.25; 

const colorPhosphor = '#2ed573';
const colorBg = '#030803';

function renderFrame(time) {
    // Frame Buffer Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentEmotion === 'boot') return; // Blank screen while booting

    // Phosphor Style Setup
    ctx.strokeStyle = colorPhosphor;
    ctx.fillStyle = colorPhosphor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 12;
    ctx.shadowColor = colorPhosphor;

    const scaleY = Math.max(0.05, blinkState);
    const def = FACE_DEFS[currentEmotion] || FACE_DEFS['neutral'];

    // Draw
    drawEye(ctx, def.eyeL, 90, 80, scaleY, true, time);
    drawEye(ctx, def.eyeR, 210, 80, scaleY, false, time);
    drawMouth(ctx, def.mouth, 150, 150, 1.0);
    drawDecorations(ctx, def, time);
}

function hardwareLoop(timestamp) {
    // 1. State Machine
    if (isBlinking) {
        blinkState -= blinkSpeed;
        if (blinkState <= 0) {
            blinkState = 0;
            blinkSpeed = -blinkSpeed; // Reverse to open
            // Swap emotion while eyes are closed
            if (currentEmotion !== targetEmotion) {
                currentEmotion = targetEmotion;
                emotionBadge.textContent = `STATE: ${currentEmotion.toUpperCase()}`;
            }
        } else if (blinkState >= 1.0) {
            blinkState = 1.0;
            isBlinking = false;
            blinkSpeed = 0.25; 
        }
    } else {
        // Idle blink logic
        if (!['error', 'dizzy', 'crying_sad'].includes(currentEmotion)) {
            if (Math.random() < 0.005) { 
                isBlinking = true;
            }
        }
    }

    // 2. Render
    renderFrame(timestamp);
    requestAnimationFrame(hardwareLoop);
}

// --- Socket.IO Integration ---

socket.on('connect', () => {
    chatText.innerText = "System initialized. Waiting for command...";
    targetEmotion = 'neutral';
    if (currentEmotion === 'boot') {
        currentEmotion = 'neutral';
        requestAnimationFrame(hardwareLoop); // Start loop
    }
});

socket.on('emotion_update', (data) => {
    const newEmotion = data.emotion;
    if (FACE_DEFS[newEmotion]) {
        targetEmotion = newEmotion;
        isBlinking = true; // Trigger transition
        blinkSpeed = 0.15; // Smooth transition
    } else {
        console.warn('Unknown emotion:', newEmotion);
    }
});

function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;
    
    chatText.innerText = `> ${text}`;
    chatInput.value = "";
    socket.emit('chat_message', { text: text });
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

socket.on('chat_reply', (data) => {
    chatText.innerText = data.text;
});
