import apiClient from '@/common/constant/api-client';

export interface BookingDetailDto {
    id: string;
    bookingDate: string;
    customerName: string;
    serviceName: string;
    totalAmount: number;
    depositAmount: number;
    platformFee: number;
    studioReceives: number;
    status: string;
    statusLabel: string;
}

export interface RevenueStatisticsResponse {
    totalRevenue: number;
    platformFee: number;
    studioRevenue: number;
    totalDeposit: number;
    bookings: BookingDetailDto[];
}

export interface BookingStatisticsResponse {
    totalBookings: number;
    pendingCount: number;
    confirmedCount: number;
    paidCount: number;
    completedCount: number;
    cancelledCount: number;
    customerCount: number;
    pendingPercentage: number;
    confirmedPercentage: number;
    paidPercentage: number;
    completedPercentage: number;
    cancelledPercentage: number;
    completionRate: number;
    cancellationRate: number;
}

export interface ServiceOwnerVerificationDto {
    userId: string;
    displayName: string;
    email: string;
    phone: string;
    bio: string;
    experienceYears: number;
    showcaseType: "STANDARD" | "PREMIUM";
    identityFront: string | null;
    identityBack: string | null;
    verificationStatus: string;
}

export const statisticsService = {
    getRevenueStatistics: async (): Promise<RevenueStatisticsResponse> => {
        const response = await apiClient.get<RevenueStatisticsResponse>('/admin/statistics/revenue');
        return response.data;
    },

    getBookingStatistics: async (): Promise<BookingStatisticsResponse> => {
        const response = await apiClient.get<BookingStatisticsResponse>('/admin/statistics/bookings');
        return response.data;
    },

    getPendingVerifications: async (): Promise<ServiceOwnerVerificationDto[]> => {
        const response = await apiClient.get<ServiceOwnerVerificationDto[]>('/admin/statistics/verifications');
        return response.data;
    },

    getVerificationDetail: async (userId: string): Promise<ServiceOwnerVerificationDto> => {
        const response = await apiClient.get<ServiceOwnerVerificationDto>(`/admin/statistics/verifications/${userId}`);
        return response.data;
    },

    approveVerification: async (userId: string): Promise<ServiceOwnerVerificationDto> => {
        const response = await apiClient.put<ServiceOwnerVerificationDto>(`/admin/statistics/verifications/${userId}/approve`);
        return response.data;
    },

    rejectVerification: async (userId: string): Promise<ServiceOwnerVerificationDto> => {
        const response = await apiClient.put<ServiceOwnerVerificationDto>(`/admin/statistics/verifications/${userId}/reject`);
        return response.data;
    }
};
