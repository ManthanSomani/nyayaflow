
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.NONE);
  const [idNumber, setIdNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === UserRole.NONE) return;
    
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      localStorage.setItem('userRole', selectedRole);
      onLogin(selectedRole);
    }, 1500);
  };

  if (isVerifying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-bold text-slate-700">Verifying identity...</p>
        <p className="text-sm text-slate-500">Connecting to National Judicial Database</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      <div className="text-center mb-8">
        <div className="bg-[#1a365d] text-white p-3 rounded-xl inline-block mb-4">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 2.32a1 1 0 01-.16 1.397l-1.414 1.06a1 1 0 01-1.207-.059l-1.422-1.067-2.121.848v3.626l1.323.529a1 1 0 11-.746 1.86l-1.323-.529-1.323.529a1 1 0 11-.746-1.86l1.323-.529v-3.626l-2.121-.848-1.422-1.067a1 1 0 01-1.207.059l-1.414-1.06a1 1 0 01-.16-1.397l1.738-2.32-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1zM5 11v2a1 1 0 11-2 0v-2a1 1 0 112 0zm12 0v2a1 1 0 11-2 0v-2a1 1 0 112 0z" clipRule="evenodd" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Portal Verification</h2>
        <p className="text-sm text-slate-500 mt-1">Simulated identity check for prototype demo</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Select Portal Role</label>
          <select 
            required
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium"
          >
            <option value={UserRole.NONE}>Choose Role...</option>
            <option value={UserRole.CITIZEN}>Citizen</option>
            <option value={UserRole.LAWYER}>Lawyer</option>
            <option value={UserRole.MEDIATOR}>Mediator</option>
            <option value={UserRole.ARBITRATOR}>Arbitrator</option>
            <option value={UserRole.JUDGE}>Judge</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Identification Number</label>
          <input 
            required
            type="text"
            placeholder="e.g. AADHAR / BAR-ID / STAFF-NO"
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Mobile Number</label>
          <input 
            required
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button 
            type="submit"
            className="w-full py-4 bg-[#1a365d] text-white rounded-xl font-bold hover:bg-[#122a4a] transition shadow-lg shadow-indigo-100"
          >
            VERIFY & ENTER
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-slate-400 text-sm font-medium hover:text-slate-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
