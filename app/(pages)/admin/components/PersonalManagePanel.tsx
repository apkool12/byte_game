"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  LABEL_NAME,
  NOT_FOUND_TEXT,
  PLACEHOLDER_SEARCH_MEMBER,
  POINT_SUFFIX,
  SCORE_LABEL,
  BTN_INCREASE_SCORE,
  BTN_DECREASE_SCORE,
} from "@/data/copy";
import { getTeamById } from "@/data/teams";
import { getCurrentUser } from "@/data/currentUser";
import { getSocket } from "@/app/socketClient";
import styled from "@emotion/styled";
import type { PublicUser } from "@/types/user";
import ScoreAdjustModal from "./ScoreAdjustModal";

const Field = styled.div`
  margin-bottom: 24px;
  width: 100%;
  max-width: 280px;
`;

const Label = styled.label`
  display: block;
  font-size: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background:
    linear-gradient(
        90deg,
        rgba(119, 119, 119, 0.6) 0%,
        rgba(33, 33, 33, 0.6) 100%
      )
      bottom / 100% 1px no-repeat,
    transparent;
  color: #fff;
  font-size: 1rem;
  font-family: var(--font-pretendard-light);
  font-weight: 300;
  padding: 10px 0;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-family: var(--font-pretendard-black);
    font-weight: 900;
  }

  &:focus {
    background:
      linear-gradient(90deg, #e63946 0%, #c1121f 100%) bottom / 100% 2px
        no-repeat,
      transparent;
  }
`;

const SearchIcon = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

/** 검색 결과 카드: 검은 배경, 둥근 모서리, 상단·좌측 핑크 테두리 */
const ResultCard = styled.div`
  width: 100%;
  max-width: 280px;
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

const UserSection = styled.div`
  transform: translateY(-20px);
  padding: 16px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #000;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  text-align: center;
`;

const UserNameTeam = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  line-height: 1.3;
`;

const UserName = styled.span`
  font-family: var(--font-pretendard-black);
  font-weight: 900;
  font-size: 16px;
  color: #fff;
`;

const UserTeam = styled.span`
  font-family: var(--font-pretendard-ligth);
  font-weight: 400;
  font-size: 12px;
  color: #fff;
`;

