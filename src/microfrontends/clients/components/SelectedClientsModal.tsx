import React from 'react';
import { useClientStore } from '../../../store/clientStore';
import Modal from './Modal';

interface SelectedClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClientIds: number[];
  onEdit: (clientId: number) => void;
  onView: (clientId: number) => void;
}

const SelectedClientsModal: React.FC<SelectedClientsModalProps> = ({
  isOpen,
  onClose,
  selectedClientIds,
  onEdit,
  onView
}) => {
  const getClientById = useClientStore((state) => state.getClientById);
  
  const selectedClients = selectedClientIds
    .map(id => getClientById(id))
    .filter(client => client !== undefined);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Clientes Selecionados (${selectedClients.length})`}
      size="xl"
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {selectedClients.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-500">Nenhum cliente selecionado</p>
          </div>
        ) : (
          selectedClients.map((client) => (
            <div
              key={client.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{client.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Avaliação da Empresa:</span> {client.companyValuation ? formatCurrency(client.companyValuation) : 'Não informado'}
                    </div>
                    <div>
                      <span className="font-medium">Data Criação:</span> {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Última Atualização:</span> {new Date(client.updatedAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <span className="font-medium">ID:</span> {client.id}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onView(client.id)}
                    className="text-sm font-medium"
                style={{ color: '#EC6724' }}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(client.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedClients.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total de clientes selecionados: {selectedClients.length}</span>
            <span>
              Salário total: {formatCurrency(
                selectedClients.reduce((total, client) => total + (client.salary || 0), 0)
              )}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SelectedClientsModal;