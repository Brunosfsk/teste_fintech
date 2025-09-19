import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, ClientFormData } from '../types/Client';

interface ClientState {
  clients: Client[];
  addClient: (clientData: ClientFormData) => void;
  updateClient: (id: string, clientData: ClientFormData) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      clients: [],
      
      addClient: (clientData: ClientFormData) => {
        const newClient: Client = {
          id: generateId(),
          ...clientData,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          clients: [...state.clients, newClient]
        }));
      },
      
      updateClient: (id: string, clientData: ClientFormData) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id
              ? {
                  ...client,
                  ...clientData,
                  updatedAt: new Date().toISOString(),
                }
              : client
          )
        }));
      },
      
      deleteClient: (id: string) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id)
        }));
      },
      
      getClientById: (id: string) => {
        return get().clients.find((client) => client.id === id);
      },
    }),
    {
      name: 'clients-storage',
    }
  )
);