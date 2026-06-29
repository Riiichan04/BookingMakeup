import apiClient from "./client";
import { Notification } from "@/types/notification";

export async function getRecentNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>("/notifications/recent");
  return data;
}

export async function getAllNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>("/notifications");
  return data;
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>("/notifications/unread-count");
  return data.count;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch("/notifications/read-all");
}
