import type { Team } from "@/types/user";

/**
 * 조별 포인트 임시 데이터 (개인별 점수 아님)
 * 실제 점수의 진실은 socket 서버(server/index.js)의 teamPoints가 관리.
 * 프론트에서는 teamId/name 정도만 사용하고, points 필드는 참고용 초기값.
 */
export const mockTeams: Team[] = [
  { id: "team-1", name: "1조", points: 1000 },
  { id: "team-2", name: "2조", points: 1000 },
  { id: "team-3", name: "3조", points: 1000 },
  { id: "team-4", name: "4조", points: 1000 },
  { id: "team-5", name: "5조", points: 1000 },
  { id: "team-6", name: "6조", points: 1000 },
  { id: "team-7", name: "7조", points: 1000 },
  { id: "team-8", name: "8조", points: 1000 },
  { id: "team-9", name: "9조", points: 1000 },
  { id: "team-10", name: "10조", points: 1000 },
];

export function getTeamById(teamId: string): Team | undefined {
  return mockTeams.find((t) => t.id === teamId);
}
