export type SessionEntity = {
    id: string;
    two_factor_verified: boolean
    expires_at: Date
    auth_id: string
    ip?: string
    device_type?: string
}