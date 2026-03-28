"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { type ShopItemRecord } from "@/data/shopItems";
import {
  ARIA_REMOVE_SHOP_ITEM,
  BTN_ADD_SHOP_ITEM,
  BTN_SAVE_SHOP_CATALOG,
  LABEL_SHOP_ITEM_ICON,
  POINT_SUFFIX,
  SHOP_CATALOG_EMPTY,
  SHOP_CATALOG_SAVE_DONE,
  SHOP_CATALOG_SAVE_FAIL,
} from "@/data/copy";
import { getSocket } from "@/app/socketClient";
import styled from "@emotion/styled";
import ShopItemDeleteModal from "./ShopItemDeleteModal";
import ShopItemAddModal from "./ShopItemAddModal";
import ShopIconSelectModal from "./ShopIconSelectModal";

const DEFAULT_ICON = "/item-quesiton.svg";

const ShowLogFullWidth = styled.div`
  width: 100%;
  max-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
`;

const LogScrollWrap = styled.div`
  width: 100%;
  max-width: 320px;
  flex: 1;
  min-height: 120px;
  max-height: 42vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
  margin-bottom: 16px;
`;

const ShopRow = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 8px;
  padding: 12px 12px 12px 10px;
  border-radius: 12px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
`;

const RowIconBtn = styled.button`
  flex-shrink: 0;
  width: 44px;
  align-self: center;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #3a3a3a 0%, #1f1f1f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.88;
  }

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
`;

const ShopRowLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 8px 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, #333 0%, #1a1a1a 100%);
`;

const NameInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  color: #fff;
  font-family: var(--font-pretendard-light), sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 130%;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
`;

const ShopRowRight = styled.div`
  flex: 0 0 auto;
  align-self: center;
  min-width: 66px;
  padding: 4px 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #c41e50 0%, #f5376a 50%, #e88a9e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-sizing: border-box;
`;

const PriceInput = styled.input`
  flex: 0 1 auto;
  min-width: 0;
  width: 2.6rem;
  max-width: 3.2rem;
  border: none;
  background: transparent;
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  outline: none;
  -moz-appearance: textfield;
  padding: 0;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PointSuffix = styled.span`
  color: #fff;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  opacity: 0.95;
  line-height: 1;
`;

const RemoveBtn = styled.button`
  flex-shrink: 0;
  width: 40px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.85);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    opacity: 0.85;
  }
`;

const LogEmpty = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 24px 16px;
  font-family: var(--font-pretendard-light), sans-serif;
`;

const ActionBtn = styled.button`
  width: 100%;
  max-width: 320px;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
  box-shadow: 0 4px 4px 0 rgba(141, 141, 141, 0.1);
  cursor: pointer;
  font-family: var(--font-pretendard-black), sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveBtn = styled(ActionBtn)`
  background: linear-gradient(180deg, #a11846 0%, #6e0f31 100%);
  margin-bottom: 0;
`;

const SaveHint = styled.p`
  margin: 10px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  font-family: var(--font-pretendard-light), sans-serif;
  min-height: 1.2em;
`;

function cloneRecords(records: ShopItemRecord[]): ShopItemRecord[] {
  return records.map((r) => ({ ...r }));
}

