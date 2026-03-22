import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env or .env.local for Prisma.",
    );
  }
  const adapter = new PrismaPg({ connectionString: url });
  const client = new PrismaClient({ adapter });
  globalForPrisma.prisma = client;
  return client;
}
