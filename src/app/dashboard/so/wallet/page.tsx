"use client";

import { useEffect, useState } from "react";
import { Wallet, Landmark, Loader2, AlertCircle, ArrowDownToLine, CheckCircle2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMyWallet, updateBankInfo, requestWithdraw } from "@/services/withdraw-service";
import { WalletResponse } from "@/types/wallet";

export default function SoWalletPage() {
    const [wallet, setWallet] = useState<WalletResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const [isUpdatingBank, setIsUpdatingBank] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const [bankForm, setBankForm] = useState({ bankId: "", accountNo: "", accountName: "" });
    const [withdrawAmount, setWithdrawAmount] = useState<number | "">("");

    const fetchWallet = async () => {
        try {
            const data = await getMyWallet();
            setWallet(data);
            if (data.bankId) {
                setBankForm({
                    bankId: data.bankId,
                    accountNo: data.accountNo,
                    accountName: data.accountName
                });
            }
        } catch {
            toast.error("Không thể tải thông tin ví.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleUpdateBank = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingBank(true);
        try {
            await updateBankInfo(bankForm);
            toast.success("Cập nhật thông tin ngân hàng thành công!");
            fetchWallet();
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: string | { message?: string } } })?.response?.data;
            const errorText = typeof msg === "string" ? msg : (msg?.message ?? "Lỗi cập nhật ngân hàng");
            toast.error(errorText);
        } finally {
            setIsUpdatingBank(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            toast.error("Vui lòng nhập số tiền hợp lệ!");
            return;
        }

        if (wallet && Number(withdrawAmount) > wallet.balance) {
            toast.error("Số dư không đủ để rút!");
            return;
        }

        setIsWithdrawing(true);
        try {
            await requestWithdraw(Number(withdrawAmount));
            toast.success("Đã tạo lệnh rút tiền thành công! Vui lòng chờ Admin duyệt.");
            setWithdrawAmount("");
            fetchWallet();
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: string | { message?: string } } })?.response?.data;
            const errorText = typeof msg === "string" ? msg : (msg?.message ?? "Lỗi khi tạo lệnh rút tiền.");
            toast.error(errorText);
        } finally {
            setIsWithdrawing(false);
        }
    };

    const formatPrice = (p: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

    const hasBankInfo = wallet?.bankId && wallet?.accountNo && wallet?.accountName;

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-500" /></div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Ví Doanh Thu</h2>
                <p className="text-gray-500 text-sm">Quản lý số dư, cập nhật ngân hàng và tạo lệnh rút tiền.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cột Trái: Thẻ Số Dư & Form Rút Tiền */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Thẻ hiển thị số dư */}
                    <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
                        <Wallet className="absolute -bottom-6 -right-6 w-32 h-32 text-gray-700 opacity-30" />
                        <div className="relative z-10">
                            <p className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Số dư khả dụng</p>
                            <h3 className="text-4xl font-black tracking-tight">{formatPrice(wallet?.balance || 0)}</h3>
                        </div>
                    </div>

                    {/* Form Yêu cầu rút tiền */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <ArrowDownToLine className="w-5 h-5 text-[#E4187D]" />
                            Tạo lệnh rút tiền
                        </h3>

                        {!hasBankInfo ? (
                            <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100 mb-2">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-700">Chưa liên kết ngân hàng</p>
                                    <p className="text-xs text-red-600 mt-1">Bạn cần cập nhật thông tin tài khoản ngân hàng ở bên cạnh trước khi có thể rút tiền.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleWithdraw} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Số tiền muốn rút</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Banknote className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                            placeholder="Nhập số tiền..."
                                            max={wallet?.balance || 0}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <p className="text-xs text-gray-500">Tối thiểu: 2.000 đ</p>
                                        <button
                                            type="button"
                                            onClick={() => setWithdrawAmount(wallet?.balance || 0)}
                                            className="text-xs font-bold text-[#E4187D] hover:underline"
                                        >
                                            Rút toàn bộ
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isWithdrawing || !withdrawAmount || Number(withdrawAmount) > (wallet?.balance || 0) || withdrawAmount < 2000}
                                    className="w-full bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-xl font-bold h-12 shadow-md disabled:opacity-60"
                                >
                                    {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowDownToLine className="w-5 h-5 mr-2" />}
                                    Yêu cầu rút tiền
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Cột Phải: Thông tin Ngân hàng */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Landmark className="w-5 h-5 text-blue-500" />
                                Ngân hàng thụ hưởng
                            </h3>
                            {hasBankInfo && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        </div>

                        <form onSubmit={handleUpdateBank} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Mã Ngân Hàng (VD: VCB, MB)</label>
                                <input
                                    type="text"
                                    value={bankForm.bankId}
                                    onChange={(e) => setBankForm({ ...bankForm, bankId: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase"
                                    placeholder="Nhập mã ngân hàng..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Số Tài Khoản</label>
                                <input
                                    type="text"
                                    value={bankForm.accountNo}
                                    onChange={(e) => setBankForm({ ...bankForm, accountNo: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Nhập số tài khoản..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Tên Chủ Tài Khoản</label>
                                <input
                                    type="text"
                                    value={bankForm.accountName}
                                    onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase"
                                    placeholder="NGUYEN VAN A"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isUpdatingBank}
                                variant="outline"
                                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl font-bold h-11 mt-2"
                            >
                                {isUpdatingBank ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {hasBankInfo ? "Cập nhật thông tin" : "Lưu thông tin ngân hàng"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}