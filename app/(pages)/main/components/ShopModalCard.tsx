"use client";

import { useMemo, useState } from "react";
import { APP_NAME_ALT } from "@/data/app";
import { getCurrentUser } from "@/data/currentUser";
import {
  ARIA_CLOSE,
  CONFIRM_BUY,
  CONFIRM_CANCEL,
  CONFIRM_OK,
  POINT_SUFFIX,
} from "@/data/copy";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { type ShopItemData } from "./shopItems";
import { getSocket } from "@/app/socketClient";

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
  background: linear-gradient(90deg, #f5376a 0%, #ff61a6 100%);
`;

const BoxInner = styled.div`
  padding: 20px 20px 28px;
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

const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  img {
    width: 140px;
    height: auto;
    display: block;
  }
`;

const StatusText = styled.p`
  margin: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 15px;
  line-height: 1.5;
  padding: 8px 0 4px;
`;

const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ItemRow = styled.li`
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
`;

const IconCircleOuter = styled.div`
  flex-shrink: 0;
  padding: 18px;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff 0%, #510000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  position: relative;
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff 0%, #f0f0f0 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrap = styled.span`
  position: relative;
  z-index: 1;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1919;
`;

const ItemStrip = styled.div`
  flex: 1;
  min-width: 0;
  margin-left: -28px;
  padding: 6px 14px 6px 36px;
  border-radius: 0 50px 0 0;
  background: linear-gradient(90deg, #f33e6c 0%, #6c001c 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  z-index: 0;
`;

const ItemName = styled.span`
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  font-family: var(--font-yeotnal-sajingwan5), serif;
  font-size: 23px;
  font-style: normal;
  font-weight: normal;
  line-height: 132%;
  letter-spacing: -0.5px;
`;

const ItemPrice = styled.span`
  color: rgba(255, 255, 255, 0.52);

  font-family: var(--font-krafton), sans-serif;
  font-size: 18px;
  font-weight: normal;
  line-height: 132%;
  letter-spacing: -0.5px;
  opacity: 0.95;
`;

const ConfirmOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  border-radius: inherit;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ConfirmBox = styled.div`
  background: linear-gradient(180deg, #1a1919 0%, #0d0d0d 100%);
  border: 1px solid rgba(227, 122, 123, 0.35);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 260px;
  text-align: center;
`;

const ConfirmMessage = styled.p`
  margin: 0 0 20px;
  color: #fff;
  font-family: var(--font-yeotnal-sajingwan5), serif;
  font-size: 18px;
  line-height: 1.5;
`;

const ConfirmPrice = styled.span`
  display: block;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-krafton), sans-serif;
  font-size: 16px;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ConfirmBtn = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
  ${({ $primary }) =>
    $primary
      ? `
    background: linear-gradient(90deg, #f5376a 0%, #ff61a6 100%);
    color: #fff;
  `
      : `
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  `}
`;

export type { ShopItemData } from "./shopItems";

export interface ShopModalCardProps {
  isClosing?: boolean;
  onClose: () => void;
  /** null 이면 로딩 등 — statusMessage 표시 */
  items: ShopItemData[] | null;
  /** 로딩·에러 안내 (있으면 목록 대신 또는 함께 표시) */
  statusMessage?: string | null;
}

export default function ShopModalCard({
  isClosing = false,
  onClose,
  items,
  statusMessage = null,
}: ShopModalCardProps) {
  const listItems = useMemo(() => items ?? [], [items]);
  const [confirmingItem, setConfirmingItem] = useState<ShopItemData | null>(
    null,
  );
  const currentUser = getCurrentUser();

  return (
    <Box $isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
      <TopBar />
      <CloseBtn type="button" onClick={onClose} aria-label={ARIA_CLOSE}>
        ✕
      </CloseBtn>
      <BoxInner>
        <LogoWrap>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/byte_game_logo.svg" alt={APP_NAME_ALT} />
        </LogoWrap>
        {statusMessage ? <StatusText>{statusMessage}</StatusText> : null}
        {listItems.length > 0 ? (
          <ItemList>
            {listItems.map((item) => (
              <ItemRow
                key={item.id}
                onClick={() => setConfirmingItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setConfirmingItem(item)
                }
              >
                <IconCircleOuter>
                  <IconCircle>
                    <IconWrap>{item.icon}</IconWrap>
                  </IconCircle>
                </IconCircleOuter>
                <ItemStrip>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>
                    {item.price}
                    {POINT_SUFFIX}
                  </ItemPrice>
                </ItemStrip>
              </ItemRow>
            ))}
          </ItemList>
        ) : null}
      </BoxInner>
      {confirmingItem && (
        <ConfirmOverlay onClick={(e) => e.stopPropagation()}>
          <ConfirmBox onClick={(e) => e.stopPropagation()}>
            <ConfirmMessage>
              {confirmingItem.name}
              <ConfirmPrice>
                {confirmingItem.price}
                {POINT_SUFFIX} {CONFIRM_BUY}
              </ConfirmPrice>
            </ConfirmMessage>
            <ConfirmButtons>
              <ConfirmBtn type="button" onClick={() => setConfirmingItem(null)}>
                {CONFIRM_CANCEL}
              </ConfirmBtn>
              <ConfirmBtn
                $primary
                type="button"
                onClick={() => {
                  setConfirmingItem(null);
                  if (currentUser) {
                    // 소켓 서버로 구매 이벤트 전송 (실시간 동기화용)
                    try {
                      const socket = getSocket();
                      socket.emit("team:buyItem", {
                        teamId: currentUser.teamId,
                        itemId: confirmingItem.id,
                        price: confirmingItem.price,
                      });
                    } catch {
                      // 소켓 연결 실패 시에는 조용히 실패
                    }
                  }
                  onClose();
                }}
              >
                {CONFIRM_OK}
              </ConfirmBtn>
            </ConfirmButtons>
          </ConfirmBox>
        </ConfirmOverlay>
      )}
    </Box>
  );
}
