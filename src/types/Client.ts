export interface Client {
  id: number;
  name: string;
  salary: number;
  companyValuation: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  name: string;
  salary: number;
  companyValuation: number;
}

export interface PaginatedResponse<T> {
  clients: T[];
  totalPages: number;
  currentPage: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}