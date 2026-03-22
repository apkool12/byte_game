/**
 * 어드민 게임 담당 설정 (MT 조 · 게임방 · 진행 게임 · 게임별 순위 감점)
 */

import { roomFooterText } from "@/data/room";

export const RANK_PLACE_COUNT = 10;

export interface AdminGameSession {
  staffTeamNumber: number;
  roomNumber: number;
  gameId: string;
  /** 게임별 1~10등 적용 점수 델타 (음수=차감, 0=변화 없음) */
  rankPenaltiesByGameId: Record<string, number[]>;
}

export interface AdminGameEntry {
  id: string;
  label: string;
}

/** 진행 가능한 게임 목록 (표시 순서 고정) */
export const GAME_ENTRIES: AdminGameEntry[] = [
  { id: "balance", label: "밸런스게임" },
  { id: "relay-drawing-quiz", label: "릴레이 그림 퀴즈" },
  { id: "insta-rhythm", label: "인스타 리듬게임" },
  { id: "pronunciation", label: "발음게임" },
  { id: "frog-rps", label: "청개구리 가위바위보" },
  { id: "chain-talk", label: "이어말하기" },
  { id: "hunmin", label: "훈민정음" },
  { id: "balloon-play", label: "공기놀이" },
  { id: "body-charades", label: "몸으로 말해요" },
  { id: "mafia", label: "마피아" },
  { id: "taboo-call-my-name", label: "금칙어 콜마이네임" },
];

export const ADMIN_GAME_MIN_TEAM = 1;
export const ADMIN_GAME_MAX_TEAM = 10;
export const ADMIN_GAME_MIN_ROOM = 1;
export const ADMIN_GAME_MAX_ROOM = 10;

const STORAGE_KEY = "byte-game-admin-game-session";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 기존 조별관리 순위 로직과 동일: 1~3등 0, 4등부터 (순위-3)×5 감점 */
export function getDefaultRankPenalties(): number[] {
  return Array.from({ length: RANK_PLACE_COUNT }, (_, i) => {
    const place = i + 1;
    if (place <= 3) return 0;
    return -((place - 3) * 5);
  });
}

function normalizeDelta(n: number): number {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  return clamp(Math.round(n), -1000, 1000);
}

function normalizePenaltyRow(row: unknown): number[] {
  const def = getDefaultRankPenalties();
  if (!Array.isArray(row)) return [...def];
  return Array.from({ length: RANK_PLACE_COUNT }, (_, i) =>
    normalizeDelta(Number(row[i])),
  );
}

export function createDefaultRankRulesAllGames(): Record<string, number[]> {
  const d = getDefaultRankPenalties();
  const out: Record<string, number[]> = {};
  for (const g of GAME_ENTRIES) {
    out[g.id] = [...d];
  }
  return out;
}

function mergeRankPenaltiesFromStorage(
  raw: Record<string, unknown> | Record<string, number[]> | undefined,
): Record<string, number[]> {
  const base = createDefaultRankRulesAllGames();
  if (!raw || typeof raw !== "object") return base;
  for (const g of GAME_ENTRIES) {
    const v = raw[g.id];
    base[g.id] = normalizePenaltyRow(v);
  }
  return base;
}

export function getGameEntryById(id: string): AdminGameEntry | undefined {
  return GAME_ENTRIES.find((g) => g.id === id);
}

/** 클라이언트 전용. SSR/빌드 시 null */
export function getStoredAdminGameSession(): AdminGameSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<AdminGameSession> & {
      rankPenaltiesByGameId?: Record<string, unknown>;
    };
    const staffTeamNumber = clamp(
      Math.floor(Number(o.staffTeamNumber)),
      ADMIN_GAME_MIN_TEAM,
      ADMIN_GAME_MAX_TEAM,
    );
    const roomNumber = clamp(
      Math.floor(Number(o.roomNumber)),
      ADMIN_GAME_MIN_ROOM,
      ADMIN_GAME_MAX_ROOM,
    );
    const gameId =
      typeof o.gameId === "string" && getGameEntryById(o.gameId)
        ? o.gameId
        : GAME_ENTRIES[0].id;
    const rankPenaltiesByGameId = mergeRankPenaltiesFromStorage(
      o.rankPenaltiesByGameId as Record<string, unknown> | undefined,
    );
    return {
      staffTeamNumber,
      roomNumber,
      gameId,
      rankPenaltiesByGameId,
    };
  } catch {
    return null;
  }
}

export function saveAdminGameSession(session: AdminGameSession): void {
  if (typeof window === "undefined") return;
  const rankPenaltiesByGameId = mergeRankPenaltiesFromStorage(
    session.rankPenaltiesByGameId,
  );
  const normalized: AdminGameSession = {
    staffTeamNumber: clamp(
      session.staffTeamNumber,
      ADMIN_GAME_MIN_TEAM,
      ADMIN_GAME_MAX_TEAM,
    ),
    roomNumber: clamp(
      session.roomNumber,
      ADMIN_GAME_MIN_ROOM,
      ADMIN_GAME_MAX_ROOM,
    ),
    gameId: getGameEntryById(session.gameId)?.id ?? GAME_ENTRIES[0].id,
    rankPenaltiesByGameId,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export const ADMIN_GAME_SESSION_EVENT = "byte-game-admin-game-session";

/** 푸터 한 줄 (저장된 세션이 없으면 기본 room 문구) */
export function formatAdminGameFooterLine(
  session: AdminGameSession | null,
): string {
  if (!session) return roomFooterText;
  const game = getGameEntryById(session.gameId);
  const name = game?.label ?? "";
  return `MT ${session.staffTeamNumber}조 스태프 · ${session.roomNumber}번방 · ${name} 진행`;
}

/**
 * 조별 관리 → 게임 → 순위 에서 사용.
 * 현재 저장된 세션의 `gameId`에 해당하는 규칙 (없으면 기본 곡선).
 */
export function getActiveGameRankPenalties(): number[] {
  const session = getStoredAdminGameSession();
  if (!session) return getDefaultRankPenalties();
  const row = session.rankPenaltiesByGameId[session.gameId];
  if (Array.isArray(row) && row.length === RANK_PLACE_COUNT) {
    return row.map(normalizeDelta);
  }
  return getDefaultRankPenalties();
}
