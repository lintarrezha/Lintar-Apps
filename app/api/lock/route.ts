import { isSameOrigin, json, sessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ ok: false, error: "Forbidden." }, 403);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(null) });
}
