"use client";

import { useState } from "react";
import { artistService } from "@/services/artist-service";
import { Loader2, UploadCloud, X } from "lucide-react"; 
// SỬA ĐƯỜNG DẪN NÀY LẠI CHO KHỚP VỚI NƠI BẠN LƯU FILE UPLOAD NHÉ!
import { uploadArtistImage } from "@/services/upload-service"; 

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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Xử lý khi chọn file ảnh: CỰC KỲ NGẮN GỌN NHỜ VÀO HÀM DÙNG CHUNG
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");

      // Gọi hàm xịn xò mà bạn vừa cấu hình để xin chữ ký và up ảnh
      const secureUrl = await uploadArtistImage(file);
      
      // Thành công thì lưu link ảnh vào State form
      setFormData({ ...formData, portfolioImages: secureUrl });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Không thể upload ảnh, vui lòng kiểm tra mạng.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await artistService.createArtist(formData);
      setFormData({ artistName: "", specialization: "", portfolioImages: "" });
      onSuccess(); 
      onClose(); 
    } catch (err: unknown) { 
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra khi thêm thợ!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Thêm Artist Mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* KHU VỰC UPLOAD ẢNH (Drag & Drop UI) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Avatar (Tùy chọn)</label>
            
            {/* Hiển thị Preview nếu đã upload xong */}
            {formData.portfolioImages ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={formData.portfolioImages} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, portfolioImages: "" })}
                  className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-80"
                  title="Xóa ảnh"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              /* Nút chọn ảnh */
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition relative overflow-hidden ${isUploading ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                      <p className="text-sm text-gray-500 font-medium">Đang tải ảnh lên...</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 font-medium"><span className="text-pink-600">Bấm để tải ảnh lên</span></p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG tối đa 5MB</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  onChange={handleImageUpload}
                  disabled={isUploading || loading}
                />
              </label>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
              disabled={loading || isUploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 font-medium transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || isUploading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</>
              ) : "Xác nhận thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}