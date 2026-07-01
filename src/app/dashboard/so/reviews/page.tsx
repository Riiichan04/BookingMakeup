"use client";

import { useEffect, useState } from "react";
import { reviewService } from "@/services/review-service";
import { ReviewDto } from "@/types/review";
import { toast } from "sonner";
import { Loader2, Star, MessageSquare, Award, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SOReviewsPage() {
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewService.getMyReceivedReviews();
            setReviews(data);
        } catch (error) {
            toast.error("Không thể tải danh sách đánh giá nhận được.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rating ? "fill-current" : "text-gray-200"}`}
                    />
                ))}
            </div>
        );
    };

    // Tính điểm trung bình
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Đánh Giá Nhận Được</h2>
                    <p className="text-gray-500 text-sm">Xem phản hồi và nhận xét của khách hàng đối với dịch vụ của bạn.</p>
                </div>
                <Button variant="outline" onClick={fetchReviews} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Làm mới
                </Button>
            </div>

            {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-white text-center shadow-xs">
                    <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold text-lg">Chưa nhận được đánh giá nào</p>
                    <p className="text-gray-400 text-sm mt-1">Các đánh giá của khách hàng sau khi hoàn thành buổi makeup sẽ hiển thị tại đây.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Thống kê đánh giá */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center font-black text-2xl">
                                {averageRating}
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-900">Điểm đánh giá trung bình</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    {renderStars(Math.round(Number(averageRating)))}
                                    <span className="text-xs text-gray-400">({reviews.length} đánh giá)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                            <div className="w-16 h-16 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                                <Award className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-900">Độ uy tín cửa hàng</h4>
                                <p className="text-xs text-gray-400 mt-1">Đánh giá cao giúp nâng thứ hạng hiển thị của bạn trên trang tìm kiếm.</p>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách review */}
                    <div className="grid grid-cols-1 gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.customer || "Khách hàng"}</h4>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            Dịch vụ: <span className="text-gray-700 font-medium">{review.service || "Chưa xác định"}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {review.date ? new Date(review.date).toLocaleDateString("vi-VN") : "N/A"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {renderStars(review.rating)}
                                    <span className="text-xs font-semibold text-gray-500">({review.rating} sao)</span>
                                </div>

                                <p className="text-sm text-gray-700 leading-relaxed break-words">
                                    {review.comment || "Không có nhận xét bằng văn bản."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
