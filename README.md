# Clinix - AI-Assisted Medical Triage System

**Clinix** is a next-generation web application designed for primary care facilities and public self-assessment. Powered by **Google Gemini 2.5 Flash**, it provides explainable, safe, and efficient triage recommendations.

## 🌟 Key Features

### 🏥 Clinic Mode (Professional Use)
*   **AI Triage Engine:** Analyzes patient vitals (Heart Rate, SPO2, BP, Temp) and symptoms to determine urgency (Red/Yellow/Green).
*   **Explainable AI:** Provides "Why" the AI made a diagnosis, ensuring doctors remain in the loop.
*   **Safety First:** Automatically detects emergencies (SPO2 < 90%, Hypertensive Crisis) and enforces "No Antibiotics" prescribing rules.
*   **Workflow Integration:** 
    *   **Evidence Upload:** Attach photos of rashes or wounds.
    *   **QR Code Sharing:** Generate unique case IDs and QR codes for patient transfer.
    *   **History & Audit:** Local storage of cases with full audit logs.

### 🏠 Public Mode (Self-Service)
*   **Symptom Checker:** Simplified interface for non-medical users.
*   **Risk Assessment:** Categorizes symptoms into Low, Medium, or High risk.
*   **Educational Cards:** Generates simple, easy-to-understand explanations of potential conditions.
*   **Clinic Handoff:** Users can show a generated QR code at the clinic reception to transfer their pre-triage data instantly.

### 🌍 Multilingual Support
*   Full support for **English**, **Indonesian (Bahasa Indonesia)**, and **Spanish (Español)**.
*   Real-time language switching.

## 🚀 Technology Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS.
*   **AI Model:** Google Gemini 2.5 Flash (via `@google/genai` SDK).
*   **Utilities:** 
    *   `qrcode` for patient data sharing.
    *   Native `localStorage` for offline-capable history.

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DafinCi/Clinix.git
    cd Clinix
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your Google Gemini API Key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```

## 📱 Mobile First Design

Clinix is built with a "Mobile First" philosophy, ensuring it works perfectly on tablets used by nurses or smartphones used by patients at home. It features:
*   Touch-friendly inputs.
*   Glassmorphism UI for a modern aesthetic.
*   Stepped Wizards to prevent form fatigue.

## ⚠️ Disclaimer

**Clinix is a demonstration tool.** 
*   AI suggestions must always be verified by a licensed medical professional.
*   In case of a real medical emergency, call emergency services immediately.
*   The application processes data locally and via the Gemini API; ensure compliance with local data privacy laws (HIPAA/GDPR) before real-world deployment.
