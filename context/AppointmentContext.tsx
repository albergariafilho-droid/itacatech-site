import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment } from '../types';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void; // Nova função
}

const AppointmentContext = createContext<AppointmentContextType>({
  appointments: [],
  addAppointment: () => {},
  updateAppointment: () => {},
  deleteAppointment: () => {},
});

export const useAppointments = () => useContext(AppointmentContext);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('itaca_appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      setAppointments([
        { id: '1', clientName: 'Empresa Alpha', clientEmail: 'contato@alpha.com', date: '2023-11-20', time: '14:00', status: 'scheduled' },
        { id: '2', clientName: 'Beta Indústrias', clientEmail: 'comercial@beta.ind', date: '2023-11-21', time: '10:00', status: 'scheduled' },
      ]);
    }
  }, []);

  useEffect(() => {
    if(appointments.length > 0) {
        localStorage.setItem('itaca_appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  const addAppointment = (data: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: Date.now().toString(),
      status: 'scheduled'
    };
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, ...updates } : apt
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, updateAppointment, deleteAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};