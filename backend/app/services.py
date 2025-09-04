import google.generativeai as genai
import os
import datetime
import json
from decimal import Decimal

# --- Configuration ---
# It's important to set the GEMINI_API_KEY in your environment variables.
API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    # This provides a clear error if the API key is missing.
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

# --- Prompt Engineering ---
def get_prompt(current_date_str):
    """
    Creates a detailed, structured prompt for the Gemini API.
    """
    return f"""
You are an expert expense tracking assistant. Analyze the audio memo and extract the transaction details.

Your task is to identify four key pieces of information:
1.  **amount**: The cost as a number (e.g., 25.50).
2.  **category**: A simple, one-word category for the expense.
3.  **date**: The transaction date in YYYY-MM-DD format. The memo was recorded on {current_date_str}.
4.  **description**: A clean, full transcription of the user's memo.

Return ONLY a single, minified JSON object with these four keys. If a detail is missing, return null for that field.
"""

# --- Service Function ---
def process_audio_file(file_path):
    """
    Uploads an audio file to Gemini, sends it for processing, and parses the JSON response.
    """
    if not model:
        raise RuntimeError("Gemini model is not initialized. Check API_KEY.")

    try:
        uploaded_file = genai.upload_file(path=file_path)
        today = datetime.date.today()
        prompt = get_prompt(today.isoformat())
        response = model.generate_content([prompt, uploaded_file])

        cleaned_response_text = response.text.strip().replace('```json', '').replace('```', '').strip()
        data = json.loads(cleaned_response_text)

        if data.get('amount') is not None:
            data['amount'] = Decimal(str(data['amount']))
        if data.get('date') is not None:
            data['date'] = datetime.date.fromisoformat(data['date'])

        return {'success': True, 'data': data}
    except Exception as e:
        return {'success': False, 'error': str(e), 'file_path': file_path}
