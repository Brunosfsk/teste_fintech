import { useState, useCallback } from 'react';
import { Client, ClientFormData, PaginatedResponse, PaginationParams } from '../types/Client';

const API_BASE_URL = 'https://boasorte.teddybackoffice.com.br';

export const useClientApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = useCallback(async <T>(
    request: () => Promise<Response>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await request();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('API Error:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET - Listar clientes com paginação
  const getClients = useCallback(async (params: PaginationParams): Promise<PaginatedResponse<Client> | null> => {
    return handleRequest<PaginatedResponse<Client>>(() =>
      fetch(`${API_BASE_URL}/users?page=${params.page}&limit=${params.limit}`)
    );
  }, [handleRequest]);

  // GET - Buscar cliente por ID
  const getClientById = useCallback(async (id: number): Promise<Client | null> => {
    return handleRequest<Client>(() =>
      fetch(`${API_BASE_URL}/users/${id}`)
    );
  }, [handleRequest]);

  // POST - Criar novo cliente
  const createClient = useCallback(async (clientData: ClientFormData): Promise<Client | null> => {
    return handleRequest<Client>(() =>
      fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      })
    );
  }, [handleRequest]);

  // PUT - Atualizar cliente
  const updateClient = useCallback(async (id: number, clientData: ClientFormData): Promise<Client | null> => {
    return handleRequest<Client>(() =>
      fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      })
    );
  }, [handleRequest]);

  // DELETE - Deletar cliente
  const deleteClient = useCallback(async (id: number): Promise<boolean> => {
    const result = await handleRequest<any>(() =>
      fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      })
    );
    return result !== null;
  }, [handleRequest]);

  return {
    loading,
    error,
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
  };
};