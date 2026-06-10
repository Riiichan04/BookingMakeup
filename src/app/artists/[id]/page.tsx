"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, CheckCircle2, Heart, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getProviderProfile } from "@/services/artist-service";
import { defaultAvatar } from "@/common/constant/default-avatar";
import { ProviderProfileResponse } from "@/types/artist";
import { useRouter } from "next/navigation";
import { SERVICE_DEPOSITE_AMOUNT } from "@/common/constant/service-deposite";

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();

    const [data, setData] = useState<ProviderProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getProviderProfile(resolvedParams.id)
            .then((res) => {
                setData(res);
            })
            .catch(() => {
                setData(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [resolvedParams.id]);

    if (isLoading) {
        return (
            <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans pb-20">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#E4187D] mb-4" />
                    <p className="text-gray-500 font-medium">Đang tải hồ sơ nhà cung cấp...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans pb-20">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy nhà cung cấp</h2>
                        <p className="text-gray-500 mb-8">Hồ sơ này có thể không tồn tại, đã bị xóa, hoặc đã xảy ra lỗi kết nối.</p>
                        <Button
                            onClick={() => router.back()}
                            className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 py-6 font-bold w-full"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Quay lại trang trước
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    return (
        <div className="bg-[#FFF5F8] min-h-screen font-sans pb-20">
            <Header />

            <main className="max-w-7xl mb-8 mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-8 space-y-6">
                    {/* Header Box */}
                    <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
                        <div className="w-32 h-32 rounded-full border-4 border-pink-100 overflow-hidden shrink-0 relative bg-gray-50 flex items-center justify-center">
                            {data.avatarUrl ? (
                                <Image src={data.avatarUrl} alt={data.displayName} fill className="object-cover" unoptimized />
                            ) : (
                                <span className="text-3xl font-bold text-[#E4187D]">{data.displayName.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{data.displayName}</h1>
                                <span className="bg-[#E4187D] text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Đã xác minh
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                {data.bio || "Agency makeup chuyên nghiệp với đội ngũ artist dày dặn kinh nghiệm, phong cách đa dạng."}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {data.address}</span>
                                <span>• {data.experienceYears} năm kinh nghiệm</span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8">Đặt lịch ngay</Button>
                                <Button variant="outline" className="border-pink-200 text-[#E4187D] hover:bg-pink-50 rounded-full px-8">Liên hệ</Button>
                                <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full px-4">
                                    <Heart className="w-4 h-4 mr-2" /> Theo dõi
                                </Button>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col gap-4 border-l border-gray-100 pl-6 shrink-0">
                            <div className="text-center"><p className="text-xl font-bold text-gray-900">0</p><p className="text-xs text-gray-500">Đặt lịch</p></div>
                            <div className="text-center"><p className="text-xl font-bold text-gray-900">{data.artists?.length || 0}</p><p className="text-xs text-gray-500">Artist</p></div>
                            <div className="text-center"><p className="text-xl font-bold text-gray-900">0 <Star className="inline w-4 h-4 text-yellow-400 fill-current -mt-1" /></p><p className="text-xs text-gray-500">{data.totalReviews} đánh giá</p></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Đội ngũ Artist</h2>
                            <span className="text-sm text-[#E4187D] font-medium cursor-pointer">Xem tất cả ({data.artists?.length || 0})</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.artists?.map((art) => (
                                <div key={art.id} className="flex gap-4 border border-gray-100 rounded-2xl p-4">
                                    <Image src={art.avatarUrl || defaultAvatar} alt={art.displayName} width={80} height={80} className="rounded-xl object-cover" unoptimized />
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900">{art.displayName}</h3>
                                            <span className="text-[#E4187D] text-xs font-bold flex items-center"><Star className="w-3 h-3 fill-current mr-1" /> {art.rating}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">Chuyên: {art.specialty}</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="h-7 text-xs rounded-full">Xem hồ sơ</Button>
                                            <Button size="sm" className="h-7 text-xs bg-[#E4187D] text-white rounded-full">Chọn artist</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Danh mục dịch vụ</h2>
                        <div className="space-y-4">
                            {data.services?.map((svc) => (
                                <div key={svc.id} className="flex justify-between items-center border border-gray-50 bg-gray-50/50 p-4 rounded-2xl">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{svc.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">⏱ {svc.duration} phút</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Giá từ</p>
                                        <p className="font-bold text-gray-900 text-sm mb-2">{Math.round(svc.price * SERVICE_DEPOSITE_AMOUNT).toLocaleString('vi-VN')}đ</p>

                                        <Link href={`/services/${svc.id}`}>
                                            <Button size="sm" className="h-7 text-xs bg-[#E4187D] text-white rounded-full px-4 w-full">
                                                Đặt lịch
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Cam kết dịch vụ</h2>
                        <div className="space-y-4">
                            {[
                                { title: "Artist đã được xác minh", desc: "Đội ngũ artist được tuyển chọn kỹ lưỡng." },
                                { title: "Đảm bảo chất lượng", desc: "Sản phẩm chính hãng, an toàn cho da." },
                                { title: "Hủy lịch free chính sách", desc: "Hỗ trợ đổi/hủy lịch linh hoạt." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}