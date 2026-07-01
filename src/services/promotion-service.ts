import apiClient from '@/common/constant/api-client';
import { PromotionDto } from '@/types/promotion';

export interface CreatePromotionRequest {
  code: string;
  discountValue: number;
  minOrderValue: number;
  pointCharge: number;
  expiryDate: string;
}

export interface ValidatePromotionRequest {
  code: string;
  bookingAmount: number;
  ownerId: string;
}

export interface ValidatePromotionResponse {
  valid: boolean;
  discountAmount: number;
  finalAmount: number;
  errorMessage: string | null;
}

export const promotionService = {
  getPromotions: async (): Promise<PromotionDto[]> => {
    const response = await apiClient.get('/promotions');
    return response.data;
  },

  createPromotion: async (data: CreatePromotionRequest): Promise<PromotionDto> => {
    const response = await apiClient.post('/promotions', data);
    return response.data;
  },

  updatePromotion: async (id: string, data: CreatePromotionRequest): Promise<PromotionDto> => {
    const response = await apiClient.put(`/promotions/${id}`, data);
    return response.data;
  },

  deletePromotion: async (id: string): Promise<string> => {
    const response = await apiClient.delete(`/promotions/${id}`);
    return response.data;
  },

  validatePromotion: async (data: ValidatePromotionRequest): Promise<ValidatePromotionResponse> => {
    const response = await apiClient.post('/promotions/validate', data);
    return response.data;
  }
};