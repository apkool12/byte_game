/**
 * Git 에 올리는 샘플입니다.
 *
 * 1) `cp prisma/seed-users.example.ts prisma/seed-users.ts`
 * 2) `seed-users.ts` 에 실제 참가자 목록을 채움 (이 파일은 .gitignore 로 커밋 안 됨)
 * 3) `npx prisma db seed`
 *
 * 필드: id, name, teamId, roomId, no(표시 번호), studentId(로그인 시 초대코드·학번)
 */
export const seedUsers = [
  {
    id: "user-0",
    name: "홍길동",
    teamId: "team-1",
    roomId: "room-1",
    no: "001",
    studentId: "00000000",
  },
  {
    id: "user-1",
    name: "김철수",
    teamId: "team-2",
    roomId: "room-1",
    no: "002",
    studentId: "11111111",
  },
] as const;
