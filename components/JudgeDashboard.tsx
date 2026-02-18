
import React, { useState, useMemo, useEffect } from 'react';
import { CourtCase, CaseStatus, CaseType } from '../types';
import { getStoredCases, CASE_TYPES, addStoredCase, createMockCase, resetStoredCases } from '../constants';
import { generateDailySchedule } from '../services/schedulingService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const JudgeDashboard: React.FC = () => {
  const [allCases, setAllCases] = useState<CourtCase[]>([]);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  // Filter states
  const [filterType, setFilterType] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterProb, setFilterProb] = useState<string>('all');

  const loadCases = () => {
    setAllCases(getStoredCases());
  };

  useEffect(() => {
    loadCases();
  }, []);

  const screeningCases = useMemo(() => {
    return allCases.filter(c => {
      if (c.status !== CaseStatus.FILED) return false;
      
      const typeMatch = filterType === 'all' || c.type === filterType;
      const yearMatch = filterYear === 'all' || c.filingYear.toString() === filterYear;
      
      let probMatch = true;
      if (filterProb === 'high') probMatch = c.settlementProbability >= 0.7;
      else if (filterProb === 'medium') probMatch = c.settlementProbability >= 0.4 && c.settlementProbability < 0.7;
      else if (filterProb === 'low') probMatch = c.settlementProbability < 0.4;

      return typeMatch && yearMatch && probMatch;
    }).slice(0, 15);
  }, [allCases, filterType, filterYear, filterProb]);

  // Optimized Schedule based on already "Scheduled" cases
  const schedule = useMemo(() => 
    generateDailySchedule(allCases.filter(c => c.status === CaseStatus.SCHEDULED || c.status === CaseStatus.LISTED)), 
  [allCases]);

  const stats = {
    pending: allCases.length,
    mediation: allCases.filter(c => c.status === CaseStatus.MEDIATION || c.status === CaseStatus.AWAITING_RESPONSE).length,
    arbitration: allCases.filter(c => c.status === CaseStatus.ARBITRATION || c.status === CaseStatus.ARB_PENDING).length,
    highRisk: allCases.filter(c => c.delayProbability > 0.7).length,
    utilization: Math.min(100, Math.round((schedule.length / 12) * 100))
  };

  const handleDecision = (caseId: string, newStatus: CaseStatus) => {
    const updated = allCases.map(c => 
      c.id === caseId ? { ...c, status: newStatus } : c
    );
    setAllCases(updated);
    localStorage.setItem('nyayaFlowCases', JSON.stringify(updated));
  };

  const handleSimulateBacklog = () => {
    for (let i = 0; i < 10; i++) {
        const nc = createMockCase(allCases.length + i, CaseStatus.FILED);
        addStoredCase(nc);
    }
    loadCases();
  };

  const handleBatchReschedule = () => {
    setIsRescheduling(true);
    // Simulate AI optimization engine
    setTimeout(() => {
      loadCases(); // Refresh data to trigger useMemo re-calc
      setIsRescheduling(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }, 1800);
  };

  const handleReset = () => {
    if (confirm("This will clear your current local database and refill with fresh mock data. Continue?")) {
        resetStoredCases();
        loadCases();
    }
  };

  const chartData = useMemo(() => [
    { name: 'Civil', count: allCases.filter(c => c.type === CaseType.CIVIL).length },
    { name: 'Criminal', count: allCases.filter(c => c.type === CaseType.CRIMINAL).length },
    { name: 'Family', count: allCases.filter(c => c.type === CaseType.FAMILY).length },
    { name: 'Traffic', count: allCases.filter(c => c.type === CaseType.TRAFFIC).length },
    { name: 'Consumer', count: allCases.filter(c => c.type === CaseType.CONSUMER).length }
  ], [allCases]);

  const COLORS = ['#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

  return (
    <div className="space-y-6 relative">
      {/* AI Success Notification */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-[60] bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <div className="bg-white/20 p-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest">AI Optimization Complete</p>
            <p className="text-[10px] opacity-80 font-bold uppercase">Cause List reorganized for priority & capacity.</p>
          </div>
        </div>
      )}

      {/* Header with Admin Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">Judicial Control Panel</h2>
        <div className="flex gap-2">
            <button 
                onClick={handleSimulateBacklog}
                className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-sm rounded-sm"
            >
                Add 10 Filed Cases
            </button>
            <button 
                onClick={handleReset}
                className="px-4 py-2 border border-slate-300 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition rounded-sm"
            >
                Reset Database
            </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Cases in ODR', value: stats.mediation + stats.arbitration, color: 'text-green-600' },
          { label: 'Total Pending', value: stats.pending, color: 'text-blue-600' },
          { label: 'High Delay Risk', value: stats.highRisk, color: 'text-red-600' },
          { label: 'Schedule Load', value: `${stats.utilization}%`, color: 'text-amber-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: New Cases Awaiting Decision */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
            <div className="border-b pb-4 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">
                  New Cases Awaiting Resolution Decision
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Judicial Screening Bench</p>
              </div>
              <span className="bg-red-50 text-red-700 px-3 py-1 rounded text-[10px] font-black uppercase border border-red-100 self-start md:self-center">
                Action Required ({screeningCases.length})
              </span>
            </div>

            {/* Filtering Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 bg-slate-50 p-4 border border-slate-100 rounded-lg">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Case Type</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded outline-none focus:border-indigo-300 font-medium"
                >
                  <option value="all">All Types</option>
                  {CASE_TYPES.map(type => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Filing Year</label>
                <select 
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded outline-none focus:border-indigo-300 font-medium"
                >
                  <option value="all">All Years</option>
                  {[2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">AI Settle Prob</label>
                <select 
                  value={filterProb}
                  onChange={(e) => setFilterProb(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded outline-none focus:border-indigo-300 font-medium"
                >
                  <option value="all">Any Probability</option>
                  <option value="high">High ({'>'}70%)</option>
                  <option value="medium">Medium (40-70%)</option>
                  <option value="low">Low (&lt;40%)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {screeningCases.length > 0 ? screeningCases.map(c => (
                <div key={c.id} className="p-5 border border-slate-100 bg-slate-50 rounded-lg hover:border-indigo-200 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase">{c.type}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded uppercase">{c.filingYear}</span>
                        <span className="text-xs font-mono font-bold text-slate-400">{c.id}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 line-clamp-1">{c.description}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">AI Settle Prob</p>
                      <p className={`text-lg font-black ${c.settlementProbability >= 0.7 ? 'text-green-600' : c.settlementProbability >= 0.4 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {Math.round(c.settlementProbability * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDecision(c.id, CaseStatus.MEDIATION)}
                      className="flex-1 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition"
                    >
                      Refer to Mediation
                    </button>
                    <button 
                      onClick={() => handleDecision(c.id, CaseStatus.ARBITRATION)}
                      className="flex-1 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition"
                    >
                      Refer to Arbitration
                    </button>
                    <button 
                      onClick={() => handleDecision(c.id, CaseStatus.SCHEDULED)}
                      className="flex-1 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition"
                    >
                      Proceed to Trial
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-slate-400 italic text-sm border-2 border-dashed border-slate-100 rounded-lg">
                  No cases found matching the selected criteria.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
             <div className="border-b pb-4 mb-6 flex justify-between items-center">
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">
                ODR Settlement Verifications
              </h2>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded text-[10px] font-black uppercase border border-green-100">
                Awaiting Consent Orders
              </span>
            </div>
            <div className="divide-y">
              {allCases.filter(c => c.status === CaseStatus.SETTLED).slice(0, 3).map(c => (
                <div key={c.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-mono font-bold text-slate-400">{c.id}</p>
                    <p className="text-sm font-bold text-slate-800">{c.petitioner} vs {c.respondent}</p>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition">
                    Pass Consent Order
                  </button>
                </div>
              ))}
              {allCases.filter(c => c.status === CaseStatus.SETTLED).length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs italic">No settlements awaiting consent orders.</div>
              )}
            </div>
          </div>

          {/* Optimized Daily Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 mb-6 border-b pb-4">
              Current Hearing Cause List
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-3">
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Case Ref</th>
                    <th className="pb-3">Matter</th>
                    <th className="pb-3 text-center">Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {schedule.map((slot) => (
                    <tr key={slot.id} className={`${slot.isBuffer ? 'bg-amber-50/50' : 'hover:bg-slate-50'}`}>
                      <td className="py-4 font-bold text-slate-600">
                        {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black font-mono border ${slot.isBuffer ? 'text-amber-600 border-amber-200' : 'bg-white border-slate-200 text-slate-500'}`}>
                          {slot.isBuffer ? 'SYSTEM_BUFFER' : slot.caseId}
                        </span>
                      </td>
                      <td className="py-4 text-slate-700 font-medium">{slot.caseTitle}</td>
                      <td className="py-4">
                        {!slot.isBuffer && (
                          <div className="flex justify-center">
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map(i => (
                                <div key={i} className={`w-3 h-1.5 rounded-full ${slot.delayProbability * 3 >= i ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Distribution Charts & AI Recommendations */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 mb-6">Case Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-xl shadow-xl text-white">
             <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${isRescheduling ? 'bg-indigo-400 animate-ping' : 'bg-green-400'}`}></span>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">
                  {isRescheduling ? 'AI Engine Processing' : 'Decision Engine Active'}
                </h3>
             </div>
             <p className="text-sm leading-relaxed mb-6 text-slate-300">
               Automated scheduling algorithm suggests prioritized slots for <strong>Criminal</strong> matters in <strong>Court Room 4</strong> due to impending detention deadlines.
             </p>
             <button 
               onClick={handleBatchReschedule}
               disabled={isRescheduling}
               className={`w-full py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition shadow-lg relative overflow-hidden ${isRescheduling ? 'opacity-80 cursor-not-allowed' : ''}`}
             >
               {isRescheduling ? (
                 <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Optimizing Cause List...
                 </span>
               ) : (
                 'Authorize Batch Rescheduling'
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeDashboard;
