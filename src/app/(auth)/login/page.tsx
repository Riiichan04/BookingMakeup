"use client";

import { loginSchema, LoginValues } from "@/schemas/login-schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { AuthResponse } from "@/types/auth";
import { handleLogin } from "@/services/auth-service";

export default function LoginForm() {
    const formSchema = loginSchema();
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    const [formData, setFormData] = useState<LoginValues>({ email: "", password: "" });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

        const validation = formSchema.safeParse(formData);

        if (!validation.success) {
            const formattedErrors = validation.error.format();
            setErrors({
                email: formattedErrors.email?._errors[0],
                password: formattedErrors.password?._errors[0],
            });
            return;
        }

        setIsLoading(true);
        try {
            const response: AuthResponse = await handleLogin(formData);
            if (response.result === true && response.authDto) {
                login(response.authDto);

                toast.success("Đăng nhập thành công");
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            } else {
                toast.error("Tài khoản hoặc mật khẩu nhập sai");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMessage = "Hãy thử lại sau";
                toast.error("Đăng nhập thất bại", {
                    description: serverMessage,
                });
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="space-y-1 text-center my-8">
                <h1 className="text-2xl font-bold">{"Đăng nhập"}</h1>
                <p className="text-gray-500 text-sm">{"Đăng nhập để tiếp tục cùng chúng tôi"}</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium">{"Email"}</label>
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

                {/* Password Field */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">{"Mật khẩu"}</label>
                        <button type="button" className="cursor-pointer text-xs hover:underline">
                            {"Quên mật khẩu?"}
                        </button>
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

                <Button
                    type="submit"
                    className="w-full mt-4 cursor-pointer"
                    disabled={isLoading}
                    //FIXME: But color pallete into globals.css
                    style={{backgroundColor: "#E4187D"}}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {"Đang đăng nhập"}
                        </>
                    ) : (
                        "Đăng nhập"
                    )}
                </Button>

                <FieldSeparator className="my-4">{"HOẶC"}</FieldSeparator>

                <Button className="w-full my-4 flex cursor-pointer" variant="outline" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                        <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
                    </svg>
                    <span>
                        {"Đăng nhập với Google"}
                    </span>
                </Button>

                <p className="text-center text-sm text-gray-600">
                    Chưa có tài khoản?
                    <Link href="/register" className="ms-1 underline cursor-pointer hover:text-gray-800">
                        Đăng ký
                    </Link>
                </p>
            </form>
        </div>
    );
}