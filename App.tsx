
import React, { useState, useEffect } from 'react';
import { FarmerProfile, EligibilityResult, DashboardMetrics } from './types';
import { INITIAL_SCHEMES } from './constants';
import { checkEligibility, generateSpeech } from './services/geminiService';
import VoiceControl from './components/VoiceControl';
import ProfileForm from './components/ProfileForm';
import ResultCard from './components/ResultCard';
import AuthForm from './components/AuthForm';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Partial<FarmerProfile>>({
    category: 'General',
    landHolding: 0
  });
  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'dashboard'>('input');
  
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    schemesAnalyzed: INITIAL_SCHEMES.length,
    checksPerformed: 0,
    avgResponseTime: '0.0s',
    eligibleCount: 0
  });

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setResults([]);
    setProfile({ category: 'General', landHolding: 0 });
    setActiveTab('input');
  };

  const handleProfileExtracted = (extracted: Partial<FarmerProfile>) => {
    setProfile(prev => ({ ...prev, ...extracted }));
  };

  const handleManualChange = (updates: Partial<FarmerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const runAnalysis = async () => {
    if (!profile.name || !profile.state) {
      alert("Please fill in at least Name and State.");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const eligibilityChecks = INITIAL_SCHEMES.map(scheme => 
        checkEligibility(profile as FarmerProfile, scheme.id)
      );
      
      const res = await Promise.all(eligibilityChecks);
      setResults(res);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      setMetrics(prev => ({
        ...prev,
        checksPerformed: prev.checksPerformed + 1,
        avgResponseTime: `${duration}s`,
        eligibleCount: res.filter(r => r.isEligible).length
      }));

      setActiveTab('results');
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Something went wrong during analysis. Check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloud = async (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <nav className="bg-emerald-900 text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-900 text-2xl font-black">
              NS
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none uppercase">Niti-Setu</h1>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">AI Scheme Eligibility Engine</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-emerald-800 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('input')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'input' ? 'bg-white text-emerald-900 shadow-md' : 'text-emerald-100 hover:bg-emerald-700'}`}
              >
                <i className="fas fa-id-card mr-2"></i>Profile
              </button>
              <button 
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'results' ? 'bg-white text-emerald-900 shadow-md' : 'text-emerald-100 hover:bg-emerald-700'}`}
              >
                <i className="fas fa-check-double mr-2"></i>Results
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'dashboard' ? 'bg-white text-emerald-900 shadow-md' : 'text-emerald-100 hover:bg-emerald-700'}`}
              >
                <i className="fas fa-chart-line mr-2"></i>Dashboard
              </button>
            </div>
            
            <div className="h-8 w-px bg-emerald-700 hidden md:block"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-black text-white uppercase">{user?.name}</div>
                <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest leading-none">Registered Farmer</div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-red-600 transition flex items-center justify-center text-sm"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {activeTab === 'input' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="lg:col-span-4">
              <VoiceControl onProfileExtracted={handleProfileExtracted} />
              <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                <h4 className="text-amber-800 font-bold text-sm mb-1 uppercase">Pro Tip</h4>
                <p className="text-amber-700 text-xs">
                  Speak clearly in English or Hindi. Mention your name, state, and land area for best results.
                </p>
              </div>
            </div>
            <div className="lg:col-span-8">
              <ProfileForm 
                profile={profile} 
                onChange={handleManualChange} 
                onSubmit={runAnalysis} 
              />
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-20 h-20 border-8 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-bold text-slate-800">Analyzing Policy Documents...</h3>
                <p className="text-slate-500 mt-2">Checking farmer profile against real government guidelines.</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Recommended Schemes</h3>
                  <div className="text-xs font-bold text-slate-500">
                    {metrics.eligibleCount} OF {results.length} MATCHED
                  </div>
                </div>
                {results.map((res, i) => (
                  <ResultCard key={i} result={res} onReadAloud={handleReadAloud} />
                ))}
                <button 
                  onClick={() => setActiveTab('input')}
                  className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition"
                >
                  Edit Profile & Re-Analyze
                </button>
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                <i className="fas fa-search text-6xl text-slate-200 mb-4"></i>
                <h3 className="text-xl font-bold text-slate-400">No Analysis Done Yet</h3>
                <button 
                  onClick={() => setActiveTab('input')}
                  className="mt-4 text-emerald-600 font-bold hover:underline"
                >
                  Create a profile to get started
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Schemes Analyzed', val: metrics.schemesAnalyzed, icon: 'fa-file-pdf', color: 'bg-blue-600' },
                { label: 'Checks Performed', val: metrics.checksPerformed, icon: 'fa-user-check', color: 'bg-purple-600' },
                { label: 'Response Time', val: metrics.avgResponseTime, icon: 'fa-bolt', color: 'bg-yellow-500' },
                { label: 'Matches Found', val: metrics.eligibleCount, icon: 'fa-trophy', color: 'bg-emerald-600' },
              ].map((m, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className={`${m.color} w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4`}>
                    <i className={`fas ${m.icon}`}></i>
                  </div>
                  <div className="text-2xl font-black text-slate-800">{m.val}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Schemes Knowledge Base</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase">Scheme</th>
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase">Primary Benefit</th>
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INITIAL_SCHEMES.map((s, idx) => (
                      <tr key={idx} className="border-b border-slate-50 last:border-0">
                        <td className="py-4">
                          <div className="font-bold text-slate-800">{s.name}</div>
                          <div className="text-xs text-slate-500">{s.category}</div>
                        </td>
                        <td className="py-4 text-sm text-slate-600">{s.benefit}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">ACTIVE</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Support */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition active:scale-95 group">
        <i className="fas fa-headset text-2xl"></i>
        <span className="absolute right-full mr-4 bg-slate-800 text-white px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Help Desk</span>
      </button>
    </div>
  );
};

export default App;
