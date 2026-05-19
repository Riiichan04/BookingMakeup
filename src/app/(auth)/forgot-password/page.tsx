"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendVerifySchema, VerifySchema } from "@/schemas/verify-schema";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { VerificationType } from "@/types/verify";
import { requestVerify, resetPassword } from "@/services/verify-service";

export default function ForgotPasswordForm() {
    const sendVerifySchema = SendVerifySchema();
    const verifySchema = VerifySchema();

    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        code: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<{
        email?: string;
        code?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const onStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const validation = sendVerifySchema.safeParse({ email: formData.email });

        if (!validation.success) {
            setErrors({
                email: validation.error.format().email?._errors[0],
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await requestVerify(formData.email, VerificationType.RESET_PASSWORD);

            if (response.result === true) {
                toast.success("Đã gửi mã xác thực", {
                    description: "Vui lòng kiểm tra hộp thư email của bạn.",
                });
                setStep(2);
            } else {
                toast.error("Không thể gửi mã xác thực", {
                    description: "Vui lòng kiểm tra lại email.",
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("Gửi mã thất bại", {
                    description: error.response?.data?.message || "Đã có lỗi xảy ra từ máy chủ",
                });
            } else {
                toast.error("Đã xảy ra lỗi không xác định");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const validation = verifySchema.safeParse({
            code: formData.code,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
        });

        if (!validation.success) {
            const formattedErrors = validation.error.format();
            setErrors({
                code: formattedErrors.code?._errors[0],
                password: formattedErrors.password?._errors[0],
                confirmPassword: formattedErrors.confirmPassword?._errors[0],
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await resetPassword(formData.email, formData.code, formData.password);

            if (response.result === true) {
                toast.success("Đổi mật khẩu thành công", {
                    description: "Hệ thống sẽ chuyển hướng sang trang đăng nhập.",
                });
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                toast.error("Đổi mật khẩu thất bại", {
                    description: "Mã xác thực không đúng hoặc đã hết hạn.",
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("Đổi mật khẩu thất bại", {
                    description: error.response?.data?.message || "Đã có lỗi xảy ra từ máy chủ",
                });
            } else {
                toast.error("Đã xảy ra lỗi không xác định");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="space-y-1 text-center my-8">
                <h1 className="text-2xl font-bold">
                    {step === 1 ? "Quên mật khẩu" : "Tạo mật khẩu mới"}
                </h1>
                <p className="text-gray-500 text-sm">
                    {step === 1
                        ? "Nhập email của bạn để nhận mã xác thực"
                        : "Nhập mã xác thực và mật khẩu mới của bạn"}
                </p>
            </div>

            {step === 1 && (
                <form onSubmit={onStep1Submit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 cursor-pointer"
                        disabled={isLoading}
                        style={{ backgroundColor: "#E4187D" }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang gửi mã...
                            </>
                        ) : (
                            "Nhận mã xác thực"
                        )}
                    </Button>

                    <div className="text-center mt-4">
                        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800 underline inline-flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={onStep2Submit} className="space-y-6">
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Mã xác thực (OTP)</label>
                            <span className="text-xs text-gray-500">Đã gửi tới {formData.email}</span>
                        </div>
                        <Input
                            type="text"
                            name="code"
                            maxLength={6}
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Nhập 6 số..."
                            className={errors.code ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.code && (
                            <p className="text-xs text-destructive mt-1">{errors.code}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Mật khẩu mới</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 cursor-pointer"
                        disabled={isLoading}
                        style={{ backgroundColor: "#E4187D" }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Đổi mật khẩu"
                        )}
                    </Button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-gray-600 hover:text-gray-800 underline"
                        >
                            Đổi email khác
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}