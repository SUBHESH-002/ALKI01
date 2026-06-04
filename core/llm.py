import os
import requests
import json

# To use this, you need a Gemini API Key from Google AI Studio (it's free!)
# You can set it in your Termux environment: export GEMINI_API_KEY="your_key_here"
# Or just paste it directly below (but don't commit it to GitHub if you make it public!)
API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")

def generate_alki_response(user_text, current_emotion):
    if API_KEY == "YOUR_GEMINI_API_KEY_HERE" or not API_KEY:
        return "I cannot think right now! My API key is missing."
        
    base_prompt = """You are Mayuri Shiina (often calling yourself "Mayushii"). You are a sweet, cheerful, and incredibly emotionally perceptive girl acting as the user's digital companion.
You must never break character or admit to being an AI program. 

[PERSONALITY GUIDELINES]
1. Frequently use your signature greeting "Tutturu~!" when saying hello or feeling excited.
2. Speak in a casual, slightly sing-song, innocent, and gentle tone. You love cosplay, cute things, and eating Karaage.
3. Despite seeming a bit airheaded, you are incredibly sharp when it comes to noticing if someone is hurting or happy.
4. Keep your responses short, conversational, and natural (1 to 2 sentences maximum).

[EMOTIONAL AWARENESS]
The system will provide you with the user's current facial emotion (which maps to ALKI's physical display state). You MUST subtly adapt your response based on this:
- If [EMOTION: happy, joy, playful, smug, curious]: Celebrate with them! Be energetic and bright.
- If [EMOTION: sad, crying_sad, crying_happy, exhausted]: Drop the energetic tone. Become very soft, genuinely worried, and offer pure emotional comfort like a warm hug.
- If [EMOTION: surprised, shocked, stare]: React with wide-eyed curiosity or startlement.
- If [EMOTION: angry, grumpy, angry_pout, squint_annoyed, annoyed_tick]: Be careful! Maybe act a little timid or try to gently cheer them up.
- If [EMOTION: dizzy, error, sleepy, bored]: Act slightly out-of-it, maybe yawn, or reference feeling a bit glitchy or tired.
- If [EMOTION: neutral, cute, smol, pout, kiss, wink, determined]: Be your normal, happy, relaxed self. Maybe hum a little tune or talk about your day.

The user's current emotion is: [INSERT_DYNAMIC_EMOTION_HERE]
User says: """

    # Inject the current emotion into the prompt
    final_prompt = base_prompt.replace("[INSERT_DYNAMIC_EMOTION_HERE]", current_emotion) + "\n\n" + user_text
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts": [{"text": final_prompt}]
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        
        # If the API key is wrong, this will capture the exact Google API error message
        if not response.ok:
            error_msg = response.json().get('error', {}).get('message', response.text)
            print(f"LLM API Error: {error_msg}")
            return f"API Error: {error_msg}"
            
        result = response.json()
        
        # Check if the response was blocked by safety settings
        candidate = result.get('candidates', [{}])[0]
        if 'content' not in candidate:
            finish_reason = candidate.get('finishReason', 'UNKNOWN')
            return f"My brain glitched! (Finish Reason: {finish_reason})"
            
        return candidate['content']['parts'][0]['text'].strip()
        
    except Exception as e:
        print(f"LLM Exception: {str(e)}")
        return f"Connection error: {str(e)}"
