"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import AddAppSheet from "@/components/AddAppSheet";
import AppTile from "@/components/AppTile";
import { ClearIcon, PlusIcon, SearchIcon } from "@/components/Icons";
import { appCategories, appIconNames, type AppCategory, type AppItem } from "@/data/types";

type Filter = "All" | AppCategory;
type Usage = Record<string, number>; // app id -> kapan terakhir dibuka (ms)

const filters: Filter[] = ["All", ...appCategories];
const CUSTOM_APPS_KEY = "lintar-apps.custom-apps.v1";
const FAVORITES_KEY = "lintar-apps.favorite-ids.v1";
const USAGE_KEY = "lintar-apps.last-opened.v1";
const RECENT_LIMIT = 4;

type Props = {
  /** Aplikasi bawaan yang boleh dilihat pengunjung ini. Aplikasi private sudah disaring di server. */
  apps: AppItem[];
  isOwner: boolean;
};

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Memvalidasi satu aplikasi dari file import. Mengembalikan null kalau datanya tidak layak dipakai. */
function sanitizeApp(raw: unknown, builtInIds: Set<string>): AppItem | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;

  if (typeof value.id !== "string" || !value.id || builtInIds.has(value.id)) return null;
  if (typeof value.name !== "string" || !value.name.trim() || !isHttpUrl(value.url)) return null;

  const name = value.name.trim().slice(0, 40);
  const accent = typeof value.accent === "string" && /^#[0-9a-f]{6}$/i.test(value.accent) ? value.accent : "#007AFF";
  const iconUrl = typeof value.iconUrl === "string" && value.iconUrl.startsWith("data:image/") ? value.iconUrl : undefined;

  return {
    id: value.id,
    name,
    shortName: name,
    description: typeof value.description === "string" ? value.description.slice(0, 90) : "",
    url: value.url,
    platform: typeof value.platform === "string" && value.platform.trim() ? value.platform.trim().slice(0, 30) : "Web App",
    account: typeof value.account === "string" && value.account.trim() ? value.account.trim().slice(0, 60) : undefined,
    category: appCategories.includes(value.category as AppCategory) ? (value.category as AppCategory) : "Web",
    icon: appIconNames.includes(value.icon as never) ? (value.icon as AppItem["icon"]) : "dashboard",
    accent,
    iconUrl,
  };
}

