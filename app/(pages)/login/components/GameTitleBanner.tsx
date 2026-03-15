'use client';

import styled from '@emotion/styled';

const Banner = styled.div`
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  border-radius: 12px;
  padding: 20px 28px;
  text-align: center;
  box-shadow: 0 0 24px rgba(230, 57, 70, 0.25);
  margin-bottom: 32px;
  border: 1px solid rgba(230, 57, 70, 0.2);
`;

const Title = styled.h1`
  font-family: var(--font-geist), sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.04em;
  margin-bottom: 10px;
`;

const Line = styled.div`
  height: 3px;
  background: linear-gradient(90deg, #e63946, #ff6b6b);
  border-radius: 2px;
  max-width: 120px;
  margin: 0 auto;
`;

export default function GameTitleBanner() {
  return (
    <Banner>
      <Title>BYTE GAME</Title>
      <Subtitle>THE GAME IS READY</Subtitle>
      <Line />
    </Banner>
  );
}
