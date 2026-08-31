import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth";

async function main() {
  const db = getDb();

  await db
    .insert(users)
    .values({
      username: "admin",
      passwordHash: await hashPassword("password"),
      role: "admin",
    })
    .onConflictDoNothing({ target: users.username });

  console.log('Ensured default admin user "admin" exists.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
