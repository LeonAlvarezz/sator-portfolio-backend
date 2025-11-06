import { z } from "zod";

export const CreatePermissionSchema = z.object({
  resource_id: z.string().min(1, { message: "Resource ID is required" }),
  role_id: z.string().optional(),
  read: z.boolean().optional(),
  write: z.boolean().optional(),
  delete: z.boolean().optional(),
});

export type CreatePermission = z.infer<typeof CreatePermissionSchema>;
