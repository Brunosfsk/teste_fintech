import React, { useState, useEffect } from 'react';
import { useClientStore } from '../../../store/clientStore';
import { Client, ClientFormData } from '../../../types/Client';

interface ClientFormProps {
  editingClient?: Client | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ editingClient, onCancel, onSuccess }) => {
  const addClient = useClientStore((state) => state.addClient);
  const updateClient = useClientStore((state) => state.updateClient);

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    monthlyIncome: 0,
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name,
        email: editingClient.email,
        phone: editingClient.phone,
        cpf: editingClient.cpf,
        birthDate: editingClient.birthDate,
        monthlyIncome: editingClient.monthlyIncome,
        address: { ...editingClient.address }
      });
    } else {
      resetForm();
    }
  }, [editingClient]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      birthDate: '',
      monthlyIncome: 0,
      address: {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (formData.monthlyIncome <= 0) {
      newErrors.monthlyIncome = 'Renda mensal deve ser maior que zero';
    }

    if (!formData.address.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    }

    if (!formData.address.street.trim()) {
      newErrors.street = 'Rua é obrigatória';
    }

    if (!formData.address.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }

    if (!formData.address.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.address.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (editingClient) {
        updateClient(editingClient.id, formData);
      } else {
        addClient(formData);
      }
      
      resetForm();
      if (onSuccess) {
        onSuccess();
      } else if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('address.')) {
      const addressField = field.replace('address.', '');
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Nome *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Nome completo"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div>
          <label className="form-label">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="email@exemplo.com"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div>
          <label className="form-label">Telefone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="(11) 99999-9999"
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        <div>
          <label className="form-label">CPF *</label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            className={`form-input ${errors.cpf ? 'border-red-500' : ''}`}
            placeholder="000.000.000-00"
          />
          {errors.cpf && <p className="form-error">{errors.cpf}</p>}
        </div>

        <div>
          <label className="form-label">Data de Nascimento *</label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className={`form-input ${errors.birthDate ? 'border-red-500' : ''}`}
          />
          {errors.birthDate && <p className="form-error">{errors.birthDate}</p>}
        </div>

        <div>
          <label className="form-label">Renda Mensal *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.monthlyIncome}
            onChange={(e) => handleInputChange('monthlyIncome', parseFloat(e.target.value) || 0)}
            className={`form-input ${errors.monthlyIncome ? 'border-red-500' : ''}`}
            placeholder="0.00"
          />
          {errors.monthlyIncome && <p className="form-error">{errors.monthlyIncome}</p>}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">CEP *</label>
            <input
              type="text"
              value={formData.address.cep}
              onChange={(e) => handleInputChange('address.cep', e.target.value)}
              className={`form-input ${errors.cep ? 'border-red-500' : ''}`}
              placeholder="00000-000"
            />
            {errors.cep && <p className="form-error">{errors.cep}</p>}
          </div>

          <div>
            <label className="form-label">Rua *</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              className={`form-input ${errors.street ? 'border-red-500' : ''}`}
              placeholder="Nome da rua"
            />
            {errors.street && <p className="form-error">{errors.street}</p>}
          </div>

          <div>
            <label className="form-label">Número *</label>
            <input
              type="text"
              value={formData.address.number}
              onChange={(e) => handleInputChange('address.number', e.target.value)}
              className={`form-input ${errors.number ? 'border-red-500' : ''}`}
              placeholder="123"
            />
            {errors.number && <p className="form-error">{errors.number}</p>}
          </div>

          <div>
            <label className="form-label">Complemento</label>
            <input
              type="text"
              value={formData.address.complement}
              onChange={(e) => handleInputChange('address.complement', e.target.value)}
              className="form-input"
              placeholder="Apto, casa, etc."
            />
          </div>

          <div>
            <label className="form-label">Bairro *</label>
            <input
              type="text"
              value={formData.address.neighborhood}
              onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
              className={`form-input ${errors.neighborhood ? 'border-red-500' : ''}`}
              placeholder="Nome do bairro"
            />
            {errors.neighborhood && <p className="form-error">{errors.neighborhood}</p>}
          </div>

          <div>
            <label className="form-label">Cidade *</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
              className={`form-input ${errors.city ? 'border-red-500' : ''}`}
              placeholder="Nome da cidade"
            />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>

          <div>
            <label className="form-label">Estado *</label>
            <select
              value={formData.address.state}
              onChange={(e) => handleInputChange('address.state', e.target.value)}
              className={`form-input ${errors.state ? 'border-red-500' : ''}`}
            >
              <option value="">Selecione o estado</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
            {errors.state && <p className="form-error">{errors.state}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : editingClient ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
        </button>
        
        {editingClient && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ClientForm;