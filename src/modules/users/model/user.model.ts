import type { BaseModel } from "@/core/types/base.type";

export type User = BaseModel & {
  username: string;
  auth_id: string;
};
