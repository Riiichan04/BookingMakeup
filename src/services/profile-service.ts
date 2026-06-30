import apiClient from '@/common/constant/api-client';
import { UserDto, ServiceOwnerProfileDto } from '@/types/user'; 

export interface UpdateCustomerProfileRequest {
  displayName: string;
  phone: string;
  address: string;
}

export interface UpdateServiceOwnerProfileRequest {
  bio?: string;
  experienceYears?: number;
  showcaseType?: string;
  identityFront?: string;
  identityBack?: string;
}

export const profileService = {
  getCustomerProfile: async (): Promise<UserDto> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  updateCustomerProfile: async (data: UpdateCustomerProfileRequest): Promise<UserDto> => {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  getServiceOwnerProfile: async (): Promise<ServiceOwnerProfileDto> => {
    const response = await apiClient.get('/users/profile/service-owner');
    return response.data;
  },

  updateServiceOwnerProfile: async (data: UpdateServiceOwnerProfileRequest): Promise<ServiceOwnerProfileDto> => {
    const response = await apiClient.put('/users/profile/service-owner', data);
    return response.data;
  }
};