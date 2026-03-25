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

io.on("connection", (socket) => {
  // 클라이언트가 접속하면 현재 전체 점수 한 번 내려주기 (선택 사항)
  socket.emit("team:allScores", teamPoints);

  // 어드민 등에서 나중에 연결된 화면이 현재 점수를 요청할 때
  socket.on("team:requestAllScores", () => {
    socket.emit("team:allScores", teamPoints);
  });

  socket.on("admin:notifyShopCatalogChanged", () => {
    catalogCache = { items: null, at: 0 };
    io.emit("shop:catalogChanged");
  });

  // 상점에서 구매 요청 (itemId 있으면 Next API 카탈로그로 가격 검증)
  socket.on("team:buyItem", async (payload) => {
    try {
      const { teamId, itemId, price } = payload || {};
      if (!teamId) return;

      let charge = null;
      if (typeof itemId === "string" && itemId.length > 0) {
        const catalog = await getCatalogItemsCached();
        if (!catalog) {
          console.warn("[socket] team:buyItem catalog unavailable");
          return;
        }
        const row = catalog.find((r) => r && r.id === itemId);
        if (!row) return;
        const serverPrice = Number(row.price);
        if (typeof price !== "number" || Number(price) !== serverPrice) return;
        charge = serverPrice;
      } else {
        if (typeof price !== "number") return;
        charge = price;
      }

      const current = teamPoints[teamId] ?? 0;
      const next = Math.max(0, current - charge);
      teamPoints[teamId] = next;

      addScoreLog({
        teamId,
        teamName: teamId.replace("team-", "") + "조",
        delta: -charge,
        processorName: "상점",
        timestamp: Date.now(),
      });

      io.emit("team:scoreUpdated", { teamId, points: next });
    } catch (err) {
      console.error("team:buyItem error", err);
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
        teamId,
        teamName: teamId.replace("team-", "") + "조",
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
      const start = page * LOG_PAGE_SIZE;
      const slice = scoreChangeLogs.slice(start, start + LOG_PAGE_SIZE);
      const hasMore = start + slice.length < scoreChangeLogs.length;
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

httpServer.listen(PORT, () => {
  console.log(`[socket] Byte Game server listening on port ${PORT}`);
});

