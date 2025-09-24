import { sha256 } from "@oslojs/crypto/sha2";
import { env } from "@/config";
import bcrypt from "bcrypt";
import crypto from "crypto";

import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";

export function decodeToSessionId(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, Number(env.PASSWORD_SALT));
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}
