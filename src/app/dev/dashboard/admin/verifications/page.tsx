"use client";

import { useEffect, useState } from "react";
import { statisticsService, ServiceOwnerVerificationDto } from "@/services/statistics-service";
import { toast } from "sonner";
import { Loader2, UserCheck, Check, X, ShieldAlert, FileText, Image as ImageIcon, Sparkles, RefreshCw, Calendar, Phone, Mail, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminVerificationsPage() {
    const [requests, setRequests] = useState<ServiceOwnerVerificationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ServiceOwnerVerificationDto | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await statisticsService.getPendingVerifications();
            setRequests(data);
        } catch (error) {
            toast.error("Không thể tải danh sách hồ sơ chờ duyệt.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleViewDetail = async (userId: string) => {
        setDetailLoading(true);
        try {
            const detail = await statisticsService.getVerificationDetail(userId);
            setSelectedRequest(detail);
        } catch (error) {
            toast.error("Không thể tải chi tiết hồ sơ.");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        try {
            await statisticsService.approveVerification(userId);
            toast.success("Đã phê duyệt tài khoản lên Service Owner thành công!");
            setRequests(prev => prev.map(r => r.userId === userId ? { ...r, verificationStatus: "approved" } : r));
            setSelectedRequest(null);
        } catch (error) {
            toast.error("Phê duyệt thất bại. Vui lòng thử lại.");
        }
    };

    const handleReject = async (userId: string) => {
        try {
            await statisticsService.rejectVerification(userId);
            toast.success("Đã từ chối hồ sơ đăng ký lên Service Owner.");
            setRequests(prev => prev.map(r => r.userId === userId ? { ...r, verificationStatus: "rejected" } : r));
            setSelectedRequest(null);
        } catch (error) {
            toast.error("Từ chối thất bại. Vui lòng thử lại.");
        }
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
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Lịch Sử & Duyệt Đăng Ký SO</h2>
                    <p className="text-gray-500 text-sm">Xem xét thông tin và lịch sử phê duyệt người dùng xin nâng cấp lên đối tác Service Owner.</p>
                </div>
                <Button variant="outline" onClick={fetchRequests} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Làm mới
                </Button>
            </div>

            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-white text-center shadow-xs">
                    <ShieldAlert className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold text-lg">Chưa có hồ sơ đăng ký nào</p>
                    <p className="text-gray-400 text-sm mt-1">Hệ thống chưa ghi nhận bất kỳ yêu cầu ứng tuyển Service Owner nào từ phía người dùng.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Họ và tên / Email</th>
                                    <th className="px-6 py-4">Số điện thoại</th>
                                    <th className="px-6 py-4">Kinh nghiệm</th>
                                    <th className="px-6 py-4">Loại hình studio</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {requests.map((r) => {
                                    const status = r.verificationStatus?.toLowerCase() || "pending";
                                    return (
                                        <tr key={r.userId} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{r.displayName || "N/A"}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{r.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-600">
                                                {r.phone || "Chưa cung cấp"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-pink-600">{r.experienceYears || 0} năm</span> kinh nghiệm
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    r.showcaseType === "PREMIUM"
                                                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                                                        : "bg-gray-50 text-gray-700 border border-gray-100"
                                                }`}>
                                                    {r.showcaseType === "PREMIUM" ? "Premium Studio" : "Standard"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {status === "approved" ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                        Đã phê duyệt
                                                    </span>
                                                ) : status === "rejected" ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                                                        Đã từ chối
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                        Chờ phê duyệt
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetail(r.userId)}
                                                    className="border-pink-200 text-pink-600 hover:bg-pink-50"
                                                    disabled={detailLoading}
                                                >
                                                    Chi tiết
                                                </Button>
                                                {status === "pending" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprove(r.userId)}
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            Duyệt
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleReject(r.userId)}
                                                        >
                                                            Từ chối
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết Hồ sơ */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <UserCheck className="w-6 h-6 text-pink-500" />
                            <h3 className="text-xl font-extrabold text-gray-900">Chi Tiết Hồ Sơ Đăng Ký SO</h3>
                        </div>

                        {/* Thông tin liên hệ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-100 text-sm">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span>Họ và tên: <strong className="text-gray-900">{selectedRequest.displayName}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>Email: <strong className="text-gray-900">{selectedRequest.email}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>Điện thoại: <strong className="text-gray-900">{selectedRequest.phone || "N/A"}</strong></span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Số năm kinh nghiệm: <strong className="text-gray-900">{selectedRequest.experienceYears} năm</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Award className="w-4 h-4 text-gray-400" />
                                    <span>Cấp độ đăng ký: <strong className="text-gray-900">{selectedRequest.showcaseType} Studio</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* Tiểu sử */}
                        <div className="space-y-2">
                            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-yellow-500" /> Tiểu sử & Tự giới thiệu
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed bg-pink-50/30 p-4 rounded-2xl border border-pink-100/50 break-words whitespace-pre-line">
                                {selectedRequest.bio || "Người dùng chưa viết tiểu sử giới thiệu bản thân."}
                            </p>
                        </div>

                        {/* Giấy tờ tùy thân */}
                        <div className="space-y-3">
                            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-[#E4187D]" /> Giấy tờ tùy thân (Identity Card / CCCD)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className="text-xs text-gray-400 font-semibold uppercase">Mặt trước CCCD</span>
                                    <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center min-h-[180px] max-h-[220px]">
                                        {selectedRequest.identityFront ? (
                                            <img
                                                src={selectedRequest.identityFront}
                                                alt="Mặt trước CCCD"
                                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">Không tìm thấy ảnh mặt trước</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-xs text-gray-400 font-semibold uppercase">Mặt sau CCCD</span>
                                    <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center min-h-[180px] max-h-[220px]">
                                        {selectedRequest.identityBack ? (
                                            <img
                                                src={selectedRequest.identityBack}
                                                alt="Mặt sau CCCD"
                                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">Không tìm thấy ảnh mặt sau</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Các nút bấm thao tác ở chân Modal */}
                        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedRequest(null)}
                                className="rounded-full px-6"
                            >
                                Đóng
                            </Button>
                            {(selectedRequest.verificationStatus?.toLowerCase() || "pending") === "pending" && (
                                <>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleReject(selectedRequest.userId)}
                                        className="rounded-full px-6 flex items-center gap-1.5"
                                    >
                                        <X className="w-4 h-4" /> Từ chối
                                    </Button>
                                    <Button
                                        onClick={() => handleApprove(selectedRequest.userId)}
                                        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 flex items-center gap-1.5"
                                    >
                                        <Check className="w-4 h-4" /> Phê duyệt hồ sơ
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
