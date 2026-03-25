import type { ReactNode } from "react";
import type { ShopItemRecord } from "@/data/shopItems";
import {
  SHOP_DISPLAY_COUNT,
  TOILET_ITEM_ID as DATA_TOILET_ID,
} from "@/data/shopItems";

export interface ShopItemData {
  id: string;
  name: string;
  price: number;
  icon: ReactNode;
}

/** 화장실 아이템 id — 항상 첫 번째로 고정 */
export const TOILET_ITEM_ID = DATA_TOILET_ID;

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
 * 화장실을 항상 첫 번째로 두고, 나머지는 풀에서 랜덤 선택.
 * records 가 비어 있으면 빈 배열.
 */
export function pickRandomShopItemsFromRecords(
  records: ShopItemRecord[],
): ShopItemData[] {
  const items = recordsToShopItemData(records);
  if (items.length === 0) return [];

  const toilet = items.find((item) => item.id === TOILET_ITEM_ID);
  const others = items.filter((item) => item.id !== TOILET_ITEM_ID);

  if (!toilet) {
    return shuffleArray(items).slice(0, SHOP_DISPLAY_COUNT);
  }

  const shuffled = shuffleArray(others);
  const rest = shuffled.slice(0, SHOP_DISPLAY_COUNT - 1);
  return [toilet, ...rest];
}
