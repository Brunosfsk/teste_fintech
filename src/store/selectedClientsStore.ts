import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client } from '../types/Client';

interface SelectedClientsStore {
  selectedClients: Client[];
  addSelectedClient: (client: Client) => void;
  removeSelectedClient: (clientId: number) => void;
  clearSelectedClients: () => void;
  isClientSelected: (clientId: number) => boolean;
}

export const useSelectedClientsStore = create<SelectedClientsStore>()(
  persist(
    (set, get) => ({
      selectedClients: [],
      
      addSelectedClient: (client) => set((state) => ({
        selectedClients: [...state.selectedClients, client]
      })),
      
      removeSelectedClient: (clientId) => set((state) => ({
        selectedClients: state.selectedClients.filter(client => client.id !== clientId)
      })),
      
      clearSelectedClients: () => set({ selectedClients: [] }),
      
      isClientSelected: (clientId) => {
        return get().selectedClients.some(client => client.id === clientId);
      }
    }),
    {
      name: 'selected-clients-storage',
    }
  )
);