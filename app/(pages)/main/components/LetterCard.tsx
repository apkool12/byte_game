"use client";

import { ARIA_CLOSE, NAME_SUFFIX } from "@/data/copy";
import { APP_NAME_ALT } from "@/data/app";
import { letterCopy } from "@/data/letterCopy";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const letterUnfold = keyframes`
  from {
    opacity: 0;
    transform: perspective(600px) rotateX(-18deg) translateY(20px) scale(0.94);
  }
  to {
    opacity: 1;
    transform: perspective(600px) rotateX(0deg) translateY(0) scale(1);
  }
`;

const letterFold = keyframes`
  from {
    opacity: 1;
    transform: perspective(600px) rotateX(0deg) translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: perspective(600px) rotateX(-18deg) translateY(20px) scale(0.94);
  }
`;

const contentReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Box = styled.div<{ $isClosing?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 320px;
  border-radius: 16px;
  background: linear-gradient(180deg, #1a1919 0%, #0d0d0d 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  border: 1px solid rgba(227, 122, 123, 0.35);
  border-top: none;
  animation: ${({ $isClosing }) =>
      $isClosing ? letterFold : letterUnfold}
    0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transform-origin: center top;
`;

const TopBar = styled.div`
  height: 10px;
  background: linear-gradient(90deg, #f5376a 0%, #ff61a6 100%);
`;

const BoxInner = styled.div`
  padding: 20px 20px 28px;
  text-align: center;
  animation: ${contentReveal} 0.4s ease-out 0.2s both;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  z-index: 2;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  img {
    width: 140px;
    height: auto;
    display: block;
  }
`;

const BodyText = styled.p<{
  $font?: "yeotnal" | "healthset";
  $red?: boolean;
  $muted?: boolean;
}>`
  margin: 0 auto 12px;
  font-family: ${({ $font }) =>
    $font === "healthset"
      ? "var(--font-healthset-gothic-light)"
      : "var(--font-yeotnal-sajingwan)"};
  font-size: 14px;
  font-weight: 300;
  color: ${({ $red, $muted }) =>
    $red ? "#E37A7B" : $muted ? "#747474" : "#B4B4B4"};
  line-height: 1.6;
  white-space: pre-line;
  text-align: center;
`;

const NameChip = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.95);
  color: #1a1919;
  font-family: var(--font-pretendard-black);
  font-weight: 900;
  font-size: 13px;
  padding: 2px 10px;
  margin-bottom: 6px;
`;

const NumberBlock = styled.div`
  margin: 8px auto 16px;
  text-align: center;
`;

const InstructionBlock = styled.div`
  margin: 16px 0;
  text-align: center;
`;

const GoodLuck = styled.p`
  margin: 20px 0 0;
  text-align: center;
  font-family: var(--font-gungsuh);
  font-size: 15px;
  font-weight: normal;
  color: #e37a7b;
`;

export interface LetterCardProps {
  isClosing?: boolean;
  onClose: () => void;
  userName?: string;
  userNo?: string;
}

export default function LetterCard({
  isClosing = false,
  onClose,
  userName = "",
  userNo = "",
}: LetterCardProps) {
  return (
    <Box $isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
      <TopBar />
      <CloseBtn type="button" onClick={onClose} aria-label={ARIA_CLOSE}>
        ✕
      </CloseBtn>
      <BoxInner>
        <LogoWrap>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/byte_game_logo.svg" alt={APP_NAME_ALT} />
        </LogoWrap>
        <div>
          <NameChip>{userName}{NAME_SUFFIX}</NameChip>
        </div>
        <BodyText $font="yeotnal">{letterCopy.welcome}</BodyText>
        <NumberBlock>
          <BodyText $font="yeotnal">{letterCopy.yourNumber}</BodyText>
          <BodyText $font="yeotnal" $red>
            No. {userNo.padStart(3, "0")}
          </BodyText>
        </NumberBlock>
        <InstructionBlock>
          <BodyText $font="healthset" $muted>
            {letterCopy.instruction}
          </BodyText>
        </InstructionBlock>
        <BodyText $font="yeotnal">{letterCopy.participant}</BodyText>
        <GoodLuck>{letterCopy.goodLuck}</GoodLuck>
      </BoxInner>
    </Box>
  );
}
