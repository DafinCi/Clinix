import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PatientData, SymptomsData, TriageResult, AnalyticsData, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const triageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    urgencyLevel: {
      type: Type.STRING,
      enum: ["Red", "Yellow", "Green"],
      description: "The triage urgency level based on symptoms.",
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
            description: "List of top 3 contributing factors (symptoms, age, etc.) explaining why this diagnosis was chosen."
          }
        },
        required: ["name", "confidence", "explanation"],
      },
      description: "Top 3 possible diagnoses with XAI explanations.",
    },
    medicationSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          diagnosisName: { type: Type.STRING, description: "Matches one of the diagnoses names" },
          medications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Generic name only" },
                dosage: { type: Type.STRING },
                form: { type: Type.STRING, description: "e.g. tablet, syrup" },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.NUMBER },
              },
              required: ["name", "dosage", "form", "warnings", "confidence"]
            },
          },
          note: { type: Type.STRING, description: "Mandatory 'Doctor approval required' note" }
        },
        required: ["diagnosisName", "medications", "note"]
      },
      description: "Medication suggestions for the top diagnoses."
    },
    riskFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key risk factors identified from the patient data.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A summary of the reasoning in under 150 words.",
    },
    recommendation: {
      type: Type.STRING,
      enum: ["Self care", "Treat at primary care", "Urgent referral recommended"],
    },
  },
  required: ["urgencyLevel", "diagnoses", "medicationSuggestions", "riskFactors", "reasoning", "recommendation"],
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

export const analyzeTriage = async (
  patient: PatientData,
  symptoms: SymptomsData,
  imageBase64: string | null,
  language: Language
): Promise<TriageResult> => {
  
  const langNameMap: {[key in Language]: string} = {
      'en': 'English',
      'id': 'Indonesian',
      'zh': 'Mandarin Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'es': 'Spanish'
  };

  const targetLang = langNameMap[language];

  const promptText = `
    You are a medical assistant AI supporting a triage workflow.
    
    Patient Data:
    Name: ${patient.name}
    Age: ${patient.age}
    Gender: ${patient.gender}
    Weight: ${patient.weight ? patient.weight + 'kg' : 'Not provided'}
    Allergies: ${patient.allergies || "No known allergies"}
    Chief Complaint: ${patient.chiefComplaint}

    Symptoms:
    Reported: ${symptoms.selected.join(", ")}
    Duration: ${symptoms.duration}
    Severity (1-5): ${symptoms.severity}
    Notes: ${symptoms.notes || "None"}

    Task:
    Analyze the data and provide a triage assessment.
    1. Determine Urgency Level (Red, Yellow, Green).
    2. Identify Top 3 Possible Diagnoses with confidence percentages.
    3. **Explainable AI**: For each diagnosis, provide 2-3 specific contributing factors (e.g. "High fever + Rash", "Age > 60").
    4. List Key Risk Factors.
    5. Provide reasoning summary (<= 150 words).
    6. Provide a specific recommendation.
    7. Provide safe, evidence-based **Medication Suggestions** for the top diagnoses.

    IMPORTANT:
    - **Language**: Output ALL text values (diagnoses names, explanations, warnings, reasoning, notes) in **${targetLang}**. 
    - Keep JSON keys in English (e.g., "urgencyLevel", "diagnoses").
    - DO NOT claim to replace doctors. Do NOT output medical decisions. This is a simulation/support tool.
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
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TriageResult;
  } catch (error) {
    console.error("Triage Analysis Failed:", error);
    throw error;
  }
};

export const generateAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a simulated dashboard dataset for a primary care clinic for the last 7 days. Include triage counts (Red/Yellow/Green), top 5 diagnoses with counts, and top 5 prescribed generic medications with counts.",
      config: {
        responseMimeType: "application/json",
        responseSchema: analyticsSchema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No analytics generated");
    return JSON.parse(text) as AnalyticsData;
  } catch (error) {
    console.error("Analytics Generation Failed:", error);
    // Return fallback data if API fails
    return {
      timeframe: "Last 7 Days (Offline Fallback)",
      triage_counts: { Red: 5, Yellow: 12, Green: 25 },
      common_diagnoses: [{ name: "Common Cold", count: 10 }, { name: "Hypertension", count: 8 }],
      medication_usage: [{ name: "Paracetamol", count: 15 }]
    };
  }
};