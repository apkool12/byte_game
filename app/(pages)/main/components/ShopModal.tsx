"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ARIA_SHOP,
  SHOP_CATALOG_EMPTY,
  SHOP_CATALOG_LOADING,
  SHOP_CATALOG_LOAD_FAIL,
} from "@/data/copy";
import type { ShopItemRecord } from "@/data/shopItems";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import ShopModalCard from "./ShopModalCard";
import {
  pickRandomShopItemsFromRecords,
  type ShopItemData,
} from "./shopItems";

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
  /** null = 로딩 중, [] = 비어 있음 또는 실패 후 빈 목록 */
  catalogRecords: ShopItemRecord[] | null;
  catalogError?: boolean;
}

export default function ShopModal({
  open,
  onClose,
  catalogRecords,
  catalogError = false,
}: ShopModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [displayItems, setDisplayItems] = useState<ShopItemData[] | null>(
    null,
  );

  useEffect(() => {
    if (open) setIsClosing(false);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setDisplayItems(null);
      return;
    }
    if (catalogRecords === null) {
      setDisplayItems(null);
      return;
    }
    setDisplayItems(pickRandomShopItemsFromRecords(catalogRecords));
  }, [open, catalogRecords]);

  const statusMessage = useMemo(() => {
    if (catalogRecords === null && !catalogError) return SHOP_CATALOG_LOADING;
    if (catalogError) return SHOP_CATALOG_LOAD_FAIL;
    if (catalogRecords !== null && catalogRecords.length === 0)
      return SHOP_CATALOG_EMPTY;
    return null;
  }, [catalogRecords, catalogError]);

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
      aria-label={ARIA_SHOP}
    >
      <ShopModalCard
        isClosing={isClosing}
        onClose={handleClose}
        items={displayItems}
        statusMessage={statusMessage}
      />
    </Overlay>
  );
}
