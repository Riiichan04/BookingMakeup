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
            console.log("DỮ LIỆU USER TỪ BACKEND TRẢ VỀ:", user);
            
            const userRole = String(user.role).toUpperCase().trim();
            console.log("ROLE SAU KHI XỬ LÝ CHUỖI:", userRole);

            // 1. NẾU LÀ ADMIN -> Chuyển vào menu Quản lý người dùng
            if (userRole === "ADMIN") {
                router.push("/dev/dashboard/admin/users");
                return;
            }

            // 2. NẾU BACKEND TRẢ VỀ RÕ LÀ SERVICE OWNER -> Chuyển vào Quản lý lịch khách đặt
            if (userRole === "SO") {
                router.push("/dev/dashboard/so/bookings");
                return;
            }

            // 3. NẾU LÀ USER -> Kiểm tra xem có phải là Chủ tiệm (SO) không
            if (userRole === "USER") {
                try {
                    const res = await profileService.getServiceOwnerProfile();
                    if (res && res.userId) {
                        // Là Chủ tiệm -> Chuyển vào Quản lý lịch khách đặt
                        router.push("/dev/dashboard/so/bookings");
                    } else {
                        // Là Khách hàng -> Chuyển vào Lịch hẹn của tôi
                        router.push("/dev/dashboard/customer/bookings");
                    }
                } catch (error) {
                    // Lỗi 404/403 tức là Khách hàng -> Chuyển vào Lịch hẹn của tôi
                    router.push("/dev/dashboard/customer/bookings");
                }
                return;
            }

            // Mặc định an toàn nếu không khớp role nào
            router.push("/dev/dashboard/customer/bookings");
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