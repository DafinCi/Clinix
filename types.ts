export type Language = 'en' | 'id' | 'zh' | 'ja' | 'ko' | 'es';
export type UserRole = 'DOCTOR' | 'NURSE' | 'SPECIALIST';
export type AppMode = 'CLINIC' | 'PUBLIC';

export interface Vitals {
  temperature: number | '';
  heartRate: number | '';
  systolic: number | '';
  diastolic: number | '';
  spo2: number | '';
  respiratoryRate: number | '';
}

export interface PatientData {
  id: string; // Added ID for tracking
  name: string;
  age: number | '';
  gender: 'male' | 'female';
  weight: number | '';
  allergies: string;
  chiefComplaint: string;
  vitals: Vitals; // Nested vitals
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
  isOTC: boolean; // Enforce OTC check
}

export interface MedicationSuggestion {
  diagnosisName: string;
  medications: Medication[];
  note: string;
}

export interface TriageResult {
  caseId?: string; // Unique Case ID
  qrCodeUrl?: string; // Base64 QR Code
  timestamp?: string;
  patientName?: string; // Denormalized for easy access in history
  urgencyLevel: 'Red' | 'Yellow' | 'Green';
  diagnoses: Array<{
    name: string;
    confidence: number;
    explanation: string[];
  }>;
  medicationSuggestions: MedicationSuggestion[];
  riskFactors: string[];
  reasoning: string;
  recommendation: 'Self care' | 'Treat at primary care' | 'Urgent referral recommended';
  isEmergency?: boolean;
}

export interface Referral {
  id: string;
  patientName: string;
  urgency: 'Red' | 'Yellow' | 'Green';
  primaryDiagnosis: string;
  timestamp: string;
  status: 'PENDING' | 'REVIEWED';
  specialistNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: UserRole;
  action: string;
  details: string;
  patientId?: string;
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
  type: 'alert' | 'info' | 'emergency';
  timestamp: string;
  read: boolean;
}

// --- PUBLIC MODE TYPES ---

export type AgeGroup = 'Child' | 'Teen' | 'Adult' | 'Senior';

export interface PublicTriageInput {
  ageGroup: AgeGroup;
  gender: 'male' | 'female' | 'other';
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface PublicTriageResult {
  id?: string; // Added for history
  timestamp?: string; // Added for history
  riskLevel: 'Low' | 'Medium' | 'High';
  possibleConditions: string[]; // Simple names
  careAdvice: string[]; // Rest, water, etc.
  warningSigns: string[]; // "Go to doctor if..."
  educationalCards: Array<{
    title: string;
    content: string;
    icon?: string;
  }>;
  disclaimer: string;
  qrCodeUrl?: string; // To share with clinic
}

// --- HISTORY SYSTEM TYPES ---

export interface HistoryEntry {
  id: string;
  timestamp: string;
  type: AppMode;
  summary: string; // Patient Name or "Self Check"
  tags: string[]; // ["High Risk", "Fever"]
  data: TriageResult | PublicTriageResult;
}

export type AppView = 
  | 'LOGIN' 
  | 'HOME' 
  | 'WIZARD' 
  | 'RESULTS' 
  | 'INBOX' 
  | 'ANALYTICS' 
  | 'SPECIALIST_PORTAL' 
  | 'AUDIT_LOGS' 
  | 'EMERGENCY' 
  | 'CASE_LOOKUP'
  // Public Views
  | 'PUBLIC_INTRO'
  | 'PUBLIC_WIZARD'
  | 'PUBLIC_RESULTS'
  // History
  | 'HISTORY_LIST';

export const SYMPTOM_LIST = [
  "Fever", "Cough", "Shortness of breath", "Chest pain", 
  "Fatigue", "Nausea", "Rash", "Headache", "Dizziness", "Abdominal Pain"
];

export const PUBLIC_SYMPTOM_LIST = [
    "Fever / Hot", "Coughing", "Tummy Pain", "Headache", 
    "Feeling Tired", "Skin Rash", "Sore Throat", "Runny Nose"
];