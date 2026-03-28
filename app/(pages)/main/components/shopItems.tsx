import type { ReactNode } from "react";
import type { ShopItemRecord } from "@/data/shopItems";
import { SHOP_DISPLAY_COUNT } from "@/data/shopItems";

export interface ShopItemData {
  id: string;
  name: string;
  price: number;
  icon: ReactNode;
}

const iconStyle = { width: 38, height: 38, objectFit: "contain" as const };

export function recordsToShopItemData(records: ShopItemRecord[]): ShopItemData[] {
  return records.map((record) => ({
    id: record.id,
    name: record.name,
    price: record.price,
    icon: (
      // eslint-disable-next-line @next/next/no-img-element -- 동적 public 아이콘 경로
      <img
        src={record.iconSrc}
        alt=""
        width={38}
        height={38}
        style={iconStyle}
      />
    ),
  }));
}

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * 카탈로그 풀에서 무작위로 SHOP_DISPLAY_COUNT개 노출.
 * records 가 비어 있으면 빈 배열.
 */
export function pickRandomShopItemsFromRecords(
  records: ShopItemRecord[],
): ShopItemData[] {
  const items = recordsToShopItemData(records);
  if (items.length === 0) return [];
  return shuffleArray(items).slice(0, SHOP_DISPLAY_COUNT);
}
