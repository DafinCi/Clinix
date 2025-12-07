import { Language } from '../types';

type Translations = {
  [key in Language]: {
    // Auth & Roles
    loginTitle: string;
    selectRole: string;
    doctorNurse: string;
    specialist: string;
    login: string;
    logout: string;
    role_DOCTOR: string;
    role_NURSE: string;
    role_SPECIALIST: string;
    
    // Core
    welcome: string;
    ready: string;
    startTriage: string;
    aiAssisted: string;
    referralInbox: string;
    activeCases: string;
    dashboard: string;
    recentActivity: string;
    patientDetails: string;
    symptomAssessment: string;
    evidence: string;
    step: string;
    of: string;
    nextStep: string;
    back: string;
    analyze: string;
    selfTriage: string;
    aiSystemDesc: string;
    internalAccess: string;
    secureEnv: string;
    
    // Patient Data & Vitals
    fullName: string;
    age: string;
    gender: string;
    male: string;
    female: string;
    weight: string;
    allergies: string;
    chiefComplaint: string;
    vitalsTitle: string;
    temp: string;
    hr: string;
    bp: string;
    sys: string;
    dia: string;
    spo2: string;
    rr: string;
    
    // Wizard
    duration: string;
    severity: string;
    mild: string;
    severe: string;
    uploadTitle: string;
    uploadDesc: string;
    tapUpload: string;
    micStart: string;
    micStop: string;
    symptoms: { [key: string]: string };
    detected: string;
    no: string;
    duration1: string;
    duration2: string;
    duration3: string;
    duration4: string;
    voiceNotSupported: string;
    fillBasicInfo: string;

    // Results & Analysis
    analysisComplete: string;
    topDiagnoses: string;
    medSuggestions: string;
    riskFactors: string;
    recommendation: string;
    confirmTreat: string;
    requestReferral: string;
    emergencyTransfer: string;
    emergencyMode: string;
    emergencyAlert: string;
    immediateAction: string;
    stabilizeABC: string;
    administerOxygen: string;
    prepareTransfer: string;
    triageReport: string;
    generatedOn: string;
    copied: string;
    copyFail: string;
    priority: string;
    urgency_Red: string;
    urgency_Yellow: string;
    urgency_Green: string;
    warning: string;
    accurate: string;
    incorrect: string;
    referralSent: string;
    referralToast: string;
    analysisFailed: string;
    
    // Specialist & Audit
    specialistPortal: string;
    incomingReferrals: string;
    sendRecommendation: string;
    auditLogs: string;
    caseTimeline: string;
    diagnosisLabel: string;
    typeNotes: string;
    reject: string;
    approve: string;
    tableTimestamp: string;
    tableActor: string;
    tableAction: string;
    tableDetails: string;
    auditSystem: string;
    auditInit: string;
    auditMsg: string;
    noLogs: string;
    
    // Case Lookup & QR
    lookupCase: string;
    enterCaseId: string;
    scanQr: string;
    printCase: string;
    caseId: string;
    caseNotFound: string;
    search: string;
    tapToView: string;
    scannerInstructions: string;
    lookupSubtitle: string;

    // Public Mode
    publicModeBtn: string;
    clinicModeBtn: string;
    publicWelcome: string;
    publicDesc: string;
    aboutYou: string;
    yourSymptoms: string;
    howBad: string;
    howLong: string;
    checkSymptoms: string;
    iFeel: string;
    ageGroup: string;
    child: string;
    teen: string;
    adult: string;
    senior: string;
    moderate: string;
    publicResults: string;
    possibleCauses: string;
    homeCare: string;
    whenToSeeDoc: string;
    shareWithClinic: string;
    clearData: string;
    publicDisclaimer: string;
    shareInstructions: string;
    risk: string;
    risk_Low: string;
    risk_Medium: string;
    risk_High: string;
    clearDataConfirm: string;

    // History
    history: string;
    historyTitle: string;
    noHistory: string;
    viewDetails: string;
    delete: string;
    deleteAll: string;
    confirmDelete: string;
    confirmClearHistory: string;
    savedAutomatically: string;

    // Misc
    offlineMode: string;
    online: string;
    alert: string;
    info: string;
    close: string;
    notifications: string;
    saveOffline: string;
    clinicAnalytics: string;
    redCases: string;
    yellowCases: string;
    greenCases: string;
    topDiagnosesTrends: string;
    commonMedications: string;
    option: string;
    why: string;
    strategyFor: string;
    note: string;
    disclaimer: string;
    noReferrals: string;
    sent: string;
    pendingSync: string;
    generatingAnalytics: string;
    failedAnalytics: string;
    analyzing: string;
    analyzingDesc: string;
    connecting: string;
    validationError: string;
    provideFeedback: string;
    feedbackThanks: string;
    newTriage: string;
    startAssessment: string;
  };
};

