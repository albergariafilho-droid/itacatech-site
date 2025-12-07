import React, { useState } from 'react';
import { useLeads } from '../../context/LeadsContext';
import Button from '../../components/Button';
import { Plus, Search, Phone, Mail, Building, Trash2, Filter, Sparkles, Loader2, CheckCircle, XCircle, MapPin, Briefcase, ChevronLeft, ChevronRight, LayoutList, LayoutGrid } from 'lucide-react';
import { Lead } from '../../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useSettings } from '../../context/SettingsContext'; // Importando

const PortalLeads: React.FC = () => {
  const { leads, addLead, updateLeadStatus, removeLead } = useLeads();
  const { apiKey } = useSettings(); // Usando Settings
  
  // ... (o resto do código permanece, mas usando 'keyToUse' dentro de handleProspectLeads)

  // ... (View State, Search State, etc.)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProspecting, setIsProspecting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [targetCity, setTargetCity] = useState('São Paulo, SP');
  const [targetNiche, setTargetNiche] = useState('Agências de Marketing');
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', source: '' });
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // ... (Constants, Helpers, Filter Logic, Pagination Logic, Drag Logic, Manual Add Logic)
  const availableCities = [
    'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR', 
    'Porto Alegre, RS', 'Salvador, BA', 'Recife, PE', 'Fortaleza, CE', 
    'Brasília, DF', 'Goiânia, GO', 'Campinas, SP', 'Manaus, AM', 'Belém, PA',
    'Florianópolis, SC', 'Vitória, ES'
  ];

  const availableNiches = [
    'Agências de Marketing', 'Clínicas Odontológicas', 'Escritórios de Advocacia',
    'Empresas de Engenharia', 'Desenvolvimento de Software', 'Lojas de Móveis',
    'Consultorias de RH', 'Energia Solar', 'Indústria Têxtil', 'Logística e Transportes',
    'Academias', 'Restaurantes', 'Imobiliárias', 'Escolas Particulares'
  ];

  const kanbanColumns: { id: Lead['status'], label: string, color: string }[] = [
    { id: 'new', label: 'Novos', color: 'bg-blue-50 border-blue-200' },
    { id: 'contacted', label: 'Contatados', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'qualified', label: 'Qualificados', color: 'bg-purple-50 border-purple-200' },
    { id: 'won', label: 'Ganhos', color: 'bg-green-50 border-green-200' },
    { id: 'lost', label: 'Perdidos', color: 'bg-gray-100 border-gray-200' },
  ];

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredLeads = leads.filter(lead => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(term) ||
      lead.company.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term);
    const matchesStatus = viewMode === 'kanban' ? true : (statusFilter === 'all' || lead.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Lead['status']) => {
    e.preventDefault();
    if (draggedLeadId) {
      updateLeadStatus(draggedLeadId, targetStatus);
      setDraggedLeadId(null);
    }
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const isDuplicate = leads.some(l => 
        l.email.toLowerCase() === formData.email.toLowerCase() || 
        l.phone.replace(/\D/g, '') === formData.phone.replace(/\D/g, '')
    );
    if (isDuplicate) {
        alert('Erro: Já existe um lead com este e-mail ou telefone.');
        return;
    }
    addLead({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      source: formData.source || 'Manual',
      status: 'new'
    });
    setFormData({ name: '', company: '', email: '', phone: '', source: '' });
    setIsModalOpen(false);
    showNotification('Lead adicionado manualmente com sucesso!');
  };

  // --- AI Prospecting Logic (Updated) ---
  const handleProspectLeads = async () => {
    if (isProspecting) return;
    setIsProspecting(true);

    const keyToUse = apiKey || process.env.API_KEY;

    if (!keyToUse) {
        showNotification('Erro: API Key não configurada. Vá em Configurações.', 'error');
        setIsProspecting(false);
        return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: keyToUse });
      
      const prompt = `
        Use o Google Search para encontrar 4 empresas REAIS e ATIVAS do setor de "${targetNiche}" localizadas em "${targetCity}".
        
        Instruções de Extração:
        1. "company": Nome exato da empresa conforme listado no Google.
        2. "phone": Telefone oficial (fixo ou celular) disponível publicamente. Se não houver, use "Não informado".
        3. "name": Nome de um contato público (sócio, gerente ou "Comercial").
        4. "email": Email público de contato ou site oficial.

        Foque em PMEs locais reais.
        Formate a resposta APENAS como um array JSON válido.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        }
      });

      let jsonString = response.text || "[]";
      const startIndex = jsonString.indexOf('[');
      const endIndex = jsonString.lastIndexOf(']');
      
      if (startIndex !== -1 && endIndex !== -1) {
        jsonString = jsonString.substring(startIndex, endIndex + 1);
      } else {
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      let generatedLeads = [];
      try {
        generatedLeads = JSON.parse(jsonString);
      } catch (e) {
        console.error("JSON Parse Error", e);
        showNotification("Erro ao processar dados da busca. Tente novamente.", 'error');
        setIsProspecting(false);
        return;
      }

      let addedCount = 0;

      if (Array.isArray(generatedLeads)) {
        generatedLeads.forEach((newLead: any) => {
          const companyName = newLead.company || 'Empresa Desconhecida';
          let email = newLead.email;
          
          if (!email || email === 'Não informado' || !email.includes('@')) {
               const cleanCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
               email = `contato@${cleanCompany}.com.br`;
          }

          const isDuplicate = leads.some(existing => 
              existing.company.toLowerCase().includes(companyName.toLowerCase()) || 
              companyName.toLowerCase().includes(existing.company.toLowerCase())
          );

          if (!isDuplicate && companyName !== 'Empresa Desconhecida') {
            addLead({
              name: newLead.name || 'Comercial',
              company: companyName,
              email: email,
              phone: newLead.phone || 'Não informado',
              source: `Busca: ${targetNiche} (${targetCity})`,
              status: 'new'
            });
            addedCount++;
          }
        });
      }

      if (addedCount > 0) {
        showNotification(`${addedCount} novos leads de ${targetNiche} em ${targetCity} encontrados!`);
      } else {
        showNotification('Nenhum lead novo encontrado nesta busca. Tente mudar a cidade ou nicho.', 'error');
      }

    } catch (error) {
      console.error("Erro na prospecção:", error);
      showNotification('Erro de API. Verifique sua chave nas configurações.', 'error');
    } finally {
      setIsProspecting(false);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative animate-fade-in h-full flex flex-col">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-4 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 text-white ${notification.type === 'success' ? 'bg-gray-900' : 'bg-red-600'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header and Controls ... (Rest of UI similar to before, kept for brevity unless changes needed) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Leads</h1>
          <p className="text-gray-500">Acompanhe e alimente seu pipeline comercial.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-itaca-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <LayoutList className="w-4 h-4" /> Lista
                </button>
                <button 
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'kanban' ? 'bg-white text-itaca-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <LayoutGrid className="w-4 h-4" /> Kanban
                </button>
            </div>

            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
        </div>
      </div>

      {/* Prospecting Controls Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-gray-900">Prospecção Inteligente (IA)</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Nicho / Setor
                </label>
                <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none bg-white"
                    value={targetNiche}
                    onChange={(e) => setTargetNiche(e.target.value)}
                >
                    {availableNiches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>

            <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Cidade Alvo
                </label>
                <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none bg-white"
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                >
                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <Button 
                variant="primary" 
                onClick={handleProspectLeads} 
                disabled={isProspecting}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto"
            >
                {isProspecting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Buscando...</>
                ) : (
                    'Buscar Leads Agora'
                )}
            </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between flex-shrink-0">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, empresa ou email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); 
            }}
          />
        </div>
        
        {viewMode === 'list' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-400" />
            <select 
                className="w-full md:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none text-sm text-gray-700"
                value={statusFilter}
                onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1); 
                }}
            >
                <option value="all">Todos os Status</option>
                <option value="new">Novos</option>
                <option value="contacted">Contatados</option>
                <option value="qualified">Qualificados</option>
                <option value="won">Ganhos</option>
                <option value="lost">Perdidos</option>
            </select>
            </div>
        )}
      </div>

      {/* Content Area (List vs Kanban) */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome / Empresa</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Origem</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {currentLeads.length === 0 ? (
                    <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        Nenhum lead encontrado.
                    </td>
                    </tr>
                ) : (
                    currentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-itaca-dark/10 rounded-full flex items-center justify-center text-itaca-dark font-bold">
                            {lead.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Building className="w-3 h-3" /> {lead.company}
                            </div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-400" /> {lead.email}
                            </div>
                            <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" /> {lead.phone}
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.source && lead.source.includes('Busca') ? (
                                <span className="flex items-center gap-1 text-purple-600 font-medium text-xs truncate max-w-[150px]" title={lead.source}>
                                    <Search className="w-3 h-3" /> {lead.source}
                                </span>
                            ) : (
                                lead.source || '-'
                            )}
                        </td>
                        <td className="px-6 py-4">
                        <select
                            className={`text-xs font-semibold rounded-full px-2 py-1 border-none focus:ring-0 cursor-pointer ${getStatusColor(lead.status)}`}
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        >
                            <option value="new">Novo</option>
                            <option value="contacted">Contatado</option>
                            <option value="qualified">Qualificado</option>
                            <option value="won">Ganho</option>
                            <option value="lost">Perdido</option>
                        </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                            onClick={() => removeLead(lead.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="Remover Lead"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
            {/* Pagination ... */}
            {filteredLeads.length > itemsPerPage && (
                <div className="flex items-center justify-between p-4 border-t border-gray-100 flex-shrink-0">
                    <div className="text-sm text-gray-500">
                        Mostrando {startIndex + 1} até {Math.min(startIndex + itemsPerPage, filteredLeads.length)} de {filteredLeads.length} resultados
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                                    currentPage === page
                                        ? 'bg-itaca-light text-white'
                                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
      ) : (
        /* Kanban Board */
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 h-full min-h-[500px]">
            {kanbanColumns.map((col) => (
                <div 
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className="min-w-[280px] w-[280px] flex flex-col bg-gray-50 rounded-xl border border-gray-200 h-full"
                >
                    <div className={`p-4 border-b border-gray-200 rounded-t-xl font-semibold text-gray-700 flex justify-between items-center ${col.color.replace('border-', 'bg-').replace('50', '100')}`}>
                        {col.label}
                        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                            {filteredLeads.filter(l => l.status === col.id).length}
                        </span>
                    </div>
                    
                    <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                        {filteredLeads.filter(l => l.status === col.id).map((lead) => (
                            <div
                                key={lead.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, lead.id)}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-move hover:shadow-md transition-all active:cursor-grabbing group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-800 text-sm">{lead.name}</h4>
                                    <button 
                                        onClick={() => removeLead(lead.id)}
                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                    <Building className="w-3 h-3" /> {lead.company}
                                </div>
                                <div className="space-y-1">
                                    {lead.email && (
                                        <div className="text-xs text-gray-600 flex items-center gap-1 truncate" title={lead.email}>
                                            <Mail className="w-3 h-3" /> {lead.email}
                                        </div>
                                    )}
                                    {lead.phone && (
                                        <div className="text-xs text-gray-600 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {lead.phone}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Modal Add Lead ... */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Cadastrar Novo Lead</h3>
             <form onSubmit={handleAddLead} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Contato</label>
                   <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none" 
                     value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                   <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                     value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <input required type="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                     value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                     <input type="tel" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                       value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Origem (Opcional)</label>
                     <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                       value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} placeholder="Ex: LinkedIn" />
                   </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" fullWidth onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" variant="primary" fullWidth>Salvar</Button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalLeads;