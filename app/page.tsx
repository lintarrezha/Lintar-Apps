"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AddAppSheet from "@/components/AddAppSheet";
import AppTile from "@/components/AppTile";
import { ClearIcon, PlusIcon, SearchIcon } from "@/components/Icons";
import { apps as initialApps, type AppCategory, type AppItem } from "@/data/apps";

type Filter = "All" | AppCategory;
const filters: Filter[] = ["All", "Productivity", "Data", "Web", "Tools"];
const CUSTOM_APPS_KEY = "lintar-apps.custom-apps.v1";
const FAVORITES_KEY = "lintar-apps.favorite-ids.v1";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [customApps, setCustomApps] = useState<AppItem[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(
    () => new Set(initialApps.filter((app) => app.favorite).map((app) => app.id)),
  );
  const searchRef = useRef<HTMLInputElement>(null);

  const appList = useMemo(() => [...initialApps, ...customApps], [customApps]);

  useEffect(() => {
    try {
      const savedApps = window.localStorage.getItem(CUSTOM_APPS_KEY);
      const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);

      if (savedApps) {
        const parsedApps = JSON.parse(savedApps) as AppItem[];
        if (Array.isArray(parsedApps)) setCustomApps(parsedApps);
      }

      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites) as string[];
        if (Array.isArray(parsedFavorites)) setFavoriteIds(new Set(parsedFavorites));
      }
    } catch {
      // Ignore malformed local data and keep the built-in defaults.
    }
  }, []);

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

  const visibleApps = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return appList.filter((app) => {
      const matchesQuery =
        !normalized ||
        `${app.name} ${app.shortName} ${app.description} ${app.platform} ${app.category}`
          .toLowerCase()
          .includes(normalized);

      const matchesFilter = activeFilter === "All" || app.category === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, appList, query]);

  function toggleFavorite(id: string) {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function addApplication(app: AppItem) {
    setCustomApps((current) => {
      const next = [...current, app];
      window.localStorage.setItem(CUSTOM_APPS_KEY, JSON.stringify(next));
      return next;
    });

    if (app.favorite) {
      setFavoriteIds((current) => {
        const next = new Set(current).add(app.id);
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
        return next;
      });
    }
  }

  function openFirstResult() {
    const first = visibleApps[0];
    if (query.trim() && first && first.url !== "#") {
      window.open(first.url, "_blank", "noopener,noreferrer");
    }
  }

  const emptyTitle = query.trim() ? `No apps match “${query.trim()}”` : `No apps in ${activeFilter} yet`;
  const emptyHint = query.trim() ? "Try a different name or clear the filter." : "Use Add app to put one here.";

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

        <button type="button" className="add-button" onClick={() => setIsAddOpen(true)}>
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
              <AppTile key={app.id} app={app} variant="pinned" isFavorite onToggleFavorite={toggleFavorite} />
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

        {visibleApps.length ? (
          <ul className="list">
            {visibleApps.map((app) => (
              <AppTile key={app.id} app={app} variant="row" isFavorite={favoriteIds.has(app.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </ul>
        ) : (
          <div className="empty" role="status">
            <h3>{emptyTitle}</h3>
            <p>{emptyHint}</p>
          </div>
        )}
      </section>

      <AddAppSheet open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={addApplication} />
    </main>
  );
}
