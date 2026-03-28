"use client";

import { DEFAULT_PUBLIC_SOCKET_URL } from "@/data/socketConfig";
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;
let didFallbackFromNgrok = false;

const isNgrokUrl = (url: string) =>
  /ngrok-free\.app|ngrok\.io|ngrok\.dev/i.test(url);

/**
 * 기본 소켓 URL은 `data/socketConfig.ts` 의 `DEFAULT_PUBLIC_SOCKET_URL` (운영: https://바이트엠티.서버.한국).
 * 로컬 전용 소켓을 쓸 때만 `NEXT_PUBLIC_SOCKET_URL=http://localhost:4000` 등으로 덮어쓴다.
 */
export function getSocket(): Socket {
  if (!socket) {
    const primaryUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ?? DEFAULT_PUBLIC_SOCKET_URL;
    const createOptions = (url: string): Parameters<typeof io>[1] => {
      const options: Parameters<typeof io>[1] = {
        transports: ["polling", "websocket"],
      };
      if (isNgrokUrl(url)) {
        options.extraHeaders = { "ngrok-skip-browser-warning": "true" };
      }
      return options;
    };
    const devLog = (...args: unknown[]) => {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console -- 로컬에서만 소켓 디버그
        console.log(...args);
      }
    };
    const connectSocket = (url: string) => {
      devLog("[socket] 연결 확인 중...", url);
      socket = io(url, createOptions(url));
      socket.on("connect", () => {
        devLog("[socket] 연결 확인: 연결됨", url);
      });
      socket.on("disconnect", (reason) => {
        devLog("[socket] 연결 끊김", reason);
      });
      socket.on("connect_error", (err) => {
        devLog("[socket] 연결 실패", err.message);
        const canFallback =
          isNgrokUrl(url) &&
          !didFallbackFromNgrok &&
          typeof window !== "undefined" &&
          (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1");
        if (canFallback) {
          didFallbackFromNgrok = true;
          devLog("[socket] ngrok 실패 → 운영 소켓 URL 폴백");
          socket?.removeAllListeners();
          socket?.disconnect();
          connectSocket(DEFAULT_PUBLIC_SOCKET_URL);
        }
      });
    };
    connectSocket(primaryUrl);
  }
  if (!socket) {
    throw new Error("Socket failed to initialize");
  }
  return socket;
}
