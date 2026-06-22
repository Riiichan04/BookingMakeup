export interface PromotionDto {
    id: string;
    ownerId: string;
    code: string;
    discountValue: number;
    minOrderValue: number;
    pointCharge: number;
    expiryDate: string;
}

export interface CreatePromotionRequest {
    ownerId?: string;
    code: string;
    discountValue: number;
    minOrderValue: number;
    pointCharge: number;
    expiryDate: string;
}

export interface UpdatePromotionRequest {
    code?: string;
    discountValue?: number;
    minOrderValue?: number;
    pointCharge?: number;
    expiryDate?: string;
}

export interface ValidatePromotionRequest {
    code: string;
    bookingAmount: number;
    ownerId: string;
}

export interface PromotionValidationResponse {
    valid: boolean;
    discountAmount: number;
    finalAmount: number;
    errorMessage: string | null;
}
