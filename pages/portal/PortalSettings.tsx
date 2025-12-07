import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { Target, ShieldAlert, Save, Key, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const PortalSettings: React.FC = () => {
  const { apiKey, setApiKey, riskProfile, setRiskProfile, salesGoals, setSalesGoals } = useSettings();
  
  // Local state for inputs
  const [localApiKey, setLocalApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [localRisk, setLocalRisk] = useState(50);
  const [localGoals, setLocalGoals] = useState({
    monthlyLeads: 150,
    conversionRate: 15,
    revenueTarget: 50000
  });

  // Sync local state with context on load
  useEffect(() => {
    setLocalApiKey(apiKey);
    setLocalRisk(riskProfile);
    setLocalGoals(salesGoals);
  }, [apiKey, riskProfile, salesGoals]);

  const handleSave = () => {
    setApiKey(localApiKey);
    setRiskProfile(localRisk);
    setSalesGoals(localGoals);
    alert('Configurações salvas com sucesso!');
  };

  const getRiskLabel = (val: number) => {
    if (val < 30) return 'Conservador (Qualidade > Quantidade)';
    if (val < 70) return 'Moderado (Equilíbrio)';
    return 'Agressivo (Volume Máximo)';
  };

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações de Perfil</h1>
        <p className="text-gray-500">Ajuste suas metas, estratégias e integrações.</p>
      </div>

      <div className="space-y-8">
        
        {/* API Key Configuration */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Key className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Integração Gemini AI</h2>
              <p className="text-sm text-gray-500">Configure sua chave de API para habilitar os recursos de IA.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Gemini API Key</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder="Cole sua chave AIza... aqui"
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none font-mono text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Esta chave será usada para recursos como Prospecção Automática e Assistente de Scripts. 
                Ela é salva apenas no seu navegador.
              </p>
            </div>
          </div>
        </div>

        {/* Risk/Strategy Profile */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Perfil de Estratégia (Risco)</h2>
              <p className="text-sm text-gray-500">Defina a agressividade da sua prospecção e investimentos.</p>
            </div>
          </div>

          <div className="px-4 py-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Conservador</span>
              <span className="text-sm font-bold text-itaca-dark">{getRiskLabel(localRisk)}</span>
              <span className="text-sm font-medium text-gray-600">Agressivo</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localRisk}
              onChange={(e) => setLocalRisk(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-itaca-light"
            />
            <p className="mt-4 text-sm text-gray-600">
              * Um perfil mais agressivo aumenta o volume de contatos (Cold Calls/Emails), mas pode diminuir a personalização.
            </p>
          </div>
        </div>

        {/* Sales Goals */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Metas de Vendas</h2>
              <p className="text-sm text-gray-500">Defina seus objetivos mensais para calibração do dashboard.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leads / Mês</label>
              <input
                type="number"
                value={localGoals.monthlyLeads}
                onChange={(e) => setLocalGoals({...localGoals, monthlyLeads: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Conversão (%)</label>
              <input
                type="number"
                value={localGoals.conversionRate}
                onChange={(e) => setLocalGoals({...localGoals, conversionRate: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta de Receita (R$)</label>
              <input
                type="number"
                value={localGoals.revenueTarget}
                onChange={(e) => setLocalGoals({...localGoals, revenueTarget: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortalSettings;