import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrencyByCountry } from '../utils/formatters';

interface UserProfile {
  name: string;
  email?: string;
}

interface Settings {
  country: string;
  language: string;
  currency: string;
}

interface StoreState {
  isLoggedIn: boolean;
  userProfile: UserProfile;
  settings: Settings;
  invoices: any[];
  customers: any[];
  agentMetrics: any[];
  
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserProfile: (profile: UserProfile) => void;
  setSettings: (settings: Partial<Settings>) => void;
  setInvoices: (invoices: any[]) => void;
  setCustomers: (customers: any[]) => void;
  setAgentMetrics: (metrics: any[]) => void;
  updateSetting: (key: keyof Settings, value: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userProfile: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      settings: {
        country: 'GB',
        language: 'en',
        currency: getCurrencyByCountry('GB'),
      },
      invoices: [],
      customers: [],
      agentMetrics: [],

      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setInvoices: (invoices) => set({ invoices }),
      setCustomers: (customers) => set({ customers }),
      setAgentMetrics: (metrics) => set({ agentMetrics: metrics }),
      updateSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: value,
            ...(key === 'country' && { currency: getCurrencyByCountry(value) }),
          },
        })),
    }),
    {
      name: 'enterprise-ai-storage',
    }
  )
);
