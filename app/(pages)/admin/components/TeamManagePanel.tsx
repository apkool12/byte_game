"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  TEAM_BTN_MT,
  TEAM_BTN_GAME,
  SHOW_LOG_SHOW,
  SHOW_LOG_LOG,
  SHOW_LOG_TITLE,
  LOG_PROCESSOR_LABEL,
  GAME_RANK_TITLE,
  GAME_RANK_APPLY,
  GAME_ALL_VIEW,
  GAME_BACK,
  GAME_ALL_TITLE,
  GAME_ALL_INCREASE,
  GAME_ALL_DECREASE,
  TEAM_SELECT_LABEL,
  TEAM_SELECT_BTN,
  TEAM_SELECT_PREV,
  TEAM_SELECT_NEXT,
  SCORE_LABEL,
  POINT_SUFFIX,
  BTN_INCREASE_SCORE,
  BTN_DECREASE_SCORE,
} from "@/data/copy";
import { getTeamById } from "@/data/teams";
import { getCurrentUser } from "@/data/currentUser";
import { getSocket } from "@/app/socketClient";
import {
  ADMIN_GAME_SESSION_EVENT,
  getActiveGameRankPenalties,
} from "@/data/adminGames";
import type { ScoreChangeLogEntry } from "@/types/socket";
import type { PublicUser } from "@/types/user";
import styled from "@emotion/styled";
import ScoreAdjustModal from "./ScoreAdjustModal";

const MIN_TEAM = 1;
const MAX_TEAM = 10;

const Wrap = styled.div`
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
`;

/* ---------- 메인 뷰 (MT / GAME / SHOW LOG) ---------- */
const BtnRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const BtnSquare = styled.button`
  flex: 1;
  aspect-ratio: 1;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
`;

