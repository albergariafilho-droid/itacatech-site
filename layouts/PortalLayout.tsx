
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, LogOut, Settings, Menu, X, Calendar, Sparkles, FileBarChart, Megaphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const PortalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/portal/dashboard', icon: LayoutDashboard },
    { label: 'Leads', path: '/portal/leads', icon: Megaphone },
    { label: 'Tarefas', path: '/portal/tasks', icon: CheckSquare },
    { label: 'Agenda', path: '/portal/schedule', icon: Calendar },
    { label: 'Sales AI', path: '/portal/ai-script', icon: Sparkles },
    { label: 'Relatório Semanal', path: '/portal/reports', icon: FileBarChart },
    ...(user?.role === 'admin' ? [{ label: 'Time', path: '/portal/team', icon: Users }] : []),
    { label: 'Configurações', path: '/portal/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <div>
          <Logo light={true} />
        </div>
        {/* Close button only visible on mobile inside the drawer */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-700/50 md:border-none">
        <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-itaca-light" />
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role === 'sdr' ? 'SDR / Vendas' : 'Admin'}</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-itaca-light text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 bg-itaca-dark">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-itaca-dark text-white hidden md:flex flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <aside className="relative w-72 max-w-[85%] bg-itaca-dark text-white flex flex-col h-full shadow-2xl transform transition-transform duration-300">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 flex justify-between items-center md:hidden z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-itaca-light"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Logo />
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
              <img src={user?.avatar} alt="User" className="w-full h-full object-cover" />
            </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PortalLayout;
