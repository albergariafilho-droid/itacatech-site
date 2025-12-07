import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
}

export interface PricingPlan {
  name: string;
  subtitle: string;
  price?: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Novos tipos para o Portal Interno

export type UserRole = 'admin' | 'sdr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // ID do usuário ou 'all'
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
  source?: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'opportunity' | 'risk' | 'info';
  message: string;
  time: string;
  isRead?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}