import React, { createContext, useContext, useState, useEffect } from 'react';

interface SalesGoals {
  monthlyLeads: number;
  conversionRate: number;
  revenueTarget: number;
}

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  riskProfile: number;
  setRiskProfile: (value: number) => void;
  salesGoals: SalesGoals;
  setSalesGoals: (goals: SalesGoals) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  apiKey: '',
  setApiKey: () => {},
  riskProfile: 50,
  setRiskProfile: () => {},
  salesGoals: { monthlyLeads: 150, conversionRate: 15, revenueTarget: 50000 },
  setSalesGoals: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState('');
  const [riskProfile, setRiskProfileState] = useState(50);
  const [salesGoals, setSalesGoalsState] = useState<SalesGoals>({
    monthlyLeads: 150,
    conversionRate: 15,
    revenueTarget: 50000
  });

  useEffect(() => {
    const savedKey = localStorage.getItem('itaca_gemini_api_key');
    if (savedKey) setApiKeyState(savedKey);

    const savedRisk = localStorage.getItem('itaca_risk_profile');
    if (savedRisk) setRiskProfileState(Number(savedRisk));

    const savedGoals = localStorage.getItem('itaca_sales_goals');
    if (savedGoals) setSalesGoalsState(JSON.parse(savedGoals));
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('itaca_gemini_api_key', key);
  };

  const setRiskProfile = (value: number) => {
    setRiskProfileState(value);
    localStorage.setItem('itaca_risk_profile', String(value));
  };

  const setSalesGoals = (goals: SalesGoals) => {
    setSalesGoalsState(goals);
    localStorage.setItem('itaca_sales_goals', JSON.stringify(goals));
  };

  return (
    <SettingsContext.Provider value={{ apiKey, setApiKey, riskProfile, setRiskProfile, salesGoals, setSalesGoals }}>
      {children}
    </SettingsContext.Provider>
  );
};