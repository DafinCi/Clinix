import { HistoryEntry, AppMode, TriageResult, PublicTriageResult } from '../types';

const CLINIC_STORAGE_KEY = 'clinix_history_clinic';
const PUBLIC_STORAGE_KEY = 'clinix_history_public';

export const saveHistoryEntry = (
    mode: AppMode,
    data: TriageResult | PublicTriageResult,
    summary: string,
    tags: string[]
): void => {
    const key = mode === 'CLINIC' ? CLINIC_STORAGE_KEY : PUBLIC_STORAGE_KEY;
    const existingStr = localStorage.getItem(key);
    const existing: HistoryEntry[] = existingStr ? JSON.parse(existingStr) : [];

    // Ensure we have an ID and Timestamp
    const id = (data as any).caseId || (data as any).id || crypto.randomUUID();
    const timestamp = (data as any).timestamp || new Date().toISOString();

    const entry: HistoryEntry = {
        id,
        timestamp,
        type: mode,
        summary,
        tags,
        data: { ...data, caseId: id, id, timestamp } // Ensure ID is embedded
    };

    // Add to beginning of array
    const updated = [entry, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
};

export const getHistoryEntries = (mode: AppMode): HistoryEntry[] => {
    const key = mode === 'CLINIC' ? CLINIC_STORAGE_KEY : PUBLIC_STORAGE_KEY;
    const existingStr = localStorage.getItem(key);
    return existingStr ? JSON.parse(existingStr) : [];
};

export const deleteHistoryEntry = (mode: AppMode, id: string): void => {
    const key = mode === 'CLINIC' ? CLINIC_STORAGE_KEY : PUBLIC_STORAGE_KEY;
    const entries = getHistoryEntries(mode);
    const updated = entries.filter(e => e.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
};

export const clearHistory = (mode: AppMode): void => {
    const key = mode === 'CLINIC' ? CLINIC_STORAGE_KEY : PUBLIC_STORAGE_KEY;
    localStorage.removeItem(key);
};

export const findEntryById = (id: string): HistoryEntry | null => {
    // Search both databases because QR lookup might happen in Clinic Mode searching for Public Data
    const clinicEntries = getHistoryEntries('CLINIC');
    const publicEntries = getHistoryEntries('PUBLIC');
    
    const foundClinic = clinicEntries.find(e => e.id === id);
    if (foundClinic) return foundClinic;

    const foundPublic = publicEntries.find(e => e.id === id);
    if (foundPublic) return foundPublic;

    return null;
};
