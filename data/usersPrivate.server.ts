import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { PublicUser } from "@/types/user";

/**
 * 유저는 DB(Prisma)에만 저장. 학번(studentId)은 서버에서만 조회.
 * 공개 프로필은 API 응답으로만 전달.
 */

type UserRow = {
  id: string;
  name: string;
  teamId: string;
  roomId: string;
  no: string | null;
  isAdmin: boolean;
};

function rowToPublicUser(row: UserRow, withAdmin: boolean): PublicUser {
  const base: PublicUser = {
    id: row.id,
    name: row.name,
    teamId: row.teamId,
    roomId: row.roomId,
    no: row.no ?? undefined,
  };
  if (withAdmin) {
    base.isAdmin = row.isAdmin;
  }
  return base;
}

export async function verifyLogin(
  name: string,
  inviteCode: string,
): Promise<PublicUser | null> {
  const n = name.trim();
  const p = inviteCode.trim();
  const row = await getPrisma().user.findFirst({
    where: { name: n, studentId: p },
  });
  return row ? rowToPublicUser(row, true) : null;
}

export async function getUsersPublic(): Promise<PublicUser[]> {
  const rows = await getPrisma().user.findMany({ orderBy: { id: "asc" } });
  return rows.map((row) => rowToPublicUser(row, false));
}
