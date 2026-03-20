import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive';
  projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: 'ongoing' | 'completed' | 'paused';
  automations: Automation[];
}

export interface Automation {
  id: string;
  name: string;
  type: 'instagram' | 'website' | 'general';
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  metrics: {
    runs: number;
    conversions: number;
  };
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  context: string;
  status: 'online' | 'offline';
}

export interface Contract {
  id: string;
  clientId: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'signed' | 'pending' | 'expired';
}
