"use client";

import { useAuth } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import CustomerDashboard from "@/components/dashboard/customer-dashboard";
import SoDashboard from "@/components/dashboard/so-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
        <p className="text-gray-400 text-sm">Đang tải thông tin bảng điều khiển...</p>
      </div>
    );
  }

  // Get current active role from search parameters or fallback to DB role
  // user.role is USER (0) or ADMIN (1)
  const dbRole = String(user.role) === "ADMIN" || user.role === 1 ? "admin" : "customer";
  const activeRole = searchParams.get("role") || dbRole;

  switch (activeRole) {
    case "so":
      return <SoDashboard userId={user.id} />;
    case "admin":
      return <AdminDashboard />;
    case "customer":
    default:
      return <CustomerDashboard />;
  }
}
