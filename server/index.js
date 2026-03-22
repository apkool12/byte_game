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

/** 상점 카탈로그 (서버 기준, 어드민에서 수정 시 전 클라이언트에 브로드캐스트) */
const DEFAULT_SHOP_CATALOG = [
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

let shopCatalog = DEFAULT_SHOP_CATALOG.map((row) => ({ ...row }));

function normalizeShopItem(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : null;
  const name =
    typeof raw.name === "string" ? raw.name.trim().slice(0, 80) : "";
  const price = Math.max(0, Math.min(1_000_000, Math.floor(Number(raw.price))));
  const iconSrc =
    typeof raw.iconSrc === "string" && raw.iconSrc.startsWith("/")
      ? raw.iconSrc.slice(0, 200)
      : "/item-quesiton.svg";
  if (!id || !name || Number.isNaN(price)) return null;
  return { id, name, price, iconSrc };
}

function normalizeShopCatalog(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const seen = new Set();
  const out = [];
  for (const raw of items) {
    const row = normalizeShopItem(raw);
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out.length > 0 ? out : null;
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
  socket.emit("shop:catalog", shopCatalog);

  // 어드민 등에서 나중에 연결된 화면이 현재 점수를 요청할 때
  socket.on("team:requestAllScores", () => {
    socket.emit("team:allScores", teamPoints);
  });

  socket.on("shop:requestCatalog", () => {
    socket.emit("shop:catalog", shopCatalog);
  });

  socket.on("admin:setShopCatalog", (payload, ack) => {
    try {
      const items = payload?.items;
      const next = normalizeShopCatalog(items);
      if (!next) {
        if (typeof ack === "function") ack({ ok: false });
        return;
      }
      shopCatalog = next;
      io.emit("shop:catalog", shopCatalog);
      if (typeof ack === "function") ack({ ok: true });
    } catch (err) {
      console.error("admin:setShopCatalog error", err);
      if (typeof ack === "function") ack({ ok: false });
    }
  });

  // 상점에서 구매 요청
  socket.on("team:buyItem", (payload) => {
    try {
      const { teamId, price } = payload || {};
      if (!teamId || typeof price !== "number") return;

      const current = teamPoints[teamId] ?? 0;
      const next = Math.max(0, current - price);
      teamPoints[teamId] = next;

      addScoreLog({
        teamId,
        teamName: teamId.replace("team-", "") + "조",
        delta: -price,
        processorName: "상점",
        timestamp: Date.now(),
      });

      // 모든 클라이언트에 최신 점수 브로드캐스트
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

