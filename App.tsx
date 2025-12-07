import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { AppView, PatientData, SymptomsData, TriageResult, Referral, SYMPTOM_LIST, AnalyticsData, Notification, Language, UserRole, AuditLogEntry, Vitals, AppMode, PublicTriageInput, PUBLIC_SYMPTOM_LIST, PublicTriageResult, HistoryEntry } from './types';
import { StethoscopeIcon, InboxIcon, HomeIcon, ChevronLeftIcon, PillIcon, ChartIcon, BellIcon, WifiIcon, WifiOffIcon, UploadIcon, AlertIcon, GlobeIcon, MicIcon, ActivityIcon, CheckIcon, QrcodeIcon, PrinterIcon, SearchIcon, CopyIcon, UserIcon, ShareIcon, TrashIcon, InfoIcon, HistoryIcon, ClockIcon, EyeIcon } from './components/Icons';
import { analyzeTriage, generateAnalytics, analyzePublicTriage } from './services/geminiService';
import { saveHistoryEntry, getHistoryEntries, deleteHistoryEntry, clearHistory, findEntryById } from './services/storageService';
import { TRANSLATIONS } from './utils/translations';
import { validateClinicalData, ValidationResult } from './utils/validation';

// --- MOCK DATA ---

const MOCK_SPECIALIST_REFERRALS: Referral[] = [
    { 
        id: '1', 
        patientName: 'John Doe', 
        urgency: 'Red', 
        primaryDiagnosis: 'Suspected Cardiac Arrhythmia', 
        timestamp: new Date().toISOString(), 
        status: 'PENDING' 
    },
    { 
        id: '2', 
        patientName: 'Jane Smith', 
        urgency: 'Yellow', 
        primaryDiagnosis: 'Chronic Migraine w/ Aura', 
        timestamp: new Date(Date.now() - 86400000).toISOString(), 
        status: 'REVIEWED' 
    },
    { 
        id: '3', 
        patientName: 'Robert Johnson', 
        urgency: 'Green', 
        primaryDiagnosis: 'Dermatitis requiring specialized cream', 
        timestamp: new Date(Date.now() - 172800000).toISOString(), 
        status: 'PENDING' 
    }
];

// --- SUB COMPONENTS ---

