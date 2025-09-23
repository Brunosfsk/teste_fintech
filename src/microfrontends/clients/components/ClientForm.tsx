import React, { useState, useEffect } from 'react';
import { useClientStore } from '../../../store/clientStore';
import { useClientApi } from '../../../hooks/useClientApi';
import { Client, ClientFormData } from '../../../types/Client';

interface ClientFormProps {
  client?: Client | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose, onSuccess }) => {
  const { addClient, updateClient } = useClientStore();
  const { createClient, updateClient: updateClientApi, loading, error } = useClientApi();

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    salary: 0,
    companyValuation: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        salary: client.salary,
        companyValuation: client.companyValuation
      });
    } else {
      resetForm();
    }
  }, [client]);

  const resetForm = () => {
    setFormData({
      name: '',
      salary: 0,
      companyValuation: 0
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.salary <= 0) {
      newErrors.salary = 'Salário deve ser maior que zero';
    }

    if (formData.companyValuation <= 0) {
      newErrors.companyValuation = 'Avaliação da empresa deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const clientData = {
      name: formData.name,
      salary: formData.salary,
      companyValuation: formData.companyValuation,
    };

    try {
      if (client) {
        const updatedClient = await updateClientApi(client.id, clientData);
        if (updatedClient) {
          updateClient(client.id, updatedClient);
          onSuccess?.();
          onClose();
        }
      } else {
        const newClient = await createClient(clientData);
        if (newClient) {
          addClient(newClient);
          onSuccess?.();
          onClose();
        }
      }
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
    }
  };

  const handleInputChange = (field: keyof ClientFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o nome completo"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
          Salário *
        </label>
        <input
          type="number"
          id="salary"
          value={formData.salary || ''}
          onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
            errors.salary ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o salário"
          min="0"
          step="0.01"
        />
        {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
      </div>

      <div>
        <label htmlFor="companyValuation" className="block text-sm font-medium text-gray-700 mb-2">
          Avaliação da Empresa
        </label>
        <input
          type="number"
          id="companyValuation"
          value={formData.companyValuation || ''}
          onChange={(e) => handleInputChange('companyValuation', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
            errors.companyValuation ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite a avaliação da empresa"
          min="0"
          step="0.01"
        />
        {errors.companyValuation && <p className="mt-1 text-sm text-red-600">{errors.companyValuation}</p>}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Salvando...' : (client ? 'Atualizar' : 'Cadastrar')}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;