"use client";

import { useEffect, useState } from "react";
import styled from "@emotion/styled";

const ClockWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
`;

const ClockLine = styled.div`
  position: absolute;
  left: 0;
  right: 10%;
  top: 50%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.65) 0%,
    rgba(31, 27, 27, 0.65) 100%
  );
  transform: translateY(-50%);
  z-index: 0;
`;

const ClockInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 2px;
`;

const DigitBlock = styled.div`
  width: 48px;
  height: 72px;
  background: linear-gradient(180deg, #313131 0%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-krafton);
  font-weight: normal;
  font-size: 28px;
  color: #fff;
  letter-spacing: 0.02em;
  line-height: 1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const Separator = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-shrink: 0;
  margin: 0 2px;
  &::before,
  &::after {
    content: "";
    width: 6px;
    height: 6px;
    background: #313131;
    border-radius: 1px;
  }
`;

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export default function GameClock() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return {
      h: now.getHours(),
      m: now.getMinutes(),
      s: now.getSeconds(),
    };
  });

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime({
        h: now.getHours(),
        m: now.getMinutes(),
        s: now.getSeconds(),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <ClockWrap>
      <ClockLine />
      <ClockInner>
        <DigitBlock>{pad2(time.h)}</DigitBlock>
        <Separator aria-hidden />
        <DigitBlock>{pad2(time.m)}</DigitBlock>
        <Separator aria-hidden />
        <DigitBlock>{pad2(time.s)}</DigitBlock>
      </ClockInner>
    </ClockWrap>
  );
}
