import apiClient from "@/common/constant/api-client";
import { PaymentGenerateResponse } from "@/types/payment";

export const generatePaymentUrl = async (bookingId: string) => {
    const res = await apiClient.post<PaymentGenerateResponse>("/payment/generate", {
        bookingId: bookingId,
        locale: "vn"
    });
    return res.data;
};