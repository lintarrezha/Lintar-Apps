import { cookies } from "next/headers";
import Launcher from "@/components/Launcher";
import { apps } from "@/data/apps";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Isi halaman bergantung pada cookie pemilik, jadi tidak boleh di-cache sebagai halaman statis.
export const dynamic = "force-dynamic";

export default async function Page() {
  const store = await cookies();
  const isOwner = verifySession(store.get(SESSION_COOKIE)?.value);

  // Aplikasi private disaring di server: pengunjung biasa tidak pernah menerima datanya.
  const visibleApps = apps.filter((app) => isOwner || app.visibility !== "private");

  return <Launcher apps={visibleApps} isOwner={isOwner} />;
}
