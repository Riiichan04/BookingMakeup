"use client";

import { useEffect, useState, useMemo } from "react";
import { statisticsService, BookingStatisticsResponse } from "@/services/statistics-service";
import { toast } from "sonner";
import { Loader2, Package, Clock, Check, CheckCircle2, XCircle, Users, BarChart3, TrendingUp, RefreshCw, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const getNDaysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
};

const getToday = () => {
    return new Date().toISOString().split("T")[0];
};

export default function AdminBookingsStatsPage() {
    const [stats, setStats] = useState<BookingStatisticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(getNDaysAgo(30));
    const [endDate, setEndDate] = useState(getToday());

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await statisticsService.getBookingStatistics(startDate, endDate);
            setStats(data);
        } catch (error) {
            toast.error("Không thể tải số liệu thống kê đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [startDate, endDate]);

    const dailyData = useMemo(() => {
        if (!stats?.bookings) return [];
        const map: Record<string, number> = {};
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split("T")[0];
            map[dateStr] = 0;
        }
        
        for (const b of stats.bookings) {
            const dateStr = b.bookingDate;
            if (map[dateStr] !== undefined) {
                map[dateStr] += 1;
            }
        }
        
        return Object.entries(map)
            .map(([date, count]) => ({
                date,
                label: date.split("-").slice(1).reverse().join("/"),
                count
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [stats?.bookings, startDate, endDate]);

    const maxCount = useMemo(() => {
        const vals = dailyData.map(d => d.count);
        return vals.length > 0 ? Math.max(...vals, 5) : 5;
    }, [dailyData]);

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
                <p className="text-gray-500 text-sm">Không có dữ liệu thống kê.</p>
                <Button onClick={fetchStats} className="mt-4">Thử lại</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Thống Kê Đơn Hàng</h2>
                    <p className="text-gray-500 text-sm">Xem tổng hợp trạng thái đơn đặt lịch và tần suất đặt của khách hàng trên toàn hệ thống.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs w-full xl:w-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Từ ngày</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đến ngày</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white cursor-pointer"
                        />
                    </div>
                    <Button variant="outline" onClick={fetchStats} className="flex items-center gap-1.5 text-xs py-1.5 px-3 h-auto cursor-pointer">
                        <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                    </Button>
                </div>
            </div>

            {/* Thẻ Header */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-lg">
                    Tổng quan đơn hàng toàn hệ thống
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                    Thống kê tổng hợp từ bảng bookings — cập nhật theo dữ liệu thực tế của máy chủ.
                </p>
            </div>

            {/* Các Grid số liệu */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                        <Package className="w-4 h-4 text-[#E4187D]" />
                        Tổng đơn
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                        {stats.totalBookings}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        Chờ xác nhận
                    </div>
                    <p className="text-3xl font-black text-yellow-600">
                        {stats.pendingCount}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Đã xác nhận
                    </div>
                    <p className="text-3xl font-black text-green-600">
                        {stats.confirmedCount}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        Hoàn thành
                    </div>
                    <p className="text-3xl font-black text-blue-600">
                        {stats.completedCount}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Đã hủy
                    </div>
                    <p className="text-3xl font-black text-red-600">
                        {stats.cancelledCount}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                        <Users className="w-4 h-4 text-[#E4187D]" />
                        Khách hàng
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                        {stats.customerCount}
                    </p>
                </div>
            </div>

            {/* Phân bổ và Tỷ lệ đơn hàng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                        <BarChart3 className="w-5 h-5 text-[#E4187D]" />
                        <h4 className="font-extrabold text-gray-900">
                            Phân bổ trạng thái đơn hàng
                        </h4>
                    </div>

                    {stats.totalBookings === 0 ? (
                        <p className="text-sm text-gray-400">
                            Chưa có dữ liệu đơn hàng nào.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {(
                                [
                                    ["PENDING", "Chờ xác nhận", "bg-yellow-400", stats.pendingCount, stats.pendingPercentage],
                                    ["CONFIRMED", "Đã xác nhận", "bg-green-500", stats.confirmedCount, stats.confirmedPercentage],
                                    ["PAID", "Đã thanh toán / đặt cọc", "bg-purple-500", stats.paidCount, stats.paidPercentage],
                                    ["COMPLETED", "Hoàn thành", "bg-blue-500", stats.completedCount, stats.completedPercentage],
                                    ["CANCELLED", "Đã hủy", "bg-red-500", stats.cancelledCount, stats.cancelledPercentage],
                                ] as const
                            ).map(([status, label, barClass, count, percentage]) => {
                                const percent = percentage !== undefined ? Math.round(percentage) : 0;
                                return (
                                    <div key={status} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-bold text-gray-600">
                                            <span>{label}</span>
                                            <span>
                                                {count} đơn ({percent}%)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                            <TrendingUp className="w-5 h-5 text-[#E4187D]" />
                            <h4 className="font-extrabold text-gray-900">
                                Tỷ lệ chuyển đổi và hoàn thành
                            </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tỷ lệ hoàn thành</p>
                                <p className="text-3xl font-black text-blue-600">
                                    {Math.round(stats.completionRate || 0)}%
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">Đơn hàng hoàn thành / Tổng đơn</p>
                            </div>
                            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tỷ lệ hủy đơn</p>
                                <p className="text-3xl font-black text-red-600">
                                    {Math.round(stats.cancellationRate || 0)}%
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">Đơn hàng bị hủy / Tổng đơn</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-500 leading-relaxed border border-gray-100 mt-4">
                        💡 <strong>Mẹo quản trị:</strong> Tỷ lệ hoàn thành phản ánh chất lượng phục vụ của các Studio. Khuyến khích các Studio duy trì tỷ lệ hoàn thành &gt; 80% để tăng mức độ uy tín trên hệ thống.
                    </div>
                </div>
            </div>

            {/* Biểu đồ số lượng đơn đặt lịch theo ngày */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart2 className="w-5 h-5 text-[#E4187D]" />
                    <h3 className="font-extrabold text-gray-900">Biểu đồ số lượng đơn đặt lịch theo ngày</h3>
                </div>
                {dailyData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                        Không có dữ liệu biểu đồ.
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[600px] h-64 flex items-end gap-3 pb-6 pt-10">
                            {dailyData.map((d, idx) => {
                                const percentage = (d.count / maxCount) * 100;
                                return (
                                    <div key={idx} className="flex-1 h-[82%] flex flex-col justify-end items-center group relative">
                                        <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-10 font-bold">
                                            {d.count} đơn hàng
                                        </div>
                                        <div
                                            style={{ height: `${Math.max(percentage, 4)}%` }}
                                            className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                                                d.count > 0 ? "bg-[#E4187D] hover:bg-[#c9126b] shadow-xs" : "bg-gray-100"
                                            }`}
                                        />
                                        <span className="text-[10px] text-gray-400 font-semibold mt-2 select-none">
                                            {d.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