const EN_TRANSLATIONS = {
    loginTitle: "Clinix Access",
    selectRole: "Select User Role",
    doctorNurse: "Doctor / Nurse",
    specialist: "Specialist",
    login: "Login",
    logout: "Exit",
    role_DOCTOR: "Doctor",
    role_NURSE: "Nurse",
    role_SPECIALIST: "Specialist",

    welcome: "Welcome, Dr. Assistant",
    ready: "Ready to triage patients today.",
    startTriage: "Start New Triage",
    aiAssisted: "AI-Assisted Assessment",
    referralInbox: "Referral Inbox",
    activeCases: "Active Cases",
    dashboard: "Dashboard Analytics",
    recentActivity: "Recent Activity",
    patientDetails: "Patient Details",
    symptomAssessment: "Symptom Assessment",
    evidence: "Evidence",
    step: "Step",
    of: "of",
    nextStep: "Next Step",
    back: "Back",
    analyze: "Analyze",
    selfTriage: "Self-Triage",
    aiSystemDesc: "AI-Assisted Triage System",
    internalAccess: "Internal Access",
    secureEnv: "Secure Environment • End-to-End Encrypted",
    
    fullName: "Full Name",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    weight: "Weight (kg)",
    allergies: "Allergies",
    chiefComplaint: "Chief Complaint",
    vitalsTitle: "Vitals Signs",
    temp: "Temp (°C)",
    hr: "Heart Rate (bpm)",
    bp: "BP (Sys/Dia)",
    sys: "Sys",
    dia: "Dia",
    spo2: "SPO2 (%)",
    rr: "Resp. Rate",
    duration: "Duration",
    severity: "Severity",
    mild: "Mild",
    severe: "Severe",
    uploadTitle: "Data Upload",
    uploadDesc: "Upload images of rashes, wounds, or lab results.",
    tapUpload: "Tap to Upload Image",
    micStart: "Tap to speak",
    micStop: "Listening...",
    detected: "Detected",
    no: "No",
    duration1: "Less than 1 day",
    duration2: "1-2 days",
    duration3: "3-5 days",
    duration4: "More than a week",
    voiceNotSupported: "Voice input not supported.",
    fillBasicInfo: "Please fill in basic patient info (Name & Age).",

    analysisComplete: "Analysis Complete",
    topDiagnoses: "Top AI Diagnoses & Logic",
    medSuggestions: "OTC Medication Suggestions",
    riskFactors: "Key Risk Factors",
    recommendation: "AI Recommendation",
    confirmTreat: "Confirm & Treat",
    requestReferral: "Request Referral",
    emergencyTransfer: "Emergency Transfer",
    emergencyMode: "EMERGENCY MODE",
    emergencyAlert: "CRITICAL VITALS DETECTED",
    immediateAction: "Immediate Action Required",
    stabilizeABC: "Stabilize patient ABC (Airway, Breathing, Circulation)",
    administerOxygen: "Administer Oxygen if SPO2 < 90%",
    prepareTransfer: "Prepare for immediate transfer",
    triageReport: "CLINIX TRIAGE REPORT",
    generatedOn: "Generated on",
    copied: "Copied!",
    copyFail: "Manual copy required",
    priority: "PRIORITY",
    urgency_Red: "RED",
    urgency_Yellow: "YELLOW",
    urgency_Green: "GREEN",
    warning: "Warning:",
    accurate: "Accurate",
    incorrect: "Incorrect",
    referralSent: "Referral Sent",
    referralToast: "Referral sent to specialist successfully!",
    analysisFailed: "Analysis failed. Please try again.",

    specialistPortal: "Specialist Portal",
    incomingReferrals: "Incoming Referrals",
    sendRecommendation: "Send Recommendation",
    auditLogs: "System Audit Logs",
    caseTimeline: "Case Timeline",
    diagnosisLabel: "Diagnosis:",
    typeNotes: "Type notes for the referring doctor...",
    reject: "Reject",
    approve: "Approve & Reply",
    tableTimestamp: "Timestamp",
    tableActor: "Actor",
    tableAction: "Action",
    tableDetails: "Details",
    auditSystem: "System",
    auditInit: "INIT",
    auditMsg: "System initialized successfully",
    noLogs: "No more logs available.",

    offlineMode: "Offline Mode",
    online: "Online",
    alert: "ALERT",
    info: "INFO",
    close: "Close",
    notifications: "Notifications",
    saveOffline: "Save to Offline Queue",
    symptoms: {
        "Fever": "Fever", "Cough": "Cough", "Shortness of breath": "Shortness of breath",
        "Chest pain": "Chest pain", "Fatigue": "Fatigue", "Nausea": "Nausea",
        "Rash": "Rash", "Headache": "Headache", "Dizziness": "Dizziness", "Abdominal Pain": "Abdominal Pain",
        "Fever / Hot": "Fever / Hot", "Coughing": "Coughing", "Tummy Pain": "Tummy Pain", 
        "Feeling Tired": "Feeling Tired", "Skin Rash": "Skin Rash", "Sore Throat": "Sore Throat", "Runny Nose": "Runny Nose"
    },
    clinicAnalytics: "Clinic Analytics",
    redCases: "Red Cases",
    yellowCases: "Yellow Cases",
    greenCases: "Green Cases",
    topDiagnosesTrends: "Top Diagnoses Trends",
    commonMedications: "Commonly Prescribed Medications",
    option: "Option",
    why: "WHY?",
    strategyFor: "Strategy for:",
    note: "Note:",
    disclaimer: "Disclaimer: AI suggestions are based on guidelines. Verify contraindications. NO ANTIBIOTICS SUGGESTED.",
    noReferrals: "No active referrals yet.",
    sent: "Sent",
    pendingSync: "Pending Sync",
    generatingAnalytics: "Generating real-time analytics...",
    failedAnalytics: "Failed to load analytics.",
    analyzing: "Analysing...",
    analyzingDesc: "Gemini AI is reviewing symptoms, clinical data, and evidence against triage protocols.",
    connecting: "Connecting to Gemini AI...",
    validationError: "Please fix validation errors.",
    provideFeedback: "Doctor Feedback",
    feedbackThanks: "Feedback recorded for training.",
    lookupCase: "Lookup / Scan Case",
    enterCaseId: "Enter Case ID",
    scanQr: "Scan QR",
    printCase: "Print Case File",
    caseId: "Case ID",
    caseNotFound: "Case ID not found or invalid.",
    search: "Search",
    tapToView: "Tap to view full details",
    scannerInstructions: "Use a dedicated scanner to read Patient QR Codes, then enter the ID above.",
    lookupSubtitle: "Search ID or Scan QR",

    // Public
    publicModeBtn: "Public Self-Check",
    clinicModeBtn: "Clinic Login",
    publicWelcome: "Welcome to Self-Triage",
    publicDesc: "Quick, simple symptom check for you and your family.",
    aboutYou: "About You",
    yourSymptoms: "Your Symptoms",
    howBad: "How bad is it?",
    howLong: "How long?",
    checkSymptoms: "Check My Symptoms",
    iFeel: "I feel...",
    ageGroup: "Age Group",
    child: "Child (0-12)",
    teen: "Teen (13-17)",
    adult: "Adult (18-64)",
    senior: "Senior (65+)",
    moderate: "Moderate",
    publicResults: "Your Health Report",
    possibleCauses: "Possible Causes",
    homeCare: "Home Care Suggestions",
    whenToSeeDoc: "When to see a Doctor",
    shareWithClinic: "Share with Clinic",
    clearData: "Clear Data & Exit",
    publicDisclaimer: "This information is AI-generated for educational purposes and is NOT a medical diagnosis. Always consult a healthcare professional for advice.",
    shareInstructions: "Show this code to the receptionist or doctor to share your self-assessment.",
    risk: "RISK",
    risk_Low: "LOW",
    risk_Medium: "MEDIUM",
    risk_High: "HIGH",
    clearDataConfirm: "This will clear all your data. Are you sure?",

    // History
    history: "History",
    historyTitle: "Analysis History",
    noHistory: "No history records found.",
    viewDetails: "View Details",
    delete: "Delete",
    deleteAll: "Clear All History",
    confirmDelete: "Are you sure you want to delete this?",
    confirmClearHistory: "Clear all history? This cannot be undone.",
    savedAutomatically: "Analysis saved automatically.",
    
    newTriage: "New Triage",
    startAssessment: "Start assessment"
};

