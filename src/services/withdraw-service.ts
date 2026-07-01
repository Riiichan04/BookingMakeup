import apiClient from "@/common/constant/api-client";
import { BankInfoRequest, WalletResponse, WithdrawDto, WithdrawResponse } from "@/types/wallet";

//For wallet

export const getMyWallet = async (): Promise<WalletResponse> => {
    const response = await apiClient.get<WalletResponse>('/wallets/my-wallet');
    return response.data;
}

export const updateBankInfo = async (payload: BankInfoRequest): Promise<WalletResponse> => {
    const response = await apiClient.post<WalletResponse>('/wallets/bank-info', payload);
    return response.data;
}

//For withdraw
export const getAllWithdraws = async (): Promise<WithdrawDto[]> => {
    const response = await apiClient.get<WithdrawDto[]>('/wallets/withdraws/all');
    return response.data;
}

export const requestWithdraw = async (amount: number): Promise<WithdrawResponse> => {
    const response = await apiClient.post<WithdrawResponse>('/wallets/withdraws/request', { amount });
    return response.data;
}

export const approveWithdraw = async (requestId: string, transactionCode: string): Promise<WithdrawResponse> => {
    const response = await apiClient.post<WithdrawResponse>(`/wallets/withdraws/${requestId}/approve`, {
        transactionCode
    });
    return response.data;
}

export const rejectWithdraw = async (requestId: string, reason: string): Promise<WithdrawResponse> => {
    const response = await apiClient.post<WithdrawResponse>(`/wallets/withdraws/${requestId}/reject`, {
        reason
    });
    return response.data;
}

//For withdraw payment
export const generateQrUrl = (bankId: string, accountNo: string, accountName: string, amount: number, requestId: string) => {
    const baseUrl = "https://vietqr.app/img";
    const params = new URLSearchParams({
        acc: accountNo,
        bank: bankId,
        amount: amount.toString(),
        des: `Thanh toan rut tien ${requestId.substring(0, 8)}`,
        template: "compact",
        showinfo: "true",
        fullacc: "true",
        holder: accountName
    });

    return `${baseUrl}?${params.toString()}`;
};