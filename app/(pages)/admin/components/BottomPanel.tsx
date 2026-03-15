"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  animation: ${fadeIn} 0.25s ease-out;
`;

const Panel = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 70vh;
  min-height: 500px;
  background: linear-gradient(180deg, #1f1f1f 0%, #000 100%);
  border: 1px solid rgba(227, 122, 123, 0.4);
  border-bottom: none;
  box-shadow: 0 -2px 2px 0 rgba(245, 55, 106, 0.25);
  border-radius: 24px 24px 0 0;
  z-index: 101;
  box-sizing: border-box;
  animation: ${slideUp} 0.3s ease-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px 20px 32px;
  overflow: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoWrap = styled.div`
  flex-shrink: 0;
`;

const Title = styled.h2`
  font-family: "NeoDonggeunmo", "NeoDunggeunmo Pro", sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: -0.36px;
  background: linear-gradient(90deg, #969696 0%, #9e4141 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin: 0 0 20px 0;
  text-align: center;
`;

export interface BottomPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

export default function BottomPanel({
  open,
  onClose,
  title,
  children,
}: BottomPanelProps) {
  if (!open) return null;

  const panelContent = (
    <>
      <Overlay onClick={onClose} role="presentation" aria-hidden />
      <Panel role="dialog" aria-modal="true" aria-label={title}>
        <Content onClick={(e) => e.stopPropagation()}>
          <LogoWrap>
            <Image
              src="/byte_game_logo.svg"
              alt="Byte Game"
              width={134}
              height={52}
              style={{ width: "auto", height: "42px" }}
            />
          </LogoWrap>
          <Title>{title}</Title>
          {children}
        </Content>
      </Panel>
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(panelContent, document.body);
}
