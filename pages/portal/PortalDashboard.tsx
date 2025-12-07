import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadsContext';
import { useAlerts } from '../../context/AlertContext';
import { useAppointments } from '../../context/AppointmentContext';
import { useTasks } from '../../context/TaskContext';
import { useSettings } from '../../context/SettingsContext'; // Importando Settings
import { PhoneCall, CalendarCheck, TrendingUp, AlertCircle, Users, Activity, ArrowUpRight, CheckCircle, FileText, Plus, Search, Loader2, X } from 'lucide-react';

// ... (SimpleLineChart/LeadsChart permanece o mesmo)
// Custom Simple Line Chart Component
const LeadsChart = ({ leads }: { leads: any[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = useMemo(() => {
    const statusCounts = {
      'Novos': leads.filter(l => l.status === 'new').length,
      'Contatados': leads.filter(l => l.status === 'contacted').length,
      'Qualificados': leads.filter(l => l.status === 'qualified').length,
      'Ganhos': leads.filter(l => l.status === 'won').length,
      'Perdidos': leads.filter(l => l.status === 'lost').length,
    };
    return Object.entries(statusCounts).map(([label, value]) => ({ label, value }));
  }, [leads]);

  const height = 200;
  const width = 600;
  const padding = 30;
  const barWidth = 40;
  const gap = (width - padding * 2 - barWidth * data.length) / (data.length - 1);
  const maxValue = Math.max(...data.map(d => d.value), 5); 

  return (
    <div className="relative w-full h-[250px] flex items-end justify-center pb-6">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <line 
            key={tick} 
            x1={padding} 
            y1={height - padding - (tick * (height - padding * 2))} 
            x2={width - padding} 
            y2={height - padding - (tick * (height - padding * 2))} 
            stroke="#e5e7eb" 
            strokeWidth="1" 
            strokeDasharray="4 4"
          />
        ))}

        {data.map((item, i) => {
          const x = padding + i * (barWidth + gap);
          const barHeight = (item.value / maxValue) * (height - padding * 2);
          const y = height - padding - barHeight;
          const isHovered = hoveredIndex === i;

          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={isHovered ? '#60A3FF' : '#93C5FD'}
                rx="4"
                className="transition-all duration-300 cursor-pointer"
              />
              <text x={x + barWidth / 2} y={height - 5} textAnchor="middle" fontSize="12" fill="#6B7280">
                {item.label.substring(0, 3)}
              </text>
              {isHovered && (
                <g>
                  <rect x={x - 10} y={y - 30} width={barWidth + 20} height={24} rx="4" fill="#1F2937" />
                  <text x={x + barWidth / 2} y={y - 14} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
                    {item.value}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const PortalDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addLead, leads } = useLeads();
  const { alerts, removeAlert } = useAlerts();
  const { appointments } = useAppointments();
  const { tasks } = useTasks();
  const { apiKey } = useSettings(); // Usando Settings
  
  const navigate = useNavigate();
  const [notification, setNotification] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', company: '', email: '', phone: '' });

  const totalLeads = leads.length;
  const scheduledMeetings = appointments.filter(a => a.status === 'scheduled').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRegisterLead = (e: React.FormEvent) => {
    e.preventDefault();
    const exists = leads.some(l => l.email === leadForm.email);
    if (exists) {
      showNotification('Erro: Este e-mail já está cadastrado.');
      return;
    }

    addLead({
      name: leadForm.name,
      company: leadForm.company,
      email: leadForm.email,
      phone: leadForm.phone,
      source: 'Manual',
      status: 'new'
    });
    setLeadForm({ name: '', company: '', email: '', phone: '' });
    setIsLeadModalOpen(false);
    showNotification('Lead registrado com sucesso!');
  };

  const handleSearchLeads = async () => {
    if (isSearching) return;
    setIsSearching(true);

    // Use a chave do contexto ou fallback para env
    const keyToUse = apiKey || process.env.API_KEY;

    if (!keyToUse) {
        showNotification('Erro: API Key não configurada. Vá em Configurações.');
        setIsSearching(false);
        return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: keyToUse });
      
      const specificNiches = [
        'Fábrica de Móveis Planejados', 'Distribuidora de Peças Automotivas', 'Clínica de Fisioterapia e Pilates',
        'Escritório de Arquitetura Corporativa', 'Empresa de Instalação de Painéis Solares', 'Indústria de Embalagens Plásticas',
        'Empresa de Terraplanagem', 'Laboratório de Análises Clínicas', 'Atacadista de Material de Construção',
        'Agência de Marketing Digital', 'Consultoria em Segurança do Trabalho', 'Concessionária de Motos',
        'Fábrica de Roupas Jeans', 'Empresa de Manutenção de Elevadores', 'Escritório de Advocacia Trabalhista',
        'Restaurante Industrial', 'Empresa de Limpeza Terceirizada', 'Transportadora de Cargas Fracionadas',
        'Coworking', 'Escola de Programação e Robótica'
      ];
      
      const specificCities = [
        'Campinas, SP', 'Ribeirão Preto, SP', 'Sorocaba, SP', 'São José dos Campos, SP', 'Santos, SP',
        'Londrina, PR', 'Maringá, PR', 'Joinville, SC', 'Blumenau, SC', 'Caxias do Sul, RS',
        'Niterói, RJ', 'Duque de Caxias, RJ', 'Uberlândia, MG', 'Juiz de Fora, MG', 'Contagem, MG',
        'Feira de Santana, BA', 'Vitória da Conquista, BA', 'Caruaru, PE', 'Campina Grande, PB', 'Anápolis, GO'
      ];
      
      const niche = specificNiches[Math.floor(Math.random() * specificNiches.length)];
      const city = specificCities[Math.floor(Math.random() * specificCities.length)];

      const prompt = `
        Use o Google Search para encontrar 3 empresas REAIS e ATIVAS que sejam "${niche}" localizadas em "${city}".
        
        Instruções Críticas:
        1. Ignore empresas grandes. Busque PMEs locais.
        2. Extraia o TELEFONE REAL.
        3. Extraia o NOME EXATO.
        4. Extraia o SITE oficial.
        5. Se não encontrar o nome de um sócio, use "Gerente" ou "Atendimento".
        
        Retorne um JSON Array puro.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        }
      });

      let jsonString = response.text || "[]";
      jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let generatedData = [];
      try {
        generatedData = JSON.parse(jsonString);
      } catch (e) {
        console.error("Erro parsing JSON:", e);
        showNotification("Erro ao processar dados da busca. Tente novamente.");
        setIsSearching(false);
        return;
      }

      let addedCount = 0;

      if (Array.isArray(generatedData)) {
        generatedData.forEach((item: any) => {
          const companyName = item.company || 'Empresa Desconhecida';
          let email = item.email;
          
          if (!email || email.includes('Não informado') || !email.includes('@')) {
             const cleanCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
             email = `contato@${cleanCompany}.com.br`;
          }

          const phone = item.phone || 'Não informado';
          
          const isDuplicate = leads.some(l => 
            l.company.toLowerCase().includes(companyName.toLowerCase()) || 
            companyName.toLowerCase().includes(l.company.toLowerCase()) ||
            l.email.toLowerCase() === email.toLowerCase()
          );

          if (!isDuplicate && companyName !== 'Empresa Desconhecida') {
            addLead({
              name: item.name || 'Comercial',
              company: companyName,
              email: email,
              phone: phone,
              source: `Busca: ${niche} (${city})`,
              status: 'new'
            });
            addedCount++;
          }
        });
      }

      if (addedCount > 0) {
        showNotification(`${addedCount} novos leads reais de ${niche} em ${city} adicionados!`);
      } else {
        showNotification('Nenhum lead novo encontrado. Tente novamente.');
      }

    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      showNotification('Erro na busca. Verifique sua chave de API nas Configurações.');
    } finally {
      setIsSearching(false);
    }
  };

  const stats = [
    { label: 'Total de Leads', value: totalLeads.toString(), icon: PhoneCall, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Reuniões Agendadas', value: scheduledMeetings.toString(), icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Taxa de Conversão', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Tarefas Pendentes', value: pendingTasks.toString(), icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="relative">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modal Lead Manual */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsLeadModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
             <h3 className="text-xl font-bold text-gray-900 mb-4">Registrar Nova Lead</h3>
             <form onSubmit={handleRegisterLead} className="space-y-4">
                <input required type="text" placeholder="Nome" className="w-full p-2 border rounded-lg" 
                  value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} />
                <input required type="text" placeholder="Empresa" className="w-full p-2 border rounded-lg"
                  value={leadForm.company} onChange={e => setLeadForm({...leadForm, company: e.target.value})} />
                <input required type="email" placeholder="Email" className="w-full p-2 border rounded-lg"
                  value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} />
                <input type="tel" placeholder="Telefone" className="w-full p-2 border rounded-lg"
                  value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} />
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsLeadModalOpen(false)} className="flex-1 py-2 border rounded-lg">Cancelar</button>
                  <button type="submit" className="flex-1 py-2 bg-itaca-light text-white rounded-lg">Salvar</button>
                </div>
             </form>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500">Resumo em tempo real da sua operação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">Hoje</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-itaca-dark" />
          <h3 className="text-lg font-bold text-gray-900">Alertas & Oportunidades</h3>
          <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">{alerts.length}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-sm col-span-3">Nenhum alerta no momento.</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 relative group ${
                alert.type === 'opportunity' ? 'bg-green-50 border-green-500' :
                alert.type === 'risk' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'
              }`}>
                <button 
                  onClick={() => removeAlert(alert.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold uppercase mb-1 ${
                     alert.type === 'opportunity' ? 'text-green-700' :
                     alert.type === 'risk' ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    {alert.type === 'opportunity' ? 'Oportunidade' : alert.type === 'risk' ? 'Risco' : 'Info'}
                  </span>
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dynamic Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Distribuição de Leads por Status</h3>
            <div className="flex items-center text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
              <ArrowUpRight className="w-4 h-4 mr-1" /> Atualizado Agora
            </div>
          </div>
          <LeadsChart leads={leads} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Ações Rápidas</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-itaca-light" />
              Registrar Nova Lead
            </button>
            <button 
              onClick={handleSearchLeads}
              disabled={isSearching}
              className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {isSearching ? <Loader2 className="w-4 h-4 text-itaca-light animate-spin" /> : <Search className="w-4 h-4 text-itaca-light" />}
              {isSearching ? 'Buscando no Google Maps...' : 'Buscar Novos Leads'}
            </button>
            <button 
              onClick={() => navigate('/portal/schedule')}
              className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-itaca-light" />
              Agendar Reunião
            </button>
            <button 
              onClick={() => showNotification('Download do Script iniciado...')}
              className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-itaca-light" />
              Ver Script de Vendas
            </button>
            
            {user?.role === 'admin' && (
              <div className="relative group">
                <button 
                  onClick={() => navigate('/portal/team')}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors border-t border-gray-100 mt-2 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-itaca-light" />
                  Gerenciar Time
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;