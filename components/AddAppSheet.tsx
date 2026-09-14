'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import AppGlyph from '@/components/AppGlyph';
import type { AppCategory, AppIconName, AppItem } from '@/data/apps';

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (app: AppItem) => void;
};

type FormState = {
  name: string;
  url: string;
  platform: string;
  category: AppCategory;
  icon: AppIconName;
  accent: string;
  iconUrl: string;
  favorite: boolean;
};

const categories: AppCategory[] = ['Productivity', 'Data', 'Web', 'Tools'];

const iconOptions: { value: AppIconName; label: string }[] = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'document', label: 'Document' },
  { value: 'receipt', label: 'Receipt' },
  { value: 'chart', label: 'Analytics' },
  { value: 'bag', label: 'Store' },
  { value: 'camera', label: 'Camera' },
  { value: 'cake', label: 'Gift' },
  { value: 'drop', label: 'Drop' },
  { value: 'server', label: 'Server' },
  { value: 'globe', label: 'Website' },
  { value: 'code', label: 'Code' },
  { value: 'database', label: 'Database' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'folder', label: 'Folder' },
  { value: 'link', label: 'Link' },
  { value: 'terminal', label: 'Terminal' },
];

const accentOptions = ['#0A84FF', '#5E5CE6', '#BF5AF2', '#FF4F93', '#FF453A', '#FF9F0A', '#30B477', '#32ADE6'];

const initialState: FormState = {
  name: '',
  url: '',
  platform: 'Vercel',
  category: 'Web',
  icon: 'dashboard',
  accent: '#0A84FF',
  iconUrl: '',
  favorite: false,
};

