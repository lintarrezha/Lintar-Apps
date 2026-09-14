"use client";

import { useEffect, useMemo, useState } from "react";
import AddAppSheet from "@/components/AddAppSheet";
import AppTile from "@/components/AppTile";
import { PlusIcon, SearchIcon, SettingsIcon } from "@/components/Icons";
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

  const favoriteApps = useMemo(
    () => appList.filter((app) => favoriteIds.has(app.id)),
    [appList, favoriteIds],
  );

  const visibleApps = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return appList.filter((app) => {
      const matchesQuery =
        !normalized ||
        `${app.name} ${app.shortName} ${app.platform} ${app.category}`
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

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-kicker">Personal launcher</span>
          <h1>Lintar Apps</h1>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="toolbar-button toolbar-button-primary"
            aria-label="Tambah aplikasi"
            title="Tambah aplikasi"
            onClick={() => setIsAddOpen(true)}
          >
            <PlusIcon />
          </button>
          <button type="button" className="toolbar-button" aria-label="Settings" title="Settings">
            <SettingsIcon />
          </button>
        </div>
      </header>

      <label className="spotlight-search">
        <SearchIcon />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search apps"
          aria-label="Search apps"
        />
      </label>

      {!query && favoriteApps.length > 0 && (
        <section className="app-section favorite-section" aria-labelledby="favorites-title">
          <div className="section-title-row">
            <div>
              <span className="section-eyebrow">Quick access</span>
              <h2 id="favorites-title">Favorites</h2>
            </div>
            <span className="section-count">{favoriteApps.length}</span>
          </div>

          <div className="app-grid app-grid-favorites">
            {favoriteApps.map((app) => (
              <AppTile
                key={app.id}
                app={app}
                isFavorite={favoriteIds.has(app.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      <section className="app-section library-section" aria-labelledby="library-title">
        <div className="section-title-row library-heading">
          <div>
            <span className="section-eyebrow">Library</span>
            <h2 id="library-title">All Apps</h2>
          </div>
          <span className="section-count">{visibleApps.length}</span>
        </div>

        <div className="filter-row" role="tablist" aria-label="Filter apps by category">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={`filter-pill ${activeFilter === filter ? "is-active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {visibleApps.length ? (
          <div className="app-grid">
            {visibleApps.map((app) => (
              <AppTile
                key={app.id}
                app={app}
                isFavorite={favoriteIds.has(app.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-symbol">
              <SearchIcon />
            </div>
            <h3>No apps found</h3>
            <p>Coba kata kunci atau kategori lain.</p>
          </div>
        )}
      </section>

      <footer>
        <span>Lintar Apps</span>
        <span aria-hidden="true">·</span>
        <span>{appList.length} apps</span>
      </footer>

      <AddAppSheet open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={addApplication} />
    </main>
  );
}
