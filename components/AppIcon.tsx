import type { CSSProperties } from 'react';
import AppGlyph from '@/components/AppGlyph';
import type { AppIconName } from '@/data/types';

type Props = {
  icon: AppIconName;
  accent: string;
  iconUrl?: string;
  className?: string;
};

type IconStyle = CSSProperties & { '--accent': string };

export default function AppIcon({ icon, accent, iconUrl, className = '' }: Props) {
  const style: IconStyle = { '--accent': accent };

  return (
    <span className={`app-icon ${iconUrl ? 'has-image' : ''} ${className}`.trim()} style={style} aria-hidden="true">
      {iconUrl ? <img src={iconUrl} alt="" /> : <AppGlyph name={icon} />}
    </span>
  );
}
