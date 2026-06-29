"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Bell, CheckCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/contexts/auth-context";
import {
  getAllNotifications,
  markAllNotificationsAsRead,
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

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8 min-h-[60vh]">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#E4187D]/10 p-2 rounded-full">
            <Bell className="w-5 h-5 text-[#E4187D]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Tất cả thông báo</h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-2 border-[#E4187D]/30 text-[#E4187D] hover:bg-[#E4187D]/5 hover:text-[#E4187D]"
          >
            <CheckCheck className="w-4 h-4" />
            Đánh dấu đã đọc
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Đang tải...</div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <div className="bg-gray-100 p-4 rounded-full">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm">Chưa có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`w-full p-4 rounded-xl border ${
                !notification.read
                  ? "border-[#E4187D]/20 bg-pink-50/40"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                {!notification.read ? (
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#E4187D] shrink-0" />
                ) : (
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
