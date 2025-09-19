import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useClientStore } from '../../store/clientStore';
import { useClientApi } from '../../hooks/useClientApi';
import { Client } from '../../types/Client';
import ClientForm from '../clients/components/ClientForm';
import ClientTable from '../clients/components/ClientTable';
import ClientCards from '../clients/components/ClientCards';
import Modal from '../clients/components/Modal';
import Sidebar from '../../components/Sidebar';

const SelectedClientsMicrofrontend: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { currentPage, setClients, setPagination, setLoading, setError } = useClientStore();
  const { getClients } = useClientApi();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    loadClients(currentPage);
  }, []);

  const loadClients = async (page: number) => {
    try {
      setLoading(true);
      const response = await getClients({ page, limit: 12 });
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

  const handleSelectionChange = (selectedIds: number[]) => {
    setSelectedClients(selectedIds);
  };

  const handleViewClient = (client: Client) => {
    navigate(`/cliente/${client.id}`);
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <Sidebar selectedClientsCount={selectedClients.length} />
      
      <div className="flex-1 ml-48">
        <div className="w-full max-w-none xl:max-w-[80%] mx-auto p-5">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h1 className="text-3xl font-bold" style={{ color: '#EC6724' }}>Clientes Selecionados</h1>
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
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md animate-fade-in">
            {viewMode === 'table' ? (
              <ClientTable 
                onEdit={handleEditClient}
                onView={handleViewClient}
                selectedClients={selectedClients}
                onSelectionChange={handleSelectionChange}
                onPageChange={handlePageChange}
              />
            ) : (
              <ClientCards 
                onEdit={handleEditClient}
                onView={handleViewClient}
                selectedClients={selectedClients}
                onSelectionChange={handleSelectionChange}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Editar Cliente"
        size="lg"
      >
        <ClientForm
            client={editingClient}
            onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default SelectedClientsMicrofrontend;