"use client";

import styled from "@emotion/styled";
import { useId } from "react";

const Wrap = styled.div<{ $width: number; $height: number }>`
  position: relative;
  display: block;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  flex-shrink: 0;
`;

const CenterLayer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const Ring = styled.div<{ $size: number }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: linear-gradient(180deg, #750002 0%, #db0004 100%);
`;

const WhiteCircle = styled.div<{ $size: number }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));

  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
`;

const ScoreText = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  font-family: var(--font-krafton);
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 132%;
  letter-spacing: -0.72px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.005);
  background: linear-gradient(180deg, #ff3639 0%, #992022 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
`;

const VIEWBOX_WIDTH = 190;
const VIEWBOX_HEIGHT = 171;
const CENTER_X = 95;
const CENTER_Y = 85.5;

export interface ScoreGaugeProps {
  /** 점수 0 ~ 1000 (기본 1000). 이 비율로 게이지 호가 줄어듦 */
  score?: number;
  /** 아이콘(게이지) 크기 (가로 px, 세로는 비율 유지) */
  iconSize?: number;
  /** 게이지 원 반지름 (테두리/퍼센트 제외한 링·진행·흰원 크기) */
  radius?: number;
  /** 링(배경 원) 크기 배율 (1 = 기본) */
  ringScale?: number;
  /** 흰 원 크기 배율 (1 = 기본) */
  whiteCircleScale?: number;
  transform?: string;
  opacity?: number;
  className?: string;
}

export default function ScoreGauge({
  score = 1000,
  iconSize = 84,
  radius = 50,
  ringScale = 1,
  whiteCircleScale = 1,
  transform,
  opacity,
  className,
}: ScoreGaugeProps) {
  const id = useId().replace(/:/g, "");
  const height = Math.round((iconSize * VIEWBOX_HEIGHT) / VIEWBOX_WIDTH);

  const progressStrokeWidth = radius * (18 / 50);
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(1000, Math.max(0, score));
  const progress = clampedScore / 1000;
  const drawLength = progress * circumference;
  const gapLength = circumference - drawLength;

  const scale = iconSize / VIEWBOX_WIDTH;
  const radiusPx = radius * scale;
  const innerRadiusPx = (radius - progressStrokeWidth) * scale;
  const ringSizePx = Math.round(radiusPx * 2 * ringScale);
  const whiteSizePx = Math.round(innerRadiusPx * 2 * whiteCircleScale);

  // 12시에서 반시계로 그리면, 앞부분만 그릴 때 호가 시계방향으로 줄어듦
  const cx = CENTER_X;
  const cy = CENTER_Y;
  const r = radius;
  const progressCirclePath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${r} ${r} 0 0 0 ${cx} ${cy - r}`;

  return (
    <Wrap
      className={className}
      $width={iconSize}
      $height={height}
      style={{ transform, opacity }}
      aria-hidden
    >
      {/* 테두리만 SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter
            id={`${id}-borderShadow`}
            x="0"
            y="0"
            width="189.528"
            height="170.051"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <linearGradient
            id={`${id}-borderGradient`}
            x1="94.764"
            y1="8"
            x2="94.764"
            y2="181.528"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF0E0E" stopOpacity="0.42" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={`${id}-progressGradient`}
            x1={cx}
            y1={cy - r}
            x2={cx}
            y2={cy + r}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF0545" />
            <stop offset="100%" stopColor="#84233B" />
          </linearGradient>
        </defs>
        <g
          filter={`url(#${id}-borderShadow)`}
          transform={`translate(${CENTER_X}, ${CENTER_Y}) scale(0.85) translate(${-CENTER_X}, ${-CENTER_Y})`}
        >
          <path
            d="M149.54 162.051C163.413 150.757 173.457 135.451 178.295 118.228C183.133 101.005 182.529 82.7074 176.565 65.8411C170.602 48.9747 159.57 34.364 144.982 24.0098C130.393 13.6555 112.961 8.06387 95.0711 8.00054C77.1816 7.93721 59.7099 13.4053 45.0483 23.656C30.3868 33.9067 19.2523 48.4389 13.1695 65.2626C7.08673 82.0863 6.35306 100.379 11.069 117.636C15.7849 134.893 25.7198 150.27 39.5133 161.662L40.2481 160.772C26.638 149.532 16.8353 134.359 12.1821 117.332C7.5289 100.304 8.25282 82.255 14.2547 65.655C20.2566 49.055 31.243 34.7161 45.7095 24.6017C60.1761 14.4873 77.4155 9.09199 95.067 9.15447C112.719 9.21696 129.919 14.7342 144.314 24.9508C158.708 35.1673 169.593 49.5837 175.477 66.2257C181.362 82.8678 181.958 100.922 177.184 117.916C172.41 134.91 162.5 150.013 148.811 161.157L149.54 162.051Z"
            fill={`url(#${id}-borderGradient)`}
            style={{ shapeRendering: "crispEdges" }}
          />
        </g>
      </svg>
      {/* 배경 링 + 진행 호 + 흰 원: 링·흰원은 CSS */}
      <CenterLayer>
        <Ring $size={ringSizePx} style={{ zIndex: 0 }} />
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        >
          <path
            d={progressCirclePath}
            fill="none"
            stroke={`url(#${id}-progressGradient)`}
            strokeWidth={20}
            strokeLinecap="butt"
            strokeDasharray={`${drawLength} ${gapLength}`}
            strokeDashoffset={0}
            style={{
              transition:
                "stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease",
            }}
          />
        </svg>
        <WhiteCircle $size={whiteSizePx} style={{ zIndex: 2 }} />
        <ScoreText aria-hidden>{clampedScore}</ScoreText>
      </CenterLayer>
    </Wrap>
  );
}
