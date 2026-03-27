"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ADMIN_GAME_MAX_ROOM,
  ADMIN_GAME_MAX_TEAM,
  ADMIN_GAME_MIN_ROOM,
  ADMIN_GAME_MIN_TEAM,
  ADMIN_GAME_SESSION_EVENT,
  type AdminGameSession,
  createDefaultRankRulesAllGames,
  formatAdminGameFooterLine,
  GAME_ENTRIES,
  getDefaultRankPenalties,
  getGameEntryById,
  getStoredAdminGameSession,
  saveAdminGameSession,
} from "@/data/adminGames";
import {
  ADMIN_GAME_SAVE_DONE,
  ADMIN_GAME_TIMER_START_FAIL,
  ADMIN_GAME_TIMER_STARTED,
  ARIA_ADMIN_GAME_DEC,
  ARIA_ADMIN_GAME_INC,
  BTN_ADMIN_GAME_SAVE,
  BTN_ADMIN_GAME_TIMER_START,
  BTN_OPEN_GAME_SELECT_MODAL,
  BTN_OPEN_RANK_RULES_MODAL,
  LABEL_ADMIN_GAME_RANK_RULES,
  LABEL_ADMIN_GAME_ROOM,
  LABEL_ADMIN_GAME_STAFF_TEAM,
  LABEL_ADMIN_GAME_TYPE,
} from "@/data/copy";
import styled from "@emotion/styled";
import GameRankRulesModal from "./GameRankRulesModal";
import GameSelectModal from "./GameSelectModal";
import { getSocket } from "@/app/socketClient";

const Wrap = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  box-sizing: border-box;
`;

const PreviewLine = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.82);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
  text-align: center;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BlockLabel = styled.span`
  color: rgba(255, 255, 255, 0.55);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const CurrentGamePick = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const StepBtn = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #2a2a2a 0%, #141414 100%);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.88;
  }
`;

const StepValue = styled.span`
  min-width: 52px;
  text-align: center;
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(180deg, #f5376a 0%, #8f203e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PanelOpenBtn = styled.button`
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #2a2a2a 0%, #141414 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.08);
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.9;
  }
`;

const SaveBtn = styled.button`
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #a11846 0%, #6e0f31 100%);
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.9;
  }
`;

const SaveHint = styled.p`
  margin: 0;
  min-height: 1.2em;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-pretendard-light), sans-serif;
