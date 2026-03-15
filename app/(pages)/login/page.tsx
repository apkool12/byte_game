"use client";

import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import HeaderShapes from "./components/HeaderShapes";
import GameTitleBanner from "./components/GameTitleBanner";
import InputForm, { type LoginFormValues } from "./components/InputForm";
import ActionButton from "./components/ActionButton";
import FooterText from "./components/FooterText";
import DecoRing from "./components/DecoRing";

/** 배경 작업 시 true로 바꿔서 컴포넌트 다시 표시 */
const SHOW_UI_COMPONENTS = false;

const Page = styled.main`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  @supports (-webkit-appearance: none) and (stroke-color: transparent) {
    min-height: -webkit-fill-available;
  }
  background: linear-gradient(180deg, #1e1e1e 0%, #1f0707 100%);
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const FormCard = styled.div`
  width: 100%;
  max-width: 360px;
  background: linear-gradient(180deg, #020202 0%, #151010 68.27%, #1f0707 100%);
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: 0 0 24px rgba(230, 57, 70, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const ContentWrap = styled.div<{ visible: boolean }>`
  position: relative;
  z-index: 1;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const CenterRingWrap = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormValues>({
    name: "",
    inviteCode: "",
  });

  const handleSubmit = useCallback(() => {
    // TODO: socket 또는 API 연동
    console.log("Submit", form);
  }, [form]);

  return (
    <Page>
      <TextureOverlay />
      <CenterRingWrap>
        <DecoRing transform="translate(150px, -280px) scale(1.5)" />
      </CenterRingWrap>
      <ContentWrap visible={SHOW_UI_COMPONENTS}>
        <HeaderShapes />
        <GameTitleBanner />
        <FormCard>
          <InputForm values={form} onChange={setForm} />
          <ActionButton onClick={handleSubmit}>SURE</ActionButton>
        </FormCard>
        <FooterText />
      </ContentWrap>
    </Page>
  );
}
