import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'sdr') => void;
  logout: () => void;
  isAuthenticated: boolean;
  teamMembers: User[];
  addTeamMember: (member: { name: string; email: string; role: UserRole }) => void;
  updateTeamMember: (id: string, updates: Partial<User>) => void; // New function
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  teamMembers: [],
  addTeamMember: () => {},
  updateTeamMember: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Initial team members data
  const [teamMembers, setTeamMembers] = useState<User[]>([
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@itacare.tech',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '2',
      name: 'SDR Colaborador',
      email: 'sdr@itacare.tech',
      role: 'sdr',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ]);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage ao carregar
    const savedUser = localStorage.getItem('itaca_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load team from local storage if exists to persist edits
    const savedTeam = localStorage.getItem('itaca_team');
    if (savedTeam) {
        setTeamMembers(JSON.parse(savedTeam));
    }
  }, []);

  // Save team changes to local storage
  useEffect(() => {
      localStorage.setItem('itaca_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const login = (email: string, role: 'admin' | 'sdr') => {
    // Simulação de login
    const existingUser = teamMembers.find(u => u.email === email);
    
    let newUser: User;

    if (existingUser) {
      newUser = existingUser;
    } else {
      newUser = {
        id: role === 'admin' ? '1' : '2',
        name: role === 'admin' ? 'Administrador' : 'SDR Colaborador',
        email: email,
        role: role,
        avatar: role === 'admin' 
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      };
    }
    
    setUser(newUser);
    localStorage.setItem('itaca_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('itaca_user');
  };

  const addTeamMember = (member: { name: string; email: string; role: UserRole }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: member.name,
      email: member.email,
      role: member.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`
    };
    setTeamMembers([...teamMembers, newUser]);
  };

  const updateTeamMember = (id: string, updates: Partial<User>) => {
    setTeamMembers(prev => prev.map(member => 
        member.id === id ? { ...member, ...updates } : member
    ));
    
    // Update current user session if it's the same user being edited
    if (user && user.id === id) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('itaca_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, teamMembers, addTeamMember, updateTeamMember }}>
      {children}
    </AuthContext.Provider>
  );
};