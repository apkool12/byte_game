"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import {
  ADMIN_MENU_CARDS,
  ADMIN_MENU_ROW_BUTTONS,
  type AdminPanelTitle,
} from "@/data/adminMenu";
import {
  formatAdminGameFooterLine,
  getStoredAdminGameSession,
  ADMIN_GAME_SESSION_EVENT,
} from "@/data/adminGames";
import { getCurrentUser } from "@/data/currentUser";
import {
  SHOW_LOG_TITLE,
  SHOP_SETTING_TITLE,
  GAME_MANAGE_PANEL_TITLE,
} from "@/data/copy";
import { roomFooterText } from "@/data/room";
import BottomPanel from "./components/BottomPanel";
import PersonalManagePanel from "./components/PersonalManagePanel";
import TeamManagePanel from "./components/TeamManagePanel";
import ShopManagePanel from "./components/ShopManagePanel";
import GameManagePanel from "./components/GameManagePanel";

const SHOP_PANEL_LABEL = ADMIN_MENU_ROW_BUTTONS[0].label;
const GAME_PANEL_LABEL = ADMIN_MENU_ROW_BUTTONS[1].label;

const Page = styled.main`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  @supports (-webkit-appearance: none) and (stroke-color: transparent) {
    min-height: -webkit-fill-available;
  }
  background: linear-gradient(180deg, #000000 0%, #1f0707 100%);
  padding: 24px 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-game-of-squids);
  overflow-x: hidden;
  box-sizing: border-box;
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

const BgDecoWrap = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const ContentWrap = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const BgDecoBar1 = styled.div`
  position: absolute;
  width: 500.658px;
  height: 29.408px;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%) rotate(-34.179deg);
  background: linear-gradient(90deg, #a93957 0%, #55081c 100%);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  filter: blur(1px);
`;

const BgDecoBar2 = styled.div`
  position: absolute;
  width: 700.641px;
  height: 20px;
  left: 50%;
  top: 65%;
  transform: translate(-50%, -50%) rotate(54.549deg);
  background: linear-gradient(
    90deg,
    rgba(245, 55, 106, 0.46) 0%,
    rgba(85, 8, 28, 0.46) 100%
  );
  filter: blur(1px);
`;

const CardGrid = styled.div`
  width: 100%;
  max-width: 320px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
`;

const Card = styled.button`
  aspect-ratio: 1;
  border: none;
  border-radius: 15px;
  background: #0f0f0f;
  box-shadow: 0 2px 2px 0 rgba(245, 55, 106, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
`;

const CardLogoSmall = styled.div`
  width: 48px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const CardIconWrap = styled.div`
  width: 80px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const CardLabel = styled.span`
  font-size: 21px;
  background: linear-gradient(90deg, #969696 0%, #9e4141 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: var(--font-neo-donggeunmo), sans-serif;
  font-weight: normal;
  text-align: center;
  line-height: 1.3;
`;

const RowButtons = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
`;

const RowButton = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 15px;
  background: #0f0f0f;
  box-shadow: 0 2px 2px 0 rgba(245, 55, 106, 0.25);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:active {
    opacity: 0.9;
  }
`;

const RowButtonIcon = styled.span`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const RowButtonLabel = styled.span`
  font-size: 21px;
  background: linear-gradient(90deg, #969696 0%, #9e4141 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: var(--font-neo-donggeunmo), sans-serif;
  font-weight: normal;
  margin-left: auto;
`;

const FooterText = styled.p`
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
  padding-top: 24px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-uhbee-rami), sans-serif;
  text-align: center;
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
`;

export default function AdminMainPage() {
  const router = useRouter();
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTitle, setPanelTitle] = useState<AdminPanelTitle>(
    ADMIN_MENU_CARDS[0].label,
  );
  const [panelSubView, setPanelSubView] = useState<"main" | "showLog">("main");
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [footerLine, setFooterLine] = useState(roomFooterText);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!user.isAdmin) {
      router.replace("/main");
      return;
    }
    setAllowed(true);
  }, [router]);

  useEffect(() => {
    const syncFooter = () => {
      setFooterLine(
        formatAdminGameFooterLine(getStoredAdminGameSession()),
      );
    };
    syncFooter();
    if (typeof window === "undefined") return undefined;
    window.addEventListener(ADMIN_GAME_SESSION_EVENT, syncFooter);
    window.addEventListener("storage", syncFooter);
    return () => {
      window.removeEventListener(ADMIN_GAME_SESSION_EVENT, syncFooter);
      window.removeEventListener("storage", syncFooter);
    };
  }, []);

  const openPanel = (title: AdminPanelTitle) => {
    setPanelTitle(title);
    setPanelSubView("main");
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  // 패널 열려 있을 때 body 스크롤 잠금 — 헤더가 올라가는 현상 방지
  useEffect(() => {
    if (!panelOpen) return;
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [panelOpen]);

  if (allowed !== true) {
    return null;
  }

  return (
    <Page>
      <BgDecoWrap>
        <BgDecoBar1 aria-hidden />
        <BgDecoBar2 aria-hidden />
      </BgDecoWrap>
      <TextureOverlay>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/background_effect.png" alt="" />
      </TextureOverlay>
      <ContentWrap>
        <CardGrid>
          {ADMIN_MENU_CARDS.map((item) => (
            <Card
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => openPanel(item.label)}
            >
              <CardLogoSmall aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/byte_game_logo.svg" alt="" />
              </CardLogoSmall>
              <CardIconWrap aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.iconSrc} alt="" />
              </CardIconWrap>
              <CardLabel>{item.label}</CardLabel>
            </Card>
          ))}
        </CardGrid>
        <RowButtons>
          {ADMIN_MENU_ROW_BUTTONS.map((item) => (
            <RowButton
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => openPanel(item.label)}
            >
              <RowButtonIcon aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.iconSrc} alt="" />
              </RowButtonIcon>
              <RowButtonLabel>{item.label}</RowButtonLabel>
            </RowButton>
          ))}
        </RowButtons>
        <FooterText>{footerLine}</FooterText>
      </ContentWrap>
      <BottomPanel
        open={panelOpen}
        onClose={closePanel}
        title={
          panelTitle === ADMIN_MENU_CARDS[1].label && panelSubView === "showLog"
            ? SHOW_LOG_TITLE
            : panelTitle === SHOP_PANEL_LABEL
              ? SHOP_SETTING_TITLE
              : panelTitle === GAME_PANEL_LABEL
                ? GAME_MANAGE_PANEL_TITLE
                : panelTitle
        }
      >
        {panelTitle === ADMIN_MENU_CARDS[0].label && <PersonalManagePanel />}
        {panelTitle === ADMIN_MENU_CARDS[1].label && (
          <TeamManagePanel onViewChange={setPanelSubView} />
        )}
        {panelTitle === SHOP_PANEL_LABEL && <ShopManagePanel />}
        {panelTitle === GAME_PANEL_LABEL && <GameManagePanel />}
      </BottomPanel>
    </Page>
  );
}
