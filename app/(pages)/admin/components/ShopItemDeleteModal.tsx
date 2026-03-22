"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ARIA_SHOP_DELETE_MODAL,
  BTN_SHOP_DELETE,
  BTN_SHOP_MODAL_CANCEL,
  SHOP_DELETE_CONFIRM,
} from "@/data/copy";
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
  padding: 24px;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
`;

const Card = styled.div`
  width: 100%;
  max-width: 300px;
  border-radius: 16px;
  padding: 24px 20px 20px;
  background: linear-gradient(180deg, #252525 0%, #0f0f0f 100%);
  border: 1px solid rgba(227, 122, 123, 0.35);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
`;

const Message = styled.p`
  margin: 0 0 8px;
  text-align: center;
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.45;
`;

const NameLine = styled.p`
  margin: 0 0 22px;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-all;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalBtn = styled.button<{ $variant: "ghost" | "danger" }>`
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
    $variant === "danger"
      ? `
    background: linear-gradient(180deg, #a11846 0%, #6e0f31 100%);
    color: #fff;
  `
      : `
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.92);
  `}
`;

export interface ShopItemDeleteModalProps {
  open: boolean;
  itemName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ShopItemDeleteModal({
  open,
  itemName,
  onClose,
  onConfirm,
}: ShopItemDeleteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  if (!open || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label={ARIA_SHOP_DELETE_MODAL}
      onClick={onClose}
    >
      <Card onClick={(e) => e.stopPropagation()}>
        <Message>{SHOP_DELETE_CONFIRM}</Message>
        {itemName ? <NameLine>&ldquo;{itemName}&rdquo;</NameLine> : null}
        <BtnRow>
          <ModalBtn type="button" $variant="ghost" onClick={onClose}>
            {BTN_SHOP_MODAL_CANCEL}
          </ModalBtn>
          <ModalBtn type="button" $variant="danger" onClick={handleConfirm}>
            {BTN_SHOP_DELETE}
          </ModalBtn>
        </BtnRow>
      </Card>
    </Overlay>,
    document.body,
  );
}
