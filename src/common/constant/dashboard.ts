import { CalendarClock, Heart, User, Users, Tag, MessageSquare, Palette, Search, Settings, ShieldCheck } from "lucide-react";

export const ADMIN_TABS = [
    { label: "Quản lý Người dùng", href: "dev/dashboard/admin/users", icon: Users },
    { label: "Mã Khuyến mãi", href: "dev/dashboard/admin/promotions", icon: Tag },
    { label: "Kiểm duyệt Đánh giá", href: "dev/dashboard/admin/reviews", icon: ShieldCheck },
];

export const SO_TABS = [
    { label: "Quản lý Đặt lịch", href: "dev/dashboard/so/bookings", icon: CalendarClock },
    { label: "Quản lý Dịch vụ", href: "dev/dashboard/so/services", icon: Palette },
    { label: "Đội ngũ Artist", href: "dev/dashboard/so/artists", icon: Users },
    { label: "Đánh giá nhận được", href: "dev/dashboard/so/reviews", icon: MessageSquare },
    { label: "Hồ sơ Cửa hàng", href: "dev/dashboard/so/profile", icon: Settings },
];

export const CUSTOMER_TABS = [
    { label: "Lịch hẹn của tôi", href: "dev/dashboard/customer/bookings", icon: CalendarClock },
    { label: "Khám phá Dịch vụ", href: "dev/dashboard/customer/explorer", icon: Search },
    { label: "Dịch vụ Yêu thích", href: "dev/dashboard/customer/wishlist", icon: Heart },
    { label: "Artist Đang Theo dõi", href: "dev/dashboard/customer/following", icon: User },
    { label: "Hồ sơ Cá nhân", href: "dev/dashboard/customer/profile", icon: Settings },
];