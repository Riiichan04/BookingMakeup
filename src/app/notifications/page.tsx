"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/contexts/auth-context";
import {
  getAllNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/notifications";
import { Notification } from "@/types/notification";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    getAllNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }
    if (notification.bookingId) {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8 min-h-[60vh]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#E4187D]/10 p-2 rounded-full">
            <Bell className="w-5 h-5 text-[#E4187D]" />
          </div>
          <h1 className="text-2xl font-bold">Tất cả thông báo</h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Đánh dấu đã đọc
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Đang tải...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Chưa có thông báo nào
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleClick(notification)}
              className={`w-full text-left p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                !notification.read
                  ? "border-[#E4187D]/30 bg-pink-50/30"
                  : "border-gray-100"
              }`}
            >
              <div className="flex items-start gap-3">
                {!notification.read && (
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#E4187D] shrink-0" />
                )}
                <div className={notification.read ? "pl-0" : ""}>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
