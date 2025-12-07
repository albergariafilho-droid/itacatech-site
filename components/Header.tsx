
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LogIn, LogOut, UserCircle2 } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import BookingModal from './BookingModal';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Sobre', path: '/about' },
    { label: 'Serviços', path: '/services' },
    { label: 'Planos', path: '/pricing' },
    { label: 'Contato', path: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo light={false} />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-itaca-light ${
                    location.pathname === link.path ? 'text-itaca-light' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <Button variant="primary" className="py-2 px-4 text-sm" onClick={() => setIsBookingOpen(true)}>
                Agendar Reunião
              </Button>

              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <Link to="/portal/dashboard" className="text-gray-400 hover:text-itaca-dark transition-colors" title="Ir para o Portal">
                      <UserCircle2 className="w-6 h-6" />
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-itaca-light transition-colors">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              {isAuthenticated && (
                <Link to="/portal/dashboard" className="text-gray-400 hover:text-itaca-dark transition-colors">
                  <UserCircle2 className="w-6 h-6" />
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-itaca-light focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'text-itaca-light bg-blue-50'
                      : 'text-gray-700 hover:text-itaca-light hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <Button fullWidth variant="primary" onClick={() => setIsBookingOpen(true)}>
                  Agendar Reunião <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                {isAuthenticated ? (
                  <Button fullWidth variant="white" onClick={handleLogout} className="border border-gray-200 text-red-500 hover:bg-red-50">
                    <LogOut className="mr-2 w-4 h-4" /> Sair
                  </Button>
                ) : (
                  <Link to="/login" className="block">
                    <Button fullWidth variant="outline">
                      <LogIn className="mr-2 w-4 h-4" /> Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
};

export default Header;
