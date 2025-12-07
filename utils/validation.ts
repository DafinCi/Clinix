import { Vitals, PatientData } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
  isEmergency: boolean;
}

export const validateClinicalData = (patient: PatientData): ValidationResult => {
  const errors: { [key: string]: string } = {};
  let isEmergency = false;
  const { vitals } = patient;

  // 1. Numerical Validation & Emergency Checks
  if (vitals.temperature !== '') {
    if (vitals.temperature < 33 || vitals.temperature > 43) {
      errors.temperature = "Temperature must be between 33°C and 43°C (Compatible with life).";
    }
    if (vitals.temperature > 40) isEmergency = true;
  }

  if (vitals.spo2 !== '') {
    if (vitals.spo2 < 50 || vitals.spo2 > 100) {
      errors.spo2 = "SPO2 must be between 50% and 100%.";
    }
    if (vitals.spo2 < 90) isEmergency = true;
  }

  if (vitals.heartRate !== '') {
    if (vitals.heartRate < 20 || vitals.heartRate > 250) {
      errors.heartRate = "Heart Rate invalid range (20-250).";
    }
    if (vitals.heartRate > 150 || vitals.heartRate < 40) isEmergency = true;
  }

  if (vitals.systolic !== '' && vitals.diastolic !== '') {
    if (Number(vitals.systolic) < Number(vitals.diastolic)) {
      errors.bp = "Systolic must be greater than Diastolic.";
    }
    if (Number(vitals.systolic) > 200 || Number(vitals.diastolic) > 120) isEmergency = true;
  }

  // 2. Mandatory Fields for specific complaints
  if (patient.chiefComplaint.toLowerCase().includes('chest pain')) {
    if (vitals.heartRate === '' || vitals.systolic === '') {
      errors.general = "Vitals (HR, BP) are mandatory for Chest Pain.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isEmergency
  };
};