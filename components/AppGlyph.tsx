import type { ReactNode, SVGProps } from 'react';
import type { AppIconName } from '@/data/apps';

type Props = SVGProps<SVGSVGElement> & {
  name: AppIconName;
};

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const icons: Record<AppIconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.7" />
      <rect x="13.5" y="4" width="6.5" height="4.5" rx="1.7" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.7" />
      <rect x="13.5" y="11.5" width="6.5" height="8.5" rx="1.7" />
    </>
  ),
  document: (
    <>
      <path d="M7 3.75h6.8L18.5 8.5v11.75H7z" />
      <path d="M13.5 3.75V8.5h5" />
      <path d="M9.5 12h6M9.5 15h6M9.5 18h3.8" />
    </>
  ),
  receipt: (
    <>
      <path d="M7 3.5h10v17l-2-1.35-2 1.35-2-1.35-2 1.35-2-1.35-2 1.35v-17Z" />
      <path d="M8.8 8h6.4M8.8 11.5h6.4M8.8 15h4.1" />
    </>
  ),
  chart: (
    <>
      <path d="M4.5 19.5h15" />
      <path d="M7 17v-4.5M12 17V8M17 17v-6" />
      <path d="m6.5 9 4.1-3.2 3.1 2.1 4.1-3.2" />
      <path d="M17.8 4.7v3.1" />
    </>
  ),
  bag: (
    <>
      <path d="M5.25 8.5h13.5l-1 11.75H6.25z" />
      <path d="M8.8 9V7.2a3.2 3.2 0 0 1 6.4 0V9" />
      <path d="M9.25 12.25h5.5" />
    </>
  ),
  camera: (
    <>
      <rect x="3.5" y="6.75" width="17" height="11.75" rx="3" />
      <path d="m8 6.75 1.45-2h5.1l1.45 2" />
      <circle cx="12" cy="12.65" r="3.15" />
      <path d="M17.5 9.3h.01" />
    </>
  ),
  cake: (
    <>
      <path d="M5 12.4h14v7H5z" />
      <path d="M5 15.45c2 1.55 3.5-1.55 5.5 0s3.5-1.55 5.5 0c1 .8 2 .45 3-.25" />
      <path d="M8 12.4V9h8v3.4M12 9V5.4" />
      <path d="M12 5.4c-1.55-1.05-1-2.25 0-3.05 1.05 1 1.55 2.15 0 3.05Z" />
    </>
  ),
  drop: (
    <>
      <path d="M12 3.1s6 6.5 6 11.05a6 6 0 1 1-12 0C6 9.6 12 3.1 12 3.1Z" />
      <path d="M9 15.2a3.15 3.15 0 0 0 3 2.05" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4.5" width="16" height="6" rx="2" />
      <rect x="4" y="13.5" width="16" height="6" rx="2" />
      <path d="M7.5 7.5h.01M7.5 16.5h.01M10.5 7.5h6M10.5 16.5h6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.9 12h16.2M12 3.75c2.15 2.25 3.2 5 3.2 8.25S14.15 18 12 20.25C9.85 18 8.8 15.25 8.8 12S9.85 6 12 3.75Z" />
    </>
  ),
  code: (
    <>
      <path d="m9 7-5 5 5 5M15 7l5 5-5 5M13.25 4.75l-2.5 14.5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.25" ry="3" />
      <path d="M4.75 6v6c0 1.65 3.25 3 7.25 3s7.25-1.35 7.25-3V6" />
      <path d="M4.75 12v6c0 1.65 3.25 3 7.25 3s7.25-1.35 7.25-3v-6" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
      <path d="M8 3.75v3.5M16 3.75v3.5M4 9.5h16" />
      <path d="M8 13h2M14 13h2M8 16.5h2M14 16.5h2" />
    </>
  ),
  folder: (
    <>
      <path d="M3.75 7.25h6l1.8 2h8.7v8.5a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25z" />
      <path d="M3.75 7.25V6.5A2.5 2.5 0 0 1 6.25 4h3.2l1.8 2h6.5A2.5 2.5 0 0 1 20.25 8.5v.75" />
    </>
  ),
  link: (
    <>
      <path d="M10.25 13.75a3.5 3.5 0 0 0 4.95 0l2.25-2.25a3.5 3.5 0 0 0-4.95-4.95l-1.3 1.3" />
      <path d="M13.75 10.25a3.5 3.5 0 0 0-4.95 0L6.55 12.5a3.5 3.5 0 1 0 4.95 4.95l1.3-1.3" />
    </>
  ),
  terminal: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="m7 9 3 3-3 3M12.5 15h4" />
    </>
  ),
};

export default function AppGlyph({ name, ...props }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>
      {icons[name]}
    </svg>
  );
}
