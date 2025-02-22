from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (for now, can refine later)

# Configure Gemini API client
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")
client = genai.Client(api_key=api_key)

def call_gemini_with_rag(prompt_text, patient_file_content=None):
    print("Calling Gemini with prompt:", prompt_text)
    if patient_file_content:
        print("Patient file content received (first 50 chars):", patient_file_content[:50] + "...")

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
        if response.text:
            # Dummy response - Replace with actual LLM response parsing and formatting
            dummy_response = {
                "drugs": [
                    {
                        "generic_name": "acetaminophen",
                        "proprietary_names": ["Tylenol", "FeverAll", "Panadol"]
                    },
                    {
                        "generic_name": "ibuprofen",
                        "proprietary_names": ["Advil", "Motrin", "Midol IB"]
                    }
                ]
            }
            return dummy_response
        else:
            return {"error": "Gemini API returned no text response."}

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {"error": f"Failed to call Gemini API: {e}"}

@app.route('/api/drug-info', methods=['POST'])
def get_drug_info():
    prompt_text = request.form.get('promptText')
    patient_file = request.files.get('patientFile')
    patient_file_content = None

    if patient_file:
        patient_file_content = patient_file.read().decode('utf-8')

    if not prompt_text:
        return jsonify({"error": "Prompt text is required"}), 400

    llm_response = call_gemini_with_rag(prompt_text, patient_file_content)
    return jsonify(llm_response)

if __name__ == '__main__':
    app.run(debug=True)