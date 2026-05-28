import { apiUrl } from '@/common/constant/api-url';
import { Artist, Booking } from '@/types/artist';

const getAuthHeader = () => {
  const token = localStorage.getItem('token'); //FIXME
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const artistService = {
  // Lấy danh sách thợ
  getMyArtists: async (): Promise<Artist[]> => {
    const response = await fetch(`${apiUrl}/artists/my-artists`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Không thể tải danh sách Artist');
    return response.json();
  },

  getArtistById: async (id: string): Promise<Artist> => {
    const response = await fetch(`${apiUrl}/artists/${id}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Không thể tải thông tin Artist');
    return response.json();
  },

  getArtistBookings: async (artistId: string): Promise<Booking[]> => {
    const response = await fetch(`${apiUrl}/bookings/artist/${artistId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Không thể tải lịch làm việc');
    return response.json();
  }
};