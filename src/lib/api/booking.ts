import { BookingDto, CreateBookingRequest, BookingStatus } from "@/types/booking";
import apiClient from "./client";
import { PromotionDto } from "@/types/promotion";

// Tạo booking mới
export async function createBooking(data: CreateBookingRequest): Promise<BookingDto> {
  const { data: res } = await apiClient.post<BookingDto>("/bookings", data);
  return res;
}

// Lấy danh sách booking của user hiện tại
export async function getMyBookings(): Promise<BookingDto[]> {
  const { data } = await apiClient.get<BookingDto[]>("/bookings");
  return data;
}

// Lấy chi tiết một booking
export async function getBookingById(id: string): Promise<BookingDto> {
  const { data } = await apiClient.get<BookingDto>(`/bookings/${id}`);
  return data;
}

// Lấy booking theo nghệ sĩ (để kiểm tra lịch bận — không cần auth)
export async function getBookingsByArtist(artistId: string): Promise<BookingDto[]> {
  const { data } = await apiClient.get<BookingDto[]>(`/bookings/artist/${artistId}`);
  return data;
}

// Cập nhật trạng thái booking (SO / Artist / Admin)
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<BookingDto> {
  const { data } = await apiClient.put<BookingDto>(`/bookings/${id}/status`, { status });
  return data;
}

// Lấy giảm giá trong trang booking
export async function getPlatformPromotions(): Promise<PromotionDto[]> {
  const { data } = await apiClient.get<PromotionDto[]>("/promotions/platform");
  return data;
}

// Lấy mã đang áp dụng của Studio
export async function getStudioPromotions(ownerId: string): Promise<PromotionDto[]> {
  const { data } = await apiClient.get<PromotionDto[]>(`/promotions/studio/${ownerId}`);
  return data;
}