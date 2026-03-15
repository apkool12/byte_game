/**
 * 유저·조 타입 (임시 데이터용)
 * 개인별 점수가 아니라 조별 점수만 저장.
 */

/** 조(팀) — 조별 점수 저장 */
export interface Team {
  id: string;
  name: string;
  /** 조별 포인트 */
  points: number;
}

/** 유저 — 이름과 소속 조만, 개인 점수 없음 */
export interface User {
  id: string;
  name: string;
  /** 소속 조 id (Team.id) */
  teamId: string;
}
