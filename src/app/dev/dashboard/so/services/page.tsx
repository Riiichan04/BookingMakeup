"use client";

import { useEffect, useState } from "react";
import { makeupService, CreateServiceRequest, UpdateServiceRequest } from "@/services/makeup-service";
import { ServiceDto } from "@/types/service";
import { Category } from "@/common/constant/category";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Palette, DollarSign, Clock, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SOServicesPage() {
    const [services, setServices] = useState<ServiceDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isOpen, setIsOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceDto | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState(60);
    const [isActive, setIsActive] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await makeupService.getMyServices();
            setServices(data);
        } catch (error) {
            toast.error("Không thể tải danh sách dịch vụ của bạn.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenCreate = () => {
        setEditingService(null);
        setName("");
        setDescription("");
        setPrice(200000);
        setCategory(Category[0]?.name || "Trang điểm cô dâu");
        setDuration(60);
        setIsActive(true);
        setIsOpen(true);
    };

    const handleOpenEdit = (svc: ServiceDto) => {
        setEditingService(svc);
        setName(svc.name);
        setDescription(svc.description);
        setPrice(svc.price);
        setCategory(svc.category);
        setDuration(svc.duration);
        setIsActive(svc.isActive);
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Vui lòng nhập tên dịch vụ");
            return;
        }

        setSubmitting(true);
        try {
            if (editingService) {
                const payload: UpdateServiceRequest = {
                    name: name.trim(),
                    description: description.trim(),
                    price,
                    category,
                    duration,
                    isActive,
                };
                await makeupService.updateService(editingService.id, payload);
                toast.success("Cập nhật dịch vụ thành công.");
            } else {
                const payload: CreateServiceRequest = {
                    name: name.trim(),
                    description: description.trim(),
                    price,
                    category,
                    duration,
                };
                await makeupService.createService(payload);
                toast.success("Tạo dịch vụ mới thành công.");
            }
            setIsOpen(false);
            fetchServices();
        } catch (error) {
            toast.error("Lỗi khi xử lý thông tin dịch vụ.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;
        try {
            await makeupService.deleteService(id);
            toast.success("Đã xóa dịch vụ.");
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            toast.error("Không thể xóa dịch vụ.");
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
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Quản Lý Gói Dịch Vụ</h2>
                    <p className="text-gray-500 text-sm">Thiết lập các gói dịch vụ trang điểm, mức giá và thời gian thực hiện.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-[#E4187D] hover:bg-[#c9126b] text-white flex items-center gap-2 rounded-full font-bold shadow-md shadow-pink-200 cursor-pointer">
                    <Plus className="w-4 h-4" /> Thêm dịch vụ mới
                </Button>
            </div>

            {/* List services */}
            {services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-white text-center shadow-xs">
                    <Palette className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Bạn chưa đăng gói dịch vụ nào.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((svc) => (
                        <div key={svc.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-extrabold text-gray-900 text-lg line-clamp-1">
                                        {svc.name}
                                    </h4>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                        svc.isActive
                                            ? "bg-green-50 text-green-700 border border-green-100"
                                            : "bg-gray-50 text-gray-400 border border-gray-200"
                                    }`}>
                                        {svc.isActive ? "Hoạt động" : "Tạm ngưng"}
                                    </span>
                                </div>

                                <span className="inline-block text-xs font-semibold bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-lg">
                                    {svc.category}
                                </span>

                                <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed min-h-[54px] break-words">
                                    {svc.description || "Chưa có mô tả chi tiết."}
                                </p>

                                <div className="flex justify-between items-center border-t border-gray-50 pt-4 text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-700">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <span className="font-extrabold text-pink-600">{formatCurrency(svc.price)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>{svc.duration} phút</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6 border-t border-gray-50 pt-4">
                                <Button variant="outline" onClick={() => handleOpenEdit(svc)} className="flex-1 rounded-xl text-xs py-2 h-9 font-bold border-gray-200 text-gray-600 hover:bg-gray-50">
                                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Chỉnh sửa
                                </Button>
                                <Button variant="outline" onClick={() => handleDelete(svc.id)} className="rounded-xl text-xs px-3 h-9 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
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
                            {editingService ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên dịch vụ</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ví dụ: Trang điểm cô dâu ngày cưới"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Danh mục</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                                >
                                    {Category.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá tiền (VND)</label>
                                    <input
                                        type="number"
                                        min={10000}
                                        step={50000}
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thời lượng (Phút)</label>
                                    <input
                                        type="number"
                                        min={15}
                                        step={15}
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả chi tiết</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Nhập mô tả về phong cách trang điểm, mỹ phẩm sử dụng..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[100px]"
                                />
                            </div>

                            {editingService && (
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="w-4 h-4 text-pink-600 border-gray-300 rounded-sm focus:ring-pink-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">
                                        Đang hoạt động (Hiển thị cho khách đặt lịch)
                                    </label>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-full py-6 font-semibold">
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={submitting} className="flex-1 bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full py-6 font-semibold shadow-md shadow-pink-100">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                                    {editingService ? "Lưu" : "Thêm mới"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
