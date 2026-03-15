"use client";

import Image from "next/image";
import styled from "@emotion/styled";

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const CardDeco = styled.div`
  position: relative;
  z-index: 2;
  align-self: flex-start;
  width: calc(100% - 48px);
  min-height: 84px;
  padding: 12px 16px;
  border-radius: 0 20px 20px 0;
  background: linear-gradient(180deg, #000 0%, #4d1504 100%);
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
  transform: translateY(64px);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
`;

const DecoLabel = styled.span`
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 25px;
  font-style: normal;
  font-weight: 900;
  transform: translateX(-50px);
  line-height: 132%;
  letter-spacing: -0.5px;
  white-space: nowrap;
`;

const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100px;
  padding: 12px 16px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.87) 43.27%,
    rgba(30, 28, 28, 0.87) 100%
  );
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: url(/background_effect.png) 50% / cover no-repeat;
    opacity: 0.09;
    pointer-events: none;
    z-index: 0;
  }
`;

const IconCircle = styled.div`
  position: absolute;
  left: 48px;
  bottom: 15px;
  z-index: 3;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: linear-gradient(180deg, #f60844 0%, #8f203c 100%);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const IconWrap = styled.span`
  display: block;
  width: 96px;
  height: 96px;
  position: relative;
  filter: brightness(0) invert(1);
`;

export interface ShopCardProps {
  onClick?: () => void;
  transform?: string;
  opacity?: number;
}

export default function ShopCard({
  onClick,
  transform,
  opacity,
}: ShopCardProps) {
  return (
    <Wrap style={{ transform, opacity }}>
      <CardDeco
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
        aria-label="상점 열기"
      >
        <DecoLabel>상점</DecoLabel>
      </CardDeco>
      <Card
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      />
      <IconCircle aria-hidden>
        <IconWrap>
          <Image
            src="/shop.svg"
            alt="상점"
            fill
            style={{ objectFit: "contain" }}
          />
        </IconWrap>
      </IconCircle>
    </Wrap>
  );
}
