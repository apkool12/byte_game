"use client";

import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { getSocket } from "@/app/socketClient";

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
  const [remainingMs, setRemainingMs] = useState(10 * 60 * 1000);
  const timerStartAtRef = useRef<number | null>(null);
  const timerDurationMsRef = useRef(10 * 60 * 1000);

  useEffect(() => {
    const socket = getSocket();
    const onTimerState = (payload: {
      running?: boolean;
      startedAt?: number | null;
      durationMs?: number;
      remainingMs?: number;
    }) => {
      const isRunning = payload?.running === true;
      if (!isRunning) {
        timerStartAtRef.current = null;
        timerDurationMsRef.current = payload?.durationMs ?? 10 * 60 * 1000;
        setRemainingMs(payload?.remainingMs ?? timerDurationMsRef.current);
        return;
      }
      const startedAt =
        typeof payload?.startedAt === "number" ? payload.startedAt : Date.now();
      timerStartAtRef.current = startedAt;
      timerDurationMsRef.current =
        typeof payload?.durationMs === "number"
          ? payload.durationMs
          : 10 * 60 * 1000;
      const nextRemaining =
        typeof payload?.remainingMs === "number"
          ? payload.remainingMs
          : Math.max(
              0,
              timerDurationMsRef.current - (Date.now() - startedAt),
            );
      setRemainingMs(nextRemaining);
    };

    const requestTimerState = () => {
      socket.emit("shop:requestRefreshTimerState");
    };

    socket.on("shop:refreshTimerState", onTimerState);
    // 연결 전에 emit 하면 상태를 못 받는 경우가 있어 connect 이후에도 요청
    socket.on("connect", requestTimerState);
    if (socket.connected) {
      requestTimerState();
    }

    const id = setInterval(() => {
      const startAt = timerStartAtRef.current;
      if (startAt == null) return;
      const next = Math.max(
        0,
        timerDurationMsRef.current - (Date.now() - startAt),
      );
      setRemainingMs(next);
    }, 1000);

    return () => {
      socket.off("shop:refreshTimerState", onTimerState);
      socket.off("connect", requestTimerState);
      clearInterval(id);
    };
  }, []);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <ClockWrap>
      <ClockLine />
      <ClockInner>
        <DigitBlock>{pad2(hours)}</DigitBlock>
        <Separator aria-hidden />
        <DigitBlock>{pad2(minutes)}</DigitBlock>
        <Separator aria-hidden />
        <DigitBlock>{pad2(seconds)}</DigitBlock>
      </ClockInner>
    </ClockWrap>
  );
}
