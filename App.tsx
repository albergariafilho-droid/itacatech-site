import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

// Portal & Auth
import Login from './pages/Login';
import PortalLayout from './layouts/PortalLayout';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalTasks from './pages/portal/PortalTasks';
import PortalTeam from './pages/portal/PortalTeam';
import PortalSchedule from './pages/portal/PortalSchedule';
import PortalSettings from './pages/portal/PortalSettings';
import PortalLeads from './pages/portal/PortalLeads';
import PortalAIScript from './pages/portal/PortalAIScript'; 
import WeeklyReport from './pages/portal/WeeklyReport';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { LeadsProvider } from './context/LeadsContext';
import { AlertProvider } from './context/AlertContext';
import { TaskProvider } from './context/TaskContext';
import { SettingsProvider } from './context/SettingsContext'; // Importando o novo provider

// Public Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen font-sans text-gray-900">
    <Header />
    <main className="flex-grow pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider> {/* Envolvendo com SettingsProvider */}
        <TaskProvider>
          <AppointmentProvider>
            <LeadsProvider>
              <AlertProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                  <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                  <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
                  <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
                  <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                  
                  {/* Auth Route */}
                  <Route path="/login" element={<Login />} />

                  {/* Protected Portal Routes */}
                  <Route path="/portal" element={
                    <ProtectedRoute>
                      <PortalLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<PortalDashboard />} />
                    <Route path="leads" element={<PortalLeads />} />
                    <Route path="tasks" element={<PortalTasks />} />
                    <Route path="team" element={<PortalTeam />} />
                    <Route path="schedule" element={<PortalSchedule />} />
                    <Route path="settings" element={<PortalSettings />} />
                    <Route path="ai-script" element={<PortalAIScript />} />
                    <Route path="reports" element={<WeeklyReport />} />
                  </Route>
                </Routes>
              </AlertProvider>
            </LeadsProvider>
          </AppointmentProvider>
        </TaskProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;