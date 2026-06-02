from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import time
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'alki_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    # Serve the main ALKI UI
    return render_template('index.html')

@socketio.on('connect')
def test_connect():
    print("Client connected!")
    emit('server_response', {'data': 'Connected to ALKI Backend'})

# A test background thread to simulate sending emotion updates to the frontend
def background_emotion_simulator():
    emotions = ['neutral', 'happy', 'sad', 'surprised']
    idx = 0
    while True:
        time.sleep(5)
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
