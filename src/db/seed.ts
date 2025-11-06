import { authUtil } from "@/modules/auth/auth.util";
import { db } from ".";
import { users, auths, roles } from "./schema";
import { AdminRoleEnum } from "@/modules/role/model/role.enum";
type SeedOptions = {
  user?: boolean;
  settings?: boolean;
};

export const Resource = [
  {
    name: "User",
  },
  {
    name: "Admin",
  },
  {
    name: "Portfolio",
  },
  {
    name: "Blog",
  },
  {
    name: "Role",
  },
  {
    name: "Resource",
  },
  {
    name: "Chat",
  },
  {
    name: "Site User",
  },
];
function parseArgs(): SeedOptions {
  const args = process.argv.slice(2);

  const options: SeedOptions = {};

  if (args.includes("--users")) {
    options.user = true;
    options.settings = false;
  } else if (args.includes("--settings")) {
    options.user = false;
    options.settings = true;
  } else {
    options.user = true;
    options.settings = true;
  }

  return options;
}
async function seedDatabase(options: SeedOptions) {
  await db.transaction(async (tx) => {
    if (options.user) {
      await Promise.all(
        Object.keys(AdminRoleEnum).map((name) =>
          tx
            .insert(roles)
            .values({ name })
            .onConflictDoUpdate({
              target: roles.name,
              set: { name },
            })
            .returning()
        )
      );

      console.log(
        "✅ Roles created successfully:",
        Object.keys(AdminRoleEnum).map((name) => name)
      );
      const userPassword = await authUtil.hashPassword("12345678");
      const [userAuth] = await tx
        .insert(auths)
        .values({
          email: "user@test.com",
          password: userPassword,
        })
        .onConflictDoUpdate({
          target: auths.email,
          set: {
            email: "user@test.com",
            password: userPassword,
          },
        })
        .returning();
      if (!userAuth) return console.log("Failed to create User");
      const [user] = await tx
        .insert(users)
        .values({
          auth_id: userAuth.id,
          username: "user",
        })
        .returning();
      if (!users) return console.log("Failed to create Admin");
      console.log("✅ Admin user created successfully:", {
        email: userAuth.email,
        username: user.username,
      });
    }
  });
  process.exit(0);
}

async function main() {
  const options = parseArgs();
  await seedDatabase(options);
  process.exit(0);
}
main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
