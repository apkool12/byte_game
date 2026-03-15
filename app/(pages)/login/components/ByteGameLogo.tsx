'use client';

import styled from '@emotion/styled';

const Wrap = styled.span<{ $transform?: string; $opacity?: number }>`
  display: inline-block;
  transform: ${({ $transform }) => $transform ?? 'none'};
  opacity: ${({ $opacity }) => ($opacity !== undefined ? $opacity : 1)};
`;

const Svg = styled.svg`
  display: block;
  aspect-ratio: 268 / 103;
  height: auto;
`;

export interface ByteGameLogoProps {
  /** CSS transform */
  transform?: string;
  /** 투명도 0~1 */
  opacity?: number;
  /** 너비 (height는 비율 유지) */
  width?: number | string;
}

export default function ByteGameLogo({
  transform,
  opacity,
  width = 200,
}: ByteGameLogoProps) {
  return (
    <Wrap $transform={transform} $opacity={opacity}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 268 103"
        fill="none"
        width={width}
      >
        <g filter="url(#filter0_d_2_28)">
          <g filter="url(#filter1_d_2_28)">
            <path
              d="M80.6727 38.3363C80.6727 59.5089 63.5089 76.6727 42.3363 76.6727C21.1638 76.6727 4 59.5089 4 38.3363C4 17.1638 21.1638 0 42.3363 0C63.5089 0 80.6727 17.1638 80.6727 38.3363ZM20.8123 38.3363C20.8123 50.2237 30.4489 59.8604 42.3363 59.8604C54.2237 59.8604 63.8604 50.2237 63.8604 38.3363C63.8604 26.4489 54.2237 16.8123 42.3363 16.8123C30.4489 16.8123 20.8123 26.4489 20.8123 38.3363Z"
              fill="url(#paint0_linear_2_28)"
            />
          </g>
          <g filter="url(#filter2_d_2_28)">
            <path
              d="M131.247 0.230896L175.747 77.3077H86.7465L131.247 0.230896Z"
              fill="url(#paint1_linear_2_28)"
            />
          </g>
          <path
            d="M131.016 27.4821L152.316 64.375H109.716L131.016 27.4821Z"
            fill="#1E1D1D"
          />
          <g filter="url(#filter3_d_2_28)">
            <rect
              x="186.596"
              width="76.4417"
              height="76.4417"
              fill="url(#paint2_linear_2_28)"
            />
          </g>
          <rect
            x="203.612"
            y="17.2167"
            width="41.9309"
            height="42.2086"
            fill="#1E1D1D"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2_28"
            x="0"
            y="0"
            width="267.038"
            height="85.3077"
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
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2_28"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2_28"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_d_2_28"
            x="0"
            y="0"
            width="84.6727"
            height="84.6727"
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
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2_28"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2_28"
              result="shape"
            />
          </filter>
          <filter
            id="filter2_d_2_28"
            x="82.7465"
            y="0.230896"
            width="97.0007"
            height="85.0768"
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
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2_28"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2_28"
              result="shape"
            />
          </filter>
          <filter
            id="filter3_d_2_28"
            x="182.596"
            y="0"
            width="84.4417"
            height="84.4417"
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
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2_28"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2_28"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_2_28"
            x1="42.3363"
            y1="0"
            x2="42.3363"
            y2="76.6727"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F5376A" />
            <stop offset="1" stopColor="#E37A7B" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2_28"
            x1="131.247"
            y1="0.230896"
            x2="131.247"
            y2="103"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F5376A" />
            <stop offset="1" stopColor="#E37A7B" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_2_28"
            x1="224.817"
            y1="0"
            x2="224.817"
            y2="76.4417"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F5376A" />
            <stop offset="1" stopColor="#E37A7B" />
          </linearGradient>
        </defs>
      </Svg>
    </Wrap>
  );
}