const Header = ({ 
    title, goBack, showHome, isOffline, unreadCount, toggleNotifications, language, setLanguage, role, onLogout, appMode, onHistory
}: any) => {
    const t = TRANSLATIONS[language];
    const isPublic = appMode === 'PUBLIC';
    
    return (
      <header className={`sticky top-0 z-30 no-print transition-all duration-300 ${isPublic ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md' : 'glass border-b border-gray-100'}`}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {goBack && (
              <button onClick={goBack} className={`p-2 -ml-2 rounded-full transition-colors ${isPublic ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-gray-100 hover:text-teal-600'}`}>
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}
            <div className={`flex items-center gap-2 font-heading font-bold text-xl ${isPublic ? 'text-white' : 'text-teal-700'}`}>
              <div className={`p-1.5 rounded-lg ${isPublic ? 'bg-white/20' : 'bg-teal-50'}`}>
                {isPublic ? <UserIcon className="w-6 h-6" /> : <StethoscopeIcon className="w-6 h-6 text-teal-600" />}
              </div>
              <span className="hidden sm:inline tracking-tight">Clinix</span>
              {role && !isPublic && <span className="text-[10px] uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold border border-gray-200">{t[`role_${role}` as keyof typeof t] as string || role}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
              {onHistory && (
                  <button onClick={onHistory} className={`p-2 rounded-xl transition-colors ${isPublic ? 'text-white hover:bg-white/20' : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'}`} title={t.history}>
                      <HistoryIcon className="w-5 h-5"/>
                  </button>
              )}
              <div className="relative group">
                  <button className={`flex items-center gap-1 p-2 rounded-xl transition-all ${isPublic ? 'text-white hover:bg-white/20' : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'}`}>
                      <GlobeIcon className="w-5 h-5"/>
                      <span className="text-xs font-bold uppercase">{language}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-xl rounded-xl p-1.5 hidden group-hover:block w-32 z-50 text-gray-800 animate-fade-in">
                      {(['en', 'id', 'es'] as Language[]).map(l => (
                          <button key={l} onClick={() => setLanguage(l)} className={`block w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors ${language === l ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'}`}>
                              {l.toUpperCase()}
                          </button>
                      ))}
                  </div>
              </div>
              {!isPublic && (
                <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${isOffline ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-green-50 text-green-600 border-green-100'}`}>
                    {isOffline ? <WifiOffIcon className="w-3.5 h-3.5"/> : <WifiIcon className="w-3.5 h-3.5"/>}
                    <span>{t[isOffline ? 'offlineMode' : 'online']}</span>
                </div>
              )}
              {onLogout && (
                  <button onClick={onLogout} className={`text-xs font-bold ml-1 ${isPublic ? 'bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-white' : 'text-gray-400 hover:text-red-500 px-2'}`}>
                      {t.logout}
                  </button>
              )}
          </div>
        </div>
      </header>
    );
};

const HistoryListView = ({ appMode, language, onItemClick }: { appMode: AppMode, language: Language, onItemClick: (entry: HistoryEntry) => void }) => {
    const t = TRANSLATIONS[language];
    const [entries, setEntries] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setEntries(getHistoryEntries(appMode));
    }, [appMode]);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(t.confirmDelete)) {
            deleteHistoryEntry(appMode, id);
            setEntries(getHistoryEntries(appMode));
        }
    };

    const handleClearAll = () => {
        if (confirm(t.confirmClearHistory)) {
            clearHistory(appMode);
            setEntries([]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold font-heading ${appMode === 'PUBLIC' ? 'text-teal-800' : 'text-slate-800'}`}>{t.historyTitle}</h2>
                {entries.length > 0 && (
                    <button onClick={handleClearAll} className="text-sm font-bold text-red-500 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">{t.deleteAll}</button>
                )}
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <HistoryIcon className="w-16 h-16 mx-auto mb-3 opacity-30"/>
                    <p className="font-medium">{t.noHistory}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map(entry => (
                        <div 
                            key={entry.id} 
                            onClick={() => onItemClick(entry)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 flex justify-between items-center bg-white group ${appMode === 'PUBLIC' ? 'border-teal-100 hover:border-teal-300' : 'border-gray-200 hover:border-teal-300'}`}
                        >
                            <div className="flex gap-4 items-center">
                                <div className={`p-3 rounded-full shrink-0 ${appMode === 'PUBLIC' ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-800 group-hover:text-teal-700 transition-colors">{entry.summary || 'Triage Analysis'}</h4>
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                                        <span>{new Date(entry.timestamp).toLocaleString(language)}</span>
                                        <span className="text-gray-300">•</span>
                                        {entry.tags.map(tag => (
                                            <span key={tag} className={`px-2 py-0.5 rounded font-medium ${tag === 'Red' || tag === 'High' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => handleDelete(entry.id, e)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                                <ChevronLeftIcon className="w-5 h-5 text-gray-300 rotate-180 group-hover:text-teal-500 transition-colors"/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- PUBLIC MODE COMPONENTS ---

const PublicWizard = ({ onAnalyze, language }: { onAnalyze: (input: PublicTriageInput) => void, language: Language }) => {
    const t = TRANSLATIONS[language];
    const [step, setStep] = useState(1);
    const [input, setInput] = useState<PublicTriageInput>({
        ageGroup: 'Adult',
        gender: 'male',
        symptoms: [],
        duration: '1-2 days',
        severity: 'mild'
    });

    const toggleSymptom = (sym: string) => {
        setInput(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(sym) ? prev.symptoms.filter(s => s !== sym) : [...prev.symptoms, sym]
        }));
    };

    const durationOptions = [
        { label: t.duration1, value: 'Less than 1 day' },
        { label: t.duration2, value: '1-2 days' },
        { label: t.duration3, value: '3-5 days' },
        { label: t.duration4, value: 'More than a week' }
    ];

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 animate-fade-in-up">
            <div className="mb-6 flex gap-2 justify-center">
                <div className={`h-2 rounded-full flex-1 transition-colors ${step >= 1 ? 'bg-teal-500' : 'bg-gray-200'}`}/>
                <div className={`h-2 rounded-full flex-1 transition-colors ${step >= 2 ? 'bg-teal-500' : 'bg-gray-200'}`}/>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-bold text-teal-800 text-center">{t.aboutYou}</h2>
                    
                    <div className="glass p-6 rounded-2xl shadow-sm space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">{t.ageGroup}</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Child', 'Teen', 'Adult', 'Senior'].map((age) => (
                                    <button 
                                        key={age}
                                        onClick={() => setInput({...input, ageGroup: age as any})}
                                        className={`p-4 rounded-xl border-2 font-bold transition-all duration-200 ${input.ageGroup === age ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-gray-100 hover:border-teal-200 text-gray-600'}`}
                                    >
                                        {(t[age.toLowerCase() as keyof typeof t] as string) || age}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                             <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">{t.gender}</label>
                             <div className="flex gap-3">
                                 {['male', 'female'].map(g => (
                                     <button
                                        key={g}
                                        onClick={() => setInput({...input, gender: g as any})}
                                        className={`flex-1 p-4 rounded-xl border-2 font-bold capitalize transition-all duration-200 ${input.gender === g ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-gray-100 hover:border-teal-200 text-gray-600'}`}
                                     >
                                         {(t[g as keyof typeof t] as string) || g}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>
                    
                    <button onClick={() => setStep(2)} className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all active:scale-95">
                        {t.nextStep}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                     <h2 className="text-2xl font-heading font-bold text-teal-800 text-center">{t.yourSymptoms}</h2>

                     <div className="glass p-6 rounded-2xl shadow-sm space-y-6">
                         <div className="grid grid-cols-2 gap-3">
                             {PUBLIC_SYMPTOM_LIST.map(sym => (
                                 <button
                                    key={sym}
                                    onClick={() => toggleSymptom(sym)}
                                    className={`p-3 sm:p-4 rounded-xl border-2 text-left font-bold transition-all duration-200 ${input.symptoms.includes(sym) ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-gray-100 hover:bg-gray-50 text-gray-600'}`}
                                 >
                                     <span className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wider">{input.symptoms.includes(sym) ? t.detected : t.no}</span>
                                     {t.symptoms[sym] || sym}
                                 </button>
                             ))}
                         </div>

                         <div>
                             <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">{t.howBad}</label>
                             <input 
                                type="range" min="1" max="3" step="1" 
                                value={input.severity === 'mild' ? 1 : input.severity === 'moderate' ? 2 : 3}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setInput({...input, severity: val === 1 ? 'mild' : val === 2 ? 'moderate' : 'severe'});
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                             />
                             <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 uppercase">
                                 <span className={input.severity === 'mild' ? 'text-teal-600' : ''}>{t.mild}</span>
                                 <span className={input.severity === 'moderate' ? 'text-yellow-600' : ''}>{t.moderate}</span>
                                 <span className={input.severity === 'severe' ? 'text-red-600' : ''}>{t.severe}</span>
                             </div>
                         </div>
                         
                         <div>
                             <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">{t.howLong}</label>
                             <select 
                                value={input.duration} 
                                onChange={(e) => setInput({...input, duration: e.target.value})}
                                className="w-full p-4 bg-transparent border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-teal-500"
                             >
                                 {durationOptions.map(opt => (
                                     <option key={opt.value} value={opt.value}>{opt.label}</option>
                                 ))}
                             </select>
                         </div>
                     </div>

                     <div className="flex gap-3">
                         <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">{t.back}</button>
                         <button onClick={() => onAnalyze(input)} disabled={input.symptoms.length === 0} className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 disabled:opacity-50 disabled:shadow-none hover:shadow-xl transition-all">
                             {t.checkSymptoms}
                         </button>
                     </div>
                </div>
            )}
        </div>
    );
}

const PublicResults = ({ result, onExit, language }: { result: PublicTriageResult, onExit: () => void, language: Language }) => {
    const t = TRANSLATIONS[language];
    const [qrUrl, setQrUrl] = useState<string>('');

    useEffect(() => {
        const generateShareQr = async () => {
             if (result.qrCodeUrl) {
                 setQrUrl(result.qrCodeUrl);
                 return;
             }
             const dataToShare = JSON.stringify({
                 risk: result.riskLevel,
                 conditions: result.possibleConditions,
                 generated: result.timestamp
             });
             const url = await QRCode.toDataURL(dataToShare, { margin: 1, color: { dark: '#0d9488' } });
             setQrUrl(url);
        };
        generateShareQr();
    }, [result]);

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 animate-fade-in pb-24">
            <div className="text-center mb-8">
                <div className={`inline-block px-6 py-2 rounded-full text-lg font-black mb-4 shadow-sm animate-fade-in-up ${
                    result.riskLevel === 'High' ? 'bg-red-100 text-red-600' :
                    result.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-teal-100 text-teal-700'
                }`}>
                    {t[`risk_${result.riskLevel}` as keyof typeof t] as string || result.riskLevel} {t.risk}
                </div>
                <h1 className="text-3xl font-heading font-bold text-slate-800 mb-2">{t.publicResults}</h1>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">{result.disclaimer}</p>
            </div>

            <div className="space-y-6">
                {/* Conditions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-50">
                    <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-3">{t.possibleCauses}</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.possibleConditions.map((c, i) => (
                            <span key={i} className="px-3 py-1 bg-teal-50 text-teal-800 rounded-lg font-bold">{c}</span>
                        ))}
                    </div>
                </div>

                {/* Educational Cards */}
                {result.educationalCards.map((card, i) => (
                    <div key={i} className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
                        <div className="bg-white p-2 rounded-full text-blue-500 shadow-sm shrink-0">
                            <InfoIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900 mb-1">{card.title}</h4>
                            <p className="text-sm text-blue-800/80 leading-relaxed">{card.content}</p>
                        </div>
                    </div>
                ))}

                {/* Advice */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <HomeIcon className="w-5 h-5 text-teal-500" /> {t.homeCare}
                    </h3>
                    <ul className="space-y-3">
                        {result.careAdvice.map((adv, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                <CheckIcon className="w-5 h-5 text-teal-500 shrink-0" />
                                {adv}
                            </li>
                        ))}
                    </ul>
                </div>
                
                 {/* Warning Signs */}
                 {result.warningSigns.length > 0 && (
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                            <AlertIcon className="w-5 h-5" /> {t.whenToSeeDoc}
                        </h3>
                        <ul className="space-y-2">
                            {result.warningSigns.map((w, i) => (
                                <li key={i} className="text-red-700 text-sm font-medium">• {w}</li>
                            ))}
                        </ul>
                    </div>
                 )}

                 {/* QR Code Inline - Bottom of analysis */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-50 text-center">
                    <h3 className="font-bold text-teal-800 mb-4">{t.shareWithClinic}</h3>
                    {qrUrl ? (
                        <div className="flex flex-col items-center">
                            <img src={qrUrl} alt="Share QR" className="w-40 h-40 border-4 border-teal-100 rounded-xl mb-2" />
                            <p className="text-sm text-gray-500 max-w-xs">{t.shareInstructions}</p>
                            <div className="text-xs text-gray-400 mt-2 font-mono">ID: {result.id?.substring(0,8)}</div>
                        </div>
                    ) : (
                        <div className="h-40 w-40 bg-gray-100 rounded-xl animate-pulse mx-auto"></div>
                    )}
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-20 flex gap-3 justify-center max-w-xl mx-auto">
                 <button onClick={onExit} className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 hover:text-red-500">
                     <TrashIcon className="w-5 h-5" /> {t.clearData}
                 </button>
            </div>
        </div>
    );
}

const LoginView = ({ onLogin, onPublicMode, language }: { onLogin: (role: UserRole) => void, onPublicMode: () => void, language: Language }) => {
    const t = TRANSLATIONS[language];
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-teal-50">
            <div className="glass p-8 rounded-3xl shadow-xl w-full max-w-md text-center animate-fade-in-up">
                <div className="bg-teal-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 shadow-sm border border-teal-100">
                    <StethoscopeIcon className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold font-heading text-slate-800 mb-2">{t.loginTitle}</h1>
                <p className="text-gray-400 text-sm mb-8">{t.aiSystemDesc}</p>
                
                <div className="space-y-4">
                    <button onClick={onPublicMode} className="w-full p-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-bold text-lg flex items-center justify-center gap-3">
                         <UserIcon className="w-6 h-6"/> {t.publicModeBtn}
                    </button>
                    
                    <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                        <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider"><span className="bg-white/80 backdrop-blur px-2 text-gray-400">{t.internalAccess}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => onLogin('DOCTOR')} className="p-4 border border-gray-200 rounded-xl hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all font-bold text-gray-600 text-sm">
                            {t.doctorNurse}
                        </button>
                        <button onClick={() => onLogin('SPECIALIST')} className="p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all font-bold text-gray-600 text-sm">
                            {t.specialist}
                        </button>
                    </div>
                </div>
                <p className="mt-8 text-xs text-gray-400 flex items-center justify-center gap-1">
                    <AlertIcon className="w-3 h-3" /> {t.secureEnv}
                </p>
            </div>
        </div>
    );
}

// --- RESTORED SUB COMPONENTS ---

const AuditLogView = ({ language }: { language: Language }) => {
    const t = TRANSLATIONS[language];
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 font-heading text-slate-800">{t.auditLogs}</h2>
            <div className="glass rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">{t.tableTimestamp}</th>
                                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">{t.tableActor}</th>
                                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">{t.tableAction}</th>
                                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">{t.tableDetails}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 text-gray-500 whitespace-nowrap">{new Date().toLocaleString()}</td>
                                <td className="p-4 font-bold text-teal-600">{t.auditSystem}</td>
                                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold tracking-wide">{t.auditInit}</span></td>
                                <td className="p-4 text-gray-600">{t.auditMsg}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-8 text-center text-gray-400 italic bg-gray-50/20">{t.noLogs}</div>
            </div>
        </div>
    );
};

const SpecialistPortal = ({ language }: { language: Language }) => {
    const t = TRANSLATIONS[language];
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 font-heading text-slate-800">{t.specialistPortal}</h2>
            <div className="grid gap-4">
                {MOCK_SPECIALIST_REFERRALS.map(ref => (
                    <div key={ref.id} className="glass p-6 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-xl text-slate-800">{ref.patientName}</h3>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${ref.urgency === 'Red' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {t[`urgency_${ref.urgency}` as keyof typeof t] as string || ref.urgency}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">{t.diagnosisLabel} <span className="text-slate-800">{ref.primaryDiagnosis}</span></p>
                            <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <ClockIcon className="w-3 h-3"/> {new Date(ref.timestamp).toLocaleString(language)}
                            </div>
                        </div>
                        <button className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all">
                            {t.viewDetails}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CaseLookup = ({ onLookup, language }: { onLookup: (id: string) => void, language: Language }) => {
    const t = TRANSLATIONS[language];
    const [id, setId] = useState('');

    return (
        <div className="max-w-md mx-auto p-6 pt-12 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600 shadow-sm border border-teal-100">
                    <SearchIcon className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 font-heading">{t.lookupCase}</h2>
                <p className="text-gray-500 text-sm mt-2">{t.scannerInstructions}</p>
            </div>
            
            <div className="glass p-6 rounded-2xl shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t.enterCaseId}</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="flex-1 p-3 border border-gray-200 rounded-xl bg-white/50 focus:bg-white"
                            placeholder="e.g. 550e8400..."
                        />
                        <button onClick={() => onLookup(id)} className="bg-teal-600 text-white px-5 rounded-xl font-bold hover:bg-teal-700 shadow-md">
                            {t.search}
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                    <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider"><span className="bg-white/50 backdrop-blur px-2 text-gray-400">{t.scanQr}</span></div>
                </div>
                <button className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                    <QrcodeIcon className="w-5 h-5"/> {t.scanQr}
                </button>
            </div>
        </div>
    );
};

// --- WIZARD COMPONENT (REFACTORED WITH STEPS) ---

const Wizard = ({ onAnalyze, language }: { onAnalyze: (patient: PatientData, symptoms: SymptomsData, img: string | null) => void, language: Language }) => {
    const t = TRANSLATIONS[language];
    const [wizardStep, setWizardStep] = useState(1);
    const [patient, setPatient] = useState<PatientData>({
        id: crypto.randomUUID(),
        name: '', age: '' as any, gender: 'male', weight: '' as any,
        allergies: '', chiefComplaint: '',
        vitals: { temperature: '' as any, heartRate: '' as any, systolic: '' as any, diastolic: '' as any, spo2: '' as any, respiratoryRate: '' as any }
    });
    const [symptoms, setSymptoms] = useState<SymptomsData>({ selected: [], duration: '1-2 days', severity: 2, notes: '' });
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleSymptom = (s: string) => {
        setSymptoms(prev => ({
            ...prev,
            selected: prev.selected.includes(s) ? prev.selected.filter(x => x !== s) : [...prev.selected, s]
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = () => {
        if (!patient.name || !patient.age) {
            alert(t.fillBasicInfo);
            return;
        }
        onAnalyze(patient, symptoms, image);
    };

    // Steps: 1. Patient Bio, 2. Vitals, 3. Symptoms & Evidence
    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 animate-fade-in-up">
            {/* Progress Bar */}
            <div className="mb-6 flex gap-2">
                {[1, 2, 3].map(step => (
                     <div key={step} className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${wizardStep >= step ? 'bg-teal-500' : 'bg-gray-200'}`}/>
                ))}
            </div>

            {/* Step 1: Patient Bio */}
            {wizardStep === 1 && (
                <div className="glass p-6 rounded-2xl shadow-sm space-y-5 animate-fade-in">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 pb-4 border-b border-gray-100">
                        <UserIcon className="w-5 h-5 text-teal-600"/> {t.patientDetails}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.fullName}</label>
                             <input className="w-full p-3 border border-gray-200 rounded-xl bg-white/50" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.age}</label>
                             <input type="number" className="w-full p-3 border border-gray-200 rounded-xl bg-white/50" value={patient.age} onChange={e => setPatient({...patient, age: Number(e.target.value)})} />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.gender}</label>
                             <select className="w-full p-3 border border-gray-200 rounded-xl bg-white/50" value={patient.gender} onChange={e => setPatient({...patient, gender: e.target.value as any})}>
                                 <option value="male">{t.male}</option>
                                 <option value="female">{t.female}</option>
                             </select>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.weight}</label>
                             <input type="number" className="w-full p-3 border border-gray-200 rounded-xl bg-white/50" value={patient.weight} onChange={e => setPatient({...patient, weight: Number(e.target.value)})} />
                        </div>
                    </div>
                    <button onClick={() => setWizardStep(2)} className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-all mt-4">
                        {t.nextStep}
                    </button>
                </div>
            )}

            {/* Step 2: Vitals */}
            {wizardStep === 2 && (
                <div className="glass p-6 rounded-2xl shadow-sm space-y-5 animate-fade-in">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 pb-4 border-b border-gray-100">
                        <ActivityIcon className="w-5 h-5 text-red-500"/> {t.vitalsTitle}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t.temp}</label>
                             <input type="number" className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 text-center font-mono" value={patient.vitals.temperature} onChange={e => setPatient({...patient, vitals: {...patient.vitals, temperature: Number(e.target.value)}})} />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t.hr}</label>
                             <input type="number" className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 text-center font-mono" value={patient.vitals.heartRate} onChange={e => setPatient({...patient, vitals: {...patient.vitals, heartRate: Number(e.target.value)}})} />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t.spo2}</label>
                             <input type="number" className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 text-center font-mono" value={patient.vitals.spo2} onChange={e => setPatient({...patient, vitals: {...patient.vitals, spo2: Number(e.target.value)}})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t.bp}</label>
                             <div className="flex gap-2 items-center">
                                 <input placeholder="Sys" type="number" className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 text-center font-mono" value={patient.vitals.systolic} onChange={e => setPatient({...patient, vitals: {...patient.vitals, systolic: Number(e.target.value)}})} />
                                 <span className="text-gray-400 font-light">/</span>
                                 <input placeholder="Dia" type="number" className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 text-center font-mono" value={patient.vitals.diastolic} onChange={e => setPatient({...patient, vitals: {...patient.vitals, diastolic: Number(e.target.value)}})} />
                             </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setWizardStep(1)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">{t.back}</button>
                        <button onClick={() => setWizardStep(3)} className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700">{t.nextStep}</button>
                    </div>
                </div>
            )}

            {/* Step 3: Symptoms & Evidence */}
            {wizardStep === 3 && (
                <div className="glass p-6 rounded-2xl shadow-sm space-y-5 animate-fade-in">
                     <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 pb-4 border-b border-gray-100">
                        <StethoscopeIcon className="w-5 h-5 text-teal-600"/> {t.symptomAssessment}
                     </h3>
                     <div className="flex flex-wrap gap-2">
                         {SYMPTOM_LIST.map(sym => (
                             <button 
                                key={sym} 
                                onClick={() => toggleSymptom(sym)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${symptoms.selected.includes(sym) ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}
                             >
                                 {t.symptoms[sym] || sym}
                             </button>
                         ))}
                     </div>
                     <textarea 
                        placeholder={t.chiefComplaint} 
                        className="w-full p-4 border border-gray-200 rounded-xl bg-white/50" 
                        rows={3}
                        value={patient.chiefComplaint}
                        onChange={e => setPatient({...patient, chiefComplaint: e.target.value})}
                     />
                     
                     {/* Enhanced Upload UI */}
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                     {image ? (
                        <div className="relative group rounded-xl overflow-hidden border-2 border-teal-100 shadow-sm">
                            <img src={image} alt="Clinical evidence" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <button 
                                    onClick={() => { setImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                                    className="p-3 bg-white/20 hover:bg-red-500 text-white rounded-full transition-all transform hover:scale-110"
                                >
                                    <TrashIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                     ) : (
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold flex flex-col items-center justify-center gap-2 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 transition-all bg-gray-50/50"
                         >
                             <UploadIcon className="w-8 h-8 opacity-50"/> 
                             <span>{t.tapUpload}</span>
                         </button>
                     )}

                     <div className="flex gap-3 pt-4">
                        <button onClick={() => setWizardStep(2)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">{t.back}</button>
                        <button onClick={handleAnalyze} className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all">
                            {t.analyze}
                        </button>
                     </div>
                </div>
            )}
        </div>
    );
};

// --- VIEW: RESULTS ---
const Results = ({ result, onRefer, onHome, language, onFeedback, isEmergency }: any) => {
    const t = TRANSLATIONS[language];
    const [copiedId, setCopiedId] = useState(false);
    
    if (isEmergency) {
        return (
            <div className="fixed inset-0 bg-red-600 z-50 text-white flex flex-col items-center justify-center p-6 text-center animate-pulse">
                <AlertIcon className="w-24 h-24 mb-4" />
                <h1 className="text-4xl font-black mb-2">{t.emergencyMode}</h1>
                <p className="text-xl mb-8 opacity-90">{t.emergencyAlert}</p>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 max-w-lg w-full mb-8 shadow-2xl">
                     <h3 className="text-lg font-bold mb-4 uppercase tracking-widest border-b border-white/20 pb-2">{t.immediateAction}</h3>
                     <ul className="text-left list-disc pl-6 space-y-3 text-lg font-medium">
                         <li>{t.stabilizeABC}</li>
                         <li>{t.administerOxygen}</li>
                         <li>{t.prepareTransfer}</li>
                     </ul>
                </div>
                <button onClick={onHome} className="bg-white text-red-600 px-10 py-4 rounded-full font-bold text-xl shadow-xl hover:scale-105 transition-transform">
                    {t.emergencyTransfer}
                </button>
            </div>
        );
    }

    const handlePrint = () => window.print();

    const handleCopyId = async (id: string) => {
        if (!id) return;
        try {
            await navigator.clipboard.writeText(id);
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = id;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 animate-fade-in pb-28 print:p-0 print:space-y-4 print:pb-0 print:w-full">
             {/* Header for Print only */}
             <div className="hidden print-only mb-6 text-center border-b pb-4">
                 <h1 className="text-2xl font-bold">{t.triageReport}</h1>
                 <p className="text-sm text-gray-500">{t.generatedOn} {new Date().toLocaleString(language)}</p>
             </div>

             <div className="glass rounded-3xl p-8 shadow-lg text-center relative overflow-hidden print:shadow-none print:border-0 print:p-0">
                 <div className={`inline-block px-5 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wide shadow-sm ${
                     result.urgencyLevel === 'Red' ? 'bg-red-100 text-red-600 border border-red-200' : 
                     result.urgencyLevel === 'Yellow' ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' : 'bg-green-100 text-green-600 border border-green-200'
                 }`}>
                     {t[`urgency_${result.urgencyLevel}` as keyof typeof t] as string || result.urgencyLevel} {t.priority}
                 </div>
                 <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-800 mb-4">{result.recommendation}</h2>
                 <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">{result.reasoning}</p>
                 
                 {/* QR Code Placement */}
                 {result.qrCodeUrl && (
                     <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
                         <div className="bg-white p-2 border border-gray-200 rounded-xl shadow-sm mb-3">
                            <img src={result.qrCodeUrl} alt="Case QR" className="w-28 h-28" />
                         </div>
                         <button 
                            onClick={() => result.caseId && handleCopyId(result.caseId)}
                            className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200 no-print cursor-pointer active:scale-95 transform"
                         >
                            {copiedId ? (
                                <span className="text-teal-600 font-bold flex items-center gap-1"><CheckIcon className="w-3 h-3"/> {t.copied}</span>
                            ) : (
                                <>
                                    ID: {result.caseId?.substring(0,8)}... <CopyIcon className="w-3 h-3"/>
                                </>
                            )}
                         </button>
                         <div className="hidden print-only text-xs font-mono text-gray-500 mt-1">ID: {result.caseId}</div>
                     </div>
                 )}

                 <button onClick={handlePrint} className="no-print mt-6 flex items-center gap-2 mx-auto text-sm text-teal-600 font-bold hover:underline opacity-70 hover:opacity-100">
                    <PrinterIcon className="w-4 h-4" /> {t.printCase}
                 </button>
             </div>

             <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
                 {/* Diagnoses */}
                 <div className="glass p-6 rounded-2xl shadow-sm print:shadow-none print:border print:p-4 h-full">
                     <h3 className="font-bold text-slate-800 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
                         <ActivityIcon className="w-5 h-5 text-teal-500"/> {t.topDiagnoses}
                     </h3>
                     <div className="space-y-5">
                         {result.diagnoses.map((d: any, i: number) => (
                             <div key={i} className="group">
                                 <div className="flex justify-between items-center mb-1.5">
                                     <span className="font-bold text-lg text-slate-700">{d.name}</span>
                                     <span className="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{d.confidence}%</span>
                                 </div>
                                 <div className="w-full bg-gray-100 h-2 rounded-full mb-2 print:hidden overflow-hidden">
                                     <div className="bg-teal-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: `${d.confidence}%`}}></div>
                                 </div>
                                 <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg print:bg-transparent print:p-0 leading-relaxed border border-gray-100">{d.explanation.join(". ")}</p>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* Medications */}
                 <div className="glass p-6 rounded-2xl shadow-sm print:shadow-none print:border print:p-4 h-full">
                     <h3 className="font-bold text-slate-800 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
                         <PillIcon className="w-5 h-5 text-purple-500 print:hidden"/> {t.medSuggestions}
                     </h3>
                     {result.medicationSuggestions.map((s: any, i: number) => (
                         <div key={i} className="mb-5 last:mb-0">
                             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t.strategyFor} {s.diagnosisName}</div>
                             {s.medications.map((m: any, j: number) => (
                                 <div key={j} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl mb-2 print:bg-transparent print:border print:p-2 border border-blue-100">
                                     <div className="flex justify-between font-bold text-slate-800">
                                         <span>{m.name}</span>
                                         <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-600 print:border-gray-400">{m.form}</span>
                                     </div>
                                     <div className="text-sm text-gray-600 mt-1">{m.dosage}</div>
                                     {m.warnings.length > 0 && <div className="text-xs text-orange-600 mt-2 font-medium flex items-start gap-1"><AlertIcon className="w-3 h-3 shrink-0 mt-0.5"/> {t.warning} {m.warnings.join(", ")}</div>}
                                 </div>
                             ))}
                         </div>
                     ))}
                     <p className="text-[10px] text-gray-400 mt-4 italic text-center">{t.disclaimer}</p>
                 </div>
             </div>
             
             {/* Feedback Loop */}
             <div className="bg-gray-50/50 p-6 rounded-xl text-center border border-gray-200/50 no-print">
                 <p className="text-sm text-gray-500 mb-3 font-medium">{t.provideFeedback}</p>
                 <div className="flex justify-center gap-3">
                     <button onClick={() => onFeedback(true)} className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:border-green-500 hover:text-green-600 hover:shadow-sm transition-all flex items-center gap-2">
                         <CheckIcon className="w-4 h-4"/> {t.accurate}
                     </button>
                     <button onClick={() => onFeedback(false)} className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:border-red-500 hover:text-red-600 hover:shadow-sm transition-all flex items-center gap-2">
                         {t.incorrect}
                     </button>
                 </div>
             </div>

             <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-gray-200 flex justify-center gap-4 z-20 no-print backdrop-blur-xl">
                 <button onClick={onHome} className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">{t.close}</button>
                 <button onClick={onRefer} className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all">{t.requestReferral}</button>
             </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

const App = () => {
    const [view, setView] = useState<AppView>('LOGIN');
    const [role, setRole] = useState<UserRole | null>(null);
    const [appMode, setAppMode] = useState<AppMode>('CLINIC');
    const [language, setLanguage] = useState<Language>('en');
    
    // Data States
    const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
    const [publicResult, setPublicResult] = useState<PublicTriageResult | null>(null);
    const [loading, setLoading] = useState(false);
    const t = TRANSLATIONS[language]; 

    // Handlers
    const handleLogin = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setView(selectedRole === 'SPECIALIST' ? 'SPECIALIST_PORTAL' : 'HOME');
        setAppMode('CLINIC');
    };

    const handlePublicMode = () => {
        setAppMode('PUBLIC');
        setView('PUBLIC_INTRO');
    };

    const handleLogout = () => {
        setRole(null);
        setAppMode('CLINIC');
        setView('LOGIN');
        setTriageResult(null);
        setPublicResult(null);
    };

    const handleAnalyze = async (patient: PatientData, symptoms: SymptomsData, img: string | null) => {
        setLoading(true);
        try {
            const result = await analyzeTriage(patient, symptoms, img, language);
            const qrCode = await QRCode.toDataURL(result.caseId || 'error');
            const finalResult = { ...result, qrCodeUrl: qrCode };
            setTriageResult(finalResult);
            saveHistoryEntry('CLINIC', finalResult, patient.name, [result.urgencyLevel, ...result.diagnoses.map(d => d.name)]);
            setView('RESULTS');
        } catch (e) {
            alert(TRANSLATIONS[language].analysisFailed);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePublicAnalyze = async (input: PublicTriageInput) => {
        setLoading(true);
        try {
            const result = await analyzePublicTriage(input, language);
            setPublicResult(result);
            saveHistoryEntry('PUBLIC', result, 'Self Check', [result.riskLevel, ...result.possibleConditions]);
            setView('PUBLIC_RESULTS');
        } catch (e) {
             alert(TRANSLATIONS[language].analysisFailed);
        } finally {
            setLoading(false);
        }
    };

    const handleHistoryClick = () => setView('HISTORY_LIST');

    const handleHistoryItemClick = (entry: HistoryEntry) => {
        if (entry.type === 'CLINIC') {
            setTriageResult(entry.data as TriageResult);
            setView('RESULTS');
        } else {
            setPublicResult(entry.data as PublicTriageResult);
            setView('PUBLIC_RESULTS');
        }
    };

    const handleLookup = (id: string) => {
        const entry = findEntryById(id);
        if (entry) handleHistoryItemClick(entry);
        else alert(TRANSLATIONS[language].caseNotFound);
    };

    if (view === 'LOGIN') {
        return <LoginView onLogin={handleLogin} onPublicMode={handlePublicMode} language={language} />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center animate-pulse">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                        <StethoscopeIcon className="w-8 h-8 animate-spin-slow"/>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{TRANSLATIONS[language].analyzing}</h2>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2 text-sm">{TRANSLATIONS[language].analyzingDesc}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
             <Header 
                language={language} 
                setLanguage={setLanguage} 
                role={role} 
                onLogout={handleLogout}
                appMode={appMode}
                onHistory={handleHistoryClick}
                showHome={view !== 'HOME' && view !== 'PUBLIC_INTRO'}
                goBack={view !== 'HOME' && view !== 'PUBLIC_INTRO' ? () => setView(appMode === 'PUBLIC' ? 'PUBLIC_INTRO' : 'HOME') : undefined}
             />

             <main className="pb-20">
                 {/* CLINIC VIEWS */}
                 {view === 'HOME' && (
                     <div className="max-w-4xl mx-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
                         <button onClick={() => setView('WIZARD')} className="group p-8 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-3xl shadow-lg hover:shadow-teal-200 hover:shadow-xl transition-all text-left relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-125 transition-transform"><StethoscopeIcon className="w-32 h-32"/></div>
                             <StethoscopeIcon className="w-10 h-10 mb-4"/>
                             <h3 className="text-2xl font-bold">{t.newTriage}</h3>
                             <p className="text-teal-100 text-sm mt-1">{t.startAssessment}</p>
                         </button>
                         <button onClick={() => setView('CASE_LOOKUP')} className="group p-8 glass text-slate-800 rounded-3xl shadow-sm hover:bg-white hover:shadow-md transition-all text-left border border-white/50 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-125 transition-transform"><SearchIcon className="w-32 h-32"/></div>
                             <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                <SearchIcon className="w-6 h-6"/>
                             </div>
                             <h3 className="text-2xl font-bold">{t.lookupCase}</h3>
                             <p className="text-gray-500 text-sm mt-1">{t.lookupSubtitle}</p>
                         </button>
                         <button onClick={() => setView('HISTORY_LIST')} className="p-6 glass rounded-2xl shadow-sm hover:bg-white hover:shadow-md transition-all flex items-center gap-4">
                             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><HistoryIcon className="w-6 h-6"/></div>
                             <span className="font-bold text-lg">{t.history}</span>
                         </button>
                         <button onClick={() => setView('AUDIT_LOGS')} className="p-6 glass rounded-2xl shadow-sm hover:bg-white hover:shadow-md transition-all flex items-center gap-4">
                             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><ActivityIcon className="w-6 h-6"/></div>
                             <span className="font-bold text-lg">{t.auditLogs}</span>
                         </button>
                     </div>
                 )}

                 {view === 'WIZARD' && <Wizard onAnalyze={handleAnalyze} language={language} />}
                 {view === 'RESULTS' && triageResult && (
                    <Results 
                        result={triageResult} 
                        onHome={() => setView('HOME')} 
                        onRefer={() => alert(t.referralToast)} 
                        language={language}
                        onFeedback={(v: boolean) => console.log(v)}
                        isEmergency={triageResult.urgencyLevel === 'Red' && triageResult.isEmergency}
                    />
                 )}
                 {view === 'CASE_LOOKUP' && <CaseLookup onLookup={handleLookup} language={language} />}
                 {view === 'SPECIALIST_PORTAL' && <SpecialistPortal language={language} />}
                 {view === 'AUDIT_LOGS' && <AuditLogView language={language} />}
                 {view === 'HISTORY_LIST' && <HistoryListView appMode={appMode} language={language} onItemClick={handleHistoryItemClick} />}

                 {/* PUBLIC VIEWS */}
                 {view === 'PUBLIC_INTRO' && <PublicWizard onAnalyze={handlePublicAnalyze} language={language} />}
                 {view === 'PUBLIC_RESULTS' && publicResult && <PublicResults result={publicResult} onExit={handleLogout} language={language} />}
             </main>
        </div>
    );
};

export default App;