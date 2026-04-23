/**
 * Notification stub. Logs new orders to stdout so the shop owner can
 * watch the terminal during dev. Swap in Resend / Telegram / SMTP here
 * when you have credentials — each block is guarded behind an env check.
 */

type OrderPayload = {
  id: string;
  customerName: string;
  phone: string;
  email?: string | null;
  address: string;
  note?: string | null;
  total: number;
  items: Array<{ productName: string; qty: number; price: number }>;
};

export async function notifyNewOrder(order: OrderPayload) {
  const address = order.address.split('\n').map((l) => l.trim()).filter(Boolean).join(', ');
  const placedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const lines = [
    '',
    '======================================',
    `NEW ORDER  ·  #${order.id.slice(-6).toUpperCase()}  ·  ${placedAt}`,
    '======================================',
    `Customer: ${order.customerName}`,
    `Phone:    ${order.phone}`,
    order.email ? `Email:    ${order.email}` : null,
    `Address:  ${address}`,
    order.note ? `Note:     ${order.note}` : null,
    '',
    'Items:',
    ...order.items.map(
      (i) => `  - ${i.qty} x ${i.productName.padEnd(32)} $${(i.price * i.qty).toFixed(2)}`
    ),
    '',
    `TOTAL:    $${order.total.toFixed(2)}`,
    '======================================',
    '',
  ].filter(Boolean);

  console.log(lines.join('\n'));

  // --- Plug in real providers below when env vars are present ---

  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_TO) {
    // Example: await sendResendEmail({ to: process.env.NOTIFY_EMAIL_TO, ... });
    console.log('[notify] (RESEND_API_KEY set — hook up lib/notify.ts sender here)');
  }

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    // Example: await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { ... });
    console.log('[notify] (TELEGRAM_BOT_TOKEN set — hook up lib/notify.ts sender here)');
  }
}
