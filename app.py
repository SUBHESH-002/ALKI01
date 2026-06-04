from flask import Flask, render_template, redirect, url_for
from flask_socketio import SocketIO, emit
import time
import threading
from core.llm import generate_alki_response

# Global variable to store the latest detected emotion
current_emotion = "neutral"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'alki_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    # Serve the main ALKI UI
    return render_template('index.html')

# ─── Test Routes ───
# Hit these in the browser to manually trigger emotion changes
# e.g.  http://localhost:5000/test/happy

@app.route('/test/<emotion>')
def test_emotion(emotion):
    """Emit an emotion_update event to all connected clients, then redirect home."""
    valid = ['neutral', 'happy', 'sad', 'surprised']
    if emotion not in valid:
        emotion = 'neutral'
    socketio.emit('emotion_update', {'emotion': emotion})
    return redirect(url_for('index'))

@socketio.on('connect')
def test_connect():
    print("Client connected!")
    emit('server_response', {'data': 'Connected to ALKI Backend'})

@socketio.on('chat_message')
def handle_chat_message(data):
    global current_emotion
    user_text = data.get('text', '')
    print(f"User says: {user_text} (Current Emotion: {current_emotion})")
    
    # Send to LLM
    reply = generate_alki_response(user_text, current_emotion)
    print(f"ALKI replies: {reply}")
    
    # Send reply back to the browser
    emit('chat_reply', {'text': reply})

# A test background thread to simulate sending emotion updates to the frontend
def background_emotion_simulator():
    global current_emotion
    emotions = ['neutral', 'happy', 'sad', 'surprised']
    idx = 0
    while True:
        time.sleep(10) # Slowed down to 10 seconds so it doesn't distract while chatting
        current_emotion = emotions[idx % len(emotions)]
        print(f"Simulating emotion: {current_emotion}")
        socketio.emit('emotion_update', {'emotion': current_emotion})
        idx += 1

if __name__ == '__main__':
    # Start the test simulator in the background
    thread = threading.Thread(target=background_emotion_simulator, daemon=True)
    thread.start()
    
    print("Starting ALKI Server on http://0.0.0.0:5000")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
