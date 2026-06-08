import { BookingDto, CreateBookingRequest } from "@/types/booking";
import apiClient from "./client";

// Lấy token JWT từ localStorage
function getAuthHeader() {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("authDto");
  if (!raw) return {};
  try {
    const auth = JSON.parse(raw);
    return auth.jwtToken ? { Authorization: `Bearer ${auth.jwtToken}` } : {};
  } catch {
    return {};
  }
}

// Tạo booking mới
export async function createBooking(data: CreateBookingRequest): Promise<BookingDto> {
  const { data: res } = await apiClient.post<BookingDto>("/bookings", data, {
    headers: getAuthHeader(),
  });
  return res;
}

// Lấy danh sách booking của user hiện tại
export async function getMyBookings(): Promise<BookingDto[]> {
  const { data } = await apiClient.get<BookingDto[]>("/bookings", {
    headers: getAuthHeader(),
  });
  return data;
}

// Lấy chi tiết một booking
export async function getBookingById(id: string): Promise<BookingDto> {
  const { data } = await apiClient.get<BookingDto>(`/bookings/${id}`, {
    headers: getAuthHeader(),
  });
  return data;
}

// Lấy booking theo nghệ sĩ (để kiểm tra lịch bận)
export async function getBookingsByArtist(artistId: string): Promise<BookingDto[]> {
  const { data } = await apiClient.get<BookingDto[]>(`/bookings/artist/${artistId}`, {
    headers: getAuthHeader(),
  });
  return data;
}
