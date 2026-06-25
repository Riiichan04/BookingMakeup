"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, ArrowRight, Loader2, Store, UserCircle } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    RegisterServiceOwnerValues,
    useRegisterServiceOwnerSchema,
} from "@/schemas/register-service-owner-schema";
import { handleServiceOwnerRegister } from "@/services/service-owner-service";
import { useAuth } from "@/contexts/auth-context";
import IdentityImageUpload from "@/components/identity-image-upload";

const STEPS = [
    { id: 1, label: "Tài khoản", icon: UserCircle },
    { id: 2, label: "Hồ sơ Service Owner", icon: Store },
] as const;

const ACCOUNT_FIELDS = ["email", "username", "password", "confirmPassword", "acceptTerms"] as const;

export default function RegisterServiceOwnerPage() {
    const serviceOwnerSchema = useRegisterServiceOwnerSchema();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<RegisterServiceOwnerValues>({
        resolver: zodResolver(serviceOwnerSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
            bio: "",
            experienceYears: 1,
            showcaseType: "STANDARD",
            identityFront: "",
            identityBack: "",
        },
    });

    const showcaseType = watch("showcaseType");
    const identityFront = watch("identityFront");
    const identityBack = watch("identityBack");

    const handleNextStep = async () => {
        const valid = await trigger([...ACCOUNT_FIELDS]);
        if (valid) setStep(2);
    };

    const onSubmit = async (data: RegisterServiceOwnerValues) => {
        setIsLoading(true);
        try {
            const authDto = await handleServiceOwnerRegister(data);

            login(authDto);

            toast.success("Đăng ký Service Owner thành công!", {
                description:
                    "Bạn có thể thêm artist và dịch vụ makeup tại bảng điều khiển.",
            });

            router.push("/dashboard?role=so");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMessage =
                    error.response?.data?.message ||
                    (typeof error.response?.data === "string" ? error.response.data : null) ||
                    "Đã có lỗi xảy ra từ máy chủ";

                toast.error("Đăng ký Service Owner thất bại", {
                    description: serverMessage,
                });
            } else if (error instanceof Error) {
                toast.error("Đăng ký Service Owner thất bại", {
                    description: error.message,
                });
            } else {
                toast.error("Đã xảy ra lỗi không xác định");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto pb-10">
            <div className="space-y-1 text-center my-4 sm:my-6">
                <h1 className="text-2xl font-bold">Đăng ký Service Owner</h1>
                <p className="text-gray-500 text-sm">
                    Dành cho chuyên viên makeup hoặc studio — tạo hồ sơ để đăng dịch vụ trên BookingMakeup
                </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-8">
                {STEPS.map(({ id, label, icon: Icon }) => (
                    <div key={id} className="flex items-center gap-2">
                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                step === id
                                    ? "bg-[#E4187D] text-white"
                                    : step > id
                                      ? "bg-pink-100 text-[#E4187D]"
                                      : "bg-gray-100 text-gray-400"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                            <span className="sm:hidden">{id}</span>
                        </div>
                        {id < STEPS.length && (
                            <div className={`w-8 h-0.5 ${step > id ? "bg-[#E4187D]" : "bg-gray-200"}`} />
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {step === 1 && (
                    <>
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
                                placeholder="ten_service_owner"
                                {...register("username")}
                                className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.username && (
                                <p className="text-xs text-destructive mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Mật khẩu</label>
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
                                    <Link href="/terms-of-service" className="text-primary underline hover:opacity-70">
                                        Điều khoản dịch vụ
                                    </Link>{" "}
                                    và{" "}
                                    <Link href="/privacy-policy" className="text-primary underline hover:opacity-70">
                                        Chính sách bảo mật
                                    </Link>
                                </label>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
                            )}
                        </div>

                        <Button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full mt-2 cursor-pointer"
                            style={{ backgroundColor: "#E4187D" }}
                        >
                            Tiếp tục
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="rounded-lg bg-pink-50 border border-pink-100 px-4 py-3 text-sm text-gray-600">
                            Service Owner có thể là <strong>một artist độc lập</strong> hoặc{" "}
                            <strong>một studio</strong>. Bạn sẽ thêm artist và dịch vụ sau khi hoàn tất đăng ký.
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tiểu sử (Bio)</label>
                            <Textarea
                                placeholder="Giới thiệu phong cách trang điểm, thế mạnh của bạn hoặc studio..."
                                spellCheck={false}
                                {...register("bio")}
                                className={`min-h-[100px] ${errors.bio ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            />
                            {errors.bio && (
                                <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Số năm kinh nghiệm</label>
                                <Input
                                    type="number"
                                    min={0}
                                    {...register("experienceYears", { valueAsNumber: true })}
                                    className={errors.experienceYears ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.experienceYears && (
                                    <p className="text-xs text-red-500 mt-1">{errors.experienceYears.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Gói hiển thị (Showcase Type)</label>
                                <select
                                    className="w-full border border-input rounded-md px-2.5 py-2 text-sm bg-transparent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                                    value={showcaseType}
                                    onChange={(e) =>
                                        setValue("showcaseType", e.target.value as "STANDARD" | "PREMIUM", {
                                            shouldValidate: true,
                                        })
                                    }
                                >
                                    <option value="STANDARD">STANDARD (Gói cơ bản)</option>
                                    <option value="PREMIUM">PREMIUM (Nổi bật)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <IdentityImageUpload
                                label="CMND/CCCD mặt trước"
                                side="front"
                                value={identityFront}
                                onChange={(url) =>
                                    setValue("identityFront", url, { shouldValidate: true })
                                }
                                error={errors.identityFront?.message}
                            />

                            <IdentityImageUpload
                                label="CMND/CCCD mặt sau"
                                side="back"
                                value={identityBack}
                                onChange={(url) =>
                                    setValue("identityBack", url, { shouldValidate: true })
                                }
                                error={errors.identityBack?.message}
                            />
                        </div>

                        <p className="text-xs text-gray-400">
                            Hồ sơ service owner sẽ ở trạng thái chờ duyệt trước khi hiển thị công khai.
                        </p>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="flex-1 cursor-pointer"
                                disabled={isLoading}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 cursor-pointer"
                                disabled={isLoading}
                                style={{ backgroundColor: "#E4187D" }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang đăng ký...
                                    </>
                                ) : (
                                    "Hoàn tất đăng ký"
                                )}
                            </Button>
                        </div>
                    </>
                )}

                <p className="text-center text-sm text-gray-600 pt-2">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="underline cursor-pointer hover:text-gray-800">
                        Đăng nhập
                    </Link>
                    {" · "}
                    <Link href="/register" className="underline cursor-pointer hover:text-gray-800">
                        Đăng ký khách hàng
                    </Link>
                </p>
            </form>
        </div>
    );
}
