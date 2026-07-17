import { loadProducts } from '../lib/supabase';

// адрес сайта — впишите в переменную окружения NEXT_PUBLIC_SITE_URL на Vercel,
// как только будет известен финальный домен (например https://nui-shooo.vercel.app
// или ваш собственный домен, если подключите его)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nui-shooo.vercel.app';

export default async function sitemap() {
  const staticPages = ['', '/about', '/cart', '/favorites'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  let productPages = [];
  try {
    const products = await loadProducts();
    productPages = products.map((p) => ({
      url: `${SITE_URL}/product/${p.id}`,
      lastModified: new Date(),
    }));
  } catch {
    productPages = [];
  }

  return [...staticPages, ...productPages];
}
