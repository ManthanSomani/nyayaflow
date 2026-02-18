
import React, { useState } from 'react';
import { CourtCase, CaseStatus } from '../types';
import { MOCK_CASES } from '../constants';
import { generateMediationAgreement } from '../services/geminiService';

const LegalProfessionalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'cases' | 'mediation'>('schedule');
  const [unavailable, setUnavailable] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [agreement, setAgreement] = useState<string | null>(null);

  const myCases = MOCK_CASES.slice(0, 5);

  const handleGenerateAgreement = async (c: CourtCase) => {
    setIsGenerating(true);
    const text = await generateMediationAgreement(c);
    setAgreement(text);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Advocate</h2>
          <p className="text-slate-500">Track your active litigation and courtroom hearings.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
           <span className="text-sm font-medium text-slate-600">Availability Status</span>
           <button 
             onClick={() => setUnavailable(!unavailable)}
             className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${unavailable ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-green-100 text-green-600 border border-green-200'}`}
           >
             {unavailable ? 'Unavailable' : 'Available'}
           </button>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-200 p-1 rounded-lg w-fit">
        {['schedule', 'cases', 'mediation'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-md text-sm font-medium capitalize transition ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-[400px]">
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <h3 className="font-bold border-b pb-2">Today's Hearings</h3>
            {myCases.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white">
                <div className="text-center min-w-[80px]">
                  <p className="text-xl font-bold text-slate-800">{10 + i}:00</p>
                  <p className="text-xs text-slate-500">AM</p>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{c.type.toUpperCase()} - {c.id}</p>
                  <p className="text-sm text-slate-500">Courtroom 14 • District Court</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">Scheduled</span>
                  <p className="text-xs text-slate-400 mt-1">Est. 25 mins</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50 border-b text-sm">
                 <tr>
                   <th className="p-4">Case Details</th>
                   <th className="p-4">Status</th>
                   <th className="p-4">Next Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y text-sm">
                 {myCases.map(c => (
                   <tr key={c.id}>
                     <td className="p-4">
                        <p className="font-bold">{c.id}</p>
                        <p className="text-xs text-slate-500">{c.type}</p>
                     </td>
                     <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold uppercase">{c.status}</span>
                     </td>
                     <td className="p-4">
                        <button className="text-indigo-600 hover:underline">Update Outcome</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'mediation' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-4">
               <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 text-xl font-bold">AI</div>
               <div>
                  <h4 className="font-bold text-indigo-900">ODR Assistant Enabled</h4>
                  <p className="text-sm text-indigo-700">NyayaFlow suggests starting settlement talks for civil disputes under ₹50,000.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold">Active ODR Sessions</h3>
                {myCases.filter(c => c.type === 'civil').map(c => (
                  <div key={c.id} className="p-4 border rounded-lg hover:border-indigo-300 transition">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold">{c.id}</p>
                      <span className="text-xs text-green-600 font-bold">{Math.round(c.settlementProbability * 100)}% Success Rate</span>
                    </div>
                    <button 
                      onClick={() => handleGenerateAgreement(c)}
                      disabled={isGenerating}
                      className="w-full py-2 bg-slate-900 text-white rounded-sm text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                    >
                      {isGenerating ? 'Generating Draft...' : 'Generate Settlement Draft'}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="font-bold mb-4">Agreement Preview</h3>
                {agreement ? (
                  <div className="text-xs font-mono bg-white p-4 rounded border whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {agreement}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm border-2 border-dashed rounded italic">
                    Generate a draft to see preview here
                  </div>
                )}
                {agreement && (
                  <button className="w-full mt-4 py-2 border-2 border-slate-900 rounded-sm text-sm font-bold hover:bg-slate-900 hover:text-white transition">
                    Download PDF for Signing
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalProfessionalDashboard;
