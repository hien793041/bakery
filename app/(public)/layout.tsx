import '@/styles/website.css';
import { CartProvider } from '@/components/public/CartContext';
import { CartDrawer, Toast } from '@/components/public/CartDrawer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="mira-app">
        {children}
        <CartDrawer />
        <Toast />
      </div>
    </CartProvider>
  );
}