export const TRANSLATIONS: Translations = {
  en: EN_TRANSLATIONS,
  id: {
    ...EN_TRANSLATIONS,
    loginTitle: "Akses Clinix",
    login: "Masuk",
    logout: "Keluar",
    role_DOCTOR: "Dokter",
    role_NURSE: "Perawat",
    role_SPECIALIST: "Spesialis",

    welcome: "Selamat Datang, Dr. Asisten",
    ready: "Siap melakukan triase pasien hari ini.",
    startTriage: "Mulai Triase Baru",
    aiAssisted: "Penilaian Berbantuan AI",
    referralInbox: "Kotak Masuk Rujukan",
    activeCases: "Kasus Aktif",
    dashboard: "Analitik Dashboard",
    patientDetails: "Detail Pasien",
    symptomAssessment: "Penilaian Gejala",
    evidence: "Bukti",
    step: "Langkah",
    of: "dari",
    nextStep: "Langkah Berikutnya",
    back: "Kembali",
    analyze: "Analisis",
    selfTriage: "Triase Mandiri",
    aiSystemDesc: "Sistem Triase Berbantuan AI",
    internalAccess: "Akses Internal",
    secureEnv: "Lingkungan Aman • Terenkripsi",
    
    fullName: "Nama Lengkap",
    age: "Usia",
    gender: "Jenis Kelamin",
    male: "Pria",
    female: "Wanita",
    weight: "Berat (kg)",
    allergies: "Alergi",
    chiefComplaint: "Keluhan Utama",
    vitalsTitle: "Tanda Vital",
    temp: "Suhu (°C)",
    hr: "Detak Jantung (bpm)",
    bp: "TD (Sis/Dia)",
    sys: "Sis",
    dia: "Dia",
    spo2: "SPO2 (%)",
    rr: "Laju Napas",
    duration: "Durasi",
    severity: "Keparahan",
    mild: "Ringan",
    severe: "Parah",
    uploadTitle: "Unggah Data",
    uploadDesc: "Unggah gambar ruam, luka, atau hasil lab.",
    tapUpload: "Ketuk untuk Unggah Gambar",
    micStart: "Ketuk untuk bicara",
    micStop: "Mendengarkan...",
    detected: "Terdeteksi",
    no: "Tidak",
    duration1: "Kurang dari 1 hari",
    duration2: "1-2 hari",
    duration3: "3-5 hari",
    duration4: "Lebih dari seminggu",
    voiceNotSupported: "Input suara tidak didukung.",
    fillBasicInfo: "Mohon isi info dasar pasien (Nama & Usia).",

    analysisComplete: "Analisis Selesai",
    topDiagnoses: "Diagnosis & Logika AI Teratas",
    medSuggestions: "Saran Obat Bebas (OTC)",
    riskFactors: "Faktor Risiko Utama",
    recommendation: "Rekomendasi AI",
    confirmTreat: "Konfirmasi & Obati",
    requestReferral: "Minta Rujukan",
    emergencyTransfer: "Transfer Darurat",
    emergencyMode: "MODE DARURAT",
    emergencyAlert: "TANDA VITAL KRITIS TERDETEKSI",
    immediateAction: "Tindakan Segera Diperlukan",
    stabilizeABC: "Stabilkan ABC pasien (Jalan Napas, Pernapasan, Sirkulasi)",
    administerOxygen: "Berikan Oksigen jika SPO2 < 90%",
    prepareTransfer: "Persiapkan transfer segera",
    triageReport: "LAPORAN TRIASE CLINIX",
    generatedOn: "Dibuat pada",
    copied: "Disalin!",
    copyFail: "Salin manual diperlukan",
    priority: "PRIORITAS",
    urgency_Red: "MERAH",
    urgency_Yellow: "KUNING",
    urgency_Green: "HIJAU",
    warning: "Peringatan:",
    accurate: "Akurat",
    incorrect: "Tidak Akurat",
    referralSent: "Rujukan Terkirim",
    referralToast: "Rujukan berhasil dikirim ke spesialis!",
    analysisFailed: "Analisis gagal. Silakan coba lagi.",

    specialistPortal: "Portal Spesialis",
    incomingReferrals: "Rujukan Masuk",
    sendRecommendation: "Kirim Rekomendasi",
    auditLogs: "Log Audit Sistem",
    caseTimeline: "Linimasa Kasus",
    diagnosisLabel: "Diagnosis:",
    typeNotes: "Ketik catatan untuk dokter perujuk...",
    reject: "Tolak",
    approve: "Setujui & Balas",
    tableTimestamp: "Waktu",
    tableActor: "Aktor",
    tableAction: "Tindakan",
    tableDetails: "Detail",
    auditSystem: "Sistem",
    auditInit: "MULAI",
    auditMsg: "Sistem berhasil diinisialisasi",
    noLogs: "Tidak ada log lainnya.",

    offlineMode: "Mode Offline",
    online: "Online",
    alert: "PERINGATAN",
    info: "INFO",
    close: "Tutup",
    notifications: "Notifikasi",
    saveOffline: "Simpan ke Antrean Offline",
    symptoms: {
        "Fever": "Demam", "Cough": "Batuk", "Shortness of breath": "Sesak napas",
        "Chest pain": "Nyeri dada", "Fatigue": "Kelelahan", "Nausea": "Mual",
        "Rash": "Ruam", "Headache": "Sakit kepala", "Dizziness": "Pusing", "Abdominal Pain": "Nyeri Perut",
        "Fever / Hot": "Demam / Panas", "Coughing": "Batuk", "Tummy Pain": "Sakit Perut", 
        "Feeling Tired": "Merasa Lelah", "Skin Rash": "Ruam Kulit", "Sore Throat": "Sakit Tenggorokan", "Runny Nose": "Hidung Meler"
    },
    clinicAnalytics: "Analitik Klinik",
    redCases: "Kasus Merah",
    yellowCases: "Kasus Kuning",
    greenCases: "Kasus Hijau",
    topDiagnosesTrends: "Tren Diagnosis Teratas",
    commonMedications: "Obat yang Sering Diresepkan",
    option: "Opsi",
    why: "MENGAPA?",
    strategyFor: "Strategi untuk:",
    note: "Catatan:",
    disclaimer: "Penafian: Saran AI berdasarkan pedoman. Verifikasi kontraindikasi. TIDAK ADA ANTIBIOTIK.",
    noReferrals: "Belum ada rujukan aktif.",
    sent: "Terkirim",
    pendingSync: "Sinkronisasi Tertunda",
    generatingAnalytics: "Menghasilkan analitik waktu nyata...",
    failedAnalytics: "Gagal memuat analitik.",
    analyzing: "Menganalisis...",
    analyzingDesc: "Gemini AI sedang meninjau gejala, data klinis, dan bukti terhadap protokol triase.",
    connecting: "Menghubungkan ke Gemini AI...",
    validationError: "Harap perbaiki kesalahan validasi.",
    provideFeedback: "Umpan Balik Dokter",
    feedbackThanks: "Umpan balik direkam untuk pelatihan.",
    lookupCase: "Cari / Pindai Kasus",
    enterCaseId: "Masukkan ID Kasus",
    scanQr: "Pindai QR",
    printCase: "Cetak Berkas Kasus",
    caseId: "ID Kasus",
    caseNotFound: "ID Kasus tidak ditemukan atau tidak valid.",
    search: "Cari",
    tapToView: "Ketuk untuk melihat detail lengkap",
    scannerInstructions: "Gunakan pemindai khusus untuk membaca Kode QR Pasien, lalu masukkan ID di atas.",
    lookupSubtitle: "Cari ID atau Pindai QR",

    publicModeBtn: "Cek Mandiri Publik",
    clinicModeBtn: "Login Klinik",
    publicWelcome: "Selamat Datang di Triase Mandiri",
    publicDesc: "Pemeriksaan gejala cepat dan sederhana untuk Anda dan keluarga.",
    aboutYou: "Tentang Anda",
    yourSymptoms: "Gejala Anda",
    howBad: "Seberapa sakit?",
    howLong: "Berapa lama?",
    checkSymptoms: "Cek Gejala Saya",
    iFeel: "Saya merasa...",
    ageGroup: "Kelompok Usia",
    child: "Anak (0-12)",
    teen: "Remaja (13-17)",
    adult: "Dewasa (18-64)",
    senior: "Lansia (65+)",
    moderate: "Sedang",
    publicResults: "Laporan Kesehatan Anda",
    possibleCauses: "Kemungkinan Penyebab",
    homeCare: "Saran Perawatan di Rumah",
    whenToSeeDoc: "Kapan harus ke Dokter",
    shareWithClinic: "Bagikan dengan Klinik",
    clearData: "Hapus Data & Keluar",
    publicDisclaimer: "Informasi ini dihasilkan oleh AI untuk tujuan edukasi dan BUKAN diagnosis medis. Selalu konsultasikan dengan tenaga profesional.",
    shareInstructions: "Tunjukkan kode ini ke resepsionis atau dokter untuk membagikan penilaian mandiri Anda.",
    risk: "RISIKO",
    risk_Low: "RENDAH",
    risk_Medium: "SEDANG",
    risk_High: "TINGGI",
    clearDataConfirm: "Ini akan menghapus semua data Anda. Apakah Anda yakin?",

    history: "Riwayat",
    historyTitle: "Riwayat Analisis",
    noHistory: "Tidak ada riwayat ditemukan.",
    viewDetails: "Lihat Detail",
    delete: "Hapus",
    deleteAll: "Hapus Semua Riwayat",
    confirmDelete: "Anda yakin ingin menghapus ini?",
    confirmClearHistory: "Hapus semua riwayat? Ini tidak dapat dibatalkan.",
    savedAutomatically: "Analisis disimpan otomatis.",
    
    newTriage: "Triase Baru",
    startAssessment: "Mulai penilaian"
  },
  es: {
    ...EN_TRANSLATIONS,
    loginTitle: "Acceso Clinix",
    login: "Entrar",
    logout: "Salir",
    role_DOCTOR: "Doctor",
    role_NURSE: "Enfermera",
    role_SPECIALIST: "Especialista",

    welcome: "Bienvenido, Dr. Asistente",
    ready: "Listo para triaje hoy.",
    startTriage: "Nuevo Triaje",
    aiAssisted: "Evaluación por IA",
    referralInbox: "Bandeja de Referencias",
    activeCases: "Casos Activos",
    dashboard: "Panel de Análisis",
    patientDetails: "Detalles del Paciente",
    symptomAssessment: "Evaluación de Síntomas",
    evidence: "Evidencia",
    step: "Paso",
    of: "de",
    nextStep: "Siguiente Paso",
    back: "Atrás",
    analyze: "Analizar",
    selfTriage: "Auto-Triaje",
    aiSystemDesc: "Sistema de Triaje Asistido por IA",
    internalAccess: "Acceso Interno",
    secureEnv: "Entorno Seguro • Encriptado",
    
    fullName: "Nombre Completo",
    age: "Edad",
    gender: "Género",
    male: "Masculino",
    female: "Femenino",
    weight: "Peso (kg)",
    allergies: "Alergias",
    chiefComplaint: "Queja Principal",
    vitalsTitle: "Signos Vitales",
    temp: "Temp (°C)",
    hr: "Frec. Cardíaca (lpm)",
    bp: "PA (Sis/Dia)",
    sys: "Sis",
    dia: "Dia",
    spo2: "SPO2 (%)",
    rr: "Frec. Resp.",
    duration: "Duración",
    severity: "Severidad",
    mild: "Leve",
    severe: "Severo",
    uploadTitle: "Subir Datos",
    uploadDesc: "Subir imágenes de erupciones, heridas o laboratorios.",
    tapUpload: "Tocar para Subir Imagen",
    micStart: "Tocar para hablar",
    micStop: "Escuchando...",
    detected: "Detectado",
    no: "No",
    duration1: "Menos de 1 día",
    duration2: "1-2 días",
    duration3: "3-5 días",
    duration4: "Más de una semana",
    voiceNotSupported: "Entrada de voz no soportada.",
    fillBasicInfo: "Por favor complete la información básica del paciente (Nombre y Edad).",

    analysisComplete: "Análisis Completo",
    topDiagnoses: "Diagnósticos Principales IA",
    medSuggestions: "Sugerencias de Medicamentos (OTC)",
    riskFactors: "Factores de Riesgo Clave",
    recommendation: "Recomendación IA",
    confirmTreat: "Confirmar y Tratar",
    requestReferral: "Solicitar Referencia",
    emergencyTransfer: "Traslado de Emergencia",
    emergencyMode: "MODO DE EMERGENCIA",
    emergencyAlert: "SIGNOS VITALES CRÍTICOS DETECTADOS",
    immediateAction: "Acción Inmediata Requerida",
    stabilizeABC: "Estabilizar ABC del paciente (Vía aérea, Respiración, Circulación)",
    administerOxygen: "Administrar Oxígeno si SPO2 < 90%",
    prepareTransfer: "Preparar traslado inmediato",
    triageReport: "INFORME DE TRIAJE CLINIX",
    generatedOn: "Generado el",
    copied: "¡Copiado!",
    copyFail: "Copia manual requerida",
    priority: "PRIORIDAD",
    urgency_Red: "ROJO",
    urgency_Yellow: "AMARILLO",
    urgency_Green: "VERDE",
    warning: "Advertencia:",
    accurate: "Preciso",
    incorrect: "Incorrecto",
    referralSent: "Referencia Enviada",
    referralToast: "¡Referencia enviada al especialista con éxito!",
    analysisFailed: "El análisis falló. Por favor intente de nuevo.",

    specialistPortal: "Portal de Especialistas",
    incomingReferrals: "Referencias Entrantes",
    sendRecommendation: "Enviar Recomendación",
    auditLogs: "Registros de Auditoría",
    caseTimeline: "Línea de Tiempo del Caso",
    diagnosisLabel: "Diagnóstico:",
    typeNotes: "Escriba notas para el médico referente...",
    reject: "Rechazar",
    approve: "Aprobar y Responder",
    tableTimestamp: "Hora",
    tableActor: "Actor",
    tableAction: "Acción",
    tableDetails: "Detalles",
    auditSystem: "Sistema",
    auditInit: "INICIO",
    auditMsg: "Sistema inicializado exitosamente",
    noLogs: "No hay más registros disponibles.",

    offlineMode: "Modo Offline",
    online: "En línea",
    alert: "ALERTA",
    info: "INFO",
    close: "Cerrar",
    notifications: "Notificaciones",
    saveOffline: "Guardar en Cola Offline",
    symptoms: {
        "Fever": "Fiebre", "Cough": "Tos", "Shortness of breath": "Falta de aire",
        "Chest pain": "Dolor de pecho", "Fatigue": "Fatiga", "Nausea": "Náuseas",
        "Rash": "Erupción", "Headache": "Dolor de cabeza", "Dizziness": "Mareos", "Abdominal Pain": "Dolor Abdominal",
        "Fever / Hot": "Fiebre / Caliente", "Coughing": "Tos", "Tummy Pain": "Dolor de Panza", 
        "Feeling Tired": "Cansancio", "Skin Rash": "Erupción Cutánea", "Sore Throat": "Dolor de Garganta", "Runny Nose": "Nariz Mocosa"
    },
    clinicAnalytics: "Analítica Clínica",
    redCases: "Casos Rojos",
    yellowCases: "Casos Amarillos",
    greenCases: "Casos Verdes",
    topDiagnosesTrends: "Tendencias de Diagnósticos",
    commonMedications: "Medicamentos Comunes",
    option: "Opción",
    why: "¿POR QUÉ?",
    strategyFor: "Estrategia para:",
    note: "Nota:",
    disclaimer: "Descargo: Sugerencias de IA basadas en guías. Verifique contraindicaciones. NO ANTIBIÓTICOS.",
    noReferrals: "No hay referencias activas.",
    sent: "Enviado",
    pendingSync: "Sincronización Pendiente",
    generatingAnalytics: "Generando análisis en tiempo real...",
    failedAnalytics: "Error al cargar análisis.",
    analyzing: "Analizando...",
    analyzingDesc: "Gemini AI está revisando síntomas, datos clínicos y evidencia contra protocolos de triaje.",
    connecting: "Conectando a Gemini AI...",
    validationError: "Por favor corrija los errores de validación.",
    provideFeedback: "Comentarios del Médico",
    feedbackThanks: "Comentarios registrados para entrenamiento.",
    lookupCase: "Buscar / Escanear Caso",
    enterCaseId: "Ingresar ID de Caso",
    scanQr: "Escanear QR",
    printCase: "Imprimir Expediente",
    caseId: "ID de Caso",
    caseNotFound: "ID de Caso no encontrado o inválido.",
    search: "Buscar",
    tapToView: "Toque para ver detalles completos",
    scannerInstructions: "Use un escáner dedicado para leer códigos QR de pacientes, luego ingrese el ID arriba.",
    lookupSubtitle: "Buscar ID o Escanear QR",

    publicModeBtn: "Auto-Chequeo Público",
    clinicModeBtn: "Acceso Clínica",
    publicWelcome: "Bienvenido al Auto-Triaje",
    publicDesc: "Chequeo de síntomas rápido y simple para usted y su familia.",
    aboutYou: "Sobre Usted",
    yourSymptoms: "Sus Síntomas",
    howBad: "¿Qué tan mal?",
    howLong: "¿Cuánto tiempo?",
    checkSymptoms: "Revisar Mis Síntomas",
    iFeel: "Me siento...",
    ageGroup: "Grupo de Edad",
    child: "Niño (0-12)",
    teen: "Adolescente (13-17)",
    adult: "Adulto (18-64)",
    senior: "Mayor (65+)",
    moderate: "Moderado",
    publicResults: "Su Informe de Salud",
    possibleCauses: "Posibles Causas",
    homeCare: "Sugerencias de Cuidado en Casa",
    whenToSeeDoc: "Cuándo ver a un Doctor",
    shareWithClinic: "Compartir con Clínica",
    clearData: "Borrar Datos y Salir",
    publicDisclaimer: "Esta información es generada por IA con fines educativos y NO es un diagnóstico médico. Consulte siempre a un profesional.",
    shareInstructions: "Muestre este código a la recepción o al médico para compartir su autoevaluación.",
    risk: "RIESGO",
    risk_Low: "BAJO",
    risk_Medium: "MEDIO",
    risk_High: "ALTO",
    clearDataConfirm: "Esto borrará todos sus datos. ¿Está seguro?",

    history: "Historial",
    historyTitle: "Historial de Análisis",
    noHistory: "No se encontraron registros.",
    viewDetails: "Ver Detalles",
    delete: "Borrar",
    deleteAll: "Borrar Todo",
    confirmDelete: "¿Estás seguro de que quieres eliminar esto?",
    confirmClearHistory: "¿Borrar todo el historial? Esto no se puede deshacer.",
    savedAutomatically: "Análisis guardado automáticamente.",

    newTriage: "Nuevo Triaje",
    startAssessment: "Comenzar evaluación"
  },
  // Fallbacks using English structure
  zh: { ...EN_TRANSLATIONS, welcome: "欢迎" },
  ja: { ...EN_TRANSLATIONS, welcome: "ようこそ" },
  ko: { ...EN_TRANSLATIONS, welcome: "환영합니다" }
};