const UserNoBadge = styled.span`
  position: relative;
  display: inline-block;
  padding: 4px 10px;
  font-size: 13px;
  font-family: var(--font-pretendard-light);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #fff;
  width: fit-content;

  /* 하이라이트 레이어 (세로만 절반 높이) — Header UserIdBadge와 동일 */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 60%;
    transform: translateY(-50%);
    height: 40%;
    border-radius: 2px;
    background: #58102f;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
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

const NotFound = styled.p`
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 24px 0 0;
  text-align: center;
  background: linear-gradient(
    90deg,
    #e0e0e0 0%,
    #ff8fa3 40%,
    #e63946 70%,
    #9e4141 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`;

function getScrollContainer(el: HTMLElement | null): HTMLElement | null {
  while (el) {
    const scrollContainer = el.closest?.("[data-scroll-container]");
    if (scrollContainer instanceof HTMLElement) return scrollContainer;
    const style = el.parentElement ? getComputedStyle(el.parentElement) : null;
    if (style?.overflowY === "auto" || style?.overflowY === "scroll") {
      return el.parentElement;
    }
    el = el.parentElement;
  }
  return null;
}

export default function PersonalManagePanel() {
  const [searchName, setSearchName] = useState("");
  const savedScrollTopRef = useRef<number>(0);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [scoreModalMode, setScoreModalMode] = useState<"increase" | "decrease">(
    "increase"
  );

  // 어드민 패널: 소켓 연결 + 서버 기준 조별 점수 실시간 반영 (차감/증가 후 표시 갱신)
  const [teamScores, setTeamScores] = useState<Record<string, number>>({});
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
    const socket = getSocket();
    const handleAllScores = (allScores: Record<string, number>) => {
      if (allScores && typeof allScores === "object") {
        setTeamScores(allScores);
      }
    };
    const handleScoreUpdated = (payload: { teamId: string; points: number }) => {
      if (payload?.teamId != null && typeof payload.points === "number") {
        setTeamScores((prev) => ({ ...prev, [payload.teamId]: payload.points }));
      }
    };
    socket.on("team:allScores", handleAllScores);
    socket.on("team:scoreUpdated", handleScoreUpdated);
    // 어드민은 소켓 연결 후에 마운트될 수 있어 allScores를 놓쳤을 수 있음 → 현재 점수 요청
    socket.emit("team:requestAllScores");
    return () => {
      socket.off("team:allScores", handleAllScores);
      socket.off("team:scoreUpdated", handleScoreUpdated);
    };
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  }, []);

  const saveScroll = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.currentTarget as HTMLInputElement;
    const container = getScrollContainer(target);
    if (container) savedScrollTopRef.current = container.scrollTop;
  }, []);

  const restoreScroll = useCallback(() => {
    const input = document.activeElement as HTMLInputElement | null;
    if (!input) return;
    const container = getScrollContainer(input);
    if (container) {
      const saved = savedScrollTopRef.current;
      requestAnimationFrame(() => {
        container.scrollTop = saved;
      });
      setTimeout(() => {
        container.scrollTop = saved;
      }, 50);
      setTimeout(() => {
        container.scrollTop = saved;
      }, 150);
    }
  }, []);

  const filteredMembers = useMemo(() => {
    const q = searchName.trim().toLowerCase();
    if (!q) return [];
    return publicUsers.filter((u) => u.name.toLowerCase().includes(q));
  }, [publicUsers, searchName]);

  // 검색 결과가 나타날 때 패널 스크롤을 맨 위로 고정해 화면이 밀리지 않도록 함
  useEffect(() => {
    if (filteredMembers.length === 0) return;
    const container = panelContentRef.current?.closest<HTMLElement>(
      "[data-scroll-container]"
    );
    if (container) {
      container.scrollTop = 0;
    }
  }, [filteredMembers.length]);

  return (
    <div ref={panelContentRef}>
      <Field>
        <Label htmlFor="admin-name-search">{LABEL_NAME}</Label>
        <InputRow>
          <Input
            id="admin-name-search"
            type="text"
            placeholder={PLACEHOLDER_SEARCH_MEMBER}
            value={searchName}
            onChange={handleChange}
            onMouseDown={saveScroll}
            onTouchStart={saveScroll}
            onFocus={restoreScroll}
            autoComplete="off"
          />
          <SearchIcon aria-hidden>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </SearchIcon>
        </InputRow>
      </Field>
      {filteredMembers.length === 0 ? (
        <NotFound>{NOT_FOUND_TEXT}</NotFound>
      ) : (
        (() => {
          const user = filteredMembers[0];
          const team = getTeamById(user.teamId);
          const displayNo = user.no ? `No.${user.no.padStart(3, "0")}` : "-";
          const liveScore =
            user.teamId in teamScores
              ? teamScores[user.teamId]
              : team?.points ?? 0;
          return (
            <>
            <ResultCard role="region" aria-label="검색 결과">
              <ScoreSection>
                <ScoreLabel>{SCORE_LABEL}</ScoreLabel>
                <ScoreValue>
                  {team != null ? `${liveScore}${POINT_SUFFIX}` : "-"}
                </ScoreValue>
              </ScoreSection>
              <UserSection>
                <Avatar>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/header-user.png" alt="" />
                </Avatar>
                <UserInfo>
                  <UserNameTeam>
                    <UserName>{user.name}</UserName>
                    <UserTeam>{team?.name ?? ""}</UserTeam>
                  </UserNameTeam>
                  <UserNoBadge>{displayNo}</UserNoBadge>
                </UserInfo>
              </UserSection>
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
              teamName={team?.name ?? ""}
              currentScore={liveScore}
              mode={scoreModalMode}
              onConfirm={(delta) => {
                const numDelta = Number(delta);
                if (user?.teamId && !Number.isNaN(numDelta) && numDelta !== 0) {
                  try {
                    const socket = getSocket();
                    socket.emit("admin:adjustScore", {
                      teamId: user.teamId,
                      delta: numDelta,
                      processorName: getCurrentUser()?.name ?? "알 수 없음",
                    });
                  } catch {
                    // 소켓 미연결 시 조용히 무시
                  }
                }
              }}
            />
            </>
          );
        })()
      )}
    </div>
  );
}
