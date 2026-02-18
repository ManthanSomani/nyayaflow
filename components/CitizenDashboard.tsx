
import React, { useState } from 'react';
import { CaseType, CaseStatus, CourtCase } from '../types';
import { addStoredCase } from '../constants';

interface CourtFormState {
  state: string;
  district: string;
  court: string;
  caseCategory: CaseType | '';
  petitionerName: string;
  petitionerContact: string;
  respondentName: string;
  respondentContact: string;
  caseDescription: string;
  reliefRequested: string;
  resolutionMethod: 'mediation' | 'arbitration' | 'trial' | '';
  documents: {
    idProof: string | null;
    evidence: string | null;
    vakalatnama: string | null;
  };
}

const CitizenDashboard: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCaseId, setGeneratedCaseId] = useState('');
  const [form, setForm] = useState<CourtFormState>({
    state: '',
    district: '',
    court: '',
    caseCategory: '',
    petitionerName: '',
    petitionerContact: '',
    respondentName: '',
    respondentContact: '',
    caseDescription: '',
    reliefRequested: '',
    resolutionMethod: '',
    documents: {
      idProof: null,
      evidence: null,
      vakalatnama: null,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({
        ...prev,
        documents: { ...prev.documents, [name]: files[0].name },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate automated routing to Judicial Screening
    setTimeout(() => {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 9000 + 1000);
      const districtCode = form.district.substring(0, 2).toUpperCase() || 'DL';
      const caseId = `NF/${year}/${districtCode}/${randomNum}`;
      
      const newCase: CourtCase = {
        id: caseId,
        type: (form.caseCategory as CaseType) || CaseType.CIVIL,
        description: form.caseDescription,
        filingYear: year,
        ageDays: 1,
        claimAmount: 50000, 
        previousAdjournments: 0,
        lawyerExperienceYears: 5,
        lawyerReliability: 0.8,
        opposingLawyerReliability: 0.8,
        witnessRequired: false,
        policeReportPending: false,
        documentCompleteness: 0.9,
        workloadToday: 50,
        status: CaseStatus.FILED,
        petitioner: form.petitionerName,
        respondent: form.respondentName,
        settlementProbability: form.caseCategory === CaseType.CIVIL ? 0.75 : 0.2,
        delayProbability: 0.1,
        estimatedDurationMinutes: 20,
        priorityScore: 0
      };

      addStoredCase(newCase);
      
      setGeneratedCaseId(caseId);
      setIsProcessing(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Routing to Judicial Registry...</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium italic">Assigning to Pre-Admission Judicial Screening Bench.</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="bg-white border-2 border-slate-800 p-10 shadow-2xl relative overflow-hidden">
          {/* Watermark/Stamp effect */}
          <div className="absolute top-10 right-10 opacity-10 rotate-12 pointer-events-none select-none">
            <div className="border-8 border-slate-800 p-4 rounded-full">
              <span className="text-6xl font-black uppercase">E-FILING</span>
            </div>
          </div>

          <div className="border-b-4 border-slate-800 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Digital Filing Receipt</h1>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Integrated Judicial Case Management System</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Acknowledgment No.</span>
              <span className="text-2xl font-mono font-bold text-indigo-700 bg-indigo-50 px-4 py-1 border border-indigo-200">{generatedCaseId}</span>
            </div>
          </div>
          
          <div className="space-y-10">
            {/* Status Phase */}
            <div className="p-6 bg-slate-900 text-white rounded-lg flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Current Process Phase</p>
                 <h3 className="text-xl font-black uppercase tracking-tight">Pre-Admission Judicial Screening</h3>
              </div>
              <div className="bg-indigo-500 px-4 py-2 rounded font-black text-xs uppercase animate-pulse">
                Active
              </div>
            </div>

            {/* Grid Layout for Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* Jurisdiction Section */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-1">I. Jurisdictional Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">State</p>
                    <p className="font-bold text-slate-900">{form.state}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">District</p>
                    <p className="font-bold text-slate-900">{form.district}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Court Complex / Room</p>
                    <p className="font-bold text-slate-900">{form.court}</p>
                  </div>
                </div>
              </section>

              {/* Party Section */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-1">II. Litigant Profiles</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Petitioner</p>
                      <p className="font-bold text-slate-900 truncate">{form.petitionerName}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{form.petitionerContact}</p>
                    </div>
                    <div className="flex-none self-center text-slate-300 font-black italic">vs</div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Respondent</p>
                      <p className="font-bold text-slate-900 truncate">{form.respondentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{form.respondentContact || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Subject Matter Section */}
              <section className="space-y-4 md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-1">III. Subject Matter & Facts</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Litigation Category</p>
                    <p className="text-xs font-black bg-slate-900 text-white inline-block px-2 py-1 rounded mt-1 uppercase tracking-widest">{form.caseCategory}</p>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Brief Statement of Facts</p>
                      <p className="text-sm text-slate-700 italic leading-relaxed">"{form.caseDescription}"</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Relief Requested</p>
                      <p className="text-sm font-black text-indigo-700">{form.reliefRequested}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Documentation Section */}
              <section className="space-y-4 md:col-span-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-1">IV. Evidence & Scanned Records</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(form.documents).map(([key, value]) => (
                    <div key={key} className={`p-3 border rounded-lg flex items-center gap-3 ${value ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
                      <span className="text-xl">{value ? '✅' : '📁'}</span>
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-[11px] font-bold text-slate-700 truncate max-w-[140px]">{value || 'Not Provided'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Note Section */}
            <div className="p-6 bg-amber-50 border-l-4 border-amber-400">
               <p className="text-xs text-amber-900 leading-relaxed font-medium">
                 <span className="font-bold uppercase tracking-wider">Note:</span> Your case is now queued for judicial analysis. AI-assisted prioritization will evaluate your submission against current workload indices and the complexity of the matter. You will be notified of the screening outcome (referral to ODR or trial listing) within 24-48 business hours.
               </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">Generated on {new Date().toLocaleString()}</p>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="px-8 py-3 border-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition">Print Full Summary</button>
              <button onClick={() => setIsSubmitted(false)} className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-xl">File Another Matter</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-8 border-b border-slate-300 pb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Form 1: E-Filing of New Litigation</h1>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">District & Sessions Court | Integrated Filing Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-300 shadow-sm overflow-hidden">
        {/* Section A: Jurisdiction */}
        <div className="bg-slate-50 border-b border-slate-300 px-6 py-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Section A: Jurisdictional Information</h3>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <label className="text-xs font-bold text-slate-600 uppercase">State Selection <span className="text-red-500">*</span></label>
            <select name="state" required value={form.state} onChange={handleInputChange} className="w-full p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none">
              <option value="">-- Select State --</option>
              <option value="Delhi">NCT of Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <label className="text-xs font-bold text-slate-600 uppercase">District & Court Complex <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <select name="district" required value={form.district} onChange={handleInputChange} className="flex-1 p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none">
                <option value="">District</option>
                <option value="Central">Central</option>
                <option value="South">South</option>
                <option value="North">North</option>
              </select>
              <select name="court" required value={form.court} onChange={handleInputChange} className="flex-1 p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none">
                <option value="">Court Room</option>
                <option value="CR12">CR-12</option>
                <option value="CR14">CR-14</option>
                <option value="CR15">CR-15</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section B: Party Details */}
        <div className="bg-slate-50 border-y border-slate-300 px-6 py-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Section B: Party Details</h3>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase border-b pb-1">Petitioner (Applicant)</p>
              <input type="text" name="petitionerName" required placeholder="Full Name" value={form.petitionerName} onChange={handleInputChange} className="w-full p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none" />
              <input type="tel" name="petitionerContact" required placeholder="Mobile Number" value={form.petitionerContact} onChange={handleInputChange} className="w-full p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none" />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase border-b pb-1">Respondent (Opposite Party)</p>
              <input type="text" name="respondentName" required placeholder="Full Name / Entity" value={form.respondentName} onChange={handleInputChange} className="w-full p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none" />
              <input type="text" name="respondentContact" placeholder="Address / Contact (Optional)" value={form.respondentContact} onChange={handleInputChange} className="w-full p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none" />
            </div>
          </div>
        </div>

        {/* Section C: Case Subject Matter */}
        <div className="bg-slate-50 border-y border-slate-300 px-6 py-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Section C: Case Subject Matter</h3>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <label className="text-xs font-bold text-slate-600 uppercase">Litigation Category <span className="text-red-500">*</span></label>
            <select name="caseCategory" required value={form.caseCategory} onChange={handleInputChange} className="w-full p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none">
              <option value="">-- Select Category --</option>
              {Object.values(CaseType).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <label className="text-xs font-bold text-slate-600 uppercase">Brief Statement of Facts <span className="text-red-500">*</span></label>
            <textarea name="caseDescription" required rows={4} value={form.caseDescription} onChange={handleInputChange} className="w-full p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none" placeholder="Provide a chronological summary of the dispute..."></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <label className="text-xs font-bold text-slate-600 uppercase">Relief Requested from Court <span className="text-red-500">*</span></label>
            <textarea name="reliefRequested" required rows={3} value={form.reliefRequested} onChange={handleInputChange} className="w-full p-2 border border-slate-300 text-sm focus:border-slate-800 outline-none" placeholder="State clearly what relief/compensation you seek..."></textarea>
          </div>
        </div>

        {/* Section D: Document Upload */}
        <div className="bg-slate-50 border-y border-slate-300 px-6 py-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Section D: Document Scanned Attachments</h3>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Identity Proof <span className="text-red-500">*</span></label>
              <input type="file" name="idProof" required onChange={handleFileChange} className="text-xs w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800" />
              {form.documents.idProof && <p className="text-[10px] text-green-600 font-medium">Selected: {form.documents.idProof}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Primary Evidence <span className="text-red-500">*</span></label>
              <input type="file" name="evidence" required onChange={handleFileChange} className="text-xs w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800" />
              {form.documents.evidence && <p className="text-[10px] text-green-600 font-medium">Selected: {form.documents.evidence}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Vakalatnama (Optional)</label>
              <input type="file" name="vakalatnama" onChange={handleFileChange} className="text-xs w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800" />
              {form.documents.vakalatnama && <p className="text-[10px] text-green-600 font-medium">Selected: {form.documents.vakalatnama}</p>}
            </div>
          </div>
        </div>

        {/* Submission Actions */}
        <div className="border-t border-slate-300 p-8 flex justify-end gap-4 bg-slate-50">
          <button type="button" onClick={() => window.history.back()} className="px-6 py-2 text-xs font-bold text-slate-500 uppercase hover:text-slate-800">Clear Form</button>
          <button type="submit" className="px-10 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-lg">Submit E-Filing</button>
        </div>
      </form>
    </div>
  );
};

export default CitizenDashboard;
