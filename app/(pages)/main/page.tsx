"use client";

import { useCallback, useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { getCurrentUser } from "@/data/currentUser";
import { ARIA_CLOCK, ARIA_SCORE_SHOP } from "@/data/app";
import { letterCopy } from "@/data/letterCopy";
import DecoRing from "../login/components/DecoRing";
import LetterModal from "./components/LetterModal";
import ShopModal from "./components/ShopModal";
import GameClock from "./components/GameClock";
import ScoreCard from "./components/ScoreCard";
import { getSocket } from "@/app/socketClient";
import ShopCard from "./components/ShopCard";
import type { ShopItemRecord } from "@/data/shopItems";

const entranceFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/* 안 읽은 편지: 느리고 은은하게 움직여 분위기 있게 */
const letterUnread = keyframes`
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.92; }
  33% { transform: translateY(-5px) translateX(3px); opacity: 1; }
  66% { transform: translateY(-2px) translateX(-2px); opacity: 0.96; }
`;

const Page = styled.main`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  @supports (-webkit-appearance: none) and (stroke-color: transparent) {
    min-height: -webkit-fill-available;
  }
  background: linear-gradient(180deg, #000000 0%, #1f0707 100%);
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-game-of-squids);
`;

const TextureOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0.05;
  }
`;

const TopRightDeco = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  animation: ${entranceFadeIn} 1.4s ease-out 0.2s both;
`;

const LetterBlock = styled.div`
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: ${entranceFadeIn} 1.4s ease-out 0.4s both;
  cursor: pointer;
`;

const LetterCaption = styled.span`
  font-family: var(--font-healthset-gothic-light);
  font-size: 24px;
  font-weight: 300;
  color: #fff;
  white-space: nowrap;
`;

const LetterIcon = styled.div`
  position: relative;
  width: 140px;
  height: 104px;
  animation: ${letterUnread} 5s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 36px;
  height: 36px;
  padding: 0 9px;
  border-radius: 50%;
  background: #e63946;
  color: #fff;
  font-family: var(--font-pretendard-light);
  font-size: 21px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ClockSection = styled.section`
  position: absolute;
  left: 30%;
  top: 5%;
  transform: translate(-50%, -50%);
  z-index: 2;
  animation: ${entranceFadeIn} 0.6s ease-out both;
`;

const ScoreShopSection = styled.section`
  position: absolute;
  left: -24px;
  right: -24px;
  bottom: 294px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: ${entranceFadeIn} 0.6s ease-out 0.2s both;
`;

const ScoreCardWrap = styled.div`
  transform: translateY(12px);
`;

const ShopCardWrap = styled.div`
  transform: translateY(12px);
