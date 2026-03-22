/**
 * 관리자 페이지 메뉴 (카드·버튼 라벨, 아이콘)
 */

export const ADMIN_MENU_CARDS = [
  { id: "personal", label: "개인 관리", iconSrc: "/admin_member.svg" },
  { id: "group", label: "조별 관리", iconSrc: "/admin_group.svg" },
] as const;

export const ADMIN_MENU_ROW_BUTTONS = [
  { id: "shop", label: "상점 관리", iconSrc: "/shop.svg" },
  { id: "game", label: "게임 관리", iconSrc: "/admin_game.svg" },
] as const;

export type AdminPanelTitle =
  | (typeof ADMIN_MENU_CARDS)[number]["label"]
  | (typeof ADMIN_MENU_ROW_BUTTONS)[number]["label"];
