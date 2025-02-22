from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes (for now, can refine later)

# Placeholder function for LLM + RAG call.
# In reality, this would be replaced with an actual API call to your LLM service.
def call_llm_with_rag(prompt_text, patient_file_content=None):
    print("Calling LLM with prompt:", prompt_text)
    if patient_file_content:
        print("Patient file content received (first 50 chars):", patient_file_content[:50] + "...")

    # Dummy response - replace with actual LLM response parsing
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

@app.route('/api/drug-info', methods=['POST'])
def get_drug_info():
    prompt_text = request.form.get('promptText') # Get text from form data
    patient_file = request.files.get('patientFile') # Get file from form data
    patient_file_content = None
    if patient_file:
        patient_file_content = patient_file.read().decode('utf-8') # Read file content

    if not prompt_text:
        return jsonify({"error": "Prompt text is required"}), 400

    llm_response = call_llm_with_rag(prompt_text, patient_file_content)
    return jsonify(llm_response)

if __name__ == '__main__':
    app.run(debug=True) # Run in debug mode for development