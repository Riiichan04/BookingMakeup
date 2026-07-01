"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/dashboard/dev-sidebar-layout";
import { SO_TABS } from "@/common/constant/dashboard";
import { profileService } from "@/services/profile-service";

export default function SODashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        // Kiểm tra xem thực sự có phải là SO không (Bảo mật)
        const checkSO = async () => {
            const isSO = await profileService.checkIsServiceOwner();
            if (isSO) {
                setIsVerified(true);
            } else {
                router.push("/dev/dashboard/customer/profile"); // Đá về trang khách nếu hack URL
            }
        };
        if (user) checkSO();
    }, [user, router]);

    const handleLogout = async () => {
        if (logout) {
            await logout();
            router.push("/login");
        }
    };

    if (!user || !isVerified) return null;

    return (
        <div className="bg-white min-h-screen font-sans flex flex-col">
            <Header />

            <div className="flex flex-col lg:flex-row w-full flex-1 border-t border-gray-100">
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="sticky top-20 h-[calc(100vh-80px)]">
                        <Sidebar user={user} onLogout={handleLogout} tabs={SO_TABS} />
                    </div>
                </aside>

                <main className="flex-1 bg-gray-50/30 p-6 lg:p-10 border-l border-gray-100 min-h-[calc(100vh-80px)]">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}