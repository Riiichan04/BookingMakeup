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
  },

  checkIsServiceOwner: async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    const cached = sessionStorage.getItem("is_service_owner");
    if (cached === "true") return true;
    if (cached === "false") return false;

    try {
      const res = await profileService.getServiceOwnerProfile();
      if (res && res.userId) {
        sessionStorage.setItem("is_service_owner", "true");
        return true;
      }
      sessionStorage.setItem("is_service_owner", "false");
      return false;
    } catch {
      sessionStorage.setItem("is_service_owner", "false");
      return false;
    }
  }
};