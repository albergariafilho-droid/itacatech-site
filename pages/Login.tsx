import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { Lock, User } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de verificação
    // admin@itacare.tech -> Admin
    // sdr@itacare.tech -> SDR
    
    if (email.includes('admin')) {
      login(email, 'admin');
    } else {
      login(email, 'sdr');
    }
    navigate('/portal/dashboard');
  };

  return (
    <div className="min-h-screen bg-itaca-gray flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <h2 className="text-2xl font-bold text-itaca-dark text-center mb-2">Área do Colaborador</h2>
        <p className="text-gray-500 text-center mb-8">Entre com suas credenciais para acessar.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Corporativo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-itaca-light focus:border-transparent outline-none"
                placeholder="nome@itacare.tech"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-itaca-light focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button fullWidth type="submit" variant="primary" className="py-3">
            Entrar no Portal
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Dica Demo: use "admin@..." para visão de gestor ou qualquer outro para visão SDR.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
