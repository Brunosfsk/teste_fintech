import React, { useState } from 'react';
import { Client } from '../../../types/Client';
import ClientCard from '../../../components/ClientCard';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              isSelected={selectedClients.includes(client.id)}
              onSelect={handleSelectClient}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              showCheckbox={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedClientCards;