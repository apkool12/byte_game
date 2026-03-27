/**
 * 공통 라벨·문구 (폼 라벨, 상점, 개인관리 등)
 */

/** 폼 라벨 */
export const LABEL_NAME = "NAME";
export const LABEL_INVITE_CODE = "INVITE CODE";

/** 이름 표기 접미사 (예: "우은식님") */
export const NAME_SUFFIX = "님";

/** 개인 관리 패널 (멤버 조회) */
export const NOT_FOUND_TEXT = "NOT FOUND";
export const MEMBER_NAME_LABEL = "이름";
export const MEMBER_NO_LABEL = "No.";
export const MEMBER_TEAM_LABEL = "소속 조";
export const MEMBER_TEAM_SCORE_LABEL = "조별 점수";
export const PLACEHOLDER_SEARCH_MEMBER = "이름으로 검색";
export const SCORE_LABEL = "SCORE";
export const BTN_INCREASE_SCORE = "점수 증가";
export const BTN_DECREASE_SCORE = "점수 감소";

/** 점수 조정 모달 */
export const SCORE_ADJUST_AMOUNT_5 = "5";
export const SCORE_ADJUST_AMOUNT_10 = "10";
export const SCORE_ADJUST_RESET = "RESET";
export const ARIA_SCORE_ADJUST = "점수 조정";

/** 상점 */
export const POINT_SUFFIX = "P";
export const SHOP_SETTING_TITLE = "SHOP SETTING";
export const BTN_ADD_SHOP_ITEM = "항목 추가";
export const BTN_SAVE_SHOP_CATALOG = "저장";
export const SHOP_CATALOG_SAVE_DONE = "저장되었습니다.";
export const SHOP_CATALOG_SAVE_FAIL =
  "저장에 실패했습니다. 네트워크를 확인해 주세요.";
export const SHOP_CATALOG_EMPTY = "등록된 상품이 없습니다.";
export const SHOP_CATALOG_LOADING = "상품을 불러오는 중…";
export const SHOP_CATALOG_LOAD_FAIL = "상품을 불러오지 못했습니다.";
export const ARIA_REMOVE_SHOP_ITEM = "항목 삭제";
export const DEFAULT_NEW_SHOP_ITEM_NAME = "새 상품";
export const SHOP_DELETE_CONFIRM = "삭제하시겠습니까?";
export const BTN_SHOP_MODAL_CANCEL = "취소";
export const BTN_SHOP_DELETE = "삭제";
export const SHOP_ADD_ITEM_MODAL_TITLE = "항목 추가";
export const LABEL_SHOP_ITEM_NAME = "상품명";
export const LABEL_SHOP_ITEM_PRICE = "가격";
export const LABEL_SHOP_ITEM_ICON = "아이콘";
export const BTN_SHOP_ADD_SUBMIT = "추가";
export const SHOP_ICON_PICK_TITLE = "아이콘 선택";
export const ARIA_SHOP_DELETE_MODAL = "상품 삭제 확인";
export const ARIA_SHOP_ADD_MODAL = "상품 추가";
export const ARIA_SHOP_ICON_PICK = "아이콘 선택";
export const CONFIRM_BUY = "구매하시겠습니까?";
export const CONFIRM_CANCEL = "CANCEL";
export const CONFIRM_OK = "CONFIRM";
export const ARIA_SHOP = "상점";
export const ARIA_SHOP_OPEN = "상점 열기";

/** 조별 관리 패널 */
export const TEAM_MANAGE_TITLE = "조 관리";
export const TEAM_BTN_MT = "MT";
export const TEAM_BTN_GAME = "GAME";
export const SHOW_LOG_SHOW = "SHOW ";
export const SHOW_LOG_LOG = "LOG";
export const SHOW_LOG_TITLE = "SHOW LOG";
export const LOG_PROCESSOR_LABEL = "처리자";
export const GAME_RANK_TITLE = "순위 점수 조정";
export const GAME_RANK_APPLY = "적용";
export const GAME_ALL_VIEW = "전체";
export const GAME_BACK = "취소";
export const GAME_ALL_TITLE = "전체 점수 조정";
export const GAME_ALL_INCREASE = "증가";
export const GAME_ALL_DECREASE = "감소";

/** 조 선택 모달 (MT 클릭 시) */
export const TEAM_SELECT_LABEL = "GROUP";
export const TEAM_SELECT_BTN = "SELECT";
export const TEAM_SELECT_PREV = "‹";
export const TEAM_SELECT_NEXT = "›";
export const ARIA_TEAM_SELECT = "조 선택";

/** 게임 관리 패널 */
export const GAME_MANAGE_PANEL_TITLE = "GAME MANAGE";
export const LABEL_ADMIN_GAME_STAFF_TEAM = "담당 MT 조";
export const LABEL_ADMIN_GAME_ROOM = "게임 방";
export const LABEL_ADMIN_GAME_TYPE = "진행 게임";
export const BTN_ADMIN_GAME_SAVE = "저장";
export const BTN_ADMIN_GAME_TIMER_START = "타이머 시작";
export const ADMIN_GAME_SAVE_DONE = "저장되었습니다.";
export const ADMIN_GAME_TIMER_STARTED = "10분 상점 타이머가 시작되었습니다.";
export const ARIA_ADMIN_GAME_DEC = "한 단계 감소";
export const ARIA_ADMIN_GAME_INC = "한 단계 증가";
export const LABEL_ADMIN_GAME_RANK_RULES = "순위별 점수 (선택한 게임)";
export const HINT_ADMIN_RANK_RULE_DELTA =
  "숫자는 조 점수에 더해집니다. 감점은 음수(예: -5)로 입력하세요.";
export const LABEL_RANK_PLACE = (n: number) => `${n}등`;
export const BTN_OPEN_RANK_RULES_MODAL = "순위별 점수 편집";
export const GAME_RANK_RULES_MODAL_TITLE = "순위별 점수";
export const BTN_RANK_RULES_CONFIRM = "확인";
export const BTN_RANK_RULES_CANCEL = "취소";
export const ARIA_GAME_RANK_RULES_MODAL = "순위별 점수 편집";
export const GAME_SELECT_MODAL_TITLE = "진행 게임 선택";
export const BTN_OPEN_GAME_SELECT_MODAL = "진행 게임 선택";
export const ARIA_GAME_SELECT_MODAL = "진행 게임 선택";

/** 게임 방: 선택한 roomId에 속한 인원 전체 표시 */
export const HINT_GAME_TEAM_BY_ROOM =
  "목록은 GAME MANAGE에서 저장한 방(roomId)에 속한 인원 전부입니다. (순위·점수 적용은 각 사람의 소속 조 teamId 기준)";
export const HINT_GAME_ROOM_SESSION_REQUIRED =
  "먼저 GAME MANAGE에서 방 번호를 저장해 주세요.";
export const GAME_ROOM_EMPTY = "이 방에 등록된 인원이 없습니다.";
export const TEAM_LABEL_STAFF = "스태프";

/** 공통 */
export const ARIA_CLOSE = "닫기";
