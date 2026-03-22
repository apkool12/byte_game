"use client";

import { getTeamById } from "@/data/teams";
import type { PublicUser, Team } from "@/types/user";

const STORAGE_KEY_SESSION = "byte-game-session";
const LEGACY_ID_KEY = "byte-game-current-user-id";

function parseSession(raw: string): PublicUser | null {
  try {
    const parsed = JSON.parse(raw) as PublicUser;
    if (parsed?.id && typeof parsed.name === "string") return parsed;
  } catch {
    // ignore
  }
  return null;
}

function readSessionFromStorage(): PublicUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY_SESSION);
  if (raw) {
    const session = parseSession(raw);
    if (session) return session;
  }
  if (window.localStorage.getItem(LEGACY_ID_KEY)) {
    window.localStorage.removeItem(LEGACY_ID_KEY);
  }
  return null;
}

let memorySession: PublicUser | null | undefined = undefined;

export function getCurrentUser(): PublicUser | undefined {
  if (typeof window === "undefined") return undefined;
  if (memorySession === undefined) {
    memorySession = readSessionFromStorage();
  }
  return memorySession ?? undefined;
}

export function getCurrentUserTeam(): Team | undefined {
  const user = getCurrentUser();
  return user ? getTeamById(user.teamId) : undefined;
}

export function setCurrentUserSession(user: PublicUser) {
  memorySession = user;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    window.localStorage.removeItem(LEGACY_ID_KEY);
  }
}

export function clearCurrentUserSession() {
  memorySession = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY_SESSION);
    window.localStorage.removeItem(LEGACY_ID_KEY);
  }
}
