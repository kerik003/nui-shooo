import { loadProducts } from '../../../lib/supabase';
import { productName, productThumb } from '../../../lib/data';
import ProductDetailClient from '../../../components/ProductDetailClient';

// генерируем <title>, описание и картинку для соцсетей на основе данных товара —
// это то, что видит Google в поиске и что показывается при репосте ссылки
export async function generateMetadata({ params }) {
  const products = await loadProducts();
  const product = products.find((p) => String(p.id) === String(params.id));

  if (!product) {
    return { title: 'Товар не знайдено — nui.shooo' };
  }

  const name = productName(product);
  const description = product.description
    ? product.description.slice(0, 160)
    : `Купити ${name} за ${product.price} ₴ в nui.shooo з доставкою Новою поштою по всій Україні.`;
  const thumb = productThumb(product);

  return {
    title: `${name} — ${product.price} ₴ | nui.shooo`,
    description,
    openGraph: {
      title: name,
      description,
      images: thumb ? [thumb] : undefined,
      type: 'website',
    },
  };
}

// подсказываем Next.js заранее собрать страницы для всех текущих товаров (лучше для SEO и скорости),
// но новые/ещё не собранные id всё равно отрендерятся по запросу
export async function generateStaticParams() {
  try {
    const products = await loadProducts();
    return products.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

export default function ProductPage() {
  return <ProductDetailClient />;
}
