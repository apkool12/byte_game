"use client";

import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import DecoRing from "../login/components/DecoRing";
import LetterModal from "./components/LetterModal";

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

/** true면 메인에 게임 편지 + 안 읽음 1 표시 */
const HAS_UNREAD_LETTER = true;

/** 공포 느낌 햅틱: 불규칙한 짧은 진동 패턴 (지원 시에만) */
function triggerCreepyHaptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([80, 120, 60, 200, 100, 150, 80]);
  }
}

export default function MainPage() {
  const [mounted, setMounted] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [letterDismissed, setLetterDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !HAS_UNREAD_LETTER || letterDismissed) return;
    const t = setTimeout(triggerCreepyHaptic, 800);
    return () => clearTimeout(t);
  }, [mounted, letterDismissed]);

  const handleCloseLetter = () => {
    setLetterModalOpen(false);
    setLetterDismissed(true);
  };

  return (
    <Page>
      <LetterModal
        open={letterModalOpen}
        onClose={handleCloseLetter}
        userName="우은식"
        userNo="027"
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
        {HAS_UNREAD_LETTER && !letterDismissed && (
          <LetterBlock
            onClick={() => setLetterModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setLetterModalOpen(true)}
          >
            <LetterIcon>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/letter.svg" alt="편지" />
              <UnreadBadge>1</UnreadBadge>
            </LetterIcon>
            <LetterCaption>편지가 도착했습니다</LetterCaption>
          </LetterBlock>
        )}
      </div>
    </Page>
  );
}
