"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import {
  LOGIN_BUTTON_TEXT,
  LOGIN_FORM_SUBTITLE,
  LOGIN_FORM_TITLE,
} from "@/data/app";
import InputForm, { type LoginFormValues } from "./components/InputForm";
import { setCurrentUserSession } from "@/data/currentUser";
import type { PublicUser } from "@/types/user";
import ActionButton from "./components/ActionButton";
import DecoRing from "./components/DecoRing";
import BackgroundTriangle from "./components/BackgroundTriangle";
import ByteGameLogo from "./components/ByteGameLogo";

/** true면 메인 폼(입력·버튼) 표시, false면 배경·링·로고만 */
const SHOW_UI_COMPONENTS = true;

/* 입장 애니메이션 */
const entranceFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const entranceReveal = keyframes`
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
`;
const entranceSlideUp = keyframes`
  from { opacity: 0; transform: translateY(-30px) translateY(24px); }
  to { opacity: 1; transform: translateY(-30px) translateY(0); }
`;

const Page = styled.main`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  @supports (-webkit-appearance: none) and (stroke-color: transparent) {
    min-height: -webkit-fill-available;
  }
  background: linear-gradient(180deg, #000000 0%, #1f0707 100%);
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-game-of-squids);
`;

const TextureOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(/background_effect.png);
  background-size: cover;
  background-position: center;
  opacity: 0.05;
  pointer-events: none;
  z-index: 0;
`;

/** 배경 영역 입장 애니메이션 */
const EntranceBg = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  animation: ${entranceFadeIn} 1.4s ease-out forwards;
`;

const MainForm = styled.div`
  z-index: 2;
  width: 100%;
  max-width: 320px;
  border-radius: 15px;
  background: linear-gradient(180deg, #212121 0%, #100 100%);
  box-shadow: 0 4px 4px 0 rgba(242, 67, 109, 0.15);
  padding: 64px 24px;
  transform: translateY(-55px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/** 라벨/배너용 (border-radius 10px, 가로 그라데이션) */
const FormLabel = styled.div`
  z-index: 3;
  width: 100%;
  max-width: 280px;
  border-radius: 10px;
  background: linear-gradient(90deg, #292929 0%, #000 100%);
  padding: 2px 16px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4));
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const FormLabelTitle = styled.span`
  display: block;
  transform: translateY(4px);
  background: linear-gradient(90deg, #fff 0%, #635b5b 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormLabelSubtitle = styled.span`
  position: relative;
  font-size: 9px;
  font-weight: 500;
  margin-top: -10px;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.34);
  padding: 1px 8px;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 50%;
    background: linear-gradient(90deg, #fc4646 0%, #121212 100%);
    border-radius: 2px;
    z-index: -1;
  }
`;

const MainFormFields = styled.div`
  width: 100%;
`;

const toLength = (v: number | string | undefined): string =>
  v === undefined ? "0" : typeof v === "number" ? `${v}px` : v;

const FormWrap = styled.div<{
  $visible: boolean;
  $marginTop?: number | string;
  $marginBottom?: number | string;
  $transform?: string;
}>`
  position: relative;
  z-index: 1;
  width: 100%;
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  margin-top: ${({ $marginTop }) => toLength($marginTop)};
  margin-bottom: ${({ $marginBottom }) => toLength($marginBottom)};
  transform: translateY(-30px);
  animation: ${entranceSlideUp} 1.1s ease-out 0.9s both;
`;

const CenterRingWrap = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  animation: ${entranceReveal} 1.3s ease-out 0.4s both;
`;

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<LoginFormValues>({
    name: "",
    inviteCode: "",
  });
  const [loginPending, setLoginPending] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (loginPending) return;
    const name = form.name.trim();
    const inviteCode = form.inviteCode.trim();
    setLoginPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, inviteCode }),
      });
      const data = (await res.json()) as { user?: PublicUser };
      if (!res.ok || !data.user) {
        // eslint-disable-next-line no-alert
        alert("이름 또는 학번이 올바르지 않습니다.");
        return;
      }
      setCurrentUserSession(data.user);
      router.push(data.user.isAdmin ? "/admin" : "/main");
    } catch {
      // eslint-disable-next-line no-alert
      alert("로그인 요청에 실패했습니다. 네트워크를 확인해 주세요.");
    } finally {
      setLoginPending(false);
    }
  }, [form.inviteCode, form.name, loginPending, router]);

  return (
    <Page>
      <div
        className={`hide-until-hydrated ${mounted ? "mounted" : ""}`}
        style={{
          minHeight: "100%",
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
      <EntranceBg>
        <BackgroundTriangle
          transform="translate(0, -210px) scale(1)"
          opacity={0.9}
        />
        <TextureOverlay />
      </EntranceBg>
      <CenterRingWrap>
        <DecoRing transform="translate(150px, -10px) scale(1.5)" />
        <ByteGameLogo
          width={200}
          transform="translate(0px, -70px) scale(1.5)"
        />
      </CenterRingWrap>
      <FormWrap $visible={SHOW_UI_COMPONENTS}>
        <FormLabel>
          <FormLabelTitle>{LOGIN_FORM_TITLE}</FormLabelTitle>
          <FormLabelSubtitle>{LOGIN_FORM_SUBTITLE}</FormLabelSubtitle>
        </FormLabel>
        <MainForm>
          <MainFormFields>
            <InputForm values={form} onChange={setForm} />
          </MainFormFields>
          <ActionButton onClick={handleSubmit} disabled={loginPending}>
            {LOGIN_BUTTON_TEXT}
          </ActionButton>
        </MainForm>
      </FormWrap>
      </div>
    </Page>
  );
}
