
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onLogout }) => {
  const getGreeting = () => {
    switch(role) {
      case UserRole.JUDGE: return "Welcome Judge — Today's Court Status";
      case UserRole.LAWYER: return "Welcome Advocate — Your Hearings & Cases";
      case UserRole.MEDIATOR: return "Welcome Mediator — Negotiation Workspace";
      case UserRole.ARBITRATOR: return "Welcome Arbitrator — Decision Panel";
      case UserRole.CITIZEN: return "Welcome — Track and Manage Your Case";
      default: return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 text-white p-2 rounded-lg font-bold text-xl">NF</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">NyayaFlow</h1>
              <p className="text-[10px] text-indigo-300 font-bold uppercase mt-0.5 tracking-tighter">AI Justice Prototype</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-xs font-medium text-slate-400">{getGreeting()}</span>
            <button 
              onClick={onLogout}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition text-xs font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="bg-white border-t p-4 text-center text-slate-500 text-[10px] uppercase tracking-widest font-bold">
        NyayaFlow &copy; 2025 - Optimized Judicial Workspace Prototype
      </footer>
    </div>
  );
};

export default Layout;
