import PagesLayoutClient from "@/app/(pages)/PagesLayoutClient";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PagesLayoutClient>{children}</PagesLayoutClient>;
}
