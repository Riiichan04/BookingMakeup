export enum VerificationType {
    RESET_PASSWORD,
    VERIFY_USER
}

export interface VerifyResponse {
    result: boolean
    message: string
}