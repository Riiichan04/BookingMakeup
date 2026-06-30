"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Loader2, CheckCircle2, XCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { bookingService } from "@/services/booking-service";
import { BookingDto } from "@/types/booking";

export default function SoBookingsPage() {
    const [bookings, setBookings] = useState<BookingDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch {
            toast.error("Không thể tải danh sách đặt lịch.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBookings();
    }, []);

    

    const handleUpdateStatus = async (id: string, status: string) => {
        setActionId(id);
        try {
            await bookingService.updateBookingStatus(id, status);
            toast.success("Đã cập nhật trạng thái thành công!");
            fetchBookings();
        } catch {
            toast.error("Lỗi khi cập nhật trạng thái.");
        } finally {
            setActionId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING": return <Badge className="bg-yellow-100 text-yellow-700 border-none px-3 py-1">Chờ Xác Nhận</Badge>;
            case "CONFIRMED": return <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1">Đã Xác Nhận (Chờ Cọc)</Badge>;
            case "PAID": return <Badge className="bg-purple-100 text-purple-700 border-none px-3 py-1">Đã Nhận Cọc</Badge>;
            case "COMPLETED": return <Badge className="bg-green-100 text-green-700 border-none px-3 py-1">Hoàn Thành</Badge>;
            case "CANCELLED": return <Badge className="bg-red-100 text-red-700 border-none px-3 py-1">Đã Hủy</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatPrice = (p: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-500" /></div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Quản Lý Đơn Đặt Lịch</h2>
                <p className="text-gray-500 text-sm">Kiểm tra, duyệt lịch và xác nhận hoàn thành dịch vụ cho khách hàng.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm">
                    <CalendarClock className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Chưa có yêu cầu đặt lịch nào.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                
                                {/* Info Box */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-900 text-xl">{booking.serviceName}</span>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Khách Hàng</p>
                                            <p className="font-semibold text-gray-900">{booking.customerDisplayName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Thợ Phụ Trách</p>
                                            <p className="font-semibold text-gray-900">{booking.artistName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Thời Gian</p>
                                            <p className="font-semibold text-[#E4187D]">
                                                {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)} | {booking.bookingDate.split("-").reverse().join("/")}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Tài Chính</p>
                                            <p className="text-sm font-medium text-gray-700">
                                                Tổng: <span className="font-bold text-gray-900">{formatPrice(booking.totalAmount)}</span> <br/>
                                                Đã cọc: <span className="font-bold text-green-600">{formatPrice(booking.depositAmount)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons Box */}
                                <div className="flex flex-wrap lg:flex-col gap-3 shrink-0 w-full lg:w-48">
                                    {booking.status === "PENDING" && (
                                        <>
                                            <Button onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")} disabled={actionId === booking.id} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold h-11">
                                                {actionId === booking.id ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Check className="w-5 h-5 mr-1.5" />} Chấp Nhận
                                            </Button>
                                            <Button onClick={() => handleUpdateStatus(booking.id, "CANCELLED")} disabled={actionId === booking.id} variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-bold h-11">
                                                Từ Chối
                                            </Button>
                                        </>
                                    )}

                                    {booking.status === "PAID" && (
                                        <Button onClick={() => handleUpdateStatus(booking.id, "COMPLETED")} disabled={actionId === booking.id} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-11 shadow-md">
                                            {actionId === booking.id ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <CheckCircle2 className="w-5 h-5 mr-1.5" />} Hoàn Thành Dịch Vụ
                                        </Button>
                                    )}

                                    {booking.status === "CONFIRMED" && (
                                        <Button onClick={() => handleUpdateStatus(booking.id, "CANCELLED")} disabled={actionId === booking.id} variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-bold h-11">
                                            <XCircle className="w-4 h-4 mr-1.5" /> Hủy Lịch
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}