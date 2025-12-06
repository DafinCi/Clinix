import React, { useState, useEffect } from 'react';
import { AppView, PatientData, SymptomsData, TriageResult, Referral, SYMPTOM_LIST, AnalyticsData, Notification, Language } from './types';
import { StethoscopeIcon, InboxIcon, HomeIcon, ChevronLeftIcon, PillIcon, ChartIcon, BellIcon, WifiIcon, WifiOffIcon, UploadIcon, AlertIcon, GlobeIcon, MicIcon } from './components/Icons';
import { analyzeTriage, generateAnalytics } from './services/geminiService';
import { TRANSLATIONS } from './utils/translations';

// -- Sub Components --

const Header = ({ 
    title, 
    goBack, 
    showHome, 
    isOffline, 
    unreadCount, 
    toggleNotifications,
    language,
    setLanguage
}: { 
    title: string, 
    goBack?: () => void, 
    showHome?: () => void, 
    isOffline: boolean,
    unreadCount: number,
    toggleNotifications: () => void,
    language: Language,
    setLanguage: (l: Language) => void
}) => (
  <header className="bg-white shadow-sm sticky top-0 z-30">
    <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {goBack && (
          <button onClick={goBack} className="p-2 -ml-2 text-gray-600 hover:text-primary">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}
        <div className="flex items-center gap-2 text-primary font-heading font-bold text-xl">
          <StethoscopeIcon className="w-6 h-6" />
          <span className="hidden sm:inline">Clinix</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative group">
              <button className="flex items-center gap-1 text-gray-500 hover:text-primary p-2">
                  <GlobeIcon className="w-5 h-5"/>
                  <span className="text-xs font-bold uppercase">{language}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 shadow-lg rounded-xl p-2 hidden group-hover:block w-32">
                  {(['en', 'id', 'zh', 'ja', 'ko', 'es'] as Language[]).map(l => (
                      <button 
                        key={l}
                        onClick={() => setLanguage(l)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg ${language === l ? 'bg-blue-50 text-primary font-bold' : 'hover:bg-gray-50'}`}
                      >
                          {l === 'en' ? 'English' : 
                           l === 'id' ? 'Bahasa' : 
                           l === 'zh' ? '中文' : 
                           l === 'ja' ? '日本語' :
                           l === 'ko' ? '한국어' : 'Español'}
                      </button>
                  ))}
              </div>
          </div>

          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isOffline ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-success'}`}>
              {isOffline ? <WifiOffIcon className="w-4 h-4"/> : <WifiIcon className="w-4 h-4"/>}
              <span className="hidden sm:inline">{TRANSLATIONS[language][isOffline ? 'offlineMode' : 'online']}</span>
          </div>

          <button onClick={toggleNotifications} className="relative p-2 text-gray-500 hover:text-primary transition-colors">
              <BellIcon className="w-6 h-6"/>
              {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border border-white"></span>
              )}
          </button>
          
          {showHome && (
            <button onClick={showHome} className="text-gray-500 hover:text-primary p-2">
                <HomeIcon className="w-6 h-6"/>
            </button>
          )}
      </div>
    </div>
  </header>
);

const NotificationPanel = ({ notifications, onClose, language }: { notifications: Notification[], onClose: () => void, language: Language }) => (
    <div className="absolute top-16 right-0 sm:right-4 w-full sm:w-80 bg-white shadow-xl border border-gray-100 rounded-b-2xl sm:rounded-2xl z-40 overflow-hidden animate-fade-in-up">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-dark">{TRANSLATIONS[language].notifications}</h3>
            <button onClick={onClose} className="text-xs text-primary font-medium">{TRANSLATIONS[language].close}</button>
        </div>
        <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
                <p className="p-6 text-center text-gray-400 text-sm">No new notifications</p>
            ) : (
                notifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-gray-50 ${notif.type === 'alert' ? 'bg-red-50/50' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${notif.type === 'alert' ? 'bg-red-100 text-danger' : 'bg-blue-100 text-primary'}`}>
                                {notif.type === 'alert' ? TRANSLATIONS[language].alert : TRANSLATIONS[language].info}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <h4 className="text-sm font-bold text-dark">{notif.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                    </div>
                ))
            )}
        </div>
    </div>
);

// --- VIEW: HOME ---
const Home = ({ onStartTriage, onOpenInbox, onOpenAnalytics, activeReferrals, pendingUploads, language }: { onStartTriage: () => void, onOpenInbox: () => void, onOpenAnalytics: () => void, activeReferrals: number, pendingUploads: number, language: Language }) => {
    const t = TRANSLATIONS[language];
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center py-8">
          <h1 className="text-3xl font-heading font-bold text-dark mb-2">{t.welcome}</h1>
          <p className="text-gray-500">{t.ready}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button 
            onClick={onStartTriage}
            className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8 bg-primary text-white rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-600 transition-all transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                <StethoscopeIcon className="w-8 h-8" />
                </div>
                <span className="text-xl font-bold">{t.startTriage}</span>
                <span className="text-blue-100 text-sm mt-1">{t.aiAssisted}</span>
            </div>
            {pendingUploads > 0 && (
                 <div className="absolute top-4 right-4 bg-warning text-dark text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                     {pendingUploads} {t.pendingSync}
                 </div>
            )}
          </button>

          <button 
            onClick={onOpenInbox}
            className="flex flex-col items-center justify-center p-6 bg-white text-dark border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <div className="bg-gray-100 p-3 rounded-full mb-3 relative">
              <InboxIcon className="w-6 h-6 text-gray-600" />
              {activeReferrals > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-danger rounded-full border-2 border-white"></span>
              )}
            </div>
            <span className="font-bold">{t.referralInbox}</span>
            <span className="text-xs text-gray-400 mt-1">{activeReferrals} {t.activeCases}</span>
          </button>

          <button 
            onClick={onOpenAnalytics}
            className="flex flex-col items-center justify-center p-6 bg-white text-dark border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <div className="bg-teal-50 p-3 rounded-full mb-3">
              <ChartIcon className="w-6 h-6 text-accent" />
            </div>
            <span className="font-bold">{t.dashboard}</span>
          </button>
        </div>
      </div>
    );
};

// --- VIEW: ANALYTICS ---
const AnalyticsDashboard = ({ data, loading, language }: { data: AnalyticsData | null, loading: boolean, language: Language }) => {
    const t = TRANSLATIONS[language];
    if (loading) {
        return (
            <div className="p-10 flex flex-col items-center justify-center text-gray-500">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>{t.generatingAnalytics}</p>
            </div>
        )
    }

    if (!data) return <div className="p-8 text-center text-gray-500">{t.failedAnalytics}</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-dark">{t.clinicAnalytics}</h2>
                    <p className="text-sm text-gray-500">{data.timeframe}</p>
                </div>
            </div>

            {/* Triage Overview Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                    <span className="block text-3xl font-bold text-danger">{data.triage_counts.Red}</span>
                    <span className="text-xs font-bold text-gray-600 uppercase">{t.redCases}</span>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-center">
                    <span className="block text-3xl font-bold text-warning">{data.triage_counts.Yellow}</span>
                    <span className="text-xs font-bold text-gray-600 uppercase">{t.yellowCases}</span>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
                    <span className="block text-3xl font-bold text-success">{data.triage_counts.Green}</span>
                    <span className="text-xs font-bold text-gray-600 uppercase">{t.greenCases}</span>
                </div>
            </div>

            {/* Common Diagnoses Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-dark mb-6">{t.topDiagnosesTrends}</h3>
                <div className="space-y-4">
                    {data.common_diagnoses.map((d, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{d.name}</span>
                                <span className="font-bold text-primary">{d.count}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary rounded-full" 
                                    style={{width: `${(d.count / (data.common_diagnoses[0].count * 1.2)) * 100}%`}}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medication Usage */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-dark mb-4">{t.commonMedications}</h3>
                <div className="grid grid-cols-2 gap-4">
                    {data.medication_usage.map((med, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">{med.name}</span>
                            <span className="text-xs font-bold bg-blue-100 text-primary px-2 py-1 rounded-full">{med.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- VIEW: WIZARD ---
const Wizard = ({ 
  onAnalyze, 
  onCancel,
  isOffline,
  language 
}: { 
  onAnalyze: (p: PatientData, s: SymptomsData, img: string | null) => void, 
  onCancel: () => void,
  isOffline: boolean,
  language: Language
}) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState<PatientData>({ 
    name: '', age: '', gender: 'male', weight: '', allergies: '', chiefComplaint: '' 
  });
  const [symptoms, setSymptoms] = useState<SymptomsData>({ selected: [], duration: '', severity: 3, notes: '' });
  const [image, setImage] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const toggleSymptom = (sym: string) => {
    setSymptoms(prev => ({
      ...prev,
      selected: prev.selected.includes(sym) 
        ? prev.selected.filter(s => s !== sym)
        : [...prev.selected, sym]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice Input Logic
  const startListening = () => {
      if ('webkitSpeechRecognition' in window) {
          const recognition = new (window as any).webkitSpeechRecognition();
          // Map internal codes to webkit codes if needed, or use generic codes
          recognition.lang = language === 'zh' ? 'zh-CN' : language; 
          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onstart = () => setListening(true);
          recognition.onend = () => setListening(false);
          recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setPatient(prev => ({
                  ...prev, 
                  chiefComplaint: prev.chiefComplaint ? prev.chiefComplaint + ' ' + transcript : transcript
              }));
          };
          recognition.start();
      } else {
          alert("Voice input not supported in this browser.");
      }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm font-medium text-gray-400 mb-2">
            <span>{t.step} {step} {t.of} 3</span>
            <span>{step === 1 ? t.patientDetails : step === 2 ? t.symptomAssessment : t.evidence}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
            />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-heading font-bold text-dark">{t.patientDetails}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullName}</label>
                    <input 
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-transparent"
                        value={patient.name}
                        onChange={e => setPatient({...patient, name: e.target.value})}
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.age}</label>
                        <input 
                            type="number" 
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-transparent"
                            value={patient.age}
                            onChange={e => setPatient({...patient, age: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.gender}</label>
                        <select 
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-transparent"
                            value={patient.gender}
                            onChange={e => setPatient({...patient, gender: e.target.value as any})}
                        >
                            <option value="male">{t.male}</option>
                            <option value="female">{t.female}</option>
                        </select>
                    </div>
                </div>
                {/* Weight & Allergies */}
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.weight}</label>
                        <input 
                            type="number" 
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-transparent"
                            value={patient.weight}
                            onChange={e => setPatient({...patient, weight: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">{t.allergies}</label>
                         <input 
                             type="text"
                             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-transparent"
                             value={patient.allergies}
                             onChange={e => setPatient({...patient, allergies: e.target.value})}
                         />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                        {t.chiefComplaint}
                        <button 
                            onClick={startListening} 
                            className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${listening ? 'bg-red-100 text-danger animate-pulse' : 'bg-blue-50 text-primary hover:bg-blue-100'}`}
                        >
                            <MicIcon className="w-3 h-3"/>
                            {listening ? t.micStop : t.micStart}
                        </button>
                    </label>
                    <textarea 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-transparent"
                        rows={3}
                        value={patient.chiefComplaint}
                        onChange={e => setPatient({...patient, chiefComplaint: e.target.value})}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleNext} 
                    disabled={!patient.name || !patient.age}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t.nextStep}
                </button>
            </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in-up">
             <h2 className="text-2xl font-heading font-bold text-dark">{t.symptomAssessment}</h2>
             
             <div className="grid grid-cols-2 gap-3">
                 {SYMPTOM_LIST.map(sym => (
                     <label key={sym} className={`
                        flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all
                        ${symptoms.selected.includes(sym) ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-blue-200'}
                     `}>
                         <input 
                            type="checkbox" 
                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                            checked={symptoms.selected.includes(sym)}
                            onChange={() => toggleSymptom(sym)}
                         />
                         <span className="font-medium text-dark">{t.symptoms[sym] || sym}</span>
                     </label>
                 ))}
             </div>

             <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.duration}</label>
                    <input 
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-transparent"
                        value={symptoms.duration}
                        onChange={e => setSymptoms({...symptoms, duration: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                        <span>{t.severity}</span>
                        <span className="font-bold text-primary">{symptoms.severity}</span>
                    </label>
                    <input 
                        type="range" 
                        min="1" max="10" 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        value={symptoms.severity}
                        onChange={e => setSymptoms({...symptoms, severity: Number(e.target.value)})}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{t.mild}</span>
                        <span>{t.severe}</span>
                    </div>
                </div>
             </div>

             <div className="flex justify-between pt-4">
                <button onClick={handleBack} className="text-gray-500 font-medium hover:text-dark">{t.back}</button>
                <button 
                    onClick={handleNext}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-md hover:bg-blue-600"
                >
                    {t.nextStep}
                </button>
            </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-heading font-bold text-dark">{t.uploadTitle}</h2>
            <p className="text-gray-500">{t.uploadDesc}</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary hover:bg-blue-50 transition-colors relative">
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {image ? (
                    <div className="relative inline-block">
                        <img src={image} alt="Preview" className="h-48 rounded-lg shadow-sm object-cover" />
                        <span className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1 shadow-md cursor-pointer pointer-events-none text-xs">Change</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <div className="p-4 bg-gray-100 rounded-full mb-3">
                             <UploadIcon className="w-8 h-8"/>
                        </div>
                        <span className="font-medium text-dark">{t.tapUpload}</span>
                        <span className="text-sm">JPG, PNG supported</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-8">
                <button onClick={handleBack} className="text-gray-500 font-medium hover:text-dark">{t.back}</button>
                <button 
                    onClick={() => onAnalyze(patient, symptoms, image)}
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${
                        isOffline 
                        ? 'bg-warning text-dark hover:bg-yellow-400' 
                        : 'bg-accent text-dark hover:shadow-xl hover:translate-y-px shadow-teal-100'
                    }`}
                >
                    <span>{isOffline ? t.saveOffline : t.analyze}</span>
                    {isOffline ? <WifiOffIcon className="w-5 h-5"/> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

// --- VIEW: RESULTS ---
const Results = ({ result, onRefer, onHome, language }: { result: TriageResult, onRefer: () => void, onHome: () => void, language: Language }) => {
    const t = TRANSLATIONS[language];
    const urgencyColor = 
        result.urgencyLevel === 'Red' ? 'bg-danger text-white' : 
        result.urgencyLevel === 'Yellow' ? 'bg-warning text-dark' : 
        'bg-success text-white';

    const urgencyRing = 
        result.urgencyLevel === 'Red' ? 'border-danger' : 
        result.urgencyLevel === 'Yellow' ? 'border-warning' : 
        'border-success';

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in pb-20">
            {/* Header / Urgency Meter */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-32 h-32 rounded-full border-8 ${urgencyRing} flex items-center justify-center shadow-xl`}>
                    <div className={`w-24 h-24 rounded-full ${urgencyColor} flex items-center justify-center font-bold text-lg shadow-inner`}>
                        {result.urgencyLevel}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-heading font-bold text-dark">{t.analysisComplete}</h2>
                    <p className="text-gray-500 max-w-md mx-auto">{result.reasoning}</p>
                </div>
            </div>

            {/* Diagnoses with XAI Explanations */}
            <div>
                <h3 className="text-lg font-bold text-dark mb-4 border-l-4 border-primary pl-3">{t.topDiagnoses}</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {result.diagnoses.map((diag, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase">{t.option} {i+1}</span>
                                <span className="text-sm font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-full">{diag.confidence}%</span>
                            </div>
                            <h4 className="font-bold text-dark text-lg mb-2">{diag.name}</h4>
                            
                            {/* XAI: Contributing Factors */}
                            <div className="mt-auto pt-3 border-t border-gray-50">
                                <p className="text-xs font-bold text-gray-400 mb-1">{t.why}</p>
                                <ul className="space-y-1">
                                    {diag.explanation && diag.explanation.map((exp, idx) => (
                                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                            <span className="text-primary">•</span> {exp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medication Suggestions */}
            {result.medicationSuggestions && result.medicationSuggestions.length > 0 && (
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                     <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <PillIcon className="w-6 h-6" />
                        {t.medSuggestions}
                    </h3>
                    
                    <div className="space-y-6">
                        {result.medicationSuggestions.map((suggestion, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
                                <div className="mb-3 border-b border-gray-100 pb-2">
                                    <h4 className="font-bold text-dark text-md">{t.strategyFor} {suggestion.diagnosisName}</h4>
                                </div>
                                <div className="space-y-4">
                                    {suggestion.medications.map((med, mIdx) => (
                                        <div key={mIdx} className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-dark flex items-center gap-2">
                                                    {med.name} 
                                                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{med.form}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">{med.dosage}</p>
                                            </div>
                                            {med.warnings && med.warnings.length > 0 && (
                                                <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg max-w-xs">
                                                    <strong>{t.note}</strong> {med.warnings.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                     {suggestion.note}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-center text-xs text-gray-400 italic">
                        {t.disclaimer}
                    </p>
                </div>
            )}

            {/* Risk Factors */}
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h3 className="text-lg font-bold text-danger mb-3 flex items-center gap-2">
                    <AlertIcon className="w-5 h-5" />
                    {t.riskFactors}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {result.riskFactors.map((risk, i) => (
                        <li key={i}>{risk}</li>
                    ))}
                </ul>
            </div>
            
            {/* Recommendation */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">{t.recommendation}</h3>
                <p className="text-xl font-medium text-dark">{result.recommendation}</p>
            </div>

            {/* Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex flex-col md:flex-row gap-3 justify-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                 <button 
                    onClick={onHome}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold shadow hover:bg-green-600 flex-1 md:flex-none md:w-64"
                >
                    {t.confirmTreat}
                </button>
                <button 
                    onClick={onRefer}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow hover:bg-blue-600 flex-1 md:flex-none md:w-64"
                >
                    {t.requestReferral}
                </button>
            </div>
        </div>
    );
}

// --- VIEW: INBOX ---
const Inbox = ({ referrals, language }: { referrals: Referral[], language: Language }) => (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-fade-in">
        <h2 className="text-2xl font-heading font-bold text-dark">{TRANSLATIONS[language].referralInbox}</h2>
        {referrals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-400">{TRANSLATIONS[language].noReferrals}</p>
            </div>
        ) : (
            <div className="space-y-4">
                {referrals.map(ref => (
                    <div key={ref.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-dark text-lg">{ref.patientName}</h3>
                                <span className={`w-3 h-3 rounded-full ${
                                    ref.urgency === 'Red' ? 'bg-danger' : ref.urgency === 'Yellow' ? 'bg-warning' : 'bg-success'
                                }`}></span>
                             </div>
                             <p className="text-primary font-medium">{ref.primaryDiagnosis}</p>
                             <p className="text-xs text-gray-400 mt-2">ID: {ref.id.slice(0,8)} • {TRANSLATIONS[language].sent} {new Date(ref.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <div className="text-right">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase">{TRANSLATIONS[language].sent}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('HOME');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<TriageResult | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  
  // Language State
  const [language, setLanguage] = useState<Language>('en');

  // Offline & Notification State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingQueue, setPendingQueue] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
        setIsOffline(false);
        // Simulate syncing
        if (pendingQueue > 0) {
            setTimeout(() => {
                setPendingQueue(0);
                addNotification("Sync Complete", `${pendingQueue} offline records processed successfully.`, 'info');
            }, 2000);
        }
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, [pendingQueue]);

  const addNotification = (title: string, message: string, type: 'alert' | 'info') => {
      setNotifications(prev => [{
          id: crypto.randomUUID(),
          title,
          message,
          type,
          timestamp: new Date().toISOString(),
          read: false
      }, ...prev]);
  };

  // Analytics Handler
  const handleOpenAnalytics = async () => {
      setView('ANALYTICS');
      if (!analyticsData) {
          setLoading(true);
          const data = await generateAnalytics();
          setAnalyticsData(data);
          setLoading(false);
      }
  };

  // Triage Handler
  const handleAnalyze = async (patient: PatientData, symptoms: SymptomsData, image: string | null) => {
    if (isOffline) {
        setPendingQueue(prev => prev + 1);
        addNotification("Saved to Offline Queue", `Triage for ${patient.name} saved locally.`, 'info');
        setView('HOME');
        return;
    }

    setLoading(true);
    setCurrentPatientName(patient.name);
    
    try {
      // Pass language to AI service
      const result = await analyzeTriage(patient, symptoms, image, language);
      setCurrentResult(result);
      
      // Trigger Notification for High Risk
      if (result.urgencyLevel === 'Red') {
          addNotification("URGENT: High Risk Patient", `Patient ${patient.name} flagged as RED urgency. Immediate attention required.`, 'alert');
      }

      setView('RESULTS');
    } catch (error) {
      alert("Failed to analyze triage data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Referral Handler
  const handleReferral = () => {
    if (!currentResult) return;

    const newReferral: Referral = {
        id: crypto.randomUUID(),
        patientName: currentPatientName,
        urgency: currentResult.urgencyLevel,
        primaryDiagnosis: currentResult.diagnoses[0]?.name || 'Unknown',
        timestamp: new Date().toISOString()
    };

    setReferrals(prev => [newReferral, ...prev]);
    alert("Referral sent successfully to specialist inbox.");
    setView('HOME');
    setCurrentResult(null);
  };

  if (loading && view !== 'ANALYTICS') {
    const t = TRANSLATIONS[language];
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
             <h2 className="text-xl font-heading font-bold text-dark">{t.analyzing}</h2>
             <p className="text-gray-500 text-center max-w-sm">{t.analyzingDesc}</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <Header 
        title="Clinix" 
        goBack={view !== 'HOME' ? () => setView('HOME') : undefined} 
        showHome={view !== 'HOME' ? () => setView('HOME') : undefined}
        isOffline={isOffline}
        unreadCount={notifications.filter(n => !n.read).length}
        toggleNotifications={() => setShowNotifications(!showNotifications)}
        language={language}
        setLanguage={setLanguage}
      />

      {showNotifications && (
          <NotificationPanel notifications={notifications} onClose={() => setShowNotifications(false)} language={language} />
      )}
      
      <main className="pb-8">
        {view === 'HOME' && (
          <Home 
            onStartTriage={() => setView('WIZARD')} 
            onOpenInbox={() => setView('INBOX')}
            onOpenAnalytics={handleOpenAnalytics}
            activeReferrals={referrals.length}
            pendingUploads={pendingQueue}
            language={language}
          />
        )}
        
        {view === 'WIZARD' && (
          <Wizard 
            onAnalyze={handleAnalyze} 
            onCancel={() => setView('HOME')} 
            isOffline={isOffline}
            language={language}
          />
        )}

        {view === 'RESULTS' && currentResult && (
           <Results 
             result={currentResult} 
             onRefer={handleReferral}
             onHome={() => setView('HOME')}
             language={language}
           />
        )}

        {view === 'INBOX' && (
            <Inbox referrals={referrals} language={language} />
        )}

        {view === 'ANALYTICS' && (
            <AnalyticsDashboard data={analyticsData} loading={loading} language={language} />
        )}
      </main>
    </div>
  );
};

export default App;