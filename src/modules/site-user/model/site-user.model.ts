import type { Auth } from "@/modules/auth/model/auth.model";

export type SiteUser = {
  id: string;
  website_name: string;
  username: string;
  link: string;
  api_key: string;
  registered_at: Date | null;
  auth_id: string;
  user_id: string;
  auth?: Auth;
};
