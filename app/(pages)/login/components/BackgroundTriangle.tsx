'use client';

import styled from '@emotion/styled';

const Wrap = styled.div<{ $transform?: string; $opacity?: number }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
  transform: ${({ $transform }) => $transform ?? 'none'};
  opacity: ${({ $opacity }) => ($opacity !== undefined ? $opacity : 1)};
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export interface BackgroundTriangleProps {
  /** CSS transform (예: translate(10px, 20px), scale(1.2), rotate(15deg)) */
  transform?: string;
  /** 전체 투명도 0~1 (예: 0.5 = 50%) */
  opacity?: number;
}

export default function BackgroundTriangle({ transform, opacity }: BackgroundTriangleProps) {
  return (
    <Wrap $transform={transform} $opacity={opacity}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 356 272"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g filter="url(#filter0_g_38_89)">
          <path
            d="M0 4.2901L187 266.79L356 4.2901"
            stroke="url(#paint0_linear_38_89)"
            strokeOpacity="0.28"
          />
        </g>
        <defs>
          <filter
            id="filter0_g_38_89"
            x="-4.40723"
            y="0"
            width="364.828"
            height="271.681"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.999 0.999"
              numOctaves="3"
              seed="7365"
              result="noise"
            />
            <feDisplacementMap
              in="shape"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedImage"
              width="100%"
              height="100%"
            />
            <feMerge result="effect1_texture_38_89">
              <feMergeNode in="displacedImage" />
            </feMerge>
          </filter>
          <linearGradient
            id="paint0_linear_38_89"
            x1="0"
            y1="5.2901"
            x2="356"
            y2="5.2901"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF0000" />
            <stop offset="1" stopColor="#9B9B9B" />
          </linearGradient>
        </defs>
      </Svg>
    </Wrap>
  );
}
