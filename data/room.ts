/**
 * 현재 방/게임 정보 임시 데이터
 */

/** 조별 점수 상한 (이 이상 올릴 수 없음) */
export const MAX_TEAM_SCORE = 1000;

export const currentRoom = {
  name: "7번방",
  gameName: "마피아 게임",
};

/** 푸터 등에 쓸 문구 */
export const roomFooterText = `현재 ${currentRoom.name}, ${currentRoom.gameName} 담당입니다.`;
