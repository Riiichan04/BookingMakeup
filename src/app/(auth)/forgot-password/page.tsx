"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendVerifySchema, VerifySchema, VerifyValues } from "@/schemas/verify-schema";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { VerificationType } from "@/types/verify";
import { requestVerify, resetPassword } from "@/services/verify-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ForgotPasswordForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [savedEmail, setSavedEmail] = useState(""); 
    const router = useRouter();

    const step1Form = useForm<{ email: string }>({
        resolver: zodResolver(SendVerifySchema()),
        defaultValues: { email: "" }
    });

    const step2Form = useForm<VerifyValues>({
        resolver: zodResolver(VerifySchema()),
        defaultValues: {
            code: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onStep1Submit = async (data: { email: string }) => {
        setIsLoading(true);
        try {
            const response = await requestVerify(data.email, VerificationType.RESET_PASSWORD);

            if (response.result === true) {
                toast.success("Đã gửi mã xác thực", {
                    description: "Vui lòng kiểm tra hộp thư email của bạn.",
                });
                setSavedEmail(data.email);
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

    const onStep2Submit = async (data: VerifyValues) => {
        setIsLoading(true);
        try {
            const response = await resetPassword(savedEmail, data.code, data.password);

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
                <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            {...step1Form.register("email")}
                            className={step1Form.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {step1Form.formState.errors.email && (
                            <p className="text-xs text-red-500 mt-1">{step1Form.formState.errors.email.message}</p>
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
                <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Mã xác thực (OTP)</label>
                            <span className="text-xs text-gray-500">Đã gửi tới {savedEmail}</span>
                        </div>
                        <Input
                            type="text"
                            maxLength={6}
                            placeholder="Nhập 6 số..."
                            {...step2Form.register("code")}
                            className={step2Form.formState.errors.code ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {step2Form.formState.errors.code && (
                            <p className="text-xs text-destructive mt-1">{step2Form.formState.errors.code.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Mật khẩu mới</label>
                        <Input
                            type="password"
                            {...step2Form.register("password")}
                            className={step2Form.formState.errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {step2Form.formState.errors.password && (
                            <p className="text-xs text-red-500 mt-1">{step2Form.formState.errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                        <Input
                            type="password"
                            {...step2Form.register("confirmPassword")}
                            className={step2Form.formState.errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {step2Form.formState.errors.confirmPassword && (
                            <p className="text-xs text-destructive mt-1">{step2Form.formState.errors.confirmPassword.message}</p>
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
                            onClick={() => {
                                setStep(1);
                                step2Form.reset();
                            }}
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