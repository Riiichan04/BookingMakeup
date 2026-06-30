import apiClient from '@/common/constant/api-client';
import { ServiceDto } from '@/types/service';

export const favouriteService = {
  getFavourites: async (): Promise<ServiceDto[]> => {
    const response = await apiClient.get('/favourites');
    return response.data;
  },

  addFavourite: async (serviceId: string): Promise<string> => {
    const response = await apiClient.post(`/favourites/${serviceId}`);
    return response.data;
  },

  removeFavourite: async (serviceId: string): Promise<string> => {
    const response = await apiClient.delete(`/favourites/${serviceId}`);
    return response.data;
  }
};