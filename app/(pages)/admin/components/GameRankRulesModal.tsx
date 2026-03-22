"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ARIA_GAME_RANK_RULES_MODAL,
  BTN_RANK_RULES_CANCEL,
  BTN_RANK_RULES_CONFIRM,
  GAME_RANK_RULES_MODAL_TITLE,
  HINT_ADMIN_RANK_RULE_DELTA,
  LABEL_RANK_PLACE,
  POINT_SUFFIX,
} from "@/data/copy";
import { RANK_PLACE_COUNT } from "@/data/adminGames";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 250;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
`;

const Card = styled.div`
  width: 100%;
  max-width: 320px;
  max-height: min(88vh, 520px);
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 18px 16px 16px;
  background: linear-gradient(180deg, #252525 0%, #0f0f0f 100%);
  border: 1px solid rgba(227, 122, 123, 0.35);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
`;

const Title = styled.h3`
  margin: 0 0 4px;
  text-align: center;
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
`;

const SubTitle = styled.p`
  margin: 0 0 10px;
  text-align: center;
  color: rgba(245, 55, 106, 0.95);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 13px;
  font-weight: 600;
`;

const HintText = styled.p`
  margin: 0 0 12px;
  font-size: 10px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.42);
  font-family: var(--font-pretendard-light), sans-serif;
  text-align: center;
`;

const RankScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
  margin-bottom: 14px;
`;

const RankRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RankPlace = styled.span`
  flex: 0 0 38px;
  color: rgba(255, 255, 255, 0.78);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 13px;
  font-weight: 600;
`;

const RankInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  outline: none;
  box-sizing: border-box;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const RankSuffix = styled.span`
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.45);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 12px;
  font-weight: 600;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;
`;

const ModalBtn = styled.button<{ $variant: "ghost" | "primary" }>`
  flex: 1;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.88;
  }

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(180deg, #a11846 0%, #6e0f31 100%);
    color: #fff;
  `
      : `
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.92);
  `}
`;

function clampDelta(n: number): number {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  return Math.min(1000, Math.max(-1000, Math.round(n)));
}

export interface GameRankRulesModalProps {
  open: boolean;
  gameLabel: string;
  initialRow: number[];
  onClose: () => void;
  onConfirm: (row: number[]) => void;
}

export default function GameRankRulesModal({
  open,
  gameLabel,
  initialRow,
  onClose,
  onConfirm,
}: GameRankRulesModalProps) {
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<number[]>(() => [...initialRow]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setDraft([...initialRow]);
  }, [open, initialRow]);

  const setPlaceDelta = useCallback((placeIndex: number, raw: string) => {
    setDraft((prev) => {
      const row = [...prev];
      if (raw.trim() === "") {
        row[placeIndex] = 0;
      } else {
        const n = Number(raw);
        if (!Number.isNaN(n)) row[placeIndex] = clampDelta(n);
      }
      return row;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(draft);
    onClose();
  }, [draft, onConfirm, onClose]);

  if (!open || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label={ARIA_GAME_RANK_RULES_MODAL}
      onClick={onClose}
    >
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>{GAME_RANK_RULES_MODAL_TITLE}</Title>
        <SubTitle>{gameLabel}</SubTitle>
        <HintText>{HINT_ADMIN_RANK_RULE_DELTA}</HintText>
        <RankScroll>
          {Array.from({ length: RANK_PLACE_COUNT }, (_, i) => {
            const v = draft[i] ?? 0;
            return (
              <RankRow key={i}>
                <RankPlace>{LABEL_RANK_PLACE(i + 1)}</RankPlace>
                <RankInput
                  aria-label={`${LABEL_RANK_PLACE(i + 1)} 점수 델타`}
                  type="number"
                  step={1}
                  value={v}
                  onChange={(e) => setPlaceDelta(i, e.target.value)}
                />
                <RankSuffix>{POINT_SUFFIX}</RankSuffix>
              </RankRow>
            );
          })}
        </RankScroll>
        <BtnRow>
          <ModalBtn type="button" $variant="ghost" onClick={onClose}>
            {BTN_RANK_RULES_CANCEL}
          </ModalBtn>
          <ModalBtn type="button" $variant="primary" onClick={handleConfirm}>
            {BTN_RANK_RULES_CONFIRM}
          </ModalBtn>
        </BtnRow>
      </Card>
    </Overlay>,
    document.body,
  );
}
