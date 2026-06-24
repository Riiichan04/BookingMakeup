"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Palette, Search, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";

import { Playwrite_US_Trad } from "next/font/google";
const logoFont = Playwrite_US_Trad({
    weight: ["400"],
});

export default function Header() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
            params.append("keyword", searchQuery.trim());
        }
        router.push(`/search?${params.toString()}`);
    };

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-50">
            <div className="flex">
                <Link
                    className="flex items-center gap-2 group shrink-0"
                    href="/"
                >
                    <div className="bg-[#E4187D] rounded-full p-1.5 flex items-center justify-center transition-colors group-hover:bg-[#c9126b] shadow-sm">
                        <Palette className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className={`text-2xl text-[#E4187D] tracking-tight hidden sm:block ${logoFont.className}`}>
                        BookingMakeup
                    </span>
                </Link>

                <div className="hidden md:flex w-md flex-1 mx-6">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-pink-300 focus:ring-2 focus:ring-pink-100 sm:text-sm transition-all"
                            placeholder="Tìm kiếm chuyên gia, dịch vụ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
            </div>

            <div className="flex items-center gap-4 text-gray-500 shrink-0">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50 transition-colors">
                    <Bell className="w-5 h-5" />
                </Button>

                {isLoading ? (
                    <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" aria-hidden />
                ) : user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="relative h-9 w-9 rounded-full border cursor-pointer hover:opacity-90 transition-opacity focus:outline-none">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar || ""} alt={user.username || ""} className="object-cover" />
                                <AvatarFallback className="bg-gray-200 text-gray-800 text-xs font-bold">
                                    {user.username ? user.username[0].toUpperCase() : "U"}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src={user.avatar || ""} alt={user.username || ""} className="object-cover" />
                                            <AvatarFallback className="bg-gray-200 text-gray-800 text-xs font-bold">
                                                {user.username ? user.username[0].toUpperCase() : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col space-y-1 min-w-0">
                                            <p className="text-sm font-medium leading-tight truncate">
                                                {user.displayName || user.username}
                                            </p>
                                            <p className="text-xs leading-tight text-muted-foreground truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard")}>
                                    <User className="mr-2 h-4 w-4" /> Bảng điều khiển
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" /> Cài đặt
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:bg-destructive/10 cursor-pointer"
                                    onClick={() => logout()}
                                >
                                    <LogOut className="mr-2 h-4 w-4 text-destructive" /> Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button
                                className="cursor-pointer transition-colors"
                                variant="ghost"
                            >
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                className="cursor-pointer transition-all text-white hover:opacity-90 rounded-full"
                                style={{ backgroundColor: "#E4187D" }}
                            >
                                Bắt đầu ngay
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}