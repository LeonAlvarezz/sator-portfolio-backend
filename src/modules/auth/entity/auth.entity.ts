import type { Admin, User } from "@prisma/client";
type SessionResult = {
    token: string;
    expires_at: Date;
};

export type Auth = Omit<Admin, "password" | "totp_key"> &
    Omit<User, "password" | "totp_key"> &
    SessionResult;

export type AuthSessionValidationResult = Partial<Auth> | null;