'use client';

import type { MouseEvent } from 'react';
import AppIcon from '@/components/AppIcon';
import { ChevronIcon, EditIcon, StarIcon } from '@/components/Icons';
import type { AppItem } from '@/data/apps';

type Props = {
  app: AppItem;
  variant: 'pinned' | 'row';
  isFavorite: boolean;
  isCustom?: boolean;
  /** Baris berada di bawah judul grup akun, jadi nama akun tidak perlu diulang di baris. */
  grouped?: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
};

function linkProps(app: AppItem, onOpen: (id: string) => void) {
  const disabled = app.url === '#';

  return {
    href: app.url,
    target: disabled ? undefined : '_blank',
    rel: disabled ? undefined : 'noreferrer',
    'aria-disabled': disabled || undefined,
    onClick: (event: MouseEvent) => {
      if (disabled) event.preventDefault();
      else onOpen(app.id);
    },
    // Klik tengah (buka di tab baru) tidak memicu onClick, jadi dicatat di sini.
    onAuxClick: (event: MouseEvent) => {
      if (event.button === 1 && !disabled) onOpen(app.id);
    },
  };
}

export default function AppTile({ app, variant, isFavorite, isCustom = false, grouped = false, onToggleFavorite, onOpen, onEdit }: Props) {
  if (variant === 'pinned') {
    return (
      <li className="pin">
        <a className="pin-link" {...linkProps(app, onOpen)} title={app.name}>
          <AppIcon icon={app.icon} accent={app.accent} iconUrl={app.iconUrl} />
          <span className="pin-name">{app.shortName}</span>
        </a>
      </li>
    );
  }

  const editable = isCustom && onEdit;
  const note = app.description || (grouped ? '' : app.account || app.category);
  const platformLabel = app.account && !grouped ? `${app.platform} · ${app.account}` : app.platform;

  return (
    <li className={`app-row ${editable ? 'has-edit' : ''}`}>
      <a className="app-row-link" {...linkProps(app, onOpen)}>
        <AppIcon icon={app.icon} accent={app.accent} iconUrl={app.iconUrl} />
        <span className="app-row-text">
          <span className="app-row-name">{app.name}</span>
          {note && <span className="app-row-desc">{note}</span>}
        </span>
        <span className="app-row-platform">{platformLabel}</span>
      </a>

      {editable && (
        <button type="button" className="row-action row-edit" aria-label={`Edit ${app.name}`} onClick={() => onEdit(app.id)}>
          <EditIcon />
        </button>
      )}

      <button
        type="button"
        className={`row-action row-star ${isFavorite ? 'is-favorite' : ''}`}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${app.name} from favorites` : `Add ${app.name} to favorites`}
        onClick={() => onToggleFavorite(app.id)}
      >
        <StarIcon filled={isFavorite} />
      </button>

      <ChevronIcon className="row-chevron" />
    </li>
  );
}
