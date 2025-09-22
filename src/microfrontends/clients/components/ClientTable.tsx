import React, { useState } from 'react';
import { useClientStore } from '../../../store/clientStore';
import { useClientApi } from '../../../hooks/useClientApi';
import { Client } from '../../../types/Client';
import Pagination from '../../../components/Pagination';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ClientTableProps {
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
  selectedClients: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  onPageChange: (page: number) => void;
  onSuccess?: () => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ 
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredClients.map(client => client.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectClient = (clientId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedClients, clientId]);
    } else {
      onSelectionChange(selectedClients.filter(id => id !== clientId));
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const isAllSelected = filteredClients.length > 0 && 
    filteredClients.every(client => selectedClients.includes(client.id));
  
  const isIndeterminate = selectedClients.length > 0 && 
    !isAllSelected && 
    filteredClients.some(client => selectedClients.includes(client.id));

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
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    style={{ accentColor: '#EC6724' }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avaliação da Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atualização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={(e) => handleSelectClient(client.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ accentColor: '#EC6724' }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.companyValuation ? formatCurrency(client.companyValuation) : 'Não informado'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(client.createdAt).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(client.updatedAt).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.salary ? formatCurrency(client.salary) : 'Não informado'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView(client)}
                        className="hover:opacity-80 transition-colors"
                        style={{ color: '#EC6724' }}
                        title="Visualizar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit(client)}
                        className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Excluir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default ClientTable;