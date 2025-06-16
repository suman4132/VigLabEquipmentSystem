import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export const LabCategoryEnum = {
  PROGRAMMING: 'Programming Lab',
  NETWORKING: 'Networking Lab',
  DATABASE: 'Database Lab',
  HARDWARE: 'Hardware Lab',
  RESEARCH: 'Research Lab',
  MULTIMEDIA: 'Multimedia Lab',
} as const;

export type LabCategory = keyof typeof LabCategoryEnum;

export const EquipmentTypeEnum = {
  COMPUTER: 'Computer',
  SERVER: 'Server',
  NETWORK_DEVICE: 'Network Device',
  HARDWARE_COMPONENT: 'Hardware Component',
  PERIPHERAL: 'Peripheral',
  SOFTWARE_LICENSE: 'Software License',
} as const;

export type EquipmentType = keyof typeof EquipmentTypeEnum;

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  category: LabCategory;
  description: string;
  status: 'available' | 'booked' | 'maintenance' | 'out-of-order';
  imageUrl: string;
  specifications?: {
    [key: string]: string;
  };
  quantity: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  location: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
}

export interface Request {
  id: string;
  userId: string;
  equipmentId: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  duration: number;
  returnDate?: string;
  notes?: string;
  purpose?: string;
  labCategory: LabCategory;
}

export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  date: string;
  description: string;
  technician: string;
  status: 'completed' | 'scheduled' | 'in-progress' | 'pending';
  cost?: number;
  parts?: string[];
  nextScheduledDate?: string;
  recommendations?: string;
}

export interface SoftwareLicense {
  id: string;
  name: string;
  vendor: string;
  type: 'individual' | 'floating' | 'site';
  totalLicenses: number;
  availableLicenses: number;
  expiryDate: string;
  cost?: number;
  renewalDate?: string;
  features?: string[];
}

export interface LabUsageStats {
  labId: string;
  category: LabCategory;
  totalEquipment: number;
  activeBookings: number;
  maintenanceCount: number;
  utilizationRate: number;
  peakHours: string[];
}