"use client";

import { useEffect, useState, useMemo } from "react";
import { statisticsService, RevenueStatisticsResponse } from "@/services/statistics-service";
import { toast } from "sonner";
import { Loader2, DollarSign, Wallet, Percent, PiggyBank, RefreshCw, BarChart2, Calendar, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const getNDaysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
};

const getToday = () => {
    return new Date().toISOString().split("T")[0];
};

export default function AdminRevenuePage() {
    const [stats, setStats] = useState<RevenueStatisticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(getNDaysAgo(30));
    const [endDate, setEndDate] = useState(getToday());

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await statisticsService.getRevenueStatistics(startDate, endDate);
            setStats(data);
        } catch (error) {
            toast.error("Không thể tải dữ liệu doanh thu.");
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
            if (b.status === "COMPLETED" || b.status === "PAID" || b.status === "CONFIRMED") {
                const dateStr = b.bookingDate;
                if (map[dateStr] !== undefined) {
                    map[dateStr] += b.totalAmount;
                }
            }
        }
        
        return Object.entries(map)
            .map(([date, amount]) => ({
                date,
                label: date.split("-").slice(1).reverse().join("/"),
                amount
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [stats?.bookings, startDate, endDate]);

    const maxAmount = useMemo(() => {
        const vals = dailyData.map(d => d.amount);
        return vals.length > 0 ? Math.max(...vals, 100000) : 100000;
    }, [dailyData]);

    const categoryData = useMemo(() => {
        if (!stats?.bookings) return [];
        const map: Record<string, number> = {};
        let total = 0;
        for (const b of stats.bookings) {
            if (b.status === "COMPLETED" || b.status === "PAID" || b.status === "CONFIRMED") {
                const cat = b.serviceCategory || "Khác";
                map[cat] = (map[cat] || 0) + b.totalAmount;
                total += b.totalAmount;
            }
        }
        
        const colors = [
            "#E4187D",
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#8B5CF6",
            "#6B7280"
        ];
        
        let colorIndex = 0;
        return Object.entries(map).map(([category, amount]) => {
            const percentage = total > 0 ? (amount / total) * 100 : 0;
            const color = colors[colorIndex % colors.length];
            colorIndex++;
            return {
                category,
                amount,
                percentage,
                color
            };
        }).sort((a, b) => b.amount - a.amount);
    }, [stats?.bookings]);

    const slices = useMemo(() => {
        let accumulatedPercent = 0;
        return categoryData.map(c => {
            const strokeDasharray = "157.08";
            const strokeDashoffset = 157.08 - (157.08 * c.percentage) / 100;
            const rotation = (accumulatedPercent / 100) * 360;
            accumulatedPercent += c.percentage;
            return {
                ...c,
                strokeDasharray,
                strokeDashoffset,
                rotation
            };
        });
    }, [categoryData]);

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
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Thống Kê Doanh Thu</h2>
                    <p className="text-gray-500 text-sm">Theo dõi doanh thu toàn hệ thống, phí dịch vụ thu hộ và tỷ lệ chia sẻ doanh thu với Studio.</p>
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

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ doanh thu theo ngày */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart2 className="w-5 h-5 text-[#E4187D]" />
                        <h3 className="font-extrabold text-gray-900">Biểu đồ doanh thu theo ngày</h3>
                    </div>
                    {dailyData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                            Không có dữ liệu biểu đồ.
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[400px] h-64 flex items-end gap-3 pb-6 pt-10">
                                {dailyData.map((d, idx) => {
                                    const percentage = (d.amount / maxAmount) * 100;
                                    return (
                                        <div key={idx} className="flex-1 h-[82%] flex flex-col justify-end items-center group relative">
                                            <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-10 font-bold">
                                                {formatCurrency(d.amount)}
                                            </div>
                                            <div
                                                style={{ height: `${Math.max(percentage, 4)}%` }}
                                                className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                                                    d.amount > 0 ? "bg-[#E4187D] hover:bg-[#c9126b] shadow-xs" : "bg-gray-100"
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

                {/* Biểu đồ tròn doanh thu theo thể loại */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChartIcon className="w-5 h-5 text-[#E4187D]" />
                        <h3 className="font-extrabold text-gray-900">Doanh thu theo thể loại</h3>
                    </div>
                    
                    {categoryData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                            Không có dữ liệu biểu đồ.
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
                            <div className="relative flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-44 h-44 transform -rotate-90 animate-fade-in">
                                    {slices.map((s, idx) => (
                                        <circle
                                            key={idx}
                                            cx="50"
                                            cy="50"
                                            r="25"
                                            fill="transparent"
                                            stroke={s.color}
                                            strokeWidth="12"
                                            strokeDasharray={s.strokeDasharray}
                                            strokeDashoffset={s.strokeDashoffset}
                                            transform={`rotate(${s.rotation} 50 50)`}
                                            className="transition-all duration-500 hover:stroke-[14px] cursor-pointer"
                                        />
                                    ))}
                                </svg>
                            </div>

                            {/* Legend */}
                            <div className="w-full space-y-2 text-xs font-semibold text-gray-600 pt-4 border-t border-gray-50 max-h-[160px] overflow-y-auto pr-1">
                                {slices.map((s, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                            <span className="truncate max-w-[90px] capitalize">{s.category}</span>
                                        </div>
                                        <span className="text-gray-900 font-bold shrink-0 ml-2">
                                            {formatCurrency(s.amount)} ({Math.round(s.percentage)}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
