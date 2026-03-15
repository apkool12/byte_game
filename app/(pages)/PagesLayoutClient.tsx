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

  return (
    <>
      {!isLogin && <Header />}
      {children}
    </>
  );
}
