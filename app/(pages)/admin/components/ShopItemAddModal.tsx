"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ARIA_SHOP_ADD_MODAL,
  BTN_SHOP_ADD_SUBMIT,
  BTN_SHOP_MODAL_CANCEL,
  DEFAULT_NEW_SHOP_ITEM_NAME,
  LABEL_SHOP_ITEM_ICON,
  LABEL_SHOP_ITEM_NAME,
  LABEL_SHOP_ITEM_PRICE,
  POINT_SUFFIX,
  SHOP_ADD_ITEM_MODAL_TITLE,
} from "@/data/copy";
import { SHOP_ITEM_ICON_OPTIONS } from "@/data/shopItems";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const DEFAULT_ICON =
  SHOP_ITEM_ICON_OPTIONS[0] ?? "/item-quesiton.svg";

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
  max-width: 320px;
  max-height: min(85vh, 560px);
  overflow-y: auto;
  border-radius: 16px;
  padding: 22px 18px 18px;
  background: linear-gradient(180deg, #252525 0%, #0f0f0f 100%);
  border: 1px solid rgba(227, 122, 123, 0.35);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
`;

const Title = styled.h3`
  margin: 0 0 18px;
  text-align: center;
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 17px;
  font-weight: 700;
`;

const PreviewWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

const PreviewCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff 0%, #e8e8e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;

const FieldLabel = styled.label`
  display: block;
  margin: 14px 0 8px;
  color: rgba(255, 255, 255, 0.65);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const SectionLabel = styled.span`
  display: block;
  margin: 14px 0 8px;
  color: rgba(255, 255, 255, 0.65);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PriceInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  box-sizing: border-box;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PriceSuffix = styled.span`
  color: rgba(255, 255, 255, 0.75);
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const IconCell = styled.button<{ $selected: boolean }>`
  aspect-ratio: 1;
  border-radius: 10px;
  border: 2px solid
    ${({ $selected }) =>
      $selected ? "rgba(245, 55, 106, 0.95)" : "rgba(255, 255, 255, 0.08)"};
  background: linear-gradient(180deg, #2e2e2e 0%, #161616 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 6px;

  &:active {
    opacity: 0.92;
  }

  img {
    width: 100%;
    max-width: 30px;
    height: 30px;
    object-fit: contain;
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 22px;
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

export interface ShopItemAddModalPayload {
  name: string;
  price: number;
  iconSrc: string;
}

export interface ShopItemAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (payload: ShopItemAddModalPayload) => void;
}

export default function ShopItemAddModal({
  open,
  onClose,
  onAdd,
}: ShopItemAddModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(DEFAULT_NEW_SHOP_ITEM_NAME);
  const [price, setPrice] = useState(500);
  const [iconSrc, setIconSrc] = useState(DEFAULT_ICON);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setName(DEFAULT_NEW_SHOP_ITEM_NAME);
    setPrice(500);
    setIconSrc(SHOP_ITEM_ICON_OPTIONS[0] ?? DEFAULT_ICON);
  }, [open]);

  const iconOptions =
    SHOP_ITEM_ICON_OPTIONS.length > 0 ? SHOP_ITEM_ICON_OPTIONS : [DEFAULT_ICON];

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const p = Math.max(0, Math.floor(Number(price)) || 0);
    onAdd({ name: trimmed, price: p, iconSrc });
    onClose();
  }, [name, price, iconSrc, onAdd, onClose]);

  if (!open || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-label={ARIA_SHOP_ADD_MODAL}
      onClick={onClose}
    >
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>{SHOP_ADD_ITEM_MODAL_TITLE}</Title>
        <PreviewWrap>
          <PreviewCircle>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconSrc} alt="" />
          </PreviewCircle>
        </PreviewWrap>
        <SectionLabel>{LABEL_SHOP_ITEM_ICON}</SectionLabel>
        <IconGrid role="group" aria-label={LABEL_SHOP_ITEM_ICON}>
          {iconOptions.map((src) => (
            <IconCell
              key={src}
              type="button"
              $selected={src === iconSrc}
              aria-label={src}
              onClick={() => setIconSrc(src)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </IconCell>
          ))}
        </IconGrid>
        <FieldLabel htmlFor="shop-add-name">{LABEL_SHOP_ITEM_NAME}</FieldLabel>
        <TextInput
          id="shop-add-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <FieldLabel htmlFor="shop-add-price">{LABEL_SHOP_ITEM_PRICE}</FieldLabel>
        <PriceRow>
          <PriceInput
            id="shop-add-price"
            type="number"
            min={0}
            step={1}
            value={Number.isNaN(price) ? "" : price}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") {
                setPrice(0);
                return;
              }
              const n = Math.floor(Number(v));
              if (!Number.isNaN(n)) setPrice(n);
            }}
          />
          <PriceSuffix>{POINT_SUFFIX}</PriceSuffix>
        </PriceRow>
        <BtnRow>
          <ModalBtn type="button" $variant="ghost" onClick={onClose}>
            {BTN_SHOP_MODAL_CANCEL}
          </ModalBtn>
          <ModalBtn type="button" $variant="primary" onClick={handleSubmit}>
            {BTN_SHOP_ADD_SUBMIT}
          </ModalBtn>
        </BtnRow>
      </Card>
    </Overlay>,
    document.body,
  );
}
