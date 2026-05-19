import * as z from "zod";

export const loginSchema = () => {
    return z.object({
        email: z
            .string()
            .trim()
            .min(1, { message: String("Trường này không được để trống") })
            .pipe(
                z.email({ message: String("Email không hợp lệ") })
            ),

        password: z
            .string()
            .min(6, { message: String("Mật khẩu dài từ 6 - 32 ký tự") })
            .max(32, { message: String("Mật khẩu dài từ 6 - 32 ký tự") })
    });
};

export type LoginValues = z.infer<ReturnType<typeof loginSchema>>;