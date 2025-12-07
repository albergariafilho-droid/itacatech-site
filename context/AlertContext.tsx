import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from '../types';

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'time'>) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType>({
  alerts: [],
  addAlert: () => {},
  removeAlert: () => {},
});

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Dados iniciais mockados
    setAlerts([
      { id: '1', type: 'opportunity', message: 'Volatilidade do Mercado: Alta demanda detectada no setor Financeiro.', time: 'Há 30 min' },
      { id: '2', type: 'risk', message: 'Atenção: Queda na taxa de abertura de e-mails em 5%.', time: 'Há 2 horas' },
      { id: '3', type: 'info', message: 'Nova oportunidade de investimento em ferramentas de IA disponível.', time: 'Ontem' },
    ]);
  }, []);

  const addAlert = (newAlertData: Omit<Alert, 'id' | 'time'>) => {
    const newAlert: Alert = {
      ...newAlertData,
      id: Date.now().toString(),
      time: 'Agora mesmo'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};