"use client";

import React from "react";
import { LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthDto } from "@/types/auth";
import { TabItem } from "@/types/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
    user: AuthDto;
    onLogout: () => void;
    tabs: TabItem[];
}

export default function Sidebar({ user, onLogout, tabs }: SidebarProps) {
    const pathname = usePathname();
    if (!user) return
    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* User Sidebar */}
            {user.role === "USER" &&
                <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                    <Avatar className="w-12 h-12 shrink-0 shadow-inner">
                        <AvatarImage src={user.avatar || ""} alt={user.displayName || user.username} className="object-cover" />

                        <AvatarFallback className="bg-pink-100 text-[#ec4899] font-bold text-xl">
                            {user.displayName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-900 text-base truncate">
                            {user.displayName || user.username}
                        </h3>
                        <p className="text-xs font-medium text-[#ec4899] mt-0.5">
                            {user.totalPoint || 0} điểm thưởng
                        </p>
                    </div>
                </div>
            }

            {/* Admin Sidebar */}
            {user.role === "ADMIN" && <></>}

            {/* Menu Navigation */}
            <nav className="flex flex-col flex-1 overflow-y-auto py-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex items-center justify-between px-6 py-4 w-full cursor-pointer transition-all text-sm font-semibold border-l-4 ${isActive
                                ? "bg-[#fdf2f8] text-[#ec4899] border-[#ec4899]"
                                : "text-gray-600 hover:bg-gray-50 border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? "text-[#ec4899]" : "text-gray-400"}`} />
                                {tab.label}
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-[#ec4899]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-gray-100">
                <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 p-5 w-full cursor-pointer font-bold transition-all text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}