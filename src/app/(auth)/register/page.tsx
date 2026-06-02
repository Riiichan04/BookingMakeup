"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegisterValues, useRegisterSchema } from "@/schemas/register-schema";
import { toast } from "sonner";
import { useState } from "react";
import { handleRegister } from "@/services/auth-service";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthResponse } from "@/types/auth";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
    const registerSchema = useRegisterSchema();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
    });

    const onSubmit = async (data: RegisterValues) => {
        setIsLoading(true);
        try {
            const response: AuthResponse = await handleRegister(data);
            if (response.result === true) {
                toast.success("Đăng ký thành công", {
                    description: "Hệ thống sẽ chuyển hướng sang trang đăng nhập.",
                });
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                toast.error("Đăng ký thất bại", {
                    description: "Đã có lỗi xảy ra, vui lòng thử lại.",
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMessage = error.response?.data?.message || "Đã có lỗi xảy ra từ máy chủ";

                toast.error("Đăng ký thất bại", {
                    description: serverMessage,
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
                <h1 className="text-2xl font-bold">Đăng ký</h1>
                <p className="text-gray-500 text-sm">Tạo tài khoản mới để tham gia cùng chúng tôi</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Tên người dùng</label>
                    <Input
                        type="text"
                        placeholder="john_doe"
                        {...register("username")}
                        className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.username && (
                        <p className="text-xs text-destructive mt-1">{errors.username.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Mật khẩu</label>
                    </div>
                    <Input
                        type="password"
                        {...register("password")}
                        className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                    <Input
                        type="password"
                        {...register("confirmPassword")}
                        className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="terms"
                            onCheckedChange={(checked) => {
                                setValue("acceptTerms", checked === true, { shouldValidate: true });
                            }}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Tôi đồng ý với các{" "}
                            <Link href="/terms" className="text-primary underline hover:opacity-70">
                                Điều khoản dịch vụ
                            </Link>{" "}
                            và{" "}
                            <Link href="/privacy" className="text-primary underline hover:opacity-70">
                                Chính sách bảo mật
                            </Link>
                        </label>
                    </div>

                    {errors.acceptTerms && (
                        <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
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
                            Đang đăng ký...
                        </>
                    ) : (
                        "Đăng ký"
                    )}
                </Button>
            </form>
        </div>
    );
}