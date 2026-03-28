"use client";

import { DEFAULT_PUBLIC_SOCKET_URL } from "@/data/socketConfig";
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;
let didFallbackFromNgrok = false;
let statusListenersAttached = false;

const isNgrokUrl = (url: string) =>
  /ngrok-free\.app|ngrok\.io|ngrok\.dev/i.test(url);

/**
 * 기본 소켓 URL은 `data/socketConfig.ts` 의 `DEFAULT_PUBLIC_SOCKET_URL` (운영: https://바이트엠티.서버.한국).
 * 로컬 전용 소켓을 쓸 때만 `NEXT_PUBLIC_SOCKET_URL=http://localhost:4000` 등으로 덮어쓴다.
 */
export function getSocket(): Socket {
  const statusLog = (...args: unknown[]) => {
    // eslint-disable-next-line no-console -- 운영에서도 소켓 연결 상태 확인용
    console.info(...args);
  };
  const statusWarn = (...args: unknown[]) => {
    // eslint-disable-next-line no-console -- 운영에서도 소켓 연결 상태 확인용
    console.warn(...args);
  };
  const statusError = (...args: unknown[]) => {
    // eslint-disable-next-line no-console -- 운영에서도 소켓 연결 상태 확인용
    console.error(...args);
  };
  const attachStatusListeners = (current: Socket, url: string) => {
    if (statusListenersAttached) return;
    statusListenersAttached = true;
    current.on("connect", () => {
      statusLog("[socket] 연결됨:", {
        url,
        id: current.id,
        transport: current.io.engine.transport.name,
      });
    });
    current.on("disconnect", (reason) => {
      statusWarn("[socket] 연결 끊김:", reason);
    });
    current.on("connect_error", (err) => {
      statusError("[socket] 연결 실패:", err.message);
      const canFallback =
        isNgrokUrl(url) &&
        !didFallbackFromNgrok &&
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");
      if (canFallback) {
        didFallbackFromNgrok = true;
        statusWarn("[socket] ngrok 실패 → 운영 소켓 URL 폴백");
        current.removeAllListeners();
        current.disconnect();
        statusListenersAttached = false;
        connectSocket(DEFAULT_PUBLIC_SOCKET_URL);
      }
    });
    current.io.on("reconnect_attempt", (attempt) => {
      statusWarn("[socket] 재연결 시도:", attempt);
    });
    current.io.on("reconnect", (attempt) => {
      statusLog("[socket] 재연결 성공:", attempt);
    });
    current.io.on("reconnect_error", (err) => {
      statusError("[socket] 재연결 실패:", err.message);
    });
  };
  const connectSocket = (url: string) => {
    statusLog("[socket] 연결 시도:", url);
    socket = io(url, {
      transports: ["polling", "websocket"],
      ...(isNgrokUrl(url)
        ? { extraHeaders: { "ngrok-skip-browser-warning": "true" } }
        : {}),
    });
    attachStatusListeners(socket, url);
  };

  if (!socket) {
    const primaryUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ?? DEFAULT_PUBLIC_SOCKET_URL;
    connectSocket(primaryUrl);
  }
  if (!socket) {
    throw new Error("Socket failed to initialize");
  }
  statusLog("[socket] 현재 상태:", socket.connected ? "connected" : "disconnected");
  return socket;
}
