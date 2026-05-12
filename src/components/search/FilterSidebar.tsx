"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const CATEGORIES = [
  "Trang điểm cô dâu",
  "Thời trang / Sự kiện",
  "Tiệc tối",
  "Khóa học",
];

interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const toggleCategory = (cat: string) => {
    const updated = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: updated });
  };

  const clearAll = () => {
    onChange({ categories: [], minPrice: 0, maxPrice: 1000, minRating: 0 });
  };

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-gray-900 text-sm tracking-wide uppercase">
            Bộ LHC
          </span>
          <button
            onClick={clearAll}
            className="text-pink-500 text-xs font-medium hover:underline"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Category filter */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Loại dịch vụ
          </p>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    filters.categories.includes(cat)
                      ? "bg-pink-500 border-pink-500"
                      : "border-gray-300 group-hover:border-pink-400"
                  }`}
                  onClick={() => toggleCategory(cat)}
                >
                  {filters.categories.includes(cat) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                      <path
                        d="M1.5 5l2.5 2.5 4.5-4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price filter */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Loại dịch vụ
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}+</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: Number(e.target.value) })
            }
            className="w-full accent-pink-500"
          />
        </div>

        {/* Rating filter */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Loại dịch vụ
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() =>
                  onChange({
                    ...filters,
                    minRating: filters.minRating === star ? 0 : star,
                  })
                }
              >
                <Star
                  size={18}
                  className={
                    star <= filters.minRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              </button>
            ))}
            <span className="text-xs text-gray-500 ml-1">trở lên</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
