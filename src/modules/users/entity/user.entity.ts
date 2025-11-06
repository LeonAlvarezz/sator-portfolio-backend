import type { BaseModel } from "@/types/base.type";

export type User = BaseModel & {
  username: string;
  auth_id: string;
};
