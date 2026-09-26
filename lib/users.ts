import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";

export async function getAllUsers(): Promise<User[]> {
  return getDb()
    .select()
    .from(users)
    .where(eq(users.hidden, false))
    .orderBy(asc(users.createdAt));
}
