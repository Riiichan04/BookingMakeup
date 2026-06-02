import apiClient from '@/common/constant/api-client'; // Điều chỉnh đường dẫn này nếu cần
import { Artist, Booking } from '@/types/artist';

export const artistService = {
  // Lấy danh sách thợ của SO
  getMyArtists: async (): Promise<Artist[]> => {
    // Axios tự động gắn token từ interceptor và nối baseURL
    const response = await apiClient.get('/artists/my-artists');
    return response.data; 
  },

  // Lấy chi tiết thợ
  getArtistById: async (id: string): Promise<Artist> => {
    const response = await apiClient.get(`/artists/${id}`);
    return response.data;
  },

  // Lấy lịch làm việc của thợ
  getArtistBookings: async (artistId: string): Promise<Booking[]> => {
    const response = await apiClient.get(`/bookings/artist/${artistId}`);
    return response.data;
  },
  createArtist: async (data: { artistName: string; specialization: string; portfolioImages: string }): Promise<Artist> => {
    const response = await apiClient.post('/artists', data);
    return response.data;
  }
};