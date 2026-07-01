"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Star, Loader2, MessageSquare, CreditCard, XCircle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { bookingService } from "@/services/booking-service";
import { reviewService } from "@/services/review-service";
import { generatePaymentUrl } from "@/services/payment-service"; 
import { BookingDto } from "@/types/booking";

export default function CustomerBookingsPage() {
    const [bookings, setBookings] = useState<BookingDto[]>([]);
    const [loading, setLoading] = useState(true);

    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [payingId, setPayingId] = useState<string | null>(null);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);
    const [bookingRating, setBookingRating] = useState(5);
    const [artistRating, setArtistRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewTag, setReviewTag] = useState("NICE_ATTITUDE");
    const [submittingReview, setSubmittingReview] = useState(false);
    
     const fetchBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch {
            toast.error("Không thể tải danh sách lịch hẹn.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBookings();
    }, []);

   

    const handleCancelBooking = async (id: string) => {
        if (!confirm("Chắc chắn hủy lịch hẹn này?")) return;
        setCancellingId(id);
        try {
            await bookingService.updateBookingStatus(id, "CANCELLED");
            toast.success("Đã hủy lịch hẹn.");
            fetchBookings();
        } catch {
            toast.error("Lỗi khi hủy lịch.");
        } finally {
            setCancellingId(null);
        }
    };

    const handlePayment = async (id: string) => {
        setPayingId(id);
        try {
            const payRes = await generatePaymentUrl(id);
            if (payRes.actionUrl && payRes.fields) {
                const form = document.createElement("form");
                form.method = "POST";
                form.action = payRes.actionUrl;
                Object.keys(payRes.fields).forEach((key) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = payRes.fields[key];
                    form.appendChild(input);
                });
                document.body.appendChild(form);
                form.submit();
            }
        } catch {
            toast.error("Lỗi khởi tạo thanh toán VNPay.");
            setPayingId(null);
        }
    };

    const handleSubmitReview = async () => {
        if (!selectedBooking) return;
        setSubmittingReview(true);
        try {
            await reviewService.createReview({
                bookingId: selectedBooking.id,
                bookingRating,
                artistRating,
                comment,
                tags: reviewTag
            });
            toast.success("Cảm ơn bạn đã gửi đánh giá!");
            setReviewModalOpen(false);
            fetchBookings(); 
        } catch {
            toast.error("Không thể gửi đánh giá lúc này.");
        } finally {
            setSubmittingReview(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING": return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-3 py-1 text-xs">Chờ Xác Nhận</Badge>;
            case "CONFIRMED": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 text-xs">Chờ Thanh Toán Cọc</Badge>;
            case "PAID": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 text-xs">Đã Thanh Toán</Badge>;
            case "COMPLETED": return <Badge className="bg-gray-100 text-gray-700 border-none px-3 py-1 text-xs">Hoàn Thành</Badge>;
            case "CANCELLED": return <Badge className="bg-red-100 text-red-700 border-none px-3 py-1 text-xs">Đã Hủy</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatPrice = (p: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-500" /></div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Lịch Hẹn Của Tôi</h2>
                <p className="text-gray-500 text-sm">Quản lý, thanh toán cọc và theo dõi các đơn đặt lịch của bạn.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm">
                    <CalendarClock className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Bạn chưa có lịch hẹn nào...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-3 w-full">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 text-lg line-clamp-1">{booking.serviceName}</span>
                                    {getStatusBadge(booking.status)}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                                    <p className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-pink-400" /> {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}</p>
                                    <p className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-pink-400" /> {booking.bookingDate.split("-").reverse().join("/")}</p>
                                    <p className="flex items-center gap-1.5"><Star className="w-4 h-4 text-pink-400" /> {booking.artistName}</p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm mt-2 p-3 bg-gray-50 rounded-xl inline-flex w-fit">
                                    <p className="text-gray-600">Tổng tiền: <span className="font-bold text-gray-900">{formatPrice(booking.totalAmount)}</span></p>
                                    <p className="text-gray-600">Tiền cọc: <span className="font-bold text-[#E4187D]">{formatPrice(booking.depositAmount)}</span></p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
                                {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                                    <Button onClick={() => handleCancelBooking(booking.id)} disabled={cancellingId === booking.id} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl text-sm font-semibold h-11 w-full md:w-auto">
                                        {cancellingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <XCircle className="w-4 h-4 mr-1.5" />} Hủy Lịch
                                    </Button>
                                )}
                                {booking.status === "CONFIRMED" && (
                                    <Button onClick={() => handlePayment(booking.id)} disabled={payingId === booking.id} className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-xl text-sm font-bold shadow-md h-11 w-full md:w-auto">
                                        {payingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <CreditCard className="w-4 h-4 mr-1.5" />} Thanh Toán Cọc
                                    </Button>
                                )}
                                {booking.status === "COMPLETED" && (
                                    <Button onClick={() => { setSelectedBooking(booking); setReviewModalOpen(true); }} className="bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-bold h-11 w-full md:w-auto">
                                        <MessageSquare className="w-4 h-4 mr-1.5" /> Đánh Giá
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {reviewModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <h2 className="font-bold text-xl text-gray-900">Đánh Giá Dịch Vụ</h2>
                            <button onClick={() => setReviewModalOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-2xl">&times;</button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                <span className="font-semibold text-gray-700">Độ hài lòng về layout</span>
                                <div className="flex gap-1">{[1, 2, 3, 4, 5].map(star => <Star key={star} onClick={() => setBookingRating(star)} className={`w-6 h-6 cursor-pointer transition-transform hover:scale-110 ${star <= bookingRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}</div>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                <span className="font-semibold text-gray-700">Thái độ chuyên viên</span>
                                <div className="flex gap-1">{[1, 2, 3, 4, 5].map(star => <Star key={star} onClick={() => setArtistRating(star)} className={`w-6 h-6 cursor-pointer transition-transform hover:scale-110 ${star <= artistRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}</div>
                            </div>
                            <textarea className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-25" placeholder="Nhận xét chi tiết về trải nghiệm của bạn..." value={comment} onChange={e => setComment(e.target.value)} />
                        </div>
                        <Button onClick={handleSubmitReview} disabled={submittingReview || !comment.trim()} className="w-full bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-xl h-12 font-bold text-base">
                            {submittingReview ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null} Gửi Đánh Giá
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}