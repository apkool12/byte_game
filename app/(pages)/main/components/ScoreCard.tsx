"use client";

import { DEFAULT_MAX_SCORE, SCORE_LABEL } from "@/data/app";
import styled from "@emotion/styled";
import ScoreGauge from "./ScoreGauge";

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
  align-self: flex-end;
  width: calc(100% - 48px);
  min-height: 84px;
  padding: 12px 16px;
  border-radius: 20px 0 0 20px;
  background: linear-gradient(180deg, #000 0%, #4d1504 100%);
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
  transform: translateY(64px);
  display: flex;
  align-items: center;
`;

const DecoLabel = styled.span`
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 25px;
  font-style: normal;
  transform: translateX(30px);
  font-weight: 900;
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

const GaugeWrap = styled.div<{
  $top?: number;
  $right?: number;
  $bottom?: number;
  $left?: number;
}>`
  position: absolute;
  ${({ $top }) => $top !== undefined && `top: ${$top}px;`}
  ${({ $right }) => $right !== undefined && `right: ${$right}px;`}
  ${({ $bottom }) => $bottom !== undefined && `bottom: ${$bottom}px;`}
  ${({ $left }) => $left !== undefined && `left: ${$left}px;`}
  z-index: 3;
  pointer-events: none;
`;

const DEFAULT_ICON_RIGHT = 16;
const DEFAULT_ICON_BOTTOM = 12;

export interface ScoreCardProps {
  /** 점수 0 ~ DEFAULT_MAX_SCORE. 이 비율로 게이지가 줄어듦 */
  score?: number;
  /** 아이콘(게이지) 크기 (가로 px) */
  iconSize?: number;
  /** 링(배경 원) 크기 배율 (1 = 기본) */
  ringScale?: number;
  /** 흰 원 크기 배율 (1 = 기본) */
  whiteCircleScale?: number;
  /** 게이지 아이콘 위치 (px, 미지정 시 right 16 / bottom 12) */
  iconPosition?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** 게이지 아이콘에만 적용할 CSS transform (예: translateY(20px), scale(1.1)) */
  gaugeTransform?: string;
  transform?: string;
  opacity?: number;
}

export default function ScoreCard({
  score = DEFAULT_MAX_SCORE,
  iconSize = 272,
  ringScale = 1.1,
  whiteCircleScale = 1.3,
  iconPosition,
  gaugeTransform = "translateX(40px) translateY(56px)",
  transform,
  opacity,
}: ScoreCardProps) {
  return (
    <Wrap style={{ transform, opacity }}>
      <CardDeco aria-hidden>
        <DecoLabel>{SCORE_LABEL}</DecoLabel>
      </CardDeco>
      <Card />
      <GaugeWrap
        $top={iconPosition?.top}
        $right={
          iconPosition?.right ??
          (iconPosition === undefined ? DEFAULT_ICON_RIGHT : undefined)
        }
        $bottom={
          iconPosition?.bottom ??
          (iconPosition === undefined ? DEFAULT_ICON_BOTTOM : undefined)
        }
        $left={iconPosition?.left}
      >
        <ScoreGauge
          score={score}
          iconSize={iconSize}
          ringScale={ringScale}
          whiteCircleScale={whiteCircleScale}
          transform={gaugeTransform}
        />
      </GaugeWrap>
    </Wrap>
  );
}
