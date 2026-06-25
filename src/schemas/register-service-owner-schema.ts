import * as z from "zod";

export const useRegisterServiceOwnerSchema = () => {
    return z
        .object({
            email: z
                .string()
                .min(1, { message: String("Trường này không được để trống") })
                .pipe(z.email({ message: String("Email không hợp lệ") })),

            username: z
                .string()
                .min(3, { message: String("Tên người dùng dài từ 3 - 255 ký tự") })
                .max(255, { message: String("Tên người dùng dài từ 3 - 255 ký tự") }),

            password: z
                .string()
                .min(6, { message: String("Mật khẩu dài từ 6 - 32 ký tự") })
                .max(32, { message: String("Mật khẩu dài từ 6 - 32 ký tự") }),

            confirmPassword: z
                .string()
                .min(1, { message: String("Trường này không được để trống") }),

            acceptTerms: z
                .boolean()
                .refine((val) => val === true, {
                    message: String("Bạn cần đồng ý chính sách và điều khoản trước khi tiếp tục"),
                }),

            bio: z
                .string()
                .min(10, { message: String("Tiểu sử cần ít nhất 10 ký tự") })
                .max(1000, { message: String("Tiểu sử không được quá 1000 ký tự") }),

            experienceYears: z
                .number({ message: String("Vui lòng nhập số năm kinh nghiệm") })
                .min(0, { message: String("Số năm kinh nghiệm không hợp lệ") })
                .max(50, { message: String("Số năm kinh nghiệm không hợp lệ") }),

            showcaseType: z.enum(["STANDARD", "PREMIUM"]),

            identityFront: z
                .string()
                .min(1, { message: String("Vui lòng tải ảnh CMND/CCCD mặt trước") })
                .refine((val) => z.string().url().safeParse(val).success, {
                    message: String("Ảnh CMND/CCCD mặt trước không hợp lệ"),
                }),

            identityBack: z
                .string()
                .min(1, { message: String("Vui lòng tải ảnh CMND/CCCD mặt sau") })
                .refine((val) => z.string().url().safeParse(val).success, {
                    message: String("Ảnh CMND/CCCD mặt sau không hợp lệ"),
                }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: String("Xác nhận mật khẩu không đúng"),
            path: ["confirmPassword"],
        });
};

export type RegisterServiceOwnerValues = z.infer<ReturnType<typeof useRegisterServiceOwnerSchema>>;
