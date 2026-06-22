"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Loader2, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { 
  getAllUsers, 
  updateUserStatus, 
  updateUserRole,
} from "@/lib/api";

import { UserDto } from "@/types/user";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  
  // Users List
  const [users, setUsers] = useState<UserDto[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 1. USER MGT FLOWS
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch {
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (id: string, currentActive: boolean) => {
    setUpdatingUserId(id);
    try {
      await updateUserStatus(id, !currentActive);
      toast.success(currentActive ? "Đã khóa tài khoản người dùng" : "Đã mở khóa tài khoản người dùng");
      fetchUsers();
    } catch (e: any) {
      toast.error(e.response?.data || "Thao tác thất bại");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleUserRole = async (id: string, currentRole: string | number) => {
    setUpdatingUserId(id);
    // UserRole java enum: USER or ADMIN.
    const newRole = currentRole === "ADMIN" || currentRole === 1 ? "USER" : "ADMIN";
    try {
      await updateUserRole(id, newRole);
      toast.success(`Đã thay đổi vai trò tài khoản thành: ${newRole}`);
      fetchUsers();
    } catch (e: any) {
      toast.error(e.response?.data || "Thao tác thất bại");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
          <p className="text-gray-400 text-sm">Đang tải thông tin Admin...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-900">Danh mục quản lý người dùng ({users.length})</h3>
            <p className="text-gray-500 text-xs mt-0.5">Phân quyền, kiểm duyệt hoặc đình chỉ tài khoản người dùng hệ thống.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="p-4 border-b border-gray-100">Tên Đăng Nhập</th>
                  <th className="p-4 border-b border-gray-100">Email</th>
                  <th className="p-4 border-b border-gray-100">Vai Trò</th>
                  <th className="p-4 border-b border-gray-100">Trạng Thái</th>
                  <th className="p-4 border-b border-gray-100 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{u.displayName || u.username}</div>
                      <div className="text-[11px] text-gray-400 font-normal mt-0.5">ID: {u.id}</div>
                    </td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4">
                      <Badge 
                        className={
                          u.role === "ADMIN" || u.role === 1 
                            ? "bg-red-100 text-red-700 hover:bg-red-100 border-none" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100 border-none"
                        }
                      >
                        {u.role === "ADMIN" || u.role === 1 ? "ADMIN" : "USER"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge 
                        className={
                          u.isActive 
                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" 
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"
                        }
                      >
                        {u.isActive ? "Hoạt động" : "Đã khóa"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end items-center">
                        {updatingUserId === u.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#E4187D]" />
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleUserRole(u.id, u.role)}
                              className="text-xs rounded-full border-gray-200 hover:bg-gray-50 cursor-pointer"
                            >
                              {u.role === "ADMIN" || u.role === 1 ? "Hạ USER" : "Lên ADMIN"}
                            </Button>
                            <Button
                              variant={u.isActive ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                              className={`text-xs rounded-full cursor-pointer ${
                                !u.isActive ? "bg-green-600 hover:bg-green-700 text-white" : ""
                              }`}
                            >
                              {u.isActive ? "Khóa" : "Mở Khóa"}
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
