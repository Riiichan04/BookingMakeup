"use client";

import { CalendarClock } from "lucide-react";

export default function BookingsPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Lịch Hẹn Của Tôi</h2>
                <p className="text-gray-500 text-sm">Quản lý và theo dõi các đơn đặt lịch của bạn.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <CalendarClock className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Chưa có lịch hẹn nào...</p>
            </div>
        </div>
    );
}