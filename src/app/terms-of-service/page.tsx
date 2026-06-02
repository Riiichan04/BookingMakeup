"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, CalendarCheck, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-gray-900">Điều khoản dịch vụ</h1>
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
                        Chào mừng bạn đến với <span className="font-semibold text-[#E4187D]">BookingMakeup</span> – Nền tảng thương mại điện tử kết nối khách hàng và các Chuyên viên trang điểm (Artist). Trước khi đăng ký tài khoản hoặc sử dụng dịch vụ, vui lòng đọc kỹ các điều khoản dưới đây. Việc bạn sử dụng website đồng nghĩa với việc bạn đồng ý tuân thủ toàn bộ các quy định này.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#E4187D]">
                            <Scale className="w-5 h-5 shrink-0" />
                            <h2 className="text-md font-bold text-gray-900">1. Quy định về tài khoản sử dụng</h2>
                        </div>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 leading-relaxed">
                            <li>Người dùng phải cung cấp thông tin chính xác về Email, Tên người dùng và chịu trách nhiệm hoàn toàn về tính bảo mật của mật khẩu cá nhân.</li>
                            <li>Không sử dụng tài khoản vào mục đích lừa đảo, giả mạo thông tin của khách hàng hoặc các Chuyên viên trang điểm (Artist) khác trên hệ thống.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#E4187D]">
                            <CalendarCheck className="w-5 h-5 shrink-0" />
                            <h2 className="text-md font-bold text-gray-900">2. Cơ chế đặt lịch (Booking) và Thanh toán</h2>
                        </div>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 leading-relaxed">
                            <li><span className="font-semibold text-gray-800">BookingMakeup</span> cung cấp nền tảng hiển thị lịch trình, dịch vụ và hỗ trợ gửi yêu cầu đặt lịch trực tuyến real-time giữa Khách hàng và Artist.</li>
                            <li>Mọi giao dịch thanh toán (nếu có tiền đặt cọc hoặc thanh toán toàn phần) phải thực hiện đúng theo các cổng thanh toán được tích hợp hợp pháp trên hệ thống của chúng tôi.</li>
                        </ul>
                    </div>

                    {/* Điều 3 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#E4187D]">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <h2 className="text-md font-bold text-gray-900">3. Chính sách Hủy lịch và Hoàn tiền</h2>
                        </div>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 leading-relaxed">
                            <li><span className="font-semibold text-gray-800">Đối với Khách hàng:</span> Việc hủy lịch phải được thực hiện trước thời gian làm dịch vụ quy định trên hệ thống để được xem xét hoàn tiền đặt cọc theo chính sách riêng của từng gói dịch vụ.</li>
                            <li><span className="font-semibold text-gray-800">Đối với Artist:</span> Trong trường hợp bất khả kháng không thể thực hiện buổi makeup, Artist phải thông báo hủy lịch qua hệ thống trò chuyện chat trực tuyến sớm nhất và hoàn trả 100% chi phí cho khách hàng.</li>
                        </ul>
                    </div>

                    {/* Điều 4 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#E4187D]">
                            <ShieldCheck className="w-5 h-5 shrink-0" />
                            <h2 className="text-md font-bold text-gray-900">4. Giới hạn trách nhiệm pháp lý</h2>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-7">
                            Chúng tôi đóng vai trò là sàn giao dịch trung gian kết nối. <span className="font-semibold text-[#E4187D]">BookingMakeup</span> không chịu trách nhiệm trực tiếp về chất lượng mỹ phẩm, phong cách trang điểm hoặc bất kỳ mâu thuẫn cá nhân phát sinh ngoài đời thực giữa Khách hàng và Artist, tuy nhiên chúng tôi cam kết sẽ hỗ trợ xử lý và xử phạt các tài khoản vi phạm đạo đức nghề nghiệp dựa trên phản hồi.
                        </p>
                    </div>
                </div>

                {/* Footer Button đồng ý nhanh */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400">Bằng việc đăng ký, bạn mặc định tuân thủ các quy định này.</p>
                    <Link href="/register">
                        <Button className="bg-[#E4187D] hover:bg-[#c9126b] text-white px-5 rounded-xl font-semibold text-xs shadow-sm cursor-pointer">
                            Tôi đã hiểu
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}