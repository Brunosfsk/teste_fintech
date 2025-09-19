import React, { useState } from 'react';
import { useClientStore } from '../../../store/clientStore';
import { Client } from '../../../types/Client';

interface ClientListProps {
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ onEdit, onView }) => {
  const { clients, deleteClient } = useClientStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(id);
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
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Buscar clientes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border-2 border-gray-200 rounded-md text-sm transition-colors duration-300 focus:outline-none focus:border-orange-500"
      />

      {filteredClients.length === 0 ? (
        <div className="text-center py-10 px-5 text-gray-600">
          <div className="text-5xl mb-4 opacity-50">🔍</div>
          <p className="text-base m-0">Nenhum cliente encontrado com os critérios de busca.</p>
        </div>
      ) : (
        filteredClients.map((client) => (
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(client)}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
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
                    onClick={() => handleDelete(client.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Excluir"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                   </svg>
                   <span className="text-sm text-gray-800 break-words">{client.companyValuation ? formatCurrency(client.companyValuation) : 'Não informado'}</span>
                 </div>
                 
                 <div className="flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                   </svg>
                   <span className="text-sm text-gray-800 break-words">
                     {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                   </span>
                 </div>
                 
                 <div className="flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                   </svg>
                   <span className="text-sm text-gray-800 break-words">{new Date(client.updatedAt).toLocaleDateString('pt-BR')}</span>
                 </div>
              </div>
            </div>
        ))
      )}
    </div>
  );
};

export default ClientList;