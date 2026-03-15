"use client";

import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import InputForm, { type LoginFormValues } from "./components/InputForm";
import ActionButton from "./components/ActionButton";
import DecoRing from "./components/DecoRing";
import BackgroundTriangle from "./components/BackgroundTriangle";
import ByteGameLogo from "./components/ByteGameLogo";

/** true면 메인 폼(입력·버튼) 표시, false면 배경·링·로고만 */
const SHOW_UI_COMPONENTS = true;

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
      <BackgroundTriangle
        transform="translate(0, -210px) scale(1)"
        opacity={0.9}
      />
      <TextureOverlay />
      <CenterRingWrap>
        <DecoRing transform="translate(150px, -10px) scale(1.5)" />
        <ByteGameLogo
          width={200}
          transform="translate(0px, -70px) scale(1.5)"
        />
      </CenterRingWrap>
      <FormWrap $visible={SHOW_UI_COMPONENTS}>
        <FormLabel>
          <FormLabelTitle>BYTE GAME</FormLabelTitle>
          <FormLabelSubtitle>the Game IS READY</FormLabelSubtitle>
        </FormLabel>
        <MainForm>
          <MainFormFields>
            <InputForm values={form} onChange={setForm} />
          </MainFormFields>
          <ActionButton onClick={handleSubmit}>SURE</ActionButton>
        </MainForm>
      </FormWrap>
    </Page>
  );
}
