import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { notifyNewOrder } from '@/lib/notify';

const OrderSchema = z.object({
  customerName: z.string().min(1).max(100),
  phone: z.string().min(5).max(30),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(1).max(500),
  note: z.string().max(500).optional().or(z.literal('')),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().positive().max(99),
      })
    )
    .min(1)
    .max(30),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = OrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid order', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const missing = input.items.filter((i) => !byId.has(i.productId));
  if (missing.length) {
    return NextResponse.json({ error: 'Some products are no longer available' }, { status: 400 });
  }
  const unavailable = input.items.find((i) => !byId.get(i.productId)!.available);
  if (unavailable) {
    return NextResponse.json(
      { error: `"${byId.get(unavailable.productId)!.name}" is sold out` },
      { status: 400 }
    );
  }

  const orderItems = input.items.map((i) => {
    const p = byId.get(i.productId)!;
    return {
      productId: p.id,
      productName: p.name,
      price: p.price,
      qty: i.qty,
    };
  });
  const total = orderItems.reduce((s, it) => s + it.price * it.qty, 0);

  const order = await prisma.order.create({
    data: {
      customerName: input.customerName.trim(),
      phone: input.phone.trim(),
      email: input.email ? input.email.trim() : null,
      address: input.address.trim(),
      note: input.note ? input.note.trim() : null,
      total,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  await notifyNewOrder({
    id: order.id,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    address: order.address,
    note: order.note,
    total: order.total,
    items: order.items.map((i) => ({ productName: i.productName, qty: i.qty, price: i.price })),
  }).catch((err) => console.error('[notify] failed:', err));

  return NextResponse.json({ ok: true, orderId: order.id });
}
