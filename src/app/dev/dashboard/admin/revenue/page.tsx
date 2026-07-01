"use client";

import { useEffect, useState } from "react";
import { statisticsService, RevenueStatisticsResponse } from "@/services/statistics-service";
import { toast } from "sonner";
import { Loader2, DollarSign, Wallet, Percent, PiggyBank, RefreshCw, BarChart2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminRevenuePage() {
    const [stats, setStats] = useState<RevenueStatisticsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await statisticsService.getRevenueStatistics();
            setStats(data);
        } catch (error) {
            toast.error("Không thể tải dữ liệu doanh thu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 text-sm">Không có dữ liệu doanh thu.</p>
                <Button onClick={fetchStats} className="mt-4">Thử lại</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Thống Kê Doanh Thu</h2>
                    <p className="text-gray-500 text-sm">Theo dõi doanh thu toàn hệ thống, phí dịch vụ thu hộ và tỷ lệ chia sẻ doanh thu với Studio.</p>
                </div>
                <Button variant="outline" onClick={fetchStats} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Làm mới
                </Button>
            </div>

            {/* Grid các thẻ doanh số */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tổng doanh thu hệ thống</p>
                        <p className="text-xl font-black text-gray-900 mt-1">
                            {formatCurrency(stats.totalRevenue || 0)}
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-0.5">(Đơn Hoàn thành & Đã cọc)</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                        <Percent className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Phí nền tảng thu về (10%)</p>
                        <p className="text-xl font-black text-pink-600 mt-1">
                            {formatCurrency(stats.platformFee || 0)}
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-0.5">(Lợi nhuận của Admin)</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Doanh thu chia cho Studio</p>
                        <p className="text-xl font-black text-blue-600 mt-1">
                            {formatCurrency(stats.studioRevenue || 0)}
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-0.5">(90% doanh thu thực nhận)</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                        <PiggyBank className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tổng tiền đặt cọc giữ chỗ</p>
                        <p className="text-xl font-black text-yellow-600 mt-1">
                            {formatCurrency(stats.totalDeposit || 0)}
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-0.5">(Cọc tạm giữ an toàn)</span>
                    </div>
                </div>
            </div>

            {/* Chi tiết dòng tiền các đơn hàng */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
                <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#E4187D]" />
                    <h3 className="font-extrabold text-gray-900">Chi tiết dòng tiền từng Booking</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Mã Booking / Ngày đặt</th>
                                <th className="px-6 py-4">Khách hàng / Dịch vụ</th>
                                <th className="px-6 py-4">Tổng tiền (A)</th>
                                <th className="px-6 py-4">Tiền đặt cọc</th>
                                <th className="px-6 py-4">Phí nền tảng (B)</th>
                                <th className="px-6 py-4">Studio thực nhận</th>
                                <th className="px-6 py-4">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {!stats.bookings || stats.bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                                        Chưa có giao dịch booking nào phát sinh doanh thu.
                                    </td>
                                </tr>
                            ) : (
                                stats.bookings.map((b) => {
                                    return (
                                        <tr key={b.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900 text-xs">#{b.id.slice(0, 8)}...</div>
                                                <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {b.bookingDate.split("-").reverse().join("/")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{b.customerName}</div>
                                                <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">{b.serviceName}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                {formatCurrency(b.totalAmount || 0)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-semibold">
                                                {formatCurrency(b.depositAmount || 0)}
                                            </td>
                                            <td className="px-6 py-4 text-pink-600 font-bold">
                                                {formatCurrency(b.platformFee || 0)}
                                            </td>
                                            <td className="px-6 py-4 text-blue-600 font-bold">
                                                {formatCurrency(b.studioReceives || 0)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    b.status === "COMPLETED"
                                                        ? "bg-green-50 text-green-700 border border-green-100"
                                                        : b.status === "PAID"
                                                        ? "bg-purple-50 text-purple-700 border border-purple-100"
                                                        : b.status === "PENDING"
                                                        ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                                        : b.status === "CONFIRMED"
                                                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                                                        : "bg-red-50 text-red-700 border border-red-100"
                                                }`}>
                                                    {b.statusLabel || b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
