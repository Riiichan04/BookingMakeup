"use client";

import { useRef, useState } from "react";
import { FileImage, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadIdentityImage } from "@/services/upload-service";
import { toast } from "sonner";

interface IdentityImageUploadProps {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    side: "front" | "back";
    error?: string;
}

export default function IdentityImageUpload({
    label,
    value,
    onChange,
    side,
    error,
}: IdentityImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const secureUrl = await uploadIdentityImage(file, side);
            onChange(secureUrl);
            toast.success("Tải ảnh lên thành công");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Upload ảnh thất bại";
            toast.error(message);
        } finally {
            setIsUploading(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const handleRemove = () => {
        onChange("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
                <FileImage className="w-4 h-4 text-gray-400" />
                {label}
            </label>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
            />

            {value ? (
                <div className="space-y-2">
                    <div className="relative h-36 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img src={value} alt={label} className="h-full w-full object-contain" />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white/90 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors"
                            aria-label="Xóa ảnh"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full cursor-pointer"
                        onClick={() => inputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang tải lên...
                            </>
                        ) : (
                            "Chọn ảnh khác"
                        )}
                    </Button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className={`w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 text-sm transition-colors cursor-pointer ${
                        error
                            ? "border-red-300 bg-red-50/50 text-red-500"
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-pink-300 hover:bg-pink-50/50 hover:text-[#E4187D]"
                    }`}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Đang tải lên cloud...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="w-6 h-6" />
                            <span>Nhấn để chọn ảnh</span>
                            <span className="text-xs text-gray-400">JPG, PNG, WEBP · tối đa 5MB</span>
                        </>
                    )}
                </button>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
