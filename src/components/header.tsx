"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Settings, User } from "lucide-react";
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

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shrink-0">
            <span className="text-xl font-bold text-[#E4187D] tracking-wide">
                Booking Makeup
            </span>

            <div className="flex items-center gap-4 text-gray-500">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50 transition-colors">
                    <Bell className="w-5 h-5" />
                </Button>

                {user ? (
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
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" /> Thông tin của bạn
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
                                className="cursor-pointer transition-all text-white hover:opacity-90"
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