import { resolve } from "node:path";
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { DEFAULT_SHOP_CATALOG_RECORDS } from "../data/shopItems";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required to run seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
});

/** 어드민 계정 user id (이름은 Git 에 올리지 않음 — seed-users 와 id만 맞추면 됨) */
const ADMIN_USER_IDS = [
  "user-0",
  "user-11",
  "user-12",
  "user-13",
  "user-14",
  "user-15",
  "user-16",
  "user-17",
  "user-18",
  "user-19",
  "user-20",
] as const;

async function main() {
  let seedUsers: readonly {
    id: string;
    name: string;
    teamId: string;
    roomId: string;
    no: string;
    studentId: string;
  }[];

  try {
    const mod = await import("./seed-users");
    seedUsers = mod.seedUsers;
  } catch {
    console.error(
      "\n[seed] prisma/seed-users.ts 가 없습니다.\n" +
        "  cp prisma/seed-users.example.ts prisma/seed-users.ts\n" +
        "  후 실제 명단을 채운 뒤 다시 실행하세요.\n",
    );
    process.exit(1);
  }

  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: seedUsers.map((u) => ({
      id: u.id,
      name: u.name,
      teamId: u.teamId,
      roomId: u.roomId,
      no: u.no,
      studentId: u.studentId,
    })),
  });
  await prisma.user.updateMany({
    where: { id: { in: [...ADMIN_USER_IDS] } },
    data: { isAdmin: true },
  });

  await prisma.shopItem.deleteMany();
  await prisma.shopItem.createMany({
    data: DEFAULT_SHOP_CATALOG_RECORDS.map((row, index) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      iconSrc: row.iconSrc,
      sortOrder: index,
    })),
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
