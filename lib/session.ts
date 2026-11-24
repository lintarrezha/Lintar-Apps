import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/*
 * Sesi pemilik yang sederhana tapi benar:
 *  - password dibandingkan dengan timingSafeEqual (lewat hash, panjangnya selalu sama)
 *  - cookie berisi waktu kedaluwarsa + tanda tangan HMAC, jadi tidak bisa dipalsukan tanpa SESSION_SECRET
 *  - cookie HttpOnly, SameSite=Lax, dan Secure di production
 *  - kalau OWNER_PASSWORD / SESSION_SECRET belum diisi, semuanya tertutup (tidak ada yang bisa masuk)
 */

export const SESSION_COOKIE = "lintar_owner";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 hari, dalam detik

function config() {
  const password = process.env.OWNER_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!password || !secret || secret.length < 16) return null;
  return { password, secret };
}

export function isOwnerConfigured() {
  return config() !== null;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function checkPassword(input: string) {
  const current = config();
  if (!current) return false;
  return timingSafeEqual(sha256(input), sha256(current.password));
}

export function createSession(now = Date.now()) {
  const current = config();
  if (!current) throw new Error("Owner sign-in is not configured.");
  const payload = String(now + SESSION_MAX_AGE * 1000);
  return `${payload}.${sign(payload, current.secret)}`;
}

export function verifySession(token: string | undefined, now = Date.now()) {
  const current = config();
  if (!current || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  if (!/^\d+$/.test(payload)) return false;

  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(payload, current.secret));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;

  return Number(payload) > now;
}

export function sessionCookie(token: string | null) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const base = `${SESSION_COOKIE}=${token ?? ""}; Path=/; HttpOnly; SameSite=Lax`;
  return token === null ? `${base}; Max-Age=0${secure}` : `${base}; Max-Age=${SESSION_MAX_AGE}${secure}`;
}

/** Menolak permintaan lintas situs. Permintaan tanpa header Origin (misalnya curl) dibiarkan lewat. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}
