import type { BaseModel } from "@/core/types/base.type";

export type Admin = BaseModel & {
  username: string;
  auth_id: string;
  role_id: string;
};
