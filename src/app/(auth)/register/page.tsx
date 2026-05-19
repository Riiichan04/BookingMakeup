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

export default function RegisterForm() {
    const registerSchema = useRegisterSchema();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterValues>({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });
    const [errors, setErrors] = useState<{
        email?: string;
        username?: string;
        password?: string;
        confirmPassword?: string;
        acceptTerms?: string;
    }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const validation = registerSchema.safeParse(formData);

        if (!validation.success) {
            const formattedErrors = validation.error.format();
            setErrors({
                email: formattedErrors.email?._errors[0],
                username: formattedErrors.username?._errors[0],
                password: formattedErrors.password?._errors[0],
                confirmPassword: formattedErrors.confirmPassword?._errors[0],
                acceptTerms: formattedErrors.acceptTerms?._errors[0],
            });
            return;
        }

        setIsLoading(true);
        try {
            const response: AuthResponse = await handleRegister(formData);
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

            <form onSubmit={onSubmit} className="space-y-6">
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

                <div className="space-y-1">
                    <label className="text-sm font-medium">Tên người dùng</label>
                    <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="john_doe"
                        className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.username && (
                        <p className="text-xs text-destructive mt-1">{errors.username}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Mật khẩu</label>
                    </div>
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
                    <label className="text-sm font-medium">Xác nhận mật khẩu</label>
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

                <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="terms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) => {
                                setFormData((prev) => ({ ...prev, acceptTerms: checked === true }));
                                if (errors.acceptTerms) {
                                    setErrors((prev) => ({ ...prev, acceptTerms: undefined }));
                                }
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
                        <p className="text-xs text-destructive">{errors.acceptTerms}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 cursor-pointer"
                    disabled={isLoading}
                    style={{backgroundColor: "#E4187D"}}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        "Đăng ký"
                    )}
                </Button>
            </form>
        </div>
    );
}