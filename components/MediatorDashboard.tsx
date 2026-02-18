
import React, { useState, useEffect, useMemo } from 'react';
import { CourtCase, CaseStatus, CaseType } from '../types';
import { getStoredCases, updateStoredCase } from '../constants';
import { generateMediationAgreement } from '../services/geminiService';

const MediatorDashboard: React.FC = () => {
  const [cases, setCases] = useState<CourtCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementText, setAgreementText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadedCases = getStoredCases();
    setCases(loadedCases);
    // Auto-select first mediation case if none selected
    const mediationCases = loadedCases.filter(c => c.status === CaseStatus.MEDIATION);
    if (mediationCases.length > 0 && !selectedCaseId) {
      setSelectedCaseId(mediationCases[0].id);
    }
  }, []);

  const mediationCases = useMemo(() => 
    cases.filter(c => c.status === CaseStatus.MEDIATION || c.status === CaseStatus.AWAITING_RESPONSE),
    [cases]
  );

  const selectedCase = useMemo(() => 
    cases.find(c => c.id === selectedCaseId),
    [selectedCaseId, cases]
  );

  const handleUpdateStatus = (newStatus: CaseStatus) => {
    if (!selectedCase) return;
    
    // Special handling for Settlement Successful
    if (newStatus === CaseStatus.SETTLED) {
      handleSettlementSuccessful();
      return;
    }

    const updated = { ...selectedCase, status: newStatus };
    updateStoredCase(updated);
    
    // Refresh local state
    setCases(getStoredCases());
    setNotes("");
    
    // If case is no longer in mediation, deselect it
    if (newStatus !== CaseStatus.MEDIATION && newStatus !== CaseStatus.AWAITING_RESPONSE) {
      setSelectedCaseId(null);
    }
  };

  const handleSettlementSuccessful = async () => {
    if (!selectedCase) return;
    setIsGenerating(true);
    try {
      const text = await generateMediationAgreement(selectedCase, notes);
      setAgreementText(text);
      setShowAgreementModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to generate agreement.");
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmSettlement = () => {
    if (!selectedCase) return;
    const updated = { ...selectedCase, status: CaseStatus.SETTLED };
    updateStoredCase(updated);
    setCases(getStoredCases());
    setNotes("");
    setSelectedCaseId(null);
    setShowAgreementModal(false);
  };

  const printAgreement = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Settlement Agreement - ${selectedCase?.id}</title>
            <style>
              body { font-family: serif; padding: 40px; line-height: 1.6; }
              pre { white-space: pre-wrap; font-family: serif; font-size: 14px; }
              .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>SETTLEMENT AGREEMENT</h2>
              <p>PRE-TRIAL MEDIATION CENTRE</p>
              <p>DISTRICT COURT COMPLEX</p>
            </div>
            <pre>${agreementText}</pre>
            <div style="margin-top: 100px; display: flex; justify-content: space-between;">
              <div style="border-top: 1px solid #000; width: 200px; text-align: center;">Signature of Petitioner</div>
              <div style="border-top: 1px solid #000; width: 200px; text-align: center;">Signature of Respondent</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-180px)] animate-in fade-in duration-500 relative">
      
      {/* Settlement Agreement Modal */}
      {showAgreementModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-300">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Settlement Agreement Preview</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{selectedCase?.id}</p>
              </div>
              <button onClick={() => setShowAgreementModal(false)} className="text-slate-400 hover:text-slate-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 md:p-12 font-serif text-slate-800 bg-[#fdfdfd]">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center border-b-2 border-slate-900 pb-8 mb-8">
                  <h1 className="text-xl font-bold uppercase tracking-tighter">Memorandum of Settlement</h1>
                  <p className="text-xs uppercase mt-2 tracking-widest">Before the Mediation Centre, District & Sessions Court</p>
                </div>
                
                <div className="whitespace-pre-wrap leading-relaxed text-sm">
                  {agreementText}
                </div>

                <div className="mt-20 pt-10 border-t border-slate-200 grid grid-cols-2 gap-20">
                  <div className="text-center">
                    <div className="h-px bg-slate-400 mb-2"></div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Petitioner Signature</p>
                    <p className="text-xs mt-1 font-bold">{selectedCase?.petitioner}</p>
                  </div>
                  <div className="text-center">
                    <div className="h-px bg-slate-400 mb-2"></div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Respondent Signature</p>
                    <p className="text-xs mt-1 font-bold">{selectedCase?.respondent}</p>
                  </div>
                </div>

                <div className="mt-12 text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] border-y py-4 border-slate-100">
                  Certified by NyayaFlow Mediation System
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={printAgreement}
                className="px-6 py-2 border border-slate-800 text-slate-800 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition"
              >
                Download Agreement (PDF)
              </button>
              <button 
                onClick={confirmSettlement}
                className="px-8 py-2 bg-green-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-800 transition shadow-lg"
              >
                Confirm & Dispose Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel: Cases Referred for Mediation */}
      <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-widest">Cases Referred for Mediation</h2>
          <span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded font-bold">{mediationCases.length} ACTIVE</span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mediationCases.length > 0 ? (
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Case No</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Parties</th>
                  <th className="px-4 py-3 text-right">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {mediationCases.map(c => (
                  <tr 
                    key={c.id} 
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`cursor-pointer transition-colors ${selectedCaseId === c.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-4 font-mono font-bold text-slate-900">{c.id}</td>
                    <td className="px-4 py-4 capitalize text-slate-500">{c.type}</td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-700 truncate max-w-[120px]">{c.petitioner}</p>
                      <p className="text-[10px] text-slate-400">vs {c.respondent}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className={`p-1.5 rounded transition ${selectedCaseId === c.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-indigo-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <span className="text-4xl mb-4">📂</span>
              <p className="font-bold uppercase text-[10px] tracking-widest">No cases currently in mediation</p>
              <p className="text-xs mt-2">Check the judicial screening pool for incoming referrals.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Case Details & Actions */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {selectedCase ? (
          <>
            <div className="bg-white border border-slate-200 shadow-sm p-8">
              <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-tighter">Case Reference</span>
                    <span className="text-[10px] font-bold text-indigo-600 font-mono">{selectedCase.id}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Mediation Workspace</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${selectedCase.status === CaseStatus.AWAITING_RESPONSE ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {selectedCase.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Parties Involved</p>
                    <div className="bg-slate-50 p-4 rounded border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600">Petitioner</span>
                        <span className="text-xs text-slate-900 font-black underline decoration-indigo-300">{selectedCase.petitioner}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600">Respondent</span>
                        <span className="text-xs text-slate-900 font-black underline decoration-slate-300">{selectedCase.respondent}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Claim Amount</p>
                    <p className="text-2xl font-black text-indigo-600">₹{selectedCase.claimAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Facts Summary</p>
                  <div className="bg-slate-50 p-4 rounded border border-slate-100 min-h-[100px]">
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{selectedCase.description}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mediator Notes / Proposed Terms</label>
                  <span className="text-[10px] text-slate-300 italic">Confidential Internal Draft</span>
                </div>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter chronological negotiation progress, points of contention, or proposed settlement terms here..."
                  className="w-full h-32 p-4 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition resize-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                <button 
                  onClick={() => handleUpdateStatus(CaseStatus.AWAITING_RESPONSE)}
                  className="py-4 bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition shadow-sm"
                >
                  Propose Settlement
                </button>
                <button 
                  onClick={() => handleUpdateStatus(CaseStatus.SETTLED)}
                  disabled={isGenerating}
                  className="py-4 bg-green-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-800 transition shadow-sm disabled:opacity-50"
                >
                  {isGenerating ? "Processing..." : "Settlement Successful"}
                </button>
                <button 
                  onClick={() => handleUpdateStatus(CaseStatus.LISTED)}
                  className="py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition shadow-sm"
                >
                  Mediation Failed
                </button>
                <button 
                  onClick={() => handleUpdateStatus(CaseStatus.ARB_PENDING)}
                  className="py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-sm"
                >
                  Refer to Arb
                </button>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 uppercase tracking-widest text-center">
              All mediation interactions are recorded as part of the Pre-Trial ADR process.
            </div>
          </>
        ) : (
          <div className="flex-1 bg-white border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-slate-300">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <p className="font-bold uppercase tracking-widest text-[10px]">Select a case from the list to begin mediation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediatorDashboard;
