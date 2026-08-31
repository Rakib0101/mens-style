import "server-only";
import { asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";

export async function getAllUsers(): Promise<User[]> {
  return getDb().select().from(users).orderBy(asc(users.createdAt));
}