const BtnSquareText = styled.span`
  font-family: var(--font-game-of-squids);
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.36px;
  background: linear-gradient(180deg, #f5376a 0%, #8f203e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ShowLogBtn = styled.button`
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
`;

const ShowText = styled.span`
  font-family: var(--font-game-of-squids);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.36px;
  background: linear-gradient(90deg, #929292 0%, #2c2c2c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const LogText = styled.span`
  font-family: var(--font-game-of-squids);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.36px;
  background: linear-gradient(90deg, #f5376a 0%, #8f203e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

/* ---------- 조 선택 뷰 (카드 슬라이드 캐러셀) ---------- */
const CARD_WIDTH = 182; /* 140 + 30% */
const CARD_PEEK = 56; /* 메인 카드 뒤로 살짝만 보이게 */
const CARD_OFFSET = CARD_PEEK;

const TeamSelectFullWidth = styled.div`
  width: 100%;
  max-width: none;
  box-sizing: border-box;
`;

const TeamSelectWrap = styled.div`
  width: 100%;
`;

const SelectRow = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 24px;
`;

const CarouselViewport = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

const CarouselTrack = styled.div<{ $translateX: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${-CARD_WIDTH + CARD_PEEK}px;
  width: max-content;
  transition: transform 0.3s ease-out;
  /* 트랙 중앙 기준으로 시프트 → 메인 카드가 뷰포트 정중앙에 오도록 */
  transform: translateX(${({ $translateX }) => $translateX}px);
`;

const TeamCard = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  width: ${CARD_WIDTH}px;
  aspect-ratio: 1;
  border-radius: 10px;
  background: linear-gradient(180deg, #6c6969 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    filter 0.25s ease,
    opacity 0.25s ease,
    transform 0.25s ease;
  filter: ${({ $active }) => ($active ? "none" : "blur(4px)")};
  opacity: ${({ $active }) => ($active ? 1 : 0.75)};
  transform: ${({ $active }) => ($active ? "scale(1)" : "scale(0.7)")};
  z-index: ${({ $active }) => ($active ? 2 : 1)};
  position: relative;
`;

const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 48px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
`;

const ArrowLeft = styled(ArrowBtn)`
  left: 5%;
`;

const ArrowRight = styled(ArrowBtn)`
  right: 5%;
`;

const TeamLabel = styled.span`
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.36px;
  color: #fff;
`;

const TeamNumber = styled.span`
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 72px;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  background: linear-gradient(180deg, #f5376a 0%, #8f203e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SelectBtn = styled.button`
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow:
    inset 1px 1px 2px rgba(255, 255, 255, 0.04),
    0 4px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  font-family: var(--font-game-of-squids);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.36px;
  color: #fff;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
`;

/* ---------- 조 점수 관리 뷰 (개인관리 패널과 동일 UI) ---------- */
const ScoreManageWrap = styled.div`
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
`;

const ResultCard = styled.div`
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-sizing: border-box;
`;

const ScoreSection = styled.div`
  padding: 20px 20px 16px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: -30px;
`;

const ScoreLabel = styled.span`
  font-family: var(--font-game-of-squids);
  font-size: 32px;
  color: rgba(192, 192, 192, 0.95);
  letter-spacing: 0.02em;
`;

const ScoreValue = styled.span`
  font-family: var(--font-game-of-squids);
  font-size: 32px;
  color: rgba(255, 255, 255, 0.98);
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #404040;
  transform: translateY(-20px);
`;

const TeamSection = styled.div`
  transform: translateY(-20px);
  padding: 16px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TeamName = styled.span`
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 18px;
  color: #fff;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 20px 20px;
`;

const ScoreButton = styled.button`
  flex: 1;
  padding: 14px 16px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  color: #fff;
  font-size: 14px;
  font-family: var(--font-yeotnal-sajingwan);
  font-weight: normal;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
`;

/* ---------- GAME 뷰 (게임 조 점수 조작) ---------- */
const GameManageWrap = styled.div`
  width: 100%;
  max-width: 620px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 28px;
  margin-bottom: 20px;
`;

const GameTeamCard = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  cursor: pointer;
  padding: 0;
`;

const GameAvatar = styled.span`
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);

  img {
    width: 72%;
    height: 72%;
    object-fit: contain;
  }
`;

const GameCardBody = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GameNameRow = styled.div`
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 18px;
  font-weight: 900;
  line-height: 120%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GameTeamText = styled.span`
  margin-left: 4px;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 13px;
  font-weight: 400;
`;

const GameNoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 2px 8px;
  border-radius: 2px;
  background: linear-gradient(90deg, #58102f 0%, #6f0d34 100%);
  color: #fff;
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 12px;
  line-height: 120%;
`;

const GameBottomRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const GameBottomButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 16px;
  background: linear-gradient(180deg, #222 0%, #000 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
  color: #fff;
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 22px;
  padding: 16px 12px;
  cursor: pointer;
`;

const RankManageWrap = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RankTitle = styled.h3`
  margin: 0 0 8px;
  color: rgba(255, 255, 255, 0.92);
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 18px;
  text-align: center;
`;

const RankRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 52px 1fr 54px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: linear-gradient(180deg, #1c1c1c 0%, #0c0c0c 100%);
`;

const RankLabel = styled.span`
  color: #fff;
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 15px;
`;

const RankSelect = styled.select`
  width: 100%;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 14px;
  padding: 0 8px;
`;

const RankPenalty = styled.span<{ $zero: boolean }>`
  color: ${({ $zero }) => ($zero ? "rgba(188, 188, 188, 0.9)" : "#f25f8e")};
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 13px;
  text-align: right;
`;

const AllManageWrap = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AllModeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const AllModeButton = styled.button<{ $active: boolean }>`
  border: none;
  border-radius: 10px;
  padding: 12px 10px;
  color: #fff;
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 16px;
  cursor: pointer;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(180deg, #a11846 0%, #6e0f31 100%)"
      : "linear-gradient(180deg, #222 0%, #000 100%)"};
`;

const AllAmountCard = styled.div`
  border-radius: 12px;
  padding: 14px 12px;
  background: linear-gradient(180deg, #1d1d1d 0%, #0b0b0b 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AllAmountValue = styled.div`
  color: #fff;
  font-family: var(--font-game-of-squids);
  font-size: 28px;
  text-align: center;
`;

const AllAmountButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
`;

const AllAmountButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 9px 8px;
  color: #fff;
  background: linear-gradient(180deg, #2a2a2a 0%, #111 100%);
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  cursor: pointer;
`;

/* ---------- SHOW LOG 뷰 ---------- */
const ShowLogFullWidth = styled.div`
  width: 100%;
  max-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
`;

const LogScrollWrap = styled.div`
  width: 100%;
  max-width: 320px;
  flex: 1;
  min-height: 180px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
`;

const LogEntryCard = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
`;

const LogEntryLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
`;

const LogEntryScoreText = styled.span`
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  color: #fff;
`;

const LogEntryTime = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-pretendard-light), sans-serif;
`;

const LogEntryRight = styled.div`
  flex-shrink: 0;
  min-width: 90px;
  padding: 8px 12px;
  border-radius: 10px;
  background: linear-gradient(90deg, #c41e50 0%, #f5376a 50%, #e88a9e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const LogProcessorLabel = styled.span`
  color: #fff;
  text-align: center;
  font-family: var(--font-yeotnal-sajingwan), serif;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: -0.22px;
`;

const LogProcessorName = styled.span`
  color: #fff;
  font-family: var(--font-yeotnal-sajingwan5), serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: -0.3px;
`;

const LogEmpty = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 32px 16px;
  font-family: var(--font-pretendard-light), sans-serif;
`;

const LogLoading = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 32px 16px;
  font-family: var(--font-pretendard-light), sans-serif;
`;

const LogSentinel = styled.div`
  height: 1px;
  visibility: hidden;
  pointer-events: none;
`;

export interface TeamManagePanelProps {
  onViewChange?: (view: "main" | "showLog") => void;
}

export default function TeamManagePanel({
  onViewChange,
}: TeamManagePanelProps) {
  const [view, setView] = useState<
    | "main"
    | "teamSelect"
    | "scoreManage"
    | "showLog"
    | "gameManage"
    | "rankManage"
    | "allManage"
  >("main");
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [teamScores, setTeamScores] = useState<Record<string, number>>({});
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [scoreModalMode, setScoreModalMode] = useState<"increase" | "decrease">(
    "increase",
  );
  const [logs, setLogs] = useState<ScoreChangeLogEntry[]>([]);
  const [logsPage, setLogsPage] = useState(0);
  const [logsHasMore, setLogsHasMore] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [rankTeamByPlace, setRankTeamByPlace] = useState<number[]>(
    Array.from({ length: 10 }, (_, idx) => idx + 1),
  );
  const [allAdjustMode, setAllAdjustMode] = useState<"increase" | "decrease">(
    "decrease",
  );
  const [allAdjustAmount, setAllAdjustAmount] = useState(0);
  /** 게임 관리에서 순위 규칙 저장 시 순위 화면 갱신 */
  const [rankPenaltyRev, setRankPenaltyRev] = useState(0);
  const logScrollRef = useRef<HTMLDivElement>(null);
  const logSentinelRef = useRef<HTMLDivElement>(null);
  const lastFetchedPageRef = useRef(-1);
  const [publicUsers, setPublicUsers] = useState<PublicUser[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/users")
      .then((r) => r.json())
      .then((d: { users?: PublicUser[] }) => {
        if (!cancelled && Array.isArray(d.users)) setPublicUsers(d.users);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const bumpRankRules = () => setRankPenaltyRev((v) => v + 1);
    if (typeof window !== "undefined") {
      window.addEventListener(ADMIN_GAME_SESSION_EVENT, bumpRankRules);
      window.addEventListener("storage", bumpRankRules);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(ADMIN_GAME_SESSION_EVENT, bumpRankRules);
        window.removeEventListener("storage", bumpRankRules);
      }
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const handleAllScores = (allScores: Record<string, number>) => {
      if (allScores && typeof allScores === "object") {
        setTeamScores(allScores);
      }
    };
    const handleScoreUpdated = (payload: {
      teamId: string;
      points: number;
    }) => {
      if (payload?.teamId != null && typeof payload.points === "number") {
        setTeamScores((prev) => ({
          ...prev,
          [payload.teamId]: payload.points,
        }));
      }
    };
    socket.on("team:allScores", handleAllScores);
    socket.on("team:scoreUpdated", handleScoreUpdated);
    socket.emit("team:requestAllScores");
    return () => {
      socket.off("team:allScores", handleAllScores);
      socket.off("team:scoreUpdated", handleScoreUpdated);
    };
  }, []);

  useEffect(() => {
    onViewChange?.(view === "showLog" ? "showLog" : "main");
  }, [view, onViewChange]);

  const logsLoadingRef = useRef(false);
  const fetchLogs = useCallback((page: number, append: boolean) => {
    if (logsLoadingRef.current) return;
    logsLoadingRef.current = true;
    setLogsLoading(true);
    const socket = getSocket();
    const timeout = setTimeout(() => {
      if (logsLoadingRef.current) {
        logsLoadingRef.current = false;
        setLogsLoading(false);
      }
    }, 8000);
    const handleLogs = (payload: {
      logs: ScoreChangeLogEntry[];
      hasMore: boolean;
      page: number;
    }) => {
      clearTimeout(timeout);
      setLogs((prev) => (append ? [...prev, ...payload.logs] : payload.logs));
      setLogsHasMore(payload.hasMore);
      logsLoadingRef.current = false;
      setLogsLoading(false);
    };
    const doEmit = () => {
      socket.emit("admin:requestLogs", { page }, (response: unknown) => {
        if (response && typeof response === "object" && "logs" in response) {
          handleLogs(
            response as {
              logs: ScoreChangeLogEntry[];
              hasMore: boolean;
              page: number;
            },
          );
        } else {
          logsLoadingRef.current = false;
          setLogsLoading(false);
          clearTimeout(timeout);
        }
      });
    };
    if (socket.connected) {
      doEmit();
    } else {
      socket.once("connect", doEmit);
    }
  }, []);

  useEffect(() => {
    if (view === "showLog") {
      setLogs([]);
      setLogsPage(0);
      setLogsHasMore(true);
      lastFetchedPageRef.current = 0;
      fetchLogs(0, false);
    }
  }, [view, fetchLogs]);

  useEffect(() => {
    if (view !== "showLog" || !logsHasMore || logsLoading) return;
    const sentinel = logSentinelRef.current;
    const scrollRoot = logScrollRef.current;
    if (!sentinel || !scrollRoot) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        const nextPage = lastFetchedPageRef.current + 1;
        if (nextPage <= lastFetchedPageRef.current) return;
        lastFetchedPageRef.current = nextPage;
        setLogsPage(nextPage);
        fetchLogs(nextPage, true);
      },
      { root: scrollRoot, rootMargin: "100px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [view, logsHasMore, logsLoading, fetchLogs]);

  const formatLogTime = useCallback((ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    if (isToday) {
      return d.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    return d.toLocaleString("ko-KR", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedTeam((n) => (n <= MIN_TEAM ? MAX_TEAM : n - 1));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedTeam((n) => (n >= MAX_TEAM ? MIN_TEAM : n + 1));
  }, []);

  const handleSelect = useCallback(() => {
    setView("scoreManage");
  }, []);

  /** 10장만: [1,2,...,10] — 1 이전 → 인덱스 9(10번), 10 다음 → 인덱스 0(1번) */
  const carouselOrder = Array.from({ length: MAX_TEAM }, (_, i) => i + 1);
  const activeIndex = selectedTeam - 1; /* 1→0, 10→9 */

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateXPx, setTranslateXPx] = useState(0);

  /* DOM 측정: 초기 1·2번은 레이아웃 미안정 → 여러 시점에 재측정 */
  useEffect(() => {
    if (view !== "teamSelect" || !viewportRef.current || !trackRef.current)
      return;
    const measure = () => {
      const vp = viewportRef.current;
      const track = trackRef.current;
      const cards = track?.querySelectorAll("[data-carousel-index]");
      if (!vp || !track || !cards || cards.length < 2) return;
      const vpRect = vp.getBoundingClientRect();
      if (vpRect.width < 10) return;
      const r0 = cards[0].getBoundingClientRect();
      const r1 = cards[1].getBoundingClientRect();
      const stepPx = r1.left - r0.left;
      const cardWidthPx = r0.width;
      const trackWidthPx = (MAX_TEAM - 1) * stepPx + cardWidthPx;
      const activeCardCenterFromTrackLeft =
        activeIndex * stepPx + cardWidthPx / 2;
      let tx = trackWidthPx / 2 - activeCardCenterFromTrackLeft;
      if (activeIndex === 0) tx -= 120; /* 1→2 전환만 과도하게 넘어가는 보정 */
      if (activeIndex === 1) tx += 80; /* 1→2 전환만 과도하게 넘어가는 보정 */
      setTranslateXPx(tx);
    };
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    const t1 = setTimeout(measure, 50);
    const t2 = setTimeout(measure, 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [view, activeIndex]);

  const carouselTranslateX = translateXPx;

  const teamId = `team-${selectedTeam}`;
  const team = getTeamById(teamId);
  const liveScore =
    teamId in teamScores ? teamScores[teamId] : (team?.points ?? 0);
  const gameTeamRows = Array.from({ length: MAX_TEAM }, (_, idx) => {
    const teamNumber = idx + 1;
    const matchedUser = publicUsers.find(
      (u) => u.teamId === `team-${teamNumber}`,
    );
    const teamScoreValue =
      teamScores[`team-${teamNumber}`] ?? getTeamById(`team-${teamNumber}`)?.points;
    const isAdjustable = matchedUser != null && teamScoreValue != null;
    return {
      teamNumber,
      name: matchedUser?.name ?? "-",
      no: matchedUser?.no ?? "---",
      roomId: matchedUser?.roomId ?? `room-${((teamNumber - 1) % 9) + 1}`,
      isAdjustable,
    };
  });
  const rankPenaltyByPlace = useMemo(
    () => getActiveGameRankPenalties(),
    [rankPenaltyRev],
  );

  const getPenaltyByPlace = useCallback(
    (place: number): number => {
      return rankPenaltyByPlace[place - 1] ?? 0;
    },
    [rankPenaltyByPlace],
  );

  const applyRankPenalty = useCallback(() => {
    const scoreDeltaByTeam = new Map<string, number>();
    const gameRowByTeamNumber = new Map(
      gameTeamRows.map((row) => [row.teamNumber, row]),
    );
    rankTeamByPlace.forEach((teamNumber, idx) => {
      const place = idx + 1;
      const delta = getPenaltyByPlace(place);
      if (delta === 0) return;
      const row = gameRowByTeamNumber.get(teamNumber);
      if (!row?.isAdjustable) return;
      const teamKey = `team-${teamNumber}`;
      scoreDeltaByTeam.set(teamKey, (scoreDeltaByTeam.get(teamKey) ?? 0) + delta);
    });

    if (scoreDeltaByTeam.size === 0) {
      setView("gameManage");
      return;
    }

    const socket = getSocket();
    scoreDeltaByTeam.forEach((delta, teamKey) => {
      socket.emit("admin:adjustScore", {
        teamId: teamKey,
        delta,
        processorName: getCurrentUser()?.name ?? "알 수 없음",
      });
    });
    setView("gameManage");
  }, [gameTeamRows, getPenaltyByPlace, rankTeamByPlace]);

  const applyAllPenalty = useCallback(() => {
    if (allAdjustAmount <= 0) {
      // eslint-disable-next-line no-alert
      alert("점수를 먼저 선택해 주세요.");
      return;
    }
    const signedDelta =
      allAdjustMode === "increase" ? allAdjustAmount : -allAdjustAmount;
    const targetTeamIds = gameTeamRows
      .filter((row) => row.isAdjustable)
      .map((row) => `team-${row.teamNumber}`);
    if (targetTeamIds.length === 0) {
      setView("gameManage");
      return;
    }
    const socket = getSocket();
    socket.emit(
      "admin:adjustAllScores",
      {
        delta: signedDelta,
        targetTeamIds,
        processorName: getCurrentUser()?.name ?? "알 수 없음",
      },
      (response: { ok?: boolean } | undefined) => {
        if (!response?.ok) {
          // eslint-disable-next-line no-alert
          alert("전체 점수 적용에 실패했습니다. 서버 상태를 확인해 주세요.");
          return;
        }
        setView("gameManage");
      },
    );
  }, [allAdjustAmount, allAdjustMode, gameTeamRows]);

  if (view === "showLog") {
    return (
      <ShowLogFullWidth>
        <LogScrollWrap ref={logScrollRef}>
          {logs.length === 0 ? (
            logsLoading ? (
              <LogLoading>로딩 중...</LogLoading>
            ) : (
              <LogEmpty>점수 변경 이력이 없습니다.</LogEmpty>
            )
          ) : (
            logs.map((entry, idx) => (
              <LogEntryCard key={`${entry.timestamp}-${idx}`}>
                <LogEntryLeft>
                  <LogEntryScoreText>
                    {entry.teamName}{" "}
                    {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
                  </LogEntryScoreText>
                  <LogEntryTime>{formatLogTime(entry.timestamp)}</LogEntryTime>
                </LogEntryLeft>
                <LogEntryRight>
                  <LogProcessorLabel>{LOG_PROCESSOR_LABEL}</LogProcessorLabel>
                  <LogProcessorName>{entry.processorName}</LogProcessorName>
                </LogEntryRight>
              </LogEntryCard>
            ))
          )}
          {logsHasMore && <LogSentinel ref={logSentinelRef} />}
        </LogScrollWrap>
      </ShowLogFullWidth>
    );
  }

  if (view === "scoreManage") {
    return (
      <Wrap>
        <ScoreManageWrap>
          <ResultCard
            role="region"
            aria-label={`${team?.name ?? selectedTeam}조 점수`}
          >
            <ScoreSection>
              <ScoreLabel>{SCORE_LABEL}</ScoreLabel>
              <ScoreValue>
                {team != null ? `${liveScore}${POINT_SUFFIX}` : "-"}
              </ScoreValue>
            </ScoreSection>
            <TeamSection>
              <TeamName>{team?.name ?? `${selectedTeam}조`}</TeamName>
            </TeamSection>
            <Divider />
            <ButtonRow>
              <ScoreButton
                type="button"
                aria-label={BTN_INCREASE_SCORE}
                onClick={() => {
                  setScoreModalMode("increase");
                  setScoreModalOpen(true);
                }}
              >
                {BTN_INCREASE_SCORE}
              </ScoreButton>
              <ScoreButton
                type="button"
                aria-label={BTN_DECREASE_SCORE}
                onClick={() => {
                  setScoreModalMode("decrease");
                  setScoreModalOpen(true);
                }}
              >
                {BTN_DECREASE_SCORE}
              </ScoreButton>
            </ButtonRow>
          </ResultCard>
          <ScoreAdjustModal
            open={scoreModalOpen}
            onClose={() => setScoreModalOpen(false)}
            teamName={team?.name ?? `${selectedTeam}조`}
            currentScore={liveScore}
            mode={scoreModalMode}
            onConfirm={(delta) => {
              const numDelta = Number(delta);
              if (!Number.isNaN(numDelta) && numDelta !== 0) {
                try {
                  const socket = getSocket();
                  socket.emit("admin:adjustScore", {
                    teamId,
                    delta: numDelta,
                    processorName: getCurrentUser()?.name ?? "알 수 없음",
                  });
                } catch {
                  // 소켓 미연결 시 조용히 무시
                }
              }
            }}
          />
        </ScoreManageWrap>
      </Wrap>
    );
  }

  if (view === "teamSelect") {
    return (
      <TeamSelectFullWidth>
        <TeamSelectWrap>
          <SelectRow>
            <CarouselViewport ref={viewportRef}>
              <CarouselTrack ref={trackRef} $translateX={carouselTranslateX}>
                {carouselOrder.map((teamNum, index) => (
                  <TeamCard
                    key={index}
                    $active={index === activeIndex}
                    data-carousel-index={index}
                  >
                    <TeamLabel>{TEAM_SELECT_LABEL}</TeamLabel>
                    <TeamNumber>{teamNum}</TeamNumber>
                  </TeamCard>
                ))}
              </CarouselTrack>
            </CarouselViewport>
            <ArrowLeft
              type="button"
              onClick={handlePrev}
              aria-label={TEAM_SELECT_PREV}
            >
              {TEAM_SELECT_PREV}
            </ArrowLeft>
            <ArrowRight
              type="button"
              onClick={handleNext}
              aria-label={TEAM_SELECT_NEXT}
            >
              {TEAM_SELECT_NEXT}
            </ArrowRight>
          </SelectRow>
          <SelectBtn type="button" onClick={handleSelect}>
            {TEAM_SELECT_BTN}
          </SelectBtn>
        </TeamSelectWrap>
      </TeamSelectFullWidth>
    );
  }

  if (view === "gameManage") {
    return (
      <GameManageWrap>
        <GameGrid>
          {gameTeamRows.map((row) => (
            <GameTeamCard type="button" key={row.teamNumber}>
              <GameAvatar aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/header-user.png" alt="" />
              </GameAvatar>
              <GameCardBody>
                <GameNameRow>
                  {row.name}
                  <GameTeamText>{`${row.teamNumber}조`}</GameTeamText>
                </GameNameRow>
                <GameNoBadge>{`No.${row.no}`}</GameNoBadge>
              </GameCardBody>
            </GameTeamCard>
          ))}
        </GameGrid>
        <GameBottomRow>
          <GameBottomButton type="button" onClick={() => setView("rankManage")}>
            순위
          </GameBottomButton>
          <GameBottomButton type="button" onClick={() => setView("allManage")}>
            {GAME_ALL_VIEW}
          </GameBottomButton>
        </GameBottomRow>
      </GameManageWrap>
    );
  }

  if (view === "allManage") {
    return (
      <AllManageWrap>
        <RankTitle>{GAME_ALL_TITLE}</RankTitle>
        <AllModeRow>
          <AllModeButton
            type="button"
            $active={allAdjustMode === "increase"}
            onClick={() => setAllAdjustMode("increase")}
          >
            {GAME_ALL_INCREASE}
          </AllModeButton>
          <AllModeButton
            type="button"
            $active={allAdjustMode === "decrease"}
            onClick={() => setAllAdjustMode("decrease")}
          >
            {GAME_ALL_DECREASE}
          </AllModeButton>
        </AllModeRow>
        <AllAmountCard>
          <AllAmountValue>{`${allAdjustAmount}${POINT_SUFFIX}`}</AllAmountValue>
          <AllAmountButtons>
            <AllAmountButton
              type="button"
              onClick={() => setAllAdjustAmount((v) => v + 5)}
            >
              +5
            </AllAmountButton>
            <AllAmountButton
              type="button"
              onClick={() => setAllAdjustAmount((v) => v + 10)}
            >
              +10
            </AllAmountButton>
            <AllAmountButton type="button" onClick={() => setAllAdjustAmount(0)}>
              RESET
            </AllAmountButton>
          </AllAmountButtons>
        </AllAmountCard>
        <GameBottomRow>
          <GameBottomButton type="button" onClick={() => setView("gameManage")}>
            {GAME_BACK}
          </GameBottomButton>
          <GameBottomButton type="button" onClick={applyAllPenalty}>
            적용
          </GameBottomButton>
        </GameBottomRow>
      </AllManageWrap>
    );
  }

  if (view === "rankManage") {
    return (
      <RankManageWrap>
        <RankTitle>{GAME_RANK_TITLE}</RankTitle>
        {Array.from({ length: 10 }, (_, idx) => {
          const place = idx + 1;
          const penalty = getPenaltyByPlace(place);
          return (
            <RankRow key={place}>
              <RankLabel>{place}등</RankLabel>
              <RankSelect
                value={rankTeamByPlace[idx]}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setRankTeamByPlace((prev) => {
                    const copied = [...prev];
                    const prevValue = copied[idx];
                    if (prevValue === next) return copied;
                    const otherIdx = copied.findIndex(
                      (teamNo, i) => i !== idx && teamNo === next,
                    );
                    copied[idx] = next;
                    if (otherIdx >= 0) copied[otherIdx] = prevValue;
                    return copied;
                  });
                }}
              >
                {gameTeamRows.map((row) => {
                  const teamNo = row.teamNumber;
                  return (
                    <option key={teamNo} value={teamNo} disabled={!row.isAdjustable}>
                      {`${teamNo}조-${row.name}`}
                    </option>
                  );
                })}
              </RankSelect>
              <RankPenalty $zero={penalty === 0}>
                {penalty === 0 ? "0" : `${penalty}`}
              </RankPenalty>
            </RankRow>
          );
        })}
        <GameBottomRow>
          <GameBottomButton type="button" onClick={() => setView("gameManage")}>
            {GAME_BACK}
          </GameBottomButton>
          <GameBottomButton type="button" onClick={applyRankPenalty}>
            {GAME_RANK_APPLY}
          </GameBottomButton>
        </GameBottomRow>
      </RankManageWrap>
    );
  }

  return (
    <Wrap>
      <BtnRow>
        <BtnSquare
          type="button"
          onClick={() => {
            setSelectedTeam(1);
            setView("teamSelect");
          }}
        >
          <BtnSquareText>{TEAM_BTN_MT}</BtnSquareText>
        </BtnSquare>
        <BtnSquare
          type="button"
          onClick={() => {
            setView("gameManage");
          }}
        >
          <BtnSquareText>{TEAM_BTN_GAME}</BtnSquareText>
        </BtnSquare>
      </BtnRow>
      <ShowLogBtn
        type="button"
        onClick={() => setView("showLog")}
        aria-label={SHOW_LOG_TITLE}
      >
        <ShowText>{SHOW_LOG_SHOW}</ShowText>
        <LogText>{SHOW_LOG_LOG}</LogText>
      </ShowLogBtn>
    </Wrap>
  );
}
