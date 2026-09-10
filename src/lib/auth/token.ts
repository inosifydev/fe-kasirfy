
/**
 * =========================================================
 * ACCESS TOKEN (in-memory)
 * =========================================================
 *
 * Access token hanya disimpan di memory — JANGAN pernah
 * disimpan ke localStorage/sessionStorage.
 *
 * Refresh token diasumsikan berada di HttpOnly Cookie yang
 * dikirim otomatis lewat credentials: "include".
 */

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
}