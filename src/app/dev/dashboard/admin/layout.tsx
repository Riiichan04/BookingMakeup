"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/dashboard/dev-sidebar-layout";
import { ADMIN_TABS } from "@/common/constant/dashboard";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (user) {
            const role = String(user.role).toUpperCase().trim();
            if (role === "ADMIN" || role === "1") {
                setIsVerified(true);
            } else {
                router.push("/dev/dashboard");
            }
        }
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
                        <Sidebar user={user} onLogout={handleLogout} tabs={ADMIN_TABS} />
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
