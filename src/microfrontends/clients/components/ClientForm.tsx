import React, { useState, useEffect } from 'react';
import { useClientStore } from '../../../store/clientStore';
import { Client, ClientFormData } from '../../../types/Client';

interface ClientFormProps {
  client?: Client | null;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
  const { addClient, updateClient } = useClientStore();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const clientData = {
      name: formData.name,
      salary: formData.salary,
      companyValuation: formData.companyValuation,
    };

    if (client) {
      updateClient(client.id, clientData);
    } else {
      addClient(clientData);
    }
    
    onClose();
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
      {/* Nome */}
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

      {/* Salário */}
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

      {/* Avaliação da Empresa */}
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

      {/* Botões */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {client ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;