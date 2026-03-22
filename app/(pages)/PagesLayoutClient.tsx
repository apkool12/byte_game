"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header/Header";
import { ADMIN_BADGE } from "@/data/app";
import { getCurrentUser } from "@/data/currentUser";
import { getSocket } from "@/app/socketClient";
import type { PublicUser } from "@/types/user";

export default function PagesLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isAdmin = pathname.startsWith("/admin");
  const [currentUser, setCurrentUser] = useState<PublicUser | undefined>(
    undefined,
  );

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, [pathname]);

  // 새로고침 시마다 소켓 연결 시도 → 연결 확인 로그 출력
  useEffect(() => {
    getSocket();
  }, []);

  // 새로고침/페이지 전환 시 스크롤 복원으로 인한 화면 밀림 방지
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <>
      {!isLogin && (
        <Header
          userName={currentUser?.name}
          userNo={currentUser?.no}
          avatarSrc={isAdmin ? "/header-admin.svg" : "/header-user.png"}
          badgeText={isAdmin ? ADMIN_BADGE : undefined}
        />
      )}
      {children}
    </>
  );
}
