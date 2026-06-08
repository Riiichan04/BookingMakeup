import { BookingDto, CreateBookingRequest } from "@/types/booking";
import apiClient from "./client";

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
