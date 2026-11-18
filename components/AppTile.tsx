'use client';

import type { MouseEvent } from 'react';
import AppIcon from '@/components/AppIcon';
import { ChevronIcon, StarIcon } from '@/components/Icons';
import type { AppItem } from '@/data/apps';

type Props = {
  app: AppItem;
  variant: 'pinned' | 'row';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

function linkProps(app: AppItem) {
  const disabled = app.url === '#';

  return {
    href: app.url,
    target: disabled ? undefined : '_blank',
    rel: disabled ? undefined : 'noreferrer',
    'aria-disabled': disabled || undefined,
    onClick: (event: MouseEvent) => {
      if (disabled) event.preventDefault();
    },
  };
}

export default function AppTile({ app, variant, isFavorite, onToggleFavorite }: Props) {
  if (variant === 'pinned') {
    return (
      <li className="pin">
        <a className="pin-link" {...linkProps(app)} title={app.name}>
          <AppIcon icon={app.icon} accent={app.accent} iconUrl={app.iconUrl} />
          <span className="pin-name">{app.shortName}</span>
        </a>
      </li>
    );
  }

  return (
    <li className="app-row">
      <a className="app-row-link" {...linkProps(app)}>
        <AppIcon icon={app.icon} accent={app.accent} iconUrl={app.iconUrl} />
        <span className="app-row-text">
          <span className="app-row-name">{app.name}</span>
          <span className="app-row-desc">{app.description || app.category}</span>
        </span>
        <span className="app-row-platform">{app.platform}</span>
      </a>

      <button
        type="button"
        className={`row-star ${isFavorite ? 'is-favorite' : ''}`}
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
