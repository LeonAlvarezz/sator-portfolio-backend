import type { Admin } from "@/modules/admin/model/admin.model";
import type { SiteUser } from "@/modules/site-user/model/site-user.model";
import type { User } from "@/modules/users/entity/user.entity";
import type { BaseModel } from "@/types/base.type";

export type Auth = BaseModel & {
  email: string;
  password: string;
  totp_key: Uint8Array<ArrayBufferLike> | null;
  last_login: Date | null;
  admin?: Admin;
  user?: User;
  site_user?: SiteUser;
};

export type AuthSessionValidationResult = Partial<Auth> | null;
