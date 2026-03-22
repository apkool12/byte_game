"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ARIA_GAME_SELECT_MODAL,
  BTN_RANK_RULES_CANCEL,
  GAME_SELECT_MODAL_TITLE,
} from "@/data/copy";
import { GAME_ENTRIES } from "@/data/adminGames";
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
  margin: 0 0 14px;
  text-align: center;
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 16px;
  font-weight: 700;
`;

const ListScroll = styled.div`
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

const GameRow = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 2px solid
    ${({ $active }) =>
      $active ? "rgba(245, 55, 106, 0.85)" : "rgba(255, 255, 255, 0.08)"};
  background: linear-gradient(180deg, #252525 0%, #121212 100%);
  color: #fff;
  text-align: left;
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
  box-sizing: border-box;
  flex-shrink: 0;

  &:active {
    opacity: 0.9;
  }
`;

const GameIndex = styled.span`
  display: inline-block;
  min-width: 1.5rem;
  margin-right: 8px;
  color: rgba(245, 55, 106, 0.95);
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 13px;
  font-weight: 800;
`;

const CloseBtn = styled.button`
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.92);
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;

  &:active {
    opacity: 0.88;
  }
`;

export interface GameSelectModalProps {
  open: boolean;
  value: string;
  onClose: () => void;
  onSelect: (gameId: string) => void;
}

export default function GameSelectModal({
  open,
  value,
  onClose,
  onSelect,
}: GameSelectModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label={ARIA_GAME_SELECT_MODAL}
      onClick={onClose}
    >
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>{GAME_SELECT_MODAL_TITLE}</Title>
        <ListScroll>
          {GAME_ENTRIES.map((g, idx) => (
            <GameRow
              key={g.id}
              type="button"
              $active={g.id === value}
              onClick={() => {
                onSelect(g.id);
                onClose();
              }}
            >
              <GameIndex>{idx + 1}.</GameIndex>
              {g.label}
            </GameRow>
          ))}
        </ListScroll>
        <CloseBtn type="button" onClick={onClose}>
          {BTN_RANK_RULES_CANCEL}
        </CloseBtn>
      </Card>
    </Overlay>,
    document.body,
  );
}
