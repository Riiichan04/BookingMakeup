import apiClient from "@/common/constant/api-client";
import { BankInfoRequest, WalletResponse, WithdrawResponse } from "@/types/wallet";

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