
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Search, GraduationCap, BarChart2, Check } from 'lucide-react';
import Button from '../components/Button';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Operação de SDR Completa',
      description: 'Terceirize sua prospecção e receba apenas reuniões qualificadas na agenda.',
      icon: Phone,
      features: [
        'Prospecção multicanal (WhatsApp, E-mail, LinkedIn, Ligações)',
        'Qualificação rigorosa de leads',
        'Scripts e cadências otimizadas',
        'Agendamento direto no CRM'
      ]
    },
    {
      title: 'Hunting e Captação B2B',
      description: 'Identificação ativa de contas estratégicas para o seu negócio.',
      icon: Search,
      features: [
        'Mapeamento de mercado e lista de empresas-alvo',
        'Análise de fit e decisores',
        'Abordagem consultiva e profissional',
        'Pipeline de vendas sempre abastecido'
      ]
    },
    {
      title: 'Treinamento de SDRs',
      description: 'Capacitação completa para times internos de pré-vendas.',
      icon: GraduationCap,
      features: [
        'Metodologia proprietária ItacaTech',
        'Roleplays de abordagem e quebra de objeções',
        'Estruturação de discursos e follow-up',
        'Avaliação prática e teórica'
      ]
    },
    {
      title: 'Consultoria Comercial',
      description: 'Diagnóstico e reestruturação da sua máquina de vendas.',
      icon: BarChart2,
      features: [
        'Implementação e configuração de CRM',
        'Construção de Playbooks de Vendas',
        'Definição de KPIs e rotinas de gestão',
        'Apoio no recrutamento de talentos'
      ]
    }
  ];

  return (
    <div className="bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-itaca-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossas Soluções</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Do treinamento à operação completa: tudo o que sua empresa precisa para vender mais e melhor.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-itaca-light">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <service.icon className="w-8 h-8 text-itaca-dark" />
                </div>
                <span className="text-4xl font-bold text-gray-100">0{index + 1}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-itaca-dark mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 min-h-[50px]">{service.description}</p>
              
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/contact">
                <Button variant="outline" fullWidth className="group hover:bg-itaca-dark hover:text-white hover:border-itaca-dark">
                  Saiba mais
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-itaca-dark mb-6">Não sabe qual a melhor solução para você?</h2>
          <Link to="/contact">
            <Button variant="primary" className="px-8 py-3 text-lg">
              Falar com um consultor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
