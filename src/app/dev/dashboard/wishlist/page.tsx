"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, User, Sparkles } from "lucide-react";
import { favouriteService } from "@/services/favourite-service";
import { artistService } from "@/services/artist-service"; 
import { ServiceDto } from "@/types/service";
import { Artist } from "@/types/artist";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
    const [activeTab, setActiveTab] = useState<"services" | "artists">("services");
    
    const [favourites, setFavourites] = useState<ServiceDto[]>([]);
    const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Tải song song cả 2 danh sách để tối ưu tốc độ
                const [favData, followData] = await Promise.all([
                    favouriteService.getFavourites().catch(() => []),
                    artistService.getFollowedArtists().catch(() => []) // Nhớ chắc chắn BE có API này nhé!
                ]);
                setFavourites(favData);
                setFollowedArtists(followData);
            } catch (error) {
                toast.error("Không thể tải danh sách yêu thích");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleRemoveFav = async (serviceId: string) => {
        try {
            await favouriteService.removeFavourite(serviceId);
            setFavourites(prev => prev.filter(f => f.id !== serviceId));
            toast.success("Đã xóa khỏi danh sách.");
        } catch (error) {
            toast.error("Lỗi xóa dịch vụ");
        }
    };

    const handleUnfollow = async (artistId: string) => {
        try {
            await artistService.toggleFollow(artistId);
            setFollowedArtists(prev => prev.filter(a => a.id !== artistId));
            toast.success("Đã bỏ theo dõi Artist.");
        } catch (error) {
            toast.error("Lỗi bỏ theo dõi");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Danh Sách Yêu Thích</h2>
                <p className="text-gray-500 text-sm">Lưu lại những dịch vụ hoặc chuyên gia bạn quan tâm nhất.</p>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex gap-4 border-b border-gray-100 mb-6">
                <button
                    onClick={() => setActiveTab("services")}
                    className={`pb-3 px-2 font-semibold transition-all border-b-2 text-sm flex items-center gap-2 ${
                        activeTab === "services" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <Sparkles className="w-4 h-4" /> Dịch Vụ Đã Thích ({favourites.length})
                </button>
                <button
                    onClick={() => setActiveTab("artists")}
                    className={`pb-3 px-2 font-semibold transition-all border-b-2 text-sm flex items-center gap-2 ${
                        activeTab === "artists" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <User className="w-4 h-4" /> Artist Theo Dõi ({followedArtists.length})
                </button>
            </div>

            {/* LOADING STATE */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-500" /></div>
            ) : (
                <>
                    {/* TAB: SERVICES */}
                    {activeTab === "services" && (
                        favourites.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">Bạn chưa thả tim dịch vụ nào.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favourites.map(svc => (
                                    <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-40 bg-gray-100 relative">
                                            <Image src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600" alt={svc.name} fill className="object-cover" unoptimized/>
                                            <button 
                                                onClick={() => handleRemoveFav(svc.id)} 
                                                className="absolute top-3 right-3 bg-white p-2 rounded-full text-pink-500 shadow-md hover:scale-110 transition-transform cursor-pointer"
                                            >
                                                <Heart className="w-4 h-4 fill-current" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <Link href={`/services/${svc.id}`} className="font-bold text-gray-900 truncate hover:text-pink-600 transition-colors block">
                                                {svc.name}
                                            </Link>
                                            <p className="text-pink-600 font-extrabold mt-2">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(svc.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* TAB: ARTISTS */}
                    {activeTab === "artists" && (
                        followedArtists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                                <User className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">Bạn chưa theo dõi chuyên viên nào.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {followedArtists.map((artist) => (
                                    <div key={artist.id} className="bg-white p-5 rounded-2xl border border-gray-100 text-center shadow-sm relative hover:shadow-md transition-shadow">
                                        <button 
                                            onClick={() => handleUnfollow(artist.id)} 
                                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                            title="Bỏ theo dõi"
                                        >
                                            <Heart className="w-4 h-4 fill-current text-pink-500" />
                                        </button>
                                        
                                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 border-2 border-pink-100 overflow-hidden mb-3 relative">
                                            <Image src={artist.portfolioImages || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200'} alt={artist.artistName || "Artist"} fill className="object-cover" unoptimized />
                                        </div>
                                        <h4 className="font-bold text-gray-900 truncate">{artist.artistName}</h4>
                                        <p className="text-xs text-gray-500 truncate mt-1">{artist.specialization || "Chuyên gia Makeup"}</p>
                                        
                                        <Link href={`/artists/${artist.id}`}>
                                            <button className="w-full mt-4 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-xl py-2 text-xs font-bold transition-colors">
                                                Xem hồ sơ
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}