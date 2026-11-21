export type AppCategory = 'Productivity' | 'Data' | 'Web' | 'Tools' | 'Drive';

export type AppIconName = 'dashboard' | 'document' | 'receipt' | 'chart' | 'bag' | 'camera' | 'cake' | 'drop' | 'server' | 'globe' | 'code' | 'database' | 'calendar' | 'folder' | 'link' | 'terminal' | 'home' | 'lock' | 'qr' | 'chat' | 'drive' | 'sheet' | 'mail' | 'photo' | 'bookmark';

export const appCategories: AppCategory[] = ['Productivity', 'Data', 'Web', 'Tools', 'Drive'];

export const appIconNames: AppIconName[] = ['dashboard', 'document', 'receipt', 'chart', 'bag', 'camera', 'cake', 'drop', 'server', 'globe', 'code', 'database', 'calendar', 'folder', 'link', 'terminal', 'home', 'lock', 'qr', 'chat', 'drive', 'sheet', 'mail', 'photo', 'bookmark'];

export type AppItem = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  url: string;
  platform: string;
  /** Opsional. Dipakai untuk mengelompokkan shortcut Drive per akun Google. */
  account?: string;
  category: AppCategory;
  icon: AppIconName;
  accent: string;
  iconUrl?: string;
  favorite?: boolean;
};

export const apps: AppItem[] = [
  {
    id: 'invoice-system',
    name: 'Invoice System',
    shortName: 'Invoice',
    description: 'Kelola transaksi, invoice, dan rekap harian.',
    url: 'https://script.google.com/macros/s/AKfycbySgTIbRf70w2a-C1aatFOBYH9wUICX0Rtqt7SjRD2BWn7-ofLc8N0M6uHpWSylAjJa/exec',
    platform: 'Apps Script',
    category: 'Productivity',
    icon: 'receipt',
    accent: '#007AFF',
    favorite: true,
  },
  {
    id: 'data-portfolio',
    name: 'Data Analyst Portfolio',
    shortName: 'Data Portfolio',
    description: 'Portfolio analisis data, dashboard, dan visualisasi.',
    url: 'https://lintar-dataanalyst.vercel.app',
    platform: 'Vercel',
    category: 'Data',
    icon: 'chart',
    accent: '#34C759',
    favorite: true,
  },
  {
    id: 'main-portfolio',
    name: 'Main Portfolio',
    shortName: 'Main Portfolio',
    description: 'General portfolio dengan berbagai proyek dan pengalaman.',
    url: 'https://lintarrezha.vercel.app',
    platform: 'Vercel',
    category: 'Web',
    icon: 'globe',
    accent: '#5856D6',
    favorite: true,
  },
  {
    id: 'personal-vault',
    name: 'Personal Vault',
    shortName: 'Personal Vault',
    description: 'Penyimpanan data pribadi yang aman.',
    url: 'https://lintar-digiva.vercel.app/',
    platform: 'Vercel',
    category: 'Web',
    icon: 'lock',
    accent: '#48484A',
    favorite: false,
  },
  {
    id: 'homie-space',
    name: 'Homie Space',
    shortName: 'Homie Space',
    description: 'Ruang untuk berbagi ide dan kolaborasi.',
    url: 'https://homie-space.vercel.app/',
    platform: 'Vercel',
    category: 'Web',
    icon: 'home',
    accent: '#FF9500',
    favorite: false,
  },
  {
    id: 'birthday-gift',
    name: 'Birthday Gift Website',
    shortName: 'Birthday Gift',
    description: 'Website ucapan ulang tahun interaktif.',
    url: 'https://lrbirthday-website.vercel.app',
    platform: 'Vercel',
    category: 'Web',
    icon: 'cake',
    accent: '#FF2D55',
    favorite: false,
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    shortName: 'QR Generator',
    description: 'Generator kode QR untuk berbagai keperluan.',
    url: 'https://lintar-qr-generator.vercel.app/',
    platform: 'Web App',
    category: 'Web',
    icon: 'qr',
    accent: '#32ADE6',
    favorite: false,
  },
  // {
  //   id: 'ikm-dashboard',
  //   name: 'IKM Dashboard',
  //   shortName: 'IKM Dashboard',
  //   description: 'Visualisasi hasil survei kepuasan dan IKM.',
  //   url: '#',
  //   platform: 'Dashboard',
  //   category: 'Data',
  //   icon: 'dashboard',
  //   accent: '#FF9500',
  // },
  // {
  //   id: 'server-checklist',
  //   name: 'Server Checklist',
  //   shortName: 'Server Check',
  //   description: 'Checklist monitoring server dan laboratorium.',
  //   url: '#',
  //   platform: 'Google',
  //   category: 'Productivity',
  //   icon: 'server',
  //   accent: '#5856D6',
  // },
];
