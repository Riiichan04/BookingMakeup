import * as z from "zod";

export const useRegisterSchema = () => {

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
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: String("Xác nhận mật khẩu không đúng"),
            path: ["confirmPassword"],
        });
};

export type RegisterValues = z.infer<ReturnType<typeof useRegisterSchema>>;