import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead } from '../types';

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  removeLead: (id: string) => void;
}

const LeadsContext = createContext<LeadsContextType>({
  leads: [],
  addLead: () => {},
  updateLeadStatus: () => {},
  removeLead: () => {},
});

export const useLeads = () => useContext(LeadsContext);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const savedLeads = localStorage.getItem('itaca_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
    // Não inicializamos com dados vazios se não houver nada, apenas se for a primeira vez
  }, []);

  useEffect(() => {
    localStorage.setItem('itaca_leads', JSON.stringify(leads));
  }, [leads]);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
  };

  const removeLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLeadStatus, removeLead }}>
      {children}
    </LeadsContext.Provider>
  );
};