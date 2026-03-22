"use client";

import { useState, useEffect, useCallback } from "react";
import { ARIA_SCORE_ADJUST } from "@/data/copy";
import { MAX_TEAM_SCORE } from "@/data/room";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import ScoreAdjustModalCard from "./ScoreAdjustModalCard";

const overlayFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const overlayFadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Overlay = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: ${({ $isClosing }) => ($isClosing ? overlayFadeOut : overlayFadeIn)}
    0.25s ease-out forwards;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("/background_effect.png") center/cover repeat;
    opacity: 0.05;
    pointer-events: none;
  }
`;

const CLOSE_DURATION_MS = 420;

export interface ScoreAdjustModalProps {
  open: boolean;
  onClose: () => void;
  teamName: string;
  currentScore: number;
  mode: "increase" | "decrease";
  onConfirm: (delta: number) => void;
}

export default function ScoreAdjustModal({
  open,
  onClose,
  teamName,
  currentScore,
  mode,
  onConfirm,
}: ScoreAdjustModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (open) {
      setIsClosing(false);
      setAdjustAmount(0);
      setShakeKey(0);
    }
  }, [open]);

  const addAdjustAmount = useCallback(
    (amount: number) => {
      if (mode === "increase") {
        const cap = MAX_TEAM_SCORE - currentScore;
        setAdjustAmount((prev) => {
          const next = Math.min(prev + amount, cap);
          if (prev + amount > cap) setTimeout(() => setShakeKey((k) => k + 1), 0);
          return next;
        });
      } else {
        setAdjustAmount((prev) => prev + amount);
      }
    },
    [mode, currentScore],
  );

  const resetAdjustAmount = useCallback(() => {
    setAdjustAmount(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), CLOSE_DURATION_MS);
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    const delta =
      mode === "increase"
        ? Math.min(adjustAmount, MAX_TEAM_SCORE - currentScore)
        : -adjustAmount;
    if (delta !== 0) onConfirm(delta);
    handleClose();
  }, [mode, adjustAmount, currentScore, onConfirm, handleClose]);

  if (!open) return null;

  return (
    <Overlay
      $isClosing={isClosing}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={ARIA_SCORE_ADJUST}
    >
      <ScoreAdjustModalCard
        isClosing={isClosing}
        onClose={handleClose}
        teamName={teamName}
        currentScore={currentScore}
        adjustAmount={adjustAmount}
        mode={mode}
        shakeKey={shakeKey}
        onAddAmount={addAdjustAmount}
        onCancel={resetAdjustAmount}
        onConfirm={handleConfirm}
      />
    </Overlay>
  );
}
