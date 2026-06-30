"use client";

import { useAuth } from "@/contexts/auth-context";

// This is static temporary file
export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl">
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Hồ Sơ Cá Nhân</h2>
                <p className="text-gray-500 text-sm">Quản lý thông tin cá nhân và bảo mật tài khoản.</p>
            </div>

            <div className="bg-whitep-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-pink-100 text-[#ec4899] flex items-center justify-center font-bold text-4xl shadow-inner shrink-0">
                        {user?.displayName?.charAt(0).toUpperCase() || "U"}
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
                        <input
                            type="text"
                            defaultValue={user?.displayName || ""}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            defaultValue={user?.email || ""}
                            disabled
                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button className="px-6 py-3 bg-[#ec4899] hover:bg-pink-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-pink-200">
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}