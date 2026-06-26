import apiClient from "@/common/constant/api-client";
import { SePayGenerateResponse } from "@/types/payment";

// export const generatePaymentUrl = async (bookingId: string) => {
//     const res = await apiClient.post<PaymentGenerateResponse>("/payment/generate", {
//         bookingId: bookingId,
//         locale: "vn"
//     });
//     return res.data;
// };

export const generatePaymentUrl = async (bookingId: string) => {
    const res = await apiClient.post<SePayGenerateResponse>("/payment/generate", {
        bookingId: bookingId
    });
    return res.data;
};