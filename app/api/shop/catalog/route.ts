import { NextResponse } from "next/server";
import {
  getShopCatalog,
  normalizeShopCatalogInput,
  replaceShopCatalog,
} from "@/lib/shopCatalog.server";

export async function GET() {
  try {
    const items = await getShopCatalog();
    return NextResponse.json({ items });
  } catch (e) {
    console.error("[api/shop/catalog] GET", e);
    return NextResponse.json(
      { error: "Failed to load catalog" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const payload = body as { items?: unknown };
    const next = normalizeShopCatalogInput(payload?.items);
    if (!next) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }
    await replaceShopCatalog(next);
    return NextResponse.json({ ok: true, items: next });
  } catch (e) {
    console.error("[api/shop/catalog] PUT", e);
    return NextResponse.json(
      { error: "Failed to save catalog" },
      { status: 500 },
    );
  }
}
