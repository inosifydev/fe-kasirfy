import { AuthSession } from "@/features/user/types";

const SESSION_KEY = "kasirfy_session";

export function saveSession(
  user: AuthSession
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user)
  );
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const session =
    localStorage.getItem(SESSION_KEY);

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session) as AuthSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}