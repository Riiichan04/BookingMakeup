import {
  UserDto,
  ServiceOwnerProfileDto,
  UpdateServiceOwnerProfileRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/user";
import apiClient from "./client";

// Lấy thông tin cá nhân hiện tại
export async function getProfile(): Promise<UserDto> {
  const { data } = await apiClient.get<UserDto>("/users/profile");
  return data;
}

// Cập nhật thông tin cá nhân
export async function updateProfile(payload: UpdateProfileRequest): Promise<UserDto> {
  const { data } = await apiClient.put<UserDto>("/users/profile", payload);
  return data;
}

// Lấy thông tin chi tiết của Service Owner hiện tại
export async function getServiceOwnerProfile(): Promise<ServiceOwnerProfileDto> {
  const { data } = await apiClient.get<ServiceOwnerProfileDto>("/users/profile/service-owner");
  return data;
}

// Cập nhật thông tin Service Owner
export async function updateServiceOwnerProfile(payload: UpdateServiceOwnerProfileRequest): Promise<ServiceOwnerProfileDto> {
  const { data } = await apiClient.put<ServiceOwnerProfileDto>("/users/profile/service-owner", payload);
  return data;
}

// Đổi mật khẩu
export async function changePassword(payload: ChangePasswordRequest): Promise<string> {
  const { data } = await apiClient.put<string>("/users/password", payload);
  return data;
}

// Lấy thông tin công khai của bất kỳ user nào
export async function getUserById(id: string): Promise<UserDto> {
  const { data } = await apiClient.get<UserDto>(`/users/${id}`);
  return data;
}

// Lấy tất cả user (Admin)
export async function getAllUsers(): Promise<UserDto[]> {
  const { data } = await apiClient.get<UserDto[]>("/users");
  return data;
}

// Cập nhật trạng thái kích hoạt tài khoản (Admin)
export async function updateUserStatus(id: string, active: boolean): Promise<UserDto> {
  const { data } = await apiClient.put<UserDto>(`/users/${id}/status`, { active });
  return data;
}

// Cập nhật vai trò người dùng (Admin)
export async function updateUserRole(id: string, role: string): Promise<UserDto> {
  const { data } = await apiClient.put<UserDto>(`/users/${id}/role`, { role });
  return data;
}
