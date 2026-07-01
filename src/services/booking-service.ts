import apiClient from '@/common/constant/api-client';
import { BookingDto } from '@/types/booking';

export interface CreateBookingRequest {
  serviceId: string;
  ownerId: string;
  bookingDate: string;
  startTime: string;
  promoCode?: string;
}

export const bookingService = {
  createBooking: async (data: CreateBookingRequest): Promise<BookingDto> => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async (): Promise<BookingDto[]> => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string): Promise<BookingDto> => {
    const response = await apiClient.put(`/bookings/${id}/status`, { status });
    return response.data;
  }
};