`;

export default function GameManagePanel() {
  const [staffTeam, setStaffTeam] = useState(ADMIN_GAME_MIN_TEAM);
  const [roomNumber, setRoomNumber] = useState(ADMIN_GAME_MIN_ROOM);
  const [gameId, setGameId] = useState(
    () => getStoredAdminGameSession()?.gameId ?? GAME_ENTRIES[0].id,
  );
  const [rules, setRules] = useState<Record<string, number[]>>(
    createDefaultRankRulesAllGames,
  );
  const [hint, setHint] = useState("");
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [rankModalSnapshot, setRankModalSnapshot] = useState<number[]>(() =>
    getDefaultRankPenalties(),
  );

  useEffect(() => {
    const stored = getStoredAdminGameSession();
    if (stored) {
      setStaffTeam(stored.staffTeamNumber);
      setRoomNumber(stored.roomNumber);
      setGameId(stored.gameId);
      setRules(stored.rankPenaltiesByGameId);
    }
  }, []);

  const previewSession: AdminGameSession = {
    staffTeamNumber: staffTeam,
    roomNumber,
    gameId,
    rankPenaltiesByGameId: rules,
  };

  const openRankModal = useCallback(() => {
    setRankModalSnapshot([...(rules[gameId] ?? getDefaultRankPenalties())]);
    setRankModalOpen(true);
  }, [rules, gameId]);

  const bumpTeam = useCallback((delta: number) => {
    setStaffTeam((n) => {
      const next = n + delta;
      if (next < ADMIN_GAME_MIN_TEAM) return ADMIN_GAME_MAX_TEAM;
      if (next > ADMIN_GAME_MAX_TEAM) return ADMIN_GAME_MIN_TEAM;
      return next;
    });
  }, []);

  const bumpRoom = useCallback((delta: number) => {
    setRoomNumber((n) => {
      const next = n + delta;
      if (next < ADMIN_GAME_MIN_ROOM) return ADMIN_GAME_MAX_ROOM;
      if (next > ADMIN_GAME_MAX_ROOM) return ADMIN_GAME_MIN_ROOM;
      return next;
    });
  }, []);

  const save = useCallback(() => {
    const session: AdminGameSession = {
      staffTeamNumber: staffTeam,
      roomNumber,
      gameId,
      rankPenaltiesByGameId: rules,
    };
    saveAdminGameSession(session);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(ADMIN_GAME_SESSION_EVENT));
    }
    setHint(ADMIN_GAME_SAVE_DONE);
    window.setTimeout(() => setHint(""), 2000);
  }, [staffTeam, roomNumber, gameId, rules]);

  const startShopTimer = useCallback(() => {
    const session: AdminGameSession = {
      staffTeamNumber: staffTeam,
      roomNumber,
      gameId,
      rankPenaltiesByGameId: rules,
    };
    saveAdminGameSession(session);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(ADMIN_GAME_SESSION_EVENT));
    }
    const socket = getSocket();
    const onStartResult = (response: { ok?: boolean } | undefined) => {
      if (response?.ok) {
        setHint(ADMIN_GAME_TIMER_STARTED);
      } else {
        setHint(ADMIN_GAME_TIMER_START_FAIL);
      }
      window.setTimeout(() => setHint(""), 2000);
    };
    if (socket.connected) {
      socket.emit("admin:startShopRefreshTimer", null, onStartResult);
      return;
    }
    // 연결 지연 시 시작 요청을 connect 후 1회 재시도
    const onConnect = () => {
      socket.emit("admin:startShopRefreshTimer", null, onStartResult);
      socket.off("connect", onConnect);
    };
    socket.on("connect", onConnect);
  }, [staffTeam, roomNumber, gameId, rules]);

  const selectedGameLabel = getGameEntryById(gameId)?.label ?? "";

  return (
    <Wrap>
      <PreviewLine>{formatAdminGameFooterLine(previewSession)}</PreviewLine>

      <Block>
        <BlockLabel>{LABEL_ADMIN_GAME_STAFF_TEAM}</BlockLabel>
        <Stepper>
          <StepBtn
            type="button"
            aria-label={ARIA_ADMIN_GAME_DEC}
            onClick={() => bumpTeam(-1)}
          >
            −
          </StepBtn>
          <StepValue>{staffTeam}</StepValue>
          <StepBtn
            type="button"
            aria-label={ARIA_ADMIN_GAME_INC}
            onClick={() => bumpTeam(1)}
          >
            +
          </StepBtn>
        </Stepper>
      </Block>

      <Block>
        <BlockLabel>{LABEL_ADMIN_GAME_ROOM}</BlockLabel>
        <Stepper>
          <StepBtn
            type="button"
            aria-label={ARIA_ADMIN_GAME_DEC}
            onClick={() => bumpRoom(-1)}
          >
            −
          </StepBtn>
          <StepValue>{roomNumber}</StepValue>
          <StepBtn
            type="button"
            aria-label={ARIA_ADMIN_GAME_INC}
            onClick={() => bumpRoom(1)}
          >
            +
          </StepBtn>
        </Stepper>
      </Block>

      <Block>
        <BlockLabel>{LABEL_ADMIN_GAME_TYPE}</BlockLabel>
        <CurrentGamePick>{selectedGameLabel}</CurrentGamePick>
        <PanelOpenBtn type="button" onClick={() => setGameModalOpen(true)}>
          {BTN_OPEN_GAME_SELECT_MODAL}
        </PanelOpenBtn>
      </Block>

      <Block>
        <BlockLabel>{LABEL_ADMIN_GAME_RANK_RULES}</BlockLabel>
        <PanelOpenBtn type="button" onClick={openRankModal}>
          {BTN_OPEN_RANK_RULES_MODAL}
        </PanelOpenBtn>
      </Block>

      <SaveBtn type="button" onClick={save}>
        {BTN_ADMIN_GAME_SAVE}
      </SaveBtn>
      <SaveBtn type="button" onClick={startShopTimer}>
        {BTN_ADMIN_GAME_TIMER_START}
      </SaveBtn>
      <SaveHint>{hint}</SaveHint>

      <GameSelectModal
        open={gameModalOpen}
        value={gameId}
        onClose={() => setGameModalOpen(false)}
        onSelect={setGameId}
      />

      <GameRankRulesModal
        open={rankModalOpen}
        gameLabel={selectedGameLabel}
        initialRow={rankModalSnapshot}
        onClose={() => setRankModalOpen(false)}
        onConfirm={(row) => {
          setRules((prev) => ({ ...prev, [gameId]: row }));
        }}
      />
    </Wrap>
  );
}
