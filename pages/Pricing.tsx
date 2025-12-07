
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import Button from '../components/Button';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Start',
      subtitle: 'Para começar a tracionar',
      highlight: false,
      features: [
        '1 SDR dedicado',
        '80–120 leads abordados/mês',
        '8–15 reuniões qualificadas',
        'Relatórios semanais',
        'Suporte via WhatsApp'
      ],
      cta: 'Contratar Start',
      variant: 'outline' as const
    },
    {
      name: 'Pro',
      subtitle: 'Mais performance e escala',
      highlight: true,
      features: [
        '1 a 2 SDRs dedicados',
        '150–250 leads abordados/mês',
        '15–30 reuniões qualificadas',
        'Scripts personalizados',
        'CRM Incluso',
        'Consultoria de otimização'
      ],
      cta: 'Contratar Pro',
      variant: 'primary' as const
    },
    {
      name: 'Enterprise',
      subtitle: 'Operação robusta e customizada',
      highlight: false,
      features: [
        'Time de SDR sob demanda',
        'Hunting avançado (Enterprise)',
        'Treinamento interno da equipe',
        'Reuniões ilimitadas por SLA',
        'Gestão comercial dedicada',
        'Dashboards e BI'
      ],
      cta: 'Agendar Diagnóstico',
      variant: 'outline' as const
    }
  ];

  return (
    <div className="bg-itaca-gray min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-itaca-dark mb-4">Planos Flexíveis</h1>
          <p className="text-xl text-gray-600">Escolha o modelo ideal para o momento da sua empresa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl p-8 shadow-xl transition-transform duration-300 hover:-translate-y-2 ${
                plan.highlight ? 'border-2 border-itaca-light ring-4 ring-itaca-light/10 md:-mt-4 md:mb-4' : 'border border-gray-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-itaca-light text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center shadow-md">
                  <Star className="w-3 h-3 mr-1 fill-current" /> Mais Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-itaca-dark">{plan.name}</h3>
              <p className="text-gray-500 text-sm mt-2 mb-6">{plan.subtitle}</p>
              
              <div className="border-t border-gray-100 my-6"></div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <div className={`p-1 rounded-full mr-3 ${plan.highlight ? 'bg-itaca-light/20 text-itaca-dark' : 'bg-gray-100 text-gray-500'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/contact" className="block">
                <Button 
                  fullWidth 
                  variant={plan.variant} 
                  className={plan.highlight ? 'bg-itaca-light hover:bg-blue-600' : ''}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-itaca-dark mb-2">Precisa de algo personalizado?</h3>
          <p className="text-gray-600 mb-6">Montamos squads exclusivos para grandes operações.</p>
          <Link to="/contact" className="text-itaca-light font-semibold hover:text-itaca-dark transition-colors border-b-2 border-itaca-light hover:border-itaca-dark pb-1">
            Fale com nosso time comercial &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
