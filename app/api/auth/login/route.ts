import { verifyLogin } from "@/data/usersPrivate.server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { name, inviteCode } = body as {
    name?: unknown;
    inviteCode?: unknown;
  };
  const nameStr = typeof name === "string" ? name : "";
  const codeStr = typeof inviteCode === "string" ? inviteCode : "";
  const user = await verifyLogin(nameStr, codeStr);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }
  return NextResponse.json({ user });
}
