
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BarChart, Users, Zap, Clock, TrendingUp, ShieldCheck, Target } from 'lucide-react';
import Button from '../components/Button';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative gradient-hero text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Aceleramos sua geração de leads e <span className="text-itaca-light">reuniões qualificadas</span>.
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              SDR e Hunting profissionais para empresas que querem escalar vendas sem a complexidade de aumentar o time interno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
                  Agendar reunião gratuita
                </Button>
              </Link>
              <a 
                href="https://wa.me/5573920008424" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 border-white text-white hover:bg-white/10 hover:text-white">
                  Falar com especialista
                </Button>
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-itaca-light" />
                <span>Operação em 48h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-itaca-light" />
                <span>Zero custo trabalhista</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-itaca-light font-semibold tracking-wider uppercase text-sm">Nossa Metodologia</span>
            <h2 className="text-3xl font-bold text-itaca-dark mt-2">Como funcionamos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Target, 
                title: 'Prospecção Ativa', 
                desc: 'Abordagem multicanal (Email, LinkedIn, WhatsApp) focada no seu ICP.' 
              },
              { 
                icon: ShieldCheck, 
                title: 'Qualificação', 
                desc: 'Filtramos os leads para garantir que apenas oportunidades reais cheguem a você.' 
              },
              { 
                icon: CalendarIcon, 
                title: 'Agendamento', 
                desc: 'Entregamos reuniões agendadas diretamente na agenda do seu time de vendas.' 
              },
              { 
                icon: BarChart, 
                title: 'Métricas Claras', 
                desc: 'Relatórios semanais de performance e feedback constante para otimização.' 
              }
            ].map((item, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-itaca-dark/5 rounded-lg flex items-center justify-center mb-4 text-itaca-dark">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-itaca-dark mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-itaca-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-itaca-light font-semibold tracking-wider uppercase text-sm">Benefícios Imediatos</span>
              <h2 className="text-3xl md:text-4xl font-bold text-itaca-dark mt-2 mb-6">
                Por que terceirizar seu SDR com a ItacaTech?
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Reduza custos operacionais e aumente a previsibilidade da sua receita com um time especialista focado 100% em performance.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Redução de CAC', desc: 'Menor custo de aquisição comparado a times internos.' },
                  { title: 'Aumento de Previsibilidade', desc: 'Pipeline de vendas sempre abastecido.' },
                  { title: 'Time Sob Demanda', desc: 'Escale ou reduza a operação conforme necessidade.' },
                  { title: 'Setup Rápido', desc: 'Iniciamos sua operação em até 48 horas.' }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-itaca-light/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-itaca-light" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-itaca-dark">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-itaca-light/20 rounded-2xl transform rotate-2"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" 
                alt="Equipe de vendas analisando dados" 
                className="relative rounded-xl shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-itaca-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para escalar suas vendas?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Não deixe seus leads esfriarem. Agende agora uma consultoria gratuita e descubra o potencial da sua operação.
          </p>
          <Link to="/contact">
            <Button variant="primary" className="text-lg px-10 py-4 shadow-xl hover:shadow-2xl hover:bg-blue-600 transform hover:-translate-y-1 transition-all">
              Quero aumentar minhas vendas agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

export default Home;
