"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, KeyRound, Eye, ShieldAlert, Database } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-gray-900">Chính sách bảo mật</h1>
                        <p className="text-xs text-gray-400 font-medium">Cập nhật lần cuối: Ngày 24 tháng 5, 2026</p>
                    </div>
                    <Link href="/register">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 rounded-lg">
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            Quay lại
                        </Button>
                    </Link>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Chính sách bảo mật này mô tả cách thức <span className="font-semibold text-[#E4187D]">BookingMakeup</span> thu thập, lưu trữ, sử dụng và bảo vệ thông tin cá nhân của bạn khi tương tác trực tiếp trên nền tảng. Chúng tôi tôn trọng và cam kết bảo vệ sự riêng tư tối đa của người dùng.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#E4187D]">
                            <Database className="w-5 h-5 shrink-0" />
                            <h2 className="text-md font-bold text-gray-900">1. Thông tin chúng tôi thu thập</h2>
                        </div>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 leading-relaxed">
                            <li><span className="font-semibold text-gray-800">Thông tin tài khoản:</span> Email, Tên đăng nhập, Mật khẩu khi bạn khởi tạo tài khoản đăng ký.</li>
                            <li><span className="font-semibold text-gray-800">Thông tin dịch vụ:</span> Lịch sử tin nhắn chat real-time, hình ảnh layout makeup đính kèm, thông tin lịch hẹn, thời gian và địa điểm thực hiện dịch vụ nhằm mục đích vận hành hệ thống.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#E4187D]">
                            <Eye className="w-5 h-5 shrink-0" />
                            <h2 className="text-md font-bold text-gray-900">2. Mục đích sử dụng thông tin</h2>
                        </div>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 leading-relaxed">
                            <li>Xác thực danh tính người dùng khi đăng nhập, quản lý trạng thái đặt lịch (Booking) và vận hành các luồng trò chuyện trực tuyến một cách chính xác.</li>
                            <li>Gửi các thông báo hệ thống tự động quan trọng như: Xác nhận mã OTP quên mật khẩu, cập nhật trạng thái đơn đặt lịch dịch vụ thành công hoặc bị từ chối từ Artist.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#E4187D]">
                            <KeyRound className="w-5 h-5 shrink-0" />
                            <h2 className="text-md font-bold text-gray-900">3. Cơ chế bảo mật dữ liệu và Cookie</h2>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-7">
                            Chúng tôi áp dụng các tiêu chuẩn mã hóa dữ liệu nghiêm ngặt cho toàn bộ hệ thống lưu trữ database mật khẩu người dùng. Hệ thống sử dụng cơ chế lưu trữ Cookie an toàn trên trình duyệt để duy trì phiên làm việc đăng nhập hợp lệ của bạn, ngăn chặn các hành vi tấn công chiếm đoạt tài khoản trái phép (Session Hijacking).
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#E4187D]">
                            <ShieldAlert className="w-5 h-5 shrink-0" />
                            <h2 className="text-md font-bold text-gray-900">4. Cam kết không chia sẻ dữ liệu</h2>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-7">
                            <span className="font-semibold text-[#E4187D]">BookingMakeup</span> cam kết tuyệt đối không bán, cho thuê, trao đổi thông tin hoặc chia sẻ dữ liệu cá nhân hay lịch sử trò chuyện riêng tư của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại khi chưa có sự đồng ý rõ ràng từ phía bạn.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400">Mọi thắc mắc vui lòng liên hệ Ban quản trị hệ thống Đồ án.</p>
                    <Link href="/register">
                        <Button className="bg-[#E4187D] hover:bg-[#c9126b] text-white px-5 rounded-xl font-semibold text-xs shadow-sm cursor-pointer">
                            Đồng ý
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}