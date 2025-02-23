# What's Up Doc

## Inspiration  
Residency students and new doctors often struggle with real-world decision-making despite having strong theoretical knowledge. We wanted to build a tool that helps bridge the gap between textbook learning and practical application. Additionally, doctors deal with overwhelming amounts of patient interactions, and we saw an opportunity to streamline communication and decision-making using AI.  

## What It Does  
**What's Up Doc** is an LLM-powered web application designed to assist new doctors in two key ways:  

- **AI-Powered Medication Recommendations:**  
  Using a Retrieval-Augmented Generation (RAG) chatbot, doctors can explore medications across pharmaceutical companies and receive recommendations based on a patient’s medical history. This helps new doctors make informed prescribing decisions.  

- **Patient Interaction Assistance:**  
  The app can analyze voicemail messages from patients, perform sentiment analysis, and generate a concise summary along with suggested next steps for the doctor. This reduces cognitive load and helps prioritize patient needs efficiently.  

## How We Built It  
Our app leverages the following technologies:  
- **Google Gemini** – Powers AI-driven insights and responses.  
- **LangChain** – Orchestrates AI workflows and retrieval-based recommendations.  
- **Assembly AI** – Provides high-accuracy transcription and sentiment analysis.  
- **Retrieval-Augmented Generation (RAG)** – Enhances response accuracy using curated medical datasets.  

## Challenges We Ran Into  
- **API Integration Issues** – Setting up and handling authentication for Google Gemini, LangChain, and Assembly AI required troubleshooting.  
- **Optimizing RAG for Medical Data** – Filtering out irrelevant data while ensuring context-aware medication recommendations.  
- **Latency Issues** – Optimizing API calls and caching strategies to improve response time.  
- **User-Friendly Interface** – Designing an intuitive UI to present complex AI-driven insights in an accessible way.  

## Accomplishments That We're Proud Of  
✅ Successfully integrated **Google Gemini** with LangChain for a working RAG-powered chatbot.  
✅ Built a **functional and user-friendly web app** tailored for medical professionals.  
✅ **Learned and applied new technologies** under time constraints.  
✅ **Completed a fully functional prototype in 36 hours.**  

## What We Learned  
- **Data preprocessing** is crucial for AI-powered medical applications.  
- How to **integrate LLMs with external knowledge bases** for RAG-based responses.  
- Effective **team collaboration under time pressure**—splitting work efficiently was key!  
- Real-world medical AI solutions need to be **interpretable and responsible** to ensure safety and compliance.  

## What's Next for What's Up Doc  
🚀 Enhance medical knowledge retrieval with **real-world case studies.**  
🚀 Improve **sentiment analysis accuracy** by training on domain-specific healthcare datasets.  
🚀 Deploy the app and **test with real users** to refine usability.  

## Installation & Setup  
To run this project locally:  
1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/whats-up-doc.git
   cd whats-up-doc
