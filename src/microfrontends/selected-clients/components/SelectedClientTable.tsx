import React, { useState } from 'react';
import { Client } from '../../../types/Client';

interface SelectedClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
  onDelete: (client: Client) => void;
  selectedClients: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

const SelectedClientTable: React.FC<SelectedClientTableProps> = ({ 
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
        <p className="text-base m-0">Nenhum cliente selecionado ainda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Search Bar */}
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="border-b border-gray-200" style={{ backgroundColor: '#FFF5F0' }}>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                    style={{ accentColor: '#EC6724' }}
                  />
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">Nome</th>
                <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                <th className="p-4 text-left font-semibold text-gray-700">Telefone</th>
                <th className="p-4 text-left font-semibold text-gray-700">Salário</th>
                <th className="p-4 text-left font-semibold text-gray-700">Avaliação da Empresa</th>
                <th className="p-4 text-left font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={(e) => handleSelectClient(client.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: '#EC6724' }}
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">{client.name}</td>
                  <td className="p-4 text-gray-600">{client.email}</td>
                  <td className="p-4 text-gray-600">{client.phone}</td>
                  <td className="p-4 text-gray-600">{formatCurrency(client.salary)}</td>
                  <td className="p-4 text-gray-600">{formatCurrency(client.companyValuation)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView(client)}
                        className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
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
                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(client)}
                        className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SelectedClientTable;