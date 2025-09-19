import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useClientStore } from '../../store/clientStore';
import { Client } from '../../types/Client';
import ClientForm from './components/ClientForm';
import ClientTable from './components/ClientTable';
import Modal from './components/Modal';
import SelectedClientsModal from './components/SelectedClientsModal';

const ClientsMicrofrontend: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const clients = useClientStore((state) => state.clients);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isSelectedClientsModalOpen, setIsSelectedClientsModalOpen] = useState(false);

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedClients(selectedIds);
  };

  const handleViewClient = (client: Client) => {
    navigate(`/cliente/${client.id}`);
  };

  const handleViewSelectedClients = () => {
    setIsSelectedClientsModalOpen(true);
  };

  const handleCloseSelectedClientsModal = () => {
    setIsSelectedClientsModalOpen(false);
  };

  const handleEditFromSelected = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setEditingClient(client);
      setIsModalOpen(true);
      setIsSelectedClientsModalOpen(false);
    }
  };

  const handleViewFromSelected = (clientId: string) => {
    setIsSelectedClientsModalOpen(false);
    navigate(`/cliente/${clientId}`);
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen p-5" style={{backgroundColor: '#5459AC'}}>
      <div className="w-full max-w-none xl:max-w-[80%] mx-auto">
        <div className="card mb-8 animate-fade-in gradient-header">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-white md:text-xl">
              Bem-vindo, {user}!
            </h1>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="card animate-slide-up">
          <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-primary-500">
            <h2 className="text-xl font-semibold text-gray-900">
              Lista de Clientes ({clients.length})
            </h2>
          <div className="flex gap-3">
            {selectedClients.length > 0 && (
              <>
                <button
                  onClick={handleViewSelectedClients}
                  className="btn-secondary text-sm"
                >
                  Ver Selecionados ({selectedClients.length})
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Deseja excluir ${selectedClients.length} cliente(s) selecionado(s)?`)) {
                      // Implementar exclusão em lote se necessário
                      setSelectedClients([]);
                    }
                  }}
                  className="btn-danger text-sm"
                >
                  Excluir Selecionados ({selectedClients.length})
                </button>
              </>
            )}
            <button
              onClick={handleOpenModal}
              className="btn-primary"
            >
              + Cadastrar Cliente
            </button>
          </div>
        </div>
        <ClientTable 
          onEdit={handleEditClient}
          onView={handleViewClient}
          selectedClients={selectedClients}
          onSelectionChange={handleSelectionChange}
        />
       </div>
     </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? 'Editar Cliente' : 'Cadastrar Cliente'}
        size="lg"
      >
        <ClientForm 
          editingClient={editingClient}
          onCancel={handleCloseModal}
          onSuccess={handleCloseModal}
        />
      </Modal>

      <SelectedClientsModal
        isOpen={isSelectedClientsModalOpen}
        onClose={handleCloseSelectedClientsModal}
        selectedClientIds={selectedClients}
        onEdit={handleEditFromSelected}
        onView={handleViewFromSelected}
      />
    </div>
  );
};

export default ClientsMicrofrontend;