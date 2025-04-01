import prisma from "@/loaders/prisma";
import type { Signup } from "@/types/auth.type";
import type { Prisma } from "@prisma/client";
import type { EncryptedUpdateTotp } from "./admin.repository";
import { encryptToBuffer } from "@/utils/encryption";
import { IdentityRole } from "@/types/base.type";

export class AuthRepository {
  public async checkByEmail(email: string) {
    return prisma.auth.findUnique({
      where: { email },
      omit: {
        password: false, // The password field is now selected.
      },
      include: {
        user: true,
        admin: true,
        site_user: true,
      },
    });
  }

  public async findById(id: string) {
    return prisma.auth.findUnique({
      where: { id },
      omit: {
        password: false, // The password field is now selected.
      },
      include: {
        user: true,
        admin: true,
        site_user: true,
      },
    });
  }

  public async createAuth(
    payload: Omit<Signup, "username">,
    tx: Prisma.TransactionClient,
    identity = IdentityRole.ADMIN
  ) {
    const client = tx ? tx : prisma;
    return client.auth.create({
      data: {
        email: payload.email,
        password: payload.password,
        is_anonymous: identity === IdentityRole.ANONYMOUS ? true : false,
      },
    });
  }

  public async bindAuth(
    id: string,
    payload: Omit<Signup, "username">,
    tx: Prisma.TransactionClient
  ) {
    const client = tx ? tx : prisma;
    return client.auth.update({
      where: { id },
      include: {
        user: true,
      },
      data: {
        email: payload.email,
        password: payload.password,
        is_anonymous: false,
      },
    });
  }

  public async updatePassword(
    id: string,
    password: string,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx ? tx : prisma;
    return client.auth.update({
      where: { id },
      data: {
        password: password,
      },
      include: {
        user: true,
        admin: true,
        site_user: true,
      },
    });
  }

  public async updateTotp(
    id: string,
    payload: EncryptedUpdateTotp,
    tx: Prisma.TransactionClient
  ) {
    const encrypted = encryptToBuffer(payload.key);
    return tx.auth.update({
      where: { id },
      data: {
        totp_key: encrypted,
      },
    });
  }
}
