"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createReview } from "@/lib/api/reviews";
import { CommentTag } from "@/types/review";

interface ReviewDialogProps {
    bookingId: string;
    artistName: string;
    serviceName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TAG_OPTIONS: { value: CommentTag; label: string }[] = [
    { value: "NICE_ATTITUDE", label: "Thái độ vui vẻ" },
    { value: "GOOD_SERVICE", label: "Dịch vụ tốt" },
    { value: "ON_TIME", label: "Đúng giờ" },
    { value: "BAD_SERVICE", label: "Dịch vụ tệ" },
    { value: "WORST_ATTITUDE", label: "Thái độ kém" }
];

export default function ReviewDialog({ bookingId, artistName, serviceName, isOpen, onClose, onSuccess }: ReviewDialogProps) {
    const [artistRating, setArtistRating] = useState<number>(5);
    const [bookingRating, setBookingRating] = useState<number>(5);
    const [comment, setComment] = useState<string>("");
    const [selectedTag, setSelectedTag] = useState<CommentTag>("GOOD_SERVICE");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createReview({
                bookingId,
                artistRating,
                bookingRating,
                comment,
                tags: selectedTag,
            });
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: string }, message?: string };
            const responseData = errorObj.response?.data;
            if (typeof responseData === 'string') {
                setError(responseData);
            } else if (typeof responseData === 'object' && responseData !== null) {
                setError("Có lỗi xảy ra từ máy chủ.");
            } else {
                setError("Có lỗi xảy ra khi gửi đánh giá.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Đánh giá dịch vụ</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                        <p className="text-sm text-gray-600 mb-1">Bạn đang đánh giá:</p>
                        <p className="font-bold text-[#E4187D]">{serviceName}</p>
                        <p className="text-sm font-medium text-gray-700">Chuyên viên: {artistName}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-between">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Điểm Chuyên viên</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={`artist-${star}`} onClick={() => setArtistRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                                        <Star className={`w-7 h-7 ${star <= artistRating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 text-right">Điểm Dịch vụ</label>
                            <div className="flex gap-1 justify-end">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={`booking-${star}`} onClick={() => setBookingRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                                        <Star className={`w-7 h-7 ${star <= bookingRating ? "text-[#E4187D] fill-[#E4187D]" : "text-gray-200"}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tag Nhận Xét */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Đặc điểm nổi bật</label>
                        <div className="flex flex-wrap gap-2">
                            {TAG_OPTIONS.map((tag) => (
                                <button
                                    key={tag.value}
                                    onClick={() => setSelectedTag(tag.value)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedTag === tag.value
                                        ? "bg-pink-100 border-[#E4187D] text-[#E4187D]"
                                        : "bg-white border-gray-200 text-gray-500 hover:border-pink-200"
                                        }`}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Chia sẻ trải nghiệm của bạn</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chuyên viên makeup có nhiệt tình không? Lớp nền có giữ được lâu không?..."
                            className="w-full h-28 p-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#E4187D] focus:ring-1 focus:ring-[#E4187D] resize-none"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <Button variant="outline" onClick={onClose} className="rounded-xl px-6">
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !comment.trim()}
                        className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-xl px-8 shadow-sm"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi đánh giá"}
                    </Button>
                </div>
            </div>
        </div>
    );
}