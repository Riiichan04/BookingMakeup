import apiClient from '@/common/constant/api-client';
import { ReviewDto } from '@/types/review';

export interface CreateReviewRequest {
  bookingId: string;
  bookingRating: number;
  artistRating: number;
  comment: string;
  tags: string;
}

export const reviewService = {
  getAllSystemReviews: async (): Promise<ReviewDto[]> => {
    const response = await apiClient.get('/reviews');
    return response.data;
  },

  updateSystemReviewStatus: async (id: string, status: "APPROVED" | "HIDDEN"): Promise<ReviewDto> => {
    const response = await apiClient.patch(`/reviews/${id}/status`, { status });
    return response.data;
  },

  deleteSystemReview: async (id: string): Promise<string> => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  getMyReceivedReviews: async (): Promise<ReviewDto[]> => {
    const response = await apiClient.get('/reviews/owner');
    return response.data;
  },

  createReview: async (data: CreateReviewRequest): Promise<ReviewDto> => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },

  getReviewsByService: async (serviceId: string): Promise<ReviewDto[]> => {
    const response = await apiClient.get(`/reviews/service/${serviceId}`);
    return response.data;
  }
};