import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Linkedin, Instagram, Mail, Phone, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-itaca-dark text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Logo light={true} />
            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
              Especialistas em SDR, Hunting e inteligência comercial para empresas B2B escalarem vendas.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-itaca-light">Empresa</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white text-sm transition-colors">Sobre Nós</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white text-sm transition-colors">Nossos Serviços</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white text-sm transition-colors">Planos e Preços</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-itaca-light">Serviços</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-300 hover:text-white text-sm transition-colors">SDR Terceirizado</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white text-sm transition-colors">Hunting B2B</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white text-sm transition-colors">Consultoria CRM</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-itaca-light">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-2 text-itaca-light" />
                contato@itacare.tech
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-2 text-itaca-light" />
                (73) 92000-8424
              </li>
              <li className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ItacaTech. Todos os direitos reservados.</p>
          
          <div className="mt-4 md:mt-0">
             <Link to="/login" className="flex items-center gap-2 hover:text-white transition-colors opacity-60 hover:opacity-100">
               <Lock className="w-3 h-3" />
               <span>Área do Colaborador</span>
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
