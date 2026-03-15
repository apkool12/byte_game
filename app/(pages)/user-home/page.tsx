"use client";

import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import DecoRing from "../login/components/DecoRing";
import UserHomeHeader from "./components/UserHomeHeader";

const entranceFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0.05;
  }
`;

const TopRightDeco = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  animation: ${entranceFadeIn} 1.4s ease-out 0.2s both;
`;

export default function UserHomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Page>
      <div
        className={`hide-until-hydrated ${mounted ? "mounted" : ""}`}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100dvh",
        }}
      >
        <UserHomeHeader />
        <TextureOverlay>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/background_effect.png" alt="" />
        </TextureOverlay>
        <TopRightDeco>
          <DecoRing transform="translate(30px, 20px) scale(1.2)" />
        </TopRightDeco>
      </div>
    </Page>
  );
}
