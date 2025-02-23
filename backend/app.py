from flask import Flask, request, jsonify
from flask_cors import CORS
import google.genai as genai
from google.genai import types
import os
from dotenv import load_dotenv
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    logging.error("GOOGLE_API_KEY environment variable not set.")
    raise ValueError("GOOGLE_API_KEY environment variable not set.")
client = genai.Client(api_key=api_key)

def call_gemini_with_rag(prompt_text, patient_file_content=None):
    logging.info(f"Calling Gemini with prompt: {prompt_text}")
    if patient_file_content:
        logging.info(f"Patient file content received (first 50 chars): {patient_file_content[:50]}...")

    try:
        contents = [prompt_text]
        if patient_file_content:
            contents.append(patient_file_content)

        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                safety_settings=[
                    types.SafetySetting(
                        category='HARM_CATEGORY_HATE_SPEECH',
                        threshold='BLOCK_ONLY_HIGH'
                    ),
                    types.SafetySetting(
                        category='HARM_CATEGORY_HARASSMENT',
                        threshold='BLOCK_ONLY_HIGH'
                    )
                ]
            )
        )

        if response and response.candidates and response.candidates[0].content.parts:
            gemini_text = response.candidates[0].content.parts[0].text
            return {"llm_response": gemini_text}
        else:
            logging.warning("Gemini API returned an empty or malformed response.")
            return {"llm_response": "Gemini API returned an empty or unexpected response."}

    except Exception as e:
        logging.error(f"Error calling Gemini API: {e}")
        return {"error": f"Failed to call Gemini API: {e}"}

@app.route('/api/drug-info', methods=['POST'])
def get_drug_info():
    prompt_text = request.form.get('promptText')
    patient_file = request.files.get('patientFile')
    patient_file_content = None

    if patient_file:
        try:
            patient_file_content = patient_file.read().decode('utf-8')
        except Exception as e:
            logging.error(f"Error reading patient file: {e}")
            return jsonify({"error": "Error reading patient file"}), 400

    if not prompt_text:
        return jsonify({"error": "Prompt text is required"}), 400

    llm_response = call_gemini_with_rag(prompt_text, patient_file_content)
    return jsonify(llm_response)

if __name__ == '__main__':
    app.run(debug=True)