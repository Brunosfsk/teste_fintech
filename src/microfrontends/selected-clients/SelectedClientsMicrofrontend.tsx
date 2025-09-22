import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useSelectedClientsStore } from '../../store/selectedClientsStore';
import { useClientStore } from '../../store/clientStore';
import { Client } from '../../types/Client';
import ClientForm from '../clients/components/ClientForm';
import SelectedClientTable from './components/SelectedClientTable';
import SelectedClientCards from './components/SelectedClientCards';
import Modal from '../clients/components/Modal';
import ConfirmDeleteModal from '../clients/components/ConfirmDeleteModal';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const SelectedClientsMicrofrontend: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { selectedClients, removeSelectedClient, clearSelectedClients } = useSelectedClientsStore();
  const { deleteClient } = useClientStore();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    selectedClients.forEach(client => {
      if (!selectedIds.includes(client.id)) {
        removeSelectedClient(client.id);
      }
    });
  };

  const handleViewClient = (client: Client) => {
    navigate(`/cliente/${client.id}`);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      removeSelectedClient(clientToDelete.id);
      setClientToDelete(null);
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setClientToDelete(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleClearSelected = () => {
    clearSelectedClients();
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar selectedClientsCount={selectedClients.length} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`flex-1 pt-24 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'md:ml-64 ml-0 opacity-75' : 'ml-0 opacity-100'
      }`}>
        <div className="w-full max-w-none xl:max-w-[80%] mx-auto p-5">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h1 className="text-3xl font-bold" style={{ color: '#EC6724' }}>Clientes Selecionados</h1>
              <div className="flex items-center gap-4">
                {/* Botão Limpar Selecionados */}
                {selectedClients.length > 0 && (
                  <button
                    onClick={handleClearSelected}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                  >
                    Limpar Selecionados
                  </button>
                )}
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Visualização:</span>
                  <div className="relative">
                    <div 
                      className="w-16 h-8 rounded-full p-1 cursor-pointer transition-colors duration-200"
                      style={{ backgroundColor: viewMode === 'table' ? '#EC6724' : '#e5e7eb' }}
                      onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                    >
                      <div 
                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                          viewMode === 'cards' ? 'translate-x-8' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
                    </svg>
                    <span>Tabela</span>
                    <span className="mx-2">|</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                    </svg>
                    <span>Cards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md animate-fade-in">
            {viewMode === 'table' ? (
              <SelectedClientTable 
                clients={selectedClients}
                onEdit={handleEditClient}
                onView={handleViewClient}
                onDelete={handleDeleteClient}
                selectedClients={selectedClients.map(client => client.id)}
                onSelectionChange={handleSelectionChange}
              />
            ) : (
              <SelectedClientCards 
                clients={selectedClients}
                onEdit={handleEditClient}
                onView={handleViewClient}
                onDelete={handleDeleteClient}
                selectedClients={selectedClients.map(client => client.id)}
                onSelectionChange={handleSelectionChange}
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Editar Cliente"
        size="md"
      >
        <ClientForm
            client={editingClient}
            onClose={handleCloseModal}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        clientName={clientToDelete?.name || ''}
      />
    </div>
  );
};

export default SelectedClientsMicrofrontend;