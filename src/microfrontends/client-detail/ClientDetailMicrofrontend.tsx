import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientStore } from '../../store/clientStore';
import { useUserStore } from '../../store/userStore';

const ClientDetailMicrofrontend: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const getClientById = useClientStore((state) => state.getClientById);

  if (!user) {
    navigate('/');
    return null;
  }

  const client = id ? getClientById(id) : null;

  if (!client) {
    return (
      <div className="min-h-screen p-5" style={{backgroundColor: '#5459AC'}}>
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
    <div className="min-h-screen p-5" style={{backgroundColor: '#5459AC'}}>
      <div className="w-full max-w-none xl:max-w-[80%] mx-auto">
        <div className="card mb-8 animate-fade-in">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Cliente</h1>
            <div className="flex gap-3">
              <button 
                onClick={handleEdit}
                className="btn-primary"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-primary-500">
              Informações Pessoais
            </h2>
            <div className="space-y-4">
              <div className="info-item">
                <span className="info-label">Nome:</span>
                <span className="info-value">{client.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{client.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Telefone:</span>
                <span className="info-value">{client.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CPF:</span>
                <span className="info-value">{client.cpf}</span>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-primary-500">
              Endereço
            </h2>
            <div className="space-y-4">
              <div className="info-item">
                <span className="info-label">CEP:</span>
                <span className="info-value">{client.address.cep}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Rua:</span>
                <span className="info-value">{client.address.street}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Número:</span>
                <span className="info-value">{client.address.number}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Complemento:</span>
                <span className="info-value">{client.address.complement || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Bairro:</span>
                <span className="info-value">{client.address.neighborhood}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Cidade:</span>
                <span className="info-value">{client.address.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado:</span>
                <span className="info-value">{client.address.state}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-8 animate-slide-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-primary-500">
            Informações Adicionais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="info-item">
              <span className="info-label">Data de Nascimento:</span>
              <span className="info-value">
                {new Date(client.birthDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Renda Mensal:</span>
              <span className="info-value">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(client.monthlyIncome || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailMicrofrontend;