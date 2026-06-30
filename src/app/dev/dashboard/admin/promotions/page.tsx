"use client";

import { useEffect, useState } from "react";
import { promotionService, CreatePromotionRequest } from "@/services/promotion-service";
import { PromotionDto } from "@/types/promotion";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Calendar, Tag, DollarSign, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState<PromotionDto[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<PromotionDto | null>(null);

    // Form states
    const [code, setCode] = useState("");
    const [discountValue, setDiscountValue] = useState(0);
    const [minOrderValue, setMinOrderValue] = useState(0);
    const [pointCharge, setPointCharge] = useState(0);
    const [expiryDate, setExpiryDate] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const data = await promotionService.getPromotions();
            setPromotions(data);
        } catch (error) {
            toast.error("Không thể tải danh sách khuyến mãi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleOpenCreate = () => {
        setEditingPromo(null);
        setCode("");
        setDiscountValue(10000);
        setMinOrderValue(50000);
        setPointCharge(0);
        setExpiryDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]); // 7 ngày sau
        setIsOpen(true);
    };

    const handleOpenEdit = (promo: PromotionDto) => {
        setEditingPromo(promo);
        setCode(promo.code);
        setDiscountValue(promo.discountValue);
        setMinOrderValue(promo.minOrderValue);
        setPointCharge(promo.pointCharge);
        setExpiryDate(promo.expiryDate.split("T")[0]);
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            toast.error("Vui lòng nhập mã khuyến mãi");
            return;
        }

        const payload: CreatePromotionRequest = {
            code: code.trim().toUpperCase(),
            discountValue,
            minOrderValue,
            pointCharge,
            expiryDate,
        };

        setSubmitting(true);
        try {
            if (editingPromo) {
                await promotionService.updatePromotion(editingPromo.id, payload);
                toast.success("Cập nhật mã khuyến mãi thành công.");
            } else {
                await promotionService.createPromotion(payload);
                toast.success("Tạo mã khuyến mãi thành công.");
            }
            setIsOpen(false);
            fetchPromotions();
        } catch (error) {
            toast.error("Lỗi khi xử lý khuyến mãi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa mã khuyến mãi này không?")) return;
        try {
            await promotionService.deletePromotion(id);
            toast.success("Đã xóa mã khuyến mãi.");
            setPromotions(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            toast.error("Không thể xóa mã khuyến mãi.");
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Quản Lý Mã Khuyến Mãi</h2>
                    <p className="text-gray-500 text-sm">Tạo mã giảm giá áp dụng toàn sàn hoặc đổi điểm tích lũy của khách hàng.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-[#E4187D] hover:bg-[#c9126b] text-white flex items-center gap-2 rounded-full font-bold shadow-md shadow-pink-200 cursor-pointer">
                    <Plus className="w-4 h-4" /> Tạo mã khuyến mãi
                </Button>
            </div>

            {/* Danh sách promotions */}
            {promotions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-white text-center">
                    <Tag className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Chưa có mã khuyến mãi nào được tạo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promotions.map((promo) => (
                        <div key={promo.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                            {/* Phông nền trang trí kiểu coupon card */}
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-100" />
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-100" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="font-extrabold text-pink-600 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-xl text-lg tracking-wider">
                                        {promo.code}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenEdit(promo)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors cursor-pointer">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(promo.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-gray-50 pt-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>Giảm giá: <strong className="text-gray-900">{formatCurrency(promo.discountValue)}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>Đơn hàng tối thiểu: <strong className="text-gray-900">{formatCurrency(promo.minOrderValue)}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>Điểm cần đổi: <strong className="text-gray-900">{promo.pointCharge} pts</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>Hạn dùng: <strong className="text-gray-900">{new Date(promo.expiryDate).toLocaleDateString("vi-VN")}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Create/Edit */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full border shadow-xl relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsOpen(false)} className="absolute right-6 top-6 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                            {editingPromo ? "Chỉnh sửa mã khuyến mãi" : "Tạo mã khuyến mãi mới"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Ví dụ: GIAM20K, WELCOME"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá trị giảm (VND)</label>
                                <input
                                    type="number"
                                    min={1000}
                                    step={1000}
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Đơn hàng tối thiểu (VND)</label>
                                <input
                                    type="number"
                                    min={0}
                                    step={5000}
                                    value={minOrderValue}
                                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Điểm tích lũy cần đổi (Nếu có)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={pointCharge}
                                    onChange={(e) => setPointCharge(Number(e.target.value))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày hết hạn</label>
                                <input
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-full py-6 font-semibold">
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={submitting} className="flex-1 bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full py-6 font-semibold shadow-md shadow-pink-100">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                                    {editingPromo ? "Lưu" : "Tạo mới"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
