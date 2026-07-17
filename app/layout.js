import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import { ModalProvider } from '../context/ModalContext';
import SiteChrome from '../components/SiteChrome';

// базовый адрес сайта — нужен, чтобы ссылки в мета-тегах (og:image и т.п.) были полными.
// Впишите в Vercel переменную окружения NEXT_PUBLIC_SITE_URL, как только определитесь с доменом.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nui-shooo.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'nui.shooo — магазин аксесуарів',
    template: '%s | nui.shooo',
  },
  description: 'nui.shooo — магазин аксесуарів: шапки, кепки, сумки, рукавички, ремені, гаманці, рюкзаки, брелоки, шкарпетки та шопери. Швидке замовлення з доставкою Новою поштою по всій Україні.',
  keywords: ['аксесуари', 'шапки', 'кепки', 'сумки', 'рюкзаки', 'nui.shooo', 'магазин аксесуарів Україна'],
  openGraph: {
    title: 'nui.shooo — магазин аксесуарів',
    description: 'Шапки, кепки, сумки, рукавички, ремені, гаманці, рюкзаки, брелоки, шкарпетки та шопери з доставкою Новою поштою.',
    type: 'website',
    url: SITE_URL,
    images: ['/assets/logo.png'],
  },
  // после подтверждения сайта в Google Search Console вставьте сюда код verification
  // (Search Console покажет строку вида "abcdef123..." — её и нужно вписать ниже)
  // verification: { google: 'ВАШ_КОД_ИЗ_SEARCH_CONSOLE' },
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
