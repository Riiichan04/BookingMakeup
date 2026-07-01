"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, MapPin, Loader2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { searchServices } from "@/lib/api/search";
import { MakeupService, SearchResponse } from "@/types/service";
import { useSearchParams, useRouter } from "next/navigation";

// constants
const CATEGORIES = ["Trang điểm cô dâu", "Thời trang / Sự kiện", "Tiệc tối", "Khóa học"];
const SORT_OPTIONS = [
    { value: "suggested", label: "Gợi ý" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "price_asc", label: "Giá thấp → cao" },
    { value: "price_desc", label: "Giá cao → thấp" },
];

// ServiceCard
function ServiceCard({ service }: { service: MakeupService }) {
    return (
        <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-shadow duration-200">
            {/* Image */}
            <div className="relative h-50 overflow-hidden shrink-0">
                <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover block"
                />
            </div>

            {/* Body */}
            <div className="p-3.5 px-4 pb-4 flex flex-col gap-2 flex-1">
                {/* Artist */}
                <div className="flex items-center gap-2">
                    <div
                        style={{ background: service.artistColor }}
                        className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                    >
                        {service.artistInitials}
                    </div>
                    <span className="text-[13px] text-gray-500">{service.artistName}</span>
                </div>

                {/* Title */}
                <h3
                    className="truncate text-[15px] font-bold text-gray-900 leading-snug m-0 line-clamp-2"
                    title={service.title}
                >
                    {service.title}
                </h3>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={13}
                            className={`${i < Math.round(service.rating) ? "text-amber-500 fill-amber-500" : "text-gray-200 fill-gray-200"}`}
                        />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                        ({service.reviewCount} đánh giá)
                    </span>
                </div>

                {/* Price + CTA */}
                <div className="flex flex-col mt-4">
                    <div className="text-[11px] text-gray-400">Giá từ</div>
                    <div className="flex justify-between items-center">
                        <div className="text-base font-extrabold text-pink-500">
                            {new Intl.NumberFormat("vi-VN").format(service.priceFrom)} VND
                        </div>
                        <button
                            className="bg-[#E4187D] hover:bg-[#c9126b] text-white border-none rounded-xl px-4 py-2 text-[13px] font-semibold cursor-pointer"
                            onClick={() => window.location.href = `/services/${service.serviceUuid}`}
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main Page
interface FilterState {
    categories: string[];
    maxPrice: number;
    minRating: number;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialKeyword = searchParams.get("keyword") || "";
    const initialLocation = searchParams.get("location") || "";

    const [keyword, setKeyword] = useState(initialKeyword);
    const [location, setLocation] = useState(initialLocation);
    const [sortBy, setSortBy] = useState("suggested");
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterState>({ categories: [], maxPrice: 1000000, minRating: 0 });

    const [searchedKeyword, setSearchedKeyword] = useState(initialKeyword);

    const [result, setResult] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const doSearch = useCallback(async (
        kw: string, loc: string, f: FilterState, sort: string, pg: number
    ) => {
        setLoading(true);
        setError(null);
        setSearchedKeyword(kw);

        // Cập nhật thanh URL để khi người dùng reload trang không bị mất kết quả
        const params = new URLSearchParams();
        if (kw) params.set("keyword", kw);
        if (loc) params.set("location", loc);
        // Bạn có thể push thêm các param filter khác lên URL tại đây nếu muốn
        router.push(`?${params.toString()}`, { scroll: false });

        try {
            const data = await searchServices({
                keyword: kw,
                location: loc,
                category: f.categories.length === 1 ? f.categories[0] : undefined,
                maxPrice: f.maxPrice < 1000 ? f.maxPrice : undefined,
                minRating: f.minRating > 0 ? f.minRating : undefined,
                sortBy: sort,
                page: pg,
                pageSize: 6,
            });
            setResult(data);
        } catch {
            setError("Không thể kết nối đến server. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const kwFromUrl = searchParams.get("keyword") || "";
        const locFromUrl = searchParams.get("location") || "";
        setKeyword(kwFromUrl);
        setLocation(locFromUrl);
        setSearchedKeyword(kwFromUrl);
    }, [searchParams]);

    useEffect(() => {
        doSearch(keyword, location, filters, sortBy, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, sortBy, page]);

    const handleSearch = () => { setPage(1); doSearch(keyword, location, filters, sortBy, 1); };
    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

    const toggleCategory = (cat: string) => {
        const updated = filters.categories.includes(cat)
            ? filters.categories.filter(c => c !== cat)
            : [...filters.categories, cat];
        setFilters(f => ({ ...f, categories: updated }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ categories: [], maxPrice: 1000, minRating: 0 });
        setPage(1);
    };

    // pagination pages
    const totalPages = result?.totalPages ?? 1;
    const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto p-10 px-6">

                {/* ── Title ── */}
                <h1 className="text-xl text-gray-900 mb-6 mt-0">
                    {`Kết quả tìm kiếm của từ khóa "`} <span className="font-extrabold">{`${searchedKeyword}"`}</span>
                </h1>

                {/* ── Search bar ── */}
                <div className="flex items-center bg-white border border-gray-200 rounded-full p-2 pl-6 pr-2 shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10 transition-all focus-within:border-pink-300 focus-within:shadow-[0_4px_20px_rgba(236,72,153,0.08)]">
                    {/* Keyword Section */}
                    <div className="flex flex-1 items-center gap-3 pr-4">
                        <Search size={20} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Tìm dịch vụ (VD: Cô dâu, Đi tiệc...)"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full border-none outline-none text-[15px] text-gray-700 placeholder-gray-400 bg-transparent h-10"
                        />
                    </div>

                    {/* Vertical Divider */}
                    <div className="h-6 w-[1.5px] bg-gray-200 shrink-0 mx-2" />

                    {/* Location Section */}
                    <div className="flex items-center gap-2.5 px-4 w-65 shrink-0">
                        <MapPin size={18} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Tại TP. Hồ Chí Minh"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full border-none outline-none text-[15px] text-gray-700 placeholder-gray-400 bg-transparent h-10"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="bg-[#E4187D] hover:bg-[#c9126b] text-white font-bold text-[15px] px-8 h-12 rounded-full cursor-pointer whitespace-nowrap shadow-sm transition-all shrink-0 flex items-center justify-center active:scale-[0.98]"
                    >
                        Tìm kiếm
                    </button>
                </div>

                {/* ── Body: sidebar + results ── */}
                <div className="flex gap-6 items-start">

                    {/* ── Sidebar ── */}
                    <aside className="w-55 shrink-0 bg-white rounded-2xl border border-gray-100 p-5 px-4.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                        {/* header */}
                        <div className="flex justify-between items-center mb-4.5">
                            <span className="text-xs font-extrabold text-gray-900 tracking-wider uppercase">
                                Bộ lọc
                            </span>
                            <button onClick={clearFilters} className="bg-none border-none text-pink-500 text-xs font-semibold cursor-pointer">
                                Xóa tất cả
                            </button>
                        </div>

                        {/* Category */}
                        <div className="mb-5">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 mt-0">
                                Loại dịch vụ
                            </p>
                            <div className="flex flex-col gap-2">
                                {CATEGORIES.map(cat => {
                                    const checked = filters.categories.includes(cat);
                                    return (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                            <div
                                                onClick={() => toggleCategory(cat)}
                                                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 cursor-pointer ${checked ? "bg-pink-500 border-none" : "bg-white border-2 border-gray-300"
                                                    }`}
                                            >
                                                {checked && (
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-[13px] text-gray-700">{cat}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price */}
                        {/* <div className="mb-5">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 mt-0">
                                Khoảng giá
                            </p>
                            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                <span> {new Intl.NumberFormat("vi-VN").format(0)} VND</span>
                                <span>{new Intl.NumberFormat("vi-VN").format(filters.maxPrice)}{filters.maxPrice >= 1000 ? "+" : ""} VND</span>
                            </div>
                            <input
                                type="range" min={0} max={1000000} step={100000}
                                value={filters.maxPrice}
                                onChange={e => { setFilters(f => ({ ...f, maxPrice: Number(e.target.value) })); setPage(1); }}
                                className="w-full accent-pink-500"
                            />
                        </div> */}

                        {/* Rating */}
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 mt-0">
                                Đánh giá
                            </p>
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} onClick={() => { setFilters(f => ({ ...f, minRating: f.minRating === star ? 0 : star })); setPage(1); }}
                                        className="bg-none border-none cursor-pointer p-0.5">
                                        <Star size={18} className={`${star <= filters.minRating ? "text-amber-500 fill-amber-500" : "text-gray-200 fill-gray-200"
                                            }`} />
                                    </button>
                                ))}
                                <span className="text-xs text-gray-400 ml-1">trở lên</span>
                            </div>
                        </div>
                    </aside>

                    {/* ── Results ── */}
                    <div className="flex-1 min-w-0">
                        {/* top bar */}
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm text-gray-500 m-0">
                                {result ? (
                                    <><strong className="text-gray-900">{result.totalCount}</strong> dịch vụ tìm thấy trong khu vực của bạn</>
                                ) : "Đang tải..."}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Sắp xếp theo:
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={e => { setSortBy(e.target.value); setPage(1); }}
                                    className="text-[13px] border-[1.5px] border-gray-200 rounded-10 p-1.5 px-3 outline-none bg-white cursor-pointer"
                                >
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* loading */}
                        {loading && (
                            <div className="flex justify-center py-20">
                                <Loader2 size={36} className="text-pink-500 animate-spin" />
                            </div>
                        )}

                        {/* error */}
                        {error && !loading && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                                <p className="text-red-600 font-semibold m-0 mb-2">{error}</p>
                                <button onClick={handleSearch} className="text-red-600 bg-none border-none cursor-pointer underline text-[13px]">
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {/* empty */}
                        {!loading && !error && result?.services.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-400 text-base">Không tìm thấy dịch vụ phù hợp.</p>
                                <p className="text-gray-400 text-[13px] mt-1">Thử thay đổi từ khóa hoặc bộ lọc.</p>
                            </div>
                        )}

                        {/* grid */}
                        {!loading && !error && result && result.services.length > 0 && (
                            <>
                                <div className="grid grid-cols-3 gap-5">
                                    {result.services.map(s => <ServiceCard key={s.serviceUuid} service={s} />)}
                                </div>

                                {/* pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-10">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className={`w-9 h-9 rounded-full border-[1.5px] border-gray-200 bg-white flex items-center justify-center ${page === 1 ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                                                }`}
                                        >
                                            <ChevronLeft size={16} className="text-gray-500" />
                                        </button>
                                        {pages.map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-9 h-9 rounded-full text-sm flex items-center justify-center cursor-pointer ${p === page
                                                    ? "bg-pink-500 border-none text-white font-bold"
                                                    : "border-[1.5px] border-gray-200 bg-white text-gray-700 font-normal"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className={`w-9 h-9 rounded-full border-[1.5px] border-gray-200 bg-white flex items-center justify-center ${page === totalPages ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                                                }`}
                                        >
                                            <ChevronRight size={16} className="text-gray-500" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}