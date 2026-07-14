import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import { ModalProvider } from '../context/ModalContext';
import SiteChrome from '../components/SiteChrome';

export const metadata = {
  title: 'nui.shooo — магазин аксессуаров',
  description: 'nui.shooo — магазин аксессуаров: шапки, кепки, сумки, перчатки, ремни, кошельки, рюкзаки, брелки, носки и шоперы. Быстрый и удобный заказ с доставкой Новой почтой по всей Украине.',
  openGraph: {
    title: 'nui.shooo — магазин аксессуаров',
    description: 'Шапки, кепки, сумки, перчатки, ремни, кошельки, рюкзаки, брелки, носки и шоперы с доставкой Новой почтой.',
    type: 'website',
    images: ['/assets/logo.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <ModalProvider>
            <SiteChrome>{children}</SiteChrome>
          </ModalProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
