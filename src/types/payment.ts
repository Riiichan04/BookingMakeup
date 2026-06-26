export interface PaymentGenerateResponse {
    code: string;
    message: string;
    data: string;
}

export interface SePayGenerateResponse {
    actionUrl: string;
    fields: Record<string, string>;
}