import "server-only";

import type { ShopItemRecord } from "@/data/shopItems";
import { getPrisma } from "@/lib/prisma";

export function normalizeShopItemInput(raw: unknown): ShopItemRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : null;
  const name =
    typeof o.name === "string" ? o.name.trim().slice(0, 80) : "";
  const price = Math.max(
    0,
    Math.min(1_000_000, Math.floor(Number(o.price))),
  );
  const iconSrc =
    typeof o.iconSrc === "string" && o.iconSrc.startsWith("/")
      ? o.iconSrc.slice(0, 200)
      : "/item-quesiton.svg";
  if (!id || !name || Number.isNaN(price)) return null;
  return { id, name, price, iconSrc };
}

export function normalizeShopCatalogInput(
  items: unknown,
): ShopItemRecord[] | null {
  if (!Array.isArray(items) || items.length === 0) return null;
  const seen = new Set<string>();
  const out: ShopItemRecord[] = [];
  for (const raw of items) {
    const row = normalizeShopItemInput(raw);
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out.length > 0 ? out : null;
}

export async function getShopCatalog(): Promise<ShopItemRecord[]> {
  const rows = await getPrisma().shopItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    price: r.price,
    iconSrc: r.iconSrc,
  }));
}

export async function replaceShopCatalog(
  items: ShopItemRecord[],
): Promise<void> {
  const prisma = getPrisma();
  await prisma.$transaction([
    prisma.shopItem.deleteMany(),
    prisma.shopItem.createMany({
      data: items.map((row, index) => ({
        id: row.id,
        name: row.name,
        price: row.price,
        iconSrc: row.iconSrc,
        sortOrder: index,
      })),
    }),
  ]);
}