export default function ShopManagePanel() {
  const [items, setItems] = useState<ShopItemRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [hint, setHint] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ShopItemRecord | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [iconPickRowId, setIconPickRowId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/shop/catalog");
        const data: unknown = await res.json();
        const raw =
          data && typeof data === "object" && "items" in data
            ? (data as { items: unknown }).items
            : null;
        if (cancelled || !Array.isArray(raw)) return;
        const next: ShopItemRecord[] = [];
        for (const row of raw) {
          if (!row || typeof row !== "object") continue;
          const o = row as Record<string, unknown>;
          const id = typeof o.id === "string" ? o.id : "";
          const name = typeof o.name === "string" ? o.name : "";
          const price = Number(o.price);
          const iconSrc =
            typeof o.iconSrc === "string" ? o.iconSrc : DEFAULT_ICON;
          if (!id || !name || Number.isNaN(price)) continue;
          next.push({ id, name, price, iconSrc });
        }
        if (!cancelled) setItems(cloneRecords(next));
      } catch {
        /* 초기 목록 유지 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateRow = useCallback(
    (id: string, patch: Partial<ShopItemRecord>) => {
      setItems((prev) =>
        prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
      );
    },
    [],
  );

  const removeRow = useCallback((id: string) => {
    setItems((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const iconPickValue = useMemo(() => {
    if (!iconPickRowId) return DEFAULT_ICON;
    return (
      items.find((r) => r.id === iconPickRowId)?.iconSrc ?? DEFAULT_ICON
    );
  }, [iconPickRowId, items]);

  const save = useCallback(async () => {
    setSaving(true);
    setHint("");
    try {
      const res = await fetch("/api/shop/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        setHint(SHOP_CATALOG_SAVE_FAIL);
        return;
      }
      setHint(SHOP_CATALOG_SAVE_DONE);
      window.setTimeout(() => setHint(""), 2200);
      const socket = getSocket();
      socket.emit("admin:notifyShopCatalogChanged");
    } catch {
      setHint(SHOP_CATALOG_SAVE_FAIL);
    } finally {
      setSaving(false);
    }
  }, [items]);

  return (
    <ShowLogFullWidth>
      <LogScrollWrap>
        {items.length === 0 ? (
          <LogEmpty>{SHOP_CATALOG_EMPTY}</LogEmpty>
        ) : (
          items.map((row) => (
            <ShopRow key={row.id}>
              <RowIconBtn
                type="button"
                aria-label={`${LABEL_SHOP_ITEM_ICON} ${row.name}`}
                onClick={() => setIconPickRowId(row.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={row.iconSrc || DEFAULT_ICON} alt="" />
              </RowIconBtn>
              <ShopRowLeft>
                <NameInput
                  aria-label={`상품명 ${row.id}`}
                  value={row.name}
                  onChange={(e) =>
                    updateRow(row.id, { name: e.target.value })
                  }
                />
              </ShopRowLeft>
              <ShopRowRight>
                <PriceInput
                  aria-label={`가격 ${row.id}`}
                  type="number"
                  min={0}
                  step={1}
                  value={Number.isNaN(row.price) ? "" : row.price}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") {
                      updateRow(row.id, { price: 0 });
                      return;
                    }
                    const n = Math.floor(Number(v));
                    if (!Number.isNaN(n)) updateRow(row.id, { price: n });
                  }}
                />
                <PointSuffix>{POINT_SUFFIX}</PointSuffix>
              </ShopRowRight>
              <RemoveBtn
                type="button"
                aria-label={ARIA_REMOVE_SHOP_ITEM}
                onClick={() => setDeleteTarget(row)}
              >
                ×
              </RemoveBtn>
            </ShopRow>
          ))
        )}
      </LogScrollWrap>
      <ActionBtn type="button" onClick={() => setAddOpen(true)}>
        {BTN_ADD_SHOP_ITEM}
      </ActionBtn>
      <SaveBtn type="button" onClick={save} disabled={saving || items.length === 0}>
        {BTN_SAVE_SHOP_CATALOG}
      </SaveBtn>
      <SaveHint>{hint}</SaveHint>

      <ShopItemDeleteModal
        open={deleteTarget != null}
        itemName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) removeRow(deleteTarget.id);
        }}
      />
      <ShopItemAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(payload) => {
          setItems((prev) => [
            ...prev,
            {
              id: `shop-${Date.now()}`,
              name: payload.name,
              price: payload.price,
              iconSrc: payload.iconSrc,
            },
          ]);
        }}
      />
      <ShopIconSelectModal
        open={iconPickRowId != null}
        value={iconPickValue}
        onClose={() => setIconPickRowId(null)}
        onSelect={(iconSrc) => {
          if (iconPickRowId) updateRow(iconPickRowId, { iconSrc });
        }}
      />
    </ShowLogFullWidth>
  );
}
