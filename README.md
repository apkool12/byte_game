# BYTE GAME

Next.js 기반 모바일 웹. Emotion 스타일링, Socket 실시간 연동.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속 시 `/login`으로 리다이렉트됩니다.

## 스크립트

- `npm run dev` — 개발 서버 (Turbopack)
- `npm run build` — 프로덕션 빌드
- `npm run start` — 프로덕션 서버
- `npm run lint` — ESLint

## 구조

- `app/(pages)/` — 페이지 단위 (각 폴더 내 `components/`에 해당 페이지 전용 컴포넌트)
- `app/theme/` — Emotion 테마
- `app/providers/` — Emotion Cache/Theme Provider
- `types/socket.ts` — Socket 이벤트 타입
