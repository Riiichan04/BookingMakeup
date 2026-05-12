"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { MakeupService } from "@/types/service";

interface ServiceCardProps {
  service: MakeupService;
}

const TAG_COLORS: Record<string, string> = {
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  gold: "bg-amber-500",
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const [liked, setLiked] = useState(false);

  const tagBg = TAG_COLORS[service.categoryTagColor] ?? "bg-gray-500";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 ${tagBg} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}
        >
          {service.categoryTag}
        </span>
        {/* Heart button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <Heart
            size={16}
            className={liked ? "fill-pink-500 text-pink-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Artist */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: service.artistColor }}
          >
            {service.artistInitials}
          </div>
          <span className="text-sm text-gray-500">{service.artistName}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2">
          {service.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(service.rating)
                  ? "fill-amber-400 text-amber-400"
                  : i < service.rating
                  ? "fill-amber-200 text-amber-400"
                  : "text-gray-200 fill-gray-200"
              }
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({service.reviewCount} đánh giá)
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Giá từ</span>
            <p className="text-pink-500 font-bold text-lg">${service.priceFrom}</p>
          </div>
          <button className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
