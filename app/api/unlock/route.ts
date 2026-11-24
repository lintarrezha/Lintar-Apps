import { checkPassword, createSession, isOwnerConfigured, isSameOrigin, json, sessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ ok: false, error: "Forbidden." }, 403);

  if (!isOwnerConfigured()) {
    return json({ ok: false, error: "Owner sign-in is not set up. Add OWNER_PASSWORD and SESSION_SECRET." }, 503);
  }

  let password = "";
  try {
    const body = await request.json();
    if (typeof body?.password === "string") password = body.password.slice(0, 200);
  } catch {
    // Body kosong atau bukan JSON: dianggap password salah.
  }

  if (!checkPassword(password)) {
    // Jeda singkat memperlambat tebak-tebakan password.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return json({ ok: false, error: "Wrong password." }, 401);
  }

  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(createSession()) });
}
