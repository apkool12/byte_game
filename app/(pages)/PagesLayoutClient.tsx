"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header/Header";

export default function PagesLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isLogin && (
        <Header
          avatarSrc={isAdmin ? "/header-admin.svg" : "/header-user.png"}
          badgeText={isAdmin ? "관리자" : undefined}
        />
      )}
      {children}
    </>
  );
}
