'use client';

import type { CSSProperties } from 'react';
import AppGlyph from '@/components/AppGlyph';
import { StarIcon } from '@/components/Icons';
import type { AppItem } from '@/data/apps';

type Props = {
  app: AppItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

type AppTileStyle = CSSProperties & {
  '--app-accent': string;
};

export default function AppTile({ app, isFavorite, onToggleFavorite }: Props) {
  const disabled = app.url === '#';
  const hasCustomIcon = Boolean(app.iconUrl);
  const tileStyle: AppTileStyle = {
    '--app-accent': app.accent,
  };

  return (
    <article className="app-tile" style={tileStyle}>
      <a
        href={app.url}
        target={disabled ? undefined : '_blank'}
        rel={disabled ? undefined : 'noreferrer'}
        className={`app-launch ${disabled ? 'is-disabled' : ''}`}
        onClick={(event) => {
          if (disabled) event.preventDefault();
        }}
        aria-label={`Buka ${app.name}`}
        aria-disabled={disabled}
      >
        <span className={`app-icon-shell ${hasCustomIcon ? 'has-custom-image' : ''}`} style={{ backgroundColor: hasCustomIcon ? '#ffffff' : app.accent }} aria-hidden="true">
          {app.iconUrl ? <img className="app-icon-image" src={app.iconUrl} alt="" /> : <AppGlyph name={app.icon} />}
        </span>

        <span className="app-name" title={app.name}>
          {app.shortName}
        </span>
        <span className="app-platform">{app.platform}</span>
      </a>

      <button type="button" className={`tile-favorite ${isFavorite ? 'is-favorite' : ''}`} aria-label={isFavorite ? `Hapus ${app.name} dari favorit` : `Tambahkan ${app.name} ke favorit`} onClick={() => onToggleFavorite(app.id)}>
        <StarIcon filled={isFavorite} />
      </button>
    </article>
  );
}