export default function Launcher({ apps: builtInApps, isOwner }: Props) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [customApps, setCustomApps] = useState<AppItem[]>([]);
  const [usage, setUsage] = useState<Usage>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [password, setPassword] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(
    () => new Set(builtInApps.filter((app) => app.favorite).map((app) => app.id)),
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const builtInIds = useMemo(() => new Set(builtInApps.map((app) => app.id)), [builtInApps]);

  // Aplikasi custom yang id-nya bentrok dengan aplikasi bawaan diabaikan, bawaan selalu menang.
  const localApps = useMemo(() => customApps.filter((app) => !builtInIds.has(app.id)), [customApps, builtInIds]);
  const appList = useMemo(() => [...builtInApps, ...localApps], [builtInApps, localApps]);
  const customIds = useMemo(() => new Set(localApps.map((app) => app.id)), [localApps]);

  // Load once from localStorage.
  useEffect(() => {
    try {
      const savedApps = window.localStorage.getItem(CUSTOM_APPS_KEY);
      const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      const savedUsage = window.localStorage.getItem(USAGE_KEY);

      if (savedApps) {
        const parsed = JSON.parse(savedApps) as AppItem[];
        if (Array.isArray(parsed)) setCustomApps(parsed);
      }

      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites) as string[];
        if (Array.isArray(parsed)) setFavoriteIds(new Set(parsed));
      }

      if (savedUsage) {
        const parsed = JSON.parse(savedUsage) as Usage;
        if (parsed && typeof parsed === "object") setUsage(parsed);
      }
    } catch {
      // Ignore malformed local data and keep the built-in defaults.
    }

    setHydrated(true);
  }, []);

  // Save whenever something changes (only after the first load, so defaults never overwrite saved data).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CUSTOM_APPS_KEY, JSON.stringify(customApps));
    } catch {
      setNotice("Could not save: browser storage is full. Try a smaller custom icon.");
    }
  }, [customApps, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteIds]));
    } catch {
      // Favorites are tiny; if even this fails there is nothing useful to tell the user.
    }
  }, [favoriteIds, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    } catch {
      // Recent is a convenience only.
    }
  }, [usage, hydrated]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // Press "/" anywhere to jump to search.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = document.activeElement;
      if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      event.preventDefault();
      searchRef.current?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const favoriteApps = useMemo(
    () => appList.filter((app) => favoriteIds.has(app.id)),
    [appList, favoriteIds],
  );

  // Recently opened apps that are not already shown under Favorites.
  const recentApps = useMemo(
    () =>
      appList
        .filter((app) => usage[app.id] && !favoriteIds.has(app.id))
        .sort((a, b) => usage[b.id] - usage[a.id])
        .slice(0, RECENT_LIMIT),
    [appList, favoriteIds, usage],
  );

  const visibleApps = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const matches = appList.filter((app) => {
      const matchesQuery =
        !normalized ||
        `${app.name} ${app.shortName} ${app.description} ${app.platform} ${app.account ?? ""} ${app.category}`
          .toLowerCase()
          .includes(normalized);

      const matchesFilter = activeFilter === "All" || app.category === activeFilter;
      return matchesQuery && matchesFilter;
    });

    // Shortcut Drive ditaruh di bawah supaya tidak menenggelamkan aplikasi buatan sendiri.
    return matches.sort((a, b) => Number(a.category === "Drive") - Number(b.category === "Drive"));
  }, [activeFilter, appList, query]);

  // Di tab Drive, shortcut dikelompokkan per akun. Kalau tidak ada satu pun yang punya akun, tampil sebagai satu daftar.
  const driveGroups = useMemo(() => {
    if (activeFilter !== "Drive") return null;
    if (!visibleApps.some((app) => app.account)) return null;

    const groups = new Map<string, AppItem[]>();
    visibleApps.forEach((app) => {
      const key = app.account || "No account";
      groups.set(key, [...(groups.get(key) ?? []), app]);
    });

    return [...groups.entries()].sort(([a], [b]) => {
      if (a === "No account") return 1;
      if (b === "No account") return -1;
      return a.localeCompare(b);
    });
  }, [activeFilter, visibleApps]);

  function recordOpen(id: string) {
    setUsage((current) => ({ ...current, [id]: Date.now() }));
  }

  function toggleFavorite(id: string) {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openAddSheet() {
    setEditingApp(null);
    setIsSheetOpen(true);
  }

  function openEditSheet(id: string) {
    const app = customApps.find((item) => item.id === id);
    if (!app) return;
    setEditingApp({ ...app, favorite: favoriteIds.has(id) });
    setIsSheetOpen(true);
  }

  function closeSheet() {
    setIsSheetOpen(false);
    setEditingApp(null);
  }

  function saveApplication(app: AppItem) {
    const { favorite, ...stored } = app;

    setCustomApps((current) =>
      current.some((item) => item.id === app.id)
        ? current.map((item) => (item.id === app.id ? stored : item))
        : [...current, stored],
    );

    setFavoriteIds((current) => {
      const next = new Set(current);
      if (favorite) next.add(app.id);
      else next.delete(app.id);
      return next;
    });
  }

  function deleteApplication(id: string) {
    setCustomApps((current) => current.filter((item) => item.id !== id));
    setFavoriteIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setUsage((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function openFirstResult() {
    const first = visibleApps[0];
    if (query.trim() && first && first.url !== "#") {
      recordOpen(first.id);
      window.open(first.url, "_blank", "noopener,noreferrer");
    }
  }

  function exportBackup() {
    const backup = {
      app: "lintar-apps",
      version: 1,
      exportedAt: new Date().toISOString(),
      customApps,
      favorites: [...favoriteIds],
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lintar-apps-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setNotice(`Exported ${customApps.length} custom ${customApps.length === 1 ? "app" : "apps"}.`);
  }

  async function importBackup(file: File) {
    try {
      const data = JSON.parse(await file.text()) as { customApps?: unknown; favorites?: unknown };
      if (!data || typeof data !== "object" || (!Array.isArray(data.customApps) && !Array.isArray(data.favorites))) {
        throw new Error("invalid");
      }

      const incoming = (Array.isArray(data.customApps) ? data.customApps : [])
        .map((item) => sanitizeApp(item, builtInIds))
        .filter((app): app is AppItem => app !== null);
      const skipped = (Array.isArray(data.customApps) ? data.customApps.length : 0) - incoming.length;

      // Merge: imported apps replace local ones with the same id, everything else is kept.
      setCustomApps((current) => {
        const byId = new Map(current.map((app) => [app.id, app]));
        incoming.forEach((app) => byId.set(app.id, app));
        return [...byId.values()];
      });

      if (Array.isArray(data.favorites)) {
        const knownIds = new Set([...builtInIds, ...customIds, ...incoming.map((app) => app.id)]);
        const incomingFavorites = (data.favorites as unknown[]).filter((id): id is string => typeof id === "string" && knownIds.has(id));
        setFavoriteIds((current) => new Set([...current, ...incomingFavorites]));
      }

      setNotice(
        `Imported ${incoming.length} ${incoming.length === 1 ? "app" : "apps"}` +
          (skipped > 0 ? `, skipped ${skipped} invalid.` : "."),
      );
    } catch {
      setNotice("That file is not a valid Lintar Apps backup.");
    }
  }

  function renderRow(app: AppItem, grouped = false) {
    return (
      <AppTile
        key={app.id}
        app={app}
        variant="row"
        isFavorite={favoriteIds.has(app.id)}
        isCustom={customIds.has(app.id)}
        grouped={grouped}
        onToggleFavorite={toggleFavorite}
        onOpen={recordOpen}
        onEdit={openEditSheet}
      />
    );
  }

  async function submitOwnerPassword(event: FormEvent) {
    event.preventDefault();
    if (!password || isBusy) return;
    setIsBusy(true);

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (result.ok) {
        window.location.reload(); // server mengirim ulang halaman, kali ini beserta aplikasi private
        return;
      }

      setNotice(result.error ?? "Could not sign in.");
    } catch {
      setNotice("Could not reach the server.");
    }

    setPassword("");
    setIsBusy(false);
  }

  async function signOutOwner() {
    setIsBusy(true);
    try {
      await fetch("/api/lock", { method: "POST" });
    } finally {
      window.location.reload();
    }
  }

  const emptyTitle = query.trim() ? `No apps match “${query.trim()}”` : `No apps in ${activeFilter} yet`;
  const emptyHint = query.trim()
    ? "Try a different name or clear the filter."
    : activeFilter === "Drive"
      ? "Use Add app and choose Drive to add a folder shortcut."
      : "Use Add app to put one here.";

  return (
    <main className="page">
      <header className="header">
        <h1 className="header-title">Lintar Apps</h1>

        <div className="search">
          <SearchIcon className="search-icon" />
          <input
            ref={searchRef}
            type="text"
            inputMode="search"
            enterKeyHint="go"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                openFirstResult();
              } else if (event.key === "Escape") {
                setQuery("");
              }
            }}
            placeholder="Search"
            aria-label="Search apps"
          />
          {query && (
            <button type="button" className="search-clear" aria-label="Clear search" onClick={() => { setQuery(""); searchRef.current?.focus(); }}>
              <ClearIcon />
            </button>
          )}
        </div>

        <button type="button" className="add-button" onClick={openAddSheet}>
          <PlusIcon />
          Add app
        </button>
      </header>

      {!query && favoriteApps.length > 0 && (
        <section className="section" aria-labelledby="favorites-title">
          <div className="section-head">
            <h2 id="favorites-title">Favorites</h2>
          </div>

          <ul className="pinned">
            {favoriteApps.map((app) => (
              <AppTile key={app.id} app={app} variant="pinned" isFavorite onToggleFavorite={toggleFavorite} onOpen={recordOpen} />
            ))}
          </ul>
        </section>
      )}

      {!query && recentApps.length > 0 && (
        <section className="section" aria-labelledby="recent-title">
          <div className="section-head">
            <h2 id="recent-title">Recent</h2>
          </div>

          <ul className="pinned">
            {recentApps.map((app) => (
              <AppTile key={app.id} app={app} variant="pinned" isFavorite={false} onToggleFavorite={toggleFavorite} onOpen={recordOpen} />
            ))}
          </ul>
        </section>
      )}

      <section className="section" aria-labelledby="library-title">
        <div className="section-head">
          <h2 id="library-title">All apps</h2>

          <div className="segmented" role="group" aria-label="Filter by category">
            {filters.map((filter) => (
              <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {visibleApps.length === 0 ? (
          <div className="empty" role="status">
            <h3>{emptyTitle}</h3>
            <p>{emptyHint}</p>
          </div>
        ) : driveGroups ? (
          driveGroups.map(([account, items]) => (
            <div key={account} className="group">
              <h3 className="group-title">{account}</h3>
              <ul className="list">{items.map((item) => renderRow(item, true))}</ul>
            </div>
          ))
        ) : (
          <ul className="list">{visibleApps.map((item) => renderRow(item))}</ul>
        )}
      </section>

      <div className="backup">
        <p>Apps you add here are saved in this browser only. Export a backup to move them to another device.{isOwner ? " Private apps are loaded from the server." : ""}</p>
        <div className="backup-actions">
          <button type="button" onClick={exportBackup}>Export</button>
          <button type="button" onClick={() => importRef.current?.click()}>Import</button>
          {isOwner ? (
            <button type="button" className="backup-owner" onClick={signOutOwner} disabled={isBusy}>Sign out</button>
          ) : (
            <button type="button" className="backup-owner" onClick={() => setIsSigningIn((open) => !open)} aria-expanded={isSigningIn}>
              Owner sign-in
            </button>
          )}
        </div>
        {isSigningIn && !isOwner && (
          <form className="owner-form" onSubmit={submitOwnerPassword}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              aria-label="Owner password"
              autoComplete="current-password"
              autoFocus
            />
            <button type="submit" disabled={!password || isBusy}>Unlock</button>
          </form>
        )}
        <p className="backup-notice" role="status" aria-live="polite">{notice}</p>
        <input
          ref={importRef}
          type="file"
          accept="application/json,.json"
          className="visually-hidden-file"
          tabIndex={-1}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) void importBackup(file);
          }}
        />
      </div>

      <AddAppSheet open={isSheetOpen} editing={editingApp} onClose={closeSheet} onSave={saveApplication} onDelete={deleteApplication} />
    </main>
  );
}
