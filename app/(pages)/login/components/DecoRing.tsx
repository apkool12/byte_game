'use client';

import styled from '@emotion/styled';

const Svg = styled.svg`
  display: block;
`;

const Wrap = styled.span<{ transform?: string }>`
  display: inline-block;
  transform: ${({ transform }) => transform ?? 'none'};
`;

export interface DecoRingProps {
  /** CSS transform (예: translate(10px, 20px), scale(1.2), rotate(15deg)) */
  transform?: string;
}

export default function DecoRing({ transform }: DecoRingProps) {
  return (
    <Wrap transform={transform}>
      <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="134"
      height="139"
      viewBox="0 -41 180 180"
      fill="none"
    >
      <g filter="url(#filter0_df_38_55)">
        <path
          d="M165 49C165 90.4214 131.421 124 90 124C48.5786 124 15 90.4214 15 49C15 7.57864 48.5786 -26 90 -26C131.421 -26 165 7.57864 165 49ZM47.8911 49C47.8911 72.2561 66.7439 91.1089 90 91.1089C113.256 91.1089 132.109 72.2561 132.109 49C132.109 25.7439 113.256 6.89108 90 6.89108C66.7439 6.89108 47.8911 25.7439 47.8911 49Z"
          fill="url(#paint0_linear_38_55)"
        />
      </g>
      <defs>
        <filter
          id="filter0_df_38_55"
          x="0"
          y="-41"
          width="180"
          height="180"
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
            result="effect1_dropShadow_38_55"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_38_55"
            result="shape"
          />
          <feGaussianBlur stdDeviation="7.5" result="effect2_foregroundBlur_38_55" />
        </filter>
        <linearGradient
          id="paint0_linear_38_55"
          x1="90"
          y1="-26"
          x2="90"
          y2="124"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" />
        </linearGradient>
      </defs>
    </Svg>
    </Wrap>
  );
}
