"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import { profileService } from "@/services/profile-service";
import { toast } from "sonner";
import { Loader2, User, Settings, Image as ImageIcon, ShieldCheck, ShieldAlert } from "lucide-react";

export default function ProfilePage({ mode }: { mode?: "customer" | "so" | "admin" }) {
    const { user } = useAuth();
    
    // State Thông tin cơ bản (UserDto)
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState<string>("0"); // 0: N/A, 1: Nam, 2: Nữ
    
    // State Thông tin SO (ServiceOwnerProfileDto)
    const [isSO, setIsSO] = useState(false);
    const [bio, setBio] = useState("");
    const [experienceYears, setExperienceYears] = useState(0);
    const [identityFront, setIdentityFront] = useState("");
    const [identityBack, setIdentityBack] = useState("");
    const [soStatus, setSoStatus] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // 1. Luôn tải Profile đầy đủ của User từ DB
                const fullProfile = await profileService.getCustomerProfile();
                setDisplayName(fullProfile.displayName || fullProfile.username || "");
                setPhone(fullProfile.phone || "");
                setAddress(fullProfile.address || "");
                setGender(fullProfile.gender?.toString() || "0");

                // Luôn thử tải thông tin Service Owner (nếu có ứng tuyển hoặc là SO)
                try {
                    const soProfile = await profileService.getServiceOwnerProfile();
                    const statusUpper = soProfile.verificationStatus ? soProfile.verificationStatus.toUpperCase() : null;
                    setIsSO(statusUpper === "APPROVED");
                    setBio(soProfile.bio || "");
                    setExperienceYears(soProfile.experienceYears || 0);
                    setIdentityFront(soProfile.identityFront || "");
                    setIdentityBack(soProfile.identityBack || "");
                    setSoStatus(statusUpper);
                } catch (e) {
                    setIsSO(false);
                    setSoStatus(null);
                }
            } catch (error) {
                toast.error("Không thể tải thông tin hồ sơ.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user, mode]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Lưu thông tin cơ bản
            await profileService.updateCustomerProfile({ 
                displayName, 
                phone, 
                address,
            });
            
            // 2. Nếu là SO, lưu thêm thông tin cửa hàng
            if (isSO) {
                await profileService.updateServiceOwnerProfile({
                    bio, 
                    experienceYears, 
                    identityFront: identityFront || undefined, 
                    identityBack: identityBack || undefined
                });
            }

            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            toast.error("Lỗi cập nhật thông tin cá nhân.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl">
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Hồ Sơ Cá Nhân</h2>
                <p className="text-gray-500 text-sm">Quản lý thông tin tài khoản của bạn trên hệ thống.</p>
            </div>

            {/* Banners for SO Application Status */}
            {soStatus && soStatus !== "APPROVED" && (
                <div className={`mb-6 p-5 rounded-3xl border flex items-start gap-3 text-sm shadow-xs ${
                    soStatus === "PENDING"
                        ? "bg-yellow-50 border-yellow-100 text-yellow-800"
                        : "bg-red-50 border-red-100 text-red-800"
                }`}>
                    <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${soStatus === "PENDING" ? "text-yellow-600" : "text-red-600"}`} />
                    <div>
                        <p className="font-extrabold">
                            {soStatus === "PENDING"
                                ? "Hồ sơ đăng ký Service Owner của bạn đang chờ phê duyệt"
                                : "Hồ sơ đăng ký Service Owner của bạn đã bị từ chối"}
                        </p>
                        <p className="text-xs mt-1 text-gray-600 leading-relaxed">
                            {soStatus === "PENDING"
                                ? "Ban quản trị đang xem xét thông tin đăng ký của bạn. Bạn sẽ có quyền truy cập vào các tính năng dành cho Studio/SO ngay sau khi được duyệt."
                                : "Rất tiếc, hồ sơ của bạn chưa đạt yêu cầu hệ thống. Bạn có thể kiểm tra lại thông tin, cập nhật ảnh CCCD hoặc liên hệ Admin để được trợ giúp."}
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* THÔNG TIN CƠ BẢN */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-gray-900">
                        <User className="w-5 h-5 text-pink-500" />
                        <h3 className="font-bold text-lg">Thông Tin Cơ Bản</h3>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-pink-100 text-[#ec4899] flex items-center justify-center font-bold text-4xl shadow-inner shrink-0">
                            {displayName.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                            <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
                                Đổi ảnh đại diện
                            </button>
                            <p className="text-xs text-gray-400 mt-2">Dung lượng tối đa 2MB, định dạng JPG/PNG.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Không thể đổi)</label>
                            <input type="email" defaultValue={user?.email || ""} disabled className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                                <option value="0">Chưa xác định</option>
                                <option value="1">Nam</option>
                                <option value="2">Nữ</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                        </div>
                    </div>
                </div>

                {/* THÔNG TIN CỬA HÀNG (CHỈ HIỂN THỊ NẾU LÀ SO) */}
                {isSO && (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-gray-900">
                                <Settings className="w-5 h-5 text-pink-500" />
                                <h3 className="font-bold text-lg">Hồ Sơ Cửa Hàng / Studio</h3>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${soStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                <ShieldCheck className="w-3.5 h-3.5" />
                                {soStatus === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiểu sử (Bio)</label>
                                <textarea 
                                    value={bio} onChange={(e) => setBio(e.target.value)} 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[100px]" 
                                    placeholder="Giới thiệu phong cách makeup của tiệm..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Số năm kinh nghiệm</label>
                                <input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><ImageIcon className="w-4 h-4 text-gray-400"/> Mặt trước CMND (URL)</label>
                                <input type="text" value={identityFront} onChange={(e) => setIdentityFront(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><ImageIcon className="w-4 h-4 text-gray-400"/> Mặt sau CMND (URL)</label>
                                <input type="text" value={identityBack} onChange={(e) => setIdentityBack(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* NÚT LƯU CHUNG */}
                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-[#ec4899] hover:bg-pink-600 text-white font-bold rounded-full text-sm transition-all shadow-md shadow-pink-200 flex items-center">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Lưu Hồ Sơ
                    </button>
                </div>
            </div>
        </div>
    );
}