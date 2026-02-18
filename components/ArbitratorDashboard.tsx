
import React, { useState } from 'react';
import { MOCK_CASES } from '../constants';
import { CaseType } from '../types';

const ArbitratorDashboard: React.FC = () => {
  const [activeCase, setActiveCase] = useState(MOCK_CASES[0]);
  const [decision, setDecision] = useState<string | null>(null);

  const handleDecision = (type: string) => {
    setDecision(`FINAL ARBITRAL AWARD: After reviewing evidence for ${activeCase.id}, a decision is rendered in ${type}. This decision is legally binding and will be entered into the court record.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Arbitration Decision Panel</h2>
          <p className="text-slate-500 text-sm">Review case evidence and render binding arbitral awards.</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
           <span className="text-xs font-bold uppercase">4 Pending Awards</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Pending Queue</h3>
          <div className="space-y-2">
            {MOCK_CASES.slice(0, 5).map(c => (
              <button 
                key={c.id}
                onClick={() => {setActiveCase(c); setDecision(null);}}
                className={`w-full text-left p-4 rounded-xl border transition ${activeCase.id === c.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}`}
              >
                <p className="text-xs font-bold opacity-70 mb-1">{c.id}</p>
                <p className="text-sm font-bold capitalize">{c.type} Dispute</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex justify-between items-start mb-8 border-b pb-6">
               <div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Review Case: {activeCase.id}</h3>
                 <p className="text-xs text-slate-400 mt-1 font-mono">DISTRICT COURT ARBITRATION DIVISION</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Claim Value</p>
                  <p className="text-xl font-bold text-indigo-600">₹{activeCase.claimAmount.toLocaleString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase">Evidence Summary</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
                   <ul className="list-disc list-inside space-y-2 italic">
                     <li>Digital receipt of transaction verified.</li>
                     <li>Communication logs show 3 attempts to resolve.</li>
                     <li>Physical damage assessment uploaded by inspector.</li>
                   </ul>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase">NyayaFlow AI Recommendation</h4>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                   <div className="flex justify-between mb-2">
                     <span className="text-xs font-bold text-indigo-900">Confidence Score</span>
                     <span className="text-xs font-black text-indigo-600">92%</span>
                   </div>
                   <p className="text-xs text-indigo-800 leading-relaxed">
                     Based on past precedents for {activeCase.type} cases with similar evidence, a **partial award (70%)** to the petitioner is recommended.
                   </p>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-6">
              {decision ? (
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl animate-in zoom-in-95">
                   <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                     <span className="text-xl">📜</span> DECISION LOGGED
                   </h4>
                   <p className="text-sm text-green-800 font-mono italic">{decision}</p>
                   <button onClick={() => setDecision(null)} className="mt-4 text-[10px] font-bold uppercase text-green-600 hover:underline">Revise Decision</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Render Final Award</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={() => handleDecision('FAVOR OF PETITIONER')} className="p-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">FAVOR A</button>
                    <button onClick={() => handleDecision('FAVOR OF RESPONDENT')} className="p-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">FAVOR B</button>
                    <button onClick={() => handleDecision('PARTIAL AWARD')} className="p-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition">PARTIAL</button>
                    <button onClick={() => handleDecision('REFERRED TO COURT')} className="p-4 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition">SEND BACK</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbitratorDashboard;
