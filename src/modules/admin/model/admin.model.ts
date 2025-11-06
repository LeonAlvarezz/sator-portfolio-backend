import type { BaseModel } from "@/types/base.type";

export type Admin = BaseModel & {
  username: string;
  auth_id: string;
};
