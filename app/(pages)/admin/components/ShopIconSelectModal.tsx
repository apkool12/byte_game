"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ARIA_SHOP_ICON_PICK,
  BTN_SHOP_MODAL_CANCEL,
  SHOP_ICON_PICK_TITLE,
} from "@/data/copy";
import { SHOP_ITEM_ICON_OPTIONS } from "@/data/shopItems";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 260;
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
  padding: 20px 16px 16px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const IconCell = styled.button<{ $selected: boolean }>`
  aspect-ratio: 1;
  border-radius: 12px;
  border: 2px solid
    ${({ $selected }) =>
      $selected ? "rgba(245, 55, 106, 0.95)" : "rgba(255, 255, 255, 0.08)"};
  background: linear-gradient(180deg, #333 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  transition:
    border-color 0.15s ease,
    opacity 0.15s ease;

  &:active {
    opacity: 0.9;
  }

  img {
    width: 100%;
    max-width: 32px;
    height: 32px;
    object-fit: contain;
  }
`;

const CloseRow = styled.div`
  margin-top: 16px;
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

  &:active {
    opacity: 0.88;
  }
`;

export interface ShopIconSelectModalProps {
  open: boolean;
  value: string;
  onClose: () => void;
  onSelect: (iconSrc: string) => void;
}

export default function ShopIconSelectModal({
  open,
  value,
  onClose,
  onSelect,
}: ShopIconSelectModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted || typeof document === "undefined") return null;

  const options =
    SHOP_ITEM_ICON_OPTIONS.length > 0 ? SHOP_ITEM_ICON_OPTIONS : [value];

  return createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label={ARIA_SHOP_ICON_PICK}
      onClick={onClose}
    >
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>{SHOP_ICON_PICK_TITLE}</Title>
        <Grid>
          {options.map((src) => (
            <IconCell
              key={src}
              type="button"
              $selected={src === value}
              aria-label={src}
              onClick={() => {
                onSelect(src);
                onClose();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </IconCell>
          ))}
        </Grid>
        <CloseRow>
          <CloseBtn type="button" onClick={onClose}>
            {BTN_SHOP_MODAL_CANCEL}
          </CloseBtn>
        </CloseRow>
      </Card>
    </Overlay>,
    document.body,
  );
}
