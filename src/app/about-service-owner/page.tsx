"use client";

import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    ArrowRight,
    CalendarCheck,
    LayoutDashboard,
    Megaphone,
    ShieldCheck,
    Star,
    Store,
    UserCircle,
    Users,
} from "lucide-react";

const BENEFITS = [
    {
        icon: Users,
        title: "Tiếp cận khách hàng tiềm năng",
        description:
            "Hồ sơ Service Owner của bạn hiển thị trên nền tảng, giúp khách hàng dễ dàng tìm thấy và đặt lịch trực tuyến.",
    },
    {
        icon: CalendarCheck,
        title: "Quản lý lịch hẹn tập trung",
        description:
            "Nhận yêu cầu booking, xác nhận hoặc từ chối lịch ngay trên dashboard — không cần nhắn tin rời rạc.",
    },
    {
        icon: LayoutDashboard,
        title: "Dashboard chuyên nghiệp",
        description:
            "Quản lý dịch vụ, khuyến mãi, đánh giá và hồ sơ nghề nghiệp trong một giao diện thống nhất.",
    },
    {
        icon: Megaphone,
        title: "Tạo khuyến mãi thu hút",
        description:
            "Phát hành mã giảm giá, ưu đãi theo mùa để tăng tỷ lệ chuyển đổi và giữ chân khách hàng cũ.",
    },
    {
        icon: Star,
        title: "Xây dựng uy tín",
        description:
            "Hệ thống đánh giá minh bạch giúp bạn tích lũy review thật, nâng cao độ tin cậy với khách mới.",
    },
    {
        icon: ShieldCheck,
        title: "Xác minh danh tính",
        description:
            "Hồ sơ được xác thực CMND/CCCD tạo niềm tin với khách hàng và bảo vệ cộng đồng nghề nghiệp.",
    },
] as const;

const STEPS = [
    {
        step: 1,
        icon: UserCircle,
        title: "Tạo tài khoản",
        description: "Đăng ký email, tên người dùng và mật khẩu để bắt đầu.",
    },
    {
        step: 2,
        icon: Store,
        title: "Hoàn thiện hồ sơ Service Owner",
        description:
            "Điền bio, kinh nghiệm, loại hình (artist độc lập hoặc studio) và tải ảnh CMND/CCCD.",
    },
    {
        step: 3,
        icon: LayoutDashboard,
        title: "Đăng dịch vụ & nhận booking",
        description:
            "Thêm gói makeup, thiết lập giá và bắt đầu nhận lịch từ khách hàng trên toàn quốc.",
    },
] as const;

export default function AboutServiceOwnerPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
            <Header />

            <section className="relative bg-[#E4187D] py-20 px-4 md:px-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center text-pink-200 hover:text-white text-sm mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Về trang chủ
                    </Link>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Trở Thành Service Owner Trên BookingMakeup
                    </h1>
                    <p className="text-pink-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                        Dù bạn là <span className="font-medium text-white">chuyên viên makeup độc lập</span> hay{" "}
                        <span className="font-medium text-white">chủ studio</span>, BookingMakeup giúp bạn kết nối
                        khách hàng, quản lý dịch vụ và phát triển thương hiệu cá nhân trên một nền tảng duy nhất.
                    </p>

                    <Link href="/register/service-owner">
                        <Button className="bg-white text-[#E4187D] hover:bg-gray-50 hover:scale-105 rounded-full px-8 py-6 font-bold text-base shadow-xl transition-all">
                            Đăng ký ngay
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-20">
                <div className="flex flex-col gap-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Service Owner Là Gì?</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        <span className="font-semibold text-[#E4187D]">Service Owner</span> là chủ tài khoản cung cấp
                        dịch vụ trang điểm trên nền tảng — có thể là một artist làm việc độc lập hoặc một studio có
                        nhiều artist. Service Owner quản lý hồ sơ, dịch vụ và lịch hẹn; các artist (nếu có) thuộc về
                        service owner đó.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                        <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
                            <UserCircle className="w-6 h-6 text-[#E4187D]" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Artist độc lập</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Bạn tự làm việc, tự quản lý lịch và dịch vụ. Một tài khoản Service Owner là đủ để đăng gói
                            makeup và nhận booking trực tiếp từ khách hàng.
                        </p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                        <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
                            <Store className="w-6 h-6 text-[#E4187D]" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Studio / Salon</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Bạn đại diện cho studio, quản lý nhiều artist và dịch vụ dưới một hồ sơ Service Owner. Phù
                            hợp cho đơn vị có đội ngũ và nhiều gói dịch vụ khác nhau.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-20">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lợi Ích Khi Gia Nhập</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Mọi công cụ bạn cần để vận hành dịch vụ makeup trực tuyến — từ hồ sơ đến booking.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        {BENEFITS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-pink-100 transition-all"
                                >
                                    <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5 text-[#E4187D]" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-20">
                <h2 className="text-3xl font-bold text-gray-900 text-center">Bắt Đầu Trong 3 Bước</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    {STEPS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.step} className="text-center">
                                <div className="relative inline-flex items-center justify-center mb-6 pt-2">
                                    <div className="w-16 h-16 bg-[#E4187D] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="absolute top-0 -right-2 w-7 h-7 bg-white border-2 border-[#E4187D] rounded-full text-[#E4187D] text-sm font-bold flex items-center justify-center">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="bg-[#E4187D] py-16 px-4 md:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-md">
                        Sẵn sàng bắt đầu hành trình của bạn?
                    </h2>
                    <p className="text-white/95 mb-8 leading-relaxed drop-shadow-sm">
                        Đăng ký miễn phí, hoàn thiện hồ sơ Service Owner và đăng dịch vụ đầu tiên ngay hôm nay.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register/service-owner">
                            <Button className="bg-white text-[#E4187D] hover:bg-gray-50 rounded-full px-8 py-6 font-bold shadow-xl w-full sm:w-auto">
                                Đăng ký làm Service Owner
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button
                                variant="outline"
                                className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 font-bold w-full sm:w-auto"
                            >
                                Đã có tài khoản? Đăng nhập
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
