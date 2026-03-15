"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import ShopModalCard from "./ShopModalCard";

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
  animation: ${({ $isClosing }) => ($isClosing ? overlayFadeOut : overlayFadeIn)} 0.25s ease-out forwards;

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

export interface ShopModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ShopModal({ open, onClose }: ShopModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) setIsClosing(false);
  }, [open]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), CLOSE_DURATION_MS);
  }, [onClose]);

  if (!open) return null;

  return (
    <Overlay
      $isClosing={isClosing}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="상점"
    >
      <ShopModalCard isClosing={isClosing} onClose={handleClose} />
    </Overlay>
  );
}
