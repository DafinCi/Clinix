export type Language = 'en' | 'id' | 'zh' | 'ja' | 'ko' | 'es';

export interface PatientData {
  name: string;
  age: number | '';
  gender: 'male' | 'female';
  weight: number | '';
  allergies: string;
  chiefComplaint: string;
}

export interface SymptomsData {
  selected: string[];
  duration: string;
  severity: number; // 1-5
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  form: string;
  warnings: string[];
  confidence: number;
}

export interface MedicationSuggestion {
  diagnosisName: string;
  medications: Medication[];
  note: string;
}

export interface TriageResult {
  urgencyLevel: 'Red' | 'Yellow' | 'Green';
  diagnoses: Array<{
    name: string;
    confidence: number;
    explanation: string[]; // XAI: Contributing features
  }>;
  medicationSuggestions: MedicationSuggestion[];
  riskFactors: string[];
  reasoning: string;
  recommendation: 'Self care' | 'Treat at primary care' | 'Urgent referral recommended';
}

export interface Referral {
  id: string;
  patientName: string;
  urgency: 'Red' | 'Yellow' | 'Green';
  primaryDiagnosis: string;
  timestamp: string;
}

export interface AnalyticsData {
  timeframe: string;
  triage_counts: { Red: number; Yellow: number; Green: number };
  common_diagnoses: Array<{ name: string; count: number }>;
  medication_usage: Array<{ name: string; count: number }>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info';
  timestamp: string;
  read: boolean;
}

export type AppView = 'HOME' | 'WIZARD' | 'RESULTS' | 'INBOX' | 'ANALYTICS';

export const SYMPTOM_LIST = [
  "Fever",
  "Cough",
  "Shortness of breath",
  "Chest pain",
  "Fatigue",
  "Nausea",
  "Rash",
  "Headache"
];