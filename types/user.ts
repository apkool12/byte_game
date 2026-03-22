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

/** 유저 — 이름, 소속 조, 표시 번호, 학번 */
export interface User {
  id: string;
  name: string;
  /** 소속 조 id (Team.id) */
  teamId: string;
  /** 소속 방 id (예: room-1 ~ room-9) */
  roomId: string;
  /** 헤더/뱃지 표시용 번호 (예: "001", "027") */
  no?: string;
  /** 로그인 비밀번호로 사용할 학번 (서버 전용 데이터에만 존재) */
  studentId: string;
}

/** 클라이언트·localStorage에 보관해도 되는 프로필 (학번 제외) */
export type PublicUser = Omit<User, "studentId"> & {
  /** 로그인 API 응답에만 설정. GET /api/users 목록에는 포함하지 않음 */
  isAdmin?: boolean;
};
