"use client";

import styled from "@emotion/styled";

const Header = styled.header`
  position: relative;
  z-index: 2;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  border-radius: 0 0 30px 30px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.87) 43.27%,
    rgba(30, 28, 28, 0.87) 100%
  );
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  padding: 16px 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-game-of-squids);
  overflow: hidden;
`;

/* 텍스처: url만 ::before에 두고 opacity로 이미지만 조절 (그라데이션은 영향 없음) */
const HeaderTextureLayer = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 0 0 30px 30px;
  pointer-events: none;
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: url(/background_effect.png) 50% / cover no-repeat;
    opacity: 0.09;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.08em;
  margin: 0 0 6px;
  transform: translateY(-10px);
  position: relative;
  display: inline-block;
`;

const TitleUnderline = styled.span`
  position: absolute;
  left: -42px;
  right: -42px;
  bottom: 18px;
  height: 6px;
  background: linear-gradient(
    90deg,
    #e63946 0%,
    #f3406c 50%,
    rgba(243, 64, 108, 0.6) 100%
  );
  border-radius: 10px;
  z-index: 0;
`;

const TitleText = styled.span`
  position: relative;
  z-index: 1;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  gap: 4px;
`;

const Avatar = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #000;
  transform: translateY(-24px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  img {
    width: 75%;
    height: 75%;
    object-fit: contain;
  }
`;

const UserName = styled.span`
  font-size: 18px;
  color: #fff;
  font-family: var(--font-pretendard-black);
  transform: translateY(-28px);
  font-weight: 900;
`;

const UserIdBadge = styled.span`
  position: relative;
  display: inline-block;
  padding: 2px 6px;
  font-family: var(--font-pretendard-light);
  font-size: 16px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.04em;
  transform: translateY(-28px);

  /* 하이라이트 레이어 (세로만 절반 높이) */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 60%;
    transform: translateY(-50%);
    height: 40%;
    border-radius: 2px;
    background: #58102f;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
`;

export interface UserHomeHeaderProps {
  userName?: string;
  userNo?: string;
}

export default function UserHomeHeader({
  userName = "우은식",
  userNo = "001",
}: UserHomeHeaderProps) {
  return (
    <Header>
      <HeaderTextureLayer />
      <HeaderContent>
        <Title>
          <TitleUnderline />
          <TitleText>BYTE GAME</TitleText>
        </Title>
        <Profile>
          <Avatar>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/header-user.png" alt="" />
          </Avatar>
          <UserName>{userName}</UserName>
          <UserIdBadge>No. {userNo.padStart(3, "0")}</UserIdBadge>
        </Profile>
      </HeaderContent>
    </Header>
  );
}
