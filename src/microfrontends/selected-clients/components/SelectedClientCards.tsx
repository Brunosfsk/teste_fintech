import React, { useState } from 'react';
import { Client } from '../../../types/Client';

interface SelectedClientCardsProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
  onDelete: (client: Client) => void;
  selectedClients: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

const SelectedClientCards: React.FC<SelectedClientCardsProps> = ({ 
  clients,
  onEdit, 
  onView, 
  onDelete,
  selectedClients, 
  onSelectionChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (clients.length === 0) {
    return (
      <div className="text-center py-10 px-5 text-gray-600">
        <div className="text-5xl mb-4 opacity-50">👥</div>
        <p className="text-base m-0">Nenhum cliente selecionado ainda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar clientes selecionados por nome..."
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
          <p className="text-base m-0">Nenhum cliente encontrado com esse termo de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative"
            >
              <div className="flex items-start justify-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                       style={{ backgroundColor: '#EC6724' }}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-xs text-gray-500">
                  {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{client.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {/* <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span>{client.email}</span>
                  </div> */}
                  {/* <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{client.phone}</span>
                  </div> */}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Salário:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(client.salary)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Avaliação da Empresa:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(client.companyValuation)}</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={(e) => handleSelectClient(client.id, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: '#EC6724' }}
                />
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(client)}
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors"
                    style={{ 
                      color: '#EC6724',
                      backgroundColor: '#FFF5F0',
                      border: '1px solid #EC6724'
                    }}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(client)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(client)}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedClientCards;