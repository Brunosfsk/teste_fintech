export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  cep?: string;
  complement?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  monthlyIncome?: number;
  address: Address;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  monthlyIncome?: number;
  address: Address;
  notes?: string;
}