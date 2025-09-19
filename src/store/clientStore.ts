import { create } from 'zustand';
import { Client } from '../types/Client';

interface ClientStore {
  clients: Client[];
  totalClients: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setClients: (clients: Client[]) => void;
  setPagination: (pagination: { totalClients: number; currentPage: number; totalPages: number }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  deleteClient: (id: number) => void;
  getClientById: (id: number) => Client | undefined;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  totalClients: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  setClients: (clients) => set({ clients }),
  
  setPagination: (pagination) => set(pagination),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  addClient: (clientData) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      clients: [...state.clients, newClient],
      totalClients: state.totalClients + 1,
    }));
  },

  updateClient: (id, updatedData) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id
          ? { ...client, ...updatedData, updatedAt: new Date().toISOString() }
          : client
      ),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
      totalClients: state.totalClients - 1,
    }));
  },

  getClientById: (id) => {
    return get().clients.find((client) => client.id === id);
  },
}));