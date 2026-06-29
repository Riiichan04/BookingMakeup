export type NotificationType =
  | "BOOKING_PENDING"
  | "BOOKING_CONFIRMED"
  | "BOOKING_REJECTED"
  | "BOOKING_CANCELLED"
  | "BOOKING_PAID"
  | "BOOKING_COMPLETED";

export interface Notification {
  id: string;
  recipientId: string;
  bookingId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
