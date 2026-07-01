"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Star, MapPin, CheckCircle2, Heart, Loader2, ArrowLeft,
    Calendar, ShieldCheck, Users, MessageSquare, Edit, Briefcase, Scissors, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Artist, Booking, ServiceSimpleDto } from "@/types/artist";
import { artistService, getProviderProfile } from "@/services/artist-service";
import { defaultAvatar } from "@/common/constant/default-avatar";
import BookingTable from "@/components/artists/BookingTable";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { checkReviewable, getReviewsByArtist } from "@/lib/api/reviews";
import { CommentTag, ReviewDto } from "@/types/review";
import ReviewDialog from "@/components/reviews/review-dialog";

const TAG_DICTIONARY: Record<CommentTag, string> = {
    NICE_ATTITUDE: "Thái độ vui vẻ",
    GOOD_SERVICE: "Dịch vụ tốt",
    ON_TIME: "Đúng giờ",
    BAD_SERVICE: "Dịch vụ tệ",
    WORST_ATTITUDE: "Thái độ kém"
};

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { user } = useAuth();

    const [artist, setArtist] = useState<Artist | null>(null);
    const [schedule, setSchedule] = useState<Booking[]>([]);
    const [providerServices, setProviderServices] = useState<ServiceSimpleDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true);

    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState<boolean>(false);
    const [reviewBookingId, setReviewBookingId] = useState<string>("");

    const [reviewableBookingId, setReviewableBookingId] = useState<string | null>(null);

    const fetchReviews = async () => {
        try {
            const reviewsData = await getReviewsByArtist(resolvedParams.id);
            setReviews(reviewsData);
        } catch (error) {
            console.error("Lỗi lấy danh sách đánh giá", error);
        }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsData = await getReviewsByArtist(resolvedParams.id);
                setReviews(reviewsData);
            } catch (error) {
                console.error("Lỗi lấy danh sách đánh giá", error);
            }
        };

        const loadArtistData = async () => {
            try {
                const [artistData, bookingsData] = await Promise.all([
                    artistService.getArtistById(resolvedParams.id),
                    artistService.getArtistBookings(resolvedParams.id).catch(() => []),
                ]);

                setArtist(artistData);
                await fetchReviews();
                setIsLoadingReviews(false);

                const activeBookings = bookingsData.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED');
                setSchedule(activeBookings);

                if (artistData.ownerId) {
                    try {
                        const profile = await getProviderProfile(artistData.ownerId);
                        if (profile?.services && profile.services.length > 0) {
                            setProviderServices(profile.services);
                        }
                    } catch {
                        console.error("Lỗi lấy danh sách dịch vụ của SO");
                    }
                }

                if (user) {
                    let isUserOwner = false;
                    try {
                        const myArtists = await artistService.getMyArtists();
                        isUserOwner = myArtists.some(a => a.id === resolvedParams.id);
                        setIsOwner(isUserOwner);
                    } catch {
                        setIsOwner(false);
                    }
                    if (!isUserOwner) {
                        try {
                            const checkRes = await checkReviewable(resolvedParams.id);
                            console.log(checkRes)
                            if (checkRes.canReview && checkRes.bookingId) {
                                setReviewableBookingId(checkRes.bookingId);
                            }
                        } catch (err) {
                            console.error("Lỗi khi check quyền đánh giá", err);
                        }
                    }

                    try {
                        const followStatus = await artistService.checkFollowStatus(resolvedParams.id);
                        setIsFollowing(followStatus);
                    } catch {
                        console.error("Lỗi lấy trạng thái follow");
                    }
                }

            } catch {
                console.error("Lỗi khi tải dữ liệu artist");
                setArtist(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (resolvedParams.id) {
            loadArtistData().catch(console.error);
        }
    }, [resolvedParams.id, user]);

    const handleFollowToggle = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        try {
            setIsFollowLoading(true);
            setIsFollowing(prev => !prev);
            setArtist(prev => prev ? { ...prev, followCount: !isFollowing ? (prev.followCount || 0) + 1 : Math.max(0, (prev.followCount || 1) - 1) } : prev);
            await artistService.toggleFollow(resolvedParams.id);
        } catch {
            setIsFollowing(prev => !prev);
            setArtist(prev => prev ? { ...prev, followCount: isFollowing ? (prev.followCount || 0) + 1 : Math.max(0, (prev.followCount || 1) - 1) } : prev);
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleOpenReviewDialog = () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (reviewableBookingId) {
            setReviewBookingId(reviewableBookingId);
            setIsReviewDialogOpen(true);
        } else {
            alert("Không tìm thấy đơn hàng hợp lệ để đánh giá!");
        }
        setIsReviewDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans pb-20">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#E4187D] mb-4" />
                    <p className="text-gray-500 font-medium">Đang tải thông tin chuyên gia...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans pb-20">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy Artist</h2>
                        <Button onClick={() => router.back()} className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 py-6 font-bold w-full mt-4">
                            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại trang trước
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const displayAvatar = artist.portfolioImages ? artist.portfolioImages.split(',')[0] : defaultAvatar;

    return (
        <div className="bg-[#FFF5F8] min-h-screen font-sans pb-20">
            <Header />

            <main className="max-w-7xl mb-8 mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* === CỘT TRÁI === */}
                <div className="lg:col-span-8 space-y-6">
                    {/* KHỐI THÔNG TIN ARTIST */}
                    <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row gap-8 shadow-sm relative overflow-hidden">
                        {artist.ownerId && (
                            <Link href={`/provider/${artist.ownerId}`} className="absolute top-0 right-0 bg-pink-50 text-[#E4187D] text-xs font-bold px-4 py-2 rounded-bl-2xl border-b border-l border-pink-100 flex items-center gap-1.5 hover:bg-pink-100 hover:text-pink-700 transition-colors z-10 cursor-pointer shadow-sm">
                                <Briefcase className="w-3.5 h-3.5" />
                                Thuộc quản lý: <span className="underline decoration-pink-300 underline-offset-2">{artist.ownerName || "Xem chi tiết"}</span>
                            </Link>
                        )}
                        <div className="w-32 h-32 rounded-full border-4 border-pink-100 overflow-hidden shrink-0 relative bg-gray-50 flex items-center justify-center mt-4 md:mt-0">
                            {displayAvatar !== defaultAvatar ? (
                                <Image src={displayAvatar} alt={artist.artistName || "Avatar"} fill className="object-cover" unoptimized />
                            ) : (
                                <span className="text-3xl font-bold text-[#E4187D]">{artist.artistName?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1 mt-2 md:mt-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{artist.artistName}</h1>
                                <span className="bg-[#E4187D] text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Xác minh</span>
                            </div>
                            <p className="text-[#E4187D] font-medium text-sm mb-3">Chuyên môn: <span className="text-gray-700">{artist.specialization || "Chưa cập nhật"}</span></p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 mt-4">
                                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /> {artist.averageRating ? artist.averageRating.toFixed(1) : "0.0"}</span>
                                <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-gray-400" /> {artist.reviewCount || 0} Đánh giá</span>
                                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-400" /> {artist.followCount || 0} Người theo dõi</span>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {isOwner ? (
                                    <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-8 flex items-center gap-2"><Edit className="w-4 h-4" /> Chỉnh sửa hồ sơ thợ</Button>
                                ) : (
                                    <Button variant={isFollowing ? "secondary" : "outline"} className={`rounded-full px-6 transition-all ${isFollowing ? "bg-pink-100 text-[#E4187D] hover:bg-pink-200 border-transparent font-semibold" : "border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"}`} onClick={handleFollowToggle} disabled={isFollowLoading}>
                                        <Heart className={`w-4 h-4 mr-2 transition-transform ${isFollowLoading ? "animate-pulse" : ""} ${isFollowing ? "fill-[#E4187D] text-[#E4187D] scale-110" : ""}`} /> {isFollowing ? "Hủy follow" : "Follow"}
                                    </Button>
                                )}
                            </div>
                            {!isOwner && (
                                <div className="mt-5 p-5 bg-pink-50/50 border border-pink-100 rounded-2xl shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Scissors className="w-4 h-4 text-[#E4187D]" /> Chọn dịch vụ để đặt lịch với {artist.artistName}:</h3>
                                    {providerServices.length > 0 ? (
                                        <div className="flex flex-col gap-3">
                                            {providerServices.map(svc => (
                                                <div key={svc.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-pink-100/60 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow gap-3 sm:gap-0">
                                                    <div>
                                                        <Link href={`/services/${svc.id}`} className="font-bold text-gray-900 hover:text-[#E4187D] transition-colors text-sm line-clamp-1">{svc.name}</Link>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <span className="text-[#E4187D] font-bold text-sm">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(svc.price)}</span>
                                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {svc.duration} phút</span>
                                                        </div>
                                                    </div>
                                                    <Button onClick={() => router.push(`/booking/${svc.id}?ownerId=${artist.ownerId}`)} className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-lg px-5 h-9 text-xs font-bold shadow-sm w-full sm:w-auto">Đặt lịch ngay</Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic bg-white p-3 rounded-lg border border-gray-100">Chủ tiệm hiện chưa cập nhật dịch vụ nào khả dụng.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KHỐI LỊCH LÀM VIỆC */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-6 h-6 text-[#E4187D]" /> Lịch làm việc sắp tới</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-[#E4187D] bg-pink-50 px-3 py-1 rounded-full">{schedule.length} lịch hẹn</span>
                                {isOwner && <Button variant="outline" size="sm" className="text-[#E4187D] border-pink-200 hover:bg-pink-50 rounded-full h-8"><Edit className="w-3.5 h-3.5 mr-1.5" /> Quản lý lịch</Button>}
                            </div>
                        </div>
                        <div className="border border-gray-100 rounded-2xl overflow-hidden">
                            <BookingTable schedule={schedule} />
                        </div>
                    </div>

                    {/* KHỐI ĐÁNH GIÁ (REVIEWS) */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-[#E4187D]" /> Đánh giá từ khách hàng</h2>

                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-500">{artist.reviewCount || 0} lượt đánh giá</span>
                                {user && !isOwner && reviewableBookingId && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleOpenReviewDialog}
                                        className="h-8 border-[#E4187D] text-[#E4187D] hover:bg-pink-50 hover:text-pink-700 rounded-full text-xs font-bold"
                                    >
                                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Viết đánh giá
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isLoadingReviews ? (
                            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-pink-200" /></div>
                        ) : reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map(review => (
                                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#E4187D] font-bold shrink-0">
                                                    {review.customer?.charAt(0).toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-900">{review.customer || "Khách hàng"}</h4>
                                                    <p className="text-xs text-gray-400">{review.date !== "N/A" ? review.date : "Gần đây"}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < (review.artistRating || 0) ? "text-yellow-400 fill-current" : "text-gray-200"}`} />
                                                ))}
                                            </div>
                                        </div>

                                        {review.tags && (
                                            <div className="flex flex-wrap gap-2 mb-3 ml-13">
                                                <span className="px-2.5 py-1 bg-pink-50 text-[#E4187D] text-[10px] font-bold rounded-md">
                                                    #{TAG_DICTIONARY[review.tags] || review.tags}
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-600 leading-relaxed ml-13 whitespace-pre-line">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 font-medium">Chưa có đánh giá nào cho chuyên gia này.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* === CỘT PHẢI === */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm flex justify-around items-center text-center">
                        <div>
                            <p className="text-2xl font-bold text-[#E4187D]">{artist.reviewCount || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Lượt đánh giá</p>
                        </div>
                        <div className="w-px h-12 bg-gray-100"></div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {artist.averageRating ? artist.averageRating.toFixed(1) : "0.0"} <Star className="inline w-4 h-4 text-yellow-400 fill-current -mt-1" />
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Điểm trung bình</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Đặc điểm nổi bật</h2>
                        <div className="space-y-4">
                            <div className="flex gap-3"><ShieldCheck className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" /><div><h4 className="text-sm font-bold text-gray-900">Tay nghề được chứng nhận</h4><p className="text-xs text-gray-500 mt-0.5">Đã vượt qua quy trình kiểm tra năng lực của hệ thống.</p></div></div>
                            <div className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" /><div><h4 className="text-sm font-bold text-gray-900">Phục vụ tận tâm</h4><p className="text-xs text-gray-500 mt-0.5">Luôn lắng nghe và thấu hiểu mong muốn của khách hàng.</p></div></div>
                            <div className="flex gap-3"><MapPin className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" /><div><h4 className="text-sm font-bold text-gray-900">Hỗ trợ di chuyển</h4><p className="text-xs text-gray-500 mt-0.5">Có thể phục vụ tận nơi theo yêu cầu của khách hàng.</p></div></div>
                        </div>
                    </div>
                </div>
            </main>

            {isReviewDialogOpen && (
                <ReviewDialog
                    isOpen={isReviewDialogOpen}
                    bookingId={reviewBookingId}
                    artistName={artist.artistName}
                    serviceName="Dịch vụ trang điểm"
                    onClose={() => setIsReviewDialogOpen(false)}
                    onSuccess={() => {
                        fetchReviews();
                    }}
                />
            )}

            <Footer />
        </div>
    );
}