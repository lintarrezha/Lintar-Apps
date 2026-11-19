import type { ReactNode, SVGProps } from 'react';
import type { AppIconName } from '@/data/apps';

type Props = SVGProps<SVGSVGElement> & {
  name: AppIconName;
};

/*
 * Setiap ikon digambar penuh di kanvas 60x60 (seukuran satu kotak ikon), bukan sebagai glyph kecil.
 * Warna dikendalikan lewat class di globals.css supaya semuanya turunan dari --accent:
 *   putih (default)  -> bentuk utama
 *   .soft            -> aksen + putih, lebih redup
 *   .shade           -> aksen + hitam, lebih gelap
 *   .ink             -> warna aksen murni, untuk detail di atas bentuk putih
 *   .st              -> garis tebal (+ .thin / .mid, .c-soft / .c-ink untuk variasi)
 */
const icons: Record<AppIconName, ReactNode> = {
  receipt: (
    <>
      <path d="M18 14a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2V48l-4-3-4 3-4-3-4 3-4-3-4 3Z" />
      <rect className="ink" x="23" y="19" width="8" height="3" rx="1.5" />
      <rect className="ink" x="23" y="25" width="14" height="3" rx="1.5" />
      <rect className="ink" x="23" y="32" width="14" height="5" rx="2.5" />
    </>
  ),
  chart: (
    <>
      <rect className="soft" x="14" y="31" width="9" height="15" rx="2.5" />
      <rect className="soft" x="25.5" y="22" width="9" height="24" rx="2.5" />
      <rect x="37" y="13" width="9" height="33" rx="2.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="30" cy="30" r="16" />
      <ellipse className="st thin c-ink" cx="30" cy="30" rx="6.5" ry="16" />
      <path className="st thin c-ink" d="M14 30h32M16.5 22.5h27M16.5 37.5h27" />
    </>
  ),
  lock: (
    <>
      <path className="st" d="M22.5 28V22a7.5 7.5 0 0 1 15 0V28" />
      <rect x="16" y="27" width="28" height="20" rx="5" />
      <circle className="ink" cx="30" cy="35.5" r="3.2" />
      <rect className="ink" x="28.6" y="36" width="2.8" height="5.5" rx="1.4" />
    </>
  ),
  home: (
    <>
      <rect x="36.5" y="15" width="5.5" height="11" rx="1.5" />
      <path stroke="#fff" strokeWidth="3" strokeLinejoin="round" d="M30 14 46.5 28v16a3 3 0 0 1-3 3h-27a3 3 0 0 1-3-3V28Z" />
      <path className="ink" d="M25.5 47v-9a4.5 4.5 0 0 1 9 0v9Z" />
    </>
  ),
  qr: (
    <>
      <rect x="14" y="14" width="13" height="13" rx="3.5" />
      <rect className="ink" x="17.5" y="17.5" width="6" height="6" rx="2" />
      <rect x="33" y="14" width="13" height="13" rx="3.5" />
      <rect className="ink" x="36.5" y="17.5" width="6" height="6" rx="2" />
      <rect x="14" y="33" width="13" height="13" rx="3.5" />
      <rect className="ink" x="17.5" y="36.5" width="6" height="6" rx="2" />
      <rect x="33" y="33" width="5.5" height="5.5" rx="1.5" />
      <rect className="soft" x="40.5" y="33" width="5.5" height="5.5" rx="1.5" />
      <rect className="soft" x="33" y="40.5" width="5.5" height="5.5" rx="1.5" />
      <rect x="40.5" y="40.5" width="5.5" height="5.5" rx="1.5" />
    </>
  ),
  cake: (
    <>
      <rect className="soft" x="16" y="29" width="28" height="18" rx="3" />
      <rect x="27" y="31" width="6" height="16" />
      <rect x="13" y="22" width="34" height="9" rx="3" />
      <rect className="ink" x="27" y="22" width="6" height="9" />
      <path d="M30 22C22 22 17 14.5 22.5 13 27 12 30 17 30 22ZM30 22c8 0 13-7.5 7.5-9C33 12 30 17 30 22Z" />
      <circle className="ink" cx="30" cy="21.5" r="2.6" />
    </>
  ),
  camera: (
    <>
      <path className="soft" d="m21 21 2.4-4.6a2 2 0 0 1 1.8-1.1h9.6a2 2 0 0 1 1.8 1.1L39 21Z" />
      <rect x="12" y="20" width="36" height="26" rx="6" />
      <circle className="ink" cx="30" cy="33" r="9" />
      <circle className="soft" cx="30" cy="33" r="5.5" />
      <circle cx="32.5" cy="30.5" r="1.4" />
      <circle className="ink" cx="41.5" cy="26.5" r="1.7" />
    </>
  ),
  bag: (
    <>
      <path className="st" d="M23 28v-7a7 7 0 0 1 14 0v7" />
      <rect x="16" y="22" width="28" height="25" rx="4.5" />
      <circle className="ink" cx="23" cy="28" r="2" />
      <circle className="ink" cx="37" cy="28" r="2" />
    </>
  ),
  drop: (
    <>
      <path d="M30 11.5C30 11.5 43.5 25.5 43.5 35a13.5 13.5 0 0 1-27 0C16.5 25.5 30 11.5 30 11.5Z" />
      <path className="st mid c-soft" d="M23 35.5a7 7 0 0 0 7 7" />
    </>
  ),
  server: (
    <>
      <rect x="13" y="15" width="34" height="14" rx="4.5" />
      <rect className="soft" x="13" y="31" width="34" height="14" rx="4.5" />
      <circle className="ink" cx="20.5" cy="22" r="2.2" />
      <rect className="ink" x="27" y="20.8" width="13" height="2.4" rx="1.2" />
      <circle className="ink" cx="20.5" cy="38" r="2.2" />
      <rect className="ink" x="27" y="36.8" width="13" height="2.4" rx="1.2" />
    </>
  ),
  code: (
    <>
      <path className="st" d="m23 21-9 9 9 9M37 21l9 9-9 9" />
      <path className="st c-soft" d="m33 17-6 26" />
    </>
  ),
  database: (
    <>
      <path d="M16 35v8a14 5 0 0 0 28 0v-8a14 5 0 0 0-28 0Z" stroke="var(--accent)" strokeWidth="2.2" />
      <path d="M16 25v8a14 5 0 0 0 28 0v-8a14 5 0 0 0-28 0Z" stroke="var(--accent)" strokeWidth="2.2" />
      <path d="M16 15v8a14 5 0 0 0 28 0v-8a14 5 0 0 0-28 0Z" stroke="var(--accent)" strokeWidth="2.2" />
      <ellipse className="soft" cx="30" cy="15" rx="12" ry="3.2" />
    </>
  ),
  calendar: (
    <>
      <rect x="13" y="16" width="34" height="31" rx="5" />
      <path className="shade" d="M13 21a5 5 0 0 1 5-5h24a5 5 0 0 1 5 5v4H13Z" />
      <rect x="20" y="12" width="4" height="9" rx="2" />
      <rect x="36" y="12" width="4" height="9" rx="2" />
      <circle className="ink" cx="22.5" cy="34" r="2.1" />
      <circle className="ink" cx="30" cy="34" r="2.1" />
      <circle className="ink" cx="37.5" cy="34" r="2.1" />
      <circle className="ink" cx="22.5" cy="41" r="2.1" />
      <circle className="ink" cx="30" cy="41" r="2.1" />
    </>
  ),
  folder: (
    <>
      <path className="soft" d="M12 20a4 4 0 0 1 4-4h8l4 4.5H44a4 4 0 0 1 4 4V42a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4Z" />
      <rect x="12" y="25" width="36" height="21" rx="4" />
    </>
  ),
  link: (
    <g transform="rotate(-45 30 30)">
      <rect className="st" x="10" y="23.5" width="22" height="13" rx="6.5" />
      <rect className="st c-soft" x="28" y="23.5" width="22" height="13" rx="6.5" />
    </g>
  ),
  terminal: (
    <>
      <rect className="shade" x="11" y="14" width="38" height="32" rx="7" />
      <path className="st mid" d="m20.5 25 7 6-7 6" />
      <rect x="31.5" y="35.5" width="9.5" height="3.6" rx="1.8" />
    </>
  ),
  dashboard: (
    <>
      <rect x="14" y="14" width="14" height="20" rx="3.5" />
      <rect className="soft" x="32" y="14" width="14" height="12" rx="3.5" />
      <rect className="soft" x="14" y="37" width="14" height="9" rx="3.5" />
      <rect x="32" y="29" width="14" height="17" rx="3.5" />
    </>
  ),
  document: (
    <>
      <path d="M19 12h14l10 10v22a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3Z" />
      <path className="soft" d="M33 12v8a2 2 0 0 0 2 2h8Z" />
      <rect className="ink" x="21" y="28" width="18" height="2.8" rx="1.4" />
      <rect className="ink" x="21" y="34" width="18" height="2.8" rx="1.4" />
      <rect className="ink" x="21" y="40" width="10" height="2.8" rx="1.4" />
    </>
  ),
  chat: (
    <>
      <path d="M16 15h28a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H30l-9 7v-7h-5a5 5 0 0 1-5-5V20a5 5 0 0 1 5-5Z" />
      <circle className="ink" cx="22" cy="28" r="2.3" />
      <circle className="ink" cx="30" cy="28" r="2.3" />
      <circle className="ink" cx="38" cy="28" r="2.3" />
    </>
  ),
};

export default function AppGlyph({ name, ...props }: Props) {
  return (
    <svg className="glyph" viewBox="0 0 60 60" aria-hidden="true" {...props}>
      {icons[name]}
    </svg>
  );
}
