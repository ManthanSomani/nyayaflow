
import React from 'react';

interface HomeProps {
  onGoToLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ onGoToLogin }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* MAIN NAVIGATION BAR */}
      <nav className="gov-nav sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="bg-[#1a365d] text-white p-2 rounded shadow-sm">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 2.32a1 1 0 01-.16 1.397l-1.414 1.06a1 1 0 01-1.207-.059l-1.422-1.067-2.121.848v3.626l1.323.529a1 1 0 11-.746 1.86l-1.323-.529-1.323.529a1 1 0 11-.746-1.86l1.323-.529v-3.626l-2.121-.848-1.422 1.067a1 1 0 01-1.207.059l-1.414-1.06a1 1 0 01-.16-1.397l1.738-2.32-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1zM5 11v2a1 1 0 11-2 0v-2a1 1 0 112 0zm12 0v2a1 1 0 11-2 0v-2a1 1 0 112 0z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a365d] leading-none">NyayaFlow</h2>
              <p className="text-[10px] uppercase font-bold text-slate-500 mt-1 tracking-widest">Digital Justice Assistance System</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {['Home', 'Mediation', 'Court Schedule', 'Advocates', 'Help'].map(item => (
              <a key={item} href="#" onClick={(e) => {e.preventDefault(); onGoToLogin();}} className="nav-link">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={onGoToLogin}
                className="bg-[#1a365d] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#122a4a] transition shadow-md"
             >
                PORTAL LOGIN
             </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="gov-banner py-24 md:py-32 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="hero-title mb-6">Smarter Courts. Faster Justice.</h1>
          <p className="hero-subtitle text-slate-200">
            A specialized prototype demo for AI-assisted case scheduling and Online Dispute Resolution (ODR).
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onGoToLogin}
              className="btn-gov-primary px-10 py-4 shadow-xl shadow-maroon-900/30"
            >
              File a Case
            </button>
            <button 
              onClick={onGoToLogin}
              className="btn-gov-secondary px-10 py-4 hover:bg-white/10 backdrop-blur-sm"
            >
              Track Case Status
            </button>
          </div>
        </div>
      </div>

      {/* QUICK SERVICES PANEL */}
      <div className="container mx-auto px-4 -mt-16 mb-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'File Complaint', icon: '📝' },
            { label: 'Case Status', icon: '🔍' },
            { label: 'Mediation', icon: '🤝' },
            { label: 'Cause List', icon: '📅' },
            { label: 'Advocates', icon: '💼' },
            { label: 'Arbitration', icon: '⚖️' },
          ].map((service, i) => (
            <button 
              key={i} 
              onClick={onGoToLogin}
              className="service-card flex flex-col items-center justify-center bg-white p-8 border border-slate-200 hover:border-indigo-400 shadow-sm transition-all"
            >
              <span className="text-4xl mb-4">{service.icon}</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="container mx-auto px-4 pb-24 max-w-4xl text-center">
        <h3 className="section-heading mx-auto">About NyayaFlow</h3>
        <p className="text-slate-600 leading-relaxed text-lg mt-4">
          NyayaFlow is an integrated judicial management system designed to alleviate the burden on Indian district courts. 
          Using AI-driven scheduling and automated ODR workflows, the platform ensures that urgent matters receive timely 
          hearings while civil disputes are settled through efficient mediation and arbitration.
        </p>
      </div>

      {/* SIMPLE FOOTER */}
      <footer className="bg-slate-900 py-12 mt-auto text-slate-400">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 2.32a1 1 0 01-.16 1.397l-1.414 1.06a1 1 0 01-1.207-.059l-1.422-1.067-2.121.848v3.626l1.323.529a1 1 0 11-.746 1.86l-1.323-.529-1.323.529a1 1 0 11-.746-1.86l1.323-.529v-3.626l-2.121-.848-1.422 1.067a1 1 0 01-1.207.059l-1.414-1.06a1 1 0 01-.16-1.397l1.738-2.32-1.233-.616a1 1 0 11.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" /></svg>
            </div>
            <span className="text-white font-bold">NyayaFlow Prototype</span>
          </div>
          <div className="flex gap-8 text-xs font-medium uppercase tracking-widest">
            <a href="#" className="hover:text-white transition">Platform Status</a>
            <a href="#" className="hover:text-white transition">Documentation</a>
            <a href="#" className="hover:text-white transition">Help Desk</a>
          </div>
          <p className="text-[10px]">NyayaFlow &copy; 2025 - Hackathon Demo Prototype</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