function createId(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${slug || 'app'}-${Date.now().toString(36)}`;
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('File tidak dapat dibaca.'));
    reader.readAsDataURL(file);
  });
}

function resizeRasterIcon(file: File) {
  return new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      try {
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - sourceSize) / 2;
        const sourceY = (image.naturalHeight - sourceSize) / 2;
        const outputSize = 192;
        const canvas = document.createElement('canvas');
        canvas.width = outputSize;
        canvas.height = outputSize;

        const context = canvas.getContext('2d');
        if (!context) throw new Error('Browser tidak dapat memproses gambar.');

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, outputSize, outputSize);

        const result = canvas.toDataURL('image/webp', 0.9);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Format gambar tidak dapat diproses.'));
    };

    image.src = objectUrl;
  });
}

async function prepareCustomIcon(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const isSvg = file.type === 'image/svg+xml' || extension === 'svg';
  const isRaster = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || ['png', 'jpg', 'jpeg', 'webp'].includes(extension ?? '');

  if (!isSvg && !isRaster) {
    throw new Error('Gunakan file PNG, JPG, WEBP, atau SVG.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran icon maksimal 5 MB.');
  }

  if (isSvg) {
    if (file.size > 1024 * 1024) {
      throw new Error('Untuk SVG, gunakan file di bawah 1 MB.');
    }
    return readFileAsDataUrl(file);
  }

  return resizeRasterIcon(file);
}

export default function AddAppSheet({ open, onClose, onAdd }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState('');
  const [isProcessingIcon, setIsProcessingIcon] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = useMemo(() => form.name.trim().length > 0 && form.url.trim().length > 0 && !isProcessingIcon, [form.name, form.url, isProcessingIcon]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setForm(initialState);
      setError('');
      setIsProcessingIcon(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleCustomIcon(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    setError('');
    setIsProcessingIcon(true);

    try {
      const iconUrl = await prepareCustomIcon(file);
      setForm((current) => ({ ...current, iconUrl }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Icon tidak dapat diproses.');
    } finally {
      setIsProcessingIcon(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    const url = form.url.trim();

    if (!name || !url) {
      setError('Nama aplikasi dan URL wajib diisi.');
      return;
    }

    if (!isValidHttpUrl(url)) {
      setError('Masukkan URL lengkap yang diawali http:// atau https://');
      return;
    }

    onAdd({
      id: createId(name),
      name,
      shortName: name,
      description: '',
      url,
      platform: form.platform.trim() || 'Web App',
      category: form.category,
      icon: form.icon,
      accent: form.accent,
      iconUrl: form.iconUrl || undefined,
      favorite: form.favorite,
    });

    onClose();
  }

  const hasCustomIcon = Boolean(form.iconUrl);

  return (
    <div className="sheet-layer" role="presentation">
      <button className="sheet-backdrop" type="button" aria-label="Tutup form" onClick={onClose} />

      <section className="add-app-sheet" role="dialog" aria-modal="true" aria-labelledby="add-app-title">
        <div className="sheet-grabber" aria-hidden="true" />

        <div className="sheet-header">
          <button type="button" className="sheet-text-button" onClick={onClose}>
            Cancel
          </button>
          <h2 id="add-app-title">Add App</h2>
          <button type="submit" form="add-app-form" className="sheet-text-button sheet-text-button-primary" disabled={!canSubmit}>
            Add
          </button>
        </div>

        <form id="add-app-form" className="add-app-form" onSubmit={handleSubmit}>
          <div className="new-app-preview" aria-label="Preview icon aplikasi">
            <span className={`new-app-preview-icon ${hasCustomIcon ? 'has-custom-image' : ''}`} style={{ backgroundColor: hasCustomIcon ? '#ffffff' : form.accent }}>
              {form.iconUrl ? <img className="app-icon-image" src={form.iconUrl} alt="" /> : <AppGlyph name={form.icon} />}
            </span>
            <div>
              <strong>{form.name.trim() || 'New Application'}</strong>
              <span>{form.platform.trim() || 'Web App'}</span>
            </div>
          </div>

          <div className="settings-group">
            <label className="settings-row settings-row-input">
              <span>Name</span>
              <input
                autoFocus
                value={form.name}
                onChange={(event) => {
                  setForm((current) => ({ ...current, name: event.target.value }));
                  setError('');
                }}
                placeholder="My Application"
                maxLength={40}
              />
            </label>

            <label className="settings-row settings-row-input">
              <span>URL</span>
              <input
                type="url"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                value={form.url}
                onChange={(event) => {
                  setForm((current) => ({ ...current, url: event.target.value }));
                  setError('');
                }}
                placeholder="https://..."
              />
            </label>

            <label className="settings-row settings-row-input">
              <span>Platform</span>
              <input list="platform-options" value={form.platform} onChange={(event) => setForm((current) => ({ ...current, platform: event.target.value }))} placeholder="Vercel" maxLength={24} />
              <datalist id="platform-options">
                <option value="Vercel" />
                <option value="Apps Script" />
                <option value="Web App" />
                <option value="Dashboard" />
                <option value="Google" />
                <option value="Python" />
              </datalist>
            </label>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-section">
            <span className="form-section-label">Category</span>
            <div className="category-picker" role="radiogroup" aria-label="Kategori aplikasi">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-option ${form.category === category ? 'is-selected' : ''}`}
                  role="radio"
                  aria-checked={form.category === category}
                  onClick={() => setForm((current) => ({ ...current, category }))}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <span className="form-section-label">App Icon</span>

            <div className="custom-icon-card">
              <button type="button" className={`custom-icon-upload ${hasCustomIcon ? 'is-selected' : ''}`} onClick={() => fileInputRef.current?.click()}>
                <span className={`custom-icon-thumbnail ${hasCustomIcon ? 'has-image' : ''}`}>
                  {form.iconUrl ? (
                    <img src={form.iconUrl} alt="" />
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  )}
                </span>
                <span className="custom-icon-copy">
                  <strong>{hasCustomIcon ? 'Custom icon selected' : 'Custom App Icon'}</strong>
                  <small>{isProcessingIcon ? 'Processing image…' : 'PNG, JPG, WEBP or SVG'}</small>
                </span>
                <span className="custom-icon-action">{hasCustomIcon ? 'Change' : 'Choose'}</span>
              </button>

              {hasCustomIcon && (
                <button type="button" className="custom-icon-remove" onClick={() => setForm((current) => ({ ...current, iconUrl: '' }))}>
                  Remove
                </button>
              )}
            </div>

            <input ref={fileInputRef} className="visually-hidden-file" type="file" accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleCustomIcon} />

            <div className="picker-divider" aria-hidden="true">
              <span>or choose a symbol</span>
            </div>

            <div className="icon-picker" role="radiogroup" aria-label="Icon aplikasi">
              {iconOptions.map((option) => {
                const selected = !hasCustomIcon && form.icon === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={option.label}
                    title={option.label}
                    className={`icon-option ${selected ? 'is-selected' : ''}`}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        icon: option.value,
                        iconUrl: '',
                      }))
                    }
                  >
                    <span>
                      <AppGlyph name={option.value} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {!hasCustomIcon && (
            <div className="form-section">
              <span className="form-section-label">Icon Color</span>
              <div className="color-picker" role="radiogroup" aria-label="Warna icon">
                {accentOptions.map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    role="radio"
                    aria-label={`Pilih warna ${accent}`}
                    aria-checked={form.accent === accent}
                    className={`color-option ${form.accent === accent ? 'is-selected' : ''}`}
                    style={{ backgroundColor: accent }}
                    onClick={() => setForm((current) => ({ ...current, accent }))}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="settings-group">
            <label className="settings-row settings-row-toggle">
              <span>
                <strong>Favorite</strong>
                <small>Show in Quick access</small>
              </span>
              <input type="checkbox" checked={form.favorite} onChange={(event) => setForm((current) => ({ ...current, favorite: event.target.checked }))} />
              <span className="ios-switch" aria-hidden="true" />
            </label>
          </div>
        </form>
      </section>
    </div>
  );
}
