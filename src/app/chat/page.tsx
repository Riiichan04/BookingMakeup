"use client";

import { apiUrl } from "@/common/constant/api-url";
import ChatDashboard from "@/components/chat/chat-dashboard";
import Header from "@/components/header";
import { useAuth } from "@/contexts/auth-context";

export default function ChatPage() {
    const { user } = useAuth()

    if (!user) return null

    if (!user?.id) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
                <p className="text-sm text-gray-500 animate-pulse">Đang nạp dữ liệu phiên làm việc...</p>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <ChatDashboard
                currentUserId={user.id}
                apiUrl={apiUrl}
            />
        </div>
    );
}