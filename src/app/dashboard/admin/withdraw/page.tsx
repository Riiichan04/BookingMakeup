"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getAllWithdraws, approveWithdraw, rejectWithdraw, generateQrUrl } from "@/services/withdraw-service";
import Image from "next/image";
import { WithdrawDto } from "@/types/wallet";

export default function AdminWithdrawsPage() {
    const [withdraws, setWithdraws] = useState<WithdrawDto[]>([]);
    const [loading, setLoading] = useState(true);

    // States cho Modal Duyệt
    const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawDto | null>(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [transactionCode, setTransactionCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // States cho Modal Từ chối
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const fetchWithdraws = async () => {
        try {
            const data = await getAllWithdraws();
            setWithdraws(data);
        } catch {
            toast.error("Không thể tải danh sách lệnh rút tiền.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdraws();
    }, []);

    const handleApprove = async () => {
        if (!selectedWithdraw) return;
        setIsProcessing(true);
        try {
            await approveWithdraw(selectedWithdraw.id, transactionCode || "Chuyển khoản QR");
            toast.success("Đã duyệt lệnh thành công!");
            setIsApproveModalOpen(false);
            setTransactionCode("");
            fetchWithdraws();
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: string | { message?: string } } })?.response?.data;
            toast.error(typeof msg === "string" ? msg : (msg?.message ?? "Lỗi khi duyệt lệnh"));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedWithdraw || !rejectReason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối!");
            return;
        }
        setIsProcessing(true);
        try {
            await rejectWithdraw(selectedWithdraw.id, rejectReason);
            toast.success("Đã từ chối lệnh và hoàn tiền vào ví!");
            setIsRejectModalOpen(false);
            setRejectReason("");
            fetchWithdraws();
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: string | { message?: string } } })?.response?.data;
            toast.error(typeof msg === "string" ? msg : (msg?.message ?? "Lỗi khi từ chối lệnh"));
        } finally {
            setIsProcessing(false);
        }
    };

    const formatPrice = (p: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING": return <Badge className="bg-yellow-100 text-yellow-700 border-none">Đang chờ</Badge>;
            case "APPROVED": return <Badge className="bg-green-100 text-green-700 border-none">Đã chuyển khoản</Badge>;
            case "REJECTED": return <Badge className="bg-red-100 text-red-700 border-none">Đã từ chối</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Quản lý Rút Tiền</h2>
                <p className="text-gray-500 text-sm">Duyệt lệnh rút doanh thu của các Chủ tiệm.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Mã lệnh / Thời gian</th>
                                <th className="px-6 py-4">Người rút</th>
                                <th className="px-6 py-4">Số tiền</th>
                                <th className="px-6 py-4">Thông tin nhận</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {withdraws.map(w => (
                                <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-mono text-xs text-gray-500 mb-1">#{w.id.substring(0, 8)}</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(w.createdAt).toLocaleDateString('vi-VN')} {new Date(w.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{w.owner?.user?.displayName || "Chủ tiệm"}</td>
                                    <td className="px-6 py-4 font-black text-[#E4187D]">{formatPrice(w.amount)}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{w.bankId}</p>
                                        <p className="text-gray-600 font-mono text-xs my-0.5">{w.accountNo}</p>
                                        <p className="text-gray-500 text-xs">{w.accountName}</p>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(w.status)}</td>
                                    <td className="px-6 py-4 text-right">
                                        {w.status === "PENDING" && (
                                            <Button
                                                onClick={() => { setSelectedWithdraw(w); setIsApproveModalOpen(true); }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 rounded-lg"
                                            >
                                                Xử lý ngay
                                            </Button>
                                        )}
                                        {w.status !== "PENDING" && (
                                            <span className="text-xs text-gray-400 italic">Đã xử lý</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {withdraws.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                        Không có dữ liệu rút tiền.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DUYỆT LỆNH & QUÉT QR */}
            <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden">
                    <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-xl font-bold">Xử lý chuyển khoản</DialogTitle>
                            <p className="text-blue-100 text-sm mt-1">Sử dụng App Ngân hàng để quét mã QR</p>
                        </div>
                    </div>

                    {selectedWithdraw && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Cột trái: Mã QR */}
                            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200">
                                    <Image
                                        src={generateQrUrl(selectedWithdraw.bankId, selectedWithdraw.accountNo, selectedWithdraw.accountName, selectedWithdraw.amount, selectedWithdraw.id)}
                                        alt="QR Code"
                                        fill
                                        className="object-contain p-2"
                                        unoptimized
                                    />
                                </div>
                                <p className="text-xs font-bold text-gray-500 mt-4 text-center">Quét mã để tự động điền thông tin</p>
                            </div>

                            {/* Cột phải: Thông tin & Form */}
                            <div className="space-y-6">
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-600 font-bold uppercase mb-2">Thông tin người nhận</p>
                                    <h3 className="font-bold text-gray-900 text-lg">{selectedWithdraw.accountName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-mono text-gray-700 bg-white px-2 py-1 rounded border border-gray-200 text-sm">{selectedWithdraw.accountNo}</span>
                                        <span className="text-sm font-bold text-gray-500">{selectedWithdraw.bankId}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Số tiền chuyển:</span>
                                        <span className="text-2xl font-black text-[#E4187D]">{formatPrice(selectedWithdraw.amount)}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Mã giao dịch (Tùy chọn)</label>
                                    <input
                                        type="text"
                                        value={transactionCode}
                                        onChange={(e) => setTransactionCode(e.target.value)}
                                        placeholder="VD: FT230491823..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        onClick={handleApprove}
                                        disabled={isProcessing}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-11"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                                        Xác nhận thanh toán
                                    </Button>

                                    <Button
                                        onClick={() => { setIsApproveModalOpen(false); setIsRejectModalOpen(true); }}
                                        disabled={isProcessing}
                                        variant="outline"
                                        className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl h-11 px-4"
                                    >
                                        Từ chối
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL TỪ CHỐI */}
            <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                            <XCircle className="w-6 h-6" /> Từ chối lệnh rút tiền
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-gray-600">Tiền sẽ được hoàn lại vào Ví doanh thu của Chủ tiệm. Vui lòng nhập lý do từ chối:</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="VD: Sai thông tin số tài khoản, tên chủ thẻ không khớp..."
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-red-500 outline-none min-h-25 resize-none"
                        />
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)} className="rounded-xl">Hủy</Button>
                            <Button
                                onClick={handleReject}
                                disabled={isProcessing || !rejectReason.trim()}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold px-6"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Xác nhận từ chối
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}