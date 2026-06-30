import apiClient from '@/common/constant/api-client';
import { ServiceDto } from '@/types/service';

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  duration: number;
}

export interface UpdateServiceRequest extends CreateServiceRequest {
  isActive: boolean;
}

export const makeupService = {
  getAllServices: async (): Promise<ServiceDto[]> => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  getMyServices: async (): Promise<ServiceDto[]> => {
    const response = await apiClient.get('/services/my-services');
    return response.data;
  },

  createService: async (data: CreateServiceRequest): Promise<ServiceDto> => {
    const response = await apiClient.post('/services', data);
    return response.data;
  },

  updateService: async (id: string, data: UpdateServiceRequest): Promise<ServiceDto> => {
    const response = await apiClient.put(`/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: string): Promise<string> => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  }
};