import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../types';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTaskStatus: (id: string) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void; // Nova função
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  addTask: () => {},
  toggleTaskStatus: () => {},
  updateTask: () => {},
  deleteTask: () => {},
});

export const useTasks = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Initial Mock Data
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const formatMonth = (m: number) => m < 10 ? `0${m}` : m;
    
    const savedTasks = localStorage.getItem('itaca_tasks');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const initialTasks: Task[] = [
        { id: '1', title: 'Atualizar CRM com leads da semana', description: 'Revisar status', assignedTo: '2', status: 'pending', priority: 'high', dueDate: `${currentYear}-${formatMonth(currentMonth)}-10` },
        { id: '2', title: 'Follow-up proposta Empresa X', description: 'Enviar e-mail de cobrança', assignedTo: '2', status: 'completed', priority: 'medium', dueDate: `${currentYear}-${formatMonth(currentMonth)}-08` },
        { id: '3', title: 'Criar playbook de Outbound', description: 'Definir novas cadências', assignedTo: '1', status: 'in_progress', priority: 'high', dueDate: `${currentYear}-${formatMonth(currentMonth)}-15` },
        { id: '4', title: 'Reunião de alinhamento', description: 'Semanal', assignedTo: 'all', status: 'pending', priority: 'low', dueDate: `${currentYear}-${formatMonth(currentMonth)}-12` },
      ];
      setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('itaca_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ));
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTaskStatus, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};