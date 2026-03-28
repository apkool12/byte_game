const path = require("path");
// EC2 등에서 프로젝트 루트의 .env 로드 (pm2 cwd와 무관하게 동일 경로)
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;

// 간단한 헬스체크용 HTTP 서버
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Byte Game socket server\n");
});

/** 조별 점수 상한 */
const MAX_TEAM_SCORE = 1000;

/** 점수 변경 로그 (최신순, 최대 500개 유지) */
const scoreChangeLogs = [];
const MAX_LOGS = 500;
const LOG_PAGE_SIZE = 20;

const CUPRAMEN_ITEM_ID = "cupramen";
const CUPRAMEN_INITIAL_STOCK = 48;
let cupramenStockRemaining = CUPRAMEN_INITIAL_STOCK;

function addScoreLog(entry) {
  scoreChangeLogs.unshift(entry);
  if (scoreChangeLogs.length > MAX_LOGS) scoreChangeLogs.pop();
}

/** Next 앱 기준 URL — 소켓 서버가 카탈로그 API를 호출할 때 사용 */
function getAppBaseUrl() {
  const explicit =
    process.env.PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return String(explicit).replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${String(vercel).replace(/\/$/, "")}`;
  return null;
}

const CATALOG_TTL_MS = 60_000;
let catalogCache = { items: null, at: 0 };
const SHOP_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
/** 한국(서울) 기준 벽시계 10분 단위 (:00, :10, :20 …) — DST 없음 → UTC+9 고정 */
const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;
let shopWallClockTimer = null;
let shopNextWallRefreshAt = null;

async function fetchShopCatalogFromApi() {
  const base = getAppBaseUrl();
  if (!base) {
    console.warn(
      "[socket] PUBLIC_APP_URL (or NEXT_PUBLIC_APP_URL) unset; cannot load shop catalog for purchase validation",
    );
    return null;
  }
  try {
    const res = await fetch(`${base}/api/shop/catalog`);
    if (!res.ok) return null;
    const data = await res.json();
    const items = data?.items;
    return Array.isArray(items) ? items : null;
  } catch (err) {
    console.error("[socket] fetchShopCatalogFromApi", err);
    return null;
  }
}

async function getCatalogItemsCached() {
  const now = Date.now();
  if (catalogCache.items && now - catalogCache.at < CATALOG_TTL_MS) {
    return catalogCache.items;
  }
  const items = await fetchShopCatalogFromApi();
  if (items) {
    catalogCache = { items, at: now };
  }
  return items;
}

function computeNextSeoulTenMinuteBoundaryMs(from = Date.now()) {
  const seoulWallMs = from + SEOUL_OFFSET_MS;
  const d = new Date(seoulWallMs);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const s = d.getUTCSeconds();
  const ms = d.getUTCMilliseconds();
  const minuteFloat = h * 60 + m + s / 60 + ms / 60000;
  const nextBoundaryMin = Math.ceil(minuteFloat / 10 - 1e-12) * 10;
  let msUntil = (nextBoundaryMin - minuteFloat) * 60 * 1000;
  if (msUntil < 0) msUntil = 0;
  return from + msUntil;
}

function getShopRefreshTimerState() {
  const nextAt =
    shopNextWallRefreshAt != null
      ? shopNextWallRefreshAt
      : computeNextSeoulTenMinuteBoundaryMs();
  const remaining = Math.max(0, nextAt - Date.now());
  return {
    running: true,
    nextWallRefreshAt: nextAt,
    durationMs: SHOP_REFRESH_INTERVAL_MS,
    remainingMs: remaining,
    startedAt: null,
  };
}

function emitShopRefreshTimerState(target) {
  target.emit("shop:refreshTimerState", getShopRefreshTimerState());
}

function clearWallClockShopTimer() {
  if (shopWallClockTimer) {
    clearTimeout(shopWallClockTimer);
    shopWallClockTimer = null;
  }
}

function emitLimitedStock(target) {
  target.emit("shop:limitedStock", {
    [CUPRAMEN_ITEM_ID]: cupramenStockRemaining,
  });
}

function filterLogsForRequest(payload) {
  const { logCategory = "all", shopItemId } = payload || {};
  let list = scoreChangeLogs;
  const isShop = (e) => e.logCategory === "shop";
  const isScore = (e) => !isShop(e);
  if (logCategory === "score") {
    list = list.filter(isScore);
  } else if (logCategory === "shop") {
    list = list.filter(isShop);
    if (typeof shopItemId === "string" && shopItemId.length > 0) {
      list = list.filter((e) => e.itemId === shopItemId);
    }
  }
  return list;
}

/** 메모리 상의 조별 점수 (서버 기준 진실 데이터) */
const teamPoints = {
  "team-1": 1000,
  "team-2": 1000,
  "team-3": 1000,
  "team-4": 1000,
  "team-5": 1000,
  "team-6": 1000,
  "team-7": 1000,
  "team-8": 1000,
  "team-9": 1000,
  "team-10": 1000,
};

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

function scheduleWallClockShopRefresh() {
  clearWallClockShopTimer();
  const nextAt = computeNextSeoulTenMinuteBoundaryMs();
  shopNextWallRefreshAt = nextAt;
  const delay = Math.max(0, nextAt - Date.now());
  shopWallClockTimer = setTimeout(() => {
    catalogCache = { items: null, at: 0 };
    io.emit("shop:catalogChanged");
    emitShopRefreshTimerState(io);
    scheduleWallClockShopRefresh();
  }, delay);
  emitShopRefreshTimerState(io);
}

io.on("connection", (socket) => {
  // 클라이언트가 접속하면 현재 전체 점수 한 번 내려주기 (선택 사항)
  socket.emit("team:allScores", teamPoints);
  emitShopRefreshTimerState(socket);
  emitLimitedStock(socket);

  // 어드민 등에서 나중에 연결된 화면이 현재 점수를 요청할 때
  socket.on("team:requestAllScores", () => {
    socket.emit("team:allScores", teamPoints);
  });

  socket.on("admin:notifyShopCatalogChanged", () => {
    catalogCache = { items: null, at: 0 };
    io.emit("shop:catalogChanged");
  });

  socket.on("shop:requestRefreshTimerState", () => {
    emitShopRefreshTimerState(socket);
  });

  socket.on("shop:requestLimitedStock", () => {
    emitLimitedStock(socket);
  });

  // 어드민: 지금 즉시 상점 카탈로그만 다시 불러오게 알림 (벽시계 10분 주기는 그대로)
  socket.on("admin:startShopRefreshTimer", (_, ack) => {
    catalogCache = { items: null, at: 0 };
    io.emit("shop:catalogChanged");
    emitShopRefreshTimerState(io);
    if (typeof ack === "function") {
      ack({ ok: true, state: getShopRefreshTimerState() });
    }
  });

  // 상점에서 구매 요청 (itemId + Next API 카탈로그 가격 검증)
  socket.on("team:buyItem", async (payload, ack) => {
    const reply = (result) => {
      if (typeof ack === "function") ack(result);
    };
    try {
      const { teamId, itemId, price, buyerName } = payload || {};
      if (!teamId) {
        reply({ ok: false, reason: "bad_request" });
        return;
      }

      if (typeof itemId !== "string" || itemId.length === 0) {
        reply({ ok: false, reason: "bad_request" });
        return;
      }

      if (itemId === CUPRAMEN_ITEM_ID && cupramenStockRemaining <= 0) {
        reply({ ok: false, reason: "sold_out" });
        return;
      }

      const catalog = await getCatalogItemsCached();
      if (!catalog) {
        reply({ ok: false, reason: "catalog_unavailable" });
        return;
      }
      const row = catalog.find((r) => r && r.id === itemId);
      if (!row) {
        reply({ ok: false, reason: "invalid_item" });
        return;
      }
      const serverPrice = Number(row.price);
      if (typeof price !== "number" || Number(price) !== serverPrice) {
        reply({ ok: false, reason: "price_mismatch" });
        return;
      }
      const charge = serverPrice;

      const current = teamPoints[teamId] ?? 0;
      if (current < charge) {
        reply({ ok: false, reason: "insufficient_points" });
        return;
      }
      const next = Math.max(0, current - charge);
      teamPoints[teamId] = next;

      if (itemId === CUPRAMEN_ITEM_ID) {
        cupramenStockRemaining -= 1;
        emitLimitedStock(io);
      }

      const safeBuyer =
        typeof buyerName === "string" && buyerName.trim().length > 0
          ? buyerName.trim().slice(0, 40)
          : "익명";

      addScoreLog({
        logCategory: "shop",
        teamId,
        teamName: `${teamId.replace("team-", "")}조`,
        delta: -charge,
        processorName: "상점",
        itemId,
        itemName: row.name,
        buyerName: safeBuyer,
        timestamp: Date.now(),
      });

      io.emit("team:scoreUpdated", { teamId, points: next });
      reply({ ok: true });
    } catch (err) {
      console.error("team:buyItem error", err);
      reply({ ok: false, reason: "error" });
    }
  });

  // 어드민 점수 증감 (delta: 양수=증가, 음수=차감)
  socket.on("admin:adjustScore", (payload) => {
    try {
      const { teamId, delta: deltaRaw, processorName } = payload || {};
      if (!teamId) return;
      const delta = Number(deltaRaw);
      if (Number.isNaN(delta)) return;

      const current = teamPoints[teamId];
      if (current == null) return;
      const next = Math.min(MAX_TEAM_SCORE, Math.max(0, current + delta));
      teamPoints[teamId] = next;

      addScoreLog({
        logCategory: "score",
        teamId,
        teamName: `${teamId.replace("team-", "")}조`,
        delta,
        processorName: processorName || "알 수 없음",
        timestamp: Date.now(),
      });

      io.emit("team:scoreUpdated", { teamId, points: next });
    } catch (err) {
      console.error("admin:adjustScore error", err);
    }
  });

  // 어드민 전체 점수 증감 (한 번에 적용, 로그 1건)
  socket.on("admin:adjustAllScores", (payload, ack) => {
    try {
      const { delta: deltaRaw, targetTeamIds, processorName } = payload || {};
      const delta = Number(deltaRaw);
      if (Number.isNaN(delta) || delta === 0) {
        if (typeof ack === "function") ack({ ok: false });
        return;
      }

      const targetIds = Array.isArray(targetTeamIds)
        ? targetTeamIds
        : Object.keys(teamPoints);

      let adjustedCount = 0;
      targetIds.forEach((teamId) => {
        const current = teamPoints[teamId];
        if (current == null) return;
        const next = Math.min(MAX_TEAM_SCORE, Math.max(0, current + delta));
        teamPoints[teamId] = next;
        adjustedCount += 1;
      });
      if (adjustedCount === 0) {
        if (typeof ack === "function") ack({ ok: false });
        return;
      }

      addScoreLog({
        logCategory: "score",
        teamId: "all",
        teamName: "전체",
        delta,
        processorName: processorName || "알 수 없음",
        timestamp: Date.now(),
      });

      io.emit("team:allScores", teamPoints);
      if (typeof ack === "function") ack({ ok: true });
    } catch (err) {
      console.error("admin:adjustAllScores error", err);
      if (typeof ack === "function") ack({ ok: false });
    }
  });

  // 점수 변경 로그 조회 (페이지네이션) — ack로 응답 보장
  socket.on("admin:requestLogs", (payload, ack) => {
    try {
      const { page = 0 } = payload || {};
      const filtered = filterLogsForRequest(payload);
      const start = page * LOG_PAGE_SIZE;
      const slice = filtered.slice(start, start + LOG_PAGE_SIZE);
      const hasMore = start + slice.length < filtered.length;
      const response = { logs: slice, hasMore, page };
      if (typeof ack === "function") {
        ack(response);
      } else {
        socket.emit("admin:scoreLogs", response);
      }
    } catch (err) {
      console.error("admin:requestLogs error", err);
      if (typeof ack === "function") ack({ logs: [], hasMore: false, page: 0 });
    }
  });
});

// 서울 기준 벽시계 10분마다 상점 카탈로그 새로고침 트리거
scheduleWallClockShopRefresh();

httpServer.listen(PORT, () => {
  console.log(`[socket] Byte Game server listening on port ${PORT}`);
});

