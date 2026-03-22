/** 점수 변경 로그 항목 */
export interface ScoreChangeLogEntry {
  teamId: string;
  teamName: string;
  delta: number;
  processorName: string;
  timestamp: number;
}

/**
 * Socket 이벤트 타입 정의 (실시간 연동 시 사용)
 */
export type SocketEventMap = {
  'game:join': { name: string; inviteCode: string };
  'game:ready': void;
  // 필요한 이벤트 추가
};
