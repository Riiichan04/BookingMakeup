"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { MakeupService } from "@/types/service";
import { createBooking, getBookingsByArtist } from "@/lib/api/booking";
import { generatePaymentUrl } from "@/services/payment-service";
import Image from "next/image";
import { getServiceDetail } from "@/services/artist-service";
import { ServiceDetailResponse } from "@/types/artist";

// Helpers

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

// Tạo danh sách khung giờ theo bước 30 phút từ 7:00 → 20:30
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h <= 20; h++) {
    slots.push(`${pad(h)}:00:00`);
    if (h < 20 || true) slots.push(`${pad(h)}:30:00`);
  }
  return slots.filter((_, i) => i < 28); // 7:00 → 20:30
}

const TIME_SLOTS = generateTimeSlots();

// Tháng VN
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

// Calendar mini

function MiniCalendar({
  selected,
  onSelect,
  bookedDates,
}: {
  selected: string | null;
  onSelect: (d: string) => void;
  bookedDates: Set<string>;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);

  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay === 0 ? 6 : firstDay - 1).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* Header tháng */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={navBtnStyle}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
          {MONTH_NAMES[viewMonth - 1]} {viewYear}
        </span>
        <button onClick={nextMonth} style={navBtnStyle}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Ngày trong tuần */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#9ca3af", padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Ngày */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = isoDate(viewYear, viewMonth, day);
          const isToday = dateStr === isoDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
          const isPast = new Date(viewYear, viewMonth - 1, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isSelected = dateStr === selected;
          const isBooked = bookedDates.has(dateStr);

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => !isPast && onSelect(dateStr)}
              style={{
                width: "100%", aspectRatio: "1", borderRadius: 8,
                border: isSelected ? "2px solid #ec4899" : isToday ? "2px solid #f9a8d4" : "none",
                background: isSelected ? "#ec4899" : isBooked ? "#fef2f2" : "transparent",
                color: isSelected ? "#fff" : isPast ? "#d1d5db" : isBooked ? "#f87171" : "#111827",
                fontSize: 13, fontWeight: isSelected || isToday ? 700 : 400,
                cursor: isPast ? "not-allowed" : "pointer",
                position: "relative",
              }}
            >
              {day}
              {isBooked && !isSelected && (
                <span style={{
                  position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%", background: "#f87171",
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  background: "none", border: "1px solid #e5e7eb", borderRadius: 8,
  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: "#6b7280",
};

// Main Page

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceId = params.serviceId as string;
  const artistId = searchParams.get("artistId") ?? "";

  const [service, setService] = useState<MakeupService | null>(null);

  useEffect(() => {
    if (!serviceId) return;

    getServiceDetail(serviceId).then((res: ServiceDetailResponse | null) => {
      if (res) {
        setService({
          serviceUuid: res.serviceId,
          artistUuid: res.ownerId,
          title: res.name,
          category: res.category || "",
          categoryTag: res.category || "",
          categoryTagColor: "pink",
          artistName: res.ownerName || "",
          artistInitials: res.ownerName ? res.ownerName.charAt(0).toUpperCase() : "A",
          artistColor: "#ec4899",
          rating: res.rating || 0,          
          reviewCount: res.reviewCount || 0, 
          priceFrom: res.price,
          duration: res.duration,
          imageUrl: res.mainThumbnailUrl || "",
          location: res.address || "",      
          description: res.description || ""
        });
      }
    }).catch(err => console.error("Không lấy được thông tin dịch vụ", err));
  }, [serviceId]);
  // Booking state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  // UI state
  const [loading, setLoading] = useState(false);
  const [paymentRedirecting, setPaymentRedirecting] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(!!artistId);
  const [error, setError] = useState<string | null>(null);

  // Load lịch bận của artist
  useEffect(() => {
    if (!artistId) return;
    getBookingsByArtist(artistId)
      .then(bookings => {
        const dates = new Set<string>();
        const slots = new Set<string>();
        bookings
          .filter(b => b.status === "CONFIRMED" || b.status === "PENDING")
          .forEach(b => {
            dates.add(b.bookingDate);
            slots.add(`${b.bookingDate}_${b.startTime}`);
          });
        setBookedDates(dates);
        setBookedSlots(slots);
      })
      .catch(() => { /* không block UI nếu lỗi */ })
      .finally(() => setLoadingSchedule(false));
  }, [artistId]);

  const isSlotBooked = useCallback((time: string) => {
    if (!selectedDate) return false;
    return bookedSlots.has(`${selectedDate}_${time}`);
  }, [selectedDate, bookedSlots]);

  // Tính giá
  const basePrice = service?.priceFrom ?? 0;
  const depositAmount = Math.round(basePrice * 0.55);

  // Submit booking & Payment
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Vui lòng chọn ngày và giờ.");
      return;
    }

    // Kiểm tra đăng nhập
    const raw = typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
    if (!raw) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const booking = await createBooking({
        serviceId,
        ownerId: artistId, //TODO: Fix this to real artist in service or keep using service owner
        bookingDate: selectedDate,
        startTime: selectedTime,
        promoCode: promoCode.trim() || undefined,
      });

      setPaymentRedirecting(true);
      const payRes = await generatePaymentUrl(booking.id);

      if (payRes.code === "00" && payRes.data) {
        // 3. ĐÁ KHÁCH SANG TRANG VNPAY NGAY VÀ LUÔN!
        window.location.href = payRes.data;
      } else {
        setError(payRes.message || "Lỗi tạo link thanh toán. Vui lòng thử lại.");
        setLoading(false);
        setPaymentRedirecting(false);
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: string } })?.response?.data ?? "Đặt lịch thất bại. Vui lòng thử lại.";
      console.log(e)
      setError(typeof msg === "string" ? msg : "Đặt lịch thất bại.");
      setLoading(false);
      setPaymentRedirecting(false);
    }
  };

  // Form screen
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "var(--font-sans, sans-serif)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>

        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: "none",
            border: "none", color: "#6b7280", cursor: "pointer", fontSize: 14,
            fontWeight: 500, marginBottom: 24, padding: 0,
          }}
        >
          <ChevronLeft size={18} /> Quay lại
        </button>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 28, marginTop: 0 }}>
          Đặt lịch dịch vụ
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "flex-start" }}>

          {/* ── Left: form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Service info */}
            {service && (
              <SectionCard title="Thông tin dịch vụ">
                <div style={{ display: "flex", gap: 16 }}>
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    width={96}
                    height={96}
                    unoptimized
                    style={{ borderRadius: 12, objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#111827" }}>
                      {service.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: service.artistColor, color: "#fff",
                        fontSize: 10, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {service.artistInitials}
                      </div>
                      <span style={{ fontSize: 13, color: "#6b7280" }}>{service.artistName}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} style={{
                          color: "#f59e0b",
                          fill: i < Math.round(service.rating) ? "#f59e0b" : "#e5e7eb",
                        }} />
                      ))}
                      <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 2 }}>
                        ({service.reviewCount})
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {service.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
                          <MapPin size={12} /> {service.location}
                        </span>
                      )}
                      {service.duration && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
                          <Clock size={12} /> {service.duration} phút
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {service.description && (
                  <p style={{ margin: "12px 0 0", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                    {service.description}
                  </p>
                )}
              </SectionCard>
            )}

            {/* Chọn ngày */}
            <SectionCard title="Chọn ngày" icon={<Calendar size={16} style={{ color: "#ec4899" }} />}>
              {loadingSchedule ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9ca3af", fontSize: 13 }}>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Đang tải lịch thợ trang điểm...
                  <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
                </div>
              ) : (
                <MiniCalendar
                  selected={selectedDate}
                  onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                  bookedDates={bookedDates}
                />
              )}
            </SectionCard>

            {/* Chọn giờ */}
            <SectionCard title="Chọn giờ bắt đầu" icon={<Clock size={16} style={{ color: "#ec4899" }} />}>
              {!selectedDate ? (
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Chọn ngày trước để xem khung giờ</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {TIME_SLOTS.map(slot => {
                    const booked = isSlotBooked(slot);
                    const active = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        onClick={() => !booked && setSelectedTime(slot)}
                        style={{
                          padding: "8px 0", borderRadius: 10, fontSize: 13, fontWeight: 500,
                          border: active ? "2px solid #ec4899" : "1.5px solid #e5e7eb",
                          background: active ? "#ec4899" : booked ? "#f3f4f6" : "#fff",
                          color: active ? "#fff" : booked ? "#d1d5db" : "#374151",
                          cursor: booked ? "not-allowed" : "pointer",
                          textDecoration: booked ? "line-through" : "none",
                        }}
                      >
                        {slot.slice(0, 5)}
                      </button>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            {/* Mã giảm giá */}
            <SectionCard title="Mã giảm giá" icon={<Tag size={16} style={{ color: "#ec4899" }} />}>
              <div style={{
                display: "flex", gap: 10,
                border: "1.5px solid #e5e7eb", borderRadius: 12,
                overflow: "hidden",
              }}>
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá (nếu có)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1, border: "none", outline: "none",
                    padding: "12px 16px", fontSize: 14, color: "#374151",
                    background: "transparent",
                  }}
                />
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "8px 0 0" }}>
                Mã giảm giá sẽ được áp dụng tự động khi đặt lịch
              </p>
            </SectionCard>

          </div>

          {/* ── Right: summary + submit ── */}
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{
              background: "#fff", borderRadius: 20, padding: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Tóm tắt đặt lịch
              </h3>

              {/* Dịch vụ */}
              {service && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    {service.title}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                    {service.artistName}
                    {service.duration ? ` · ${service.duration} phút` : ""}
                  </p>
                </div>
              )}

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginBottom: 16 }}>
                {/* Ngày giờ */}
                <SummaryRow
                  icon={<Calendar size={14} />}
                  label="Ngày"
                  value={selectedDate ? selectedDate.split("-").reverse().join("-") : "Chưa chọn"}
                  empty={!selectedDate}
                />
                <SummaryRow
                  icon={<Clock size={14} />}
                  label="Giờ"
                  value={selectedTime ? selectedTime.slice(0, 5) : "Chưa chọn"}
                  empty={!selectedTime}
                />
                {promoCode && (
                  <SummaryRow
                    icon={<Tag size={14} />}
                    label="Mã KM"
                    value={promoCode}
                  />
                )}
              </div>

              {/* Giá */}
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>Giá dịch vụ</span>
                  <span style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{formatVND(basePrice)}</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 12,
                  paddingTop: 12, borderTop: "1px dashed #f0f0f0",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Tổng thanh toán</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{formatVND(basePrice)}</span>
                </div>
                <div style={{
                  background: "#fdf2f8", borderRadius: 10, padding: "10px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: 13, color: "#be185d", fontWeight: 600 }}>Đặt cọc ngay (55%)</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#ec4899" }}>{formatVND(depositAmount)}</span>
                </div>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "8px 0 0" }}>
                  Số còn lại ({formatVND(basePrice - depositAmount)}) thanh toán sau khi hoàn thành dịch vụ
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  background: "#fef2f2", borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                }}>
                  <AlertCircle size={16} style={{ color: "#dc2626", flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>{error}</p>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleSubmit}
                disabled={loading || !selectedDate || !selectedTime}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 14,
                  border: "none",
                  background: loading || !selectedDate || !selectedTime ? "#f3f4f6" : "#ec4899",
                  color: loading || !selectedDate || !selectedTime ? "#9ca3af" : "#fff",
                  fontSize: 15, fontWeight: 700,
                  cursor: loading || !selectedDate || !selectedTime ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                    {paymentRedirecting ? "Đang chuyển hướng VNPay..." : "Đang xử lý..."}
                  </>
                ) : (
                  <>
                    <User size={16} />
                    Xác nhận đặt lịch & Thanh toán
                  </>
                )}
              </button>

              <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
                Bạn sẽ thanh toán đặt cọc trên cổng VNPay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 24,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      border: "1px solid #f0f0f0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {icon}
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({
  icon, label, value, empty,
}: {
  icon: React.ReactNode; label: string; value: string; empty?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{ color: "#9ca3af", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "#6b7280", flex: 1 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: empty ? "#d1d5db" : "#111827" }}>{value}</span>
    </div>
  );
}