import { CalendarClock, Heart, Users, Tag, MessageSquare, Palette, Settings, ShieldCheck, TrendingUp, BarChart3, UserCheck, Wallet } from "lucide-react";

export const ADMIN_TABS = [
    { label: "Thống kê Doanh thu", href: "/dashboard/admin/revenue", icon: TrendingUp },
    { label: "Thống kê Đơn hàng", href: "/dashboard/admin/bookings-stats", icon: BarChart3 },
    { label: "Duyệt hồ sơ SO", href: "/dashboard/admin/verifications", icon: UserCheck },
    { label: "Quản lý Người dùng", href: "/dashboard/admin/users", icon: Users },
    { label: "Mã Khuyến mãi", href: "/dashboard/admin/promotions", icon: Tag },
    { label: "Kiểm duyệt Đánh giá", href: "/dashboard/admin/reviews", icon: ShieldCheck },
    { label: "Phê duyệt rút tiền", href: "/dashboard/admin/withdraw", icon: Wallet },
    { label: "Hồ sơ Cá nhân", href: "/dashboard/admin/profile", icon: Settings },
];

export const SO_TABS = [
    { label: "Quản lý Đặt lịch", href: "/dashboard/so/bookings", icon: CalendarClock },
    { label: "Quản lý Dịch vụ", href: "/dashboard/so/services", icon: Palette },
    { label: "Đội ngũ Artist", href: "/artists", icon: Users },
    { label: "Đánh giá nhận được", href: "/dashboard/so/reviews", icon: MessageSquare },
    { label: "Hồ sơ Cửa hàng", href: "/dashboard/so/profile", icon: Settings },
    { label: "Ví doanh thu", href: "/dashboard/so/wallet", icon: Wallet }
];

export const CUSTOMER_TABS = [
    { label: "Lịch hẹn của tôi", href: "/dashboard/customer/bookings", icon: CalendarClock },
    { label: "Yêu thích", href: "/dashboard/customer/wishlist", icon: Heart },
    { label: "Hồ sơ Cá nhân", href: "/dashboard/customer/profile", icon: Settings },
];