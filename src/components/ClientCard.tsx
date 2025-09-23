import React from 'react';
import { Client } from '../types/Client';

interface ClientCardProps {
  client: Client;
  isSelected: boolean;
  onSelect: (clientId: number, checked: boolean) => void;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  showCheckbox?: boolean;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  showCheckbox = true
}) => {
  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 relative">
      <div className="flex items-start justify-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
               style={{ backgroundColor: '#EC6724' }}>
            {client.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-12">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">{client.name}</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-sm text-gray-600">{client.companyValuation ? formatCurrency(client.companyValuation) : 'Não informado'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
            </svg>
            <span className="text-sm text-gray-600">{new Date(client.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {showCheckbox && (
        <div className="absolute bottom-4 right-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(client.id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
            style={{ accentColor: '#EC6724' }}
          />
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <button
            onClick={() => onView(client)}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors duration-200 border border-orange-200 hover:border-orange-300"
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
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200 border border-yellow-200 hover:border-yellow-300"
            title="Editar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(client)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
            title="Excluir"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;