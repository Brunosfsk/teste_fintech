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
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleDelete = (id: string) => {
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
        className="p-3 border-2 border-gray-200 rounded-md text-sm mb-2 transition-colors duration-300 focus:outline-none focus:border-primary-500"
      />

      {filteredClients.length === 0 ? (
        <div className="text-center py-10 px-5 text-gray-600">
          <div className="text-5xl mb-4 opacity-50">🔍</div>
          <p className="text-base m-0">Nenhum cliente encontrado com os critérios de busca.</p>
        </div>
      ) : (
        filteredClients.map((client) => (
          <div
            key={client.id}
            className="border border-gray-200 rounded-lg p-5 transition-all duration-300 bg-gray-50 hover:border-primary-500 hover:-translate-y-0.5 hover:shadow-medium"
          >
            <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
              <h3 className="m-0 text-gray-800 text-xl font-semibold">{client.name}</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => onView(client)}
                  className="px-4 py-2 border-none rounded text-xs font-medium cursor-pointer transition-all duration-200 bg-primary-500 text-white hover:bg-primary-600 active:translate-y-0.5"
                >
                  Visualizar
                </button>
                <button
                  onClick={() => onEdit(client)}
                  className="px-4 py-2 border-none rounded text-xs font-medium cursor-pointer transition-all duration-200 bg-gray-500 text-white hover:bg-gray-600 active:translate-y-0.5"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="px-4 py-2 border-none rounded text-xs font-medium cursor-pointer transition-all duration-200 bg-red-500 text-white hover:bg-red-600 active:translate-y-0.5"
                >
                  Excluir
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">Email</span>
                <span className="text-sm text-gray-800 break-words">{client.email}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">Telefone</span>
                <span className="text-sm text-gray-800 break-words">{client.phone}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">CPF</span>
                <span className="text-sm text-gray-800 break-words">{client.cpf}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">Data de Nascimento</span>
                <span className="text-sm text-gray-800 break-words">
                  {new Date(client.birthDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">Endereço</span>
                <span className="text-sm text-gray-800 break-words">
                  {client.address.street}, {client.address.number} - {client.address.neighborhood}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">Cidade</span>
                <span className="text-sm text-gray-800 break-words">
                  {client.address.city} - {client.address.state}, {client.address.zipCode}
                </span>
              </div>
            </div>

            {client.notes && (
              <div className="mt-2 p-2 bg-gray-100 rounded border-l-4 border-primary-500">
                <div className="text-xs text-gray-600 font-medium mb-1 uppercase tracking-wide">
                  Observações
                </div>
                <div className="text-sm text-gray-800 leading-relaxed">
                  {client.notes}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ClientList;