import { getUsersPublic } from "@/data/usersPrivate.server";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await getUsersPublic();
  return NextResponse.json({ users });
}
