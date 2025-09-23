import React, { useState } from 'react';
import { useClientStore } from '../../../store/clientStore';
import { useClientApi } from '../../../hooks/useClientApi';
import { Client } from '../../../types/Client';
import Pagination from '../../../components/Pagination';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ClientCard from '../../../components/ClientCard';

interface ClientCardsProps {
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
  selectedClients: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  onPageChange: (page: number) => void;
  onSuccess?: () => void;
}

const ClientCards: React.FC<ClientCardsProps> = ({ 
  onEdit, 
  onView, 
  selectedClients, 
  onSelectionChange,
  onPageChange,
  onSuccess
}) => {
  const { clients, deleteClient: deleteClientFromStore, totalPages, currentPage, isLoading } = useClientStore();
  const { deleteClient: deleteClientApi } = useClientApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (client: Client) => {
    setClientToDelete(client);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (clientToDelete) {
      try {
        await deleteClientApi(clientToDelete.id);
        deleteClientFromStore(clientToDelete.id);
        // Remove from selection if was selected
        if (selectedClients.includes(clientToDelete.id)) {
          onSelectionChange(selectedClients.filter(clientId => clientId !== clientToDelete.id));
        }
        onSuccess?.();
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
      } finally {
        setClientToDelete(null);
        setIsConfirmDeleteOpen(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setClientToDelete(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleSelectClient = (clientId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedClients, clientId]);
    } else {
      onSelectionChange(selectedClients.filter(id => id !== clientId));
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-10 px-5 text-gray-600">
        <div className="text-5xl mb-4 opacity-50">👥</div>
        <p className="text-base m-0">Nenhum cliente cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Search Bar */}
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar clientes por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border-2 border-gray-200 rounded-md text-sm transition-colors duration-300 focus:outline-none"
          style={{ borderColor: '#EC6724' }}
        />
        {selectedClients.length > 0 && (
          <div className="text-sm text-gray-600">
            {selectedClients.length} cliente(s) selecionado(s)
          </div>
        )}
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-10 px-5 text-gray-600">
          <div className="text-5xl mb-4 opacity-50">🔍</div>
          <p className="text-base m-0">Nenhum cliente encontrado com os critérios de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              isSelected={selectedClients.includes(client.id)}
              onSelect={handleSelectClient}
              onView={onView}
              onEdit={onEdit}
              onDelete={handleDelete}
              showCheckbox={true}
            />
          ))}
        </div>
      )}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        loading={isLoading}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        clientName={clientToDelete?.name || ''}
      />
    </div>
  );
};

export default ClientCards;