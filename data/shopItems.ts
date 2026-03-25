/**
 * 상점 아이템 임시 데이터 (id, 이름, 가격, 아이콘 경로)
 */

export interface ShopItemRecord {
  id: string;
  name: string;
  price: number;
  iconSrc: string;
}

/** 화장실 아이템 id — 항상 첫 번째로 고정 */
export const TOILET_ITEM_ID = "toilet";

/** 상점에 한 번에 노출할 아이템 개수 (화장실 1 + 랜덤 2) */
export const SHOP_DISPLAY_COUNT = 3;

/** DB 시드·초기 카탈로그 기본값 (실제 노출은 API/DB 기준) */
export const DEFAULT_SHOP_CATALOG_RECORDS: ShopItemRecord[] = [
  { id: "toilet", name: "화장실", price: 500, iconSrc: "/item-toilet.svg" },
  { id: "for-you", name: "너를 위해", price: 500, iconSrc: "/item-score..svg" },
  {
    id: "praise-sticker",
    name: "칭찬 스티커",
    price: 500,
    iconSrc: "/item-quesiton.svg",
  },
  { id: "choice", name: "선택권", price: 500, iconSrc: "/item-quesiton.svg" },
  { id: "donation", name: "기부", price: 500, iconSrc: "/item-quesiton.svg" },
  { id: "lottery", name: "뽑기", price: 500, iconSrc: "/item-quesiton.svg" },
  { id: "cupramen", name: "컵라면", price: 500, iconSrc: "/item-food.svg" },
  { id: "milk", name: "우유", price: 500, iconSrc: "/item-food.svg" },
  { id: "shield", name: "방어", price: 500, iconSrc: "/item-shield.svg" },
];

/** 어드민·항목 추가에서 고를 수 있는 아이콘 경로 */
export const SHOP_ITEM_ICON_OPTIONS: string[] = Array.from(
  new Set(DEFAULT_SHOP_CATALOG_RECORDS.map((r) => r.iconSrc)),
).sort();
