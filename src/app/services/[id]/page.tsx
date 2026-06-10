"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { Clock, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getServiceDetail } from "@/services/artist-service";
import { useRouter } from "next/navigation";
import { ServiceDetailResponse } from "@/types/artist";
import { SERVICE_DEPOSITE_AMOUNT } from "@/common/constant/service-deposite";

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    
    const [svc, setSvc] = useState<ServiceDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getServiceDetail(resolvedParams.id)
            .then((data) => {
                setSvc(data);
            })
            .catch(() => {
                setSvc(null);
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
                    <p className="text-gray-500 font-medium">Đang tải thông tin dịch vụ...</p>
                </main>
                <Footer />
            </div>
        );
    }

    // 2. TRẠNG THÁI: LỖI HOẶC KHÔNG TÌM THẤY DỊCH VỤ (Có Header & Footer + Nút Back)
    if (!svc) {
        return (
            <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans pb-20">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy dịch vụ</h2>
                        <p className="text-gray-500 mb-8">Dịch vụ này có thể không tồn tại, đã bị xóa, hoặc đã xảy ra lỗi kết nối.</p>
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

    // 3. TRẠNG THÁI: THÀNH CÔNG (Render UI như cũ)
    const mainImage = svc.mainThumbnailUrl || "https://images.unsplash.com/photo-1595051665600-afd01ea7c446?w=800&q=80";

    return (
        <div className="bg-[#FFF5F8] min-h-screen font-sans pb-20">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-sm text-[#E4187D] font-medium mb-6">
                    {svc.ownerName} / <span className="font-bold text-gray-900">{svc.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* CỘT TRÁI */}
                    <div className="lg:col-span-8 space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">{svc.name}</h1>
                            <p className="text-gray-600 text-lg">Đánh thức vẻ đẹp tiềm ẩn của bạn với phong cách trang điểm tinh tế.</p>
                        </div>

                        <div className="relative w-full aspect-16/10 rounded-3xl overflow-hidden shadow-sm">
                            <Image src={mainImage} alt={svc.name} fill unoptimized className="object-cover" />
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Về dịch vụ này</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {svc.description || "Dịch vụ trang điểm cao cấp không chỉ là làm đẹp, mà là một trải nghiệm nghệ thuật cá nhân hóa. Chúng tôi cam kết sử dụng 100% mỹ phẩm từ các thương hiệu danh tiếng nhất."}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["Tư vấn Layout 1-1 chuyên sâu", "Mỹ phẩm High-end 100%", "Độ bền màu lên đến 16 giờ", "Bao gồm làm tóc & dặm nền"].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle2 className="w-5 h-5 text-[#E4187D]" />
                                        <span className="font-medium text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Giá dịch vụ</p>
                            <div className="text-3xl font-extrabold text-[#E4187D] mb-2">
                                {Math.round(svc.price * SERVICE_DEPOSITE_AMOUNT).toLocaleString('vi-VN')}đ
                            </div>
                            <div className="flex items-center text-sm text-gray-500"><CheckCircle2 className="w-4 h-4 mr-2 text-gray-400" />Đã bao gồm phí tư vấn và phí nền tảng</div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Thời gian thực hiện</p>
                            <div className="text-xl font-bold text-gray-900 mb-2">{svc.duration} Phút</div>
                            <div className="flex items-center text-sm text-gray-500"><Clock className="w-4 h-4 mr-2 text-gray-400" />Nên đặt trước ít nhất 2 tuần</div>
                        </div>

                        <div className="bg-linear-to-br from-[#E4187D] to-[#c9126b] rounded-3xl p-6 shadow-md text-white">
                            <p className="text-xs font-bold text-pink-200 uppercase tracking-wider mb-1">Được cung cấp bởi</p>
                            <h3 className="text-2xl font-bold mb-6">{svc.ownerName}</h3>
                            <Button
                                className="w-full bg-white text-[#E4187D] hover:bg-gray-50 hover:text-[#E4187D] rounded-full font-bold py-6 text-base transition-colors"
                                onClick={() => router.push(`/booking/${svc.serviceId}`)}
                            >
                                ĐẶT LỊCH NGAY
                            </Button>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Quy trình thực hiện</h3>
                            <div className="relative border-l-2 border-pink-100 ml-3 space-y-8">
                                {[
                                    { title: "Tư vấn phong cách", desc: "Lựa chọn layout dựa trên sở thích." },
                                    { title: "Dưỡng da chuyên sâu", desc: "Làm sạch và massage cấp ẩm." },
                                    { title: "Thực hiện Makeup", desc: "Đánh nền, nhấn mắt, tạo khối." },
                                    { title: "Hoàn thiện", desc: "Làm tóc và xịt khóa nền cố định." }
                                ].map((step, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className="absolute -left-4.25 bg-white border-2 border-[#E4187D] text-[#E4187D] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-base">{step.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DỊCH VỤ LIÊN QUAN */}
                {svc.relatedServices?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Các dịch vụ khác của {svc.ownerName}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {svc.relatedServices.map((rel) => (
                                <div key={rel.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
                                        <Image src={rel.imageUrl} alt={rel.name} fill unoptimized className="object-cover" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{rel.name}</h3>
                                    <div className="flex items-center justify-between mt-auto">
                                        <p className="font-bold text-[#E4187D] text-sm">{rel.price.toLocaleString('vi-VN')}đ</p>
                                        <Button 
                                            size="sm" 
                                            className="bg-[#E4187D] text-white rounded-full text-xs h-7 hover:bg-[#c9126b]"
                                            onClick={() => router.push(`/services/${rel.id}`)}
                                        >
                                            Xem
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}