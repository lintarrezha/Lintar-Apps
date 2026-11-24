// Tipe dan konstanta yang aman diimpor komponen client. Jangan taruh data aplikasi di file ini.

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
  /** 'private' = hanya dikirim ke browser setelah Owner sign-in. Default: public. */
  visibility?: 'public' | 'private';
};
