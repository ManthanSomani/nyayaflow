
import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import Layout from './components/Layout';
import JudgeDashboard from './components/JudgeDashboard';
import LegalProfessionalDashboard from './components/LegalProfessionalDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import MediatorDashboard from './components/MediatorDashboard';
import ArbitratorDashboard from './components/ArbitratorDashboard';
import Home from './components/Home';
import Login from './components/Login';

enum View {
  HOME = 'home',
  LOGIN = 'login',
  DASHBOARD = 'dashboard'
}

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [currentView, setCurrentView] = useState<View>(View.HOME);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole && savedRole !== UserRole.NONE) {
      setRole(savedRole);
      setCurrentView(View.DASHBOARD);
    }
  }, []);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setRole(UserRole.NONE);
    setCurrentView(View.HOME);
    localStorage.removeItem('userRole');
  };

  const renderDashboard = () => {
    switch(role) {
      case UserRole.JUDGE: return <JudgeDashboard />;
      case UserRole.LAWYER: return <LegalProfessionalDashboard />;
      case UserRole.CITIZEN: return <CitizenDashboard />;
      case UserRole.MEDIATOR: return <MediatorDashboard />;
      case UserRole.ARBITRATOR: return <ArbitratorDashboard />;
      default: return <div>Role Not Found</div>;
    }
  };

  if (currentView === View.HOME) {
    return <Home onGoToLogin={() => setCurrentView(View.LOGIN)} />;
  }

  if (currentView === View.LOGIN) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <Login onLogin={handleLogin} onCancel={() => setCurrentView(View.HOME)} />
      </div>
    );
  }

  return (
    <Layout role={role} onLogout={handleLogout}>
      {renderDashboard()}
    </Layout>
  );
};

export default App;
