import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <main className="flex flex-col items-center gap-8 text-center px-6">
        <div className="flex items-center gap-2 text-pink-500">
          <Sparkles size={32} />
          <h1 className="text-4xl font-bold text-gray-900">BookingMakeup</h1>
        </div>
        <p className="text-gray-500 text-lg max-w-md">
          Nền tảng đặt lịch trang điểm chuyên nghiệp — kết nối bạn với các chuyên gia hàng đầu.
        </p>
        <Link
          href="/search"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-2xl transition-colors shadow-md text-base"
        >
          <Search size={18} />
          Tìm kiếm dịch vụ
        </Link>
      </main>
    </div>
  );
}
