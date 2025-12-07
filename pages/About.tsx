
import React from 'react';
import { Layers, Cpu, Briefcase, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-itaca-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-itaca-dark mb-4">Sobre a ItacaTech</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Nascemos com o objetivo de profissionalizar a prospecção B2B no Brasil, unindo tecnologia, processos e pessoas.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-itaca-dark mb-6">Nossa História & Missão</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                A <strong>ItacaTech</strong> é especialista em SDR, Hunting e geração de oportunidades qualificadas para o mercado B2B. Percebemos que muitas empresas excelentes falham em escalar vendas não por falta de produto, mas por falta de processo de prospecção.
              </p>
              <p>
                Estruturamos operações comerciais completas, oferecendo desde a mão de obra treinada até a inteligência de dados necessária para atingir os decisores certos.
              </p>
              <p>
                Nosso compromisso é entregar previsibilidade. Transformamos a arte de vender em uma ciência de processos replicáveis e escaláveis.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" 
              alt="Reunião estratégica" 
              className="rounded-lg shadow-lg w-full h-64 object-cover mt-8"
            />
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
              alt="Time trabalhando" 
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-itaca-dark text-center mb-16">Nossos Pilares de Atuação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Layers, title: 'Estrutura', desc: 'Processos de vendas validados e playbooks robustos.' },
              { icon: Cpu, title: 'Tecnologia', desc: 'Ferramentas de ponta para automação e inteligência de dados.' },
              { icon: Briefcase, title: 'Gestão', desc: 'Acompanhamento contínuo de KPIs e otimização de funil.' },
              { icon: Users, title: 'Qualificação', desc: 'Profissionais (SDRs) treinados e de alta performance.' }
            ].map((pilar, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <pilar.icon className="w-8 h-8 text-itaca-dark" />
                </div>
                <h3 className="text-xl font-bold text-itaca-dark mb-3">{pilar.title}</h3>
                <p className="text-gray-600">{pilar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
