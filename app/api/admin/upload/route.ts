import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import { put } from '@vercel/blob';
import { getCurrentAdmin } from '@/lib/auth';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const EXT_BY_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file received' }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type (${file.type || 'unknown'})` },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File is larger than 5 MB' }, { status: 400 });
  }

  const ext = EXT_BY_MIME[file.type] || path.extname(file.name).toLowerCase() || '.bin';
  const token = randomBytes(8).toString('hex');
  const filename = `${Date.now()}-${token}${ext}`;

  // Production / Vercel: upload to Vercel Blob (requires BLOB_READ_WRITE_TOKEN)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`products/${filename}`, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local dev fallback: write to public/uploads/
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  const filepath = path.join(uploadsDir, filename);

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, bytes);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
