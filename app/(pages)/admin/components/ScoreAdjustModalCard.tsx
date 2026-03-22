"use client";

import {
  ARIA_CLOSE,
  CONFIRM_OK,
  POINT_SUFFIX,
  SCORE_LABEL,
  SCORE_ADJUST_AMOUNT_5,
  SCORE_ADJUST_AMOUNT_10,
  SCORE_ADJUST_RESET,
} from "@/data/copy";
import { MAX_TEAM_SCORE } from "@/data/room";
import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";

const letterUnfold = keyframes`
  from {
    opacity: 0;
    transform: perspective(600px) rotateX(-18deg) translateY(20px) scale(0.94);
  }
  to {
    opacity: 1;
    transform: perspective(600px) rotateX(0deg) translateY(0) scale(1);
  }
`;

const letterFold = keyframes`
  from {
    opacity: 1;
    transform: perspective(600px) rotateX(0deg) translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: perspective(600px) rotateX(-18deg) translateY(20px) scale(0.94);
  }
`;

const contentFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
`;

const Box = styled.div<{ $isClosing?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 320px;
  border-radius: 16px;
  background: linear-gradient(180deg, #1a1919 0%, #0d0d0d 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  border: 1px solid rgba(227, 122, 123, 0.35);
  border-top: none;
  animation: ${({ $isClosing }) => ($isClosing ? letterFold : letterUnfold)}
    0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transform-origin: center top;
`;

const TopBar = styled.div`
  height: 10px;
  background: linear-gradient(90deg, #ff007a 0%, #ff26b4 100%);
`;

const BoxInner = styled.div`
  padding: 20px 20px 28px;
  text-align: center;
  animation: ${contentFadeIn} 0.4s ease-out 0.2s both;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  z-index: 2;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/** 유저 조 — NeoDunggeunmo Pro */
const TeamTitle = styled.h2`
  margin: 0 0 20px;
  font-family: "NeoDunggeunmo Pro", var(--font-neo-donggeunmo), sans-serif;
  font-size: 24px;
  font-weight: normal;
  color: #949494;
  text-align: center;
`;

const ScoreBlock = styled.div<{ $labelSize?: number }>`
  margin-bottom: 8px;
  font-family: var(--font-game-of-squids);
  font-size: ${({ $labelSize = 28 }) => $labelSize}px;
  letter-spacing: 0.02em;
  text-align: center;
`;

const ScoreLabel = styled.div`
  background: linear-gradient(90deg, #7f7f7f 0%, #e5e5e5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ScoreValue = styled.div<{ $atCap?: boolean }>`
  font-size: 2em;
  color: ${({ $atCap }) => ($atCap ? "#e63946" : "#858585")};
  line-height: 1.2;
  ${({ $atCap }) => $atCap && css`animation: ${shake} 0.5s ease-in-out;`}
`;

const ScoreDivider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(119, 119, 119, 0.6) 0%,
    rgba(33, 33, 33, 0.6) 100%
  );
  margin: 12px 0 20px;
`;

const AmountRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
`;

const ActionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const BtnBase = styled.button`
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  color: #e5e5e5;
  cursor: pointer;
  transition: opacity 0.2s ease;
  font-family: var(--font-game-of-squids);
  &:active {
    opacity: 0.9;
  }
`;

const AmountBtn = styled(BtnBase)`
  width: 72px;
  height: 72px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionBtn = styled(BtnBase)`
  width: 100%;
  max-width: 200px;
  padding: 14px 20px;
  font-size: 16px;
`;

export interface ScoreAdjustModalCardProps {
  isClosing?: boolean;
  onClose: () => void;
  teamName: string;
  currentScore: number;
  adjustAmount: number;
  mode: "increase" | "decrease";
  shakeKey?: number;
  onAddAmount: (amount: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ScoreAdjustModalCard({
  isClosing = false,
  onClose,
  teamName,
  currentScore,
  adjustAmount,
  mode,
  shakeKey = 0,
  onAddAmount,
  onCancel,
  onConfirm,
}: ScoreAdjustModalCardProps) {
  const finalScore =
    mode === "increase"
      ? Math.min(MAX_TEAM_SCORE, currentScore + adjustAmount)
      : Math.max(0, currentScore - adjustAmount);

  const atCap =
    mode === "increase" && currentScore + adjustAmount >= MAX_TEAM_SCORE;

  return (
    <Box $isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
      <TopBar />
      <CloseBtn type="button" onClick={onClose} aria-label={ARIA_CLOSE}>
        ✕
      </CloseBtn>
      <BoxInner>
        <TeamTitle>{teamName}</TeamTitle>
        <ScoreBlock $labelSize={28}>
          <ScoreLabel>{SCORE_LABEL}</ScoreLabel>
          <ScoreValue>
            {finalScore}
            {POINT_SUFFIX}
          </ScoreValue>
        </ScoreBlock>
        <ScoreBlock $labelSize={12}>
          <ScoreLabel>{SCORE_LABEL}</ScoreLabel>
          <ScoreValue key={atCap ? shakeKey : undefined} $atCap={atCap}>
            {adjustAmount}
          </ScoreValue>
        </ScoreBlock>
        <ScoreDivider />
        <AmountRow>
          <AmountBtn
            type="button"
            onClick={() => onAddAmount(5)}
            aria-label={`${SCORE_ADJUST_AMOUNT_5}${POINT_SUFFIX}`}
          >
            {SCORE_ADJUST_AMOUNT_5}
          </AmountBtn>
          <AmountBtn
            type="button"
            onClick={() => onAddAmount(10)}
            aria-label={`${SCORE_ADJUST_AMOUNT_10}${POINT_SUFFIX}`}
          >
            {SCORE_ADJUST_AMOUNT_10}
          </AmountBtn>
        </AmountRow>
        <ActionRow>
          <ActionBtn type="button" onClick={onConfirm}>
            {CONFIRM_OK}
          </ActionBtn>
          <ActionBtn type="button" onClick={onCancel}>
            {SCORE_ADJUST_RESET}
          </ActionBtn>
        </ActionRow>
      </BoxInner>
    </Box>
  );
}
