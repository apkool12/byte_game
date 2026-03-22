import type { ReactNode } from "react";
import {
  SHOP_DISPLAY_COUNT,
  SHOP_ITEM_RECORDS,
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

/** 상점에 등장할 수 있는 전체 아이템 목록 (data 기반, 아이콘만 컴포넌트에서 생성) */
export const SHOP_ITEMS: ShopItemData[] = SHOP_ITEM_RECORDS.map((record) => ({
  id: record.id,
  name: record.name,
  price: record.price,
  icon: (
    <img src={record.iconSrc} alt="" width={38} height={38} style={iconStyle} />
  ),
}));

/**
 * 화장실을 항상 첫 번째로 두고, 나머지는 풀에서 랜덤 선택.
 */
function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickRandomShopItems(): ShopItemData[] {
  const toilet = SHOP_ITEMS.find((item) => item.id === TOILET_ITEM_ID);
  const others = SHOP_ITEMS.filter((item) => item.id !== TOILET_ITEM_ID);

  if (!toilet) {
    return shuffleArray(SHOP_ITEMS).slice(0, SHOP_DISPLAY_COUNT);
  }

  const shuffled = shuffleArray(others);
  const rest = shuffled.slice(0, SHOP_DISPLAY_COUNT - 1);
  return [toilet, ...rest];
}
