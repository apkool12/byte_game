import type { ReactNode } from "react";

export interface ShopItemData {
  id: string;
  name: string;
  price: number;
  icon: ReactNode;
}

/** 화장실 아이템 id — 항상 첫 번째로 고정 */
export const TOILET_ITEM_ID = "toilet";

/** 상점에 등장할 수 있는 전체 아이템 목록 (화장실 + 기타) */
export const SHOP_ITEMS: ShopItemData[] = [
  {
    id: "toilet",
    name: "화장실",
    price: 500,
    icon: <img src="/item-toilet.svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
  {
    id: "for-you",
    name: "너를 위해",
    price: 500,
    icon: <img src="/item-score..svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
  {
    id: "praise-sticker",
    name: "칭찬 스티커",
    price: 500,
    icon: <img src="/item-quesiton.svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
  {
    id: "choice",
    name: "선택권",
    price: 500,
    icon: <img src="/item-quesiton.svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
  {
    id: "donation",
    name: "기부",
    price: 500,
    icon: <img src="/item-quesiton.svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
  {
    id: "lottery",
    name: "뽑기",
    price: 500,
    icon: <img src="/item-quesiton.svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
  {
    id: "cupramen",
    name: "컵라면",
    price: 500,
    icon: <img src="/item-food.svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
  {
    id: "milk",
    name: "우유",
    price: 500,
    icon: <img src="/item-food.svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
  {
    id: "shield",
    name: "방어",
    price: 500,
    icon: <img src="/item-shield.svg" alt="" width={38} height={38} style={{ objectFit: "contain" }} />,
  },
];

const DISPLAY_COUNT = 3;

/**
 * 화장실을 항상 첫 번째로 두고, 나머지 2개는 풀에서 랜덤 선택.
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
    return shuffleArray(SHOP_ITEMS).slice(0, DISPLAY_COUNT);
  }

  const shuffled = shuffleArray(others);
  const rest = shuffled.slice(0, DISPLAY_COUNT - 1);
  return [toilet, ...rest];
}
