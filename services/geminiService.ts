import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PatientData, SymptomsData, TriageResult, AnalyticsData, Language, PublicTriageInput, PublicTriageResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Utility to clean AI response if it wraps JSON in Markdown code blocks
const cleanJson = (text: string): string => {
  return text.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
};

const triageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    urgencyLevel: {
      type: Type.STRING,
      enum: ["Red", "Yellow", "Green"],
      description: "The triage urgency level based on symptoms and vitals.",
    },
    diagnoses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          confidence: { type: Type.NUMBER, description: "Percentage from 0 to 100" },
          explanation: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Natural language explanation of why this diagnosis was chosen."
          }
        },
        required: ["name", "confidence", "explanation"],
      },
      description: "Top 3 possible diagnoses with explainability.",
    },
    medicationSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          diagnosisName: { type: Type.STRING },
          medications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dosage: { type: Type.STRING },
                form: { type: Type.STRING },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.NUMBER },
                isOTC: { type: Type.BOOLEAN, description: "Must be true. Only OTC allowed." }
              },
              required: ["name", "dosage", "form", "warnings", "confidence", "isOTC"]
            },
          },
          note: { type: Type.STRING }
        },
        required: ["diagnosisName", "medications", "note"]
      },
      description: "Strictly OTC medication suggestions."
    },
    riskFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key risk factors (e.g. Hypertension, High Fever).",
    },
    reasoning: {
      type: Type.STRING,
      description: "A summary of the reasoning.",
    },
    recommendation: {
      type: Type.STRING,
      enum: ["Self care", "Treat at primary care", "Urgent referral recommended"],
    },
  },
  required: ["urgencyLevel", "diagnoses", "medicationSuggestions", "riskFactors", "reasoning", "recommendation"],
};

const publicTriageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
    possibleConditions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Simple, common names for conditions." },
    careAdvice: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Simple steps like rest, hydration." },
    warningSigns: { type: Type.ARRAY, items: { type: Type.STRING }, description: "When to see a doctor immediately." },
    educationalCards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING, description: "Short explanation of symptom or condition." }
        },
        required: ["title", "content"]
      }
    },
    disclaimer: { type: Type.STRING }
  },
  required: ["riskLevel", "possibleConditions", "careAdvice", "warningSigns", "educationalCards", "disclaimer"]
};

const analyticsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    timeframe: { type: Type.STRING },
    triage_counts: {
      type: Type.OBJECT,
      properties: {
        Red: { type: Type.INTEGER },
        Yellow: { type: Type.INTEGER },
        Green: { type: Type.INTEGER },
      },
      required: ["Red", "Yellow", "Green"],
    },
    common_diagnoses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          count: { type: Type.INTEGER },
        },
        required: ["name", "count"]
      }
    },
    medication_usage: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          count: { type: Type.INTEGER },
        },
        required: ["name", "count"]
      }
    }
  },
  required: ["timeframe", "triage_counts", "common_diagnoses", "medication_usage"]
};

const langNameMap: {[key in Language]: string} = {
    'en': 'English', 'id': 'Indonesian', 'zh': 'Mandarin Chinese',
    'ja': 'Japanese', 'ko': 'Korean', 'es': 'Spanish'
};

export const analyzeTriage = async (
  patient: PatientData,
  symptoms: SymptomsData,
  imageBase64: string | null,
  language: Language
): Promise<TriageResult> => {
  
  const targetLang = langNameMap[language];

  const promptText = `
    You are a highly secure medical assistant AI for primary care triage.
    
    Patient: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}
    Vitals: Temp ${patient.vitals.temperature}C, HR ${patient.vitals.heartRate}, BP ${patient.vitals.systolic}/${patient.vitals.diastolic}, SPO2 ${patient.vitals.spo2}%
    Allergies: ${patient.allergies || "None"}
    Chief Complaint: ${patient.chiefComplaint}
    Symptoms: ${symptoms.selected.join(", ")} (${symptoms.duration}, Severity ${symptoms.severity}/10)
    Notes: ${symptoms.notes || "None"}

    TASK:
    1. Triage Urgency (Red/Yellow/Green). *Red if SPO2<90 or critical vitals*.
    2. Top 3 Diagnoses w/ confidence.
    3. **SAFETY RULES FOR MEDICATIONS**:
       - ONLY suggest Over-The-Counter (OTC) medications (e.g., Paracetamol, Ibuprofen).
       - **ABSOLUTELY NO ANTIBIOTICS** (Amoxicillin, Ciprofloxacin, etc) or controlled substances.
       - If infection suspected, suggest referral, do not prescribe.
       - Check allergies.
    4. Explanation: Why did you choose these diagnoses? (Explainable AI).
    
    OUTPUT:
    - Language: ${targetLang}
    - Format: JSON
  `;

  const parts: any[] = [{ text: promptText }];

  if (imageBase64) {
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: triageSchema,
        temperature: 0.1, // Lower temperature for medical accuracy
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(cleanJson(text)) as TriageResult;
  } catch (error) {
    console.error("Triage Analysis Failed:", error);
    throw error;
  }
};

export const analyzePublicTriage = async (
    input: PublicTriageInput,
    language: Language
): Promise<PublicTriageResult> => {
    const targetLang = langNameMap[language];

    const promptText = `
        You are a friendly, empathetic health guide helper. You are assisting a non-medical person understand their symptoms.
        
        User Profile: ${input.ageGroup} (${input.gender})
        Symptoms: ${input.symptoms.join(", ")}
        Duration: ${input.duration}
        Severity: ${input.severity}

        TASK:
        1. Identify 2-3 possible COMMON conditions (e.g., "Common Cold", "Indigestion"). DO NOT DIAGNOSE complex diseases.
        2. Assess Risk: Low (Home care), Medium (Call doctor), High (Emergency).
        3. Provide simple home care advice (rest, hydration).
        4. List "Warning Signs" - specific things that mean they must see a doctor now.
        5. Create 2 Educational Cards explaining the symptoms simply.
        6. REQUIRED DISCLAIMER: "This is AI-generated information, not a medical diagnosis. Always consult a professional."

        TONE:
        - Warm, reassuring, simple English (or target language).
        - No medical jargon.

        OUTPUT:
        - Language: ${targetLang}
        - Format: JSON
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: promptText }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: publicTriageSchema,
                temperature: 0.3,
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(cleanJson(text)) as PublicTriageResult;
    } catch (error) {
        console.error("Public Analysis Failed:", error);
        throw error;
    }
};

export const generateAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a simulated dashboard dataset for a primary care clinic.",
      config: {
        responseMimeType: "application/json",
        responseSchema: analyticsSchema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No analytics generated");
    return JSON.parse(cleanJson(text)) as AnalyticsData;
  } catch (error) {
    return {
      timeframe: "Last 7 Days (Fallback)",
      triage_counts: { Red: 0, Yellow: 0, Green: 0 },
      common_diagnoses: [],
      medication_usage: []
    };
  }
};