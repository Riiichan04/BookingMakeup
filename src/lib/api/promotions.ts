import {
  PromotionDto,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  ValidatePromotionRequest,
  PromotionValidationResponse,
} from "@/types/promotion";
import apiClient from "./client";

// Lấy danh sách promotions (có thể lọc theo ownerId)
export async function getPromotions(ownerId?: string): Promise<PromotionDto[]> {
  const { data } = await apiClient.get<PromotionDto[]>("/promotions", {
    params: ownerId ? { ownerId } : undefined,
  });
  return data;
}

// Lấy chi tiết promotion
export async function getPromotionById(id: string): Promise<PromotionDto> {
  const { data } = await apiClient.get<PromotionDto>(`/promotions/${id}`);
  return data;
}

// Tạo promotion mới (SO / Admin)
export async function createPromotion(payload: CreatePromotionRequest): Promise<PromotionDto> {
  const { data } = await apiClient.post<PromotionDto>("/promotions", payload);
  return data;
}

// Cập nhật promotion (SO / Admin)
export async function updatePromotion(id: string, payload: UpdatePromotionRequest): Promise<PromotionDto> {
  const { data } = await apiClient.put<PromotionDto>(`/promotions/${id}`, payload);
  return data;
}

// Xóa promotion (SO / Admin)
export async function deletePromotion(id: string): Promise<string> {
  const { data } = await apiClient.delete<string>(`/promotions/${id}`);
  return data;
}

// Kiểm tra / Validate coupon code trước khi đặt lịch
export async function validatePromotion(payload: ValidatePromotionRequest): Promise<PromotionValidationResponse> {
  const { data } = await apiClient.post<PromotionValidationResponse>("/promotions/validate", payload);
  return data;
}
