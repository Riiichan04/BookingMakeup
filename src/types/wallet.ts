export interface WalletResponse {
    id: string;
    balance: number;
    bankId: string;
    accountNo: string;
    accountName: string;
    message: string;
}

export interface BankInfoRequest {
    bankId: string;
    accountNo: string;
    accountName: string;
}

export interface WithdrawRequest {
    amount: number;
}

export interface WithdrawResponse {
    id: string;
    amount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    note?: string;
    createdAt: string;
}