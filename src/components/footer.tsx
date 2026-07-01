"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Palette } from "lucide-react";

import { Playwrite_US_Trad } from "next/font/google";
const logoFont = Playwrite_US_Trad({
    weight: ["400"],
});

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 shrink-0">
            <div className="mx-auto px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="bg-[#E4187D] rounded-full p-1.5 flex items-center justify-center transition-colors group-hover:bg-[#c9126b] shadow-sm">
                            <Palette className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className={`text-2xl text-[#E4187D] tracking-tight ${logoFont.className}`}>
                            BookingMakeup
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Nền tảng kết nối khách hàng và các Chuyên viên trang điểm (Artist) chuyên nghiệp hàng đầu. Đặt lịch nhanh chóng, trải nghiệm tuyệt vời.
                    </p>

                    <div className="flex items-center gap-4 text-gray-400">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#E4187D] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#E4187D] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#E4187D] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Cột 2: Khám phá đường dẫn nhanh */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Khám phá</h4>
                    <ul className="space-y-2 text-xs text-gray-500">
                        <li>
                            <Link href="/artists" className="hover:text-[#E4187D] transition-colors">Tìm kiếm Artist</Link>
                        </li>
                        <li>
                            <Link href="/services" className="hover:text-[#E4187D] transition-colors">Dịch vụ nổi bật</Link>
                        </li>
                        <li>
                            <Link href="/trending" className="hover:text-[#E4187D] transition-colors">Xu hướng trang điểm</Link>
                        </li>
                    </ul>
                </div>

                {/* Cột 3: Chính sách pháp lý */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Chính sách</h4>
                    <ul className="space-y-2 text-xs text-gray-500">
                        <li>
                            <Link href="/terms" className="hover:text-[#E4187D] transition-colors">Điều khoản dịch vụ</Link>
                        </li>
                        <li>
                            <Link href="/privacy" className="hover:text-[#E4187D] transition-colors">Chính sách bảo mật</Link>
                        </li>
                        <li>
                            <Link href="/faq" className="hover:text-[#E4187D] transition-colors">Câu hỏi thường gặp</Link>
                        </li>
                    </ul>
                </div>

                {/* Cột 4: Thông tin liên hệ */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Liên hệ</h4>
                    <ul className="space-y-2.5 text-xs text-gray-500">
                        <li className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-[#E4187D] shrink-0 mt-0.5" />
                            <span className="leading-relaxed">Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-[#E4187D] shrink-0" />
                            <span>+84 123 456 789</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-[#E4187D] shrink-0" />
                            <span className="truncate">support@bookingmakeup.vn</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Bottom Copyright Bar */}
            <div className="bg-gray-50 border-t border-gray-100 py-4 px-8 flex justify-center items-center">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 font-medium">
                    <p>© {currentYear} BookingMakeup. Toàn bộ quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}