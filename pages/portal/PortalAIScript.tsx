import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useSettings } from '../../context/SettingsContext'; // Importando

const PortalAIScript: React.FC = () => {
  const { apiKey } = useSettings(); // Usando Settings
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou seu assistente de vendas ItacaTech. Posso ajudar a criar scripts de abordagem, quebrar objeções ou analisar respostas de leads. O que você precisa hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    // Verificar se chave existe
    const keyToUse = apiKey || process.env.API_KEY;
    if (!keyToUse) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: 'Erro: API Key não configurada. Por favor, adicione sua chave nas configurações do portal.',
            timestamp: new Date()
        }]);
        return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: keyToUse });
      
      const systemInstruction = `
        Você é um especialista sênior em SDR (Sales Development Representative) e Vendas B2B da empresa ItacaTech.
        
        Seu objetivo é ajudar a equipe de vendas a:
        1. Criar scripts de abordagem (Cold Call, Email, LinkedIn, WhatsApp) persuasivos e curtos.
        2. Criar respostas para quebra de objeções comuns (ex: "Não tenho interesse", "Está caro", "Já tenho fornecedor").
        3. Analisar respostas de leads e sugerir o próximo passo.
        
        Tom de voz: Profissional, assertivo, empático e focado em resultados.
        Use formatação Markdown para deixar o texto claro (negrito, listas).
        Contexto da ItacaTech: Somos especialistas em terceirização de prospecção e hunting.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: systemInstruction }] },
            ...messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: userMessage.text }] }
        ]
      });

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "Desculpe, não consegui gerar uma resposta agora.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Erro ao chamar Gemini API:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Ocorreu um erro ao processar sua solicitação. Verifique sua chave de API nas configurações ou tente novamente.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-itaca-dark text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-itaca-light" />
          </div>
          <div>
            <h1 className="font-bold text-lg">ItacaTech Sales AI</h1>
            <p className="text-xs text-gray-300">Assistente Inteligente de Vendas</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-gray-200' : 'bg-itaca-light'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-gray-600" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            
            <div className={`relative group max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-white text-gray-800 rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              
              <span className="text-[10px] text-gray-400 mt-2 block text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              {msg.role === 'model' && (
                <button
                  onClick={() => copyToClipboard(msg.text, msg.id)}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-itaca-light hover:bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copiar Script"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-itaca-light flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
             </div>
             <div className="text-sm text-gray-500 italic">Gerando resposta...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ex: Crie um script de cold call para empresas de logística..."
            className="flex-1 p-4 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-itaca-light focus:border-transparent outline-none shadow-sm"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-itaca-dark text-white rounded-lg flex items-center justify-center hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortalAIScript;