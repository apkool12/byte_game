"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TEAM_SELECT_LABEL,
  TEAM_SELECT_BTN,
  TEAM_SELECT_PREV,
  TEAM_SELECT_NEXT,
  ARIA_TEAM_SELECT,
} from "@/data/copy";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

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
  animation: ${({ $isClosing }) =>
    $isClosing ? overlayFadeOut : overlayFadeIn}
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

const Box = styled.div<{ $isClosing?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 320px;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  padding: 28px 20px 24px;
  text-align: center;
  box-sizing: border-box;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ArrowBtn = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  color: #fff;
  font-size: 24px;
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

const TeamCard = styled.div`
  flex: 1;
  max-width: 160px;
  aspect-ratio: 1;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const TeamLabel = styled.span`
  font-family: var(--font-game-of-squids);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.36px;
  color: #fff;
`;

const TeamNumber = styled.span`
  font-family: var(--font-game-of-squids);
  font-size: 48px;
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
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
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

const MIN_TEAM = 1;
const MAX_TEAM = 10;

export interface TeamSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (teamNumber: number) => void;
}

export default function TeamSelectModal({
  open,
  onClose,
  onSelect,
}: TeamSelectModalProps) {
  const [selected, setSelected] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsClosing(false);
      setSelected(1);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  }, [onClose]);

  const handlePrev = useCallback(() => {
    setSelected((n) => (n <= MIN_TEAM ? MAX_TEAM : n - 1));
  }, []);

  const handleNext = useCallback(() => {
    setSelected((n) => (n >= MAX_TEAM ? MIN_TEAM : n + 1));
  }, []);

  const handleSelect = useCallback(() => {
    onSelect?.(selected);
    handleClose();
  }, [selected, onSelect, handleClose]);

  if (!open) return null;

  return (
    <Overlay
      $isClosing={isClosing}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={ARIA_TEAM_SELECT}
    >
      <Box $isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
        <Row>
          <ArrowBtn
            type="button"
            onClick={handlePrev}
            aria-label={TEAM_SELECT_PREV}
          >
            {TEAM_SELECT_PREV}
          </ArrowBtn>
          <TeamCard>
            <TeamLabel>{TEAM_SELECT_LABEL}</TeamLabel>
            <TeamNumber>{selected}</TeamNumber>
          </TeamCard>
          <ArrowBtn
            type="button"
            onClick={handleNext}
            aria-label={TEAM_SELECT_NEXT}
          >
            {TEAM_SELECT_NEXT}
          </ArrowBtn>
        </Row>
        <SelectBtn type="button" onClick={handleSelect}>
          {TEAM_SELECT_BTN}
        </SelectBtn>
      </Box>
    </Overlay>
  );
}
