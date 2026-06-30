import { TabItem } from "@/types/dashboard";
import { CalendarClock, Heart, User } from "lucide-react";

export const CUSTOMER_TABS: TabItem[] = [
    { href: "/dev/dashboard", label: "Lịch Hẹn Của Tôi", icon: CalendarClock },
    { href: "/dev/dashboard/profile", label: "Hồ Sơ Cá Nhân", icon: User },
    { href: "/dev/dashboard/wishlist", label: "Danh Sách Yêu Thích", icon: Heart },
];
