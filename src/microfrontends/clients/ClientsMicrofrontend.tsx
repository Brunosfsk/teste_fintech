import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useClientStore } from '../../store/clientStore';
import { useClientApi } from '../../hooks/useClientApi';
import { Client } from '../../types/Client';
import ClientForm from './components/ClientForm';
import ClientTable from './components/ClientTable';
import ClientCards from './components/ClientCards';
import Modal from './components/Modal';
import SelectedClientsModal from './components/SelectedClientsModal';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useSelectedClientsStore } from '../../store/selectedClientsStore';

const ClientsMicrofrontend: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { clients, currentPage, setClients, setPagination, setLoading, setError } = useClientStore();
  const { getClients } = useClientApi();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectedClientsModalOpen, setIsSelectedClientsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Usando o store de clientes selecionados
  const { selectedClients, addSelectedClient, removeSelectedClient } = useSelectedClientsStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Verificar se não há clientes no store ou se é necessário recarregar
    if (clients.length === 0) {
      loadClients(currentPage);
    }
  }, [clients.length, currentPage]);

  const loadClients = async (page: number) => {
    try {
      setLoading(true);
      const response = await getClients({ page, limit: 16 });
      if (response) {
        setClients(response.clients);
        setPagination({
          totalClients: response.clients.length,
          currentPage: response.currentPage,
          totalPages: response.totalPages
        });
      }
    } catch (error) {
      setError('Erro ao carregar clientes');
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadClients(page);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    loadClients(currentPage);
  };

  const handleSelectionChange = (selectedIds: number[]) => {
    const currentSelectedIds = selectedClients.map(client => client.id);
    
    selectedIds.forEach(id => {
      if (!currentSelectedIds.includes(id)) {
        const client = clients.find(c => c.id === id);
        if (client) {
          addSelectedClient(client);
        }
      }
    });
    
    currentSelectedIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        removeSelectedClient(id);
      }
    });
  };

  const handleViewClient = (client: Client) => {
    navigate(`/cliente/${client.id}`);
  };

  const handleCloseSelectedClientsModal = () => {
    setIsSelectedClientsModalOpen(false);
  };

  const handleEditFromSelected = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setEditingClient(client);
      setIsModalOpen(true);
      setIsSelectedClientsModalOpen(false);
    }
  };

  const handleViewFromSelected = (clientId: number) => {
    setIsSelectedClientsModalOpen(false);
    navigate(`/cliente/${clientId}`);
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
              <h1 className="text-3xl font-bold" style={{ color: '#EC6724' }}>Clientes</h1>
              <div className="flex items-center gap-4">
                {/* Toggle de Visualização */}
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
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
                  style={{ backgroundColor: '#EC6724' }}
                >
                  Adicionar Cliente
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md animate-fade-in">
            {viewMode === 'table' ? (
              <ClientTable 
                onEdit={handleEditClient}
                onView={handleViewClient}
                selectedClients={selectedClients.map(client => client.id)}
                onSelectionChange={handleSelectionChange}
                onPageChange={handlePageChange}
                onSuccess={handleSuccess}
              />
            ) : (
              <ClientCards 
                onEdit={handleEditClient}
                onView={handleViewClient}
                selectedClients={selectedClients.map(client => client.id)}
                onSelectionChange={handleSelectionChange}
                onPageChange={handlePageChange}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? 'Editar Cliente' : 'Cadastrar Cliente'}
        size="md"
      >
        <ClientForm
            client={editingClient}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
        />
      </Modal>

      <SelectedClientsModal
        isOpen={isSelectedClientsModalOpen}
        onClose={handleCloseSelectedClientsModal}
        selectedClientIds={selectedClients.map(client => client.id)}
        onEdit={handleEditFromSelected}
        onView={handleViewFromSelected}
      />
    </div>
  );
};

export default ClientsMicrofrontend;