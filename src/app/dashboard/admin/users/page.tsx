"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user-service";
import { UserDto } from "@/types/user";
import { toast } from "sonner";
import { Loader2, Shield, User, ToggleLeft, ToggleRight, Search, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Không thể tải danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        setUpdatingId(id);
        try {
            await userService.updateUserStatus(id, !currentStatus);
            setUsers(prev =>
                prev.map(u => (u.id === id ? { ...u, isActive: !currentStatus } : u))
            );
            toast.success("Cập nhật trạng thái tài khoản thành công.");
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái tài khoản.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleChangeRole = async (id: string, newRole: string) => {
        setUpdatingId(id);
        try {
            await userService.updateUserRole(id, newRole);
            setUsers(prev =>
                prev.map(u => (u.id === id ? { ...u, role: newRole as any } : u))
            );
            toast.success(`Cập nhật vai trò người dùng sang ${newRole} thành công.`);
        } catch (error) {
            toast.error("Lỗi khi cập nhật vai trò người dùng.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(u => {
        const query = searchTerm.toLowerCase();
        return (
            u.username.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            (u.displayName && u.displayName.toLowerCase().includes(query))
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Quản Lý Người Dùng</h2>
                    <p className="text-gray-500 text-sm">Xem thông tin, phân quyền và kích hoạt/khóa tài khoản người dùng.</p>
                </div>
                <Button variant="outline" onClick={fetchUsers} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Làm mới
                </Button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, username, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white shadow-xs"
                />
            </div>

            {/* Bảng danh sách */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Tên hiển thị / Username</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Vai trò (Role)</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                        Không tìm thấy người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            <div>{u.displayName || u.username}</div>
                                            <div className="text-xs font-normal text-gray-400">@{u.username}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const isAdmin = String(u.role).toUpperCase() === "ADMIN" || String(u.role) === "1" || u.role === 1;
                                                return (
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        isAdmin
                                                            ? "bg-red-50 text-red-600 border border-red-100"
                                                            : "bg-blue-50 text-blue-600 border border-blue-100"
                                                    }`}>
                                                        {isAdmin ? (
                                                            <Shield className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <User className="w-3.5 h-3.5" />
                                                        )}
                                                        {isAdmin ? "ADMIN (1)" : "USER (0)"}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                u.isActive 
                                                    ? "bg-green-50 text-green-700 border border-green-100" 
                                                    : "bg-gray-50 text-gray-400 border border-gray-200"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                                                {u.isActive ? "Đã xác thực" : "Chưa xác thực"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                {/* Đổi role dropdown/select */}
                                                <select
                                                    disabled={updatingId === u.id}
                                                    value={(String(u.role).toUpperCase() === "ADMIN" || String(u.role) === "1" || u.role === 1) ? "1" : "0"}
                                                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                                    className="text-xs border border-gray-200 rounded-md p-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                                                >
                                                    <option value="0">USER (0)</option>
                                                    <option value="1">ADMIN (1)</option>
                                                </select>

                                                {/* Nút toggle Active/Inactive */}
                                                <button
                                                    onClick={() => handleToggleStatus(u.id, u.isActive)}
                                                    disabled={updatingId === u.id}
                                                    className={`hover:scale-110 active:scale-95 transition-all text-gray-500 hover:text-pink-500 ${
                                                        updatingId === u.id ? "opacity-50 pointer-events-none" : ""
                                                    }`}
                                                    title={u.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                                >
                                                    {u.isActive ? (
                                                        <ToggleRight className="w-8 h-8 text-pink-500 cursor-pointer" />
                                                    ) : (
                                                        <ToggleLeft className="w-8 h-8 text-gray-300 cursor-pointer" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
