export type User = {
  id: string;
  created_at: Date;
  updated_at?: Date | null;
  username: string;
  auth_id: string;
  default_chat_room_id: string | null;
};
