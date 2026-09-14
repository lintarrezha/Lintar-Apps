export type AppCategory = 'Productivity' | 'Data' | 'Web' | 'Tools';

export type AppIconName = 'dashboard' | 'document' | 'receipt' | 'chart' | 'bag' | 'camera' | 'cake' | 'drop' | 'server' | 'globe' | 'code' | 'database' | 'calendar' | 'folder' | 'link' | 'terminal';

export type AppItem = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  url: string;
  platform: string;
  category: AppCategory;
  icon: AppIconName;
  accent: string;
  iconUrl?: string;
  favorite?: boolean;
};

export const apps: AppItem[] = [
  {
    id: 'invoice-system',
    name: 'Invoice System (Apps Script)',
    shortName: 'Invoice',
    description: 'Kelola transaksi, invoice, dan rekap harian.',
    url: 'https://script.google.com/macros/s/AKfycbySgTIbRf70w2a-C1aatFOBYH9wUICX0Rtqt7SjRD2BWn7-ofLc8N0M6uHpWSylAjJa/exec',
    platform: 'Apps Script',
    category: 'Productivity',
    icon: 'receipt',
    accent: '#0A84FF',
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
    accent: '#30B477',
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
    icon: 'server',
    accent: '#5E5CE6',
  },
  {
    id: 'personal-vault',
    name: 'Personal Vault',
    shortName: 'Personal Vault',
    description: 'Penyimpanan data pribadi yang aman.',
    url: 'https://lintar-digiva.vercel.app/',
    platform: 'Vercel',
    category: 'Web',
    icon: 'folder',
    accent: '#FF453A',
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
    accent: '#FF4F93',
    favorite: true,
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    shortName: 'QR Generator',
    description: 'Generator kode QR untuk berbagai keperluan.',
    url: 'https://lintar-qr-generator.vercel.app/',
    platform: 'Web App',
    category: 'Web',
    icon: 'link',
    accent: '#32ADE6',
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
  //   accent: '#FF9F0A',
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
  //   accent: '#5E5CE6',
  // },
];
