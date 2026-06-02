"use client";

import { useState } from "react";
import { artistService } from "@/services/artist-service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddArtistModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    artistName: "",
    specialization: "",
    portfolioImages: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await artistService.createArtist(formData);
      setFormData({ artistName: "", specialization: "", portfolioImages: "" });
      onSuccess(); 
      onClose(); 
    } catch (err: any) {
      setError(err.response?.data || "Có lỗi xảy ra khi thêm thợ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Thêm Artist Mới</h2>
        
        {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Artist *</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black"
              placeholder="VD: Jennie Kim"
              value={formData.artistName}
              onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên môn *</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black"
              placeholder="VD: Makeup Cô dâu, Tone Tây..."
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh Avatar</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-black"
              placeholder="VD: https://link-anh.com/anh.jpg"
              value={formData.portfolioImages}
              onChange={(e) => setFormData({ ...formData, portfolioImages: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 font-medium transition flex items-center"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Xác nhận thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}