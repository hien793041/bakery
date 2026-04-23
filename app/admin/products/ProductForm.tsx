'use client';

import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import type { Product, Category } from '@prisma/client';
import { createProductAction, updateProductAction } from '../actions';
import { parseIngredients } from '@/lib/types';

const DISC_COLORS = [
  { value: 'var(--pink-100)', label: 'Pink 100 (blush)' },
  { value: 'var(--pink-200)', label: 'Pink 200 (signature)' },
  { value: 'var(--pink-300)', label: 'Pink 300 (deep)' },
  { value: 'var(--cream-200)', label: 'Cream 200' },
  { value: 'var(--cream-300)', label: 'Cream 300' },
];
const DEFAULT_IMAGES = [
  '/assets/illustrations/cake-hero.svg',
  '/assets/illustrations/cupcake.svg',
  '/assets/illustrations/croissant.svg',
  '/assets/illustrations/macaron.svg',
  '/assets/illustrations/tart.svg',
  '/assets/illustrations/tiramisu.svg',
];

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState(product?.image ?? DEFAULT_IMAGES[0]);
  const [discColor, setDiscColor] = useState(product?.discColor ?? DISC_COLORS[1].value);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaults = product
    ? {
        ...product,
        ingredients: parseIngredients(product.ingredients).join(', '),
        badge: product.badge ?? '',
        description: product.description ?? '',
      }
    : {
        name: '',
        slug: '',
        categoryId: categories[0]?.id ?? '',
        price: 0,
        description: '',
        ingredients: '',
        badge: '',
        rating: 4.8,
        reviews: 0,
        available: true,
      };

  async function handleUpload(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setImage(data.url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(formData: FormData) {
    setError(null);
    // Force the hidden inputs to reflect current state
    formData.set('image', image);
    formData.set('discColor', discColor);
    startTransition(async () => {
      try {
        if (product) {
          const res = await updateProductAction(product.id, formData);
          if (res && 'error' in res && res.error) setError(res.error as string);
        } else {
          const res = await createProductAction(formData);
          if (res && 'error' in res && res.error) setError(res.error as string);
        }
      } catch {
        // redirect throws — ignore
      }
    });
  }

  if (categories.length === 0) {
    return (
      <p className="admin-error">
        No categories yet. <Link href="/admin/categories/new">Create one first →</Link>
      </p>
    );
  }

  return (
    <form action={onSubmit} className="admin-form">
      <div className="admin-form__row">
        <label>
          Name
          <input name="name" required defaultValue={defaults.name} />
        </label>
        <label>
          Slug <span className="admin-form__hint">(url-friendly, unique)</span>
          <input name="slug" defaultValue={defaults.slug} placeholder="auto from name" />
        </label>
      </div>

      <div className="admin-form__row">
        <label>
          Category
          <select name="categoryId" defaultValue={defaults.categoryId} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price (USD)
          <input name="price" type="number" step="0.01" min="0" required defaultValue={defaults.price} />
        </label>
      </div>

      <label>
        Ingredients <span className="admin-form__hint">(comma- or newline-separated)</span>
        <textarea name="ingredients" defaultValue={defaults.ingredients} placeholder="Strawberry, Fresh cream, French butter" />
      </label>

      <label>
        Description
        <textarea name="description" defaultValue={defaults.description} />
      </label>

      {/* --- Image picker: upload + preview + fallback defaults --- */}
      <div>
        <label style={{ marginBottom: 8 }}>
          Image
        </label>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            className="admin-thumb"
            style={{ width: 80, height: 80, background: discColor }}
            aria-label="Preview"
          >
            <img src={image} alt="" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Uploading…' : 'Upload image'}
              </button>
              <details style={{ alignSelf: 'center' }}>
                <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--fg-muted)' }}>
                  or pick a default
                </summary>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {DEFAULT_IMAGES.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setImage(url)}
                      title={url.split('/').pop()}
                      style={{
                        padding: 2,
                        borderRadius: '50%',
                        border: url === image ? '2px solid var(--terra-500)' : '1px solid var(--hairline)',
                        background: 'var(--pink-200)',
                        cursor: 'pointer',
                      }}
                    >
                      <img src={url} alt="" width={40} height={40} />
                    </button>
                  ))}
                </div>
              </details>
            </div>
            <small style={{ color: 'var(--fg-muted)', fontSize: 12 }}>
              PNG, JPG, WebP, GIF or SVG · max 5 MB
            </small>
            {uploadError && <p className="admin-error" style={{ margin: 0 }}>{uploadError}</p>}
            <code style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{image}</code>
          </div>
        </div>
        <input type="hidden" name="image" value={image} />
      </div>

      <label>
        Disc background color
        <select
          name="discColor"
          value={discColor}
          onChange={(e) => setDiscColor(e.target.value)}
        >
          {DISC_COLORS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <div className="admin-form__row">
        <label>
          Badge <span className="admin-form__hint">(optional: "new", "hot"…)</span>
          <input name="badge" defaultValue={defaults.badge} />
        </label>
        <label>
          Rating
          <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={defaults.rating} />
        </label>
      </div>

      <div className="admin-form__row">
        <label>
          Reviews
          <input name="reviews" type="number" min="0" defaultValue={defaults.reviews} />
        </label>
        <label style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 24 }}>
          <input name="available" type="checkbox" defaultChecked={defaults.available} />
          Available on the storefront
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form__foot">
        <button className="admin-btn admin-btn--primary admin-btn--lg" type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : product ? 'Save changes' : 'Create pastry'}
        </button>
        <Link className="mira-link" href="/admin/products">
          Cancel
        </Link>
      </div>
    </form>
  );
}
