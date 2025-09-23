import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientStore } from '../../store/clientStore';
import { useUserStore } from '../../store/userStore';
import { useClientApi } from '../../hooks/useClientApi';
import { Client } from '../../types/Client';

const ClientDetailMicrofrontend: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { clients, getClientById } = useClientStore();
  const { getClientById: getClientByIdApi } = useClientApi();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const clientId = parseInt(id);
      
      let foundClient: Client | null = getClientById(clientId) || null;
      
      if (!foundClient && clients.length === 0) {
        try {
          foundClient = await getClientByIdApi(clientId);
        } catch (error) {
          console.error('Erro ao buscar cliente na API:', error);
        }
      }
      
      setClient(foundClient);
      setLoading(false);
    };

    loadClient();
  }, [id, clients.length, getClientById, getClientByIdApi]);

  if (!user) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen p-5" style={{backgroundColor: '#f5f5f5'}}>
        <div className="card animate-fade-in">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h2>
            <p className="text-gray-600">Buscando informações do cliente.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen p-5" style={{backgroundColor: '#f5f5f5'}}>
        <div className="card animate-fade-in">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cliente não encontrado</h2>
            <p className="text-gray-600 mb-6">O cliente que você está procurando não existe.</p>
            <button 
              onClick={() => navigate('/clientes')}
              className="btn-primary"
            >
              Voltar para Lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate('/clientes');
  };

  const handleBack = () => {
    navigate('/clientes');
  };

  return (
    <div className="min-h-screen p-5" style={{backgroundColor: '#f5f5f5'}}>
      <div className="w-full max-w-none xl:max-w-[80%] mx-auto">
        <div className="card mb-8 animate-fade-in">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-bold" style={{ color: '#EC6724' }}>Detalhes do Cliente</h1>
            <div className="flex gap-3">
              <button 
                onClick={handleEdit}
                className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
                style={{ backgroundColor: '#EC6724' }}
              >
                Editar Cliente
              </button>
              <button 
                onClick={handleBack}
                className="btn-secondary"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <p className="text-gray-900">{client.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <p className="text-gray-900">{client.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação da Empresa</label>
              <p className="text-gray-900">
                {client.companyValuation ? new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(client.companyValuation) : 'Não informado'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Criação</label>
              <p className="text-gray-900">{new Date(client.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Última Atualização</label>
              <p className="text-gray-900">{new Date(client.updatedAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailMicrofrontend;