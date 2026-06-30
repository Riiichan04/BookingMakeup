"use client";

import { useEffect, useState } from "react";
import { reviewService } from "@/services/review-service";
import { ReviewDto } from "@/types/review";
import { toast } from "sonner";
import { Loader2, Star, CheckCircle, EyeOff, Trash2, ShieldCheck, Tag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewService.getAllSystemReviews();
            setReviews(data);
        } catch (error) {
            toast.error("Không thể tải danh sách đánh giá.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleUpdateStatus = async (id: string, status: "APPROVED" | "HIDDEN") => {
        setUpdatingId(id);
        try {
            const updated = await reviewService.updateSystemReviewStatus(id, status);
            toast.success(`Đã cập nhật trạng thái đánh giá thành công.`);
            // Cập nhật state local
            setReviews(prev =>
                prev.map(r => (r.id === id ? { ...r, ...updated } : r))
            );
            fetchReviews(); // Load lại để đồng bộ status chính xác từ BE
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái đánh giá.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa đánh giá này vĩnh viễn không?")) return;
        setUpdatingId(id);
        try {
            await reviewService.deleteSystemReview(id);
            toast.success("Xóa đánh giá thành công.");
            setReviews(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            toast.error("Lỗi khi xóa đánh giá.");
        } finally {
            setUpdatingId(null);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating ? "fill-current" : "text-gray-200"}`}
                    />
                ))}
            </div>
        );
    };

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
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Kiểm Duyệt Đánh Giá</h2>
                    <p className="text-gray-500 text-sm">Quản lý nhận xét của khách hàng đối với dịch vụ và thợ trang điểm.</p>
                </div>
                <Button variant="outline" onClick={fetchReviews} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Làm mới
                </Button>
            </div>

            {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-white text-center">
                    <ShieldCheck className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Chưa có đánh giá nào từ hệ thống.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Dịch vụ</th>
                                    <th className="px-6 py-4">Đánh giá</th>
                                    <th className="px-6 py-4">Nhận xét & Bình luận</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {review.customer || "Khách hàng"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {review.service || "Dịch vụ"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderStars(review.rating)}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs md:max-w-md">
                                            <p className="text-gray-800 line-clamp-3 leading-relaxed break-words">
                                                {review.comment}
                                            </p>
                                            <span className="text-[10px] text-gray-400 block mt-1">
                                                Gửi ngày: {review.date ? new Date(review.date).toLocaleDateString("vi-VN") : "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                review.status === "APPROVED"
                                                    ? "bg-green-50 text-green-700 border border-green-100"
                                                    : review.status === "PENDING"
                                                    ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                                    : "bg-red-50 text-red-700 border border-red-100"
                                            }`}>
                                                {review.status === "APPROVED" ? "Đã duyệt" : review.status === "PENDING" ? "Chờ duyệt" : "Đã ẩn"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {review.status !== "APPROVED" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(review.id, "APPROVED")}
                                                        disabled={updatingId === review.id}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors cursor-pointer"
                                                        title="Phê duyệt"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}

                                                {review.status !== "HIDDEN" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(review.id, "HIDDEN")}
                                                        disabled={updatingId === review.id}
                                                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors cursor-pointer"
                                                        title="Ẩn đánh giá"
                                                    >
                                                        <EyeOff className="w-5 h-5" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    disabled={updatingId === review.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                                                    title="Xóa vĩnh viễn"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