`;

const LETTER_SEEN_STORAGE_PREFIX = "byte-game-letter-seen:";

/** 공포 느낌 햅틱: 불규칙한 짧은 진동 패턴 (지원 시에만) */
function triggerCreepyHaptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([80, 120, 60, 200, 100, 150, 80]);
  }
}

export default function MainPage() {
  const [mounted, setMounted] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [hasUnreadLetter, setHasUnreadLetter] = useState(true);
  const [letterDismissed, setLetterDismissed] = useState(false);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [shopCatalog, setShopCatalog] = useState<ShopItemRecord[] | null>(null);
  const [shopCatalogError, setShopCatalogError] = useState(false);
  const [teamScore, setTeamScore] = useState(0);
  const [pendingTeamScore, setPendingTeamScore] = useState<number | null>(null);

  const loadShopCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/shop/catalog");
      if (!res.ok) {
        setShopCatalog([]);
        setShopCatalogError(true);
        return;
      }
      const data: unknown = await res.json();
      const raw =
        data && typeof data === "object" && "items" in data
          ? (data as { items: unknown }).items
          : null;
      if (!Array.isArray(raw)) {
        setShopCatalog([]);
        setShopCatalogError(true);
        return;
      }
      const next: ShopItemRecord[] = [];
      for (const row of raw) {
        if (!row || typeof row !== "object") continue;
        const o = row as Record<string, unknown>;
        const id = typeof o.id === "string" ? o.id : "";
        const name = typeof o.name === "string" ? o.name : "";
        const price = Number(o.price);
        const iconSrc =
          typeof o.iconSrc === "string" ? o.iconSrc : "/item-quesiton.svg";
        if (!id || !name || Number.isNaN(price)) continue;
        next.push({ id, name, price, iconSrc });
      }
      setShopCatalogError(false);
      setShopCatalog(next);
    } catch {
      setShopCatalog([]);
      setShopCatalogError(true);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 편지는 "유저별로 최초 1회만" 보여주기 (localStorage 기반)
  useEffect(() => {
    if (!mounted) return;
    const user = getCurrentUser();
    if (!user?.id) return;
    const key = `${LETTER_SEEN_STORAGE_PREFIX}${user.id}`;
    const seen = window.localStorage.getItem(key) === "1";
    if (seen) {
      setHasUnreadLetter(false);
      setLetterDismissed(true);
      setLetterModalOpen(false);
      return;
    }
    setHasUnreadLetter(true);
    setLetterDismissed(false);
    // 로그인 직후 편지는 1회 자동 오픈
    const t = setTimeout(() => {
      setLetterModalOpen(true);
    }, 250);
    return () => clearTimeout(t);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    void loadShopCatalog();
  }, [mounted, loadShopCatalog]);

  useEffect(() => {
    if (!mounted) return;
    const socket = getSocket();
    const onCatalogChanged = () => {
      void loadShopCatalog();
    };
    socket.on("shop:catalogChanged", onCatalogChanged);
    return () => {
      socket.off("shop:catalogChanged", onCatalogChanged);
    };
  }, [mounted, loadShopCatalog]);

  useEffect(() => {
    if (!mounted || !hasUnreadLetter || letterDismissed) return;
    const t = setTimeout(triggerCreepyHaptic, 800);
    return () => clearTimeout(t);
  }, [mounted, hasUnreadLetter, letterDismissed]);

  const handleCloseLetter = () => {
    setLetterModalOpen(false);
    setLetterDismissed(true);
    const user = getCurrentUser();
    if (user?.id) {
      window.localStorage.setItem(`${LETTER_SEEN_STORAGE_PREFIX}${user.id}`, "1");
    }
    setHasUnreadLetter(false);
  };

  const currentUser = getCurrentUser();

  // 소켓으로 조 점수 초기 로드 + 실시간 업데이트
  useEffect(() => {
    if (!mounted) return;
    const user = currentUser;
    if (!user) return;

    const socket = getSocket();
    const handleAllScores = (allScores: Record<string, number>) => {
      const points = allScores[user.teamId];
      if (typeof points === "number") {
        // 모달이 열려 있으면, 닫힌 뒤에 한 번에 반영
        if (shopModalOpen) {
          setPendingTeamScore(points);
        } else {
          setTeamScore(points);
        }
      }
    };
    const handleScoreUpdated = (payload: { teamId: string; points: number }) => {
      if (payload.teamId === user.teamId) {
        if (shopModalOpen) {
          setPendingTeamScore(payload.points);
        } else {
          setTeamScore(payload.points);
        }
      }
    };

    socket.on("team:allScores", handleAllScores);
    socket.on("team:scoreUpdated", handleScoreUpdated);
    // 연결 시점에 이미 allScores 이벤트가 지나갔을 수 있으니, 리스너 등록 후 한 번 요청
    socket.emit("team:requestAllScores");
    return () => {
      socket.off("team:allScores", handleAllScores);
      socket.off("team:scoreUpdated", handleScoreUpdated);
    };
  }, [mounted, currentUser, shopModalOpen]);

  // 상점 모달이 닫힐 때, 쌓아둔 점수 업데이트를 살짝 딜레이 후 적용
  useEffect(() => {
    if (!shopModalOpen && pendingTeamScore !== null) {
      const t = setTimeout(() => {
        setTeamScore(pendingTeamScore);
        setPendingTeamScore(null);
      }, 200); // 모달 닫힘 애니메이션 후 게이지 변화가 보이도록 약간 지연
      return () => clearTimeout(t);
    }
  }, [shopModalOpen, pendingTeamScore]);

  return (
    <Page>
      <LetterModal
        open={letterModalOpen}
        onClose={handleCloseLetter}
        userName={currentUser?.name}
        userNo={currentUser?.no}
      />
      <ShopModal
        open={shopModalOpen}
        onClose={() => setShopModalOpen(false)}
        catalogRecords={shopCatalog}
        catalogError={shopCatalogError}
      />
      <div
        className={`hide-until-hydrated ${mounted ? "mounted" : ""}`}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100dvh",
        }}
      >
        <TextureOverlay>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/background_effect.png" alt="" />
        </TextureOverlay>
        <TopRightDeco>
          <DecoRing transform="translate(30px, 20px) scale(1.2)" />
        </TopRightDeco>
        {hasUnreadLetter && !letterDismissed && (
          <LetterBlock
            onClick={() => setLetterModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setLetterModalOpen(true)}
          >
            <LetterIcon>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/letter.svg" alt={letterCopy.letterAlt} />
              <UnreadBadge>{letterCopy.unreadBadgeCount}</UnreadBadge>
            </LetterIcon>
            <LetterCaption>{letterCopy.letterCaption}</LetterCaption>
          </LetterBlock>
        )}
        {letterDismissed && (
          <>
            <ClockSection aria-label={ARIA_CLOCK}>
              <GameClock />
            </ClockSection>
            <ScoreShopSection aria-label={ARIA_SCORE_SHOP}>
              <ScoreCardWrap>
                <ScoreCard score={teamScore} />
              </ScoreCardWrap>
              <ShopCardWrap>
                <ShopCard onClick={() => setShopModalOpen(true)} />
              </ShopCardWrap>
            </ScoreShopSection>
          </>
        )}
      </div>
    </Page>
  );
}
