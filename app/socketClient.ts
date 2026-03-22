"use client";

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;
let didFallbackToLocalhost = false;

const isNgrokUrl = (url: string) =>
  /ngrok-free\.app|ngrok\.io|ngrok\.dev/i.test(url);

/**
 * ngrok 사용 시: .env.local 에 NEXT_PUBLIC_SOCKET_URL=https://xxxx.ngrok-free.app
 * ngrok start --all (설정에 web 3000, socket 4000 터널) 후 socket 쪽 URL 사용
 */
export function getSocket(): Socket {
  if (!socket) {
    const primaryUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";
    const createOptions = (url: string): Parameters<typeof io>[1] => {
      const options: Parameters<typeof io>[1] = {
        transports: ["polling", "websocket"],
      };
      if (isNgrokUrl(url)) {
        options.extraHeaders = { "ngrok-skip-browser-warning": "true" };
      }
      return options;
    };
    const connectSocket = (url: string) => {
      console.log("[socket] 연결 확인 중...", url);
      socket = io(url, createOptions(url));
      socket.on("connect", () => {
        console.log("[socket] 연결 확인: 연결됨 (새로고침 후 확인)", url);
      });
      socket.on("disconnect", (reason) => {
        console.log("[socket] 연결 끊김", reason);
      });
      socket.on("connect_error", (err) => {
        console.log("[socket] 연결 실패", err.message);
        const canFallback =
          isNgrokUrl(url) &&
          !didFallbackToLocalhost &&
          typeof window !== "undefined" &&
          (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1");
        if (canFallback) {
          didFallbackToLocalhost = true;
          console.log("[socket] ngrok 실패 → localhost:4000 폴백");
          socket?.removeAllListeners();
          socket?.disconnect();
          connectSocket("http://localhost:4000");
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

