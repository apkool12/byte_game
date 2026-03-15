import type { User } from "@/types/user";

/**
 * 유저 임시 데이터 (이름, 소속 조)
 * 개인 점수는 없고, 조별 점수는 data/teams.ts 에서 관리.
 */
export const mockUsers: User[] = [
  { id: "user-1", name: "유저1", teamId: "team-1" },
  { id: "user-2", name: "유저2", teamId: "team-1" },
  { id: "user-3", name: "유저3", teamId: "team-2" },
  { id: "user-4", name: "유저4", teamId: "team-2" },
  { id: "user-5", name: "유저5", teamId: "team-3" },
  { id: "user-6", name: "유저6", teamId: "team-3" },
];
