"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { profileService } from "@/services/profile-service";
import { Loader2 } from "lucide-react";

export default function DashboardRootPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Đợi context Auth load xong
        if (isLoading) return;

        // Nếu chưa đăng nhập, đá về trang login
        if (!user) {
            router.push("/login");
            return;
        }

        const determineAndRedirect = async () => {
            
            const userRole = String(user.role).toUpperCase().trim();

            // 1. NẾU LÀ ADMIN (1) -> Chuyển vào menu Quản lý người dùng
            if (userRole === "ADMIN" || userRole === "1") {
                router.push("/dev/dashboard/admin/users");
                return;
            }

            // 2. NẾU LÀ USER (0) -> Kiểm tra xem có phải là Service Owner (SO) bằng cách gọi API profile
            // (Vì trên server chỉ có role admin=1 và user=0, thông tin SO được lưu ở bảng service_owners)
            const isSO = await profileService.checkIsServiceOwner();
            if (isSO) {
                router.push("/dev/dashboard/so/bookings");
                return;
            } else {
                router.push("/dev/dashboard/customer/bookings");
                return;
            }
        };

        determineAndRedirect();
    }, [user, isLoading, router]);

    // Giao diện hiển thị tạm thời trong lúc chờ check quyền (khoảng 0.5s)
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 animate-spin text-[#E4187D] mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Đang tải không gian làm việc...</p>
        </div>
    );
}