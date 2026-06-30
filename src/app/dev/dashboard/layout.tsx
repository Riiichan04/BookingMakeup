"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/dashboard/dev-sidebar-layout";
import { CUSTOMER_TABS } from "@/common/constant/dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        if (logout) {
            await logout();
            router.push("/login");
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white min-h-screen font-sans flex flex-col">
            <Header />

            <div className="flex flex-col lg:flex-row w-full flex-1 border-t border-gray-100">

                <aside className="w-full lg:w-70 shrink-0">
                    <div className="sticky top-20 h-[calc(100vh-80px)]">
                        <Sidebar user={user} onLogout={handleLogout} tabs={CUSTOMER_TABS} />
                    </div>
                </aside>

                <main className="flex-1 bg-white p-6 lg:p-10">
                    {children}
                </main>

            </div>
        </div>
    );
}